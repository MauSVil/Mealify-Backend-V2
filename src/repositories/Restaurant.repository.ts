import { Prisma } from "@prisma/client";
import { prisma } from "../prisma";
import { Restaurant } from "../types/Restaurant.type";

export const RestaurantRepository = {
  findAll: async <T extends Prisma.restaurantsInclude>({ where, includeRelations }: { where?: Prisma.restaurantsWhereInput; includeRelations?: T }) => {
    return await prisma.restaurants.findMany({
      where,
      include: includeRelations
    }) as Prisma.restaurantsGetPayload<{ include: T }>[]
  },
  findByAdmin: async (adminId: number) => {
    return await prisma.restaurants.findMany({
      where: {
        admin_id: adminId,
      },
    });
  },
  findById: async <T extends Prisma.restaurantsInclude>({id, includeRelations}: { id: number; includeRelations?: T  }) => {
    return await prisma.restaurants.findUnique({
      where: {
        id: id,
      },
      include: includeRelations,
    }) as Prisma.restaurantsGetPayload<{ include: T }>
  },
  createOne: async (restaurantData: Omit<Restaurant, 'id' | 'createdAt' | 'updatedAt'>) => {
    return await prisma.restaurants.create({
      data: restaurantData,
    });
  },
  updateOne: async (id: number, restaurantData: Restaurant) => {
    return await prisma.restaurants.update({
      where: {
        id: id,
      },
      data: restaurantData,
    });
  },
  deleteById: async (id: number) => {
    await prisma.restaurants.delete({
      where: {
        id: id,
      },
    });
  },
};