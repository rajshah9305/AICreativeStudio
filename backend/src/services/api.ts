// services/api.ts
import axios from 'axios';

interface GenerationParams {
  prompt: string;
  model: string;
  parameters: Record<string, any>;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  timeout: 30000,  // 30 second timeout
});

export const generateText = async (params: GenerationParams) => {
  try {
    const response = await api.post('/generate/text', params);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Text generation failed: ${error.message}`);
    }
    throw error;
  }
};


export const generateCode = async (params: GenerationParams) => {
  const response = await api.post('/generate/code', params);
  return response.data;
};

export const generateImage = async (params: GenerationParams) => {
  const response = await api.post('/generate/image', params);
  return response.data;
};