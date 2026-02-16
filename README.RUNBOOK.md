# 보일러플레이트 실행 런북

이 문서는 외주 프로젝트 착수부터 로컬 검증, 배포 전 점검까지의 실무 실행 순서입니다.

## 0) 모듈 의사결정 (요구사항 기반)

구현 시작 전에 고객 요구사항으로 Supabase/Sanity 사용 여부를 먼저 확정합니다.

### Supabase 필요 신호

- 로그인/회원/관리자 권한 필요
- 내부 대시보드/운영 데이터 CRUD 필요
- 결제/문의/리드 등 트랜잭션 데이터 저장 필요
- 파일 업로드/비공개 자산 접근 제어 필요

### Sanity 필요 신호

- 블로그/포트폴리오/FAQ 등 공개 콘텐츠를 비개발자가 운영해야 함
- 콘텐츠 발행 프로세스(draft/publish)가 필요
- locale별 콘텐츠 운영이 필요

### 빠른 결정표

- 운영 기능만 필요(로그인 없음): Supabase ON, Auth OFF, Sanity OFF
- 운영 기능 + 로그인 필요: Supabase ON, Auth ON, Sanity OFF
- 공개 CMS만 필요: Supabase OFF, Sanity ON
- 운영 + CMS 모두 필요: Supabase ON, Sanity ON
- 정적 랜딩만 필요: 둘 다 OFF

확정 후 `.env.local`에 플래그를 반영합니다.

- `NEXT_PUBLIC_ENABLE_SUPABASE=true|false`
- `NEXT_PUBLIC_ENABLE_SANITY=true|false`
- `NEXT_PUBLIC_ENABLE_AUTH=true|false`

인증 사용 여부 판단 기준:

- 로그인/회원 권한이 필요하면 `NEXT_PUBLIC_ENABLE_AUTH=true`
- 로그인 기능이 불필요하면 `NEXT_PUBLIC_ENABLE_AUTH=false`

## 1) 고객 접근 권한 요청

키 수집 전에 최소 권한 원칙으로 접근 권한부터 요청합니다.

### GitHub

- 저장소 collaborator 권한(`Write`) 요청
- Actions secrets 등록 권한(또는 고객 대행 등록) 확인
- 기본 브랜치(`main`) 및 보호 규칙 확인

### Vercel

- 프로젝트 접근 권한(`Developer` 이상) 요청
- Preview/Production env 관리 권한 확인
- 아래 값 공유 요청:
  - `VERCEL_ORG_ID`
  - `VERCEL_PROJECT_ID`
  - `VERCEL_TOKEN`

### Supabase (운영)

- 고객 조직 Supabase 프로젝트 접근 권한 요청
- 필요 시 개발용 프로젝트 분리 요청
- 아래 값 공유 요청:
  - `NEXT_PUBLIC_SUPABASE_PROJECT_ID`
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
  - `SUPABASE_SECRET_KEY`
  - `SUPABASE_DB_URL` (provisioning)

### Sanity (공개 콘텐츠)

- 프로젝트 멤버 초대 또는 접근 권한 요청
- 아래 값 공유 요청:
  - `NEXT_PUBLIC_SANITY_PROJECT_ID`
  - `NEXT_PUBLIC_SANITY_DATASET`
  - `NEXT_PUBLIC_SANITY_API_VERSION`
  - `NEXT_PUBLIC_SANITY_STUDIO_PATH` (선택, 기본 `/admin`)
  - `SANITY_API_TOKEN` (MCP/비공개 dataset 권장)

## 2) 필수 키 체크리스트

### 런타임

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_ENABLE_SUPABASE`
- `NEXT_PUBLIC_ENABLE_SANITY`
- `NEXT_PUBLIC_ENABLE_AUTH`
- `NEXT_PUBLIC_ENABLE_GA`

Supabase 사용 시:

- `NEXT_PUBLIC_SUPABASE_PROJECT_ID`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`

Sanity 사용 시:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`
- `NEXT_PUBLIC_SANITY_STUDIO_PATH` (선택)
- `SANITY_API_TOKEN` (dataset 정책에 따라 선택)

### provisioning

- `SUPABASE_DB_URL` (Supabase provisioning 시 필수)

## 2.5) 디자인 레퍼런스 사전 수집

- 고객 참고 링크를 `docs/client-reference.md`에 구조화합니다.
- 각 링크를 `must / should / avoid`로 분류합니다.
- 라우트별 적용 매핑을 먼저 작성하고 UI 구현을 시작합니다.

## 3) 로컬 실행 준비

```bash
cp .env.example .env.local
```

`.env.local`에 고객 값을 채운 뒤:

```bash
pnpm install
pnpm run dev
```

## 4) provisioning 실행

### Supabase

```bash
pnpm run provision:supabase
```

실행 시 수행 내용:

- DB 연결 확인
- 현재 연결된 database 이름 출력
- 샘플 테이블 자동 생성은 수행하지 않음

주의:

- 운영 테이블 생성/마이그레이션은 프로젝트 도메인 스키마 기준으로 별도 진행합니다.

### Sanity

```bash
pnpm run provision:sanity
```

실행 시 수행 내용:

- project/dataset 연결 검증
- API 버전/토큰 설정 검증
- published 문서 조회 가능 여부 확인

### 통합 실행

```bash
pnpm run provision:all
```

## 5) 기능 검증

### 대시보드 상태 검증

- `/`(기본언어) 또는 `/en`(비기본언어)에서 backend status 확인
- Sanity 미구성 시 콘텐츠 목록이 숨김+안내 상태인지 확인

### Sanity 콘텐츠/Studio 검증

- `/blog`와 `/en/blog` 목록 렌더링 확인
- `/blog/[slug]`와 `/en/blog/[slug]` 상세 렌더링 + metadata 확인
- `NEXT_PUBLIC_SANITY_STUDIO_PATH` 접속 확인 (admin 권한)

### Auth + RBAC 검증

- 보호 경로:
  - `/app`(기본언어), `/en/app`(비기본언어) -> `member` 이상
  - `NEXT_PUBLIC_SANITY_STUDIO_PATH` -> `admin`
- 점검 순서:
  1. 로그아웃 상태로 `/app` 접근 -> 로그인 페이지 리다이렉트
  2. `/auth/sign-up`에서 이메일/비밀번호 회원가입 동작 확인
  3. 이메일/비밀번호 로그인 또는 Google/Kakao OAuth 로그인 동작 확인
  4. role 메타데이터 변경 후 Studio 접근 권한 확인

Auth Redirect URL 권장 등록:

- `https://<domain>/auth/callback`
- `https://<domain>/<locale>/auth/callback`
- 로컬: `http://localhost:3000/auth/callback`, `http://localhost:3000/ko/auth/callback`, `http://localhost:3000/en/auth/callback`

Auth 보안 점검:

- 비밀번호 정책(최소 10자 + 대문자/소문자/숫자/특수문자) 통과 여부 확인
- 비밀번호 로그인 반복 실패 시 쿨다운 메시지 노출 확인

## 6) i18n + SEO 검증

- 기본언어(`ko`)는 locale prefix 없이 경로가 동작하는지 확인
- 비기본언어(`en`)는 `/en/*` 경로로 동작하는지 확인
- locale별 텍스트 렌더링 확인
- `sitemap.xml` locale URL 포함 확인
- canonical/hreflang 출력 확인
- `robots.txt`에서 비공개 경로 차단 확인

locale 기준 파일:

- `src/lib/i18n/config.ts`

## 7) CI/CD 설정

워크플로: `.github/workflows/ci-cd.yml`

필수 GitHub Secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

동작:

- PR: `lint` + `typecheck` + `build`
- `main` push: CI 통과 후 배포(Secrets 있을 때만)

## 8) 보안 규칙

- `SUPABASE_SECRET_KEY`는 절대 클라이언트에 노출하지 않습니다.
- `SANITY_API_TOKEN`은 서버에서만 사용합니다.
- 민감키는 `.env.local`/Vercel Env/GitHub Secrets에만 보관합니다.
- 유출 시 즉시 rotate + 기존 키 폐기합니다.

## 9) 전달 전 최종 체크리스트

- [ ] 의사결정 단계(0단계)에서 모듈 ON/OFF 근거가 문서화됨
- [ ] `.env.local` 값 검증 완료
- [ ] `pnpm run lint`, `pnpm run typecheck`, `pnpm run build` 통과
- [ ] 필요한 provisioning 성공
- [ ] Auth redirect + RBAC 검증 완료
- [ ] locale SEO(`sitemap`, canonical, hreflang, robots) 검증 완료
- [ ] Vercel 배포 확인 완료
