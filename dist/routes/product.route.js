"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const product_controller_1 = require("../controllers/product.controller");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)();
router.get('/restaurant/:id', product_controller_1.productsController.getProductsByRestaurantId);
router.get('/:id', product_controller_1.productsController.getProductById);
router.get('/', product_controller_1.productsController.getAllProducts);
router.post('/', upload.single('image'), product_controller_1.productsController.addProduct);
exports.default = router;
