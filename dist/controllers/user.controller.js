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
exports.userController = void 0;
const user_service_1 = require("../services/user.service");
exports.userController = {
    getUsers: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const users = yield user_service_1.userService.getAllUsers();
            res.status(200).json(users);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
                return;
            }
            res.status(500).json({ message: "Internal server error" });
        }
    }),
    getUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            if (!id)
                throw new Error("Id is required");
            const idNumber = parseInt(id);
            const user = yield user_service_1.userService.getUserById(idNumber);
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            res.status(200).json(user);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
                return;
            }
            res.status(500).json({ message: "Internal server error" });
        }
    }),
    updateUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
                return;
            }
            res.status(500).json({ message: "Internal server error" });
        }
    }),
    deleteUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
                return;
            }
            res.status(500).json({ message: "Internal server error" });
        }
    })
};
