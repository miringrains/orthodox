# Orthodox Parish Platform

A multi-tenant SaaS platform for Orthodox parishes to build beautiful, reverent websites with integrated online giving, event management, and content management.

## Features

- **Multi-tenant Architecture**: Path-based tenancy (`/p/[parish-slug]`) with row-level security
- **Page Builder**: Visual drag-and-drop page builder using Puck
- **Online Giving**: Stripe integration for donations and "Light a Candle" functionality
- **Content Management**: Announcements, events, sermons, service schedules
- **Admin Dashboard**: Comprehensive admin interface for managing parish content
- **Type Safety**: Full TypeScript with auto-generated Supabase types

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **UI**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage, RLS)
- **Payments**: Stripe (stubbed, ready for keys)
- **Page Builder**: Puck

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- (Optional) Stripe account for payments

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

3. Generate TypeScript types:
```bash
npm run types:generate
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

The database schema is managed via Supabase migrations. Migrations have been applied:

- `001_initial_schema.sql` - Core tables
- `002_rls_policies.sql` - Row-level security policies
- `003_indexes_functions.sql` - Performance indexes and triggers

## Project Structure

```
frontend/
├── app/
│   ├── (auth)/          # Authentication routes
│   ├── (admin)/        # Admin dashboard routes
│   ├── p/[slug]/       # Public parish routes
│   └── api/            # API routes
├── components/
│   ├── layouts/        # Layout components
│   ├── puck/           # Puck builder components
│   └── ui/             # shadcn/ui components
├── lib/
│   ├── supabase/       # Supabase clients
│   ├── auth.ts         # Auth helpers
│   ├── tenancy.ts      # Tenant resolution
│   └── database.types.ts # Generated types
└── middleware.ts       # Route protection
```

## Key Features

### Multi-Tenancy

Parishes are accessed via `/p/[parish-slug]`. The middleware extracts the slug and sets the `parish_id` for all queries. RLS policies ensure data isolation.

### Page Builder

Pages can be built using the Puck visual editor. Builder-enabled pages store their schema in `pages.builder_schema` (JSONB) and render using the Puck Renderer component.

### Online Giving

Donations are handled via Stripe (currently stubbed). The platform supports:
- One-time and recurring donations
- Multiple donation funds
- Projects and community needs
- "Light a Candle" functionality

## Deployment

### Vercel

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy!

The platform is optimized for Vercel's edge network and serverless functions.

## Type Generation

TypeScript types are auto-generated from Supabase. To regenerate:

```bash
npm run types:generate
```

A GitHub Action can be set up to regenerate types nightly (see `.github/workflows/update-types.yml` in the plan).

## License

Private - All rights reserved
