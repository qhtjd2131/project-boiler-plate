import { DEFAULT_LOCALE, resolveAppLocale, type AppLocale } from "@/lib/i18n/config";

export type AppMessages = {
  common: {
    dashboard: string;
    app: string;
    blog: string;
    signIn: string;
    systemStatus: string;
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
    modeSignIn: string;
    modeSignUp: string;
    signInTitle: string;
    signInDescription: string;
    signUpTitle: string;
    signUpDescription: string;
    emailLabel: string;
    passwordLabel: string;
    confirmPasswordLabel: string;
    emailPlaceholder: string;
    passwordPlaceholder: string;
    confirmPasswordPlaceholder: string;
    signInWithEmail: string;
    signUpWithEmail: string;
    signInWithGoogle: string;
    signInWithKakao: string;
    signUpWithGoogle: string;
    signUpWithKakao: string;
    signingIn: string;
    signingUp: string;
    orLabel: string;
    invalidCredentials: string;
    accountExists: string;
    passwordMismatch: string;
    passwordPolicyTitle: string;
    passwordPolicyItems: readonly string[];
    passwordPolicyError: string;
    signUpVerificationSent: string;
    switchToSignIn: string;
    switchToSignUp: string;
    tooManyAttempts: string;
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
  statusPage: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    description: string;
    moduleStatusTitle: string;
    moduleStatusDescription: string;
    sourceOperationalLabel: string;
    sourceContentLabel: string;
    enabledLabel: string;
    configuredLabel: string;
    readyLabel: string;
    moduleSupabase: string;
    moduleSanity: string;
    moduleAuth: string;
    moduleI18n: string;
    onState: string;
    offState: string;
  };
  footer: {
    brandTitle: string;
    brandDescription: string;
    quickLinksTitle: string;
    moduleStatusTitle: string;
    deliveryTitle: string;
    deliveryDescription: string;
    moduleSupabase: string;
    moduleSanity: string;
    moduleAuth: string;
    moduleI18n: string;
    onState: string;
    offState: string;
    copyright: string;
  };
};

const messages: Record<AppLocale, AppMessages> = {
  ko: {
    common: {
      dashboard: "대시보드",
      app: "앱",
      blog: "콘텐츠",
      signIn: "로그인",
      systemStatus: "시스템 상태",
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
      modeSignIn: "로그인",
      modeSignUp: "회원가입",
      signInTitle: "로그인",
      signInDescription: "보호된 경로는 Supabase 인증 + RBAC 권한 정책을 사용합니다.",
      signUpTitle: "회원가입",
      signUpDescription: "고객 계정을 만들고 즉시 서비스 이용을 시작할 수 있습니다.",
      emailLabel: "이메일",
      passwordLabel: "비밀번호",
      confirmPasswordLabel: "비밀번호 확인",
      emailPlaceholder: "you@client.com",
      passwordPlaceholder: "비밀번호를 입력하세요",
      confirmPasswordPlaceholder: "비밀번호를 다시 입력하세요",
      signInWithEmail: "이메일로 로그인",
      signUpWithEmail: "이메일로 회원가입",
      signInWithGoogle: "Google로 로그인",
      signInWithKakao: "Kakao로 로그인",
      signUpWithGoogle: "Google로 회원가입",
      signUpWithKakao: "Kakao로 회원가입",
      signingIn: "로그인 중...",
      signingUp: "가입 처리 중...",
      orLabel: "or",
      invalidCredentials: "이메일 또는 비밀번호가 올바르지 않습니다.",
      accountExists: "이미 가입된 이메일입니다. 로그인으로 진행해주세요.",
      passwordMismatch: "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
      passwordPolicyTitle: "비밀번호 보안 정책",
      passwordPolicyItems: [
        "최소 10자 이상",
        "영문 대문자 1개 이상",
        "영문 소문자 1개 이상",
        "숫자 1개 이상",
        "특수문자 1개 이상",
      ],
      passwordPolicyError: "비밀번호가 보안 정책을 만족하지 않습니다.",
      signUpVerificationSent:
        "회원가입 요청이 접수되었습니다. 이메일 인증 링크를 확인한 뒤 로그인하세요.",
      switchToSignIn: "이미 계정이 있나요? 로그인",
      switchToSignUp: "계정이 없나요? 회원가입",
      tooManyAttempts: "로그인 시도가 너무 많습니다. {seconds}초 후 다시 시도해주세요.",
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
    statusPage: {
      metaTitle: "시스템 상태",
      metaDescription: "Supabase, Sanity, Auth, i18n 모듈 상태를 확인하는 운영 페이지입니다.",
      title: "시스템 상태",
      description: "현재 프로젝트에서 활성화된 모듈과 구성 완료 상태를 확인합니다.",
      moduleStatusTitle: "모듈 상태",
      moduleStatusDescription: "플래그 활성 여부와 런타임 구성 상태를 동시에 표시합니다.",
      sourceOperationalLabel: "운영 데이터 소스",
      sourceContentLabel: "콘텐츠 소스",
      enabledLabel: "활성화",
      configuredLabel: "구성 완료",
      readyLabel: "준비 상태",
      moduleSupabase: "Supabase",
      moduleSanity: "Sanity",
      moduleAuth: "Auth",
      moduleI18n: "i18n",
      onState: "ON",
      offState: "OFF",
    },
    footer: {
      brandTitle: "External Delivery Boilerplate",
      brandDescription: "외주 프로젝트를 빠르게 시작할 수 있도록 설계된 모듈형 Next.js 스타터.",
      quickLinksTitle: "바로가기",
      moduleStatusTitle: "모듈 상태",
      deliveryTitle: "운영 원칙",
      deliveryDescription:
        "기능은 플래그로 제어하고, 사용하지 않는 기능은 UI에서 노출하지 않습니다.",
      moduleSupabase: "Supabase",
      moduleSanity: "Sanity",
      moduleAuth: "Auth",
      moduleI18n: "i18n",
      onState: "ON",
      offState: "OFF",
      copyright: "All rights reserved.",
    },
  },
  en: {
    common: {
      dashboard: "Dashboard",
      app: "App",
      blog: "Content",
      signIn: "Sign In",
      systemStatus: "System Status",
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
      modeSignIn: "Sign In",
      modeSignUp: "Sign Up",
      signInTitle: "Sign In",
      signInDescription: "Protected routes use Supabase auth + RBAC policy.",
      signUpTitle: "Create Account",
      signUpDescription: "Create a customer account and start using protected features.",
      emailLabel: "Email",
      passwordLabel: "Password",
      confirmPasswordLabel: "Confirm password",
      emailPlaceholder: "you@client.com",
      passwordPlaceholder: "Enter your password",
      confirmPasswordPlaceholder: "Re-enter your password",
      signInWithEmail: "Sign in with email",
      signUpWithEmail: "Sign up with email",
      signInWithGoogle: "Continue with Google",
      signInWithKakao: "Continue with Kakao",
      signUpWithGoogle: "Sign up with Google",
      signUpWithKakao: "Sign up with Kakao",
      signingIn: "Signing in...",
      signingUp: "Creating account...",
      orLabel: "or",
      invalidCredentials: "Invalid email or password.",
      accountExists: "An account with this email already exists.",
      passwordMismatch: "Password and confirmation do not match.",
      passwordPolicyTitle: "Password security policy",
      passwordPolicyItems: [
        "At least 10 characters",
        "At least one uppercase letter",
        "At least one lowercase letter",
        "At least one number",
        "At least one special character",
      ],
      passwordPolicyError: "Password does not satisfy the security policy.",
      signUpVerificationSent:
        "Sign-up request was accepted. Verify your email, then sign in with your account.",
      switchToSignIn: "Already have an account? Sign in",
      switchToSignUp: "Need an account? Sign up",
      tooManyAttempts: "Too many sign-in attempts. Try again in {seconds} seconds.",
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
    statusPage: {
      metaTitle: "System Status",
      metaDescription: "Operational status page for Supabase, Sanity, Auth, and i18n modules.",
      title: "System Status",
      description: "Review enabled modules and runtime configuration readiness.",
      moduleStatusTitle: "Module Status",
      moduleStatusDescription:
        "Shows feature-flag state and runtime configuration at the same time.",
      sourceOperationalLabel: "Operational source",
      sourceContentLabel: "Content source",
      enabledLabel: "Enabled",
      configuredLabel: "Configured",
      readyLabel: "Ready",
      moduleSupabase: "Supabase",
      moduleSanity: "Sanity",
      moduleAuth: "Auth",
      moduleI18n: "i18n",
      onState: "ON",
      offState: "OFF",
    },
    footer: {
      brandTitle: "External Delivery Boilerplate",
      brandDescription: "Modular Next.js starter designed for fast outsourced project delivery.",
      quickLinksTitle: "Quick links",
      moduleStatusTitle: "Module status",
      deliveryTitle: "Delivery principle",
      deliveryDescription: "Control features with flags and keep unused features out of the UI.",
      moduleSupabase: "Supabase",
      moduleSanity: "Sanity",
      moduleAuth: "Auth",
      moduleI18n: "i18n",
      onState: "ON",
      offState: "OFF",
      copyright: "All rights reserved.",
    },
  },
};

export function getMessages(locale: AppLocale): AppMessages {
  return messages[locale] ?? messages[DEFAULT_LOCALE];
}

export function getMessagesByValue(localeValue: string | null | undefined): AppMessages {
  return getMessages(resolveAppLocale(localeValue));
}
