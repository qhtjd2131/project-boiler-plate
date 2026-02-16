import type { ReactNode } from "react";

import { notFound } from "next/navigation";

import { getEnabledAppLocales, isEnabledAppLocale } from "@/lib/i18n/runtime-config";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return getEnabledAppLocales().map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isEnabledAppLocale(locale)) {
    notFound();
  }

  return children;
}
