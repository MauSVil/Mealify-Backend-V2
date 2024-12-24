import { z } from 'zod';

export const productSchema = z.object({
  id: z.number().optional(),
  restaurant_id: z.number().min(1, 'El ID del restaurante es obligatorio'),
  name: z.string().min(1, 'El nombre del producto es obligatorio'),
  description: z.string(),
  price: z.number().nonnegative('El precio debe ser positivo'),
  is_available: z.boolean().default(true),
  image_min: z.string().optional(),
  image_med: z.string().optional(),
  image_max: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Product = z.infer<typeof productSchema>;
