# Data Flow Traces

## 1. Franchise Registration
Manager fills form → POST /api/auth/register → Supabase Auth creates user → INSERT profiles (role=franchise_manager) → INSERT franchises (status=pending) → Redirect to /pending

1. Manager enters name, email, password, franchise name, location
2. Client calls Supabase `signUp(email, password)`
3. Server action creates profile row with `role = 'franchise_manager'`
4. Server action creates franchise row with `status = 'pending'`
5. Manager sees "Awaiting approval" screen

## 2. Owner Approves Franchise
Owner visits /owner/approvals → sees pending list → clicks Approve → PATCH franchises SET status='approved' → Manager can now access /franchise

1. Owner dashboard loads pending franchises via server component
2. Owner clicks "Approve" button
3. Server action updates franchise status to 'approved', sets approved_at
4. Next time manager logs in, middleware detects approved status → allows /franchise access

## 3. Daily Production Entry (CORE FLOW)
Manager enters kg produced → Client-side auto-calc preview → Save → Server validates + calculates → INSERT daily_log_items → Owner dashboard updates via Realtime

1. Manager opens /franchise (today's page)
2. Enters quantity in kg for a product (e.g., 1.5 kg Dum Biryani)
3. Client-side calculation shows live preview: 0.5 packets, 2kg rice, 250gm berista, 0.5 dum masala
4. Manager clicks "Add Entry"
5. Server action fetches latest recipe from DB (source of truth)
6. Server calculates: packets = 1.5/3 = 0.5, materials from recipe
7. UPSERT daily_logs (one per franchise per day)
8. INSERT daily_log_items with quantity_kg, quantity_packets, material_breakdown JSON
9. Supabase Realtime broadcasts INSERT event
10. Owner dashboard picks up event, updates aggregate totals

## 4. Owner Views Dashboard
Owner opens /owner → Server component fetches all franchises + today's logs → Aggregates totals → Renders cards

1. Server component queries all approved franchises
2. LEFT JOIN with today's daily_logs and daily_log_items
3. Aggregates per-franchise totals (packets per product, material totals)
4. Aggregates cross-franchise totals for summary bar
5. Renders franchise cards with status badges (open/closed)
6. Client subscribes to Realtime for live updates

## 5. Recipe Update by Owner
Owner edits recipe → UPDATE product_ingredients → All franchise portals use new recipe for future entries

1. Owner navigates to /owner/recipes
2. Edits ingredient quantity (e.g., rice from 4kg to 5kg per packet)
3. Server action updates product_ingredients row
4. All future calculations by any franchise use the new value
5. Past entries retain their original material_breakdown (stored as JSON snapshot)

## 6. Monthly Report
Owner selects franchise + month → Server fetches daily_logs for date range → Renders calendar grid with daily totals

1. Owner selects franchise from dropdown and month/year
2. Server component queries daily_logs + daily_log_items for the date range
3. Groups by date, aggregates per-product totals
4. Renders calendar grid: each day cell shows D:Xpkt T:Ypkt K:Zpkt
5. Month summary row shows total packets + total materials
6. Clicking a day opens detail modal with individual entries