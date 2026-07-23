import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import OwnerDashboard from './ClientPage';

export const metadata = { title: 'Owner Dashboard — MCM' };

export default async function OwnerPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Fetch all approved franchises + today's logs directly via Supabase
  const today = new Date().toISOString().split('T')[0];

  const { data: franchises } = await supabase
    .from('franchises')
    .select('*, profiles!manager_id(full_name, email)')
    .eq('status', 'approved')
    .order('name');

  const { data: todayLogs } = await supabase
    .from('daily_logs')
    .select('*, daily_log_items(*, products(name, sort_order))')
    .eq('log_date', today);

  // Build franchise + today data map
  const { aggregateMaterials } = await import('@/lib/calculations');

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
    logMap[log.franchise_id] = {
      products: Object.values(productTotals),
      materials: aggregateMaterials(items),
      is_open: log.is_open,
    };
  });

  const enriched = (franchises || []).map((f) => ({
    ...f,
    manager_name: f.profiles?.full_name || 'Unknown',
    today: logMap[f.id] || { products: [], materials: [], is_open: f.is_open },
  }));

  const allItems = (todayLogs || []).flatMap((l) => l.daily_log_items || []);
  const productAgg = {};
  allItems.forEach((item) => {
    const name = item.products?.name || 'Unknown';
    if (!productAgg[name]) productAgg[name] = { name, total_kg: 0, total_packets: 0 };
    productAgg[name].total_kg += item.quantity_kg;
    productAgg[name].total_packets += item.quantity_packets;
  });

  const aggregate = {
    open_count: enriched.filter((f) => f.today.is_open).length,
    total_franchises: enriched.length,
    products: Object.values(productAgg),
    materials: aggregateMaterials(allItems),
  };

  return <OwnerDashboard franchises={enriched} aggregate={aggregate} />;
}

