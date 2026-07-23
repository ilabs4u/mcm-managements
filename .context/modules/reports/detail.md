# Reports Module — Full Detail

## Endpoints

### GET /api/owner/reports
- **Input**: ?franchise_id=UUID&month=2026-07 (query params)
- **Output**: { success: boolean, data?: { days[], monthSummary } }
- **Validation**: Owner role, valid franchise_id, valid month format
- **Side effects**: None

---

## Key SQL Query

```sql
SELECT 
    dl.log_date,
    dl.is_open,
    p.name AS product_name,
    SUM(dli.quantity_packets) AS total_packets,
    SUM(dli.quantity_kg) AS total_kg
FROM daily_logs dl
LEFT JOIN daily_log_items dli ON dl.id = dli.daily_log_id
LEFT JOIN products p ON dli.product_id = p.id
WHERE dl.franchise_id = $1
    AND dl.log_date >= $2
    AND dl.log_date <= $3
GROUP BY dl.log_date, dl.is_open, p.name, p.sort_order
ORDER BY dl.log_date DESC, p.sort_order;
```

## Data Flow

1. Owner selects franchise from dropdown and month/year
2. Server component queries daily_logs + daily_log_items for date range
3. Groups by date, aggregates per-product totals per day
4. Renders calendar grid — each cell shows product packet counts
5. Closed days show red badge
6. Month summary bar at bottom: total packets + total materials
7. Clicking a day cell opens DayDetailModal with individual entries

## Component Hierarchy

```
owner/reports/page.js
  ├── Franchise selector dropdown
  ├── Month navigator (◄ July 2026 ►)
  ├── MonthlyCalendar
  │     └── Day cells with packet counts
  ├── DayDetailModal (on cell click)
  │     └── List of individual entries with timestamps
  └── Month summary bar (total packets + materials)
```

## File Map

| File | Purpose |
|------|---------|
| src/app/(owner)/owner/reports/page.js | Monthly reports page |
| src/components/owner/MonthlyCalendar.js | Calendar grid component |
| src/components/owner/DayDetailModal.js | Day drill-down modal |
