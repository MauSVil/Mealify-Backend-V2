"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restaurantSchema = void 0;
const zod_1 = require("zod");
exports.restaurantSchema = zod_1.z.object({
    id: zod_1.z.number().optional(),
    hero_image_max: zod_1.z.string().optional(),
    hero_image_med: zod_1.z.string().optional(),
    hero_image_min: zod_1.z.string().optional(),
    adminId: zod_1.z.number().optional(),
    name: zod_1.z.string().min(1, 'El nombre del restaurante es obligatorio'),
    address: zod_1.z.string().min(1, 'La dirección es obligatoria'),
    phone: zod_1.z.string().optional().nullable(),
    delivery_fee: zod_1.z.number().nonnegative('La tarifa de entrega debe ser positiva'),
    latitude: zod_1.z.number(),
    longitude: zod_1.z.number(),
    category: zod_1.z.string(),
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional(),
});
