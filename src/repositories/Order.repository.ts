import { Prisma } from "@prisma/client";
import { Order } from "../types/Order.type";
import { prisma } from "../prisma";

export const OrderRepository = {
  findAll: async (user_id: number, includeRelations: Prisma.ordersInclude) => {
    return await prisma.orders.findMany({
      where: {
        user_id
      },
      include: includeRelations,
      orderBy: {
        created_at: 'desc',
      }
    });
  },
  findById: async <T extends Prisma.ordersInclude>({ id, includeRelations }: {id: number, includeRelations?: T}) => {
    return await prisma.orders.findUnique({
      where: {
        id: id,
      },
      include: includeRelations
    }) as Prisma.ordersGetPayload<{ include: T }>
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