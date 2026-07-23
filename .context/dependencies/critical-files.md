# Critical Files

These files have high impact. Modifying them affects many parts of the system.
**Do not change these without understanding downstream effects.**

| File | Impact | Why It's Critical |
|------|--------|-------------------|
| src/middleware.js | Critical | Auth guard for ALL routes — breaking this breaks access control |
| src/lib/supabase/server.js | Critical | Server-side Supabase client — used by every server component and API route |
| src/lib/supabase/client.js | Critical | Browser-side Supabase client — used by every client component |
| src/lib/calculations.js | High | Auto-calculation engine — wrong math = wrong material tracking everywhere |
| src/app/globals.css | High | Design system tokens — changing variables affects all components |
| src/context/AuthContext.js | High | Auth state provider — wraps entire app |
| .env.local | Critical | Supabase keys — missing = entire app broken |
| supabase/migrations/001_initial_schema.sql | Critical | Database schema — all tables, RLS, seed data |

_Update this as the project grows._