import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { isAppLocale, localizePathname } from "@/lib/i18n/config";
import { createLocalizedMetadata } from "@/lib/seo/localized-metadata";

type ForbiddenPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: ForbiddenPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isAppLocale(locale)) {
    return {};
  }

  return createLocalizedMetadata({
    locale,
    pathname: "/forbidden",
    title: locale === "ko" ? "접근 권한 없음" : "Access Forbidden",
    description:
      locale === "ko"
        ? "현재 계정은 이 페이지에 접근할 권한이 없습니다."
        : "Your account does not have enough permissions for this page.",
    noIndex: true,
  });
}

export default async function ForbiddenPage({ params }: ForbiddenPageProps) {
  const { locale } = await params;

  if (!isAppLocale(locale)) {
    notFound();
  }

  return (
    <main className="flex w-full flex-col items-center px-4 py-12 tablet:px-6 laptop:px-8 desktop:px-12">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>{locale === "ko" ? "접근 권한 없음" : "Forbidden"}</CardTitle>
          <CardDescription>
            {locale === "ko"
              ? "요청한 리소스에 접근할 수 없습니다. 권한 정책을 확인하세요."
              : "You cannot access this resource. Check role and policy configuration."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href={localizePathname("/", locale)}>
              {locale === "ko" ? "홈으로 돌아가기" : "Back to home"}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
