import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ReportsPage from './ClientPage';

export const metadata = { title: 'Reports — MCM Owner' };

export default async function OwnerReportsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: franchises } = await supabase
    .from('franchises')
    .select('id, name')
    .eq('status', 'approved')
    .order('name');

  return <ReportsPage franchises={franchises || []} />;
}

