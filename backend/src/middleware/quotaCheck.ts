// src/middleware/quotaCheck.ts
import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { AppError } from '../utils/errorHandler';
import { RequestWithId } from '../types';

export const checkQuota = async (req: RequestWithId, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      throw new AppError(401, 'User not authenticated');
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      throw new AppError(404, 'User not found');
    }
    
    if (user.apiQuota <= 0) {
      throw new AppError(403, 'API quota exceeded. Please upgrade your plan.');
    }
    
    user.apiQuota -= 1;
    await user.save();
    
    next();
  } catch (error) {
    next(error);
  }
};