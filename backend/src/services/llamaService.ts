// src/services/llamaService.ts
import axios from 'axios';

interface LlamaParams {
  prompt: string;
  model: string;
  maxLength: number;
  temperature: number;
}

export const callLlamaAPI = async ({ prompt, model, maxLength, temperature }: LlamaParams) => {
  if (!process.env.REPLICATE_API_KEY) {
    throw new Error('REPLICATE_API_KEY is not configured');
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
      console.error('Llama API error:', error.response?.data);
      throw new Error(`Llama API error: ${error.message}`);
    }
    throw error;
  }
};