# Boilerplate Execution Runbook

This document is the practical handoff and kickoff guide for outsourced projects.
Follow this in order.

## 1) Client Access Request Flow

Request access in writing before receiving keys. Use least-privilege first.

### GitHub

- Request repository collaborator access (`Write`)
- Request Actions secrets management access (or ask client to register secrets)
- Confirm default branch policy (`main`) and protection rules

### Vercel

- Request project access (`Developer` minimum)
- Request env management access (Preview/Production)
- Ask client to share:
  - `VERCEL_ORG_ID`
  - `VERCEL_PROJECT_ID`
  - `VERCEL_TOKEN` (service token for CI)

### Supabase

- Request project access in client organization
- Ask client to create a dedicated development project if production isolation is required
- Ask client to share:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (server only)
  - `SUPABASE_DB_URL` (for provisioning script)
  - `SUPABASE_PROJECT_REF` (for MCP)

### Directus

- Request project URL and admin/operator account
- Ask client to issue two tokens when possible:
  - `DIRECTUS_TOKEN` (runtime use)
  - `DIRECTUS_ADMIN_TOKEN` (schema provisioning)
- Ask client to share `DIRECTUS_URL`

## 2) Required Key Checklist

Minimum to run end-to-end:

- Runtime:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `DIRECTUS_URL`
  - `DIRECTUS_TOKEN`
- Provisioning:
  - `SUPABASE_DB_URL`
  - `DIRECTUS_ADMIN_TOKEN`
- SEO:
  - `NEXT_PUBLIC_SITE_URL`

## 3) Local Setup

```bash
cp .env.example .env.local
```

Fill `.env.local` with client-provided values.

Recommended feature flags for integrated mode:

- `NEXT_PUBLIC_ENABLE_SUPABASE=true`
- `NEXT_PUBLIC_ENABLE_DIRECTUS=true`
- `NEXT_PUBLIC_PRIMARY_BACKEND=supabase`

Optional analytics flag:

- `NEXT_PUBLIC_ENABLE_GOOGLE_ANALYTICS=true`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX`

Install and run:

```bash
pnpm install
pnpm run provision:all
pnpm run dev
```

## 4) Provisioning Behavior

### Supabase (`pnpm run provision:supabase`)

- Creates `project_briefs` table (or `SUPABASE_BRIEF_TABLE`)
- Creates `created_at` index
- Creates `updated_at` trigger function
- Enables RLS on the table

### Directus (`pnpm run provision:directus`)

- Creates collection `project_briefs` (or `DIRECTUS_COLLECTION`)
- Creates required fields:
  - `title`
  - `summary`

## 5) Auth + RBAC Verification

Protected route examples:

- `/{locale}/app` requires at least `member`
- `/{locale}/admin` requires `admin`

Role source priority:

1. `app_metadata.role`
2. `user_metadata.role`
3. `app_metadata.app_role`
4. default `member`

Quick check:

1. Visit `/{locale}/app` while signed out -> redirected to sign-in
2. Sign in with magic link -> callback -> redirected back
3. Update role metadata and verify `/admin` access behavior

## 6) i18n + SEO Verification

- Root `/` redirects to localized route (`/ko` or `/en`)
- `/{locale}` pages render locale-specific text
- `sitemap.xml` contains locale URLs
- Canonical/hreflang exists for localized pages
- `robots.txt` points to sitemap

## 7) CI/CD Setup

Workflow: `.github/workflows/ci-cd.yml`

Required GitHub Secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Behavior:

- PR -> lint/typecheck/build
- Push to `main` -> lint/typecheck/build + production deploy (if secrets exist)

## 8) Security Rules

- Never expose `SUPABASE_SERVICE_ROLE_KEY` in client bundle
- Never expose `DIRECTUS_ADMIN_TOKEN` in frontend runtime
- Keep keys only in `.env.local`, Vercel env, or GitHub Secrets
- Rotate leaked keys immediately and invalidate old tokens

## 9) Delivery Checklist

- [ ] `.env.local` values validated
- [ ] `pnpm run lint`, `pnpm run typecheck`, `pnpm run build` all pass
- [ ] `pnpm run provision:all` completed successfully
- [ ] Auth redirect and RBAC route checks passed
- [ ] Locale SEO checks passed (`sitemap.xml`, canonical, hreflang)
- [ ] Vercel Production deployment verified
