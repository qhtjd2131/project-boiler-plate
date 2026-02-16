import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getBackendStatus } from "@/lib/backend/server-config";
import { isAppLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { createLocalizedMetadata } from "@/lib/seo/localized-metadata";

type StatusPageProps = {
  params: Promise<{ locale: string }>;
};

type ModuleCardInput = {
  name: string;
  enabled: boolean;
  configured: boolean;
};

export async function generateMetadata({ params }: StatusPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isAppLocale(locale)) {
    return {};
  }

  const messages = getMessages(locale);

  return createLocalizedMetadata({
    locale,
    pathname: "/status",
    title: messages.statusPage.metaTitle,
    description: messages.statusPage.metaDescription,
    noIndex: true,
  });
}

export default async function StatusPage({ params }: StatusPageProps) {
  const { locale } = await params;

  if (!isAppLocale(locale)) {
    notFound();
  }

  const messages = getMessages(locale);
  const status = getBackendStatus();

  const modules: ModuleCardInput[] = [
    {
      name: messages.statusPage.moduleSupabase,
      enabled: status.enabled.supabase,
      configured: status.configured.supabase,
    },
    {
      name: messages.statusPage.moduleSanity,
      enabled: status.enabled.sanity,
      configured: status.configured.sanity,
    },
    {
      name: messages.statusPage.moduleAuth,
      enabled: status.enabled.auth,
      configured: status.configured.auth,
    },
    {
      name: messages.statusPage.moduleI18n,
      enabled: status.enabled.i18n,
      configured: status.configured.i18n,
    },
  ];

  return (
    <main className="flex w-full flex-col gap-6 px-4 py-8 tablet:px-6 laptop:px-8 desktop:px-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">{messages.statusPage.title}</h1>
        <p className="text-sm text-muted-foreground">{messages.statusPage.description}</p>
      </header>

      <section className="grid gap-4 tablet:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{messages.statusPage.sourceOperationalLabel}</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline">{status.operationalSource}</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{messages.statusPage.sourceContentLabel}</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline">{status.contentSource}</Badge>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>{messages.statusPage.moduleStatusTitle}</CardTitle>
          <CardDescription>{messages.statusPage.moduleStatusDescription}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 tablet:grid-cols-2">
          {modules.map((module) => (
            <article key={module.name} className="rounded-xl border p-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-medium">{module.name}</h2>
                <Badge variant={module.enabled ? "secondary" : "outline"}>
                  {module.enabled ? messages.statusPage.onState : messages.statusPage.offState}
                </Badge>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                <span>{messages.statusPage.enabledLabel}</span>
                <span>{messages.statusPage.configuredLabel}</span>
                <span>{messages.statusPage.readyLabel}</span>

                <strong>{String(module.enabled)}</strong>
                <strong>{String(module.configured)}</strong>
                <strong>{String(module.enabled && module.configured)}</strong>
              </div>
            </article>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
