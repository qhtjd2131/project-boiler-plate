"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createAuthProvider } from "@/lib/auth/create-auth-provider";
import type { OAuthProvider } from "@/lib/auth/types";
import { localizePathname, type AppLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

type SignInFormProps = {
  locale: AppLocale;
};

const authProvider = createAuthProvider();

function resolveNextPath(nextValue: string | null, locale: AppLocale): string {
  if (!nextValue || !nextValue.startsWith("/") || nextValue.startsWith("//")) {
    return localizePathname("/app", locale);
  }

  return nextValue;
}

export function SignInForm({ locale }: SignInFormProps) {
  const messages = getMessages(locale);
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submittingAction, setSubmittingAction] = useState<"password" | OAuthProvider | null>(null);

  const nextPath = resolveNextPath(searchParams.get("next"), locale);
  const isSubmitting = submittingAction !== null;

  async function handlePasswordSignIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittingAction("password");
    setError(null);

    const result = await authProvider.signInWithPassword(email, password);

    if (!result.ok) {
      setError(result.error.message);
      setSubmittingAction(null);
      return;
    }

    window.location.assign(nextPath);
  }

  async function handleOAuthSignIn(provider: OAuthProvider) {
    setSubmittingAction(provider);
    setError(null);

    const redirectUrl = new URL(localizePathname("/auth/callback", locale), window.location.origin);
    redirectUrl.searchParams.set("next", nextPath);

    const result = await authProvider.signInWithOAuth(provider, redirectUrl.toString());

    if (!result.ok) {
      setError(result.error.message);
      setSubmittingAction(null);
      return;
    }

    window.location.assign(result.data.url);
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{messages.auth.signInTitle}</CardTitle>
        <CardDescription>{messages.auth.signInDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form className="space-y-4" onSubmit={handlePasswordSignIn}>
          <div className="space-y-2">
            <Label htmlFor="email">{messages.auth.emailLabel}</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              disabled={isSubmitting}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={messages.auth.emailPlaceholder}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{messages.auth.passwordLabel}</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              disabled={isSubmitting}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={messages.auth.passwordPlaceholder}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {submittingAction === "password"
              ? messages.auth.signingIn
              : messages.auth.signInWithEmail}
          </Button>
        </form>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">or</span>
          </div>
        </div>

        <div className="grid gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => handleOAuthSignIn("google")}
          >
            {submittingAction === "google"
              ? messages.auth.signingIn
              : messages.auth.signInWithGoogle}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => handleOAuthSignIn("kakao")}
          >
            {submittingAction === "kakao" ? messages.auth.signingIn : messages.auth.signInWithKakao}
          </Button>
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <p className="text-xs text-muted-foreground">
          {messages.auth.redirectPathLabel}: {nextPath}
        </p>

        <div>
          <Button variant="ghost" asChild>
            <Link href={localizePathname("/", locale)}>{messages.common.backToHome}</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
