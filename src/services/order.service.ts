import { OrderRepository } from "../repositories/Order.repository"
import { Order } from "../types/Order.type";

export const orderService = {
  findAll: async (user_id: number) => {
    return await OrderRepository.findAll(user_id, { restaurants: true, order_items: true });
  },
  findById: async (id: number) => {
    return await OrderRepository.findById(id, { order_items: { include: { products: true } } });
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