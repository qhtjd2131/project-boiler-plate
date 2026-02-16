# Supabase 적용 가이드

이 문서는 이 보일러플레이트에서 Supabase를 **운영 백엔드(Auth/DB/Storage)** 로 적용하는 기준 절차다.

## 1) 역할 원칙

- Supabase는 운영 데이터와 인증/권한을 담당한다.
- 공개 콘텐츠(블로그/포트폴리오/FAQ)는 Sanity가 담당한다.
- Supabase와 Sanity는 대체 관계가 아니라 역할 분담 구조다.

## 2) 필수 환경변수

`.env.local` 기준으로 아래 값을 먼저 채운다.

```env
NEXT_PUBLIC_ENABLE_SUPABASE=true
NEXT_PUBLIC_ENABLE_AUTH=true
NEXT_PUBLIC_SUPABASE_PROJECT_ID=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=

SUPABASE_DB_URL=
```

## 3) 기본 스키마 프로비저닝

아래 명령으로 Supabase 핵심 인증 프로필 스키마를 준비한다.

```bash
pnpm run provision:supabase
```

실행 결과:

- DB 연결 성공 여부 출력
- 현재 연결 database 정보 출력
- `public.profiles` 테이블 생성/검증
- `auth.users` -> `profiles` 자동 생성 트리거 생성/검증
- `profiles` RLS 정책(본인 select/insert/update) 생성/검증
- 이메일 변경 동기화 트리거 생성/검증

Auth 모듈 분리 규칙:

- Supabase를 DB/서버 기능으로만 쓸 경우 `NEXT_PUBLIC_ENABLE_AUTH=false`로 설정 가능
- 로그인/회원 기능이 필요한 프로젝트에서만 `NEXT_PUBLIC_ENABLE_AUTH=true` 사용

## 3.5) profiles 기본 컬럼 규칙

회원가입 후 profiles에는 아래 값이 기본 저장된다.

- `id`: 인증된 `auth.users.id`
- `email`: 인증된 email
- `status`: `active`
- `role`: `customer`
- `display_name`: 인증된 email
- `avatar_url`: `null`

관리자 계정은 운영자가 Supabase에서 `profiles.role='admin'`으로 변경해 승격한다.

## 4) 인증(Auth) 설정

- Auth Provider는 기본 회원가입 + 이메일/비밀번호 로그인 + OAuth(`google`, `kakao`)로 구현되어 있다.
- Supabase Auth 설정에서 Email provider와 Google/Kakao provider를 활성화한다.
- Redirect URL에 다음 경로를 포함한다.
  - `https://<domain>/auth/callback`
  - `https://<domain>/<locale>/auth/callback`
  - 로컬: `http://localhost:3000/auth/callback`, `http://localhost:3000/ko/auth/callback`, `http://localhost:3000/en/auth/callback`

기본 인증 라우트:

- `/auth/sign-in`, `/en/auth/sign-in`
- `/auth/sign-up`, `/en/auth/sign-up`

## 4.5) 비밀번호 보안 정책

- 회원가입 비밀번호 정책(앱 레벨):
  - 최소 10자
  - 대문자/소문자/숫자/특수문자 각 1개 이상
- 비밀번호 로그인 실패가 반복되면 UI에서 30초 쿨다운 적용
- 비밀번호 해시/검증은 Supabase Auth에서 처리(애플리케이션 DB에 원문 저장 금지)
- Supabase Auth 설정 권장:
  - Email confirmation 정책(필수/선택) 프로젝트 정책에 맞게 고정
  - Bot/abuse 방지를 위한 Auth rate limit 기본값 유지 또는 강화
  - 필요 시 CAPTCHA/추가 검증 단계 적용

## 5) 권한(RBAC) 정책 연결

기본 보호 경로:

- `/app`(기본언어), `/en/app`(비기본언어) -> `member` 이상
- `NEXT_PUBLIC_SANITY_STUDIO_PATH`(기본 `/admin`) -> `admin`
- `/api/private/*` -> `member` 이상
- `/api/admin/*` -> `admin`

역할 해석 기준:

- `profiles.role='customer'` -> 앱 권한 `member`
- `profiles.role='admin'` -> 앱 권한 `admin`
- `profiles.status='blocked'` -> 보호 경로 접근 차단

## 6) 운영 DB write 안정성 규칙

- 서버 write API는 privileged 키가 있어야 동작한다.
  - `SUPABASE_SECRET_KEY`
- privileged 키가 없으면 쓰기 API는 `NOT_CONFIGURED`를 반환한다.
- 이유: 공개 키 + RLS 조합에서 프로젝트별 실패 편차를 방지하기 위함.

## 7) Storage 사용 시 권장

- 업로드 버킷은 공개/비공개를 분리한다.
- 비공개 파일은 signed URL 방식으로 전달한다.
- 버킷 정책은 최소 권한으로 시작한다.

## 8) 점검 체크리스트

- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run build`
- `/status`(또는 `/en/status`)에서 `supabase` 상태 확인
- `/api/backends/status` JSON 응답 확인
- `/app` 및 `/en/app` 접근 제어 동작 확인
