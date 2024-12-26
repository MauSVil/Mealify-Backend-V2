import { Request, Response } from 'express';
import { orderItemService } from '../services/orderItem.service';

export const orderItemController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const orderItems = await orderItemService.findAll();
      res.status(200).json(orderItems);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
  findById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) throw new Error('Id is required');
      const orderItem = await orderItemService.findById(Number(id));
      res.status(200).json(orderItem);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
}