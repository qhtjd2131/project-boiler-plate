# OpenCode Project Context

이 문서는 OpenCode가 외주 프로젝트를 구현할 때 항상 우선 적용하는 기본 컨텍스트다.
목표는 **일관성 높은 코드 품질**과 **실무에서 바로 쓸 수 있는 UI 완성도**다.

## 1) AI 입력 템플릿 (필수)

아래 항목이 비어 있으면 구현 정확도가 급격히 떨어진다. 먼저 채운다.

- 프로젝트 목표 한 줄:
- 핵심 사용자/검색 의도:
- 핵심 전환 이벤트(회원가입, 문의, 결제 등):
- 필수 라우트 목록(예: `/`, `/{locale}/pricing`, `/{locale}/blog/[slug]`):
- 콘텐츠 소스(정적/Sanity 스키마):
- 백엔드 플래그(`supabase`, `sanity`):
- 분석 플래그(`google_analytics` on/off, 측정 ID 보유 여부):
- 인증/권한 요구(비회원/회원/관리자):
- 운영 도메인/지원 언어(예: `example.com`, `ko,en`):
- 브랜드 톤 키워드 3개(예: `premium`, `clean`, `trustworthy`):
- 참고 사이트/디자인 링크 문서(`docs/client-reference.md`) 작성 여부:

## 2) AI 확인 질문 (구현에 직접 쓰이는 질문만)

1. SEO 유입이 필요한 핵심 페이지는 무엇인가?
2. 페이지별 목표 키워드/검색 의도는 무엇인가?
3. slug 규칙은 무엇인가? (영문 고정/국문 허용/날짜 포함 여부)
4. index/noindex 대상 페이지는 무엇인가?
5. canonical 도메인은 무엇인가? (`www` 포함 여부)
6. 다국어 URL 전략은 `/{locale}`로 확정인가? (예: `ko`, `en`)
7. locale별 메타 title/description을 개별 운영할지 공용 템플릿을 쓸지?
8. JSON-LD 유형은 무엇이 필요한가? (`Organization`, `WebSite`, `Article`, `FAQPage` 등)
9. Sanity에서 SEO 필드(`seo_title`, `seo_description`, `og_image`)를 운영할지?
10. 인증이 필요한 경로와 공개 경로를 어떻게 나눌지?
11. RBAC 최소 역할 정책은 무엇인가? (`member`, `editor`, `admin`)
12. 리다이렉트/레거시 URL 매핑이 필요한가?

## 3) 정보 미입력 시 기본값

명시값이 없으면 아래 기본값으로 즉시 진행한다.

- 인증: Supabase Auth 단일
- 콘텐츠 운영: Sanity dataset 기반
- 다국어: `ko`, `en`
- 기본 언어: `ko`
- URL 전략: `/{locale}`
- canonical: `NEXT_PUBLIC_SITE_URL`
- SEO 정책: 공개 페이지 index, 인증/개인화 페이지 noindex
- 반응형: `mobile < tablet < laptop < desktop` 고정 구간
- 시각 스타일: 밝은 배경 기반 + 높은 가독성 + 중립 톤 포인트 컬러

## 4) 아키텍처 불변 규칙

- Supabase는 인프라(Auth, DB, Storage) 담당
- Sanity는 공개 콘텐츠 CMS 담당
- Supabase와 Sanity는 대체 관계가 아니라 역할 분담 구조로 구현
- 기능 플래그로 연결 여부를 제어하고, 미설정 시 안전한 fallback 제공

## 5) 코드 일관성 계약 (강제)

### 구조/레이어

- App Router 기반 구현
- `src/lib/backend`는 adapter/repository 패턴 유지
- UI 레이어에서 SDK 직접 호출 금지
- Server/Client 경계를 파일 단위로 명확히 분리

### 네이밍/파일 규칙

- 컴포넌트: PascalCase
- 훅: `use*`
- 유틸/함수: camelCase
- 파일명: kebab-case
- 상수: 의미 있는 명명, 매직값 하드코딩 금지

### 타입/데이터 계약

- `any` 사용 금지(불가피한 경우 좁은 범위에서 즉시 정제)
- 공통 응답 포맷은 `AppResult<T>` 고정
- 에러 코드는 표준 집합만 사용: `VALIDATION`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `NOT_CONFIGURED`, `INTERNAL`
- 입력은 `zod`로 검증하고 검증 실패 메시지는 사용자 친화적으로 유지

### 상태/쿼리

- 서버 상태는 `@tanstack/react-query` 표준 사용
- query key는 도메인 문자열 배열로 고정
- 동일 데이터는 중복 fetch 대신 query 재사용

### 환경변수/보안

- 필수 env 키는 `.env.example`와 동기화
- 민감값은 클라이언트 번들 노출 금지
- `SANITY_API_TOKEN`, `SUPABASE_SECRET_KEY`는 서버 전용

### 릴리즈/운영

- 패키지 버전 exact 고정
- CI 게이트(`lint`, `typecheck`, `build`) 실패 시 기능 작업보다 먼저 복구
- CD 비밀값은 GitHub Secrets/Vercel Env만 사용

## 6) 고급 SEO 계약 (강제)

- index 대상 페이지마다 `metadata`를 명시하고 title/description 중복을 피한다
- 다국어 페이지는 locale별 canonical + hreflang을 반드시 포함한다
- `sitemap.ts`는 App Router 페이지 자동 수집을 유지하고 locale URL을 확장한다
- 비공개 경로(`auth`, `app`, `forbidden`, 내부관리)는 sitemap 제외/noindex 처리
- `robots.ts`는 환경별 정책 적용(Preview noindex 우선)
- 필요 페이지에 JSON-LD를 삽입하고 타입을 페이지 목적에 맞춘다
- 내부 링크/브레드크럼 구조를 일관되게 유지해 크롤링 경로를 명확히 한다

## 7) 디자인 품질 계약 (강화)

### 비주얼 방향

- 매 프로젝트 시작 시 시각 콘셉트를 1문장으로 먼저 정의한다
- 무색무취 템플릿 느낌을 피하고, 브랜드 톤 키워드에 맞는 시각 언어를 유지한다
- 고객 참고 링크는 `docs/client-reference.md`를 기준으로 해석하고, 복제가 아닌 재해석을 원칙으로 한다

### 타이포그래피

- 제목/본문/보조 텍스트 계층을 명확히 분리한다
- 폰트 크기만 키우지 말고 줄간격, 자간, 굵기를 함께 조정한다
- 긴 문단은 최대 너비를 제한해 가독성을 보장한다

### 컬러/토큰

- 색상은 CSS 변수 토큰으로 관리한다
- 상태색(성공/경고/오류/정보) 의미를 일관되게 유지한다
- 대비 부족한 색 조합을 피하고 접근성 대비를 보장한다

### 레이아웃/반응형

- 레이아웃은 기본 `width: 100%`
- 반응형 구간 고정: `mobile(<768)`, `tablet(>=768)`, `laptop(>=1280)`, `desktop(>=1536)`
- page-view 기본 패턴: `PageHeader -> Controls/Filters -> Content -> Empty/Error/Skeleton`
- 섹션 간 간격/리듬을 일정하게 유지해 시각적 안정감을 만든다

### 컴포넌트 디테일

- 버튼/입력/카드/배지의 반경, 테두리, 그림자 강도를 체계적으로 통일한다
- hover/focus/active/disabled 상태를 항상 구현한다
- 의미 없는 장식보다 정보 전달 우선 구조를 선택한다

### 모션

- 모션은 짧고 목적 있는 전환에만 사용한다
- 과한 애니메이션/지속 루프는 지양한다

### 금지사항

- 임의의 inline style 남발 금지
- 랜덤 색상/랜덤 radius 혼용 금지
- 페이지마다 디자인 규칙이 바뀌는 불연속 UI 금지

## 8) i18n 구현 규칙

- locale 판별/라우팅은 중앙 설정(`src/lib/i18n/*`)으로 관리
- 텍스트는 메시지 사전에서 조회하고 하드코딩 최소화
- locale 전환 시 URL/메타/canonical/hreflang이 함께 갱신되어야 한다

## 9) MCP 운영 규칙

- OpenCode MCP는 단일 프로필(`opencode.json`) 기준
- 기본 MCP: `supabase`, `sanity`, `context7`, `shadcn`
- 민감 프로젝트는 Supabase MCP를 `read_only + project_ref`로 제한

## 10) 고객 레퍼런스 링크 운영 규칙

- 고객이 전달한 참고 사이트/디자인 링크는 반드시 `docs/client-reference.md`에 구조화해 기록한다
- 링크별로 `must / should / avoid`를 구분해 우선순위를 명시한다
- 페이지 단위 매핑(`/{locale}`, `/{locale}/portfolio` 등)을 작성해 구현 시 추적 가능하게 유지한다
- 레퍼런스 간 충돌이 있으면 전환 효율, 접근성, 브랜드 톤 순으로 결정한다
- 구현 완료 전 "레퍼런스 반영 여부"를 간단 체크리스트로 검수한다

## 11) 완료 기준 (Definition of Done)

- 코드: 구조/네이밍/타입 규칙 위반 없음
- 기능: 핵심 사용자 플로우 동작
- SEO: canonical/hreflang/sitemap/robots 점검 완료
- 디자인: 반응형 4구간에서 레이아웃 깨짐 없음
- 품질 게이트: `lint`, `typecheck`, `build` 통과
