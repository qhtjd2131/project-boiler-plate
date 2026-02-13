import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { listSanityPublicContent } from "@/lib/backend/sanity-content-repository";
import { isAppLocale, localizePathname, type AppLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { createLocalizedMetadata } from "@/lib/seo/localized-metadata";

type BlogListPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: BlogListPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isAppLocale(locale)) {
    return {};
  }

  const messages = getMessages(locale);

  return createLocalizedMetadata({
    locale,
    pathname: "/blog",
    title: messages.blogList.metaTitle,
    description: messages.blogList.metaDescription,
  });
}

export default async function BlogListPage({ params }: BlogListPageProps) {
  const { locale } = await params;

  if (!isAppLocale(locale)) {
    notFound();
  }

  const messages = getMessages(locale);
  const result = await listSanityPublicContent();
  const items = result.ok ? result.data : [];
  const typedLocale = locale as AppLocale;

  return (
    <main className="flex w-full flex-col gap-6 px-4 py-8 tablet:px-6 laptop:px-8 desktop:px-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">{messages.blogList.title}</h1>
        <p className="text-sm text-muted-foreground">{messages.blogList.description}</p>
      </header>

      {!result.ok ? (
        <Card>
          <CardHeader>
            <CardTitle>{messages.blogList.connectionStatusTitle}</CardTitle>
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
                  {new Date(item.publishedAt).toLocaleDateString(locale)}
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
