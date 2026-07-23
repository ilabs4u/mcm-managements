import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/franchise/today
 * Returns today's daily log, all entries, and the product+recipe catalog.
 * Franchise ID is derived from session — manager cannot see other franchises (RLS).
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    // Get manager's franchise
    const { data: franchise } = await supabase
      .from('franchises')
      .select('id, name, is_open, status')
      .eq('manager_id', user.id)
      .single();

    if (!franchise || franchise.status !== 'approved') {
      return NextResponse.json({ success: false, error: 'Franchise not approved' }, { status: 403 });
    }

    const today = new Date().toISOString().split('T')[0];

    // Get or acknowledge today's log (may not exist if no entries yet)
    const { data: log } = await supabase
      .from('daily_logs')
      .select('*')
      .eq('franchise_id', franchise.id)
      .eq('log_date', today)
      .single();

    // Get today's entries if log exists
    let items = [];
    if (log) {
      const { data: logItems } = await supabase
        .from('daily_log_items')
        .select('*, products(name, packet_size_kg)')
        .eq('daily_log_id', log.id)
        .order('created_at', { ascending: false });
      items = logItems || [];
    }

    // Get all active products with their recipe ingredients
    const { data: products } = await supabase
      .from('products')
      .select('*, product_ingredients(*, ingredients(name, unit))')
      .eq('is_active', true)
      .order('sort_order');

    return NextResponse.json({
      success: true,
      data: { franchise, log, items, products: products || [] },
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

