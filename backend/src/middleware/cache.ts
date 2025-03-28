// src/middleware/cache.ts
import { createClient } from 'redis';
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 50, 1000)
  }
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error('Failed to connect to Redis:', err);
  }
})();

export const invalidateCache = async (pattern: string): Promise<void> => {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
      logger.info(`Cache invalidated for pattern: ${pattern}`);
    }
  } catch (error) {
    logger.error('Cache invalidation error:', error);
  }
};

export const cacheMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  if (!redisClient.isReady) {
    return next();
  }

  try {
    const key = `${req.path}:${JSON.stringify(req.body)}`;
    const cachedResult = await redisClient.get(key);
    
    if (cachedResult) {
      return res.json(JSON.parse(cachedResult));
    }
    
    // Store original send function
    const originalSend = res.send;
    
    // Override send
    res.send = function(body) {
      // Cache response for 1 hour
      redisClient.set(key, body, { EX: 60 * 60 });
      return originalSend.call(this, body);
    };
    
    next();
  } catch (error) {
    console.error('Cache middleware error:', error);
    next(); // Continue without caching on error
  }
};