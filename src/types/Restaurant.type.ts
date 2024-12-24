import { z } from 'zod';

export const restaurantSchema = z.object({
  id: z.number().optional(),
  hero_image_max: z.string().optional(),
  hero_image_med: z.string().optional(),
  hero_image_min: z.string().optional(),
  adminId: z.number().optional(),
  name: z.string().min(1, 'El nombre del restaurante es obligatorio'),
  address: z.string().min(1, 'La dirección es obligatoria'),
  phone: z.string().optional().nullable(),
  delivery_fee: z.number().nonnegative('La tarifa de entrega debe ser positiva'),
  latitude: z.number(),
  longitude: z.number(),
  category: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Restaurant = z.infer<typeof restaurantSchema>;