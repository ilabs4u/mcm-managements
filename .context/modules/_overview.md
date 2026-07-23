# Module Overview

Brief summary of every module and its current build status.

## Auth
**Status**: ✅ Built
Files: `src/app/(auth)/login/`, `src/app/(auth)/register/`, `src/app/(auth)/pending/`, `src/app/api/auth/`, `src/context/AuthContext.js`, `src/hooks/useAuth.js`, `src/components/auth/`
Notes: Supabase Auth with cookie-based SSR session. Role-based redirects via middleware. Registration creates profile + pending franchise atomically.

## Franchise Portal
**Status**: ✅ Built
Files: `src/app/franchise/`, `src/app/api/franchise/`, `src/components/franchise/`, `src/hooks/useDailyLog.js`
Notes: Full daily entry flow with server-side calculation (source of truth). Material breakdown frozen in JSONB per entry. Open/close toggle. Monthly history calendar.

## Owner Dashboard
**Status**: ✅ Built
Files: `src/app/owner/`, `src/app/api/owner/dashboard/`, `src/components/owner/TodayAggregateBar.js`, `src/components/owner/FranchiseSummaryCard.js`, `src/hooks/useRealtime.js`
Notes: Aggregate view of all franchises. Supabase Realtime subscription refreshes dashboard on new entries. Glassmorphic bottom nav with 5 tabs.

## Franchise Management & Approvals
**Status**: ✅ Built
Files: `src/app/owner/franchises/`, `src/app/owner/approvals/`, `src/app/api/owner/franchises/`, `src/components/owner/ApprovalCard.js`
Notes: Filter tabs by status. Approve/reject/suspend. Sets approved_at + approved_by on approval.

## Recipe Management
**Status**: ✅ Built
Files: `src/app/owner/recipes/`, `src/app/api/products/`, `src/app/api/ingredients/`, `src/components/owner/ProductCard.js`, `src/components/owner/RecipeEditor.js`, `src/hooks/useProducts.js`
Notes: Expandable product cards with inline recipe editor. Recipe changes only affect future entries — past entries retain frozen JSON snapshot.

## Reports
**Status**: ✅ Built
Files: `src/app/owner/reports/`, `src/app/api/owner/reports/`, `src/components/owner/MonthlyCalendar.js`
Notes: Franchise selector + month navigator + calendar grid with day packets count. Click day for detail modal. Monthly material totals summary.

## Shared Library
**Status**: ✅ Built
Files: `src/lib/supabase/client.js`, `src/lib/supabase/server.js`, `src/lib/supabase/middleware.js`, `src/lib/calculations.js`, `src/lib/constants.js`, `src/lib/formatters.js`, `src/middleware.js`
Notes: Full auto-calculation engine. Route protection middleware with role + franchise status checks.