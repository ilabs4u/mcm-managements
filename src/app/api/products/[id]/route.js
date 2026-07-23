import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

async function assertOwner(supabase, user) {
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  return profile?.role === 'owner';
}

/** PUT /api/products/[id] — Update product (owner only). */
export async function PUT(request, { params }) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    if (!await assertOwner(supabase, user)) return NextResponse.json({ success: false, error: 'Owner only' }, { status: 403 });

    const { id } = await params;
    const updates = await request.json();

    if (updates.packet_size_kg !== undefined && updates.packet_size_kg <= 0) {
      return NextResponse.json({ success: false, error: 'packet_size_kg must be > 0' }, { status: 400 });
    }

    const { data: product, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, data: { product } });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

