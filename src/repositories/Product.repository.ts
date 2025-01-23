import { prisma } from "../prisma";
import { Product } from "../types/Product.type";


export const ProductRepository = {
  findAll: async () => {
    return await prisma.products.findMany();
  },
  findById: async (id: number) => {
    return await prisma.products.findUnique({
      where: { id },
    });
  },
  findByRestaurantId: async (restaurantId: number) => {
    return await prisma.products.findMany({
      where: {
        restaurant_id: restaurantId,
      },
    });
  },
  createOne: async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    return await prisma.products.create({
      data: productData,
    });
  },
  updateOne: async (id: number, productData: Partial<Product>) => {
    return await prisma.products.update({
      where: {
        id: id,
      },
      data: productData,
    });
  },
  deleteById: async (id: number) => {
    await prisma.products.delete({
      where: {
        id: id,
      },
    });
  },
};
