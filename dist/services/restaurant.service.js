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
exports.restaurantsService = void 0;
const Restaurant_repository_1 = require("../repositories/Restaurant.repository");
const file_service_1 = require("./file.service");
const map_service_1 = require("./map.service");
exports.restaurantsService = {
    getRestaurants: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield Restaurant_repository_1.RestaurantRepository.findAll();
    }),
    getRestaurantById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield Restaurant_repository_1.RestaurantRepository.findById(id);
    }),
    addRestaurant: (restaurant, file) => __awaiter(void 0, void 0, void 0, function* () {
        const restaurantCreated = yield Restaurant_repository_1.RestaurantRepository.createOne(restaurant);
        const sizes = [200, 400, 800];
        const extension = 'webp';
        const compressedFiles = yield file_service_1.fileService.compressImage(file.buffer, extension, sizes);
        const urls = yield Promise.all(compressedFiles.map((compessedFile, idx) => __awaiter(void 0, void 0, void 0, function* () {
            return yield file_service_1.fileService.uploadImage('businesses', `${restaurantCreated.id}/image-${sizes[idx]}.${extension}`, compessedFile);
        })));
        const { delivery_fee, latitude, longitude, } = restaurantCreated;
        return yield Restaurant_repository_1.RestaurantRepository.updateOne(restaurantCreated.id, Object.assign(Object.assign({}, restaurantCreated), { hero_image_min: urls[0], hero_image_med: urls[1], hero_image_max: urls[2], delivery_fee: delivery_fee.toNumber(), latitude: latitude.toNumber(), longitude: longitude.toNumber() }));
    }),
    getRestaurantsByAdminId: (adminId) => __awaiter(void 0, void 0, void 0, function* () {
        const restaurants = yield Restaurant_repository_1.RestaurantRepository.findAll();
        return restaurants.filter(restaurant => restaurant.admin_id === adminId);
    }),
    getCloseRestaurants: (latitude, longitude) => __awaiter(void 0, void 0, void 0, function* () {
        const restaurants = yield Restaurant_repository_1.RestaurantRepository.findAll();
        return restaurants.filter(restaurant => {
            const distance = map_service_1.mapService.getDistance({ lat: latitude, lon: longitude }, { lat: restaurant.latitude.toNumber(), lon: restaurant.longitude.toNumber() });
            return distance < 5;
        });
    }),
};
