# 외주 프로젝트 보일러플레이트

소규모/중규모 외주 프로젝트를 빠르게 시작하기 위한 Next.js 기반 템플릿입니다.

- Next.js + React + Tailwind CSS + shadcn/ui
- react-hook-form + zod
- TanStack Query
- Supabase (운영 DB/Auth/Storage)
- Sanity (공개 콘텐츠 CMS)
- OpenCode 설정 + MCP 프로필 (`opencode.json`, `opencode.md`)
- 고객 레퍼런스 운영 문서 (`docs/client-reference.md`)
- 다국어 라우팅(`ko`,`en`, 확장 가능) + locale SEO
- Supabase Auth 가드(회원가입 + 이메일/비밀번호 + Google/Kakao OAuth) + RBAC proxy 가드
- 임베디드 Sanity Studio (기본 `/admin`, 플래그 게이트)

## 버전 정책

모든 패키지 버전은 exact로 고정됩니다(락파일 포함).

## 기술 스택

- `next@16.1.6`, `react@19.2.4`, `react-dom@19.2.4`
- `tailwindcss@4.1.18`, `shadcn@3.8.4`
- `react-hook-form@7.71.1`, `zod@4.3.6`
- `@tanstack/react-query@5.90.20`
- `@supabase/supabase-js@2.95.3`, `@sanity/client@7.14.1`
- `next-sanity@12.1.0`, `sanity@5.9.0`
- `lodash-es@4.17.23`

## 아키텍처 역할 분리

- Supabase: 운영 데이터, 인증, 스토리지
- Sanity: 공개 콘텐츠 운영 전용
- 두 백엔드는 대체 관계가 아니라 역할 분담 구조입니다.

## 모듈 선택 규칙

- 로그인 필요 -> `NEXT_PUBLIC_ENABLE_AUTH=true` (+ Supabase 필요)
- 운영 DB/서버 데이터 필요 -> `NEXT_PUBLIC_ENABLE_SUPABASE=true`
- 공개 콘텐츠 CMS 필요 -> `NEXT_PUBLIC_ENABLE_SANITY=true`
- 다국어 노출 필요 -> `NEXT_PUBLIC_ENABLE_I18N=true`
- Supabase를 사용하더라도 인증이 불필요하면 `NEXT_PUBLIC_ENABLE_AUTH=false`로 분리 운영합니다.
- i18n OFF 상태에서는 locale 전환 UI를 숨기고 기본언어 경로만 노출합니다.

## 반응형 정책

레이아웃 기본값은 `width: 100%`이며 구간은 고정입니다.

- `mobile`: `< 768px`
- `tablet`: `>= 768px` (`tablet:`)
- `laptop`: `>= 1280px` (`laptop:`)
- `desktop`: `>= 1536px` (`desktop:`)

브레이크포인트 토큰은 `src/app/globals.css`에서 관리합니다.

## i18n + SEO

- locale 라우트: 기본언어(`ko`)는 prefix 없음, 비기본언어(`en`)는 `/{locale}`
- 루트 `/`는 기본언어 대시보드를 렌더링하고, 비기본언어 선호 시 해당 locale 경로로 이동
- locale별 canonical/hreflang 자동 생성
- `sitemap.xml`은 App Router 페이지 자동 수집 + locale 확장
- 비공개 경로(`auth`, `app`, `forbidden`, `status`, Studio path)는 sitemap 제외
- locale 집합은 `src/lib/i18n/config.ts`(`LOCALE_CONFIG`)에서 중앙 관리

## 빠른 시작

1. 의존성 설치

```bash
pnpm install
```

2. 환경변수 파일 생성

```bash
cp .env.example .env.local
```

3. 필요 시 프로비저닝 실행

```bash
pnpm run provision:all
```

4. 개발 서버 실행

```bash
pnpm run dev
```

5. `http://localhost:3000` 접속

## 환경변수

### 기능 플래그

- `NEXT_PUBLIC_ENABLE_SUPABASE`: `true`/`false`
- `NEXT_PUBLIC_ENABLE_SANITY`: `true`/`false`
- `NEXT_PUBLIC_ENABLE_AUTH`: `true`/`false`
- `NEXT_PUBLIC_ENABLE_I18N`: `true`/`false`
- `NEXT_PUBLIC_ENABLE_GA`: `true`/`false`
- `NEXT_PUBLIC_SITE_URL`: canonical 기준 URL
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`: GA4 측정 ID (`G-XXXXXXXXXX`)

### Auth Guard

- `AUTH_GUARD_ENABLED`: `true`/`false`
- `AUTH_SIGN_IN_PATH`: 기본 `/auth/sign-in`
- `AUTH_FORBIDDEN_PATH`: 기본 `/forbidden`

Auth 모듈 게이트:

- `NEXT_PUBLIC_ENABLE_AUTH=false`면 인증 화면/보호 페이지 네비게이션을 숨기고 auth 페이지는 `404` 처리됩니다.
- `AUTH_GUARD_ENABLED`는 auth 모듈이 활성화된 경우에만 적용됩니다.

i18n 모듈 게이트:

- `NEXT_PUBLIC_ENABLE_I18N=false`면 locale 전환 UI를 숨기고 비기본 locale 경로(`/en/*`)는 `404` 처리됩니다.
- i18n OFF 상태에서는 기본언어 경로만 노출됩니다.

### Supabase (운영 백엔드)

- `NEXT_PUBLIC_SUPABASE_PROJECT_ID`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY` (서버 write 전용)
- `SUPABASE_DB_URL` (provisioning 스크립트용)

모듈 관계:

- Supabase는 로그인 없이 DB/서버 기능만 사용할 수 있습니다.
- 로그인 기능이 필요할 때만 `NEXT_PUBLIC_ENABLE_AUTH=true`를 함께 사용합니다.

### Sanity (공개 콘텐츠)

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`
- `NEXT_PUBLIC_SANITY_STUDIO_PATH` (상대경로, 기본 `/admin`)
- `SANITY_API_TOKEN` (서버 전용, public dataset이면 선택)

Studio URL은 `new URL(NEXT_PUBLIC_SANITY_STUDIO_PATH, NEXT_PUBLIC_SITE_URL)`로 계산됩니다.

## API 응답 포맷

```ts
type AppResult<T> =
  | { ok: true; data: T; meta: { source: "supabase" | "sanity" | "none"; at: string } }
  | { ok: false; error: { code: string; message: string; detail?: string } };
```

## Public Content 레이어 (Sanity)

- Repository: `src/lib/backend/sanity-content-repository.ts`
- 목록 API: `GET /api/content/public-items`
- 상세 API: `GET /api/content/public-items/:slug`
- 라우트:
  - 기본 언어: `/blog`, `/blog/[slug]`
  - 비기본 언어: `/en/blog`, `/en/blog/[slug]`

## 임베디드 Sanity Studio

- 외부 노출 경로: `NEXT_PUBLIC_SANITY_STUDIO_PATH` (기본 `/admin`)
- 내부 App Router 엔트리: `/admin/*` (rewrite로 연결)
- 권한: Studio path는 `admin` 역할 필요
- 게이트: `NEXT_PUBLIC_ENABLE_SANITY=true` + Sanity 필수 env가 있어야 활성화
- 기본 스키마 파일: `src/lib/sanity/studio-schema.ts`

## 대시보드 런타임 동작

- 대시보드는 샘플 입력/저장 폼 없이 백엔드 상태와 콘텐츠 파이프라인 점검 UI로 구성됩니다.
- Sanity 콘텐츠 카드도 Sanity 플래그+런타임 키가 준비된 경우에만 노출됩니다.

## 시스템 상태 UI

- 운영 확인용 UI 경로: `/status`, `/en/status`
- 기계용 API 경로: `/api/backends/status`

## 스크립트

- `pnpm run dev`: 개발 서버 실행
- `pnpm run build`: 프로덕션 빌드
- `pnpm run start`: 프로덕션 서버 실행
- `pnpm run lint`: ESLint 실행
- `pnpm run lint:fix`: ESLint 자동 수정
- `pnpm run typecheck`: TypeScript 검사
- `pnpm run format`: Prettier 포맷 적용
- `pnpm run format:check`: Prettier 검사
- `pnpm run provision:supabase`: Supabase DB 연결 검증
- `pnpm run provision:sanity`: Sanity 연결 검증
- `pnpm run provision:all`: 두 provisioning 순차 실행

## 인증 + RBAC

- 기본 보호 규칙:
  - `/app` -> `member` 이상
  - Studio path (`NEXT_PUBLIC_SANITY_STUDIO_PATH`) -> `admin`
  - `/api/private` -> `member` 이상
  - `/api/admin` -> `admin`
- 기본 인증 경로:
  - `/auth/sign-in`, `/en/auth/sign-in`
  - `/auth/sign-up`, `/en/auth/sign-up`
  - `/auth/callback`, `/en/auth/callback`
- 인증 방식:
  - 이메일/비밀번호 회원가입
  - 이메일/비밀번호 로그인
  - Google OAuth
  - Kakao OAuth
- 역할 해석 우선순위:
  1. `user.app_metadata.role`
  2. `user.user_metadata.role`
  3. `user.app_metadata.app_role`
  4. fallback `member`

### 인증 보안 정책

- 비밀번호 회원가입은 앱 레벨 정책을 통과해야 합니다.
  - 최소 10자, 대문자/소문자/숫자/특수문자 각 1개 이상
- 비밀번호 로그인 실패가 짧은 시간에 반복되면 일시 쿨다운(30초)을 적용합니다.
- 실제 비밀번호 해시/검증은 Supabase Auth에서 처리하며, 애플리케이션은 원문 비밀번호를 저장하지 않습니다.

## OpenCode + MCP

- OpenCode 프로필: `opencode.json`
- 프로젝트 컨텍스트: `opencode.md`
- 고객 레퍼런스 문서: `docs/client-reference.md`
- 기본 MCP:
  - `supabase` (remote)
  - `sanity` (local)
  - `context7` (remote)
  - `shadcn` (local)

### 고객 레퍼런스 워크플로

1. `docs/client-reference.md`에 고객 레퍼런스 링크 기록
2. 각 링크를 `must / should / avoid`로 분류
3. 라우트별 적용 매핑 작성
4. 구현 후 체크리스트로 반영 여부 검수

## Analytics

- Google Analytics는 플래그 기반 모듈입니다.
- 사용 시:
  - `NEXT_PUBLIC_ENABLE_GA=true`
  - `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX`
- 미사용 시:
  - `NEXT_PUBLIC_ENABLE_GA=false`

## 실행 런북

- 상세 실행 절차: `README.RUNBOOK.md`

## 구현 가이드

- Supabase: `docs/supabase-implementation-guide.md`
- Sanity: `docs/sanity-implementation-guide.md`
- i18n: `docs/i18n-implementation-guide.md`

## SEO 기본 동작

- `src/app/sitemap.ts`: App Router `page.*` 자동 수집
- `src/app/robots.ts`: sitemap 연결 + 비공개 경로 차단

## Vercel 배포

1. 저장소를 Vercel에 Import
2. `.env.example` 기반 env 등록
3. Preview/Production 값 분리 설정
4. Deploy

## CI/CD (GitHub Actions)

- 워크플로 파일: `.github/workflows/ci-cd.yml`
- CI 트리거: PR 전체, `main` push
- CI 단계:
  - `pnpm install --frozen-lockfile`
  - `pnpm run lint`
  - `pnpm run typecheck`
  - `pnpm run build`
- CD 트리거: `main` push
- CD 실행 조건: Vercel secrets 존재 시에만 배포 job 실행

### CD 필요 GitHub Secrets

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

해당 secrets가 없으면 CI는 정상 실행되고 deploy 단계만 자동 skip 됩니다.
