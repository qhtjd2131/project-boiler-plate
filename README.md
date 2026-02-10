# External Delivery Boilerplate

Generic boilerplate for small-to-mid outsourced projects.

- Next.js + React + Tailwind CSS + shadcn/ui
- react-hook-form + zod
- TanStack Query
- Supabase (infra/auth/db/storage)
- Directus (client-operated CMS)
- OpenCode config + MCP profile (`opencode.json`, `opencode.md`)
- Built-in i18n routing (`ko`, `en`) + locale-aware SEO
- Supabase Auth guard + RBAC proxy guard
- Provision scripts for Supabase and Directus schema bootstrapping

## Version Policy

All package versions are pinned (exact version), including lockfile-based installs.

## Stack

- `next@16.1.6`, `react@19.2.4`, `react-dom@19.2.4`
- `tailwindcss@4.1.18`, `shadcn@3.8.4`
- `react-hook-form@7.71.1`, `zod@4.3.6`
- `@tanstack/react-query@5.90.20`
- `@supabase/supabase-js@2.95.3`, `@directus/sdk@21.1.0`
- `lodash-es@4.17.23`

## Responsive Layout Policy

This template uses fixed responsive tiers and full-width layout (`width: 100%`).

- `mobile`: default (`< 768px`)
- `tablet`: `>= 768px` (`tablet:`)
- `laptop`: `>= 1280px` (`laptop:`)
- `desktop`: `>= 1536px` (`desktop:`)

Breakpoint tokens are defined in `src/app/globals.css` and should stay stable across projects.

## i18n + SEO

- Locale routes: `/{locale}` with supported locales `ko`, `en`
- Root `/` redirects to preferred locale from `accept-language`
- Canonical/hreflang are generated per locale page
- `sitemap.xml` auto-discovers App Router pages and expands locale routes
- Private paths (`/app`, `/auth`, `/forbidden`) are excluded from sitemap

## Quick Start

1. Install dependencies

```bash
pnpm install
```

2. Create local env

```bash
cp .env.example .env.local
```

3. Start dev server

```bash
pnpm run dev
```

4. Open `http://localhost:3000`

## Environment Variables

### Feature Flags

- `NEXT_PUBLIC_ENABLE_SUPABASE`: `true`/`false`
- `NEXT_PUBLIC_ENABLE_DIRECTUS`: `true`/`false`
- `NEXT_PUBLIC_PRIMARY_BACKEND`: `supabase` or `directus`
- `NEXT_PUBLIC_SITE_URL`: canonical site url used by sitemap/robots

### Auth Guard

- `AUTH_GUARD_ENABLED`: `true`/`false`
- `AUTH_SIGN_IN_PATH`: default `/auth/sign-in`
- `AUTH_FORBIDDEN_PATH`: default `/forbidden`

### Supabase

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (optional, server-side write operations)
- `SUPABASE_DB_URL` (required for schema provisioning script)
- `SUPABASE_BRIEF_TABLE` (optional, default `project_briefs`)

### Directus

- `DIRECTUS_URL`
- `DIRECTUS_TOKEN`
- `DIRECTUS_COLLECTION` (default: `project_briefs`)
- `DIRECTUS_ADMIN_TOKEN` (required for schema provisioning script)

### MCP Helper

- `SUPABASE_PROJECT_REF` (used by Supabase MCP URL in `opencode.json`)

## Backend Routing Rules

- Supabase and Directus are role-based, not direct replacements.
- Runtime adapter resolution:
  1. Use `NEXT_PUBLIC_PRIMARY_BACKEND` first (if enabled and configured)
  2. Fallback to the other backend (if enabled and configured)
  3. Fallback to in-memory mock adapter (`source: "none"`)

## API Result Format

All routes use the same compact format:

```ts
type AppResult<T> =
  | { ok: true; data: T; meta: { source: "supabase" | "directus" | "none"; at: string } }
  | { ok: false; error: { code: string; message: string; detail?: string } };
```

## Scripts

- `pnpm run dev` - start dev server
- `pnpm run build` - production build
- `pnpm run start` - start production server
- `pnpm run lint` - run eslint
- `pnpm run lint:fix` - autofix lint issues
- `pnpm run typecheck` - run TypeScript type checks
- `pnpm run format` - run prettier write mode
- `pnpm run format:check` - run prettier check mode
- `pnpm run provision:supabase` - create Supabase table/index/trigger
- `pnpm run provision:directus` - create Directus collection/fields
- `pnpm run provision:all` - run both provisioning scripts

## Auth + RBAC

- Next.js proxy-based route guard is enabled by default.
- Default protected route rules:
  - `/app` => `member` or above
  - `/admin` => `admin`
  - `/api/private` => `member` or above
  - `/api/admin` => `admin`
- Role resolution order:
  - `user.app_metadata.role`
  - `user.user_metadata.role`
  - `user.app_metadata.app_role`
  - fallback: `member`

## OpenCode + MCP

- OpenCode profile: `opencode.json`
- Project context/rules: `opencode.md`
- Enabled MCP servers:
  - `supabase` (remote)
  - `directus` (local)
  - `shadcn` (local)

## Execution Runbook

- Detailed client permission flow and key collection guide:
  - `README.RUNBOOK.md`

## SEO Defaults

- `src/app/sitemap.ts` auto-discovers App Router `page.*` routes.
- `src/app/robots.ts` is enabled and points to `/sitemap.xml`.

## Vercel Deployment

1. Import this repo into Vercel.
2. Add env vars from `.env.example` in Project Settings.
3. Set different values for Preview/Production as needed.
4. Deploy.

## CI/CD (GitHub Actions)

Workflow file: `.github/workflows/ci-cd.yml`

- CI trigger:
  - All pull requests
  - Push to `main`
- CI steps:
  - `pnpm install --frozen-lockfile`
  - `pnpm run lint`
  - `pnpm run typecheck`
  - `pnpm run build`
- CD trigger:
  - Push to `main`
  - Runs only when required Vercel secrets exist

### Required GitHub Secrets for CD

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

If these secrets are missing, CI still runs and deploy job is skipped.
