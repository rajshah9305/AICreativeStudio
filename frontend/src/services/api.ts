import axios from 'axios';
import { toast } from 'react-toastify';
import { GenerationParams } from '../types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.response.use(
  response => response,
  error => {
    const message = error.response?.data?.message || 'An error occurred';
    toast.error(message);
    return Promise.reject(error);
  }
);

import { AppError } from '../utils/errorHandler';

const handleApiError = (error: unknown, message: string) => {
  if (axios.isAxiosError(error)) {
    throw new AppError(error.response?.status || 500, `${message}: ${error.message}`);
  }
  throw new AppError(500, 'Unknown error occurred');
};

export const generateText = async (params: GenerationParams) => {
  try {
    const response = await api.post('/generate/text', params);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Text generation failed');
  }
};

export const generateCode = async (params: GenerationParams) => {
  try {
    const response = await api.post('/generate/code', params);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Code generation failed');
  }
};

export const generateImage = async (params: GenerationParams) => {
  try {
    const response = await api.post('/generate/image', params);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Image generation failed');
  }
};