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
exports.userAddressService = void 0;
const UserAddress_repository_1 = require("../repositories/UserAddress.repository");
exports.userAddressService = {
    findAll: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield UserAddress_repository_1.UserAddressRespository.findAll();
    }),
    findByUserId: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield UserAddress_repository_1.UserAddressRespository.findByUserId(userId);
    }),
    createOne: (data) => __awaiter(void 0, void 0, void 0, function* () {
        return yield UserAddress_repository_1.UserAddressRespository.createOne(data);
    }),
    updateOne: (id, data) => __awaiter(void 0, void 0, void 0, function* () {
        return yield UserAddress_repository_1.UserAddressRespository.updateOne(id, data);
    }),
    deleteOne: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield UserAddress_repository_1.UserAddressRespository.deleteOne(id);
    })
};
