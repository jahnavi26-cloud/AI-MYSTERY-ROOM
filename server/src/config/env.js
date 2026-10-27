import 'dotenv/config';
import { z } from 'zod';

const optionalSecret = z.preprocess(
  value => typeof value === 'string' && value.trim() === '' ? undefined : value,
  z.string().min(1).optional(),
);

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3001),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  CLIENT_ORIGIN: z.string().url().default('http://localhost:5173'),
  GEMINI_API_KEY: optionalSecret,
  GEMINI_MODEL: z.string().trim().min(1).default('gemini-3.8-flash'),
  GEMINI_FALLBACK_MODEL: z.string().trim().min(1).default('gemini-3.5-flash-lite'),
  AI_TIMEOUT_MS: z.coerce.number().int().min(5000).max(120000).default(90000),
});

const result = schema.safeParse(process.env);
if (!result.success) {
  console.error('Invalid environment configuration:', result.error.flatten().fieldErrors);
  process.exit(1);
}

export const config = result.data;



