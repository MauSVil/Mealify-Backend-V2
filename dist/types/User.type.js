"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const zod_1 = require("zod");
exports.userSchema = zod_1.z.object({
    id: zod_1.z.number().optional(),
    name: zod_1.z.string().min(1, 'El nombre es obligatorio'),
    email: zod_1.z.string().email('El correo debe ser válido'),
    clerk_user_id: zod_1.z.string(),
    phone: zod_1.z.string().nullable(),
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional(),
});
