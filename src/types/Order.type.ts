import { z } from 'zod';

export const orderSchema = z.object({
  id: z.number().optional(),
  user_id: z.number().min(1, 'El ID del usuario es obligatorio'),
  restaurant_id: z.number().min(1, 'El ID del restaurante es obligatorio'),
  driver_id: z.number().optional(),
  status: z.enum(['pending', 'preparing', 'ready_for_pickup', 'in_progress', 'delivered', 'cancelled']).default('pending'),
  payment_status: z.enum(['pending', 'completed', 'failed', 'rejected']).default('pending'),
  amount: z.coerce.number().nonnegative('La cantidad debe ser positiva'),
  total_price: z.coerce.number().nonnegative('El precio total debe ser positivo'),
  delivery_fee: z.coerce.number().nonnegative('La tarifa de entrega debe ser positiva'),
  payment_intent_id: z.string().min(1, 'El ID del intento de pago es obligatorio'),
  delivery_ptg_amount: z.coerce.number().nonnegative('El porcentaje de entrega debe ser positivo'),
  plaform_fee_amount: z.coerce.number().nonnegative('La tarifa de la plataforma debe ser positiva'),
  latitude: z.number(),
  longitude: z.number(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type Order = z.infer<typeof orderSchema>;
