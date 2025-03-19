import { Request, Response } from 'express';
import { orderService } from '../services/order.service';
import { RequestWithAuth } from '../types/Global.type';
import { userService } from '../services/user.service';
import webSocketService from '../services/webSocket.service';
import { redisService } from '../services/redis.service';
import { stripeService } from '../services/stripe.service';
import { orderQueue } from '../services/queue.service';
import { pushNotificationService } from '../services/pushNotification.service';
import { deliveryDriverService } from '../services/deliveryDriver.service';

export const orderController = {
  getOrdersByRestaurant: async (req: Request, res: Response) => {
    try {
      const businessId = req.headers['x-business-id'];
      if (!businessId) throw new Error('Business Id is required');
      const orders = await orderService.findByRestaurantId(Number(businessId as string));
      res.json(orders);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
  getAllOrders: async (req: RequestWithAuth, res: Response) => {
    try {
      const { userId } = req.auth!;
      const userFound = await userService.getUserByClerkId(userId);
      if (!userFound?.id) throw new Error('User not found');

      const orders = await orderService.findAll(userFound.id);
      res.json(orders);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
  getOrderById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) throw new Error('Id is required');
      const order = await orderService.findById({ id: Number(id), includeRelations: { restaurants: true, delivery_drivers: true, order_items: { include: { products: true } } } });
      res.json(order);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
  getOrderByPaymentIntent: async (req: Request, res: Response) => {
    try {
      const { paymentIntent } = req.body;
      if (!paymentIntent) throw new Error('Payment Intent is required');
      const order = await orderService.findByPaymentIntentId(paymentIntent);
      res.json(order);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
  updateOrder: async (req: Request, res: Response) => {
    try {
      const { id, ...rest } = req.body;

      if (!id) throw new Error('Id is required');
      const foundOrder = await orderService.findById({ id: Number(id), includeRelations: { restaurants: true, users: true } });

      const updatedOrder = await orderService.updateOne(id, rest);

      if (rest.status) {
        await webSocketService.emitToRoom('message', `order_${updatedOrder.id}`, { type: 'order_status_change', payload: { status: rest.status } });
        switch (rest.status) {
          case 'preparing':
            await redisService.zrem('delayedOrders', `${updatedOrder.id}`);
            await pushNotificationService.send(
              foundOrder.users.tokens,
              '🔔 Acutalización de Orden',
              '🥳 Tu orden está siendo preparada'
            );
            break;
          case 'cancelled_by_restaurant':
            await redisService.zrem("delayedOrders", `${id}`);
            await pushNotificationService.send(
              foundOrder.users.tokens,
              '🔔 Acutalización de Orden',
              '❌ Tu orden ha sido cancelada'
            );
            await stripeService.refundPayment({ paymentIntentId: updatedOrder.payment_intent_id });
            break;
          case 'ready_for_pickup':
            await orderQueue.add('assignDelivery', { orderId: updatedOrder.id });
            await pushNotificationService.send(
              foundOrder.users.tokens,
              '🔔 Acutalización de Orden',
              '🏍️ Tu orden está lista para ser recogida'
            );
            break;
          case 'delivered':
          case 'cancelled_by_delivery':
          case 'cancelled_by_user':
            await redisService.del(`order_locked:${id}`);
            const currentOrders = await redisService.decr(`driver_orders:${updatedOrder.driver_id}`);
            if (!currentOrders || currentOrders <= 0) {
              await redisService.del(`driver_orders:${updatedOrder.driver_id}`);
              await redisService.del(`driver_window_expired:${updatedOrder.driver_id}`);
            }
            break;
          case 'restaurant_delayed':
            await redisService.zrem("delayedOrders", `${id}`);
            await webSocketService.emitToRoom('message', `business_${foundOrder.restaurants.id}`, { type: 'order_status_change', payload: { status: rest.status, orderId: id } });
            await pushNotificationService.send(
              foundOrder.users.tokens,
              '🔔 Acutalización de Orden',
              '⏰ Tu orden tiene un retraso por parte del restaurante'
            );
            break;
          default:
            break;
        }
      }

      res.json(updatedOrder);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
  acceptOrder: async (req: RequestWithAuth, res: Response) => {
    try {
      const { id } = req.body;

      const { userId } = req.auth!;

      const driverFound = await deliveryDriverService.getUserByClerkId(userId);
      const delivery_driver = driverFound?.id;

      if (!id || !delivery_driver) throw new Error('Id and Delivery Driver are required');

      const orderLockKey = `order_locked:${id}`;
      const orderCountKey = `driver_orders:${delivery_driver}`;
      // const timeWindowKey = `driver_window_expired:${delivery_driver}`;

      const lockAcquired = await redisService.set(orderLockKey, String(delivery_driver), { NX: true, EX: 600 });

      if (lockAcquired !== "OK") throw new Error('Order already accepted by another driver');

      const currentOrders = await redisService.get(orderCountKey);
      if (Number(currentOrders) === 1) throw new Error('Driver already has an order in progress');

      await redisService.incr(orderCountKey);

      // const currentOrders = await redisService.incr(orderCountKey);

      // if (currentOrders === 1) {
      //   await redisService.set(timeWindowKey, '1', { EX: 180 }); // 3 minutes
      //   await orderQueue.add(
      //     'notifyDriverToDeliver',
      //     { driverId: delivery_driver },
      //     { delay: 3 * 60 * 1000 }
      //   );
      // }

      // const timeWindow = await redisService.get(timeWindowKey);

      // if (!timeWindow) throw new Error('Time window expired');

      await orderService.updateOne(id, { driver_id: Number(delivery_driver), status: 'in_progress' });
      await webSocketService.emitToRoom('message', `order_${id}`, { type: 'order_status_change', payload: { status: 'in_progress' } });
      await deliveryDriverService.updateDeliveryDriver(Number(delivery_driver), { status: 'busy' });
      res.json({ message: 'Order accepted successfully' });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
}