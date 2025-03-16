import { Prisma } from '@prisma/client';
import { prisma } from '../prisma';
import { DeliveryDriver } from '../types/DeliveryDriver.type';


export const DeliveryDriverRepository = {
  findAll: async <T extends Prisma.delivery_driversInclude>({ where, includeRelations }: { where?: Prisma.delivery_driversWhereInput, includeRelations?: T }) => {
    return await prisma.delivery_drivers.findMany({
      where,
      include: includeRelations,
    }) as Prisma.delivery_driversGetPayload<{ include: T }>[]
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
  findByClerkId: async (clerkId: string): Promise<DeliveryDriver | null> => {
    return await prisma.delivery_drivers.findFirst({
      where: {
        clerk_user_id: clerkId,
      },
    });
  },
}