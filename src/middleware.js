import { NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

/**
 * Route protection middleware — runs before every page render.
 *
 * WHY: Role-based routing must be enforced at the edge (not client-side)
 * to prevent unauthorized access even if someone knows the URL.
 *
 * Logic:
 * - Public routes (/login, /register) — always accessible
 * - / (root) — always accessible (landing page)
 * - /pending — only for authenticated pending franchise managers
 * - /franchise/* — only for approved franchise managers
 * - /owner/* — only for owners
 * - Unauthenticated → /login
 * - Wrong role → redirect to correct home
 */
export async function middleware(request) {
  const { supabaseResponse, user, supabase } = await updateSession(request);
  const { pathname } = request.nextUrl;

  // Always allow public routes
  const publicPaths = ['/', '/login', '/register', '/api/auth/login', '/api/auth/register'];
  if (publicPaths.includes(pathname)) {
    return supabaseResponse;
  }

  // No session → redirect to login
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Fetch user profile to get role and franchise status
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = profile?.role;

  // Fetch franchise status for franchise managers
  let franchiseStatus = null;
  if (role === 'franchise_manager') {
    const { data: franchise } = await supabase
      .from('franchises')
      .select('status')
      .eq('manager_id', user.id)
      .single();
    franchiseStatus = franchise?.status;
  }

  // Owner trying to access franchise routes → redirect to owner dashboard
  if (role === 'owner' && pathname.startsWith('/franchise')) {
    return NextResponse.redirect(new URL('/owner', request.url));
  }

  // Owner trying to access pending → redirect to owner dashboard
  if (role === 'owner' && pathname === '/pending') {
    return NextResponse.redirect(new URL('/owner', request.url));
  }

  // Franchise manager routing based on status
  if (role === 'franchise_manager') {
    if (pathname.startsWith('/owner')) {
      // Managers cannot access owner routes
      return NextResponse.redirect(new URL('/franchise', request.url));
    }

    if (franchiseStatus === 'pending' && pathname !== '/pending') {
      return NextResponse.redirect(new URL('/pending', request.url));
    }

    if (franchiseStatus === 'approved' && pathname === '/pending') {
      return NextResponse.redirect(new URL('/franchise', request.url));
    }

    if (
      (franchiseStatus === 'rejected' || franchiseStatus === 'suspended') &&
      pathname !== '/login'
    ) {
      // Rejected/suspended managers are bounced back to login with error
      const url = new URL('/login', request.url);
      url.searchParams.set('error', franchiseStatus);
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    // Match all routes except static files and Next.js internals
    '/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|logo.jpeg|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
