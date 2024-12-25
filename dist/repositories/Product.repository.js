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
exports.ProductRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.ProductRepository = {
    findAll: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.products.findMany();
    }),
    findById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.products.findUnique({
            where: { id },
        });
    }),
    findByRestaurantId: (restaurantId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.products.findMany({
            where: {
                restaurant_id: restaurantId,
            },
        });
    }),
    createOne: (productData) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.products.create({
            data: productData,
        });
    }),
    updateOne: (id, productData) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.products.update({
            where: {
                id: id,
            },
            data: productData,
        });
    }),
    deleteById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.products.delete({
            where: {
                id: id,
            },
        });
    }),
};
