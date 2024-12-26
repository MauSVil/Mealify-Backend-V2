import { Prisma, PrismaClient } from "@prisma/client";
import { Order } from "../types/Order.type";

const prisma = new PrismaClient();

export const OrderRepository = {
  findAll: async (includeRelations: Prisma.ordersInclude) => {
    return await prisma.orders.findMany({
      include: includeRelations,
      orderBy: {
        created_at: 'desc',
      }
    });
  },
  findById: async (id: number, includeRelations: Prisma.ordersInclude) => {
    return await prisma.orders.findUnique({
      where: {
        id: id,
      },
      include: includeRelations
    });
  },
  findByPaymentIntentId: async (paymentIntentId: string) => {
    return await prisma.orders.findFirst({
      where: {
        payment_intent_id: paymentIntentId,
      },
    });
  },
  createOne: async (data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    return await prisma.orders.create({
      data: {
        ...data,
      },
    });
  },
  updateOne: async (id: number, data: Partial<Order>) => {
    return await prisma.orders.update({
      where: {
        id: id,
      },
      data: {
        ...data,
      },
    });
  },
  deleteOne: async (id: number) => {
    return await prisma.orders.delete({
      where: {
        id: id,
      },
    });
  },
};