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
exports.userService = void 0;
const User_repository_1 = require("../repositories/User.repository");
exports.userService = {
    getAllUsers: () => __awaiter(void 0, void 0, void 0, function* () {
        const users = yield User_repository_1.UserRepository.findAll();
        return users;
    }),
    getUserById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield User_repository_1.UserRepository.findById(id);
        return user;
    }),
    getUserByClerkId: (clerkId) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield User_repository_1.UserRepository.findByClerkId(clerkId);
        return user;
    }),
    updateUser: (id, userData) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield User_repository_1.UserRepository.updateOne(id, userData);
        return user;
    }),
    deleteUser: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield User_repository_1.UserRepository.deleteById(id);
        return user;
    })
};
