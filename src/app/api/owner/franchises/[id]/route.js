import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/owner/franchises/[id]?month=YYYY-MM
 * Returns single franchise detail with monthly logs.
 *
 * PATCH /api/owner/franchises/[id]
 * Approves, rejects, or suspends a franchise.
 * Sets approved_at + approved_by when approving.
 */
export async function GET(request, { params }) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month') || new Date().toISOString().slice(0, 7);
    const startDate = `${month}-01`;
    const endDate = `${month}-31`;

    const { data: franchise } = await supabase
      .from('franchises')
      .select('*, profiles!manager_id(full_name, email, phone)')
      .eq('id', id)
      .single();

    if (!franchise) return NextResponse.json({ success: false, error: 'Franchise not found' }, { status: 404 });

    const { data: logs } = await supabase
      .from('daily_logs')
      .select('*, daily_log_items(*, products(name, sort_order))')
      .eq('franchise_id', id)
      .gte('log_date', startDate)
      .lte('log_date', endDate)
      .order('log_date', { ascending: false });

    return NextResponse.json({
      success: true,
      data: { franchise, manager: franchise.profiles, logs: logs || [] },
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const { status } = await request.json();

    if (!['approved', 'rejected', 'suspended'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
    }

    const updateData = { status };
    // Set approval metadata when approving
    if (status === 'approved') {
      updateData.approved_at = new Date().toISOString();
      updateData.approved_by = user.id;
    }

    const { error } = await supabase.from('franchises').update(updateData).eq('id', id);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

