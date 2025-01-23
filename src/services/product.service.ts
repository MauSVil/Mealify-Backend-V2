import { ProductRepository } from "../repositories/Product.repository";
import { Product } from "../types/Product.type";
import { fileService } from "./file.service";

export const productService = {
  getAllProducts: async () => {
    const products = await ProductRepository.findAll();
    return products;
  },
  getProductById: async (id: number) => {
    const product = await ProductRepository.findById(id);
    return product;
  },
  getProductsByRestaurantId: async (restaurantId: number) => {
    const products = await ProductRepository.findByRestaurantId(restaurantId);
    return products;
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
  updateProducts: async (products: Record<string, Partial<Product>>) => {
    const updates = Object.entries(products).map(([id, product]) => {
      return ProductRepository.updateOne(Number(id), product);
    });

    return await Promise.all(updates);
  },
}