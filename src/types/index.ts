export interface GenerationParams {
  prompt: string;
  model: string;
  parameters: {
    temperature?: number;
    maxLength?: number;
    topP?: number;
    frequencyPenalty?: number;
  };
}

export interface LlamaParams {
  prompt: string;
  model: string;
  maxLength: number;
  temperature: number;
}

export interface RequestWithId extends Request {
  id?: string;
  user?: {
    id: string;
    email: string;
    subscription: string;
  };
}

