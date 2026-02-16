# 다국어(i18n) 적용 가이드

이 문서는 보일러플레이트의 다국어 구조(`ko`, `en`)를 프로젝트에 확장/적용하는 방법을 설명한다.

## 1) 기본 전략

- URL 전략: 기본언어(`ko`)는 prefix 없음, 비기본언어는 `/{locale}`
- 기본 언어: `ko`
- 지원 언어: `ko`, `en`
- i18n 플래그: `NEXT_PUBLIC_ENABLE_I18N`

핵심 설정 파일:

- `src/lib/i18n/config.ts`
- `src/lib/i18n/messages.ts`
- `src/lib/i18n/negotiation.ts`

## 2) 라우팅 동작

- `/`는 기본언어(`ko`)를 렌더링하고, `accept-language`가 비기본언어면 해당 locale 경로로 이동
- locale 없는 경로(`/blog`, `/app`, `/auth/sign-in`, `/auth/sign-up`)는 내부적으로 기본언어 route로 rewrite 처리
- `/ko/*` 요청은 canonical 기본경로(`/*`)로 301/308 리다이렉트
- 보호 라우트는 proxy에서 locale를 인식해 sign-in/forbidden 경로도 locale 유지
- `NEXT_PUBLIC_ENABLE_I18N=false`면 locale selector UI를 숨기고 비기본 locale 경로는 `404` 처리
- locale 전환 UI는 toggle이 아니라 경로 매칭 기반 select(change event) 방식으로 동작

## 3) 새로운 언어 추가 절차

예: `ja` 추가

1. `src/lib/i18n/config.ts`
   - `LOCALE_CONFIG`에 `ja` 항목 추가
   - `displayName`, `openGraphLocale` 정의
2. `src/lib/i18n/messages.ts`
   - `messages.ja` 사전 추가
   - `AppMessages` 타입 계약에 맞춰 키를 빠짐없이 채움
3. locale별 페이지 `generateStaticParams`/metadata 확인
   - `SUPPORTED_LOCALES`는 `LOCALE_CONFIG`에서 자동 생성됨
4. `sitemap.ts` hreflang 확장 확인

## 3.5) 텍스트 매칭 로직 규칙

- `locale === "ko" ? ... : ...` 같은 2분기 하드코딩을 사용하지 않는다.
- 모든 사용자 노출 텍스트는 `getMessages(locale)` 기반으로 조회한다.
- fallback은 `DEFAULT_LOCALE`(`ko`)로 통일한다.
- 새 언어 추가 시 컴포넌트 로직 수정 없이 메시지 사전 확장만으로 동작해야 한다.

## 4) SEO 동기화 규칙

locale 전환 시 아래가 함께 변경되어야 한다.

- canonical
- hreflang alternates
- openGraph locale
- sitemap locale URL

관련 파일:

- `src/lib/seo/localized-metadata.ts`
- `src/app/sitemap.ts`
- `src/lib/seo/sitemap-routes.ts`

## 5) html lang 처리

- 기본 `lang`은 `ko`
- proxy가 `x-app-locale` 헤더를 전달
- 루트 레이아웃에서 해당 값으로 `<html lang>` 동적 반영

관련 파일:

- `src/proxy.ts`
- `src/app/layout.tsx`

## 6) 품질 점검 체크리스트

- `/` 기본언어 렌더링, `/en` 비기본언어 렌더링 확인
- `/ko/*` 접근 시 prefix 없는 canonical 경로로 리다이렉트 확인
- `/`, `/en` 페이지 문자열 번역 확인
- 페이지 소스에 canonical/hreflang 존재 확인
- `/sitemap.xml` locale URL 확인
- `pnpm run lint`, `pnpm run typecheck`, `pnpm run build` 통과
