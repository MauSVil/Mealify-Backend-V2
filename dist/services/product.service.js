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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = void 0;
const Product_repository_1 = require("../repositories/Product.repository");
const file_service_1 = require("./file.service");
exports.productService = {
    getAllProducts: () => __awaiter(void 0, void 0, void 0, function* () {
        const products = yield Product_repository_1.ProductRepository.findAll();
        return products;
    }),
    getProductById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const product = yield Product_repository_1.ProductRepository.findById(id);
        return product;
    }),
    getProductsByRestaurantId: (restaurantId) => __awaiter(void 0, void 0, void 0, function* () {
        const products = yield Product_repository_1.ProductRepository.findByRestaurantId(restaurantId);
        return products;
    }),
    addProduct: (product, file) => __awaiter(void 0, void 0, void 0, function* () {
        const productCreated = yield Product_repository_1.ProductRepository.createOne(product);
        const sizes = [200, 400, 800];
        const extension = 'webp';
        const compressedFiles = yield file_service_1.fileService.compressImage(file.buffer, extension, sizes);
        const urls = yield Promise.all(compressedFiles.map((compessedFile, idx) => __awaiter(void 0, void 0, void 0, function* () {
            return yield file_service_1.fileService.uploadImage('products', `${productCreated.id}/image-${sizes[idx]}.${extension}`, compessedFile);
        })));
        const { id, price, restaurant_id } = productCreated, rest = __rest(productCreated, ["id", "price", "restaurant_id"]);
        return yield Product_repository_1.ProductRepository.updateOne(productCreated.id, Object.assign(Object.assign({}, rest), { image_min: urls[0], image_med: urls[1], image_max: urls[2], price: price.toNumber() }));
    }),
};
