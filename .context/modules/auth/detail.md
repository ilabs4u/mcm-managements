# Auth Module — Full Detail

## Endpoints

### POST /api/auth/register
- **Input**: { email, password, full_name, phone, franchise_name, franchise_location }
- **Output**: { success: boolean, data?: { userId, franchiseId } }
- **Validation**: email format, password min 6 chars, franchise_name required
- **Side effects**: Creates auth.users entry, INSERT profiles, INSERT franchises (status=pending)

### POST /api/auth/login
- **Input**: { email, password }
- **Output**: { success: boolean, data?: { session, user, role, franchise_status } }
- **Validation**: Supabase auth validation
- **Side effects**: Creates session cookie

### POST /api/auth/logout
- **Input**: none
- **Output**: { success: boolean }
- **Side effects**: Destroys session

### GET /api/auth/me
- **Input**: none (reads session)
- **Output**: { success: boolean, data?: { user, role, franchise } }

---

## Database Schema

```sql
-- profiles table (extends auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'franchise_manager',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
```

## Data Flow

### Registration Flow
1. Manager fills registration form at /register
2. Client calls Supabase signUp(email, password)
3. Server action creates profile (role='franchise_manager')
4. Server action creates franchise (status='pending')
5. Redirect to /pending (awaiting approval screen)

### Login Flow
1. User enters email + password at /login
2. Supabase validates credentials
3. Middleware reads session, fetches profile + franchise status
4. Routes: owner → /owner, approved manager → /franchise, pending → /pending

### Approval Flow
1. Owner visits /owner/approvals
2. Server component fetches franchises WHERE status='pending'
3. Owner clicks Approve → server action UPDATEs franchise.status='approved'
4. On next login/refresh, manager middleware detects approved → allows /franchise

## Component Hierarchy

```
(auth)/layout.js — minimal centered layout
  ├── login/page.js → LoginForm
  ├── register/page.js → RegisterForm
  └── pending/page.js — static waiting screen
```

## Dependencies

- **This module is imported by**: middleware.js, all protected pages
- **This module imports**: src/lib/supabase/client.js, src/lib/supabase/server.js
- **Impact level**: Critical — everything depends on auth

## File Map

| File | Purpose |
|------|---------|
| src/app/(auth)/login/page.js | Login page with email/password form |
| src/app/(auth)/register/page.js | Franchise registration form |
| src/app/(auth)/pending/page.js | Awaiting approval screen |
| src/middleware.js | Route protection, role-based redirects |
| src/lib/supabase/client.js | Browser-side Supabase client |
| src/lib/supabase/server.js | Server-side Supabase client |
| src/lib/supabase/middleware.js | Session refresh helper |
| src/context/AuthContext.js | React context providing auth state |
| src/hooks/useAuth.js | Hook for auth operations |
