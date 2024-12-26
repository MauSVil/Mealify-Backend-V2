import { z } from 'zod';

export const orderItemSchema = z.object({
  id: z.number().optional(),
  order_id: z.number().min(1, 'El ID del pedido es obligatorio'),
  product_id: z.number().min(1, 'El ID del producto es obligatorio'),
  quantity: z.number().min(1, 'La cantidad debe ser al menos 1'),
  unit_price: z.number().nonnegative('El precio unitario debe ser positivo'),
});

export type OrderItem = z.infer<typeof orderItemSchema>;
