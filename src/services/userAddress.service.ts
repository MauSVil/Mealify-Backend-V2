import { UserAddressRespository } from "../repositories/UserAddress.repository";
import { UserAddress } from "../types/UserAddress.type";

export const userAddressService = {
  findAll: async () => {
    return await UserAddressRespository.findAll();
  },
  findByUserId: async (userId: number) => {
    return await UserAddressRespository.findByUserId(userId);
  },
  createOne: async (data: Omit<UserAddress, 'id' | 'createdAt' | 'updatedAt'>) => {
    return await UserAddressRespository.createOne(data);
  },
  updateOne: async (id: number, data: Partial<UserAddress>) => {
    return await UserAddressRespository.updateOne(id, data);
  },
  deleteOne: async (id: number) => {
    return await UserAddressRespository.deleteOne(id);
  }
};