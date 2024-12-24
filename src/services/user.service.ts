import { UserRepository } from "../repositories/User.repository"
import { User } from "../types/User.type";

export const userService = {
  getAllUsers: async () => {
    const users = await UserRepository.findAll();
    return users;
  },
  getUserById: async (id: number) => {
    const user = await UserRepository.findById(id);
    return user;
  },
  getUserByClerkId: async (clerkId: string) => {
    const user = await UserRepository.findByClerkId(clerkId);
    return user;
  },
  updateUser: async (id: number, userData: User) => {
    const user = await UserRepository.updateOne(id, userData);
    return user;
  },
  deleteUser: async (id: number) => {
    const user = await UserRepository.deleteById(id);
    return user;
  }
}