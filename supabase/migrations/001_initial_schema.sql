-- MCM Franchise Management System — Initial Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ⚠️  WARNING: Run ONCE on a fresh project. Running again will fail due to duplicate tables.

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'franchise_manager'
        CHECK (role IN ('owner', 'franchise_manager')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- FRANCHISES
-- ============================================================
CREATE TABLE IF NOT EXISTS franchises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    location TEXT,
    manager_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
    is_open BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    approved_at TIMESTAMPTZ,
    approved_by UUID REFERENCES profiles(id)
);

CREATE INDEX IF NOT EXISTS idx_franchises_status ON franchises(status);
CREATE INDEX IF NOT EXISTS idx_franchises_manager ON franchises(manager_id);

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    packet_size_kg FLOAT NOT NULL,
    unit TEXT DEFAULT 'kg',
    is_active BOOLEAN DEFAULT true,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- INGREDIENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS ingredients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    unit TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- PRODUCT_INGREDIENTS (Recipe mappings)
-- ============================================================
CREATE TABLE IF NOT EXISTS product_ingredients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
    quantity_per_packet FLOAT NOT NULL,
    unit TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(product_id, ingredient_id)
);

-- ============================================================
-- DAILY_LOGS (One per franchise per day)
-- ============================================================
CREATE TABLE IF NOT EXISTS daily_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    franchise_id UUID NOT NULL REFERENCES franchises(id) ON DELETE CASCADE,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    is_open BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(franchise_id, log_date)
);

CREATE INDEX IF NOT EXISTS idx_daily_logs_date ON daily_logs(franchise_id, log_date);

-- ============================================================
-- DAILY_LOG_ITEMS (Individual production entries)
-- ============================================================
CREATE TABLE IF NOT EXISTS daily_log_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    daily_log_id UUID NOT NULL REFERENCES daily_logs(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    quantity_kg FLOAT NOT NULL CHECK (quantity_kg >= 0),
    quantity_packets FLOAT NOT NULL,
    material_breakdown JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_log_items_log ON daily_log_items(daily_log_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE franchises ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_log_items ENABLE ROW LEVEL SECURITY;

-- Helper function: get current user's role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper function: get current user's franchise_id
CREATE OR REPLACE FUNCTION get_user_franchise_id()
RETURNS UUID AS $$
  SELECT id FROM franchises WHERE manager_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- PROFILES policies
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (id = auth.uid() OR get_user_role() = 'owner');
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Service role can insert profiles" ON profiles FOR INSERT WITH CHECK (true);

-- FRANCHISES policies
CREATE POLICY "Owner can read all franchises" ON franchises FOR SELECT USING (get_user_role() = 'owner');
CREATE POLICY "Manager can read own franchise" ON franchises FOR SELECT USING (manager_id = auth.uid());
CREATE POLICY "Owner can update franchises" ON franchises FOR UPDATE USING (get_user_role() = 'owner');
CREATE POLICY "Manager can update own franchise" ON franchises FOR UPDATE USING (manager_id = auth.uid());
CREATE POLICY "Service role can insert franchises" ON franchises FOR INSERT WITH CHECK (true);

-- PRODUCTS policies (readable by all authenticated, writable by owner only)
CREATE POLICY "Authenticated users can read products" ON products FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Owner can insert products" ON products FOR INSERT WITH CHECK (get_user_role() = 'owner');
CREATE POLICY "Owner can update products" ON products FOR UPDATE USING (get_user_role() = 'owner');

-- INGREDIENTS policies
CREATE POLICY "Authenticated users can read ingredients" ON ingredients FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Owner can insert ingredients" ON ingredients FOR INSERT WITH CHECK (get_user_role() = 'owner');

-- PRODUCT_INGREDIENTS policies
CREATE POLICY "Authenticated users can read recipes" ON product_ingredients FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Owner can manage recipes" ON product_ingredients FOR ALL USING (get_user_role() = 'owner');

-- DAILY_LOGS policies
CREATE POLICY "Owner can read all logs" ON daily_logs FOR SELECT USING (get_user_role() = 'owner');
CREATE POLICY "Manager can read own logs" ON daily_logs FOR SELECT USING (franchise_id = get_user_franchise_id());
CREATE POLICY "Manager can insert own logs" ON daily_logs FOR INSERT WITH CHECK (franchise_id = get_user_franchise_id());
CREATE POLICY "Manager can update own logs" ON daily_logs FOR UPDATE USING (franchise_id = get_user_franchise_id());

-- DAILY_LOG_ITEMS policies
CREATE POLICY "Owner can read all items" ON daily_log_items FOR SELECT USING (get_user_role() = 'owner');
CREATE POLICY "Manager can read own items" ON daily_log_items FOR SELECT USING (
    daily_log_id IN (SELECT id FROM daily_logs WHERE franchise_id = get_user_franchise_id())
);
CREATE POLICY "Manager can insert own items" ON daily_log_items FOR INSERT WITH CHECK (
    daily_log_id IN (SELECT id FROM daily_logs WHERE franchise_id = get_user_franchise_id())
);
CREATE POLICY "Manager can delete own items" ON daily_log_items FOR DELETE USING (
    daily_log_id IN (SELECT id FROM daily_logs WHERE franchise_id = get_user_franchise_id())
);

-- ============================================================
-- SEED DATA (Initial products and ingredients)
-- Run these AFTER applying the schema above
-- ============================================================

INSERT INTO products (name, packet_size_kg, sort_order) VALUES
    ('Dum Biryani', 3.0, 1),
    ('Tandoori Biryani', 3.0, 2),
    ('Chicken Tikka', 2.0, 3)
ON CONFLICT DO NOTHING;

INSERT INTO ingredients (name, unit) VALUES
    ('Rice', 'kg'),
    ('Berista', 'gm'),
    ('Dum Masala', 'packet'),
    ('Tandoori Masala', 'packet')
ON CONFLICT DO NOTHING;

-- Link Dum Biryani ingredients (per 1 packet = 3kg)
INSERT INTO product_ingredients (product_id, ingredient_id, quantity_per_packet, unit)
SELECT p.id, i.id, 4.0, 'kg'
FROM products p, ingredients i WHERE p.name = 'Dum Biryani' AND i.name = 'Rice'
ON CONFLICT DO NOTHING;

INSERT INTO product_ingredients (product_id, ingredient_id, quantity_per_packet, unit)
SELECT p.id, i.id, 500, 'gm'
FROM products p, ingredients i WHERE p.name = 'Dum Biryani' AND i.name = 'Berista'
ON CONFLICT DO NOTHING;

INSERT INTO product_ingredients (product_id, ingredient_id, quantity_per_packet, unit)
SELECT p.id, i.id, 1.0, 'packet'
FROM products p, ingredients i WHERE p.name = 'Dum Biryani' AND i.name = 'Dum Masala'
ON CONFLICT DO NOTHING;

-- Link Tandoori Biryani ingredients (per 1 packet = 3kg)
INSERT INTO product_ingredients (product_id, ingredient_id, quantity_per_packet, unit)
SELECT p.id, i.id, 4.0, 'kg'
FROM products p, ingredients i WHERE p.name = 'Tandoori Biryani' AND i.name = 'Rice'
ON CONFLICT DO NOTHING;

INSERT INTO product_ingredients (product_id, ingredient_id, quantity_per_packet, unit)
SELECT p.id, i.id, 500, 'gm'
FROM products p, ingredients i WHERE p.name = 'Tandoori Biryani' AND i.name = 'Berista'
ON CONFLICT DO NOTHING;

INSERT INTO product_ingredients (product_id, ingredient_id, quantity_per_packet, unit)
SELECT p.id, i.id, 1.0, 'packet'
FROM products p, ingredients i WHERE p.name = 'Tandoori Biryani' AND i.name = 'Tandoori Masala'
ON CONFLICT DO NOTHING;

-- ============================================================
-- AFTER RUNNING: Set your owner role
-- Replace your-email@example.com with the owner's email
-- ============================================================
-- UPDATE profiles SET role = 'owner' WHERE email = 'your-email@example.com';
