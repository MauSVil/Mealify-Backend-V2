import { z } from 'zod';

export const groupOptions = [
  { label: "Comidas", value: "meals" },
  { label: "Desayunos", value: "breakfasts" },
  { label: "Cenas", value: "dinners" },
  { label: "Postres", value: "desserts" },
  { label: "Bebidas", value: "drinks" },
  { label: "Otros", value: "others" },
] as const;

export const productSchema = z.object({
  id: z.number().optional(),
  restaurant_id: z.number().min(1, 'El ID del restaurante es obligatorio'),
  name: z.string().min(1, 'El nombre del producto es obligatorio'),
  description: z.string(),
  price: z.number().nonnegative('El precio debe ser positivo'),
  is_available: z.boolean().default(true),
  image_min: z.string().optional(),
  image_med: z.string().optional(),
  image_max: z.string().optional(),
  group: z.enum(groupOptions.map((group) => group.value) as [string, ...string[]]),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Product = z.infer<typeof productSchema>;
