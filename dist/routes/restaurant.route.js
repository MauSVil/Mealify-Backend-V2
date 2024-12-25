"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const restaurant_controller_1 = require("../controllers/restaurant.controller");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)();
router.get('/:latitude/:longitude', restaurant_controller_1.restaurantsController.getCloseRestaurants);
router.get('/:id', restaurant_controller_1.restaurantsController.getRestaurantById);
router.get('/', restaurant_controller_1.restaurantsController.getAllRestaurants);
router.post('/', upload.single('image'), restaurant_controller_1.restaurantsController.addRestaurant);
exports.default = router;
