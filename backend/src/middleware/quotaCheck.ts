// src/middleware/quotaCheck.ts
import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';

export const checkQuota = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (user.apiQuota <= 0) {
      return res.status(403).json({ 
        error: 'API quota exceeded. Please upgrade your plan.' 
      });
    }
    
    // Decrement quota
    user.apiQuota -= 1;
    await user.save();
    
    next();
  } catch (error) {
    next(error);
  }
};