"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deliveryDriverSchema = void 0;
const zod_1 = require("zod");
exports.deliveryDriverSchema = zod_1.z.object({
    id: zod_1.z.number().optional(),
    name: zod_1.z.string().min(1, 'El nombre es obligatorio'),
    phone: zod_1.z.string().min(1, 'El número de teléfono es obligatorio'),
    email: zod_1.z.string().email('El correo debe ser válido'),
    clerk_user_id: zod_1.z.string(),
    vehicleType: zod_1.z.string().optional(),
    is_active: zod_1.z.boolean().default(true),
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional(),
});
