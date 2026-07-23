import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * PATCH /api/franchise/toggle-open
 * Toggles the franchise open/closed status for today.
 * Updates both franchises.is_open and today's daily_logs.is_open.
 */
export async function PATCH(request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { is_open } = await request.json();
    if (typeof is_open !== 'boolean') {
      return NextResponse.json({ success: false, error: 'is_open (boolean) is required' }, { status: 400 });
    }

    const { data: franchise } = await supabase
      .from('franchises')
      .select('id')
      .eq('manager_id', user.id)
      .single();

    if (!franchise) return NextResponse.json({ success: false, error: 'Franchise not found' }, { status: 404 });

    const today = new Date().toISOString().split('T')[0];

    // Update franchise open state
    await supabase.from('franchises').update({ is_open }).eq('id', franchise.id);

    // Upsert today's daily log with the same is_open state
    await supabase
      .from('daily_logs')
      .upsert(
        { franchise_id: franchise.id, log_date: today, is_open },
        { onConflict: 'franchise_id,log_date', ignoreDuplicates: false }
      );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

