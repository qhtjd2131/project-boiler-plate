import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { isAuthModuleEnabled } from "@/lib/auth/runtime-config";
import { canAccessRole, getServerAuthState } from "@/lib/auth/server-auth-state";
import { isAppLocale, localizePathname } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { createLocalizedMetadata } from "@/lib/seo/localized-metadata";

type AppPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: AppPageProps): Promise<Metadata> {
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
    pathname: "/app",
    title: messages.appPage.metaTitle,
    description: messages.appPage.metaDescription,
    noIndex: true,
  });
}

export default async function ProtectedAppPage({ params }: AppPageProps) {
  const { locale } = await params;

  if (!isAppLocale(locale)) {
    notFound();
  }

  if (!isAuthModuleEnabled()) {
    notFound();
  }

  const messages = getMessages(locale);
  const authState = await getServerAuthState();

  return (
    <main className="flex w-full flex-col gap-6 px-4 py-8 tablet:px-6 laptop:px-8 desktop:px-12">
      <Card>
        <CardHeader>
          <CardTitle>{messages.appPage.title}</CardTitle>
          <CardDescription>{messages.appPage.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm">
            {messages.appPage.authStatusLabel}: <strong>{String(authState.isAuthenticated)}</strong>
          </p>
          <p className="text-sm">
            {messages.appPage.roleLabel}: <Badge variant="outline">{authState.role}</Badge>
          </p>
          <p className="text-sm text-muted-foreground">User ID: {authState.userId ?? "-"}</p>
          <p className="text-sm text-muted-foreground">
            {messages.appPage.profileStatusLabel}: {authState.profileStatus}
          </p>

          <p className="text-sm text-muted-foreground">
            {messages.appPage.hasAdminLabel}: {String(canAccessRole(authState.role, "admin"))}
          </p>

          <Button asChild>
            <Link href={localizePathname("/", locale)}>{messages.appPage.goDashboard}</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
