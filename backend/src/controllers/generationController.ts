import { Request, Response } from 'express';
import { Generation } from '../models/Generation';
import { callLlamaAPI } from '../services/llamaService';
import { AppError } from '../utils/errorHandler';

export const generateText = async (req: Request, res: Response) => {
  const { prompt, parameters } = req.body;
  const userId = req.user?.id;

  const result = await callLlamaAPI({
    prompt,
    model: 'text-generation',
    ...parameters
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
};

// Similar implementations for generateCode and generateImage
