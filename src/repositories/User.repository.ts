import { PrismaClient } from '@prisma/client';
import type { User } from "../types/User.type";

const prisma = new PrismaClient();

export const UserRepository = {
  findAll: async (): Promise<User[]> => {
    return await prisma.users.findMany();
  },
  findById: async (id: number): Promise<User | null> => {
    return await prisma.users.findUnique({
      where: {
        id: id,
      },
    });
  },
  findByClerkId: async (clerkId: string): Promise<User | null> => {
    return await prisma.users.findFirst({
      where: {
        clerk_user_id: clerkId,
      },
    });
  },
  createOne: async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
    return await prisma.users.create({
      data: userData
    });
  },
  updateOne: async (id: number, userData: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): Promise<User> => {
    return await prisma.users.update({
      where: {
        id: id,
      },
      data: userData,
    });
  },
  deleteById: async (id: number): Promise<void> => {
    await prisma.users.delete({
      where: {
        id: id,
      },
    });
  },
}