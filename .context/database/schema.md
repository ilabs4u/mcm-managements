# Database Schema

## profiles
```sql
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'franchise_manager' 
        CHECK (role IN ('owner', 'franchise_manager')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
```
**Purpose**: Extends Supabase auth.users with app-specific profile data and role.
**Relationships**: id references auth.users(id)
**Referenced by**: franchises.manager_id, franchises.approved_by

---

## franchises
```sql
CREATE TABLE franchises (
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

CREATE INDEX idx_franchises_status ON franchises(status);
CREATE INDEX idx_franchises_manager ON franchises(manager_id);
```
**Purpose**: Represents each franchise outlet with approval workflow.
**Relationships**: manager_id → profiles.id, approved_by → profiles.id
**Referenced by**: daily_logs.franchise_id

---

## products
```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    packet_size_kg FLOAT NOT NULL,
    unit TEXT DEFAULT 'kg',
    is_active BOOLEAN DEFAULT true,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
```
**Purpose**: Product catalog (Dum Biryani, Tandoori Biryani, Chicken Tikka).
**Relationships**: None inbound
**Referenced by**: product_ingredients.product_id, daily_log_items.product_id

---

## ingredients
```sql
CREATE TABLE ingredients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    unit TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);
```
**Purpose**: Raw materials used in production (Rice, Berista, Dum Masala, Tandoori Masala).
**Referenced by**: product_ingredients.ingredient_id

---

## product_ingredients
```sql
CREATE TABLE product_ingredients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
    quantity_per_packet FLOAT NOT NULL,
    unit TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(product_id, ingredient_id)
);
```
**Purpose**: Recipe mapping — how much of each ingredient is needed per 1 packet of a product.
**Relationships**: product_id → products.id, ingredient_id → ingredients.id

---

## daily_logs
```sql
CREATE TABLE daily_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    franchise_id UUID NOT NULL REFERENCES franchises(id) ON DELETE CASCADE,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    is_open BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(franchise_id, log_date)
);

CREATE INDEX idx_daily_logs_date ON daily_logs(franchise_id, log_date);
```
**Purpose**: One record per franchise per day. Acts as a container for that day's production entries.
**Relationships**: franchise_id → franchises.id
**Referenced by**: daily_log_items.daily_log_id

---

## daily_log_items
```sql
CREATE TABLE daily_log_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    daily_log_id UUID NOT NULL REFERENCES daily_logs(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    quantity_kg FLOAT NOT NULL CHECK (quantity_kg >= 0),
    quantity_packets FLOAT NOT NULL,
    material_breakdown JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_log_items_log ON daily_log_items(daily_log_id);
```
**Purpose**: Individual production entry. Multiple per day per franchise (manager can log multiple times). Material breakdown is a JSON snapshot of the calculation at time of entry.
**Relationships**: daily_log_id → daily_logs.id, product_id → products.id

### material_breakdown JSON format:
```json
{
  "ingredients": [
    { "name": "Rice", "quantity": 2.0, "unit": "kg" },
    { "name": "Berista", "quantity": 250, "unit": "gm" },
    { "name": "Dum Masala", "quantity": 0.5, "unit": "packet" }
  ],
  "packets_used": 0.5,
  "product_name": "Dum Biryani",
  "quantity_kg": 1.5
}
```