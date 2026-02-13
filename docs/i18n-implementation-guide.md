# 다국어(i18n) 적용 가이드

이 문서는 보일러플레이트의 다국어 구조(`ko`, `en`)를 프로젝트에 확장/적용하는 방법을 설명한다.

## 1) 기본 전략

- URL 전략: `/{locale}`
- 기본 언어: `ko`
- 지원 언어: `ko`, `en`

핵심 설정 파일:

- `src/lib/i18n/config.ts`
- `src/lib/i18n/messages.ts`
- `src/lib/i18n/negotiation.ts`

## 2) 라우팅 동작

- `/` 접속 시 `accept-language` 기반으로 locale 경로로 리다이렉트
- locale 없는 보조 경로(`/blog`, `/app`, `/auth/sign-in`)는 기본 언어(`ko`) 경로로 리다이렉트
- 보호 라우트는 proxy에서 locale를 인식해 sign-in/forbidden 경로도 locale 유지

## 3) 새로운 언어 추가 절차

예: `ja` 추가

1. `src/lib/i18n/config.ts`
   - `SUPPORTED_LOCALES`에 `ja` 추가
   - 표시명 함수 업데이트
2. `src/lib/i18n/messages.ts`
   - `ja` 메시지 사전 추가
3. locale별 페이지 `generateStaticParams`/metadata 확인
4. `sitemap.ts` hreflang 확장 확인

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

- `/` -> `/ko` 또는 `/en` 리다이렉트 확인
- `/{locale}` 페이지 문자열 번역 확인
- 페이지 소스에 canonical/hreflang 존재 확인
- `/sitemap.xml` locale URL 확인
- `pnpm run lint`, `pnpm run typecheck`, `pnpm run build` 통과
