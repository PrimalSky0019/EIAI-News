import { createClient } from '@supabase/supabase-js';
import { getEnv } from './env';

// Server-only admin client for tasks like ingestion
export const supabaseAdmin = createClient(
  getEnv('NEXT_PUBLIC_SUPABASE_URL'),
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);
