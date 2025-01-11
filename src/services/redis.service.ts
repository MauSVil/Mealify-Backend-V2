import Redis from 'ioredis';

let redisInstance: Redis | null = null;

const getRedisInstance = (): Redis => {
    if (!redisInstance) {
        redisInstance = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: Number(process.env.REDIS_PORT) || 6379,
            password: process.env.REDIS_PASSWORD || undefined,
        });

        redisInstance.on('connect', () => {
            console.log('Connected to Redis');
        });

        redisInstance.on('error', (err) => {
            console.error('Redis error:', err);
        });
    }

    return redisInstance;
};

export default getRedisInstance;
