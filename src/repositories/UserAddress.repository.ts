import { prisma } from "../prisma";
import { UserAddress } from "../types/UserAddress.type";

export const UserAddressRespository = {
  findAll: async () => {
    return await prisma.user_addresses.findMany();
  },
  findByUserId: async (userId: number) => {
    return await prisma.user_addresses.findMany({
      where: {
        user_id: userId
      }
    });
  },
  createOne: async (data: Omit<UserAddress, 'id' | 'createdAt' | 'updatedAt'>) => {
    return await prisma.user_addresses.create({
      data,
    });
  },
  updateOne: async (id: number, data: Partial<UserAddress>) => {
    return await prisma.user_addresses.update({
      where: {
        id
      },
      data
    });
  },
  deleteOne: async (id: number) => {
    return await prisma.user_addresses.delete({
      where: {
        id
      }
    });
  }
}