import { z } from 'zod';

export const orderSchema = z.object({
  id: z.number().optional(),
  userId: z.number().min(1, 'El ID del usuario es obligatorio'),
  restaurantId: z.number().min(1, 'El ID del restaurante es obligatorio'),
  driverId: z.number().optional(),
  status: z.enum(['pending', 'in_progress', 'delivered', 'cancelled']).default('pending'),
  totalPrice: z.number().nonnegative('El precio total debe ser positivo'),
  deliveryFee: z.number().nonnegative('La tarifa de entrega debe ser positiva'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Order = z.infer<typeof orderSchema>;
