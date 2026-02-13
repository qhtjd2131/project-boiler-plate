# Sanity 적용 가이드

이 문서는 이 보일러플레이트에서 Sanity를 **공개 콘텐츠 CMS** 로 적용하는 절차다.

## 1) 역할 원칙

- Sanity는 공개 콘텐츠(예: 블로그, 포트폴리오, FAQ)만 담당한다.
- 사용자/권한/운영 트랜잭션 데이터는 Supabase에서 처리한다.
- 운영 데이터와 콘텐츠 데이터를 혼합하지 않는다.

## 2) 필수 환경변수

`.env.local` 기준:

```env
NEXT_PUBLIC_ENABLE_SANITY=true
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-02-19
SANITY_API_TOKEN=
SANITY_STUDIO_URL=
```

## 3) 연결 검증

```bash
pnpm run provision:sanity
```

이 스크립트는 다음을 확인한다.

- 프로젝트/데이터셋 연결 가능 여부
- API 버전/토큰 구성 정상 여부
- 게시 문서 조회 가능 여부

## 4) 기본 콘텐츠 레이어 구조

- Repository: `src/lib/backend/sanity-content-repository.ts`
- List API: `GET /api/content/public-items`
- Detail API: `GET /api/content/public-items/:slug`
- 화면 예시:
  - `/{locale}/blog`
  - `/{locale}/blog/[slug]`

## 5) 스키마 설계 권장

콘텐츠 타입은 아래 구조로 분리하는 것을 권장한다.

- `article`
- `portfolio`
- `faqItem`

공통 필드 권장:

- `title`
- `slug`
- `excerpt`
- `publishedAt`
- `seo_title`, `seo_description`, `og_image`

## 6) SEO 연동 권장

- 콘텐츠 상세 페이지는 locale별 metadata/canonical/hreflang 반영
- 검색 유입 대상 콘텐츠는 index 허용
- 비공개/미완성 콘텐츠는 noindex 또는 draft 관리

## 7) MCP 연결 (Sanity)

`opencode.json`의 sanity MCP를 사용한다.

필수 env:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_TOKEN`

## 8) 점검 체크리스트

- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run build`
- `/api/content/sanity-status`에서 연결 상태 확인
- `/{locale}/blog` 목록/상세 렌더링 확인
