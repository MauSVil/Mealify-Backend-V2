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
exports.userAddressController = void 0;
const userAddress_service_1 = require("../services/userAddress.service");
const UserAddress_type_1 = require("../types/UserAddress.type");
const user_service_1 = require("../services/user.service");
exports.userAddressController = {
    getUserAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.auth;
                const user = yield user_service_1.userService.getUserByClerkId(userId);
                if (!user || !user.id)
                    throw new Error('User not found');
                const addresses = yield userAddress_service_1.userAddressService.findByUserId(user.id);
                res.status(200).json(addresses);
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(400).json({ error: error.message });
                    return;
                }
                res.status(400).json({ error: 'An error occurred' });
            }
        });
    },
    createUserAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.auth;
                const user = yield user_service_1.userService.getUserByClerkId(userId);
                if (!user || !user.id)
                    throw new Error('User not found');
                const body = req.body;
                body.user_id = user.id;
                const parsedBody = yield UserAddress_type_1.userAddressSchema.parseAsync(body);
                const address = yield userAddress_service_1.userAddressService.createOne(parsedBody);
                res.status(201).json(address);
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(400).json({ error: error.message });
                    return;
                }
                res.status(400).json({ error: 'An error occurred' });
            }
        });
    },
    updateUserAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(400).json({ error: error.message });
                    return;
                }
                res.status(400).json({ error: 'An error occurred' });
            }
        });
    },
    deleteUserAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id)
                    throw new Error('Address ID is required');
                const address = yield userAddress_service_1.userAddressService.deleteOne(Number(id));
                res.status(200).json(address);
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(400).json({ error: error.message });
                    return;
                }
                res.status(400).json({ error: 'An error occurred' });
            }
        });
    },
};
