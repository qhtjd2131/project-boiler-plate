# AGENT.md

이 문서는 이 저장소에서 작업하는 코드 에이전트를 위한 실행 규칙이다.

## 1) 기본 원칙

- 이 프로젝트는 외주용 Next.js 보일러플레이트이며, **일관성**과 **재사용성**을 최우선으로 한다.
- 기존 규칙 문서(`opencode.md`)를 우선 준수하고, 본 문서는 실무 실행 체크리스트로 사용한다.
- 구현 중 결정이 필요할 때는 `README.RUNBOOK.md`의 0단계 의사결정(모듈 ON/OFF) 기준을 따른다.

## 2) 작업 시작 전 필수 확인

1. `CONTEXT.md`로 현재 아키텍처/플래그/경로 맥락 확인
2. `opencode.md`의 불변 규칙 확인
3. 요청 범위와 영향 문서 식별 (`README.md`, `README.RUNBOOK.md`, `docs/*`)

## 3) 아키텍처 규칙 (반드시 유지)

- App Router 기반 구현 유지
- `src/lib/backend`는 adapter/repository 패턴 유지
- UI 레이어에서 SDK 직접 호출 금지
- Server/Client 경계는 파일 단위로 분리
- Supabase와 Sanity는 대체 관계가 아니라 역할 분담

## 4) 데이터/타입 규칙

- API 공통 응답은 `AppResult<T>` 사용
- 입력 검증은 `zod` 사용
- 에러 코드는 표준 집합만 사용:
  - `VALIDATION`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `NOT_CONFIGURED`, `INTERNAL`
- `any` 사용 금지(불가피하면 즉시 좁은 타입으로 정제)

## 5) 기능 플래그/런타임 규칙

- Supabase: `NEXT_PUBLIC_ENABLE_SUPABASE`
- Sanity: `NEXT_PUBLIC_ENABLE_SANITY`
- GA: `NEXT_PUBLIC_ENABLE_GA`
- 플래그 OFF 또는 미구성 시 UI/기능은 안전한 fallback 또는 안내 상태를 사용

특히 아래 동작을 유지한다:

- 대시보드 briefs UI는 Supabase 준비 상태에서만 활성화
- Sanity 콘텐츠 카드는 Sanity 준비 상태에서만 노출
- Sanity Studio 외부 경로는 `NEXT_PUBLIC_SANITY_STUDIO_PATH` 기준
- 내부 Studio 엔트리는 `/admin/*`를 유지하고 rewrite로 매핑

## 6) 보안 규칙

- `SUPABASE_SECRET_KEY`, `SANITY_API_TOKEN`은 서버 전용
- 비밀값을 클라이언트 번들/로그/문서 예시에 노출하지 않는다
- 환경변수 변경 시 `.env.example` 동기화

## 7) i18n/SEO 규칙

- locale 라우팅은 `src/lib/i18n/*`에서 중앙 관리
- 텍스트 하드코딩보다 메시지 사전(`src/lib/i18n/messages.ts`) 우선
- 공개 index 페이지의 metadata/canonical/hreflang 유지
- 비공개 경로(`auth`, `app`, `forbidden`, Studio path)는 sitemap 제외/noindex 정책 유지

## 8) 변경 시 문서 동기화 대상

아래 항목 변경 시 문서를 반드시 함께 갱신한다.

- env 키/플래그 변경: `README.md`, `README.RUNBOOK.md`, 관련 구현 가이드
- 인증/RBAC 변경: `README.md`, `docs/supabase-implementation-guide.md`
- Sanity Studio 경로/동작 변경: `README.md`, `docs/sanity-implementation-guide.md`
- 실행 절차 변경: `README.RUNBOOK.md`

## 9) 검증 명령

코드/설정 변경 후 기본 검증:

```bash
pnpm run lint
pnpm run typecheck
pnpm run build
```

인프라 연동 변경 시 추가 검증:

```bash
pnpm run provision:supabase
pnpm run provision:sanity
```

## 10) 커밋/배포 규칙

- 사용자가 명시적으로 요청할 때만 커밋/푸시
- 커밋 메시지는 기존 스타일(`feat:`, `fix:`, `refactor:`, `chore:`) 준수
- 문서와 구현의 불일치가 있으면 구현만 바꾸지 말고 문서도 같이 수정

## 11) 완료 기준

- 구조/타입/보안 규칙 위반 없음
- 핵심 사용자 플로우 동작
- i18n/SEO 정책 유지
- `lint`, `typecheck`, `build` 통과
