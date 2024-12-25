"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAddressSchema = void 0;
const zod_1 = require("zod");
exports.userAddressSchema = zod_1.z.object({
    id: zod_1.z.number().optional(),
    user_id: zod_1.z.number().min(1, 'El ID del usuario es obligatorio'),
    address_line: zod_1.z.string().min(1, 'La línea de dirección es obligatoria'),
    latitude: zod_1.z.number(),
    longitude: zod_1.z.number(),
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional(),
});
