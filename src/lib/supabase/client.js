import { createBrowserClient } from '@supabase/ssr';

// Browser-side Supabase client — safe to use in Client Components.
// Uses anon key which is safe to expose in browser (RLS enforces data isolation).
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
