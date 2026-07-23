# Changelog

## 2026-07-19
- [System] Project initialized with iLabs context system
- [System] System architecture designed — Next.js 15 + Supabase + Cloudflare Pages
- [System] Database schema designed — 7 tables with RLS policies
- [System] All context files created — architecture, modules, API, database, routing, dependencies
- [System] README.md and CONTRIBUTING.md created for developer onboarding

## 2026-07-20
- [Yash] FULL BUILD SESSION — all 5 modules + shared infrastructure implemented (~60 files)
- [Yash] Phase 1: Foundation — src/lib/supabase/, calculations.js, constants.js, formatters.js, middleware.js
- [Yash] Phase 2: Shared UI — Badge, Modal, Spinner, EmptyState, PageHeader, layout.css, ui.css extensions
- [Yash] Phase 3: Auth module — login/register/pending pages, 4 API routes, AuthContext, useAuth, LoginForm, RegisterForm
- [Yash] Phase 4: Franchise Portal — 5 API routes, 6 components, useDailyLog, server+client pages, history
- [Yash] Phase 5: Owner Dashboard — 4 API routes, TodayAggregateBar, FranchiseSummaryCard, ApprovalCard, useRealtime, useFranchises
- [Yash] Phase 6: Recipe Management — 4 API routes, ProductCard, RecipeEditor, useProducts, recipes page
- [Yash] Phase 7: Reports — MonthlyCalendar with day modal, reports page, franchise history page
- [Yash] DB migration created — supabase/migrations/001_initial_schema.sql (7 tables, RLS, seed data)
- [Yash] @supabase/ssr installed

_Format: [Developer] What was done (PR #XX)_