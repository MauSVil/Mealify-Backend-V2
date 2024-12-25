"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminSchema = void 0;
const zod_1 = require("zod");
exports.adminSchema = zod_1.z.object({
    id: zod_1.z.number().optional(),
    name: zod_1.z.string().min(1, 'El nombre es obligatorio'),
    email: zod_1.z.string().email('El correo debe ser válido'),
    clerk_user_id: zod_1.z.string(),
    stripe_account: zod_1.z.string(),
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional(),
});
