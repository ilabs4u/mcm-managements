import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * DELETE /api/franchise/entries/[id]
 * Deletes a production entry. Only allowed for today's entries belonging to the manager's franchise.
 */
export async function DELETE(request, { params }) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    // Get the franchise for this user
    const { data: franchise } = await supabase
      .from('franchises')
      .select('id')
      .eq('manager_id', user.id)
      .single();

    if (!franchise) return NextResponse.json({ success: false, error: 'Franchise not found' }, { status: 404 });

    // Verify the entry belongs to this franchise and is from today
    const today = new Date().toISOString().split('T')[0];
    const { data: entry } = await supabase
      .from('daily_log_items')
      .select('id, daily_logs!inner(franchise_id, log_date)')
      .eq('id', id)
      .eq('daily_logs.franchise_id', franchise.id)
      .eq('daily_logs.log_date', today)
      .single();

    if (!entry) {
      return NextResponse.json(
        { success: false, error: 'Entry not found, not from today, or does not belong to your franchise' },
        { status: 404 }
      );
    }

    const { error } = await supabase.from('daily_log_items').delete().eq('id', id);

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

