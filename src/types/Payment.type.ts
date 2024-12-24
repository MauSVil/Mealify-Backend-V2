import { z } from 'zod';

export const paymentSchema = z.object({
  id: z.number().optional(),
  orderId: z.number().min(1, 'El ID del pedido es obligatorio'),
  userId: z.number().min(1, 'El ID del usuario es obligatorio'),
  amount: z.number().nonnegative('El monto debe ser positivo'),
  method: z.string().min(1, 'El método de pago es obligatorio'),
  status: z.enum(['pending', 'completed', 'failed']).default('pending'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Payment = z.infer<typeof paymentSchema>;
