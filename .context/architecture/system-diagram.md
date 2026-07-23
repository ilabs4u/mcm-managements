# System Architecture Diagram

```
📱 Mobile Browser / PWA
        ↓
Cloudflare Edge Network (300+ cities)
        ↓
Next.js 15 App Router
  ├── Middleware (auth session validation, role-based route guards)
  ├── Server Components (data fetching via Supabase server client)
  ├── Client Components (interactive forms, realtime subscriptions)
  └── API Routes / Server Actions (mutations, calculations)
        ↓
Supabase Platform
  ├── Auth Service (signup, login, session management)
  ├── PostgreSQL Database (7 tables with RLS)
  ├── Realtime Engine (WebSocket subscriptions for live updates)
  └── Storage (future: franchise images, receipts)
```

## External Services
- **Supabase** — Database, auth, realtime (supabase.com)
- **Cloudflare Pages** — Edge hosting + CDN
- **Google Fonts** — Inter font family

## Workers / Cron Jobs
- None in Phase 1
- Phase 2: Supabase cron for low-inventory alerts