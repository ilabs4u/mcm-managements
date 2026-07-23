# Franchise Portal Module — Summary

The core module for franchise managers. Provides a mobile-first daily production entry form where managers only input kg produced — the system auto-calculates packets and material usage from owner-configured recipes. Supports multiple entries per day, open/close toggle, and past entry history.

**Key files**: src/app/(franchise)/, src/components/franchise/, src/lib/calculations.js
**DB tables**: daily_logs, daily_log_items, products, product_ingredients
**External deps**: @supabase/supabase-js (realtime not needed for franchise)
**Data flow**: Manager enters kg → calculations.js computes materials → Server action validates + stores → daily_log_items created with JSON breakdown

→ Full detail: .context/modules/franchise-portal/detail.md
