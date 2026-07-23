import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { aggregateMaterials } from '@/lib/calculations';

/**
 * GET /api/owner/dashboard
 * Returns all approved franchises with today's production + aggregate totals.
 * Owner-only endpoint (RLS enforces this at DB level).
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const today = new Date().toISOString().split('T')[0];

    // Fetch all approved franchises with manager profiles
    const { data: franchises } = await supabase
      .from('franchises')
      .select('*, profiles!manager_id(full_name, email)')
      .eq('status', 'approved')
      .order('name');

    // Fetch today's logs with items for all franchises
    const { data: todayLogs } = await supabase
      .from('daily_logs')
      .select('*, daily_log_items(*, products(name, sort_order))')
      .eq('log_date', today);

    // Build a map: franchise_id → { products[], materials[] }
    const logMap = {};
    (todayLogs || []).forEach((log) => {
      const items = log.daily_log_items || [];
      const productTotals = {};
      items.forEach((item) => {
        const name = item.products?.name || 'Unknown';
        if (!productTotals[name]) productTotals[name] = { name, total_kg: 0, total_packets: 0 };
        productTotals[name].total_kg += item.quantity_kg;
        productTotals[name].total_packets += item.quantity_packets;
      });
      const materials = aggregateMaterials(items);
      const lastEntry = items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

      logMap[log.franchise_id] = {
        products: Object.values(productTotals),
        materials,
        last_entry_at: lastEntry?.created_at || null,
        is_open: log.is_open,
      };
    });

    // Merge franchise list with today's data
    const enrichedFranchises = (franchises || []).map((f) => ({
      ...f,
      manager_name: f.profiles?.full_name || 'Unknown',
      today: logMap[f.id] || { products: [], materials: [], last_entry_at: null, is_open: f.is_open },
    }));

    // Build aggregate across all franchises
    const allItems = (todayLogs || []).flatMap((l) => l.daily_log_items || []);
    const productAgg = {};
    allItems.forEach((item) => {
      const name = item.products?.name || 'Unknown';
      if (!productAgg[name]) productAgg[name] = { name, total_kg: 0, total_packets: 0 };
      productAgg[name].total_kg += item.quantity_kg;
      productAgg[name].total_packets += item.quantity_packets;
    });

    const aggregate = {
      open_count: enrichedFranchises.filter((f) => f.today.is_open).length,
      total_franchises: enrichedFranchises.length,
      products: Object.values(productAgg),
      materials: aggregateMaterials(allItems),
    };

    return NextResponse.json({ success: true, data: { franchises: enrichedFranchises, aggregate } });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

