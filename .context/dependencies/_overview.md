# Dependencies Overview

## Core Dependencies (breaking if removed)
- `next` (v15): React framework — SSR, app router, API routes, middleware
- `react` + `react-dom` (v19): UI rendering
- `@supabase/supabase-js`: Supabase client for browser-side DB and auth
- `@supabase/ssr`: Supabase helpers for server-side session management in Next.js

## Peripheral Dependencies (replaceable)
- `@cloudflare/next-on-pages`: Cloudflare Pages adapter for Next.js deployment
- None others in Phase 1 — keeping dependencies minimal

## Dev Dependencies
- `wrangler`: Cloudflare Pages local dev + deployment CLI

→ Critical files: .context/dependencies/critical-files.md
→ Dependency graph: .context/dependencies/dependency-graph.md