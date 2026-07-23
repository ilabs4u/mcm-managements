# Contributors Overview

| Developer | Current Module | Branch | Status | Last Active |
|-----------|---------------|--------|--------|-------------|
| Yash | TBD (selecting module) | feature/TBD | 🔨 Onboarding | 2026-07-20 |
| Antigravity | Setup | main | 🔨 Working | 2026-07-20 |

→ Details: .context/contributors/dev-{name}.md

_Status: 🔨 Working | ⏸️ Idle | 🚫 Blocked_

## How to Add a New Developer

1. Create `.context/contributors/dev-{name}.md` using the contributor template
2. Add a row to this table
3. Assign them a module from `.context/modules/_overview.md`
4. Have them read: `memory.md` → `.context/INDEX.md` → `.context/modules/_overview.md` → their assigned module's `summary.md`

## Module Ownership Guidelines

Modules are designed to be worked on independently with minimal conflicts:

| Module | Dependencies | Can Be Worked Independently? |
|--------|-------------|------------------------------|
| auth | Supabase setup | ✅ Yes — start here first |
| franchise-portal | auth, calculations.js | ✅ Yes — after auth is done |
| owner-dashboard | auth, franchise-portal (data) | ✅ Yes — after auth is done |
| recipe-management | auth | ✅ Yes — after auth is done |
| reports | auth, daily_logs data | ⚠️ Best after franchise-portal has some data |

## Recommended Build Order for Team

1. **Dev 1**: auth module → then recipe-management
2. **Dev 2**: franchise-portal (core flow) → can start after auth basics
3. **Dev 3**: owner-dashboard → can start after auth basics
4. **Dev 4**: reports module → start after franchise-portal has entry flow working
5. **Shared**: UI components (src/components/ui/) → anyone can contribute
