# MCM Franchise Management System

> Mobile-first web app for managing MCM biryani franchise operations — production logging, material tracking, and franchise oversight.

## 🎯 What This Is

MCM is a biryani franchise where the **main owner** supplies raw materials (rice, berista, masalas) to **30+ franchise outlets**. This system automates material tracking:

- **Franchise managers** only log *what they produced* (e.g., "1.5 kg Dum Biryani")
- **System auto-calculates** all raw material usage based on owner-configured recipes
- **Owner dashboard** shows real-time production data across all franchises

### Products & Recipes

| Product | Packet Size | Ingredients per Packet |
|---------|------------|----------------------|
| Dum Biryani | 3 kg | Rice: 4 kg, Berista: 500 gm, Dum Masala: 1 pkt |
| Tandoori Biryani | 3 kg | Rice: 4 kg, Berista: 500 gm, Tandoori Masala: 1 pkt |
| Chicken Tikka | 2 kg | *(no sub-ingredients in Phase 1)* |

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router) |
| Backend | Next.js API Routes + Server Actions |
| Database | Supabase (PostgreSQL + Row-Level Security) |
| Auth | Supabase Auth (email/password + roles) |
| Realtime | Supabase Realtime (WebSocket) |
| Styling | Vanilla CSS (Mobile-First, Dark Theme) |
| Hosting | Cloudflare Pages (Edge Deployment) |

## 📁 Project Structure

```
MCM-Management/
├── .context/                   # 📖 Project context system (READ FIRST)
│   ├── INDEX.md               # Start here — links to everything
│   ├── architecture/          # System design & data flows
│   ├── modules/               # Feature modules (auth, franchise, owner, etc.)
│   ├── api/                   # API endpoint specifications
│   ├── database/              # Schema, entity map, migrations
│   ├── routing/               # All routes + middleware logic
│   ├── dependencies/          # Critical files & dependency graph
│   ├── contributors/          # Developer assignments & activity
│   └── progress/              # Changelog, tech debt, progress tracking
├── .agents/                    # AI agent rules
├── memory.md                   # Full project brain (read for complete understanding)
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── (auth)/            # Login, register, pending
│   │   ├── (owner)/           # Owner dashboard, franchises, recipes, reports
│   │   ├── (franchise)/       # Daily entry, history
│   │   └── api/               # API routes
│   ├── components/            # React components
│   │   ├── ui/                # Reusable UI primitives
│   │   ├── owner/             # Owner-specific components
│   │   └── franchise/         # Franchise-specific components
│   ├── lib/                   # Shared utilities
│   │   ├── supabase/          # Supabase client setup
│   │   ├── calculations.js    # Auto-calculation engine
│   │   └── formatters.js      # Number/date formatting
│   ├── hooks/                 # React hooks
│   └── context/               # React context providers
├── supabase/
│   └── migrations/            # SQL migration files
└── public/                    # Static assets + PWA manifest
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm
- A Supabase account (free tier works)

### 1. Clone & Install
```bash
git clone https://github.com/ilabs4u/MCM-Management.git
cd MCM-Management
npm install
```

### 2. Set Up Supabase
1. Create a new project at [supabase.com](https://supabase.com)
2. Run the migration in `supabase/migrations/001_initial_schema.sql` via the Supabase SQL Editor
3. Copy your project URL and keys

### 3. Configure Environment
```bash
cp .env.example .env.local
```
Fill in:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) on your mobile browser.

### 5. Create Owner Account
Run this SQL in Supabase SQL Editor after registering:
```sql
UPDATE profiles SET role = 'owner' WHERE email = 'your-owner@email.com';
```

## 🧑‍💻 For Developers

**Before writing any code**, read the context system:

1. 📖 Read `memory.md` — full project understanding
2. 📖 Read `.context/INDEX.md` — navigation guide
3. 📖 Read `.context/modules/_overview.md` — what exists
4. 📖 Read `.context/contributors/_overview.md` — who's doing what
5. 📖 Read your assigned module's `summary.md` → then `detail.md` if needed

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full development workflow.

## 🌿 Branch Strategy

```
production      ← 🔒 Client-facing. Lead approval + CI required.
    ↑
pre-production  ← 🔒 Testing/QA. Lead approval required.
    ↑
main            ← Open. Devs merge freely. GitHub contributor credit.
    ↑
feature/xxx     ← Individual dev branches (temporary)
```

## 📋 Modules

| Module | Description | Status |
|--------|-------------|--------|
| **auth** | Login, registration, franchise approval, route protection | 📋 Planned |
| **franchise-portal** | Daily production entry with auto-calculations | 📋 Planned |
| **owner-dashboard** | Aggregate view of all franchises + management | 📋 Planned |
| **recipe-management** | Product & recipe configuration | 📋 Planned |
| **reports** | Monthly calendar view + daily breakdown | 📋 Planned |

## 📄 License

Private — iLabs internal project.
