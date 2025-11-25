# Orthodox Parish Web Platform – Product Requirements Document (v2)

## 1. Context, Vision, and Positioning

### 1.1 Problem

Most Orthodox parishes either:

- Run on outdated, static websites built years ago, or  
- Have no real site at all and rely on Facebook, PDFs, or word-of-mouth.

That means:

- Service times, feast days, and events are hard to discover for younger people, travelers, and inquirers.
- Sermons, talks, and spiritual resources are scattered or missing.
- Online giving is fragmented across PayPal buttons, bank details, or generic crowdfunding.
- There is no shared “digital front door” for Orthodoxy, and parishes cannot easily grow their communities online.

### 1.2 Product Vision

Build **the digital home for Orthodox parishes**: a subscription platform that lets any parish (and more traditional Christian churches) launch a beautiful, living website in under an hour.

The platform should:

- Give each parish a **reverent, Orthodox-looking site** that feels legitimate to clergy and lay people.
- Make it easy to publish **service times, feast days, events, sermons, prayer requests, and community needs**.
- Provide **simple, trustworthy online giving** (including “light a candle”) that modestly increases donations over time.
- Require **no technical skills** on the parish side.
- Support **global Orthodoxy**: multilingual content, cross-border donors, and diocesan / multi-parish oversight.

### 1.3 Target Customers

- Primary: Orthodox parishes (ROCOR, GOARCH, Antiochian, OCA, Serbian, Romanian, etc.).
- Secondary: Other traditional or liturgical churches that want a more reverent design direction than generic church builders.
- Higher tier: Dioceses and jurisdictions managing networks of parishes.

### 1.4 Competitive Landscape (Condensed)

**Orthodox‑specific**

- **OrthodoxWS / Orthodox Web Solutions** – Offers Orthodox parish sites and hosting, built largely by their staff from provided text and images. Strong on basic content and tradition-respecting design, weaker on modern SaaS flows, online giving, and live “site as a product” positioning.  

- **GOARCH templates and hosting** – Template-based parish sites with basic CMS and email. Good starting point but limited flexibility and not optimized around growth, donations, or non-Greek jurisdictions.

**General church platforms**

- **Tithe.ly** – Strong giving tools (online, mobile, text-to-give) and church management; websites are an add-on. Center of gravity is payments and donor flows, not Orthodox-specific content.  

- **The Church Co** – Full church digital platform: websites, apps, giving, media, and examples of modern church sites. Clean UX and good builder, but generic branding and theology-neutral content. They even market an “Orthodox church website builder” landing page, but the look and content are still generic.  

- Other players (FaithConnector, ChurchSpring, ChurchDev, etc.) compete on drag-and-drop builders and bundled hosting, but again with generic, evangelical-flavored aesthetics.

### 1.5 Differentiation

This platform differentiates by:

- **Orthodox-first aesthetic** – Templates and icons inspired by real Orthodox sites (e.g., Western American Diocese, Jordanville, Saint Elizabeth’s, Nevsky Publications), not generic startup gradients.
- **Liturgical and pastoral modules** – Service schedules, feast calendars, prayer requests, “light a candle,” sermons, and readings are first-class objects, not generic blog posts.
- **Diaspora and multilingual** – Designed for multi-language parishes and donors abroad by default.
- **Simple, opinionated builder** – A constrained visual builder that keeps everything reverent and usable instead of letting parishes break the design.
- **Diocesan console** – A higher tier for dioceses to standardize themes, push assets, and see analytics across many parishes.

---

## 2. Users and Use Cases

### 2.1 Primary Users

1. **Priest / Rector**
   - Needs an authoritative, up-to-date site without babysitting tech.
   - Publishes schedules, pastoral letters, announcements.

2. **Parish Admin / Communications Lead**
   - Manages pages, events, images, and multilingual content.
   - Launches campaigns and community needs.

3. **Treasurer / Parish Council**
   - Needs trustworthy donation records and simple reporting by fund, project, and time period.

4. **Donors (Local + Diaspora)**
   - Want to quickly see service times, donate once or monthly, and light candles with intentions.

5. **Diocesan Staff**
   - Need to monitor multiple parishes, push shared assets, and enforce basic brand consistency.

6. **Platform Operator (You)**
   - Onboards parishes, manages global projects, supports diocesan contracts, and observes platform-level health.

### 2.2 Key Use Cases

- Parish launches a new website with:
  - Schedule, driving directions, basic introduction to Orthodoxy, clergy bios, and “New to our parish?” content.
- Priest updates Great Feast schedules and adds a banner for Pascha or Theophany in minutes.
- Parish admin publishes weekly announcements and sermons (text, audio, or embedded video).
- Donor from another country finds the parish while traveling and:
  - Sees service times.
  - Reads basic “What to expect” info.
  - Donates online or lights a candle with an intention.
- Internal family in need is supported through a discreet parish-only community need page, not GoFundMe.
- Diocese buys a higher-tier plan and manages 20+ parishes from one console, ensuring coherent themes and seeing network-wide giving trends.

---

## 3. High-Level Scope

### 3.1 Feature Map

#### A. Core Features (Parish Level)

These match the “Core Features” and “Church-Ready Modules” grids you provided, but are mapped into phased product scope.

**Core V1**

- Drag & drop-style **page builder** with pre-built sections.
- **Multilingual support** (at least 2–3 languages to start, extensible).
- **Service calendar** (Divine Liturgy, Vespers, feasts, events).
- **Secure online donations** (one-time and recurring).
- **“Light a Candle”** as a specialized giving flow.
- **Announcements / News**.
- **Sermons & media** (links, embedded audio/video).
- **Location & directions** with map, parking, and accessibility info.
- **Basic analytics dashboard** (visits, giving summary, most-viewed pages).

**Planned Extensions**

- **Prayer requests** (with moderation).
- **Push notifications / PWA** (service reminders, emergency announcements).
- **Live streaming integration** (embed from YouTube, etc., not host video ourselves).
- **Advanced engagement analytics** (sermons views, repeat visitors, etc).

#### B. Church Modules (Content Objects)

- **Events Management**
  - Create and schedule parish events and liturgical services.
  - Distinguish between sacramental services, parish events, and external events.
- **Announcements**
  - Rich-text posts with pinning, scheduling, and categories.
- **Prayer Requests** (later phase)
  - Public or private prayer requests with admin moderation.
- **Sermons & Podcasts**
  - Upload audio files or embed from external hosts.
  - Optional RSS feed for podcast platforms.
- **Online Donations**
  - Funds, projects, community needs, and candles.
- **Push Notifications** (later phase)
  - Web push, email, and/or SMS for key reminders and emergencies.

#### C. Diocesan / Network Features

- **Diocesan console**
  - Unified theme and branding management for all linked parishes.
  - Asset distribution (icons, graphics, pastoral letters, shared documents).
  - Multi-parish network management (permissions, activity monitoring).
  - Network analytics (aggregate giving, site usage trends, event reach).

These are explicitly **post-V1** but influence data model and architecture (multi-tenant by design, not bolted on later).

---

## 4. Architecture and Tech Stack

### 4.1 Core Technology

- **Frontend / Backend**: Next.js (App Router) + React + TypeScript.
- **Hosting**: Vercel.
- **Database & Auth**: Supabase (Postgres + Supabase Auth).
- **Storage**: Supabase Storage for images and documents.
- **Payments**: Stripe (standard accounts initially; Connect as an upgrade path).
- **UI Framework**: Tailwind CSS + shadcn/ui for admin and shared components.

### 4.2 Supabase Integration

- Use `@supabase/ssr` pattern for:
  - Server-side Supabase client for protected pages.
  - Browser client for admin UI interactions.
- **Auth**:
  - Supabase Auth for email/password plus optional OAuth (Google, Microsoft).
  - Supabase `auth.users` as the source of identity; app-specific `users` table for profiles and roles.
- **Row-Level Security (RLS)**:
  - All parish-scoped tables include `parish_id`.
  - RLS policies ensure that users only see rows for parishes where they have roles.

### 4.3 Multi-Tenancy

- Single Supabase project, **row-level multi-tenancy**:
  - `parishes` table defines tenants.
  - `parish_users` connects users to parishes with roles.
- Tenant resolution:
  - Domain/subdomain (`st-elizabeths.yourplatform.com`, `saint-elizabeths.org`).
  - Path-based fallback (`yourplatform.com/p/[parish_slug]`).
- All server-side operations:
  - Derive `parish_id` from the request host or path.
  - Enforce `parish_id` on all queries.

### 4.4 Deployment and Operations

- Single Next.js project deployed on Vercel.
- Environment variables tied to Supabase and Stripe.
- Vercel cron jobs invoke `/api/cron/*` for:
  - Generating monthly reports.
  - Cleaning incomplete donations.
  - Optional scheduled email or notification tasks.

---

## 5. Page Builder / Visual Editor

### 5.1 Builder Goals

The builder must:

- Allow non-technical admins to build and edit the home page and selected key pages.
- Use **pre-built sections** tailored to Orthodox parish needs:
  - Hero with iconography.
  - Service schedule teaser.
  - Feast highlight.
  - Donation and candle calls-to-action.
  - Sermon highlights.
  - Gallery and pilgrimage promos.
- Provide **drag & drop reordering**, **real-time preview**, and **instant publishing**.
- Enforce:
  - Responsive layouts.
  - Typography, color, and spacing aligned with selected theme.
  - No wild styling that breaks reverence.

### 5.2 Implementation Choice: Puck

- Use **Puck** as the embedded page builder / visual editor.
- Puck runs inside the admin panel and emits a **JSON schema** for the page layout.
- We map Puck blocks to internal React components:
  - Examples: `<HeroSection>`, `<SchedulePreview>`, `<DonationPanel>`, `<NewsList>`, `<SermonCardGrid>`, `<GalleryGrid>`.
- We store this JSON in the `pages` table as `builder_schema` (jsonb).

### 5.3 Data Model for Pages

`pages` table (simplified):

- `id` – UUID.
- `parish_id` – UUID.
- `slug` – text.
- `title` – jsonb (per-language titles).
- `kind` – enum: `HOME`, `STATIC`, `SYSTEM`.
- `builder_enabled` – boolean.
- `builder_schema` – jsonb (nullable; for builder-enabled pages).
- `is_system` – boolean.

**Flow:**

1. Admin opens `/admin/pages` and chooses a page.
2. If `builder_enabled`, they enter Puck editor.
3. Puck is configured with allowed components and theme constraints.
4. On save, layout JSON is validated and stored.
5. Public route fetches `builder_schema` and renders via Puck runtime or a custom renderer.

Permissions:

- `ADMIN` and `EDITOR` can fully edit builder pages.
- `CLERGY` can be optionally allowed to change text in specific blocks, but not structural layout.

---

## 6. Detailed Functional Requirements

### 6.1 Parish Website Setup

- Create parish:
  - Name, jurisdiction, location, timezone, default language(s).
- Domain:
  - Auto-generated subdomain.
  - Instructions for custom domain connection.
- Theme:
  - Choose from Orthodox-inspired templates:
    - Example references: Western American Diocese, Jordanville, Saint Elizabeth’s, Nevsky Publications.
  - Configurable colors (liturgical-informed palette), logo, and typography.

Default pages provisioned:

- Home (builder-enabled).
- About / Parish background.
- Service schedule (system).
- Events & calendar (system).
- Announcements / News.
- Sermons & media.
- Giving / donations.
- Projects.
- Community needs.
- Location & directions.
- Contact / prayer requests (optional form).

### 6.2 Admin Dashboard

Sections:

1. **Overview**
   - Quick stats: last 30 days giving, upcoming services, recent announcements.

2. **Pages**
   - List all pages.
   - Edit metadata (title, slug, navigation).
   - Enter builder for enabled pages.

3. **Schedule & Events**
   - Define recurring patterns and one-off events.
   - Mark feasts and major days.
   - Sync-style export (iCal) for parishioners.

4. **Announcements**
   - Create, schedule, pin, and archive announcements.
   - Assign categories (liturgical, pastoral letter, parish life).

5. **Sermons & Media**
   - Add sermons (audio, video link, or text).
   - Group into series.
   - Optional podcast feed.

6. **Giving**
   - Manage funds (general, building, candles, charity).
   - Configure donation defaults and descriptions.
   - View recent donations and recurring gifts.

7. **Projects**
   - Create parish projects with goals, description, and visibility.
   - Connect to specific funds.

8. **Community Needs**
   - Set up internal campaigns with visibility settings.
   - Track donations to each need.

9. **Global Catalog**
   - Attach global projects to parish site and showing them in projects list.

10. **Reports**
    - Filter donations by date, fund, project, community need, currency.
    - Export CSV.

11. **Settings**
    - Parish details, theme, locales, timezones.
    - Parish users and roles (Admin, Treasurer, Clergy, Editor, Viewer).

### 6.3 Service Schedule & Event Calendar

- Support:
  - Regular weekly services.
  - Feast-specific services.
  - One-off events (talks, retreats, pilgrimages).
- Public views:
  - Monthly calendar with Orthodox feast overlay.
  - “This Week” block on homepage.
- Integrations:
  - iCal subscription for parishioners.
  - Future: optional syncing into mobile app/PWA notifications.

### 6.4 Online Giving and Candles

- Stripe-based checkout:
  - One-time and recurring.
  - Donor chooses fund and optional project / community need.
- “Light a Candle”:
  - Dedicated UI with:
    - Candle count.
    - Intention text.
    - Optional link to a specific service date.
  - Stored in donation metadata for clergy reference.
- Multi-currency:
  - Parish admin chooses supported currencies.
  - Donor selects from that list.
- Receipts:
  - Stripe-side receipts initially.
  - Later: platform-branded receipts.

### 6.5 Projects and Community Needs

- Projects:
  - Types: building, mission, charity, monastery support.
  - Configurable goals and progress displays.
- Community Needs:
  - Aimed at internal parish cases.
  - Visibility: public, members-only, private.
  - Kept on parish domain with consistent tone.

### 6.6 Diocesan Console (Post-V1)

- Aggregate view for diocesan leaders:
  - List of parishes and statuses (active, dormant).
  - High-level metrics: monthly giving, site traffic, engagement.
- Theme and asset management:
  - Push base themes and assets (icons, pastoral letters, catechetical materials).
- Governance:
  - Ability to enforce baseline pages and disclosures across parishes.

---

## 7. Non-Functional Requirements

### 7.1 Performance

- Public pages:
  - Aim for sub-1.5s FCP on typical broadband.
  - Use static generation/ISR where possible.
- Admin:
  - Fast enough not to frustrate non-technical users.

### 7.2 Reliability

- Public site and giving should be robust to:
  - Short Supabase read outages (caching content where appropriate).
  - Stripe issues (clear failure messaging).

### 7.3 Security

- Enforce RLS on all parish-scoped tables.
- Use secure cookies with HTTP-only flags for Supabase auth.
- Store only Stripe IDs, not card data.
- Protect admin routes with both auth and role checks.

### 7.4 Compliance Posture

- Align with Stripe’s PCI scope (no direct card handling).
- Allow parishes to export donation data for external accounting and audits.

### 7.5 Observability

- Error tracking in both public and admin flows.
- Logging for:
  - Payment webhooks.
  - Critical admin actions (stored in `audit_log`).
  - Authentication and authorization failures.

---

## 8. Data Model Overview (High Level)

Core tables (Supabase Postgres):

- `parishes`
- `users`
- `parish_users`
- `pages`
- `service_schedules`
- `events`
- `donation_funds`
- `donors`
- `donations`
- `projects`
- `community_needs`
- `media_assets`
- `audit_log`

All except `users` and `donors` are scoped with `parish_id`.

---

## 9. Implementation Phases

**Phase 0 – Infrastructure and Tenancy**

- Next.js + Supabase integration.
- Auth and RLS.
- Parish, users, parish_users schema.

**Phase 1 – Basic Site and Content**

- Static page templates.
- Service schedule, announcements, and basic giving integration.
- Simple admin dashboard.

**Phase 2 – Donations + Candles**

- Full donation flows with Stripe.
- Funds, projects, community needs.
- Basic reporting.

**Phase 3 – Builder Integration**

- Puck integration for homepage and selected pages.
- Pre-built Orthodox-specific sections.
- Theme editor.

**Phase 4 – Church Modules**

- Sermons & media, prayer requests, richer events.
- Initial analytics dashboard.

**Phase 5 – Diocesan Console and Advanced Analytics**

- Multi-parish management.
- Network analytics.
- Asset distribution and theme governance.

---

## 10. Success Metrics

- Time from signup to published parish site.
- Percentage of parish giving routed through the platform after 6–12 months.
- Number of active parishes and diocesan contracts.
- Number of repeat donors and recurring gifts.
- Usage of builder vs support tickets for content changes.


awdASawd2323 - Supabase db password

supabase anon public eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyd2hvc2VjdGdhYXRna29qa2lxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwODI4ODYsImV4cCI6MjA3OTY1ODg4Nn0.JbuoFuoGhBRq1PgmniMPCSXYXvT4tBDxYFZHDt-mUcw

Service role key
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyd2hvc2VjdGdhYXRna29qa2lxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDA4Mjg4NiwiZXhwIjoyMDc5NjU4ODg2fQ.nFef0_gnvtGGui0Wgte9nNmXWZI05Z8bHVBNZm69-sY

supabase Project/trwhosectgaatgkojkiq

github repo https://github.com/miringrains/orthodox.git

GITHUB_PAT="[REDACTED - Use environment variable]"
