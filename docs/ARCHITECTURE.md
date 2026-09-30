# Architecture

## Conceptual system architecture

Realtor AI Office is a multi-tenant SaaS product and the application architecture should treat organization boundaries as a first-order concern. The product is organized into clear layers so provider-specific logic does not leak into the business domain.

Core layers:

- presentation layer: dashboard shell, components, workflows, and forms
- domain layer: assistant, properties, leads, marketing, calendar, tasks, approvals, and audit logic
- security layer: tenant isolation, role checks, approval requirements, and server-side data access
- integration layer: adapter/service boundaries for external providers only when they are introduced

The application is intentionally designed to support future AI orchestration without hard-coding provider or automation logic throughout the UI or domain model.

## Default visual identity and design reference

The accepted default design atmosphere remains the dark premium SaaS treatment:

- deep navy / dark blue outer background
- subtle blue glow toward the central work area
- layered card surfaces with controlled contrast
- professional readability and measured depth
- no flat black excess or neon saturation

The official dashboard reference is documented in [docs/DESIGN-SYSTEM.md](DESIGN-SYSTEM.md) and the associated image is:

- docs/dashboard-reference.png

This reference defines the desired structure, information hierarchy, and dashboard composition. The implementation should follow the same layout intent without hard-coded screenshot matching.

## Multi-tenant foundation

The platform is designed for multiple organizations. Each business record must be scoped to an organization and only visible when the authenticated user is a valid member of that organization.

Recommended base tables:

- organizations
- profiles
- organization_memberships

Example intended fields:

- organizations: id, name, slug, created_at, updated_at
- profiles: id, auth_user_id, first_name, last_name, display_name, avatar_url, created_at, updated_at
- organization_memberships: id, organization_id, profile_id, role, status, created_at, updated_at

The rule is simple: deny by default and require explicit authorization.

## Roles and authorization model

Core roles are centralized as a domain contract rather than scattered across UI logic:

- owner
- admin
- agent
- assistant
- viewer

These roles should be represented through a shared type layer and used by server-side checks, authorization helpers, and route-level protections. Hidden UI is not a security control.

## Authentication architecture

The application uses Supabase Auth with `@supabase/ssr` and cookie-backed sessions in the Next.js App Router.

Session and route boundaries:

- the browser client uses only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- server components read the same session through the cookie-bound server client and verify identity with `auth.getUser()`
- `src/proxy.ts` refreshes session cookies and redirects unauthenticated requests for protected route families while preserving a local return path
- the `(office)` server layout independently requires a verified user, profile, active membership, and organization before rendering protected content
- Proxy is a refresh/early-redirect layer, not the sole authorization boundary
- auth callback exchanges PKCE codes server-side and accepts only same-origin internal return paths
- no service-role or database credentials are exposed to browser code

The environment contract remains `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Auth callback URLs for local and deployed origins must be included in the Supabase Auth redirect allowlist.

### Session, tenant, and role resolution

Server-side context resolution follows:

`auth.getUser()` → `profiles.auth_user_id` → earliest active `organization_memberships` row → `organizations.id` → validated centralized role.

The earliest active membership is the default organization for this foundation. The query is per-request/server-render scoped; organization switching can replace this selection later. Missing profile or active membership routes the authenticated account to `/onboarding`; an unavailable or inconsistent workspace fails closed and presents recovery/sign-out guidance.

`requireUser`, `requireMembership`, `requireOrganization`, and `requireRole` are server-side helpers. Roles derive from database membership, never from form fields, browser state, or URL input. Central role capabilities are intentionally small: owner/admin can manage workspace and members; agents can perform normal operations; assistant/viewer are read-only until scoped support permissions are defined; approvals remain explicit.

### Onboarding lifecycle

Signup stores the submitted name only as auth metadata. Once a user is authenticated, onboarding invokes `public.complete_workspace_onboarding` with the name and workspace name. The security-definer function derives `auth.uid()` and email from the Supabase JWT/auth schema, locks onboarding per user, upserts that user's profile, and atomically creates a new organization, active owner membership, conservative `prepare_approve` autonomy policy, and audit events. The browser cannot provide a user ID, organization ID, or role. Function execution is revoked from `PUBLIC`/`anon` and granted only to `authenticated`.

The RPC is added in `20260930_003_secure_workspace_onboarding.sql`; existing migrations are not rewritten. Apply outstanding migrations in chronological order before using onboarding. The database function uses no service-role credential.

### Account context and deferred authentication work

Settings and the sidebar display the resolved profile/email, organization, role, and initials fallback. Logout clears the Supabase browser session and routes to `/login`; protected server layouts still reject a stale/back-button request. Password recovery uses a PKCE callback and does not log tokens or reveal whether an email is registered.

Email/password auth, reset, session persistence, tenant onboarding, and protected-route enforcement are in scope. Organization switching, invitations, advanced permission editing, persistent business CRUD, AI execution, and external integrations remain deferred. Dashboard figures remain demonstration data, not tenant records.

The current environment-variable contract remains the baseline for Supabase client values, and no secret keys are stored in app code.

## Row Level Security strategy

RLS is required for tenant-sensitive tables. Application code alone is not enough to protect data boundaries.

Required rule:

- users may only access records from organizations where they are active members

At minimum, tenant-sensitive tables should use:

- default deny policies
- membership-based access checks
- explicit SELECT/INSERT/UPDATE/DELETE constraints
- audit logging for changes

The migration layer should enforce the relationship between authenticated user identity and organization membership instead of relying on UI-only filters.

## Autonomy model

The product continues to follow the FOUNDATION-001 principles:

- Level 1 — PREPARE: Chispita prepares work; a human executes or decides.
- Level 2 — PREPARE + APPROVE: Chispita drafts and waits for explicit approval before execution.
- Level 3 — AUTOPILOT: Chispita executes only within explicit permissions, channel rules, and policy boundaries.

The code and data model should represent these levels as a safe contract layer without implementing autonomous external execution yet. A minimal autonomy policy table is sufficient for future enforcement.

## Approval architecture

Approval workflows should be modeled as first-class domain concepts so that human approval is enforced before sensitive or externally visible actions occur.

Potential approval record fields:

- organization_id
- requester_profile_id
- action_type
- action_payload
- target_resource
- status
- requested_at
- reviewed_at
- reviewed_by

Possible statuses:

- pending
- approved
- rejected
- cancelled

This layer is intentionally separate from any external provider execution path and does not connect to MLS, Zillow, social publishing, or similar actions in this checkpoint.

## Auditability architecture

Auditability is a foundational requirement for AI and human actions.

The minimum audit model should include:

- id
- organization_id
- actor_profile_id nullable
- event_type
- entity_type
- entity_id nullable
- metadata jsonb
- created_at

Rules:

- audit data should be append-only from the application perspective
- users should not be able to alter historical audit rows
- audit events should record who initiated an action, the target, the action type, and the outcome
- sensitive credentials must never be stored in audit metadata

## Future domain boundaries

The application continues to keep future product modules cleanly separated:

- Dashboard
- Properties
- Leads
- Marketing
- Calendar
- Tasks
- Documents
- Analytics
- Settings
- Assistant / Chispita
- Approvals
- Audit

These remain domain boundaries rather than fully implemented business features in this checkpoint.

## Provider isolation and integration boundaries

External providers must remain isolated behind clear service boundaries.

Examples of future providers:

- MLS / RESO
- Meta / Instagram / Facebook
- LinkedIn
- Google
- Microsoft
- email
- messaging
- eSignature

The application should not spread provider-specific logic through the core product domain. Integration work should remain behind adapter contracts and normalized domain models.

## Theme architecture

Realtor AI Office supports a dark-by-default experience with a new CSS token layer that will enable future light mode support without duplicating the application structure. The base tokens include:

- background
- background glow
- surface
- surface elevated
- border
- text primary
- text secondary
- accent
- success
- warning
- danger
- muted

This keeps the approved visual atmosphere stable while making future theme expansion efficient.

## Foundation-002 schema summary

The scaffold includes a minimal secure foundation for multi-tenant records and future actions. The planned tables are:

- organizations
- profiles
- organization_memberships
- autonomy_policies
- approvals
- audit_events

The corresponding Supabase migrations in the repository are the source-controlled representation of that foundation. They are schema artifacts only and are not executed against production in this checkpoint.
