import { z } from 'zod';

export const userAddressSchema = z.object({
  id: z.number().optional(),
  user_id: z.number().min(1, 'El ID del usuario es obligatorio'),
  address_line: z.string().min(1, 'La línea de dirección es obligatoria'),
  latitude: z.number(),
  longitude: z.number(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type UserAddress = z.infer<typeof userAddressSchema>;
