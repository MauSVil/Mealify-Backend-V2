import { Request, Response } from "express";
import { paymentService } from "../services/payment.service";
import { restaurantsService } from "../services/restaurant.service";
import { mapService } from "../services/map.service";

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
  pay: async (req: Request, res: Response) => {
    try {
      const { payment_method_id, payment_intent_id, customer_id } = req.body;
      if (!payment_method_id || !payment_intent_id || !customer_id) throw new Error('Missing required fields');
      const result = await paymentService.pay(payment_method_id, payment_intent_id, customer_id);
      res.status(200).json({ result });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}