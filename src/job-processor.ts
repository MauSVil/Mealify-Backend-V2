import { orderService } from "./services/order.service";
import { redisService } from "./services/redis.service";

(async () => {
  try {
    console.log("Iniciando procesamiento de órdenes vencidas...");

    await redisService.connect();
    const currentTime = Math.floor(Date.now() / 1000);

    const expiredOrders = await redisService.zrangebyscore('delayedOrders', 0, currentTime);
    if (!expiredOrders) throw new Error("No se encontraron órdenes vencidas.");

    for (const orderId of expiredOrders) {
      console.log(`Procesando orden expirada: ${orderId}`);

      await orderService.updateOne(Number(orderId), { status: "restaurant_delayed" });

      await redisService.zrem("delayedOrders", orderId);
    }

    console.log("Procesamiento de órdenes vencidas completado.");
  } catch (err) {
    console.error("Error durante el procesamiento de órdenes vencidas:", err);
  } finally {
    await redisService.client?.quit();
  }
})();
