import { Request, Response } from 'express';
import { restaurantsService } from '../services/restaurant.service';
import { restaurantSchema } from '../types/Restaurant.type';

export const restaurantsController = {
  getAllRestaurants: async (req: Request, res: Response) => {
    try {
      const restaurants = await restaurantsService.getRestaurants();
      res.status(200).json(restaurants);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  getRestaurantById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) throw new Error('Missing restaurant id');
      const restaurant = await restaurantsService.getRestaurantById(parseInt(id));
      res.status(200).json(restaurant);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  addRestaurant: async (req: Request, res: Response) => {
    try {
      const body = req.body;
      const file = req.file;

      if (!file) throw new Error('Missing image file');

      const input = await restaurantSchema.parseAsync({
        ...body,
        ...(body.delivery_fee && { delivery_fee: Number(body.delivery_fee) }),
        latitude: Number(body.latitude),
        longitude: Number(body.longitude),
      });

      const newRestaurant = await restaurantsService.addRestaurant(input, file);
      res.status(201).json(newRestaurant);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  getCloseRestaurants: async (req: Request, res: Response) => {
    try {
      const { latitude, longitude } = req.params;
      if (!latitude || !longitude) throw new Error('Missing latitude or longitude');
      const closeRestaurants = await restaurantsService.getCloseRestaurants(parseFloat(latitude as string), parseFloat(longitude as string));
      res.status(200).json(closeRestaurants);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};