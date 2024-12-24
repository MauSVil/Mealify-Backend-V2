import { Request, Response } from "express";
import { authService } from "../services/auth.service";

export const authController = {
  register: async (req: Request, res: Response) => {
    try {
      const body = req.body;
      const { role, ...rest } = body;
      if (!role) throw new Error("Role is required");
      const user = await authService.register({...rest }, role);
      res.status(200).json(user);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Internal server error" });
    }
  },
};