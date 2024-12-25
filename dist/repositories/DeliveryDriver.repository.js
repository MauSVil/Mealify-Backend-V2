"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryDriverRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.DeliveryDriverRepository = {
    findAll: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.delivery_drivers.findMany();
    }),
    findById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.delivery_drivers.findUnique({
            where: {
                id: id,
            },
        });
    }),
    createOne: (deliveryDriverData) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.delivery_drivers.create({
            data: deliveryDriverData
        });
    }),
    updateOne: (id, deliveryDriverData) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.delivery_drivers.update({
            where: {
                id: id,
            },
            data: deliveryDriverData,
        });
    }),
    deleteById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.delivery_drivers.delete({
            where: {
                id: id,
            },
        });
    }),
};
