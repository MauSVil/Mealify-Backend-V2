import { Prisma } from "@prisma/client";
import { OrderRepository } from "../repositories/Order.repository"
import { Order } from "../types/Order.type";

export const orderService = {
  find: async (where: Prisma.ordersWhereInput, includeRelations?: Prisma.ordersInclude) => {
    return await OrderRepository.find(where, includeRelations);
  },
  findAll: async (user_id: number) => {
    return await OrderRepository.findAll(user_id, { restaurants: true, order_items: true });
  },
  findByRestaurantId: async (restaurantId: number) => {
    return await OrderRepository.findByRestaurantId(restaurantId, { order_items: { include: { products: true }} });
  },
  findById: async ({ id, includeRelations }: { id: number, includeRelations?: Prisma.ordersInclude }) => {
    return await OrderRepository.findById({ id, includeRelations });
  },
  findByPaymentIntentId: async (paymentIntentId: string) => {
    return await OrderRepository.findByPaymentIntentId(paymentIntentId);
  },
  createOne: async (data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    return await OrderRepository.createOne(data);
  },
  updateOne: async (id: number, data: Partial<Order>) => {
    return await OrderRepository.updateOne(id, data);
  },
  deleteOne: async (id: number) => {
    return await OrderRepository.deleteOne(id);
  },
}