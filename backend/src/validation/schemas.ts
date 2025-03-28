import Joi from 'joi';

export const generationSchema = Joi.object({
  prompt: Joi.string().required().max(1000),
  model: Joi.string().required(),
  parameters: Joi.object({
    temperature: Joi.number().min(0).max(1),
    maxLength: Joi.number().min(1).max(2048),
    topP: Joi.number().min(0).max(1),
    frequencyPenalty: Joi.number().min(0).max(2)
  }).required()
});

export const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  subscription: Joi.string().valid('free', 'basic', 'premium')
});
