import { DeliveryDriverRepository } from "../repositories/DeliveryDriver.repository";
import { DeliveryDriver } from "../types/DeliveryDriver.type";
import { mapService } from "./map.service";

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
  },
  findCandidates: async (restaurantLocation: { longitude: number; latitude: number }, userLocation: { longitude: number; latitude: number }) => {
    const { longitude, latitude } = restaurantLocation;
    const { longitude: userLongitude, latitude: userLatitude } = userLocation;
    const deliveryDrivers = await DeliveryDriverRepository.findAll();

    const activeDrivers = deliveryDrivers.filter(driver => driver.is_active);

    const candidates = activeDrivers.map(driver => {
      const distanceToRestaurant = mapService.getDistance({ lat: latitude, lon: longitude }, { lat: driver.latitude!, lon: driver.longitude! });
      const distanceToUser = mapService.getDistance({ lat: userLatitude, lon: userLongitude }, { lat: driver.latitude!, lon: driver.longitude! });

      return {
        ...driver,
        distanceToRestaurant,
        distanceToUser,
        score: distanceToRestaurant * 0.7 + distanceToUser * 0.3,
      };
    });

    candidates.sort((a, b) => a.score - b.score);

    return candidates;
  }
}