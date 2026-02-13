import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { isAppLocale, localizePathname } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { createLocalizedMetadata } from "@/lib/seo/localized-metadata";

type ForbiddenPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: ForbiddenPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isAppLocale(locale)) {
    return {};
  }

  const messages = getMessages(locale);

  return createLocalizedMetadata({
    locale,
    pathname: "/forbidden",
    title: messages.forbiddenPage.metaTitle,
    description: messages.forbiddenPage.metaDescription,
    noIndex: true,
  });
}

export default async function ForbiddenPage({ params }: ForbiddenPageProps) {
  const { locale } = await params;

  if (!isAppLocale(locale)) {
    notFound();
  }

  const messages = getMessages(locale);

  return (
    <main className="flex w-full flex-col items-center px-4 py-12 tablet:px-6 laptop:px-8 desktop:px-12">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>{messages.forbiddenPage.title}</CardTitle>
          <CardDescription>{messages.forbiddenPage.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href={localizePathname("/", locale)}>{messages.common.backToHome}</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
