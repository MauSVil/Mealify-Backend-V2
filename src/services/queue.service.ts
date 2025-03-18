import { Queue, Worker, Job, QueueEvents } from 'bullmq';
import Redis from 'ioredis';
import { deliveryDriverService } from './deliveryDriver.service';
import { orderService } from './order.service';
import { redisService } from './redis.service';
import { pushNotificationService } from './pushNotification.service';

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const redisConnection = new Redis({
  host: process.env.REDIS_HOST! || "localhost",
  port: Number(process.env.REDIS_PORT! || 6379),
  maxRetriesPerRequest: null,
  password: process.env.REDIS_PASSWORD! || undefined,
});

export const orderQueue = new Queue('orderQueue', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 30000,
    },
  },
});

export const orderWorker = new Worker(
  "orderQueue",
  async (job: Job) => {
    try {
      if (job.name === "assignDelivery") {
        const { orderId } = job.data;
        const order = await orderService.findById({
          id: Number(orderId),
          includeRelations: { restaurants: true }
        });

        if (!order) throw new Error(`❌ Order with id ${orderId} not found`);

        const deliveryDrivers = await deliveryDriverService.findCandidates(
          { longitude: order.longitude, latitude: order.latitude },
          { longitude: order.restaurants.longitude, latitude: order.restaurants.latitude }
        );

        if (!deliveryDrivers.length) {
          console.log(`⚠️ No delivery drivers found for order ${orderId}`);
          throw new Error(`❌ No delivery drivers found for order ${orderId}`);
        }

        console.log(`🚛 Found ${deliveryDrivers.length} drivers for order ${orderId}`);

        for (const driver of deliveryDrivers) {
          console.log(`🚗 Notifying driver ${driver.id} about order ${orderId}`);
          const orderLock = await redisService.get(`order_locked:${orderId}`);
          
          if (orderLock) {
            console.log(`✅ Order ${orderId} already accepted by driver ${orderLock}`);
            return;
          }

          await pushNotificationService.send(
            driver.tokens,
            `🚨 Nueva orden disponible`,
            `🍔 Acepta la orden lo antes posible`,
            {
              screen: `/accept-order/${orderId}`,
            }
          )

          console.log(`📢 Asking driver ${driver.id} to take order ${orderId}`);

          await sleep(30000);
        }

        const finalOrderLock = await redisService.get(`order_locked:${orderId}`);
        if (!finalOrderLock) {
          console.log(`⏳ No driver accepted order ${orderId} within the time window.`);
          throw new Error(`❌ No driver accepted order ${orderId} within the time window.`);
        }

        console.log(`🚀 Order ${orderId} confirmed by driver ${finalOrderLock}`);
      }

      if (job.name === "notifyDriverToDeliver") {
        console.log("📦 Notifying driver to deliver order", job.data);
      }
    } catch (error) {
      console.error(`💀 Error processing job ${job.id}: ${error instanceof Error ? error.message : error}`);
      throw error;
    }
  },
  {
    connection: redisConnection,
  }
);

const orderQueueEvents = new QueueEvents('orderQueue', { connection: redisConnection });

orderQueueEvents.on('failed', async ({ jobId, failedReason }) => {
  console.error(`🚨 Job ${jobId} ha fallado definitivamente: ${failedReason}`);
});
