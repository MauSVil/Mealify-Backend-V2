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
exports.restaurantsController = void 0;
const restaurant_service_1 = require("../services/restaurant.service");
const Restaurant_type_1 = require("../types/Restaurant.type");
exports.restaurantsController = {
    getAllRestaurants: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const restaurants = yield restaurant_service_1.restaurantsService.getRestaurants();
            res.status(200).json(restaurants);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: 'Internal server error' });
        }
    }),
    getRestaurantById: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            if (!id)
                throw new Error('Missing restaurant id');
            const restaurant = yield restaurant_service_1.restaurantsService.getRestaurantById(parseInt(id));
            res.status(200).json(restaurant);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: 'Internal server error' });
        }
    }),
    addRestaurant: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const body = req.body;
            const file = req.file;
            if (!file)
                throw new Error('Missing image file');
            const input = yield Restaurant_type_1.restaurantSchema.parseAsync(Object.assign(Object.assign(Object.assign({}, body), (body.delivery_fee && { delivery_fee: Number(body.delivery_fee) })), { latitude: Number(body.latitude), longitude: Number(body.longitude) }));
            const newRestaurant = yield restaurant_service_1.restaurantsService.addRestaurant(input, file);
            res.status(201).json(newRestaurant);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: 'Internal server error' });
        }
    }),
    getCloseRestaurants: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { latitude, longitude } = req.params;
            if (!latitude || !longitude)
                throw new Error('Missing latitude or longitude');
            const closeRestaurants = yield restaurant_service_1.restaurantsService.getCloseRestaurants(parseFloat(latitude), parseFloat(longitude));
            res.status(200).json(closeRestaurants);
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
