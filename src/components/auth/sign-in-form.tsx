"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createAuthProvider } from "@/lib/auth/create-auth-provider";
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
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const nextPath = resolveNextPath(searchParams.get("next"), locale);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);

    const redirectUrl = new URL(localizePathname("/auth/callback", locale), window.location.origin);
    redirectUrl.searchParams.set("next", nextPath);

    const result = await authProvider.signInWithOtp(email, redirectUrl.toString());

    if (!result.ok) {
      setError(result.error.message);
      setSubmitting(false);
      return;
    }

    setMessage(messages.auth.magicLinkSent);
    setSubmitting(false);
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{messages.auth.signInTitle}</CardTitle>
        <CardDescription>{messages.auth.signInDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@client.com"
            />
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? messages.auth.sending : messages.auth.sendMagicLink}
          </Button>
        </form>

        {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
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
