// src/middleware/rateLimiter.ts
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';
import { RateLimitRequestHandler } from 'express-rate-limit';

const redis = new Redis(process.env.REDIS_URL || '');

redis.on('error', (err) => {
  console.error('Redis error:', err);
});

export const setupRateLimiter = (): RateLimitRequestHandler => {
  return rateLimit({
    store: new RedisStore({
      sendCommand: (...args: string[]) => redis.call(...args),
      prefix: 'ratelimit:',
    }),
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'production' ? 100 : 1000, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    skipFailedRequests: true,
    handler: (req, res) => {
      res.status(429).json({
        error: 'Too many requests, please try again later.'
      });
    },
  });
};