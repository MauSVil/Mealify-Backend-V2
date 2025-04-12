import { z } from 'zod';

export const restaurantSchema = z.object({
  id: z.number().optional(),
  hero_image_max: z.string().optional(),
  hero_image_med: z.string().optional(),
  hero_image_min: z.string().optional(),
  admin_id: z.number().optional().nullable(),
  name: z.string().min(1, 'El nombre del restaurante es obligatorio'),
  address: z.string().min(1, 'La dirección es obligatoria'),
  phone: z.string().optional().nullable(),
  delivery_fee: z.coerce.number().nonnegative('La tarifa de entrega debe ser positiva'),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  category: z.string(),
  stripe_subscription_id: z.string().optional().nullable(),
  stripe_customer_id: z.string().optional().nullable(),
  subscription_status: z.enum([
    'active',
    'incomplete',
    'incomplete_expired',
    'trialing',
    'past_due',
    'canceled',
    'unpaid',
    'paused',
    'pending'
  ]).optional().nullable(),
  is_active: z.boolean().default(false).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Restaurant = z.infer<typeof restaurantSchema>;