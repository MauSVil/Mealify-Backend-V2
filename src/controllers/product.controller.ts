import { Request, Response } from 'express';
import { productService } from '../services/product.service';
import { productSchema } from '../types/Product.type';

export const productsController = {
  getAllProducts: async (req: Request, res: Response) => {
    try {
      const products = await productService.getAllProducts();
      res.status(200).json(products);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  getProductById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) throw new Error('Missing product id');
      const product = await productService.getProductById(parseInt(id));
      res.status(200).json(product);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  getProductsByRestaurantId: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) throw new Error('Missing restaurant id');
      const products = await productService.getProductsByRestaurantId(parseInt(id));
      res.status(200).json(products);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  addProduct: async (req: Request, res: Response) => {
    try {
      const body = req.body;
      const file = req.file;

      if (!file) throw new Error('Missing image file');

      const input = await productSchema.parseAsync({
        ...body,
        price: Number(body.price),
        restaurant_id: Number(body.restaurant_id),
      });

      const newProduct = await productService.addProduct(input, file);
      res.status(201).json(newProduct);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};