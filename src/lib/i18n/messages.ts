import { DEFAULT_LOCALE, resolveAppLocale, type AppLocale } from "@/lib/i18n/config";

export type AppMessages = {
  common: {
    dashboard: string;
    app: string;
    blog: string;
    signIn: string;
    backendStatusApi: string;
    briefsApi: string;
    backToHome: string;
  };
  dashboard: {
    heroTitle: string;
    heroDescription: string;
    newBriefTitle: string;
    newBriefDescription: string;
    statusTitle: string;
    statusDescription: string;
    recentTitle: string;
    recentDescription: string;
    titleLabel: string;
    summaryLabel: string;
    slugPreviewLabel: string;
    titlePlaceholder: string;
    summaryPlaceholder: string;
    saveBrief: string;
    saving: string;
    noBriefs: string;
    briefStorageModeLabel: string;
    briefStorageSupabase: string;
    briefStorageMock: string;
    supabaseDisabledNotice: string;
    supabaseNotConfiguredNotice: string;
    sanityPublicContentTitle: string;
    sanityPublicContentDescription: string;
    sanityLoading: string;
    sanityEmpty: string;
    sanityPublishedPrefix: string;
    sanityDisabledNotice: string;
    sanityNotConfiguredNotice: string;
  };
  auth: {
    signInTitle: string;
    signInDescription: string;
    magicLinkSent: string;
    sendMagicLink: string;
    sending: string;
    redirectPathLabel: string;
  };
  appPage: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    description: string;
    authStatusLabel: string;
    roleLabel: string;
    hasAdminLabel: string;
    goDashboard: string;
  };
  forbiddenPage: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    description: string;
  };
  blogList: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    description: string;
    connectionStatusTitle: string;
  };
  blogDetail: {
    metaFallbackTitle: string;
    metaNotFoundDescription: string;
    metaFallbackDescription: string;
    backToList: string;
    noExcerpt: string;
  };
};

const messages: Record<AppLocale, AppMessages> = {
  ko: {
    common: {
      dashboard: "대시보드",
      app: "앱",
      blog: "콘텐츠",
      signIn: "로그인",
      backendStatusApi: "백엔드 상태 API",
      briefsApi: "브리프 API",
      backToHome: "홈으로",
    },
    dashboard: {
      heroTitle: "Supabase 운영 DB + Sanity 공개 콘텐츠 CMS 스타터",
      heroDescription:
        "이 화면은 Supabase 운영 데이터와 Sanity 콘텐츠 설정 상태를 함께 점검합니다.",
      newBriefTitle: "새 프로젝트 브리프",
      newBriefDescription: "react-hook-form + zod + tanstack-query 조합 예시",
      statusTitle: "백엔드 런타임 상태",
      statusDescription: "Supabase와 Sanity의 역할 분리 및 구성 상태를 확인합니다.",
      recentTitle: "최근 브리프",
      recentDescription: "Supabase 운영 DB에서 반환된 데이터",
      titleLabel: "제목",
      summaryLabel: "요약",
      slugPreviewLabel: "슬러그 미리보기",
      titlePlaceholder: "이커머스 클라이언트 랜딩 페이지 개편",
      summaryPlaceholder: "프로젝트 목표, 대상 사용자, 일정, 성공 기준을 작성하세요.",
      saveBrief: "브리프 저장",
      saving: "저장 중...",
      noBriefs: "아직 브리프가 없습니다. 위 폼에서 새 브리프를 저장하세요.",
      briefStorageModeLabel: "브리프 저장 모드",
      briefStorageSupabase: "Supabase 영구 저장",
      briefStorageMock: "대시보드 저장 비활성화(Supabase 설정 필요)",
      supabaseDisabledNotice:
        "Supabase 플래그가 꺼져 있어 브리프 저장 기능을 비활성화했습니다. NEXT_PUBLIC_ENABLE_SUPABASE=true로 켜세요.",
      supabaseNotConfiguredNotice:
        "Supabase 플래그는 켜져 있지만 런타임 키가 누락되어 브리프 저장 기능을 비활성화했습니다. NEXT_PUBLIC_SUPABASE_PROJECT_ID, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY를 확인하세요.",
      sanityPublicContentTitle: "Sanity 공개 콘텐츠",
      sanityPublicContentDescription: "GROQ 리포지토리 레이어를 통해 공개 콘텐츠를 조회합니다.",
      sanityLoading: "콘텐츠 로딩 중...",
      sanityEmpty: "표시할 공개 콘텐츠가 없습니다. Sanity 문서를 추가해보세요.",
      sanityPublishedPrefix: "게시일",
      sanityDisabledNotice:
        "Sanity 플래그가 꺼져 있어 콘텐츠 목록을 숨깁니다. NEXT_PUBLIC_ENABLE_SANITY=true로 켜세요.",
      sanityNotConfiguredNotice:
        "Sanity 플래그는 켜져 있지만 프로젝트 설정이 누락되어 콘텐츠 목록을 숨깁니다. NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, NEXT_PUBLIC_SANITY_API_VERSION을 확인하세요.",
    },
    auth: {
      signInTitle: "로그인",
      signInDescription: "보호된 경로는 Supabase 인증 + RBAC 권한 정책을 사용합니다.",
      magicLinkSent: "매직 링크를 보냈습니다. 메일에서 링크를 열어 로그인하세요.",
      sendMagicLink: "매직 링크 보내기",
      sending: "전송 중...",
      redirectPathLabel: "로그인 후 이동 경로",
    },
    appPage: {
      metaTitle: "보호된 앱 영역",
      metaDescription: "Supabase 인증과 RBAC 정책으로 보호된 내부 앱 페이지입니다.",
      title: "보호된 앱 페이지",
      description: "이 경로는 proxy + RBAC 가드로 보호됩니다.",
      authStatusLabel: "인증 상태",
      roleLabel: "역할",
      hasAdminLabel: "admin 권한 보유 여부",
      goDashboard: "대시보드로 이동",
    },
    forbiddenPage: {
      metaTitle: "접근 권한 없음",
      metaDescription: "현재 계정은 이 페이지에 접근할 권한이 없습니다.",
      title: "접근 권한 없음",
      description: "요청한 리소스에 접근할 수 없습니다. 권한 정책을 확인하세요.",
    },
    blogList: {
      metaTitle: "콘텐츠",
      metaDescription: "Sanity에서 운영되는 공개 콘텐츠 목록입니다.",
      title: "공개 콘텐츠",
      description: "Sanity CMS에서 관리하는 게시물을 미리 확인합니다.",
      connectionStatusTitle: "연결 상태",
    },
    blogDetail: {
      metaFallbackTitle: "콘텐츠",
      metaNotFoundDescription: "콘텐츠를 찾을 수 없습니다.",
      metaFallbackDescription: "공개 콘텐츠 상세",
      backToList: "콘텐츠 목록으로",
      noExcerpt: "요약이 없습니다.",
    },
  },
  en: {
    common: {
      dashboard: "Dashboard",
      app: "App",
      blog: "Content",
      signIn: "Sign In",
      backendStatusApi: "Backend Status API",
      briefsApi: "Briefs API",
      backToHome: "Back to home",
    },
    dashboard: {
      heroTitle: "Supabase operational DB + Sanity public content starter",
      heroDescription:
        "This screen validates separated roles for Supabase operational data and Sanity public content.",
      newBriefTitle: "New Project Brief",
      newBriefDescription: "Example composition with react-hook-form + zod + tanstack-query",
      statusTitle: "Backend Runtime Status",
      statusDescription: "Check role-separated runtime setup for Supabase and Sanity.",
      recentTitle: "Recent Briefs",
      recentDescription: "Data returned from Supabase operational storage",
      titleLabel: "Title",
      summaryLabel: "Summary",
      slugPreviewLabel: "Slug preview",
      titlePlaceholder: "Landing page revamp for ecommerce client",
      summaryPlaceholder: "Define goal, audience, timeline, and success criteria for the project.",
      saveBrief: "Save Brief",
      saving: "Saving...",
      noBriefs: "No briefs yet. Save one from the form above.",
      briefStorageModeLabel: "Brief storage mode",
      briefStorageSupabase: "Supabase persistent storage",
      briefStorageMock: "Dashboard save disabled (Supabase setup required)",
      supabaseDisabledNotice:
        "Supabase flag is off, so brief saving is disabled. Set NEXT_PUBLIC_ENABLE_SUPABASE=true.",
      supabaseNotConfiguredNotice:
        "Supabase flag is on but runtime keys are missing, so brief saving is disabled. Check NEXT_PUBLIC_SUPABASE_PROJECT_ID, NEXT_PUBLIC_SUPABASE_URL, and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
      sanityPublicContentTitle: "Sanity Public Content",
      sanityPublicContentDescription: "Reads public content through the GROQ repository layer.",
      sanityLoading: "Loading content...",
      sanityEmpty: "No public content found. Add documents in Sanity.",
      sanityPublishedPrefix: "Published",
      sanityDisabledNotice:
        "Sanity flag is off, so content list is hidden. Set NEXT_PUBLIC_ENABLE_SANITY=true.",
      sanityNotConfiguredNotice:
        "Sanity flag is on but project settings are missing, so content list is hidden. Check NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, and NEXT_PUBLIC_SANITY_API_VERSION.",
    },
    auth: {
      signInTitle: "Sign In",
      signInDescription: "Protected routes use Supabase auth + RBAC policy.",
      magicLinkSent: "Sign-in link sent. Open your email and continue.",
      sendMagicLink: "Send Magic Link",
      sending: "Sending...",
      redirectPathLabel: "After sign-in, redirect path",
    },
    appPage: {
      metaTitle: "Protected App Area",
      metaDescription: "Internal app route protected by Supabase authentication and RBAC policy.",
      title: "Protected App Page",
      description: "This route is protected by proxy + RBAC guard.",
      authStatusLabel: "Authentication",
      roleLabel: "Role",
      hasAdminLabel: "Has admin access",
      goDashboard: "Go to dashboard",
    },
    forbiddenPage: {
      metaTitle: "Access Forbidden",
      metaDescription: "Your account does not have enough permissions for this page.",
      title: "Forbidden",
      description: "You cannot access this resource. Check role and policy configuration.",
    },
    blogList: {
      metaTitle: "Content",
      metaDescription: "Public content list managed in Sanity.",
      title: "Public Content",
      description: "Preview posts managed by Sanity CMS.",
      connectionStatusTitle: "Connection status",
    },
    blogDetail: {
      metaFallbackTitle: "Content",
      metaNotFoundDescription: "Content not found.",
      metaFallbackDescription: "Public content detail",
      backToList: "Back to content list",
      noExcerpt: "No excerpt provided.",
    },
  },
};

export function getMessages(locale: AppLocale): AppMessages {
  return messages[locale] ?? messages[DEFAULT_LOCALE];
}

export function getMessagesByValue(localeValue: string | null | undefined): AppMessages {
  return getMessages(resolveAppLocale(localeValue));
}
