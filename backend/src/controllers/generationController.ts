import { Request, Response, NextFunction } from 'express';
import { Generation } from '../models/Generation';
import { callLlamaAPI } from '../services/llamaService';
import { AppError } from '../utils/errorHandler';
import { RequestWithId } from '../types';
import { generationSchema } from '../validation/schemas';

export const generateText = async (req: RequestWithId, res: Response, next: NextFunction) => {
  try {
    const { error } = generationSchema.validate(req.body);
    if (error) {
      throw new AppError(400, error.message);
    }

    const { prompt, parameters } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError(401, 'User not authenticated');
    }

    const result = await callLlamaAPI({
      prompt,
      model: 'text-generation',
      maxLength: parameters.maxLength || 1000,
      temperature: parameters.temperature || 0.7
    });

    const generation = await Generation.create({
      type: 'text',
      prompt,
      model: 'llama-3',
      parameters,
      result,
      userId
    });

    res.json(generation);
  } catch (error) {
    next(error);
  }
};
