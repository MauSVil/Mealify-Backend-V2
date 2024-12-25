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
exports.orderService = void 0;
const Order_repository_1 = require("../repositories/Order.repository");
exports.orderService = {
    findAll: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield Order_repository_1.OrderRepository.findAll();
    }),
    findById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield Order_repository_1.OrderRepository.findById(id);
    }),
    findByPaymentIntentId: (paymentIntentId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield Order_repository_1.OrderRepository.findByPaymentIntentId(paymentIntentId);
    }),
    createOne: (data) => __awaiter(void 0, void 0, void 0, function* () {
        return yield Order_repository_1.OrderRepository.createOne(data);
    }),
    updateOne: (id, data) => __awaiter(void 0, void 0, void 0, function* () {
        return yield Order_repository_1.OrderRepository.updateOne(id, data);
    }),
    deleteOne: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield Order_repository_1.OrderRepository.deleteOne(id);
    }),
};
