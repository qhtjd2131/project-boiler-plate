"use client";

import { useQuery, type QueryFunctionContext } from "@tanstack/react-query";
import { truncate } from "lodash-es";
import { Database, FileStack } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import type { PublicContentItem } from "@/lib/backend/public-content";
import type { BackendStatus } from "@/lib/backend/types";
import type { AppResult } from "@/lib/contracts/result";
import type { AppLocale } from "@/lib/i18n/config";
import type { AppMessages } from "@/lib/i18n/messages";

type QueryKey = readonly ["backend-status"] | readonly ["public-content"];

async function fetchResult<T>(context: QueryFunctionContext<QueryKey>): Promise<T> {
  const response = await fetch(getEndpoint(context.queryKey), {
    cache: "no-store",
  });

  const payload = (await response.json()) as AppResult<T>;

  if (!payload.ok) {
    throw new Error(payload.error.message);
  }

  return payload.data;
}

function getEndpoint(queryKey: QueryKey): string {
  if (queryKey[0] === "backend-status") {
    return "/api/backends/status";
  }

  return "/api/content/public-items";
}

type BoilerplateDashboardProps = {
  locale: AppLocale;
  messages: AppMessages;
};

export function BoilerplateDashboard({ locale, messages }: BoilerplateDashboardProps) {
  const statusQuery = useQuery({
    queryKey: ["backend-status"] as const,
    queryFn: fetchResult<BackendStatus>,
  });

  const sanityReady = statusQuery.data?.contentSource === "sanity";
  const sanityDisabled = statusQuery.data ? !statusQuery.data.enabled.sanity : false;

  const publicContentQuery = useQuery({
    queryKey: ["public-content"] as const,
    queryFn: fetchResult<PublicContentItem[]>,
    enabled: sanityReady,
  });

  return (
    <main className="flex w-full flex-col gap-8 px-4 py-8 tablet:px-6 tablet:py-10 laptop:px-8 desktop:px-12">
      <header className="rounded-2xl border border-border/80 bg-gradient-to-br from-zinc-50 to-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline">External Delivery Boilerplate</Badge>
          <Badge variant="secondary">Next.js + shadcn/ui</Badge>
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-balance tablet:text-4xl desktop:text-5xl">
          {messages.dashboard.heroTitle}
        </h1>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-muted-foreground tablet:text-base">
          {messages.dashboard.heroDescription}
        </p>
      </header>

      <Card className="border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="size-4" />
            {messages.dashboard.statusTitle}
          </CardTitle>
          <CardDescription>{messages.dashboard.statusDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {statusQuery.isLoading ? <p className="text-sm">Loading backend status...</p> : null}
          {statusQuery.error ? (
            <p className="text-sm text-destructive">{statusQuery.error.message}</p>
          ) : null}
          {statusQuery.data ? (
            <>
              <div className="flex items-center justify-between rounded-lg border border-dashed p-3">
                <span className="text-sm font-medium">Supabase enabled</span>
                <Switch checked={statusQuery.data.enabled.supabase} disabled />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-dashed p-3">
                <span className="text-sm font-medium">Sanity enabled</span>
                <Switch checked={statusQuery.data.enabled.sanity} disabled />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-dashed p-3">
                <span className="text-sm font-medium">Auth enabled</span>
                <Switch checked={statusQuery.data.enabled.auth} disabled />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-dashed p-3">
                <span className="text-sm font-medium">i18n enabled</span>
                <Switch checked={statusQuery.data.enabled.i18n} disabled />
              </div>
              <Separator />
              <div className="space-y-2 text-sm">
                <p>
                  Operational source: <strong>{statusQuery.data.operationalSource}</strong>
                </p>
                <p>
                  Content source: <strong>{statusQuery.data.contentSource}</strong>
                </p>
                <p className="text-muted-foreground">
                  Supabase configured: {String(statusQuery.data.configured.supabase)}
                </p>
                <p className="text-muted-foreground">
                  Sanity configured: {String(statusQuery.data.configured.sanity)}
                </p>
                <p className="text-muted-foreground">
                  Auth configured: {String(statusQuery.data.configured.auth)}
                </p>
                <p className="text-muted-foreground">
                  i18n configured: {String(statusQuery.data.configured.i18n)}
                </p>
              </div>
            </>
          ) : null}
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            Supabase handles operational data, and Sanity is reserved for public content management.
          </p>
        </CardFooter>
      </Card>

      <Card className="border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileStack className="size-4" />
            {messages.dashboard.sanityPublicContentTitle}
          </CardTitle>
          <CardDescription>{messages.dashboard.sanityPublicContentDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!statusQuery.isLoading && !sanityReady ? (
            <p className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              {sanityDisabled
                ? messages.dashboard.sanityDisabledNotice
                : messages.dashboard.sanityNotConfiguredNotice}
            </p>
          ) : null}

          {sanityReady && publicContentQuery.isLoading ? (
            <p className="text-sm">{messages.dashboard.sanityLoading}</p>
          ) : null}
          {sanityReady && publicContentQuery.error ? (
            <p className="text-sm text-destructive">{publicContentQuery.error.message}</p>
          ) : null}

          {sanityReady && (publicContentQuery.data ?? []).length === 0 ? (
            <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
              {messages.dashboard.sanityEmpty}
            </p>
          ) : null}

          {sanityReady &&
            (publicContentQuery.data ?? []).map((item) => (
              <article key={item.id} className="rounded-xl border bg-card p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-medium">{item.title}</h3>
                  <Badge variant="outline">{item.type}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {truncate(item.excerpt, {
                    length: 160,
                  }) || "-"}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {messages.dashboard.sanityPublishedPrefix}{" "}
                  {new Date(item.publishedAt).toLocaleString(locale)}
                </p>
              </article>
            ))}
        </CardContent>
      </Card>
    </main>
  );
}
