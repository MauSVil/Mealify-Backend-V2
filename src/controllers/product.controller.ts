import { Request, Response } from 'express';
import { productService } from '../services/product.service';
import { productSchema } from '../types/Product.type';

export const productsController = {
  getAllProducts: async (req: Request, res: Response) => {
    try {
      const businessId = req.headers['x-business-id'] as string;
      const products = await productService.getAllProducts({ where: { restaurant_id: parseInt(businessId) } });
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
      const products = await productService.getAllProducts({ where: { restaurant_id: parseInt(id), is_available: true } });
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

      const businessId = req.headers['x-business-id'];

      if (!file) throw new Error('Missing image file');

      const input = await productSchema.parseAsync({
        ...body,
        price: Number(body.price),
        restaurant_id: Number(businessId as string),
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
  updateProduct: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const file = req.file;

      const productFound = await productService.getProductById(Number(id));

      if (!productFound) throw new Error('Product not found');

      const { image, ...rest } = body;

      const input = {
        ...productFound,
        ...rest,
      }

      if (body.price) {
        input.price = Number(body.price);
      }

      const updatedProduct = await productService.updateProduct(Number(id), input, file);
      res.status(200).json(updatedProduct);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  updateProducts: async (req: Request, res: Response) => {
    try {
      const body = req.body;

      const updates = await productService.updateProducts(body);
      res.status(200).json(updates);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  deleteProduct: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) throw new Error('Missing product id');
      await productService.deleteProduct(parseInt(id));
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};