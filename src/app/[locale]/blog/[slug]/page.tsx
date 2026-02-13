import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSanityPublicContentBySlug } from "@/lib/backend/sanity-content-repository";
import { isAppLocale, localizePathname, type AppLocale } from "@/lib/i18n/config";
import { createLocalizedMetadata } from "@/lib/seo/localized-metadata";

type BlogDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!isAppLocale(locale)) {
    return {};
  }

  const result = await getSanityPublicContentBySlug(slug);

  if (!result.ok) {
    return createLocalizedMetadata({
      locale,
      pathname: `/blog/${slug}`,
      title: locale === "ko" ? "콘텐츠" : "Content",
      description: locale === "ko" ? "콘텐츠를 찾을 수 없습니다." : "Content not found.",
      noIndex: true,
    });
  }

  return createLocalizedMetadata({
    locale,
    pathname: `/blog/${slug}`,
    title: result.data.title,
    description:
      result.data.excerpt || (locale === "ko" ? "공개 콘텐츠 상세" : "Public content detail"),
  });
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { locale, slug } = await params;

  if (!isAppLocale(locale)) {
    notFound();
  }

  const result = await getSanityPublicContentBySlug(slug);

  if (!result.ok) {
    notFound();
  }

  const item = result.data;
  const typedLocale = locale as AppLocale;

  return (
    <main className="flex w-full flex-col gap-6 px-4 py-8 tablet:px-6 laptop:px-8 desktop:px-12">
      <div>
        <Link
          href={localizePathname("/blog", typedLocale)}
          className="text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          {locale === "ko" ? "콘텐츠 목록으로" : "Back to content list"}
        </Link>
      </div>

      <Card>
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{item.type}</Badge>
            <span className="text-xs text-muted-foreground">
              {new Date(item.publishedAt).toLocaleString()}
            </span>
          </div>
          <CardTitle className="text-3xl tracking-tight">{item.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="max-w-3xl leading-7 text-muted-foreground">
            {item.excerpt || (locale === "ko" ? "요약이 없습니다." : "No excerpt provided.")}
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
