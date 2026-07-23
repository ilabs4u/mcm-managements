# Routes Table

## Pages (Next.js App Router)

| Route | File | Purpose | Auth | Role |
|-------|------|---------|------|------|
| `/` | src/app/page.js | Root redirect → /owner or /franchise based on role | Yes | Any |
| `/login` | src/app/(auth)/login/page.js | Login form | No | — |
| `/register` | src/app/(auth)/register/page.js | Franchise registration form | No | — |
| `/pending` | src/app/(auth)/pending/page.js | Awaiting owner approval screen | Yes | franchise_manager (pending) |
| `/owner` | src/app/(owner)/owner/page.js | Owner dashboard — today's aggregates | Yes | owner |
| `/owner/franchises` | src/app/(owner)/owner/franchises/page.js | All franchises list + management | Yes | owner |
| `/owner/franchises/[id]` | src/app/(owner)/owner/franchises/[id]/page.js | Single franchise detail + monthly view | Yes | owner |
| `/owner/approvals` | src/app/(owner)/owner/approvals/page.js | Pending franchise approval requests | Yes | owner |
| `/owner/recipes` | src/app/(owner)/owner/recipes/page.js | Product & recipe management | Yes | owner |
| `/owner/reports` | src/app/(owner)/owner/reports/page.js | Monthly cross-franchise reports | Yes | owner |
| `/franchise` | src/app/(franchise)/franchise/page.js | Today's production entry form | Yes | franchise_manager (approved) |
| `/franchise/history` | src/app/(franchise)/franchise/history/page.js | Past daily logs calendar | Yes | franchise_manager (approved) |

## API Routes

| Route | Method | File | Purpose | Auth |
|-------|--------|------|---------|------|
| `/api/auth/register` | POST | src/app/api/auth/register/route.js | Sign up + create profile + franchise | No |
| `/api/auth/login` | POST | src/app/api/auth/login/route.js | Sign in | No |
| `/api/auth/logout` | POST | src/app/api/auth/logout/route.js | Sign out | Yes |
| `/api/auth/me` | GET | src/app/api/auth/me/route.js | Current user info | Yes |
| `/api/owner/dashboard` | GET | src/app/api/owner/dashboard/route.js | Aggregated today's data | owner |
| `/api/owner/franchises` | GET | src/app/api/owner/franchises/route.js | List franchises | owner |
| `/api/owner/franchises/[id]` | GET, PATCH | src/app/api/owner/franchises/[id]/route.js | Franchise detail + approve/reject | owner |
| `/api/owner/reports` | GET | src/app/api/owner/reports/route.js | Monthly report data | owner |
| `/api/franchise/today` | GET | src/app/api/franchise/today/route.js | Today's log + entries | franchise_manager |
| `/api/franchise/entries` | POST | src/app/api/franchise/entries/route.js | Add production entry | franchise_manager |
| `/api/franchise/entries/[id]` | DELETE | src/app/api/franchise/entries/[id]/route.js | Delete entry | franchise_manager |
| `/api/franchise/toggle-open` | PATCH | src/app/api/franchise/toggle-open/route.js | Toggle open/closed | franchise_manager |
| `/api/franchise/history` | GET | src/app/api/franchise/history/route.js | Past month's logs | franchise_manager |
| `/api/products` | GET, POST | src/app/api/products/route.js | List/create products | Mixed |
| `/api/products/[id]` | PUT | src/app/api/products/[id]/route.js | Update product | owner |
| `/api/products/[id]/recipe` | PUT | src/app/api/products/[id]/recipe/route.js | Update recipe | owner |
| `/api/ingredients` | POST | src/app/api/ingredients/route.js | Add ingredient | owner |

## Middleware

| File | Purpose |
|------|---------|
| src/middleware.js | Auth session validation, role-based route protection, redirect logic |

### Middleware Logic:
1. Public routes (`/login`, `/register`) → allow if not authenticated, redirect if authenticated
2. All other routes → require auth, redirect to `/login` if not
3. Pending franchise managers → only `/pending` allowed
4. `/owner/*` routes → require `role = 'owner'`
5. `/franchise/*` routes → require `role = 'franchise_manager'` + `status = 'approved'`