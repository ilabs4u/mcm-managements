# Auth API Endpoints

## POST /api/auth/register
**Purpose**: Register a new franchise manager + create franchise (pending approval)
**Auth**: Public
**Input**:
```json
{
  "email": "string (required)",
  "password": "string (required, min 6 chars)",
  "full_name": "string (required)",
  "phone": "string (optional)",
  "franchise_name": "string (required)",
  "franchise_location": "string (optional)"
}
```
**Output**: `{ success: true, data: { userId, franchiseId } }`
**Side effects**: 
- Creates auth.users entry via Supabase Auth
- INSERT into profiles (role = 'franchise_manager')
- INSERT into franchises (status = 'pending')

---

## POST /api/auth/login
**Purpose**: Sign in and establish session
**Auth**: Public
**Input**:
```json
{
  "email": "string",
  "password": "string"
}
```
**Output**: `{ success: true, data: { session, user, role, franchise_status } }`
**Side effects**: Creates session cookie via Supabase Auth

---

## POST /api/auth/logout
**Purpose**: Sign out and destroy session
**Auth**: Any authenticated user
**Input**: none
**Output**: `{ success: true }`

---

## GET /api/auth/me
**Purpose**: Get current user profile, role, and franchise info
**Auth**: Any authenticated user
**Input**: none (reads session cookie)
**Output**: `{ success: true, data: { user, role, franchise } }`
