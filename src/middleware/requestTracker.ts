import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { logRequest } from '../utils/logger';
import { RequestWithId } from '../types';

export const requestTracker = (req: RequestWithId, res: Response, next: NextFunction) => {
  req.id = uuidv4();
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logRequest(req, `${req.method} ${req.path} completed in ${duration}ms`);
  });
  
  next();
};
