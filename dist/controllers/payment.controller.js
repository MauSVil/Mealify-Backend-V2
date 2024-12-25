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
exports.paymentController = void 0;
const payment_service_1 = require("../services/payment.service");
const restaurant_service_1 = require("../services/restaurant.service");
const map_service_1 = require("../services/map.service");
const user_service_1 = require("../services/user.service");
const order_service_1 = require("../services/order.service");
exports.paymentController = {
    createPaymentIntent: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, email, amount, restaurant, userLatitude, userLongitude } = req.body;
            if (!name || !email || !amount || !restaurant || !userLatitude || !userLongitude)
                throw new Error('Missing required fields');
            const restaurantFound = yield restaurant_service_1.restaurantsService.getRestaurantById(Number(restaurant));
            if (!restaurantFound)
                throw new Error('Restaurant not found');
            const { latitude, longitude } = restaurantFound;
            const { distanceInKm } = yield map_service_1.mapService.getRealDistance({ lat: latitude.toNumber(), lon: longitude.toNumber() }, { lat: userLatitude, lon: userLongitude });
            const shippingCostPerKm = distanceInKm * restaurantFound.delivery_fee.toNumber();
            const customer = yield payment_service_1.paymentService.createCustomer(name, email);
            const paymentIntent = yield payment_service_1.paymentService.createPaymentIntent(amount, shippingCostPerKm, customer);
            res.status(200).json({ paymentIntent, customer: customer === null || customer === void 0 ? void 0 : customer.id });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: 'Internal server error' });
        }
    }),
    pay: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { payment_method_id, payment_intent_id, customer_id, cart, userLatitude, userLongitude, } = req.body;
            if (!payment_method_id || !payment_intent_id || !customer_id || !cart || !Object.keys(cart).length || !userLatitude || !userLongitude)
                throw new Error('Missing required fields');
            const { userId } = req.auth;
            const user = yield user_service_1.userService.getUserByClerkId(userId);
            if (!(user === null || user === void 0 ? void 0 : user.id))
                throw new Error('User not found');
            const restaurantId = Number(Object.values(cart)[0].restaurant_id);
            const restaurant = yield restaurant_service_1.restaurantsService.getRestaurantById(restaurantId);
            if (!restaurant)
                throw new Error('Restaurant not found');
            console.log('------ Orden ------');
            console.log(`Usuario: ${user.id}`);
            console.log(`Restaurante: ${restaurant.id}`);
            console.log(`Delivery Fee: ${restaurant.delivery_fee.toNumber()}`);
            console.log('-------------------');
            const amount = Object.values(cart).reduce((acc, { price, quantity }) => acc + price * quantity, 0);
            const { distanceInKm } = yield map_service_1.mapService.getRealDistance({ lat: restaurant.latitude.toNumber(), lon: restaurant.longitude.toNumber() }, { lat: userLatitude, lon: userLongitude });
            const deliveryFeeAmount = restaurant.delivery_fee.toNumber() * distanceInKm;
            const totalFinal = payment_service_1.paymentService.getTotal(amount, deliveryFeeAmount);
            const order = yield order_service_1.orderService.createOne({
                user_id: user.id,
                restaurant_id: restaurant.id,
                delivery_fee: distanceInKm * restaurant.delivery_fee.toNumber(),
                status: 'pending',
                payment_status: 'pending',
                total_price: totalFinal,
                payment_intent_id,
                latitude: userLatitude,
                longitude: userLongitude,
            });
            const result = yield payment_service_1.paymentService.pay(payment_method_id, payment_intent_id, customer_id);
            res.status(200).json({ result, orderId: order.id });
        }
        catch (error) {
            console.log({ error });
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: 'Internal server error' });
        }
    })
};
