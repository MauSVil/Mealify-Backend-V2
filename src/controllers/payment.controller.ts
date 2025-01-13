import { Response } from "express";
import { paymentService } from "../services/payment.service";
import { restaurantsService } from "../services/restaurant.service";
import { mapService } from "../services/map.service";
import { RequestWithAuth } from "../types/Global.type";

export const paymentController = {
  generateParams: async (req: RequestWithAuth, res: Response) => {
    try {
      const { email, amount, restaurant, userLatitude, userLongitude, clerkId, cart, deliveryPtg } = req.body;
      if (!email || !amount || !restaurant || !userLatitude || !userLongitude || !clerkId || !cart || !deliveryPtg ) throw new Error('Missing required fields');

      const restaurantFound = await restaurantsService.getRestaurantById({ id: Number(restaurant) });

      if (!restaurantFound) throw new Error('Restaurant not found');
      const { latitude, longitude } = restaurantFound;

      const { distanceInKm } = await mapService.getRealDistance({ lat: latitude.toNumber(), lon: longitude.toNumber() }, { lat: Number(userLatitude), lon: Number(userLongitude) });

      const shippingCostPerKm = distanceInKm * restaurantFound.delivery_fee.toNumber();

      const data = await paymentService.generateParams(
        {
          email,
          amount: Number(amount),
          shippingCostPerKm,
          restaurant,
          userLatitude,
          userLongitude,
          clerkId,
          cart,
          deliveryPtg
        }
      );

      res.status(200).json(data);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}