import { orderService } from "src/services/order.service";
import { redisService } from "src/services/redis.service";

redisService.connect();

const init = async () => {
  try {
    const id = 203;
    const delivery_driver = "2";

    const orderLockKey = `order_locked:${id}`;
    const orderCountKey = `driver_orders:${delivery_driver}`;
    const timeWindowKey = `driver_window_expired:${delivery_driver}`;

    const currentOrders = Number(await redisService.get(orderCountKey)) || 0;

    if (currentOrders >= 3) {
      throw new Error("🚫 You have reached the maximum number of active orders.");
    }

    if (currentOrders > 0) {
      const windowExists = await redisService.get(timeWindowKey);
      if (!windowExists) {
        throw new Error("⏳ Your acceptance window has expired.");
      }
    }

    const lockAcquired = await redisService.set(orderLockKey, delivery_driver, { NX: true, EX: 60 });

    if (lockAcquired !== "OK") {
      throw new Error("❌ Order already accepted by another driver.");
    }

    await redisService.persist(orderLockKey);

    const newOrderCount = await redisService.incr(orderCountKey);

    if (newOrderCount === 1) {
      await redisService.set(timeWindowKey, "1", { EX: 180 });
    }

    await orderService.updateOne(id, { driver_id: Number(delivery_driver) });

    console.log(`✅ Order ${id} assigned to driver ${delivery_driver}`);

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

init();