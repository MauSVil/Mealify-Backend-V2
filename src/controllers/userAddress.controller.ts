import { Request, Response } from 'express';
import { userAddressService } from '../services/userAddress.service';
import { userAddressSchema } from '../types/UserAddress.type';
import { userService } from '../services/user.service';

export const userAddressController = {
  async getUserAddress(req: Request, res: Response) {
    try {
      const { userId } = req.auth!;
      const user = await userService.getUserByClerkId(userId);
      if (!user || !user.id) throw new Error('User not found');
      const addresses = await userAddressService.findByUserId(user.id);
      res.status(200).json(addresses);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(400).json({ error: 'An error occurred' });
    }
  },
  async createUserAddress(req: Request, res: Response) {
    try {
      const { userId } = req.auth!;
      const user = await userService.getUserByClerkId(userId);
      if (!user || !user.id) throw new Error('User not found');
      const body = req.body;
      body.user_id = user.id;
      const parsedBody = await userAddressSchema.parseAsync(body);
      const address = await userAddressService.createOne(parsedBody);
      res.status(201).json(address);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(400).json({ error: 'An error occurred' });
    }
  },
  async updateUserAddress(req: Request, res: Response) {
    try {

    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(400).json({ error: 'An error occurred' });
    }
  },
  async deleteUserAddress(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) throw new Error('Address ID is required');
      const address = await userAddressService.deleteOne(Number(id));
      res.status(200).json(address);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(400).json({ error: 'An error occurred' });
    }
  },
};