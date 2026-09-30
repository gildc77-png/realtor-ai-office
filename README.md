# Realtor AI Office

## Product vision

Realtor AI Office is an AI-powered virtual assistant platform for real estate professionals.

## Core philosophy

"Autonomous by Default. Human by Exception."

The system is designed to evolve toward an AI virtual assistant that can prepare, organize, and act on routine real-estate work while requesting human approval only when appropriate.

## Current project status

Foundation

This repository currently provides the technical baseline for the product. It does not yet include MLS integrations, external publishing workflows, AI operations, or production automation.

## Technology stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- ESLint
- npm
- Supabase-ready architecture
- Vercel-compatible architecture

## Local development

1. Install dependencies:
   npm install
2. Start the app in development mode:
   npm run dev
3. Open http://localhost:3000

## Environment setup

Create a local environment file based on .env.example and populate the values for your local environment.

```bash
cp .env.example .env.local
```

Required placeholders:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

If your Supabase project uses a newer publishable key naming convention, align the variable name with that project guidance rather than assuming a fixed name. The application does not use privileged or admin credentials at this stage.

Authentication uses the existing Supabase project and `@supabase/ssr`. Configure the Supabase Auth redirect allowlist for local and deployed `/auth/callback` URLs. Apply any unapplied migrations in `supabase/migrations` in chronological order before completing workspace onboarding. Never commit `.env.local` or service-role credentials.

## High-level future architecture

The foundation is structured to support future domain areas such as:

- assistant
- properties
- marketing
- leads
- calendar
- tasks
- approvals
- audit

The codebase is intentionally organized to separate core application logic from future provider integrations and to prepare for multi-tenant SaaS growth.

## Autonomy model

Future autonomy will be evaluated per task and per channel.

- Level 1 — PREPARE: Chispita prepares the work, and the realtor executes it.
- Level 2 — PREPARE + APPROVE: Chispita prepares the work, the realtor approves, and Chispita executes it.
- Level 3 — AUTOPILOT: Chispita executes automatically according to predefined permissions and rules.

This foundation documents the model but does not implement it yet.

## Security principles

The long-term platform must be designed with trust-first principles:

- Multi-tenant records must be scoped to a tenant or organization.
- Future data access must use Row Level Security and deny-by-default patterns.
- Sensitive and externally visible actions must require explicit approval policies.
- AI-initiated actions must remain auditable and reviewable.

Tenant schema, RLS, and the secure workspace-onboarding migration are maintained under `supabase/migrations`. Their remote application state depends on the configured Supabase project; application code does not use privileged admin credentials.

## Explicitly not implemented yet

- MLS integrations
- real-estate listing ingestion
- social media publishing
- lead automation
- OpenAI API calls
- AI background workers
- external provider integrations
- payment/billing systems
- persistent Properties and Leads data access

Email/password authentication, cookie-backed sessions, protected application routes, organization onboarding, and account context are implemented as the FOUNDATION-003 baseline. Real Properties/Leads CRUD and external integrations remain deferred.

## Architecture overview

See docs/ARCHITECTURE.md for the conceptual system design, future integration boundaries, and principles for autonomy, approvals, and auditability.

