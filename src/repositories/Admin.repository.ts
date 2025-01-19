import { Admin } from '../types/Admin.type';
import { prisma } from '../prisma';

export const AdminRepository = {
  findAll: async (): Promise<Admin[]> => {
    return await prisma.admins.findMany();
  },
  findById: async (id: number): Promise<Admin | null> => {
    return await prisma.admins.findUnique({
      where: {
        id: id,
      },
    });
  },
  findByClerkId: async (clerkId: string): Promise<Admin | null> => {
    return await prisma.admins.findFirst({
      where: {
        clerk_user_id: clerkId,
      },
    });
  },
  findByStripeId: async (stripeId: string): Promise<Admin | null> => {
    return await prisma.admins.findFirst({
      where: {
        stripe_account: stripeId,
      },
    });
  },
  createOne: async (adminData: Omit<Admin, 'id' | 'createdAt' | 'updatedAt'>): Promise<Admin> => {
    return await prisma.admins.create({
      data: adminData
    });
  },
  updateOne: async (id: number, adminData: Partial<Omit<Admin, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Admin> => {
    return await prisma.admins.update({
      where: {
        id: id,
      },
      data: adminData,
    });
  },
  deleteById: async (id: number): Promise<void> => {
    await prisma.admins.delete({
      where: {
        id: id,
      },
    });
  },
}