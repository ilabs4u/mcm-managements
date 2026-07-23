import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/owner/franchises?status=approved|pending|all
 * Returns all franchises with optional status filter.
 */
export async function GET(request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';

    let query = supabase
      .from('franchises')
      .select('*, profiles!manager_id(full_name, email, phone)')
      .order('name');

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: franchises, error } = await query;
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

    return NextResponse.json({ success: true, data: { franchises: franchises || [] } });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

