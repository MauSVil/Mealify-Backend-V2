import { Prisma } from "@prisma/client";
import { ProductRepository } from "../repositories/Product.repository";
import { Product } from "../types/Product.type";
import { fileService } from "./file.service";

export const productService = {
  getAllProducts: async ({ where }: { where?: Prisma.productsWhereInput }) => {
    const products = await ProductRepository.findAll({ where });
    return products;
  },
  getProductById: async (id: number) => {
    const product = await ProductRepository.findById(id);
    return product;
  },
  addProduct: async (product: Product, file: Express.Multer.File) => {
    const productCreated = await ProductRepository.createOne(product);

    const sizes = [200, 400, 800];
    const extension = 'webp';
    const compressedFiles = await fileService.compressImage(file.buffer, extension, sizes);
    const urls = await Promise.all(compressedFiles.map(async (compessedFile, idx) => {
      return await fileService.uploadImage('products', `${productCreated.id}/image-${sizes[idx]}.${extension}`, compessedFile);
    }));

    const { id, price, restaurant_id, ...rest } = productCreated;

    return await ProductRepository.updateOne(
      productCreated.id,
      {
        ...rest,
        image_min: urls[0],
        image_med: urls[1],
        image_max: urls[2],
        price: price.toNumber(),
      }
    );
  },
  updateProduct: async (id: number, product: Partial<Product>, file?: Express.Multer.File) => {
    const productUpdated = await ProductRepository.updateOne(id, product);

    if (file && file?.buffer) {
      const sizes = [200, 400, 800];
      const extension = 'webp';
      const compressedFiles = await fileService.compressImage(file.buffer, extension, sizes);
      const urls = await Promise.all(compressedFiles.map(async (compessedFile, idx) => {
        return await fileService.uploadImage('products', `${productUpdated.id}/image-${sizes[idx]}.${extension}`, compessedFile);
      }));

      const { id, price, restaurant_id, ...rest } = productUpdated;

      return await ProductRepository.updateOne(
        productUpdated.id,
        {
          ...rest,
          image_min: urls[0],
          image_med: urls[1],
          image_max: urls[2],
          price: price.toNumber(),
        }
      );
    }

    return productUpdated;
  },
  updateProducts: async (products: Partial<Product>[]) => {
    products.forEach(async (product) => {
      const { id, ...rest } = product;
      await ProductRepository.updateOne(Number(id!), rest);
    });
  },
  deleteProduct: async (id: number) => {
    await ProductRepository.deleteById(id);
  },
}