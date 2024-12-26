import amqp, { Connection, Channel, Message } from 'amqplib';
import dotenv from 'dotenv';
import { handlePaymentSuccess } from '../handlers/rabbit/handlePaymentSuccess';
import { handlePaymentCancelled } from '../handlers/rabbit/handlePaymentCancelled';

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';

let connection: Connection | null = null;
let channel: Channel | null = null;

const consumers: {
    queue: string;
    exchange: string;
    routingKey: string;
    handler: (msg: any) => Promise<void>;
}[] = [
  {
      queue: 'order_updates',
      exchange: 'payments',
      routingKey: 'order.payment.success',
      handler: handlePaymentSuccess,
  },
  {
      queue: 'order_cancellations',
      exchange: 'orders',
      routingKey: 'order.cancelled',
      handler: handlePaymentCancelled,
  },
];

export const rabbitService = {
    async connect() {
        if (!RABBITMQ_URL) {
            throw new Error('RabbitMQ URL is not set in environment variables');
        }

        if (!connection) {
            try {
                connection = await amqp.connect(RABBITMQ_URL);
                channel = await connection.createChannel();
                console.log('RabbitMQ connected');

                connection.on('error', (err) => {
                    console.error('RabbitMQ connection error:', err);
                    connection = null;
                    channel = null;
                });

                connection.on('close', () => {
                    console.warn('RabbitMQ connection closed. Reconnecting...');
                    connection = null;
                    channel = null;
                    setTimeout(rabbitService.connect, 5000);
                });
            } catch (err) {
                console.error('Failed to connect to RabbitMQ:', err);
                setTimeout(rabbitService.connect, 5000);
            }
        }

        return { connection, channel };
    },

    getChannel(): Channel {
        if (!channel) {
            throw new Error('RabbitMQ channel is not initialized. Call connect first.');
        }
        return channel;
    },

    async publishMessage(exchange: string, routingKey: string, message: any) {
        const ch = this.getChannel();

        await ch.assertExchange(exchange, 'topic', { durable: true });
        ch.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)));

        console.log(`Message published to ${exchange} with key ${routingKey}:`, message);
    },

    addConsumer(queue: string, exchange: string, routingKey: string, handler: (msg: any) => Promise<void>) {
        consumers.push({ queue, exchange, routingKey, handler });
    },

    async registerConsumers() {
        const ch = this.getChannel();

        for (const consumer of consumers) {
            await ch.assertExchange(consumer.exchange, 'topic', { durable: true });
            await ch.assertQueue(consumer.queue, { durable: true });
            await ch.bindQueue(consumer.queue, consumer.exchange, consumer.routingKey);

            ch.consume(consumer.queue, async (msg: Message | null) => {
                if (msg) {
                    const content = JSON.parse(msg.content.toString());
                    console.log(`Received message with key ${consumer.routingKey}:`, content);

                    try {
                        await consumer.handler(content); // Procesar el mensaje
                        ch.ack(msg); // Confirmar recepción
                    } catch (error) {
                        console.error('Error processing message:', error);
                        ch.nack(msg, false, false); // Rechazar sin reenviar
                    }
                }
            });

            console.log(
                `Consumer registered: queue=${consumer.queue}, exchange=${consumer.exchange}, routingKey=${consumer.routingKey}`
            );
        }
    },

    async close() {
        if (connection) {
            await connection.close();
            connection = null;
            channel = null;
            console.log('RabbitMQ connection closed');
        }
    },
};
