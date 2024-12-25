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
exports.adminService = void 0;
const Admin_repository_1 = require("../repositories/Admin.repository");
exports.adminService = {
    getAllAdmins: () => __awaiter(void 0, void 0, void 0, function* () {
        const admins = yield Admin_repository_1.AdminRepository.findAll();
        return admins;
    }),
    getAdminById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const admin = yield Admin_repository_1.AdminRepository.findById(id);
        return admin;
    }),
    updateAdmin: (id, adminData) => __awaiter(void 0, void 0, void 0, function* () {
        const admin = yield Admin_repository_1.AdminRepository.updateOne(id, adminData);
        return admin;
    }),
    deleteAdmin: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const admin = yield Admin_repository_1.AdminRepository.deleteById(id);
        return admin;
    })
};
