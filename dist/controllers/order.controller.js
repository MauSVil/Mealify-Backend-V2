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
exports.orderController = void 0;
const order_service_1 = require("../services/order.service");
exports.orderController = {
    getAllOrders: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const orders = yield order_service_1.orderService.findAll();
            res.json(orders);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
                return;
            }
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }),
    getOrderById: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            if (!id)
                throw new Error('Id is required');
            const order = yield order_service_1.orderService.findById(Number(id));
            res.json(order);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
                return;
            }
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }),
};
