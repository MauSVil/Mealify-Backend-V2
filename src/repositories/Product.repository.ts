import { Prisma } from "@prisma/client";
import { prisma } from "../prisma";
import { Product } from "../types/Product.type";


export const ProductRepository = {
  findAll: async ({ where }: { where?: Prisma.productsWhereInput }) => {
    return await prisma.products.findMany({
      where: {
        ...where,
        deleted_at: null,
      },
    });
  },
  findById: async (id: number) => {
    return await prisma.products.findUnique({
      where: { id, deleted_at: null },
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
    await prisma.products.update({
      where: {
        id,
      },
      data: {
        deleted_at: new Date(),
      }
    });
  },
};
