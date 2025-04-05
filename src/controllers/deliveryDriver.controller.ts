import { Request, Response } from 'express';
import { deliveryDriverService } from '../services/deliveryDriver.service';
import { orderService } from '../services/order.service';
import { redisService } from '../services/redis.service';

export const deliveryDriverController = {
  findDeliveryCandidates: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) throw new Error('Id is required');

      const orderFound = await orderService.findById({ id: Number(id), includeRelations: { restaurants: true } });
      if (!orderFound?.id) throw new Error('Order not found');

      const { restaurants, longitude, latitude } = orderFound;

      const candidates = await deliveryDriverService.findCandidates(
        { longitude: restaurants.longitude, latitude: restaurants.latitude },
        { longitude: longitude, latitude: latitude },
      );
      res.status(200).json(candidates);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  getDriver: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) throw new Error("Id is required");
      const idNumber = parseInt(id);
      const driver = await deliveryDriverService.getDeliveryDriverById(idNumber);
      if (!driver) {
        res.status(404).json({ message: "Driver not found" });
        return;
      }

      const redisDriverPosition = await redisService.get(`location:${driver.id}`);
      const { lat, lng } = JSON.parse(redisDriverPosition!);

      driver.latitude = lat;
      driver.longitude = lng;

      res.status(200).json(driver);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Internal server error" });
    }
  },
  getUserByClerkId: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) throw new Error("Id is required");
      const user = await deliveryDriverService.getUserByClerkId(id);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.status(200).json(user);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Internal server error" });
    }
  },
  updateDriver: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) throw new Error("Id is required");
      const idNumber = parseInt(id);

      const body = req.body;
      const file = req.file;

      const userUpdated = await deliveryDriverService.updateDeliveryDriver(idNumber, body, file);
      res.status(200).json(userUpdated);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Internal server error" });
    }
  },
};