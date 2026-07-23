# Dependency Graph

## Core Import Chains

```
src/middleware.js
  → src/lib/supabase/middleware.js
    → @supabase/ssr

src/app/(owner)/owner/page.js (Server Component)
  → src/lib/supabase/server.js
    → @supabase/ssr
    → @supabase/supabase-js

src/app/(franchise)/franchise/page.js (Server Component)
  → src/lib/supabase/server.js
  → src/lib/calculations.js (shared)

src/components/franchise/ProductionEntryCard.js (Client Component)
  → src/lib/supabase/client.js
    → @supabase/supabase-js
  → src/lib/calculations.js (shared — live preview)
  → src/hooks/useDailyLog.js

src/components/owner/FranchiseSummaryCard.js (Client Component)
  → src/hooks/useRealtime.js
    → src/lib/supabase/client.js

src/context/AuthContext.js
  → src/lib/supabase/client.js
  → Used by: ALL pages via src/app/layout.js
```

## Shared Modules (imported by multiple features)

| Module | Used By |
|--------|---------|
| src/lib/calculations.js | franchise-portal (entry), franchise-portal (live preview) |
| src/lib/supabase/server.js | All server components, all API routes |
| src/lib/supabase/client.js | All client components, AuthContext |
| src/lib/formatters.js | All pages (date/number formatting) |
| src/components/owner/MonthlyCalendar.js | reports module, franchise history, franchise detail |