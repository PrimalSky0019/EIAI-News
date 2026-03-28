/**
 * Environment variable validation using Zod
 * Ensures all required environment variables are present with type safety
 */

import { z } from 'zod';

// Define the schema for environment variables
const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key is required'),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).optional(),
});

export type Env = z.infer<typeof envSchema>;

// Validate and parse environment variables
let validatedEnv: Env;

try {
  validatedEnv = envSchema.parse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    NODE_ENV: process.env.NODE_ENV,
  });
} catch (error) {
  if (error instanceof z.ZodError) {
    const missing = error.issues.map((e) => `${e.path.join('.')}: ${e.message}`);
    throw new Error(
      `Environment validation failed:\n${missing.join('\n')}\n` +
        'Please check your .env.local file.'
    );
  }
  throw error;
}

/**
 * Get validated environment variable
 */
export function getEnv<K extends keyof Env>(key: K): Env[K] {
  return validatedEnv[key];
}

/**
 * Check if running in development mode
 */
export const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Check if running in production mode
 */
export const isProduction = process.env.NODE_ENV === 'production';
