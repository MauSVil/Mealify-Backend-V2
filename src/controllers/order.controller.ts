import { Request, Response } from 'express';
import { orderService } from '../services/order.service';
import { RequestWithAuth } from '../types/Global.type';
import { userService } from '../services/user.service';
import webSocketService from '../services/webSocket.service';

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
      const updatedOrder = await orderService.updateOne(id, rest);
      if (rest.status) {
        await webSocketService.emitToRoom('message', String(updatedOrder.id), { type: 'order_status_change', payload: { status: rest.status } });
      }

      res.json(updatedOrder);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}