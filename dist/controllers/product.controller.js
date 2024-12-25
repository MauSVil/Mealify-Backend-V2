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
exports.productsController = void 0;
const product_service_1 = require("../services/product.service");
const Product_type_1 = require("../types/Product.type");
exports.productsController = {
    getAllProducts: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const products = yield product_service_1.productService.getAllProducts();
            res.status(200).json(products);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: 'Internal server error' });
        }
    }),
    getProductById: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            if (!id)
                throw new Error('Missing product id');
            const product = yield product_service_1.productService.getProductById(parseInt(id));
            res.status(200).json(product);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: 'Internal server error' });
        }
    }),
    getProductsByRestaurantId: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            if (!id)
                throw new Error('Missing restaurant id');
            const products = yield product_service_1.productService.getProductsByRestaurantId(parseInt(id));
            res.status(200).json(products);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: 'Internal server error' });
        }
    }),
    addProduct: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const body = req.body;
            const file = req.file;
            if (!file)
                throw new Error('Missing image file');
            const input = yield Product_type_1.productSchema.parseAsync(Object.assign(Object.assign({}, body), { price: Number(body.price), restaurant_id: Number(body.restaurant_id) }));
            const newProduct = yield product_service_1.productService.addProduct(input, file);
            res.status(201).json(newProduct);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: 'Internal server error' });
        }
    }),
};
