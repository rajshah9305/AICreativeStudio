// src/index.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import routes from './routes';
import { setupRateLimiter } from './middleware/rateLimiter';
import { errorHandler } from './utils/errorHandler';
import logger from './utils/logger';
import { requestTracker } from './middleware/requestTracker';
import MonitoringService from './services/monitoring';

dotenv.config();

const app = express();
const monitoring = new MonitoringService();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: true,
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: true
}));
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
  credentials: true
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(setupRateLimiter());
app.use(requestTracker);
app.use(monitoring.requestCounter);

// Health check
app.get('/health', async (req, res) => {
  const health = await monitoring.getHealthStatus();
  res.status(health.status === 'ok' ? 200 : 503).json(health);
});

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

// Graceful shutdown
const gracefulShutdown = () => {
  mongoose.connection.close(false, () => {
    logger.info('MongoDB connection closed');
    process.exit(0);
  });
};

const shutdown = async () => {
  await monitoring.cleanup();
  gracefulShutdown();
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Database connection with retry
const connectDB = async (retries = 5) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    logger.info('Connected to MongoDB');
  } catch (err) {
    if (retries > 0) {
      logger.warn(`MongoDB connection failed. Retrying... (${retries} attempts left)`);
      setTimeout(() => connectDB(retries - 1), 5000);
    } else {
      logger.error('MongoDB connection failed after retries');
      process.exit(1);
    }
  }
};

connectDB();

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});