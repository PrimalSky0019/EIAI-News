import { createBrowserClient } from '@supabase/ssr'
import { getEnv } from '@/lib/env'

export function createClient() {
  // Use centralized validation instead of checking process.env directly
  const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL') as string;
  const supabaseKey = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') as string;

  return createBrowserClient(supabaseUrl, supabaseKey);
}
