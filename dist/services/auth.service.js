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
exports.authService = void 0;
const Admin_repository_1 = require("../repositories/Admin.repository");
const DeliveryDriver_repository_1 = require("../repositories/DeliveryDriver.repository");
const User_repository_1 = require("../repositories/User.repository");
const Admin_type_1 = require("../types/Admin.type");
const DeliveryDriver_type_1 = require("../types/DeliveryDriver.type");
const User_type_1 = require("../types/User.type");
exports.authService = {
    register: (data, role) => __awaiter(void 0, void 0, void 0, function* () {
        switch (role) {
            case 'user':
                const userData = yield User_type_1.userSchema.parseAsync(data);
                return yield User_repository_1.UserRepository.createOne(userData);
            case 'admin':
                const adminData = yield Admin_type_1.adminSchema.parseAsync(data);
                return yield Admin_repository_1.AdminRepository.createOne(adminData);
            case 'deliveryDriver':
                const deliveryDriverData = yield DeliveryDriver_type_1.deliveryDriverSchema.parseAsync(data);
                return yield DeliveryDriver_repository_1.DeliveryDriverRepository.createOne(deliveryDriverData);
            default:
                throw new Error('Invalid role');
        }
    })
};
