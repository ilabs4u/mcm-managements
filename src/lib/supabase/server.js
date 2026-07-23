import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Server-side Supabase client — used in Server Components, API Routes, Server Actions.
// Reads session from cookies automatically via Next.js cookie store.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll called from Server Component — cookies can only be set from middleware or route handlers.
            // This is safe to ignore.
          }
        },
      },
    }
  );
}

// Admin client using service role — bypasses RLS. ONLY use in trusted server-side code.
// Never expose service role key to browser.
export async function createAdminClient() {
  const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
  
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      }
    }
  );
}
