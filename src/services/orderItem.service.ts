import { OrderItem } from "../types/OrderItem.type";
import { OrderItemRepository } from "../repositories/OrderItem.repository"

export const orderItemService = {
  findAll: async () => {
    return await OrderItemRepository.findAll();
  },
  findById: async (id: number) => {
    return await OrderItemRepository.findById(id);
  },
  createOne: async (data: Omit<OrderItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    return await OrderItemRepository.createOne(data);
  },
  createMany: async (data: Omit<OrderItem, 'id' | 'createdAt' | 'updatedAt'>[]) => {
    return await OrderItemRepository.createMany(data);
  },
  update: async (id: number, data: any) => {
    return await OrderItemRepository.update(id, data);
  },
  delete: async (id: number) => {
    return await OrderItemRepository.delete(id);
  },
}