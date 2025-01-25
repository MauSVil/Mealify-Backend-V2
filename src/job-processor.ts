import { discordService } from "./services/discord.service";
import { orderService } from "./services/order.service";
import { redisService } from "./services/redis.service";
import webSocketService from "./services/webSocket.service";

(async () => {
  try {
    await redisService.connect();

    await discordService.init(process.env.DISCORD_BOT_TOKEN!);

    await discordService.addChannel('general', process.env.GENERAL_CHANNEL!);

    const currentTime = Math.floor(Date.now() / 1000);

    const expiredOrders = await redisService.zrangebyscore('delayedOrders', 0, currentTime);

    if (!expiredOrders || expiredOrders.length === 0) {
      console.log("No se encontraron órdenes vencidas.");
      process.exit(0);
    }

    for (const orderId of expiredOrders) {
      console.log(`Procesando orden vencida #${orderId}`);
      await orderService.updateOne(Number(orderId), { status: "restaurant_delayed" });
      await webSocketService.emitToRoom('message', `order_${orderId}`, { type: 'order_status_change', payload: { status: 'restaurant_delayed' } });
      await discordService.sendMessage('general', `La orden #${orderId} ha sido marcada como retrasada por el restaurante.`);
      await redisService.zrem("delayedOrders", orderId);
    }

    await redisService.client?.quit();
  } catch (err) {
    console.error("Error durante el procesamiento de órdenes vencidas:", err);
  }
  console.log("Saliendo del proceso...");
  process.exit(0);
})();
