import { DEFAULT_LOCALE, resolveAppLocale, type AppLocale } from "@/lib/i18n/config";

export type AppMessages = {
  common: {
    dashboard: string;
    app: string;
    blog: string;
    signIn: string;
    backendStatusApi: string;
    backToHome: string;
  };
  dashboard: {
    heroTitle: string;
    heroDescription: string;
    statusTitle: string;
    statusDescription: string;
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
    emailLabel: string;
    passwordLabel: string;
    emailPlaceholder: string;
    passwordPlaceholder: string;
    signInWithEmail: string;
    signInWithGoogle: string;
    signInWithKakao: string;
    signingIn: string;
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
      backToHome: "홈으로",
    },
    dashboard: {
      heroTitle: "Supabase 운영 DB + Sanity 공개 콘텐츠 CMS 스타터",
      heroDescription:
        "이 화면은 Supabase 운영 데이터와 Sanity 콘텐츠 설정 상태를 함께 점검합니다.",
      statusTitle: "백엔드 런타임 상태",
      statusDescription: "Supabase와 Sanity의 역할 분리 및 구성 상태를 확인합니다.",
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
      emailLabel: "이메일",
      passwordLabel: "비밀번호",
      emailPlaceholder: "you@client.com",
      passwordPlaceholder: "비밀번호를 입력하세요",
      signInWithEmail: "이메일로 로그인",
      signInWithGoogle: "Google로 로그인",
      signInWithKakao: "Kakao로 로그인",
      signingIn: "로그인 중...",
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
      backToHome: "Back to home",
    },
    dashboard: {
      heroTitle: "Supabase operational DB + Sanity public content starter",
      heroDescription:
        "This screen validates separated roles for Supabase operational data and Sanity public content.",
      statusTitle: "Backend Runtime Status",
      statusDescription: "Check role-separated runtime setup for Supabase and Sanity.",
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
      emailLabel: "Email",
      passwordLabel: "Password",
      emailPlaceholder: "you@client.com",
      passwordPlaceholder: "Enter your password",
      signInWithEmail: "Sign in with email",
      signInWithGoogle: "Continue with Google",
      signInWithKakao: "Continue with Kakao",
      signingIn: "Signing in...",
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
