import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/** GET /api/auth/me — Returns current user profile, role, and franchise. */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    let franchise = null;
    if (profile?.role === 'franchise_manager') {
      const { data } = await supabase
        .from('franchises')
        .select('*')
        .eq('manager_id', user.id)
        .single();
      franchise = data;
    }

    return NextResponse.json({ success: true, data: { user, profile, franchise } });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

