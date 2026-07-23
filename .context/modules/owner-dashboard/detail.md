# Owner Dashboard Module — Full Detail

## Endpoints

### GET /api/owner/dashboard
- **Input**: none
- **Output**: { success: boolean, data?: { franchises[], todayTotals, materialTotals } }
- **Validation**: Must be owner role
- **Side effects**: None

### GET /api/owner/franchises
- **Input**: ?status=approved|pending|all (query param)
- **Output**: { success: boolean, data?: { franchises[] } }

### GET /api/owner/franchises/[id]
- **Input**: franchise id in URL, ?month=2026-07 (optional)
- **Output**: { success: boolean, data?: { franchise, logs[], manager } }

### PATCH /api/owner/franchises/[id]
- **Input**: { status: 'approved'|'rejected'|'suspended' }
- **Output**: { success: boolean }
- **Side effects**: Updates franchise status, sets approved_at + approved_by if approving

---

## Data Flow

1. Owner opens /owner (dashboard)
2. Server component fetches all approved franchises with today's logs via JOIN query
3. Aggregates: total packets per product, total materials across all franchises
4. Renders TodayAggregateBar with cross-franchise totals
5. Renders FranchiseSummaryCard for each franchise (30+ cards, scrollable)
6. Client subscribes to Realtime on daily_log_items table
7. On new INSERT event → updates relevant franchise card + recalculates totals

## Component Hierarchy

```
(owner)/layout.js — nav shell with sidebar (desktop) + bottom nav (mobile)
  └── owner/page.js — Dashboard
        ├── TodayAggregateBar (cross-franchise totals)
        └── FranchiseSummaryCard (× 30+ franchises)
              └── FranchiseStatusBadge
  └── owner/franchises/page.js — All franchises list
  └── owner/franchises/[id]/page.js — Single franchise detail
        └── MonthlyCalendar + DayDetailModal
  └── owner/approvals/page.js — Pending approvals
        └── ApprovalCard (× N pending)
```

## Dependencies

- **This module is imported by**: None (top-level page)
- **This module imports**: auth module, calculations.js, supabase clients, UI components
- **Impact level**: High — primary owner interface

## File Map

| File | Purpose |
|------|---------|
| src/app/(owner)/layout.js | Owner nav shell + auth guard |
| src/app/(owner)/owner/page.js | Main dashboard with aggregate + cards |
| src/app/(owner)/owner/franchises/page.js | All franchises list view |
| src/app/(owner)/owner/franchises/[id]/page.js | Single franchise monthly detail |
| src/app/(owner)/owner/approvals/page.js | Pending franchise approvals |
| src/components/owner/TodayAggregateBar.js | Top bar with today's totals |
| src/components/owner/FranchiseSummaryCard.js | Per-franchise today's data |
| src/components/owner/FranchiseStatusBadge.js | Open/Closed/Pending badge |
| src/components/owner/ApprovalCard.js | Pending approval action card |
| src/components/owner/DayDetailModal.js | Modal for drill-into day data |
| src/hooks/useFranchises.js | Franchise list hook |
| src/hooks/useRealtime.js | Supabase realtime subscription hook |
