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
  getAdminByClerkId: async (clerkId: string) => {
    const admin = await AdminRepository.findByClerkId(clerkId);
    return admin;
  },
  getAdminByStripeId: async (stripeId: string) => {
    const admin = await AdminRepository.findByStripeId(stripeId);
    return admin;
  },
  updateAdmin: async (id: number, adminData: Partial<Admin>) => {
    const admin = await AdminRepository.updateOne(id, adminData);
    return admin;
  },
  deleteAdmin: async (id: number) => {
    const admin = await AdminRepository.deleteById(id);
    return admin;
  }
}