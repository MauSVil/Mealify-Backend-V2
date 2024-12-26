import { Request, Response } from "express";
import { paymentService } from "../services/payment.service";
import { restaurantsService } from "../services/restaurant.service";
import { mapService } from "../services/map.service";
import { RequestWithAuth } from "../types/Global.type";
import { userService } from "../services/user.service";
import { orderService } from "../services/order.service";
import { orderItemService } from "../services/orderItem.service";

export const paymentController = {
  createPaymentIntent: async (req: Request, res: Response) => {
    try {
      const { name, email, amount, restaurant, userLatitude, userLongitude } = req.body;
      if (!name || !email || !amount || !restaurant || !userLatitude || !userLongitude) throw new Error('Missing required fields');

      const restaurantFound = await restaurantsService.getRestaurantById(Number(restaurant));

      if (!restaurantFound) throw new Error('Restaurant not found');
      const { latitude, longitude } = restaurantFound;

      const { distanceInKm } = await mapService.getRealDistance({ lat: latitude.toNumber(), lon: longitude.toNumber() }, { lat: userLatitude, lon: userLongitude });

      const shippingCostPerKm = distanceInKm * restaurantFound.delivery_fee.toNumber();

      const customer = await paymentService.createCustomer(name, email);
      const paymentIntent = await paymentService.createPaymentIntent(amount, shippingCostPerKm, customer);
      res.status(200).json({ paymentIntent, customer: customer?.id });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  pay: async (req: RequestWithAuth, res: Response) => {
    try {
      const {
        payment_method_id,
        payment_intent_id,
        customer_id,
        cart,
        userLatitude,
        userLongitude,
      } = req.body as { payment_method_id: string, payment_intent_id: string, customer_id: string, cart: Record<string, any>, userLatitude: number, userLongitude: number };

      if (!payment_method_id || !payment_intent_id || !customer_id || !cart || !Object.keys(cart).length || !userLatitude || !userLongitude) throw new Error('Missing required fields');

      const { userId } = req.auth!;

      const user = await userService.getUserByClerkId(userId);
      if (!user?.id) throw new Error('User not found');

      const restaurantId = Number((Object.values(cart) as { restaurant_id: string }[])[0].restaurant_id);

      const restaurant = await restaurantsService.getRestaurantById(restaurantId);
      if (!restaurant) throw new Error('Restaurant not found');

      console.log('------ Orden ------');
      console.log(`Usuario: ${user.id}`);
      console.log(`Restaurante: ${restaurant.id}`);
      console.log(`Delivery Fee: ${restaurant.delivery_fee.toNumber()}`);
      console.log('-------------------');

      const amount = Object.values(cart).reduce(
        (acc, { price, quantity }) => acc + price * quantity,
        0,
      );

      const { distanceInKm } = await mapService.getRealDistance({ lat: restaurant.latitude.toNumber(), lon: restaurant.longitude.toNumber() }, { lat: userLatitude, lon: userLongitude });
      const deliveryFeeAmount = restaurant.delivery_fee.toNumber() * distanceInKm;

      const totalFinal = paymentService.getTotal(amount, deliveryFeeAmount);

      const order = await orderService.createOne({
        user_id: user.id,
        restaurant_id: restaurant.id,
        delivery_fee: distanceInKm * restaurant.delivery_fee.toNumber(),
        status: 'pending',
        payment_status: 'pending',
        total_price: totalFinal,
        payment_intent_id,
        latitude: userLatitude,
        longitude: userLongitude,
      })

      const cartItemsMapped = Object.values(cart).map((item) => {
        return {
          quantity: item.quantity,
          order_id: order.id,
          product_id: item.id,
          unit_price: item.price,
        }
      });

      await orderItemService.createMany(cartItemsMapped);

      const result = await paymentService.pay(payment_method_id, payment_intent_id, customer_id);

      res.status(200).json({ result, orderId: order.id });
    } catch (error) {
      console.log({ error });
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}