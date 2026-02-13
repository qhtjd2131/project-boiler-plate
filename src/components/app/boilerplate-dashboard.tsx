"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryFunctionContext,
} from "@tanstack/react-query";
import { kebabCase, truncate } from "lodash-es";
import { Database, FileStack, Sparkles } from "lucide-react";
import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  createProjectBriefSchema,
  type ProjectBrief,
  type CreateProjectBriefInput,
} from "@/lib/backend/project-brief";
import type { PublicContentItem } from "@/lib/backend/public-content";
import type { BackendStatus } from "@/lib/backend/types";
import type { AppResult } from "@/lib/contracts/result";
import type { AppLocale } from "@/lib/i18n/config";
import type { AppMessages } from "@/lib/i18n/messages";

type QueryKey =
  | readonly ["backend-status"]
  | readonly ["project-briefs"]
  | readonly ["public-content"];

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

  if (queryKey[0] === "public-content") {
    return "/api/content/public-items";
  }

  return "/api/backends/briefs";
}

type BoilerplateDashboardProps = {
  locale: AppLocale;
  messages: AppMessages;
};

export function BoilerplateDashboard({ locale, messages }: BoilerplateDashboardProps) {
  const queryClient = useQueryClient();
  const form = useForm<CreateProjectBriefInput>({
    resolver: zodResolver(createProjectBriefSchema),
    defaultValues: {
      title: "",
      summary: "",
    },
  });

  const statusQuery = useQuery({
    queryKey: ["backend-status"] as const,
    queryFn: fetchResult<BackendStatus>,
  });

  const briefsQuery = useQuery({
    queryKey: ["project-briefs"] as const,
    queryFn: fetchResult<ProjectBrief[]>,
  });

  const publicContentQuery = useQuery({
    queryKey: ["public-content"] as const,
    queryFn: fetchResult<PublicContentItem[]>,
  });

  const submitBrief = useMutation({
    mutationFn: async (values: CreateProjectBriefInput) => {
      const response = await fetch("/api/backends/briefs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const payload = (await response.json()) as AppResult<ProjectBrief>;

      if (!payload.ok) {
        throw new Error(payload.error.message);
      }

      return payload.data;
    },
    onSuccess: async () => {
      form.reset();
      await queryClient.invalidateQueries({ queryKey: ["project-briefs"] });
    },
  });

  const title = useWatch({
    control: form.control,
    name: "title",
  });
  const slugPreview = useMemo(() => kebabCase(title || "project-brief"), [title]);

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

      <section className="grid w-full gap-6 laptop:grid-cols-[1.25fr_1fr]">
        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-4" />
              {messages.dashboard.newBriefTitle}
            </CardTitle>
            <CardDescription>{messages.dashboard.newBriefDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-5"
              onSubmit={form.handleSubmit(async (values) => {
                await submitBrief.mutateAsync(values);
              })}
            >
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder={
                    locale === "ko"
                      ? "이커머스 클라이언트 랜딩 페이지 개편"
                      : "Landing page revamp for ecommerce client"
                  }
                  {...form.register("title")}
                />
                <p className="text-xs text-muted-foreground">Slug preview: {slugPreview}</p>
                <p className="text-xs text-destructive">{form.formState.errors.title?.message}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Summary</Label>
                <Textarea
                  id="summary"
                  rows={6}
                  placeholder={
                    locale === "ko"
                      ? "프로젝트 목표, 대상 사용자, 일정, 성공 기준을 작성하세요."
                      : "Define goal, audience, timeline, and success criteria for the project."
                  }
                  {...form.register("summary")}
                />
                <p className="text-xs text-destructive">{form.formState.errors.summary?.message}</p>
              </div>

              <Button type="submit" disabled={submitBrief.isPending}>
                {submitBrief.isPending ? "Saving..." : "Save Brief"}
              </Button>

              {submitBrief.error ? (
                <p className="text-sm text-destructive">{submitBrief.error.message}</p>
              ) : null}
            </form>
          </CardContent>
        </Card>

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
                </div>
              </>
            ) : null}
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              Supabase handles operational data, and Sanity is reserved for public content
              management.
            </p>
          </CardFooter>
        </Card>
      </section>

      <Card className="border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileStack className="size-4" />
            {messages.dashboard.recentTitle}
          </CardTitle>
          <CardDescription>{messages.dashboard.recentDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {briefsQuery.isLoading ? <p className="text-sm">Loading briefs...</p> : null}
          {briefsQuery.error ? (
            <p className="text-sm text-destructive">{briefsQuery.error.message}</p>
          ) : null}

          {(briefsQuery.data ?? []).length === 0 ? (
            <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
              No briefs yet. Save one from the form above.
            </p>
          ) : null}

          {(briefsQuery.data ?? []).map((brief) => (
            <article key={brief.id} className="rounded-xl border bg-card p-4">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-medium">{brief.title}</h3>
                <Badge variant="outline">{brief.source}</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {truncate(brief.summary, {
                  length: 180,
                })}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Updated {new Date(brief.updatedAt).toLocaleString()}
              </p>
            </article>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileStack className="size-4" />
            {locale === "ko" ? "Sanity 공개 콘텐츠" : "Sanity Public Content"}
          </CardTitle>
          <CardDescription>
            {locale === "ko"
              ? "GROQ 리포지토리 레이어를 통해 공개 콘텐츠를 조회합니다."
              : "Reads public content through the GROQ repository layer."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {publicContentQuery.isLoading ? (
            <p className="text-sm">
              {locale === "ko" ? "콘텐츠 로딩 중..." : "Loading content..."}
            </p>
          ) : null}
          {publicContentQuery.error ? (
            <p className="text-sm text-destructive">{publicContentQuery.error.message}</p>
          ) : null}

          {(publicContentQuery.data ?? []).length === 0 ? (
            <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
              {locale === "ko"
                ? "표시할 공개 콘텐츠가 없습니다. Sanity 문서를 추가해보세요."
                : "No public content found. Add documents in Sanity."}
            </p>
          ) : null}

          {(publicContentQuery.data ?? []).map((item) => (
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
                Published {new Date(item.publishedAt).toLocaleString()}
              </p>
            </article>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
