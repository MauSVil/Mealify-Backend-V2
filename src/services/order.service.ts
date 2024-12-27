import { Prisma } from "@prisma/client";
import { OrderRepository } from "../repositories/Order.repository"
import { Order } from "../types/Order.type";

export const orderService = {
  findAll: async (user_id: number) => {
    return await OrderRepository.findAll(user_id, { restaurants: true, order_items: true });
  },
  findById: async ({ id, includeObj }: { id: number, includeObj: Prisma.ordersInclude }) => {
    return await OrderRepository.findById(id, includeObj);
  },
  findByPaymentIntentId: async (paymentIntentId: string) => {
    return await OrderRepository.findByPaymentIntentId(paymentIntentId);
  },
  createOne: async (data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    return await OrderRepository.createOne(data);
  },
  updateOne: async (id: number, data: any) => {
    return await OrderRepository.updateOne(id, data);
  },
  deleteOne: async (id: number) => {
    return await OrderRepository.deleteOne(id);
  },
}