"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderSchema = void 0;
const zod_1 = require("zod");
exports.orderSchema = zod_1.z.object({
    id: zod_1.z.number().optional(),
    user_id: zod_1.z.number().min(1, 'El ID del usuario es obligatorio'),
    restaurant_id: zod_1.z.number().min(1, 'El ID del restaurante es obligatorio'),
    driver_id: zod_1.z.number().optional(),
    status: zod_1.z.enum(['pending', 'in_progress', 'delivered', 'cancelled']).default('pending'),
    payment_status: zod_1.z.enum(['pending', 'completed', 'failed', 'rejected']).default('pending'),
    total_price: zod_1.z.coerce.number().nonnegative('El precio total debe ser positivo'),
    delivery_fee: zod_1.z.coerce.number().nonnegative('La tarifa de entrega debe ser positiva'),
    payment_intent_id: zod_1.z.string().min(1, 'El ID del intento de pago es obligatorio'),
    latitude: zod_1.z.number(),
    longitude: zod_1.z.number(),
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional(),
});
