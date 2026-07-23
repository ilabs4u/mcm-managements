import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { aggregateMaterials } from '@/lib/calculations';

/**
 * GET /api/owner/reports?franchise_id=UUID&month=YYYY-MM
 * Returns monthly report data for a franchise.
 */
export async function GET(request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const franchise_id = searchParams.get('franchise_id');
    const month = searchParams.get('month') || new Date().toISOString().slice(0, 7);

    if (!franchise_id) {
      return NextResponse.json({ success: false, error: 'franchise_id is required' }, { status: 400 });
    }

    const startDate = `${month}-01`;
    const endDate = `${month}-31`;

    const { data: logs } = await supabase
      .from('daily_logs')
      .select('*, daily_log_items(*, products(name, sort_order))')
      .eq('franchise_id', franchise_id)
      .gte('log_date', startDate)
      .lte('log_date', endDate)
      .order('log_date', { ascending: true });

    // Build per-day data
    const days = (logs || []).map((log) => {
      const items = log.daily_log_items || [];
      const productTotals = {};
      items.forEach((item) => {
        const name = item.products?.name || 'Unknown';
        if (!productTotals[name]) productTotals[name] = { name, total_packets: 0, total_kg: 0 };
        productTotals[name].total_packets += item.quantity_packets;
        productTotals[name].total_kg += item.quantity_kg;
      });
      return {
        date: log.log_date,
        is_open: log.is_open,
        products: Object.values(productTotals),
      };
    });

    // Build month summary
    const allItems = (logs || []).flatMap((l) => l.daily_log_items || []);
    const productAgg = {};
    allItems.forEach((item) => {
      const name = item.products?.name || 'Unknown';
      if (!productAgg[name]) productAgg[name] = { name, total_packets: 0, total_kg: 0 };
      productAgg[name].total_packets += item.quantity_packets;
      productAgg[name].total_kg += item.quantity_kg;
    });

    const monthSummary = {
      products: Object.values(productAgg),
      materials: aggregateMaterials(allItems),
      days_open: days.filter((d) => d.is_open).length,
      days_closed: days.filter((d) => !d.is_open).length,
    };

    return NextResponse.json({ success: true, data: { days, monthSummary, month } });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

