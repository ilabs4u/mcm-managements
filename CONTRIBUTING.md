# Contributing to MCM Management

Welcome to the MCM Franchise Management System! This guide covers everything you need to know to start contributing.

## 📖 Step 0 — Read Before Coding

**This is mandatory.** Don't skip it.

1. Read `memory.md` (project root) — full project brain
2. Read `.context/INDEX.md` — navigation map
3. Read `.context/contributors/_overview.md` — see who's working on what
4. Read `.context/modules/_overview.md` — understand all modules
5. Read your assigned module's `summary.md`
6. Only read `detail.md` when you need exact API specs or schemas

## 🌿 Step 1 — Branch Setup

```bash
# Always start from latest main
git checkout main
git pull origin main

# Create your feature branch
git checkout -b feature/your-task-name
```

Branch naming: `feature/auth-login`, `feature/franchise-daily-entry`, `feature/owner-dashboard`, etc.

## 🛠️ Step 2 — Development

### Environment Setup
```bash
npm install
cp .env.example .env.local
# Fill in Supabase credentials
npm run dev
```

### Coding Standards

1. **API responses**: Always return `{ success: boolean, data?: T, error?: string }`
2. **No new dependencies** without team lead approval
3. **Every component** in its own file
4. **No hardcoded values** — use environment variables or constants
5. **Comments**: Explain WHY, not WHAT
6. **Never remove** existing comments
7. **Match existing patterns** — look at how existing code is structured
8. **Mobile-first CSS** — base styles are mobile, use media queries to scale up
9. **Touch targets** — minimum 48px for any clickable element

### File Organization

- Pages go in `src/app/(group)/path/page.js`
- Components go in `src/components/{module}/ComponentName.js`
- Shared utilities go in `src/lib/`
- Hooks go in `src/hooks/`
- One component per file, named with PascalCase

### CSS Rules

- Use vanilla CSS with CSS custom properties (variables)
- All variables defined in `src/app/globals.css`
- No inline styles
- Use BEM-like naming: `.franchise-card`, `.franchise-card__header`, `.franchise-card--closed`
- Mobile-first: base styles are mobile, add `@media (min-width: 768px)` for tablet, `@media (min-width: 1024px)` for desktop

## ✅ Step 3 — Before Committing

### Update Context Files

1. Update `.context/contributors/dev-{yourname}.md` with what you did
2. If API changed → update `.context/api/{relevant}-endpoints.md`
3. If DB changed → update `.context/database/schema.md`
4. If routes changed → update `.context/routing/routes-table.md`
5. Add entry to `.context/progress/changelog.md`
6. If module completed → update `.context/modules/_overview.md` status

### Commit Message Format

```
[module] Short description

- Detail 1
- Detail 2
```

Examples:
```
[auth] Add login page and Supabase auth integration
[franchise] Implement production entry with auto-calculations
[owner] Add franchise approval workflow
```

## 🔀 Step 4 — Pull Request

1. Push your branch: `git push origin feature/your-task-name`
2. Create PR against `main`
3. Title: `[module] What was done`
4. Description: What changed, what was tested, screenshots for UI changes
5. Request review from team lead

## 🏗️ Module Development Guide

### If you're working on **auth**:
- Start with Supabase client setup (`src/lib/supabase/`)
- Then middleware (`src/middleware.js`)
- Then login/register pages
- Read: `.context/modules/auth/detail.md`

### If you're working on **franchise-portal**:
- Start with `calculations.js` — get the math right first
- Then the `ProductionEntryCard` component
- Then the daily page
- Read: `.context/modules/franchise-portal/detail.md`

### If you're working on **owner-dashboard**:
- Start with the dashboard data query
- Then `FranchiseSummaryCard`
- Then approvals page
- Read: `.context/modules/owner-dashboard/detail.md`

### If you're working on **recipe-management**:
- Start with the products API
- Then `RecipeEditor` component
- Read: `.context/modules/recipe-management/detail.md`

### If you're working on **reports**:
- Start with the monthly query
- Then `MonthlyCalendar` component
- Read: `.context/modules/reports/detail.md`

## 🤖 Using AI Assistants

If you're using Gemini/Copilot/Cursor, the `.agents/AGENTS.md` file will automatically guide the AI to read context first. The AI should:
1. Read `.context/INDEX.md` before any work
2. Read the relevant module files
3. Follow coding standards
4. Update context files after work

## ❓ Questions?

- Check `.context/` files first — most answers are there
- Check `memory.md` for system-level understanding
- If still unclear, mark as `UNKNOWN — NEEDS VERIFICATION` in your code and ask the team
