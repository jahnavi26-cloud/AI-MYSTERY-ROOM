import mongoose from 'mongoose';
import { config } from './env.js';

export async function connectDatabase() {
  await mongoose.connect(config.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  console.info('MongoDB connected');
}
