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
exports.AdminRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.AdminRepository = {
    findAll: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.admins.findMany();
    }),
    findById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.admins.findUnique({
            where: {
                id: id,
            },
        });
    }),
    createOne: (adminData) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.admins.create({
            data: adminData
        });
    }),
    updateOne: (id, adminData) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.admins.update({
            where: {
                id: id,
            },
            data: adminData,
        });
    }),
    deleteById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.admins.delete({
            where: {
                id: id,
            },
        });
    }),
};
