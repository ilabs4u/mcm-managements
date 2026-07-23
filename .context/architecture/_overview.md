# Architecture Overview

| Layer | Technology | One-liner |
|-------|-----------|----------|
| Frontend | Next.js 15 (App Router) | React-based SSR/SSG framework with server components |
| Backend | Next.js API Routes + Server Actions | Server-side logic co-located with frontend |
| Database | Supabase PostgreSQL | Managed Postgres with Row-Level Security |
| Auth | Supabase Auth | Email/password auth with role-based access (owner / franchise_manager) |
| Realtime | Supabase Realtime | WebSocket subscriptions for live dashboard updates |
| Styling | Vanilla CSS (Mobile-First) | Custom design system with dark theme, saffron brand colors |
| Hosting | Cloudflare Pages | Edge deployment via @cloudflare/next-on-pages |

## System Layers

1. **Client Layer** — Mobile browsers / PWA installed on home screen
2. **Application Layer** — Next.js on Cloudflare Edge (SSR + API routes)
3. **Data Layer** — Supabase (PostgreSQL + Auth + Realtime + Storage)

## Key Patterns

- **Mobile-first responsive** — Base styles are mobile, scale up with breakpoints
- **Server Components** — Data fetching happens on server, minimal client JS
- **Row-Level Security** — Database enforces data isolation per franchise
- **Auto-calculation engine** — Material usage computed from production entries + recipes

→ System diagram: .context/architecture/system-diagram.md
→ Data flows: .context/architecture/data-flows.md