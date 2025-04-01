import { Request, Response } from 'express';
import XLSX from 'xlsx';
import _ from 'lodash';
import { productService } from '../services/product.service';
import { Product, productSchema } from '../types/Product.type';

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
  addProducts: async (req: Request, res: Response) => {
    const translations = {
      Comidas: 'meals',
      Desayunos: 'breakfasts',
      Cenas: 'dinners',
      Postres: 'desserts',
      Bebidas: 'drinks',
      Otros: 'others',
    }

    try {
      const { file, products } = req.files as { file: Express.Multer.File[]; products: Express.Multer.File[] };
      const businessId = req.headers['x-business-id'];

      if (!file?.length || !products?.length) throw new Error('Missing image file or products file');

      const excelFile = file[0];
      const productsParsed = products.map((product) => {
        return {
          ...product,
          originalname: product.originalname.split('.')[0]?.toLowerCase(),
        }
      })
      const productsByName = _.keyBy(productsParsed, 'originalname');

      const workbook = XLSX.read(excelFile.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const headers = jsonData[0] as string[];
      const data = jsonData.slice(1).map((row: any) => {
        const rowData: { [key: string]: any } = {};
        headers.forEach((header, index) => {
          rowData[header] = row[index];
        });
        return rowData;
      });

      const promises = data.map(async (row) => {
        if (!row.Nombre || !row.Descripcion || !row.Precio || !row.Categoria) throw new Error('Missing required fields');

        const product: Product = {
          restaurant_id: Number(businessId as string),
          price: Number(row.Precio),
          name: row.Nombre,
          description: row.Descripcion,
          group: translations[row.Categoria as keyof typeof translations] as any,
          is_available: true,
        }

        const input = await productSchema.parseAsync(product);

        const productImage = productsByName[row.Nombre?.toLowerCase()];
        if (!productImage) throw new Error(`No se encontró la imagen para el producto ${row.Nombre}`);

        const productsFound = await productService.getAllProducts({ where: { restaurant_id: input.restaurant_id, name: { contains: input.name } } });
        const productFound = productsFound[0];
        if (productFound) throw new Error(`El producto ${input.name} ya existe`);

        await productService.addProduct(input, productImage);

        return { product: input.name, message: 'Producto creado satisfactoriamente' }
      })

      const responses = await Promise.allSettled(promises);
      const successfulResponses = responses.filter((response) => response.status === 'fulfilled') as PromiseFulfilledResult<any>[];
      const failedResponses = responses.filter((response) => response.status === 'rejected') as PromiseRejectedResult[];
      const successfulProducts = successfulResponses.map((response) => response.value);
      const failedProducts = failedResponses.map((response) => {
        const error = response.reason as Error;
        return error.message
      });

      res.status(201).json({
        successfulProducts,
        failedProducts,
      });
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