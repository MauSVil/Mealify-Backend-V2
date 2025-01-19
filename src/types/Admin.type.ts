import { z } from 'zod';

export const adminSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional().nullable(),
  first_last_name: z.string().optional().nullable(),
  second_last_name: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().email('El correo debe ser válido'),
  clerk_user_id: z.string(),
  stripe_account: z.string().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  onboarding_finished: z.boolean().optional().nullable(),
  stripe_status: z.enum(['error', 'success'])
});

export type Admin = z.infer<typeof adminSchema>;
