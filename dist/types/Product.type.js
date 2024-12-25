"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productSchema = void 0;
const zod_1 = require("zod");
exports.productSchema = zod_1.z.object({
    id: zod_1.z.number().optional(),
    restaurant_id: zod_1.z.number().min(1, 'El ID del restaurante es obligatorio'),
    name: zod_1.z.string().min(1, 'El nombre del producto es obligatorio'),
    description: zod_1.z.string(),
    price: zod_1.z.number().nonnegative('El precio debe ser positivo'),
    is_available: zod_1.z.boolean().default(true),
    image_min: zod_1.z.string().optional(),
    image_med: zod_1.z.string().optional(),
    image_max: zod_1.z.string().optional(),
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional(),
});
