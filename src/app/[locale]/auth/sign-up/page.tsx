import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";

import { SignInForm } from "@/components/auth/sign-in-form";
import { isAuthModuleEnabled } from "@/lib/auth/runtime-config";
import { isAppLocale, type AppLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { createLocalizedMetadata } from "@/lib/seo/localized-metadata";

type SignUpPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: SignUpPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isAppLocale(locale)) {
    return {};
  }

  if (!isAuthModuleEnabled()) {
    return {};
  }

  const messages = getMessages(locale);

  return createLocalizedMetadata({
    locale,
    pathname: "/auth/sign-up",
    title: messages.auth.signUpTitle,
    description: messages.auth.signUpDescription,
    noIndex: true,
  });
}

export default async function LocalizedSignUpPage({ params }: SignUpPageProps) {
  const { locale } = await params;

  if (!isAppLocale(locale)) {
    notFound();
  }

  if (!isAuthModuleEnabled()) {
    notFound();
  }

  return (
    <main className="flex w-full flex-col items-center px-4 py-12 tablet:px-6 laptop:px-8 desktop:px-12">
      <Suspense fallback={null}>
        <SignInForm locale={locale as AppLocale} defaultMode="sign-up" />
      </Suspense>
    </main>
  );
}
