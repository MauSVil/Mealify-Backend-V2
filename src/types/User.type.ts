import { z } from 'zod';

export const userSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'El nombre es obligatorio'),
  email: z.string().email('El correo debe ser válido'),
  clerk_user_id: z.string(),
  phone: z.string().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type User = z.infer<typeof userSchema>;