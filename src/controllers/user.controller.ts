import { Request, Response } from "express";
import { userService } from "../services/user.service"

export const userController = {
  getUsers: async (req: Request, res: Response) => {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Internal server error" });
    }
  },
  getUser: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) throw new Error("Id is required");
      const idNumber = parseInt(id);
      const user = await userService.getUserById(idNumber);
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
  updateUser: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) throw new Error("Id is required");
      const idNumber = parseInt(id);
      const userUpdated = await userService.updateUser(idNumber, req.body);
      res.status(200).json(userUpdated);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Internal server error" });
    }
  },
  deleteUser: async (req: Request, res: Response) => {
    try {

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
      const user = await userService.getUserByClerkId(id);
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
  }
}