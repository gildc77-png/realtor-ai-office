# Supabase integration

The application uses `@supabase/ssr` with the existing public environment contract:

- `client.ts` creates the browser client from the anon key only.
- `server.ts` creates a cookie-bound server client for App Router requests.
- `src/proxy.ts` refreshes sessions and redirects unauthenticated protected-route requests.
- Server layouts independently verify the user and active organization membership before rendering protected pages.

No service-role key or database password is used by application code. Set the public URL and anon key through local ignored environment files or deployment environment configuration. Never commit populated environment files.

Database schema and RLS are managed by the ordered SQL migrations in `supabase/migrations`. The workspace onboarding RPC is `20260930_003_secure_workspace_onboarding.sql`; it derives the user and owner role from the verified Supabase JWT and creates tenant records atomically.
