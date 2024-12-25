"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderItemSchema = void 0;
const zod_1 = require("zod");
exports.orderItemSchema = zod_1.z.object({
    id: zod_1.z.number().optional(),
    orderId: zod_1.z.number().min(1, 'El ID del pedido es obligatorio'),
    productId: zod_1.z.number().min(1, 'El ID del producto es obligatorio'),
    quantity: zod_1.z.number().min(1, 'La cantidad debe ser al menos 1'),
    unitPrice: zod_1.z.number().nonnegative('El precio unitario debe ser positivo'),
});
