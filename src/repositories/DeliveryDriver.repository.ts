import { PrismaClient } from '@prisma/client';
import { DeliveryDriver } from '../types/DeliveryDriver.type';

const prisma = new PrismaClient();

export const DeliveryDriverRepository = {
  findAll: async (): Promise<DeliveryDriver[]> => {
    return await prisma.delivery_drivers.findMany();
  },
  findById: async (id: number): Promise<DeliveryDriver | null> => {
    return await prisma.delivery_drivers.findUnique({
      where: {
        id: id,
      },
    });
  },
  createOne: async (deliveryDriverData: Omit<DeliveryDriver, 'id' | 'createdAt' | 'updatedAt'>): Promise<DeliveryDriver> => {
    return await prisma.delivery_drivers.create({
      data: deliveryDriverData
    });
  },
  updateOne: async (id: number, deliveryDriverData: Partial<Omit<DeliveryDriver, 'id' | 'createdAt' | 'updatedAt'>>): Promise<DeliveryDriver> => {
    return await prisma.delivery_drivers.update({
      where: {
        id: id,
      },
      data: deliveryDriverData,
    });
  },
  deleteById: async (id: number): Promise<void> => {
    await prisma.delivery_drivers.delete({
      where: {
        id: id,
      },
    });
  },
}