import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSanityPublicContentBySlug } from "@/lib/backend/sanity-content-repository";
import { isAppLocale, localizePathname, type AppLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { createLocalizedMetadata } from "@/lib/seo/localized-metadata";

type BlogDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!isAppLocale(locale)) {
    return {};
  }

  const messages = getMessages(locale);
  const result = await getSanityPublicContentBySlug(slug);

  if (!result.ok) {
    return createLocalizedMetadata({
      locale,
      pathname: `/blog/${slug}`,
      title: messages.blogDetail.metaFallbackTitle,
      description: messages.blogDetail.metaNotFoundDescription,
      noIndex: true,
    });
  }

  return createLocalizedMetadata({
    locale,
    pathname: `/blog/${slug}`,
    title: result.data.title,
    description: result.data.excerpt || messages.blogDetail.metaFallbackDescription,
  });
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { locale, slug } = await params;

  if (!isAppLocale(locale)) {
    notFound();
  }

  const messages = getMessages(locale);
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
          {messages.blogDetail.backToList}
        </Link>
      </div>

      <Card>
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{item.type}</Badge>
            <span className="text-xs text-muted-foreground">
              {new Date(item.publishedAt).toLocaleString(locale)}
            </span>
          </div>
          <CardTitle className="text-3xl tracking-tight">{item.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="max-w-3xl leading-7 text-muted-foreground">
            {item.excerpt || messages.blogDetail.noExcerpt}
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
