import { AdminRepository } from "../repositories/Admin.repository";
import { Admin } from "../types/Admin.type";

export const adminService = {
  getAllAdmins: async () => {
    const admins = await AdminRepository.findAll();
    return admins;
  },
  getAdminById: async (id: number) => {
    const admin = await AdminRepository.findById(id);
    return admin;
  },
  updateAdmin: async (id: number, adminData: Admin) => {
    const admin = await AdminRepository.updateOne(id, adminData);
    return admin;
  },
  deleteAdmin: async (id: number) => {
    const admin = await AdminRepository.deleteById(id);
    return admin;
  }
}