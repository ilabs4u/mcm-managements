import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/franchise/history?month=YYYY-MM
 * Returns all daily logs with entries for the given month.
 * Defaults to current month if no month param provided.
 */
export async function GET(request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month') || new Date().toISOString().slice(0, 7);

    const { data: franchise } = await supabase
      .from('franchises')
      .select('id')
      .eq('manager_id', user.id)
      .single();

    if (!franchise) return NextResponse.json({ success: false, error: 'Franchise not found' }, { status: 404 });

    const startDate = `${month}-01`;
    const endDate = `${month}-31`; // PostgreSQL will cap at month end

    const { data: logs } = await supabase
      .from('daily_logs')
      .select('*, daily_log_items(*, products(name, sort_order))')
      .eq('franchise_id', franchise.id)
      .gte('log_date', startDate)
      .lte('log_date', endDate)
      .order('log_date', { ascending: false });

    return NextResponse.json({ success: true, data: { logs: logs || [], month } });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

