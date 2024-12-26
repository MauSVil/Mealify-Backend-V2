import { PrismaClient } from "@prisma/client";
import { OrderItem } from "../types/OrderItem.type";

const prisma = new PrismaClient();

export const OrderItemRepository = {
  findAll: async () => {
    return await prisma.order_items.findMany();
  },
  findById: async (id: number) => {
    return await prisma.order_items.findFirst({
      where: {
        id: id,
      },
    });
  },
  createOne: async (data: Omit<OrderItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    return await prisma.order_items.create({
      data: data,
    });
  },
  createMany: async (data: Omit<OrderItem, 'id' | 'createdAt' | 'updatedAt'>[]) => {
    return await prisma.order_items.createMany({
      data: data,
    });
  },
  update: async (id: number, data: Partial<OrderItem>) => {
    return await prisma.order_items.update({
      where: {
        id: id,
      },
      data: data,
    });
  },
  delete: async (id: number) => {
    return await prisma.order_items.delete({
      where: {
        id: id,
      },
    });
  },
}