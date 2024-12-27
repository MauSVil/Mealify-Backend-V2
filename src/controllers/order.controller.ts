import { Request, Response } from 'express';
import { orderService } from '../services/order.service';
import { RequestWithAuth } from '../types/Global.type';
import { userService } from '../services/user.service';

export const orderController = {
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
      const order = await orderService.findById({ id: Number(id), includeObj: { restaurants: true, order_items: { include: { products: true }  } } });
      res.json(order);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
}