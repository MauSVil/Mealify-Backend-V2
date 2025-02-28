import { orderService } from "./services/order.service";
import { redisService } from "./services/redis.service";
import { io } from "socket.io-client";

const socket = io("https://mealify-backv2.mausvil.dev", {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

socket.on("connect", () => {
  console.log("Conectado al servidor WebSocket");
});

socket.on("connect_error", (err) => {
  console.error("Error al conectar al WebSocket:", err.message);
});

async function exitProcess(code: number) {
  try {
    console.log("Cerrando conexiones...");

    if (redisService.client) {
      await redisService.client.quit();
      console.log("Redis desconectado.");
    }

    if (socket.connected) {
      socket.disconnect();
      console.log("WebSocket desconectado.");
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

    await new Promise((resolve) => {
      if (socket.connected) {
        resolve(null);
      } else {
        socket.once("connect", () => resolve(null));
      }
    });

    if (!expiredOrders || expiredOrders.length === 0) {
      console.log("No se encontraron órdenes vencidas.");
      return exitProcess(0);
    }

    for (const orderId of expiredOrders) {
      try {
        console.log(`Procesando orden vencida #${orderId}`);
        await orderService.updateOne(Number(orderId), { status: "restaurant_delayed", delay_date: new Date() });

        socket.emit("emitToRoom", {
          roomId: `order_${orderId}`,
          message: {
            type: "order_status_change",
            payload: { status: "restaurant_delayed" },
          }
        })

        await redisService.zrem("delayedOrders", orderId);
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
