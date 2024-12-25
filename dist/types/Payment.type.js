"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentSchema = void 0;
const zod_1 = require("zod");
exports.paymentSchema = zod_1.z.object({
    id: zod_1.z.number().optional(),
    orderId: zod_1.z.number().min(1, 'El ID del pedido es obligatorio'),
    userId: zod_1.z.number().min(1, 'El ID del usuario es obligatorio'),
    amount: zod_1.z.number().nonnegative('El monto debe ser positivo'),
    method: zod_1.z.string().min(1, 'El método de pago es obligatorio'),
    status: zod_1.z.enum(['pending', 'completed', 'failed']).default('pending'),
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional(),
});
