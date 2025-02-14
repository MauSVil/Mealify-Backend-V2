import { Queue, Worker, Job, QueueEvents } from 'bullmq';
import Redis from 'ioredis';
import { deliveryDriverService } from './deliveryDriver.service';
import { orderService } from './order.service';
import { redisService } from './redis.service';

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
      delay: 10000,
    },
  },
});

export const orderWorker = new Worker(
  'orderQueue',
  async (job: Job) => {
    try {
      if (job.name === 'assignDelivery') {
        const { orderId } = job.data;
        const order = await orderService.findById({ id: Number(orderId), includeRelations: { restaurants: true } });
        if (!order) throw new Error(`Order with id ${orderId} not found`);
        const deliveryDrivers = await deliveryDriverService.findCandidates(
          { longitude: order.longitude, latitude: order.latitude },
          { longitude: order.restaurants.longitude, latitude: order.restaurants.latitude }
        );

        if (!deliveryDrivers.length) {
          throw new Error(`No delivery drivers found for order ${orderId}`);
        }
        
        for (const driver of deliveryDrivers) {
          const orderlock = await redisService.get(`order_locked:${orderId}`);
          if (orderlock) break;

          console.log('Asking driver', driver.id, 'to take order', orderId);
          await sleep(30000);
        }
      }
      if (job.name === 'notifyDriverToDeliver') {
        console.log('Notifying driver to deliver order', job.data);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error processing job ${job.id}: ${error.message}`);
      }
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
