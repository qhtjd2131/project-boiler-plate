import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";

import { SignInForm } from "@/components/auth/sign-in-form";
import { isAppLocale, type AppLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { createLocalizedMetadata } from "@/lib/seo/localized-metadata";

type SignInPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: SignInPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isAppLocale(locale)) {
    return {};
  }

  const messages = getMessages(locale);

  return createLocalizedMetadata({
    locale,
    pathname: "/auth/sign-in",
    title: messages.auth.signInTitle,
    description: messages.auth.signInDescription,
    noIndex: true,
  });
}

export default async function LocalizedSignInPage({ params }: SignInPageProps) {
  const { locale } = await params;

  if (!isAppLocale(locale)) {
    notFound();
  }

  return (
    <main className="flex w-full flex-col items-center px-4 py-12 tablet:px-6 laptop:px-8 desktop:px-12">
      <Suspense fallback={null}>
        <SignInForm locale={locale as AppLocale} />
      </Suspense>
    </main>
  );
}
