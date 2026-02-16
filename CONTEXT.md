# CONTEXT.md

이 문서는 이 보일러플레이트의 현재 실행 맥락을 빠르게 파악하기 위한 프로젝트 스냅샷이다.

## 1) 프로젝트 목적

- 외주 프로젝트를 빠르게 시작하기 위한 Next.js App Router 보일러플레이트
- 목표: 일관된 코드 품질, 빠른 초기 셋업, 실무형 운영 문서

## 2) 핵심 스택

- Next.js 16 + React 19 + Tailwind CSS 4 + shadcn/ui
- react-hook-form + zod
- TanStack Query
- Supabase (`Auth/DB/Storage`)
- Sanity (`Public Content CMS`)

## 3) 아키텍처 역할 분담

- Supabase: 운영 데이터/인증/권한/스토리지
- Sanity: 공개 콘텐츠(블로그/포트폴리오/FAQ 등)
- 두 시스템은 fallback 대체가 아니라 명확한 역할 분리 구조

## 4) 현재 주요 기능

- locale 라우팅(`ko`, `en`) 및 locale SEO
- Supabase 기반 로그인(이메일/비밀번호 + Google/Kakao OAuth) + RBAC
- Sanity 공개 콘텐츠 API/페이지
- Sanity Studio 임베드 (`NEXT_PUBLIC_SANITY_STUDIO_PATH`)
- 기능 플래그 기반 모듈 게이트
- 상태 기반 대시보드 UI(미구성 시 안내 중심)

## 5) 주요 라우트

- 공개:
  - `/`
  - `/en`
  - `/blog`, `/blog/[slug]`
  - `/en/blog`, `/en/blog/[slug]`
- 인증:
  - `/auth/sign-in`, `/en/auth/sign-in`
  - `/auth/callback`, `/en/auth/callback`
- 보호:
  - `/app`, `/en/app` (member 이상)
  - Studio path (`NEXT_PUBLIC_SANITY_STUDIO_PATH`) (admin)
- API:
  - `/api/backends/status`
  - `/api/content/sanity-status`
  - `/api/content/public-items`
  - `/api/content/public-items/[slug]`

## 6) 환경변수 핵심

### 공통/플래그

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_ENABLE_SUPABASE`
- `NEXT_PUBLIC_ENABLE_SANITY`
- `NEXT_PUBLIC_ENABLE_GA`

### Supabase

- `NEXT_PUBLIC_SUPABASE_PROJECT_ID`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY` (server-only)
- `SUPABASE_DB_URL` (provisioning)

### Sanity

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`
- `NEXT_PUBLIC_SANITY_STUDIO_PATH` (기본 `/admin`)
- `SANITY_API_TOKEN` (server-only)

## 7) 동작 규칙 메모

- Studio 외부 경로는 `NEXT_PUBLIC_SANITY_STUDIO_PATH`
- 내부 Studio App Router 엔트리는 `/admin/*`
- `next.config.ts` rewrite로 외부 경로 -> 내부 `/admin/*` 매핑
- sitemap/robots/RBAC 모두 Studio path를 반영

## 8) provisioning

- `pnpm run provision:supabase`
  - Supabase DB 연결 상태 검증
- `pnpm run provision:sanity`
  - Sanity 연결/조회 가능 상태 검증
- `pnpm run provision:all`
  - 두 작업 순차 실행

## 9) 품질 게이트

```bash
pnpm run lint
pnpm run typecheck
pnpm run build
```

## 10) 참고 문서

- 프로젝트 개요: `README.md`
- 실행 플로우: `README.RUNBOOK.md`
- 에이전트 규칙: `AGENT.md`, `opencode.md`
- Supabase 가이드: `docs/supabase-implementation-guide.md`
- Sanity 가이드: `docs/sanity-implementation-guide.md`
- i18n 가이드: `docs/i18n-implementation-guide.md`
- 디자인 레퍼런스 템플릿: `docs/client-reference.md`
