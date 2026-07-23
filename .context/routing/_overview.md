# Routing Overview

| Group | Routes | Auth Required | One-liner |
|-------|--------|---------------|-----------|
| Auth | 3 | No | Login, register, pending approval |
| Owner | 5 | Yes (owner) | Dashboard, franchises, approvals, recipes, reports |
| Franchise | 2 | Yes (franchise_manager, approved) | Today's entry, history |
| API - Auth | 4 | Mixed | Auth endpoints |
| API - Owner | 5 | Yes (owner) | Owner data endpoints |
| API - Franchise | 5 | Yes (franchise_manager) | Franchise data endpoints |
| API - Products | 4 | Mixed | Product/recipe endpoints |

→ Full table: .context/routing/routes-table.md