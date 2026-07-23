import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/** POST /api/ingredients — Add a new ingredient type (owner only). */
export async function POST(request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'owner') return NextResponse.json({ success: false, error: 'Owner only' }, { status: 403 });

    const { name, unit } = await request.json();
    if (!name || !unit) return NextResponse.json({ success: false, error: 'name and unit required' }, { status: 400 });

    const { data: ingredient, error } = await supabase
      .from('ingredients')
      .insert({ name, unit })
      .select('*')
      .single();

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, data: { ingredient } });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

/** GET /api/ingredients — List all ingredients (authenticated users). */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { data: ingredients } = await supabase
      .from('ingredients')
      .select('*')
      .eq('is_active', true)
      .order('name');

    return NextResponse.json({ success: true, data: { ingredients: ingredients || [] } });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

