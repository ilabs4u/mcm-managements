import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import FranchisePortal from './ClientPage';

export const metadata = {
  title: "Today's Production — MCM Franchise",
};

/**
 * Server component: fetches today's data and passes to client page.
 * Auth is enforced by middleware — this page is only reached by approved managers.
 */
export default async function FranchisePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Fetch data directly via supabase in server context
  const { data: franchise } = await supabase
    .from('franchises')
    .select('id, name, is_open, status')
    .eq('manager_id', user.id)
    .single();

  const today = new Date().toISOString().split('T')[0];

  const { data: log } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('franchise_id', franchise?.id)
    .eq('log_date', today)
    .single();

  let items = [];
  if (log) {
    const { data: logItems } = await supabase
      .from('daily_log_items')
      .select('*, products(name, packet_size_kg)')
      .eq('daily_log_id', log.id)
      .order('created_at', { ascending: false });
    items = logItems || [];
  }

  const { data: products } = await supabase
    .from('products')
    .select('*, product_ingredients(*, ingredients(name, unit))')
    .eq('is_active', true)
    .order('sort_order');

  return (
    <FranchisePortal
      franchise={franchise}
      log={log}
      items={items}
      products={products || []}
    />
  );
}

