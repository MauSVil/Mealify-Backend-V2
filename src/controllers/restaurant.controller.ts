import { Request, Response } from 'express';
import { restaurantsService } from '../services/restaurant.service';
import { restaurantSchema } from '../types/Restaurant.type';
import { RequestWithAuth } from '../types/Global.type';
import { adminService } from '../services/admin.service';

export const restaurantsController = {
  getRestaurants: async (req: RequestWithAuth, res: Response) => {
    try {
      const { userId } = req.auth!;
      const adminFound = await adminService.getAdminByClerkId(userId);
      if (!adminFound) throw new Error('Unauthorized');
      const restaurants = await restaurantsService.getRestaurantsByAdminId(adminFound.id!);
      res.status(200).json(restaurants);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  },
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
      const restaurant = await restaurantsService.getRestaurantById({ id: parseInt(id) });
      res.status(200).json(restaurant);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  addRestaurant: async (req: RequestWithAuth, res: Response) => {
    try {
      const body = req.body;
      const file = req.file;
      const { userId } = req.auth!;

      const adminFound = await adminService.getAdminByClerkId(userId);
      if (!adminFound) throw new Error('Unauthorized');

      if (!file) throw new Error('Missing image file');

      const input = await restaurantSchema.parseAsync({
        ...body,
        ...(body.delivery_fee && { delivery_fee: Number(body.delivery_fee) }),
        latitude: Number(body.latitude),
        longitude: Number(body.longitude),
        admin_id: adminFound.id!,
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
      const { latitude, longitude, query } = req.params;
      if (!latitude || !longitude) throw new Error('Missing latitude or longitude');

      const closeRestaurants = await restaurantsService.getCloseRestaurants({ query, latitude: parseFloat(latitude as string), longitude: parseFloat(longitude as string)});
      res.status(200).json(closeRestaurants);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  getTotals: async (req: Request, res: Response) => {
    try {
      const businessId = req.headers['x-business-id'];
      if (!businessId) throw new Error('Business Id is required');
      const totals = await restaurantsService.getTotals(parseInt(businessId as string));
      res.status(200).json(totals);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  getDeliveredOrders: async (req: Request, res: Response) => {
    try {
      const businessId = req.headers['x-business-id'];
      if (!businessId) throw new Error('Business Id is required');
      const orders = await restaurantsService.getDeliveredOrders(parseInt(businessId as string));
      res.status(200).json(orders);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};