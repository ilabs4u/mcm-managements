# Auth Module — Summary

Handles user authentication (login/signup), franchise registration with owner approval workflow, role-based route protection via Next.js middleware, and session management. Uses Supabase Auth for identity and a profiles table for app-specific role data.

**Key files**: src/app/(auth)/, src/middleware.js, src/lib/supabase/, src/context/AuthContext.js
**DB tables**: profiles, franchises (status field)
**External deps**: @supabase/supabase-js, @supabase/ssr
**Data flow**: Register form → Supabase signUp → INSERT profile + franchise (pending) → Owner approves → status='approved' → Login → Middleware checks role → Route access

→ Full detail: .context/modules/auth/detail.md
