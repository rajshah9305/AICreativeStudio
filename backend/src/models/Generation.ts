// src/models/Generation.ts
import mongoose from 'mongoose';

const GenerationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['text', 'code', 'image'],
    required: true
  },
  prompt: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  parameters: {
    type: Object,
    required: true
  },
  result: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  userId: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Generation = mongoose.model('Generation', GenerationSchema);