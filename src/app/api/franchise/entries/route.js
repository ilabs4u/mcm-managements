import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { calculateMaterials, buildMaterialBreakdown } from '@/lib/calculations';

/**
 * POST /api/franchise/entries
 * Adds a production entry with server-side material calculation.
 *
 * WHY server-side calculation: The server fetches the latest recipe from DB
 * at the time of insert. This ensures recipe changes only affect future entries,
 * not past ones. Client-side calc is display-only.
 */
export async function POST(request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { product_id, quantity_kg } = await request.json();

    if (!product_id || !quantity_kg || quantity_kg <= 0) {
      return NextResponse.json({ success: false, error: 'product_id and quantity_kg > 0 are required' }, { status: 400 });
    }

    // Get manager's approved franchise
    const { data: franchise } = await supabase
      .from('franchises')
      .select('id, status')
      .eq('manager_id', user.id)
      .single();

    if (!franchise || franchise.status !== 'approved') {
      return NextResponse.json({ success: false, error: 'Franchise not approved' }, { status: 403 });
    }

    // Fetch product + latest recipe from DB (server is source of truth)
    const { data: product } = await supabase
      .from('products')
      .select('*, product_ingredients(*, ingredients(name, unit))')
      .eq('id', product_id)
      .eq('is_active', true)
      .single();

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found or inactive' }, { status: 404 });
    }

    // Build recipe array from product_ingredients join
    const recipe = product.product_ingredients.map((pi) => ({
      name: pi.ingredients.name,
      quantity_per_packet: pi.quantity_per_packet,
      unit: pi.unit,
    }));

    // Server-side calculation — authoritative
    const { packets, ingredients } = calculateMaterials(quantity_kg, product.packet_size_kg, recipe);
    const material_breakdown = buildMaterialBreakdown(product.name, quantity_kg, packets, ingredients);

    // UPSERT daily_log for today (creates if not exists)
    const today = new Date().toISOString().split('T')[0];
    const { data: log, error: logError } = await supabase
      .from('daily_logs')
      .upsert(
        { franchise_id: franchise.id, log_date: today, is_open: true },
        { onConflict: 'franchise_id,log_date', ignoreDuplicates: false }
      )
      .select('id')
      .single();

    if (logError) {
      return NextResponse.json({ success: false, error: 'Failed to create daily log: ' + logError.message }, { status: 500 });
    }

    // INSERT entry with frozen material snapshot
    const { data: entry, error: entryError } = await supabase
      .from('daily_log_items')
      .insert({
        daily_log_id: log.id,
        product_id,
        quantity_kg,
        quantity_packets: packets,
        material_breakdown,
      })
      .select('*')
      .single();

    if (entryError) {
      return NextResponse.json({ success: false, error: 'Failed to create entry: ' + entryError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: { entry } });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

