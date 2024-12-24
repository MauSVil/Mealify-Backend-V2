import { DeliveryDriverRepository } from "../repositories/DeliveryDriver.repository";
import { DeliveryDriver } from "../types/DeliveryDriver.type";

export const deliveryDriverService = {
  getAllDeliveryDrivers: async () => {
    const deliveryDrivers = await DeliveryDriverRepository.findAll();
    return deliveryDrivers;
  },
  getDeliveryDriverById: async (id: number) => {
    const deliveryDriver = await DeliveryDriverRepository.findById(id);
    return deliveryDriver;
  },
  updateDeliveryDriver: async (id: number, deliveryDriverData: DeliveryDriver) => {
    const deliveryDriver = await DeliveryDriverRepository.updateOne(id, deliveryDriverData);
    return deliveryDriver;
  },
  deleteDeliveryDriver: async (id: number) => {
    const deliveryDriver = await DeliveryDriverRepository.deleteById(id);
    return deliveryDriver;
  }
}