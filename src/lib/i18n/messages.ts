import type { AppLocale } from "@/lib/i18n/config";

export type AppMessages = {
  common: {
    dashboard: string;
    app: string;
    blog: string;
    signIn: string;
    backendStatusApi: string;
    briefsApi: string;
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
  };
  auth: {
    signInTitle: string;
    signInDescription: string;
    magicLinkSent: string;
    sendMagicLink: string;
    sending: string;
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
    },
    auth: {
      signInTitle: "로그인",
      signInDescription: "보호된 경로는 Supabase 인증 + RBAC 권한 정책을 사용합니다.",
      magicLinkSent: "매직 링크를 보냈습니다. 메일에서 링크를 열어 로그인하세요.",
      sendMagicLink: "매직 링크 보내기",
      sending: "전송 중...",
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
    },
    auth: {
      signInTitle: "Sign In",
      signInDescription: "Protected routes use Supabase auth + RBAC policy.",
      magicLinkSent: "Sign-in link sent. Open your email and continue.",
      sendMagicLink: "Send Magic Link",
      sending: "Sending...",
    },
  },
};

export function getMessages(locale: AppLocale): AppMessages {
  return messages[locale];
}
