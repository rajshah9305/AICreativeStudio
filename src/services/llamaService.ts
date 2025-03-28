// src/services/llamaService.ts
import axios from 'axios';
import { LlamaParams } from '../types';
import { AppError } from '../utils/errorHandler';
import logger from '../utils/logger';

export const callLlamaAPI = async ({ prompt, model, maxLength, temperature }: LlamaParams) => {
  if (!process.env.REPLICATE_API_KEY) {
    throw new AppError(500, 'REPLICATE_API_KEY is not configured');
  }

  try {
    const response = await axios.post('https://api.replicate.com/v1/predictions', {
      version: "meta/llama-3-70b-instruct:2b5a292cd2658b0049ce3b63a55d34c54973aef9e5a339c6e2bc5fa2a6008806",
      input: {
        prompt,
        max_new_tokens: maxLength,
        temperature
      }
    }, {
      headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger.error('Llama API error:', error.response?.data);
      throw new AppError(error.response?.status || 500, `Llama API error: ${error.message}`);
    }
    throw new AppError(500, 'Unknown error occurred');
  }
};