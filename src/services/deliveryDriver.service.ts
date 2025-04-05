import { Decimal } from "@prisma/client/runtime/library";
import { DeliveryDriverRepository } from "../repositories/DeliveryDriver.repository";
import { DeliveryDriver } from "../types/DeliveryDriver.type";
import { mapService } from "./map.service";
import { redisService } from "./redis.service";
import { fileService } from "./file.service";

export const deliveryDriverService = {
  getAllDeliveryDrivers: async () => {
    const deliveryDrivers = await DeliveryDriverRepository.findAll({});
    return deliveryDrivers;
  },
  getDeliveryDriverById: async (id: number) => {
    const deliveryDriver = await DeliveryDriverRepository.findById(id);
    return deliveryDriver;
  },
  updateDeliveryDriver: async (id: number, deliveryDriverData: Partial<DeliveryDriver>, file?: Express.Multer.File) => {
    delete deliveryDriverData.id;
    const deliveryDriverUpdated = await DeliveryDriverRepository.updateOne(id, deliveryDriverData);

    if (file && file?.buffer) {
      const sizes = [800];
      const extension = 'webp';
      const compressedFiles = await fileService.compressImage(file.buffer, extension, sizes, 100, { rotate: 90 });
      const urls = await Promise.all(compressedFiles.map(async (compessedFile, idx) => {
        return await fileService.uploadImage('deliverydrivers', `${deliveryDriverUpdated.id}/image-${sizes[idx]}.${extension}`, compessedFile);
      }));
      const { id, ...rest } = deliveryDriverUpdated;
      return await DeliveryDriverRepository.updateOne(
        deliveryDriverUpdated.id!,
        {
          ...rest,
          image: urls[0],
        }
      );
    }

    return deliveryDriverUpdated;
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
      where: { is_active: true, status: 'available' },
      includeRelations: { orders: true },
    });

    const eligibleDrivers: DeliveryDriver[] = [];

    for (const driver of deliveryDrivers) {
      const { id } = driver;
      const orderCountKey = `driver_orders:${id}`;
      // const timeWindowKey = `driver_window_expired:${id}`;
  
      const orderCount = await redisService.get(orderCountKey);
      // const windowExists = await redisService.get(timeWindowKey);

      if (Number(orderCount) === 1) continue;
      // if (Number(orderCount) >= 1 && !windowExists) continue;

      eligibleDrivers.push(driver);
    }

    const candidates = [];
    for await (const driver of eligibleDrivers) {
      const redisDriverPosition = await redisService.get(`location:${driver.id}`);
      const { lat, lng } = JSON.parse(redisDriverPosition!);

      const distanceToRestaurant = mapService.getDistance(
        { lat: latitude, lon: longitude },
        { lat, lon: lng }
      );
      const distanceToUser = mapService.getDistance(
        { lat: userLatitude, lon: userLongitude },
        { lat, lon: lng }
      );

      candidates.push({
        ...driver,
        latitude: lat,
        longitude: lng,
        distanceToRestaurant,
        distanceToUser,
        score: distanceToRestaurant * 0.7 + distanceToUser * 0.3,
      });
    }
  
    candidates.sort((a, b) => a.score - b.score);
  
    return candidates;
  }
}