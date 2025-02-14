import { orderService } from "src/services/order.service";
import { redisService } from "src/services/redis.service";

redisService.connect();

const init = async () => {
  try {
    const id = 203;
    const delivery_driver = '2';
  
    const orderLockKey = `order_locked:${id}`;
    const orderCountKey = `driver_orders:${delivery_driver}`;
    const timeWindowKey = `driver_window_expired:${delivery_driver}`;
  
    const lockAcquired = await redisService.set(orderLockKey, delivery_driver, { NX: true, EX: 60 });
  
    if (lockAcquired !== "OK") {
      throw new Error('Order already accepted by another driver');
    }

    await redisService.persist(orderLockKey);
  
    const currentOrders = await redisService.incr(orderCountKey);
  
    if (currentOrders === 1) {
      await redisService.set(timeWindowKey, '1', { EX: 180 }); // 3 minutes
    }
  
    await orderService.updateOne(id, { driver_id: Number(delivery_driver) });

    process.exit(0);
  } catch (error) {
    console.error(error);
  }

};

init();