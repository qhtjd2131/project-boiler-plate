import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { BoilerplateDashboard } from "@/components/app/boilerplate-dashboard";
import { DEFAULT_LOCALE, localizePathname } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { negotiateLocaleFromAcceptLanguage } from "@/lib/i18n/negotiation";
import { isI18nModuleEnabled } from "@/lib/i18n/runtime-config";
import { createLocalizedMetadata } from "@/lib/seo/localized-metadata";

export function generateMetadata(): Metadata {
  const messages = getMessages(DEFAULT_LOCALE);

  return createLocalizedMetadata({
    locale: DEFAULT_LOCALE,
    pathname: "/",
    title: `External Delivery Boilerplate | ${messages.common.dashboard}`,
    description: messages.dashboard.heroDescription,
  });
}

export default async function Home() {
  const headerStore = await headers();
  const locale = negotiateLocaleFromAcceptLanguage(headerStore.get("accept-language"));
  const i18nEnabled = isI18nModuleEnabled();

  if (i18nEnabled && locale !== DEFAULT_LOCALE) {
    redirect(localizePathname("/", locale));
  }

  const messages = getMessages(DEFAULT_LOCALE);

  return <BoilerplateDashboard locale={DEFAULT_LOCALE} messages={messages} />;
}
