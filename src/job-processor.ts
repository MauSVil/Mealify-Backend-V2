import { discordService } from "./services/discord.service";
import { orderService } from "./services/order.service";
import { redisService } from "./services/redis.service";
import webSocketService from "./services/webSocket.service";

(async () => {
  try {
    console.log("Iniciando procesamiento de órdenes vencidas...");

    await redisService.connect();
    await discordService.init(process.env.DISCORD_BOT_TOKEN!);
    await discordService.addChannel('general', process.env.GENERAL_CHANNEL!);
    const currentTime = Math.floor(Date.now() / 1000);

    const expiredOrders = await redisService.zrangebyscore('delayedOrders', 0, currentTime);
    if (!expiredOrders) throw new Error("No se encontraron órdenes vencidas.");

    for (const orderId of expiredOrders) {
      console.log(`Procesando orden expirada: ${orderId}`);

      await orderService.updateOne(Number(orderId), { status: "restaurant_delayed" });
      await webSocketService.emitToRoom('message', `order_${orderId}`, { type: 'order_status_change', payload: { status: 'restaurant_delayed' } });

      await discordService.sendMessage('general', `La orden #${orderId} ha sido marcada como retrasada por el restaurante.`);

      await redisService.zrem("delayedOrders", orderId);
    }

    console.log("Procesamiento de órdenes vencidas completado.");
  } catch (err) {
    console.error("Error durante el procesamiento de órdenes vencidas:", err);
  } finally {
    await redisService.client?.quit();
    await discordService.client?.destroy();
  }
})();
