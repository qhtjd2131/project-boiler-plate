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
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

SUPABASE_DB_URL=
SUPABASE_BRIEF_TABLE=project_briefs
```

## 3) 기본 스키마 프로비저닝

아래 명령으로 운영 테이블 기본 구조를 생성한다.

```bash
pnpm run provision:supabase
```

실행 결과:

- `project_briefs` 테이블 생성(미존재 시)
- `created_at` 인덱스 생성
- `updated_at` 자동 갱신 트리거 생성
- RLS 활성화

## 4) 인증(Auth) 설정

- Auth Provider는 기본 Supabase OTP(Magic Link)로 구현되어 있다.
- Redirect URL에 다음 경로를 포함한다.
  - `https://<domain>/<locale>/auth/callback`
  - 로컬: `http://localhost:3000/ko/auth/callback`, `http://localhost:3000/en/auth/callback`

## 5) 권한(RBAC) 정책 연결

기본 보호 경로:

- `/{locale}/app` -> `member` 이상
- `/{locale}/admin` -> `admin`
- `/api/private/*` -> `member` 이상
- `/api/admin/*` -> `admin`

역할 해석 우선순위:

1. `app_metadata.role`
2. `user_metadata.role`
3. `app_metadata.app_role`
4. fallback `member`

## 6) 운영 DB write 안정성 규칙

- 서버 write API는 `SUPABASE_SERVICE_ROLE_KEY`가 있어야 동작한다.
- 이 키가 없으면 쓰기 API는 `NOT_CONFIGURED`를 반환한다.
- 이유: anon key + RLS 조합에서 프로젝트별 실패 편차를 방지하기 위함.

## 7) Storage 사용 시 권장

- 업로드 버킷은 공개/비공개를 분리한다.
- 비공개 파일은 signed URL 방식으로 전달한다.
- 버킷 정책은 최소 권한으로 시작한다.

## 8) 점검 체크리스트

- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run build`
- `/api/backends/status`에서 `supabase` 상태 확인
- `/{locale}/app` 접근 제어 동작 확인
