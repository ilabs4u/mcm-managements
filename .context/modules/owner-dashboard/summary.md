# Owner Dashboard Module — Summary

The owner's main view showing aggregated production data across all 30+ franchises. Displays today's total packets and materials, per-franchise summary cards with open/closed status, and a franchise management section for approving/rejecting/suspending outlets. Uses Supabase Realtime for live updates when franchises log production.

**Key files**: src/app/(owner)/owner/page.js, src/app/(owner)/owner/franchises/, src/components/owner/
**DB tables**: franchises, daily_logs, daily_log_items, profiles
**External deps**: @supabase/supabase-js (Realtime subscriptions)
**Data flow**: Server fetches all approved franchises + today's logs → Aggregates → Renders cards → Client subscribes to Realtime for live updates

→ Full detail: .context/modules/owner-dashboard/detail.md
