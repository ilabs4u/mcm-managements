import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/auth/login
 * Signs in user and returns session + role info for client routing.
 */
export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      );
    }

    // Fetch role + franchise status for client-side routing decision
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', data.user.id)
      .single();

    let franchiseStatus = null;
    if (profile?.role === 'franchise_manager') {
      const { data: franchise } = await supabase
        .from('franchises')
        .select('status')
        .eq('manager_id', data.user.id)
        .single();
      franchiseStatus = franchise?.status;
    }

    return NextResponse.json({
      success: true,
      data: {
        user: data.user,
        session: data.session,
        role: profile?.role,
        full_name: profile?.full_name,
        franchise_status: franchiseStatus,
      },
    });

  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

