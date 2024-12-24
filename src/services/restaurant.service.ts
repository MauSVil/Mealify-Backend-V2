import { RestaurantRepository } from "../repositories/Restaurant.repository"
import { Restaurant } from "../types/Restaurant.type";
import { fileService } from "./file.service";
import { mapService } from "./map.service";

export const restaurantsService = {
  getRestaurants: async () => {
    return await RestaurantRepository.findAll();
  },
  getRestaurantById: async (id: number) => {
    return await RestaurantRepository.findById(id);
  },
  addRestaurant: async (restaurant: Restaurant, file: Express.Multer.File) => {
    const restaurantCreated = await RestaurantRepository.createOne(restaurant);

    const sizes = [200, 400, 800];
    const extension = 'webp';
    const compressedFiles = await fileService.compressImage(file.buffer, extension, sizes);
    const urls = await Promise.all(compressedFiles.map(async (compessedFile, idx) => {
      return await fileService.uploadImage('businesses', `${restaurantCreated.id}/image-${sizes[idx]}.${extension}`, compessedFile);
    }));

    const {
      delivery_fee,
      latitude,
      longitude,
    } = restaurantCreated;

    return await RestaurantRepository.updateOne(
      restaurantCreated.id,
      {
        ...restaurantCreated,
        hero_image_min: urls[0],
        hero_image_med: urls[1],
        hero_image_max: urls[2],
        delivery_fee: delivery_fee.toNumber(),
        latitude: latitude.toNumber(),
        longitude: longitude.toNumber(),
      }
    );
  },
  getRestaurantsByAdminId: async (adminId: number) => {
    const restaurants = await RestaurantRepository.findAll();
    return restaurants.filter(restaurant => restaurant.admin_id === adminId);
  },
  getCloseRestaurants: async (latitude: number, longitude: number) => {
    const restaurants = await RestaurantRepository.findAll();
    return restaurants.filter(restaurant => {
      const distance = mapService.getDistance({ lat: latitude, lon: longitude }, { lat: restaurant.latitude.toNumber(), lon: restaurant.longitude.toNumber() });
      return distance < 5;
    });
  },
}