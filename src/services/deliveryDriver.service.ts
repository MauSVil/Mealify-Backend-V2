import { Decimal } from "@prisma/client/runtime/library";
import { DeliveryDriverRepository } from "../repositories/DeliveryDriver.repository";
import { DeliveryDriver } from "../types/DeliveryDriver.type";
import { mapService } from "./map.service";
import { redisService } from "./redis.service";
import { orderService } from "./order.service";

export const deliveryDriverService = {
  getAllDeliveryDrivers: async () => {
    const deliveryDrivers = await DeliveryDriverRepository.findAll({});
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
  getUserByClerkId: async (clerkId: string) => {
    const user = await DeliveryDriverRepository.findByClerkId(clerkId);
    return user;
  },
  findCandidates: async (
    restaurantLocation: { longitude: Decimal; latitude: Decimal },
    userLocation: { longitude: Decimal; latitude: Decimal }
  ) => {
    const { longitude, latitude } = restaurantLocation;
    const { longitude: userLongitude, latitude: userLatitude } = userLocation;
  
    const deliveryDrivers = await DeliveryDriverRepository.findAll({
      where: { is_active: true },
      includeRelations: { orders: true },
    });

    const eligibleDrivers: DeliveryDriver[] = [];

    for (const driver of deliveryDrivers) {
      const { id } = driver;
      const orderCountKey = `driver_orders:${id}`;
      const timeWindowKey = `driver_window_expired:${id}`;
  
      const orderCount = await redisService.get(orderCountKey);
      const windowExists = await redisService.get(timeWindowKey);

      if (Number(orderCount) >= 3) continue;

      if (Number(orderCount) >= 1 && !windowExists) continue;

      eligibleDrivers.push(driver);
    }
  
    const candidates = eligibleDrivers.map(driver => {
      const distanceToRestaurant = mapService.getDistance(
        { lat: latitude, lon: longitude },
        { lat: driver.latitude!, lon: driver.longitude! }
      );
      const distanceToUser = mapService.getDistance(
        { lat: userLatitude, lon: userLongitude },
        { lat: driver.latitude!, lon: driver.longitude! }
      );
  
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