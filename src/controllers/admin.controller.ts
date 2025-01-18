import { Request, Response } from "express";
import { RequestWithAuth } from "../types/Global.type";
import { adminService } from "../services/admin.service";

export const adminController = {
  getAdmin: async (req: RequestWithAuth, res: Response) => {
    try {
      const { userId } = req.auth!;
      const admin = await adminService.getAdminByClerkId(userId);
      if (!admin) throw new Error('Admin not found');
      res.status(200).send(admin);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send(error.message);
        return
      }
      res.status(500).send('Internal Server Error');
    }
  },
  updateAdmin: async (req: RequestWithAuth, res: Response) => {
    try {
      const { userId } = req.auth!;
      const body = req.body;


      const admin = await adminService.getAdminByClerkId(userId);
      if (!admin) throw new Error('Admin not found');

      await adminService.updateAdmin(Number(admin.id), body)

      res.status(200).send('Admin updated');
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send(error.message);
        return
      }
      res.status(500).send('Internal Server Error');
    }
  },
}