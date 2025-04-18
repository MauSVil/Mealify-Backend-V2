import { Decimal } from "@prisma/client/runtime/library";
import { z } from "zod";

export const deliveryDriverSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'El nombre es obligatorio'),
  phone: z.string().min(1, 'El número de teléfono es obligatorio'),
  email: z.string().email('El correo debe ser válido'),
  clerk_user_id: z.string(),
  token: z.string().nullable().optional(),
  vehicleType: z.string().optional(),
  is_active: z.boolean().default(true),
  status: z.enum(['available', 'busy', 'offline']).default('available'),
  latitude:  z.instanceof(Decimal).optional().nullable(),
  longitude: z.instanceof(Decimal).optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  image: z.string().nullable().optional(),
});

export type DeliveryDriver = z.infer<typeof deliveryDriverSchema>;
