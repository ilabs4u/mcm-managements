# Reports Module — Summary

Provides monthly calendar view and aggregated reports for the owner to review franchise performance. Shows daily production breakdown per franchise in a calendar grid, with drill-down into individual days. Supports month navigation and franchise selection dropdown. Also used by franchise managers for their own history view.

**Key files**: src/app/(owner)/owner/reports/page.js, src/components/owner/MonthlyCalendar.js, src/components/owner/DayDetailModal.js
**DB tables**: daily_logs, daily_log_items, franchises
**External deps**: None beyond Supabase
**Data flow**: Owner selects franchise + month → Server queries date range → Calendar grid rendered → Click day for modal detail

→ Full detail: .context/modules/reports/detail.md
