import axios from "axios";
import { redisService } from "./services/redis.service";

async function exitProcess(code: number) {
  try {
    console.log("Cerrando conexiones...");

    if (redisService.client) {
      await redisService.client.quit();
      console.log("Redis desconectado.");
    }
  } catch (error) {
    console.error("Error al cerrar conexiones:", error);
  } finally {
    console.log("Proceso finalizado con código:", code);
    process.exit(code);
  }
}

(async () => {
  try {
    console.log("Iniciando script...");
    await redisService.connect();
    console.log("Conectado a Redis.");

    const currentTime = Math.floor(Date.now() / 1000);
    const expiredOrders = await redisService.zrangebyscore("delayedOrders", 0, currentTime);

    if (!expiredOrders || expiredOrders.length === 0) {
      console.log("No se encontraron órdenes vencidas.");
      return exitProcess(0);
    }

    console.log(`Se encontraron ${expiredOrders.length} órdenes vencidas.`);

    for (const orderId of expiredOrders) {
      try {
        console.log(`Procesando orden vencida #${orderId}`);

        console.log("Editando orden...");
        await axios.put(`https://mealify-backv2.mausvil.dev/orders`, {
          id: orderId,
          status: "restaurant_delayed",
          delay_date: new Date(),
        });
        console.log("Notificación enviada.");

        console.log(`Orden #${orderId} procesada.`);
      } catch (error) {
        console.error(`Error al procesar orden #${orderId}:`, error);
      }
    }

    exitProcess(0);
  } catch (err) {
    console.error("Error general:", err);
    exitProcess(1);
  }
})();
