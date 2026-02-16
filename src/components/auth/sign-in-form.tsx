"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validatePasswordPolicy } from "@/lib/auth/password-policy";
import { createAuthProvider } from "@/lib/auth/create-auth-provider";
import type { OAuthProvider } from "@/lib/auth/types";
import { localizePathname, type AppLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

type AuthMode = "sign-in" | "sign-up";

type SignInFormProps = {
  locale: AppLocale;
  defaultMode?: AuthMode;
};

const authProvider = createAuthProvider();

const MAX_PASSWORD_ATTEMPTS = 5;
const PASSWORD_ATTEMPT_COOLDOWN_MS = 30_000;

function resolveNextPath(nextValue: string | null, locale: AppLocale): string {
  if (!nextValue || !nextValue.startsWith("/") || nextValue.startsWith("//")) {
    return localizePathname("/app", locale);
  }

  return nextValue;
}

function resolveMode(modeValue: string | null, fallback: AuthMode): AuthMode {
  if (modeValue === "sign-up") {
    return "sign-up";
  }

  if (modeValue === "sign-in") {
    return "sign-in";
  }

  return fallback;
}

function toOAuthActionLabel(
  mode: AuthMode,
  provider: OAuthProvider,
  messages: ReturnType<typeof getMessages>,
) {
  if (provider === "google") {
    return mode === "sign-up" ? messages.auth.signUpWithGoogle : messages.auth.signInWithGoogle;
  }

  return mode === "sign-up" ? messages.auth.signUpWithKakao : messages.auth.signInWithKakao;
}

export function SignInForm({ locale, defaultMode = "sign-in" }: SignInFormProps) {
  const messages = getMessages(locale);
  const searchParams = useSearchParams();
  const [modeOverride, setModeOverride] = useState<AuthMode | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submittingAction, setSubmittingAction] = useState<
    "password-sign-in" | "password-sign-up" | OAuthProvider | null
  >(null);
  const [failedPasswordAttempts, setFailedPasswordAttempts] = useState(0);
  const [isCooldownActive, setIsCooldownActive] = useState(false);
  const cooldownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestedMode = resolveMode(searchParams.get("mode"), defaultMode);
  const mode = modeOverride ?? requestedMode;

  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) {
        clearTimeout(cooldownTimerRef.current);
      }
    };
  }, []);

  const nextPath = resolveNextPath(searchParams.get("next"), locale);
  const isSubmitting = submittingAction !== null;
  const passwordPolicy = useMemo(() => validatePasswordPolicy(password), [password]);

  function resetFeedback() {
    setError(null);
    setMessage(null);
  }

  function getRateLimitMessage(): string {
    const seconds = Math.ceil(PASSWORD_ATTEMPT_COOLDOWN_MS / 1000);
    return messages.auth.tooManyAttempts.replace("{seconds}", String(seconds));
  }

  function isPasswordSignInRateLimited(): boolean {
    return isCooldownActive;
  }

  function registerFailedPasswordAttempt() {
    const nextAttempt = failedPasswordAttempts + 1;
    setFailedPasswordAttempts(nextAttempt);

    if (nextAttempt >= MAX_PASSWORD_ATTEMPTS) {
      setIsCooldownActive(true);
      setFailedPasswordAttempts(0);

      if (cooldownTimerRef.current) {
        clearTimeout(cooldownTimerRef.current);
      }

      cooldownTimerRef.current = setTimeout(() => {
        setIsCooldownActive(false);
        cooldownTimerRef.current = null;
      }, PASSWORD_ATTEMPT_COOLDOWN_MS);
    }
  }

  function clearPasswordAttemptState() {
    setFailedPasswordAttempts(0);
    setIsCooldownActive(false);

    if (cooldownTimerRef.current) {
      clearTimeout(cooldownTimerRef.current);
      cooldownTimerRef.current = null;
    }
  }

  async function handlePasswordSignIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    resetFeedback();

    if (isPasswordSignInRateLimited()) {
      setError(getRateLimitMessage());
      return;
    }

    setSubmittingAction("password-sign-in");

    const result = await authProvider.signInWithPassword(email, password);

    if (!result.ok) {
      registerFailedPasswordAttempt();
      if (result.error.code === "UNAUTHORIZED") {
        setError(messages.auth.invalidCredentials);
      } else {
        setError(result.error.message);
      }
      setSubmittingAction(null);
      return;
    }

    clearPasswordAttemptState();
    window.location.assign(nextPath);
  }

  async function handlePasswordSignUp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    resetFeedback();

    if (password !== confirmPassword) {
      setError(messages.auth.passwordMismatch);
      return;
    }

    if (!passwordPolicy.valid) {
      setError(messages.auth.passwordPolicyError);
      return;
    }

    setSubmittingAction("password-sign-up");

    const result = await authProvider.signUpWithPassword(email, password);

    if (!result.ok) {
      if (result.error.code === "CONFLICT") {
        setError(messages.auth.accountExists);
      } else if (result.error.code === "VALIDATION") {
        setError(messages.auth.passwordPolicyError);
      } else {
        setError(result.error.message);
      }

      setSubmittingAction(null);
      return;
    }

    clearPasswordAttemptState();

    if (result.data.requiresEmailConfirmation) {
      setMessage(messages.auth.signUpVerificationSent);
      setSubmittingAction(null);
      return;
    }

    window.location.assign(nextPath);
  }

  async function handleOAuthSignIn(provider: OAuthProvider) {
    resetFeedback();
    setSubmittingAction(provider);

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

  const modeTitle = mode === "sign-up" ? messages.auth.signUpTitle : messages.auth.signInTitle;
  const modeDescription =
    mode === "sign-up" ? messages.auth.signUpDescription : messages.auth.signInDescription;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted p-1">
          <Button
            type="button"
            variant={mode === "sign-in" ? "default" : "ghost"}
            size="sm"
            onClick={() => {
              setModeOverride("sign-in");
              resetFeedback();
            }}
          >
            {messages.auth.modeSignIn}
          </Button>
          <Button
            type="button"
            variant={mode === "sign-up" ? "default" : "ghost"}
            size="sm"
            onClick={() => {
              setModeOverride("sign-up");
              resetFeedback();
            }}
          >
            {messages.auth.modeSignUp}
          </Button>
        </div>
        <CardTitle className="mt-4">{modeTitle}</CardTitle>
        <CardDescription>{modeDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form
          className="space-y-4"
          onSubmit={mode === "sign-up" ? handlePasswordSignUp : handlePasswordSignIn}
        >
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
              autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
              required
              disabled={isSubmitting}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={messages.auth.passwordPlaceholder}
            />
          </div>

          {mode === "sign-up" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{messages.auth.confirmPasswordLabel}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  disabled={isSubmitting}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder={messages.auth.confirmPasswordPlaceholder}
                />
              </div>

              <div className="rounded-md border border-dashed p-3 text-xs text-muted-foreground">
                <p className="mb-2 font-medium text-foreground">
                  {messages.auth.passwordPolicyTitle}
                </p>
                <ul className="space-y-1">
                  {messages.auth.passwordPolicyItems.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>
            </>
          ) : null}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {mode === "sign-up"
              ? submittingAction === "password-sign-up"
                ? messages.auth.signingUp
                : messages.auth.signUpWithEmail
              : submittingAction === "password-sign-in"
                ? messages.auth.signingIn
                : messages.auth.signInWithEmail}
          </Button>
        </form>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">{messages.auth.orLabel}</span>
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
              ? mode === "sign-up"
                ? messages.auth.signingUp
                : messages.auth.signingIn
              : toOAuthActionLabel(mode, "google", messages)}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => handleOAuthSignIn("kakao")}
          >
            {submittingAction === "kakao"
              ? mode === "sign-up"
                ? messages.auth.signingUp
                : messages.auth.signingIn
              : toOAuthActionLabel(mode, "kakao", messages)}
          </Button>
        </div>

        {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <p className="text-xs text-muted-foreground">
          {messages.auth.redirectPathLabel}: {nextPath}
        </p>

        <div className="flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link href={localizePathname("/", locale)}>{messages.common.backToHome}</Link>
          </Button>

          <Button
            variant="link"
            type="button"
            className="h-auto px-0"
            onClick={() => {
              setModeOverride(mode === "sign-up" ? "sign-in" : "sign-up");
              resetFeedback();
            }}
          >
            {mode === "sign-up" ? messages.auth.switchToSignIn : messages.auth.switchToSignUp}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
