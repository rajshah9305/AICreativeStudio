import { Request, Response, NextFunction } from 'express';
import { Counter, Registry } from 'prom-client';
import logger from '../utils/logger';

export default class MonitoringService {
  private registry: Registry;
  private requestsCounter: Counter;

  constructor() {
    this.registry = new Registry();
    this.requestsCounter = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'path', 'status']
    });
    this.registry.registerMetric(this.requestsCounter);
  }

  requestCounter = (req: Request, res: Response, next: NextFunction) => {
    res.on('finish', () => {
      this.requestsCounter.inc({
        method: req.method,
        path: req.route?.path || req.path,
        status: res.statusCode
      });
    });
    next();
  };

  async getHealthStatus() {
    try {
      const metrics = await this.registry.getMetricsAsJSON();
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        metrics
      };
    } catch (error) {
      logger.error('Health check failed:', error);
      return {
        status: 'error',
        timestamp: new Date().toISOString()
      };
    }
  }

  async cleanup() {
    await this.registry.clear();
  }
}
