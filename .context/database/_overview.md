# Database Overview

**Type**: PostgreSQL
**Host**: Supabase (managed)
**Connection**: Via @supabase/supabase-js (browser) + @supabase/ssr (server)

| Table | Owner Module | One-liner |
|-------|-------------|-----------|
| profiles | Auth | User accounts — extends Supabase auth.users |
| franchises | Auth / Franchise Mgmt | Franchise outlets with approval status |
| products | Recipe Management | Products sold (Dum Biryani, Tandoori, Tikka) |
| ingredients | Recipe Management | Raw materials (Rice, Berista, Masalas) |
| product_ingredients | Recipe Management | Recipe mappings — qty per packet per product |
| daily_logs | Daily Operations | One log per franchise per day |
| daily_log_items | Daily Operations | Individual production entries with auto-calc |

→ Full schema: .context/database/schema.md
→ Entity map: .context/database/entity-map.md