import cron from "node-cron";
import { redisService } from "./services/redis.service";
import { orderService } from "./services/order.service";

export const startCronJobs = async () => {
  await redisService.connect();

  cron.schedule("*/20 * * * * *", async () => {
    try {
      const currentTime = Math.floor(Date.now() / 1000);

      const expiredOrders = await redisService.zrangebyscore('delayedOrders', 0, currentTime);
      if (!expiredOrders) throw new Error("No se encontraron órdenes vencidas.");

      for (const orderId of expiredOrders) {
        console.log(`Procesando orden expirada: ${orderId}`);

        await orderService.updateOne(Number(orderId), { status: "restaurant_delayed" });

        await redisService.zrem("delayedOrders", orderId);
      }
    } catch (err) {
      console.error("Error en el cron job:", err);
    }
  });

  console.log("Cron job configurado para ejecutarse cada 10 segundos.");
};