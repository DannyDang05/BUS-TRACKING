import { createClient } from 'redis';

let redisClient = null;

export const connectRedis = async () => {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        reconnectStrategy: false // Disable auto-reconnect if Redis unavailable
      }
    });

    redisClient.on('error', (err) => {
      // Only log once, don't spam console
      if (!redisClient.isReady) {
        console.warn('⚠️  Redis connection failed (server will continue without cache)');
      }
    });

    redisClient.on('ready', () => {
      console.log('✅ Redis connected: ' + (process.env.REDIS_URL || 'localhost:6379'));
    });

    await redisClient.connect();
    
    return redisClient;
  } catch (error) {
    console.warn('⚠️  Redis unavailable - Features using Redis will be disabled');
    redisClient = null;
    throw error; // Let server.js handle it gracefully
  }
};

export const getRedisClient = () => {
  if (!redisClient || !redisClient.isOpen) {
    return null; // Return null instead of throwing error
  }
  return redisClient;
};

export const closeRedis = async () => {
  if (redisClient) {
    await redisClient.quit();
    console.log('🔌 Redis connection closed');
  }
};
