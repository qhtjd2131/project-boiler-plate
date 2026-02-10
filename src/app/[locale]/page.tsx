import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BoilerplateDashboard } from "@/components/app/boilerplate-dashboard";
import { getMessages } from "@/lib/i18n/messages";
import { isAppLocale, type AppLocale } from "@/lib/i18n/config";
import { createLocalizedMetadata } from "@/lib/seo/localized-metadata";

type LocalePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isAppLocale(locale)) {
    return {};
  }

  const messages = getMessages(locale);

  return createLocalizedMetadata({
    locale,
    pathname: "/",
    title: `External Delivery Boilerplate | ${messages.common.dashboard}`,
    description: messages.dashboard.heroDescription,
  });
}

export default async function LocalizedHomePage({ params }: LocalePageProps) {
  const { locale } = await params;

  if (!isAppLocale(locale)) {
    notFound();
  }

  const typedLocale = locale as AppLocale;

  return <BoilerplateDashboard locale={typedLocale} messages={getMessages(typedLocale)} />;
}
