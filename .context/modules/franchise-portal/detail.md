# Franchise Portal Module — Full Detail

## Endpoints

### GET /api/franchise/today
- **Input**: none (franchise_id from session)
- **Output**: { success: boolean, data?: { log, items[], products[], recipes[] } }
- **Validation**: Must be approved franchise manager
- **Side effects**: None

### POST /api/franchise/entries
- **Input**: { product_id, quantity_kg }
- **Output**: { success: boolean, data?: { entry with material_breakdown } }
- **Validation**: quantity_kg > 0, valid product_id, franchise must be approved
- **Side effects**: UPSERT daily_logs, INSERT daily_log_items with calculated fields

### DELETE /api/franchise/entries/[id]
- **Input**: entry id in URL
- **Output**: { success: boolean }
- **Validation**: Entry must belong to user's franchise, must be today's entry
- **Side effects**: DELETE daily_log_items row

### PATCH /api/franchise/toggle-open
- **Input**: { is_open: boolean }
- **Output**: { success: boolean }
- **Side effects**: UPDATE franchises.is_open, UPDATE/CREATE today's daily_logs.is_open

### GET /api/franchise/history
- **Input**: ?month=2026-07 (query param)
- **Output**: { success: boolean, data?: { logs[] with items[] } }

---

## Auto-Calculation Engine (src/lib/calculations.js)

```
Input: quantity_kg, packet_size_kg, recipe[]

packets = quantity_kg / packet_size_kg

For each ingredient in recipe:
    used = packets × ingredient.quantity_per_packet

Output: { packets, ingredients: [{ name, quantity, unit }] }
```

Example: 1.5 kg Dum Biryani (packet=3kg)
- packets = 1.5 / 3 = 0.5
- Rice = 0.5 × 4 = 2.0 kg
- Berista = 0.5 × 500 = 250 gm
- Dum Masala = 0.5 × 1 = 0.5 packet

## Data Flow

1. Manager opens /franchise
2. Server component loads products + recipes + today's log
3. Manager types 1.5 in Dum Biryani kg input
4. Client-side calculations.js shows live preview (packets + materials)
5. Manager clicks "Add Entry"
6. Server action fetches latest recipe (source of truth)
7. Server calculates packets + materials
8. UPSERT daily_logs (franchise_id, today) → get log_id
9. INSERT daily_log_items (log_id, product_id, 1.5, 0.5, {breakdown})
10. Page revalidates, new entry appears in list

## Component Hierarchy

```
(franchise)/layout.js — nav shell with bottom tabs
  └── franchise/page.js — Today's Production
        ├── OpenCloseToggle
        ├── ProductionEntryCard (× 3 products)
        │     └── MaterialBreakdown (read-only auto-calc display)
        ├── DaySummaryBar (totals at bottom)
        └── EntryHistoryList
              └── PastEntryRow (× N)
  └── franchise/history/page.js — Past Logs
        └── MonthlyCalendar (same component as owner reports)
```

## File Map

| File | Purpose |
|------|---------|
| src/app/(franchise)/layout.js | Franchise nav shell + auth guard |
| src/app/(franchise)/franchise/page.js | Today's production entry page |
| src/app/(franchise)/franchise/history/page.js | Past monthly logs |
| src/components/franchise/ProductionEntryCard.js | Product input + live auto-calc |
| src/components/franchise/MaterialBreakdown.js | Read-only materials display |
| src/components/franchise/DaySummaryBar.js | Today's aggregate totals |
| src/components/franchise/OpenCloseToggle.js | Toggle franchise open/closed |
| src/components/franchise/PastEntryRow.js | Single past entry row |
| src/components/franchise/EntryHistoryList.js | List of past entries |
| src/lib/calculations.js | Auto-calculation engine |
| src/hooks/useDailyLog.js | Today's log CRUD hook |
