import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { listSanityPublicContent } from "@/lib/backend/sanity-content-repository";
import { isAppLocale, localizePathname, type AppLocale } from "@/lib/i18n/config";
import { createLocalizedMetadata } from "@/lib/seo/localized-metadata";

type BlogListPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: BlogListPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isAppLocale(locale)) {
    return {};
  }

  return createLocalizedMetadata({
    locale,
    pathname: "/blog",
    title: locale === "ko" ? "콘텐츠" : "Content",
    description:
      locale === "ko"
        ? "Sanity에서 운영되는 공개 콘텐츠 목록입니다."
        : "Public content list managed in Sanity.",
  });
}

export default async function BlogListPage({ params }: BlogListPageProps) {
  const { locale } = await params;

  if (!isAppLocale(locale)) {
    notFound();
  }

  const result = await listSanityPublicContent();
  const items = result.ok ? result.data : [];
  const typedLocale = locale as AppLocale;

  return (
    <main className="flex w-full flex-col gap-6 px-4 py-8 tablet:px-6 laptop:px-8 desktop:px-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          {locale === "ko" ? "공개 콘텐츠" : "Public Content"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {locale === "ko"
            ? "Sanity CMS에서 관리하는 게시물을 미리 확인합니다."
            : "Preview posts managed by Sanity CMS."}
        </p>
      </header>

      {!result.ok ? (
        <Card>
          <CardHeader>
            <CardTitle>{locale === "ko" ? "연결 상태" : "Connection status"}</CardTitle>
            <CardDescription>{result.error.message}</CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      <section className="grid gap-4 laptop:grid-cols-2 desktop:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <Badge variant="outline">{item.type}</Badge>
                <span className="text-xs text-muted-foreground">
                  {new Date(item.publishedAt).toLocaleDateString()}
                </span>
              </div>
              <CardTitle className="text-xl">
                <Link href={localizePathname(`/blog/${item.slug}`, typedLocale)}>{item.title}</Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{item.excerpt || "-"}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}
