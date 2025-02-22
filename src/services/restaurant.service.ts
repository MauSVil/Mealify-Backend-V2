import { Prisma } from "@prisma/client";
import { RestaurantRepository } from "../repositories/Restaurant.repository"
import { Restaurant } from "../types/Restaurant.type";
import { fileService } from "./file.service";
import { mapService } from "./map.service";

export const restaurantsService = {
  getRestaurants: async () => {
    return await RestaurantRepository.findAll({});
  },
  getRestaurantsByAdminId: async (adminId: number) => {
    const restaurants = await RestaurantRepository.findByAdmin(adminId);
    return restaurants;
  },
  getRestaurantById: async ({ id, includeRelations }: { id: number; includeRelations?: Prisma.restaurantsInclude}) => {
    return await RestaurantRepository.findById({ id, includeRelations });
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
  getCloseRestaurants: async ({ query, latitude, longitude}: { query: string; latitude: number; longitude: number }) => {
    const filters = {
      ...(query !== 'all' && { name: { contains: query } }),
    }

    const restaurants = await RestaurantRepository.findAll({ where: filters, includeRelations: { admins: true } });
    return restaurants.filter(restaurant => {
      const distance = mapService.getDistance({ lat: latitude, lon: longitude }, { lat: restaurant.latitude.toNumber(), lon: restaurant.longitude.toNumber() });
      return distance < 5 && restaurant.admins?.stripe_status === 'success';
    });
  },
  getTotals: async (id: number) => {
    const restaurants = await RestaurantRepository.findById({ id, includeRelations: { orders: { include: { order_items: true } } } });
    const total = restaurants.orders.filter(o => o.status === 'delivered' ).reduce((acc, order) => {
      return acc + order.order_items.reduce((acc, orderItem) => {
        return acc + orderItem.unit_price.toNumber();
      }, 0);
    }, 0);
    return total;
  },
  getDeliveredOrders: async (id: number) => {
    const restaurants = await RestaurantRepository.findById({ id, includeRelations: { orders: { include: { order_items: true } } } });
    return restaurants.orders.filter(o => o.status === 'delivered');
  }
}