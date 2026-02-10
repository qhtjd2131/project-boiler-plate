import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { canAccessRole, getServerAuthState } from "@/lib/auth/server-auth-state";
import { isAppLocale, localizePathname } from "@/lib/i18n/config";
import { createLocalizedMetadata } from "@/lib/seo/localized-metadata";

type AppPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: AppPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isAppLocale(locale)) {
    return {};
  }

  return createLocalizedMetadata({
    locale,
    pathname: "/app",
    title: locale === "ko" ? "보호된 앱 영역" : "Protected App Area",
    description:
      locale === "ko"
        ? "Supabase 인증과 RBAC 정책으로 보호된 내부 앱 페이지입니다."
        : "Internal app route protected by Supabase authentication and RBAC policy.",
    noIndex: true,
  });
}

export default async function ProtectedAppPage({ params }: AppPageProps) {
  const { locale } = await params;

  if (!isAppLocale(locale)) {
    notFound();
  }

  const authState = await getServerAuthState();

  return (
    <main className="flex w-full flex-col gap-6 px-4 py-8 tablet:px-6 laptop:px-8 desktop:px-12">
      <Card>
        <CardHeader>
          <CardTitle>{locale === "ko" ? "보호된 앱 페이지" : "Protected App Page"}</CardTitle>
          <CardDescription>
            {locale === "ko"
              ? "이 경로는 proxy + RBAC 가드로 보호됩니다."
              : "This route is protected by proxy + RBAC guard."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm">
            {locale === "ko" ? "인증 상태" : "Authentication"}:{" "}
            <strong>{String(authState.isAuthenticated)}</strong>
          </p>
          <p className="text-sm">
            {locale === "ko" ? "역할" : "Role"}: <Badge variant="outline">{authState.role}</Badge>
          </p>
          <p className="text-sm text-muted-foreground">User ID: {authState.userId ?? "-"}</p>

          <p className="text-sm text-muted-foreground">
            {locale === "ko" ? "admin 권한 보유 여부" : "Has admin access"}:{" "}
            {String(canAccessRole(authState.role, "admin"))}
          </p>

          <Button asChild>
            <Link href={localizePathname("/", locale)}>
              {locale === "ko" ? "대시보드로 이동" : "Go to dashboard"}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
