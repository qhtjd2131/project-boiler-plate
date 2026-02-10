import type { ReactNode } from "react";

import { notFound } from "next/navigation";

import { isAppLocale } from "@/lib/i18n/config";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return [{ locale: "ko" }, { locale: "en" }];
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isAppLocale(locale)) {
    notFound();
  }

  return children;
}
