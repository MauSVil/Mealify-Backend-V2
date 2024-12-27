import { Request, Response } from 'express';
import { deliveryDriverService } from '../services/deliveryDriver.service';
import { orderService } from '../services/order.service';

export const deliveryDriverController = {
  findDeliveryCandidates: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) throw new Error('Id is required');

      const orderFound = await orderService.findById({ id: Number(id), includeObj: { restaurants: true } });
      if (!orderFound?.id) throw new Error('Order not found');

      const { restaurants, longitude, latitude } = orderFound;

      const candidates = await deliveryDriverService.findCandidates(
        { longitude: restaurants.longitude.toNumber(), latitude: restaurants.latitude.toNumber() },
        { longitude: longitude.toNumber(), latitude: latitude.toNumber() },
      );
      res.status(200).json(candidates);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};