import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * PUT /api/products/[id]/recipe
 * Replaces ALL recipe ingredients for a product.
 *
 * WHY delete + insert: Simpler and safer than trying to diff and patch
 * individual rows. Past daily_log_items retain their frozen snapshot
 * so historical data is unaffected by recipe changes.
 */
export async function PUT(request, { params }) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'owner') return NextResponse.json({ success: false, error: 'Owner only' }, { status: 403 });

    const { id } = await params;
    const { ingredients } = await request.json();

    if (!Array.isArray(ingredients)) {
      return NextResponse.json({ success: false, error: 'ingredients array required' }, { status: 400 });
    }

    // Delete all existing recipe rows for this product
    await supabase.from('product_ingredients').delete().eq('product_id', id);

    // Insert new recipe rows
    if (ingredients.length > 0) {
      const rows = ingredients.map((ing) => ({
        product_id: id,
        ingredient_id: ing.ingredient_id,
        quantity_per_packet: ing.quantity_per_packet,
        unit: ing.unit,
      }));

      const { error } = await supabase.from('product_ingredients').insert(rows);
      if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

