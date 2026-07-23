import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/** GET /api/products — All active products with recipe ingredients. Authenticated users only. */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { data: products } = await supabase
      .from('products')
      .select('*, product_ingredients(*, ingredients(id, name, unit))')
      .order('sort_order');

    return NextResponse.json({ success: true, data: { products: products || [] } });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

/** POST /api/products — Create new product. Owner only. */
export async function POST(request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    // Verify owner role
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'owner') return NextResponse.json({ success: false, error: 'Owner only' }, { status: 403 });

    const { name, packet_size_kg, sort_order } = await request.json();

    if (!name || !packet_size_kg || packet_size_kg <= 0) {
      return NextResponse.json({ success: false, error: 'name and packet_size_kg > 0 required' }, { status: 400 });
    }

    const { data: product, error } = await supabase
      .from('products')
      .insert({ name, packet_size_kg, sort_order: sort_order || 0 })
      .select('*')
      .single();

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, data: { product } });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

