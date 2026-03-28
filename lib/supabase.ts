// DEPRECATED: Use lib/supabase/server.ts for Server Components/Actions
// or lib/supabase/client.ts for Client Components
// 
// This file is kept for backward compatibility but should not be used
// in new code as it doesn't properly handle SSR

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);