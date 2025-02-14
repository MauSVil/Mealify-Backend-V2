import { createClient, RedisClientType } from "redis";

export const redisService = {
  client: null as RedisClientType | null,

  async connect() {
    if (!this.client) {
      this.client = createClient({
        url: `redis://${process.env.REDIS_HOST || "localhost"}:${
          process.env.REDIS_PORT || 6379
        }`,
        password: process.env.REDIS_PASSWORD || undefined,
      });

      this.client.on("connect", () => {
        console.log("Redis connected");
      });

      this.client.on("error", (err) => {
        console.error(`Redis error: ${err}`);
      });

      await this.client.connect();
    }
  },

  async set(key: string, value: string, options = {}) {
    if (!this.client) throw new Error("Redis client is not connected");
    try {
      console.log(`Key ${key} set successfully`);
      return await this.client.set(key, value, options);
    } catch (err) {
      console.error(`Error setting key ${key}: ${err}`);
    }
  },

  async get(key: string): Promise<string | null> {
    if (!this.client) throw new Error("Redis client is not connected");
    try {
      const value = await this.client.get(key);
      return value;
    } catch (err) {
      console.error(`Error getting key ${key}: ${err}`);
      return null;
    }
  },

  async del(key: string) {
    if (!this.client) throw new Error("Redis client is not connected");
    try {
      await this.client.del(key);
      console.log(`Key ${key} deleted successfully`);
    } catch (err) {
      console.error(`Error deleting key ${key}: ${err}`);
    }
  },

  async quit() {
    if (this.client) {
      try {
        await this.client.quit();
        console.log("Redis connection closed");
      } catch (err) {
        console.error(`Error closing Redis connection: ${err}`);
      } finally {
        this.client = null; // Asegura que el cliente sea null después de cerrar
      }
    }
  },

  async zadd(key: string, score: number, member: string) {
    if (this.client) {
      await this.client.zAdd(key, { score, value: member });
    }
  },

  async zrangebyscore(key: string, min: number, max: number) {
    if (this.client) {
      return await this.client.zRangeByScore(key, min, max);
    }
  },

  async zrem(key: string, member: string) {
    if (this.client) {
      await this.client.zRem(key, member);
    }
  },

  async incr(key: string) {
    if (this.client) {
      return await this.client.incr(key);
    }
  },

  async decr(key: string) {
    if (this.client) {
      return await this.client.decr(key);
    }
  },

  async keys(pattern: string) {
    if (this.client) {
      return await this.client.keys(pattern);
    }
  },

  async persist(key: string) {
    if (this.client) {
      await this.client.persist(key);
    }
  },
};
