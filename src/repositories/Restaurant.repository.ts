import { prisma } from "../prisma";
import { Restaurant } from "../types/Restaurant.type";

export const RestaurantRepository = {
  findAll: async () => {
    return await prisma.restaurants.findMany();
  },
  findById: async (id: number) => {
    return await prisma.restaurants.findUnique({
      where: {
        id: id,
      },
    });
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