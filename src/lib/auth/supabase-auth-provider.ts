"use client";

import type { AuthProvider, OAuthProvider, PasswordSignUpResult } from "@/lib/auth/types";
import { validatePasswordPolicy } from "@/lib/auth/password-policy";
import { getErrorMessage, resultErr, resultOk, type AppResult } from "@/lib/contracts/result";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";

export class SupabaseAuthProvider implements AuthProvider {
  async getSession(): Promise<AppResult<{ userId: string; email: string | null } | null>> {
    try {
      const client = getSupabaseBrowserClient();
      const { data, error } = await client.auth.getUser();

      if (error) {
        return resultErr("UNAUTHORIZED", "Unable to read auth session", error.message);
      }

      if (!data.user) {
        return resultOk(null, "supabase");
      }

      return resultOk(
        {
          userId: data.user.id,
          email: data.user.email ?? null,
        },
        "supabase",
      );
    } catch (error) {
      return resultErr(
        "INTERNAL",
        "Failed to resolve Supabase auth session",
        getErrorMessage(error),
      );
    }
  }

  async signUpWithPassword(
    email: string,
    password: string,
  ): Promise<AppResult<PasswordSignUpResult>> {
    const policy = validatePasswordPolicy(password);

    if (!policy.valid) {
      return resultErr(
        "VALIDATION",
        "Password does not meet security policy",
        policy.errors.join("; "),
      );
    }

    try {
      const client = getSupabaseBrowserClient();
      const { data, error } = await client.auth.signUp({
        email,
        password,
      });

      if (error) {
        const normalizedError = error.message.toLowerCase();

        if (normalizedError.includes("already") || normalizedError.includes("registered")) {
          return resultErr("CONFLICT", "An account with this email already exists");
        }

        return resultErr("UNAUTHORIZED", "Unable to create account with email and password");
      }

      return resultOk(
        {
          requiresEmailConfirmation: !data.session,
        },
        "supabase",
      );
    } catch (error) {
      return resultErr("INTERNAL", "Supabase sign-up failed", getErrorMessage(error));
    }
  }

  async signInWithPassword(email: string, password: string): Promise<AppResult<null>> {
    try {
      const client = getSupabaseBrowserClient();
      const { error } = await client.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return resultErr("UNAUTHORIZED", "Invalid email or password");
      }

      return resultOk(null, "supabase");
    } catch (error) {
      return resultErr("INTERNAL", "Supabase password sign-in failed", getErrorMessage(error));
    }
  }

  async signInWithOAuth(
    provider: OAuthProvider,
    redirectTo: string,
  ): Promise<AppResult<{ url: string }>> {
    try {
      const client = getSupabaseBrowserClient();
      const { data, error } = await client.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        return resultErr("UNAUTHORIZED", `Unable to sign in with ${provider}`, error.message);
      }

      if (!data.url) {
        return resultErr("INTERNAL", "Supabase OAuth did not return a redirect URL");
      }

      return resultOk({ url: data.url }, "supabase");
    } catch (error) {
      return resultErr(
        "INTERNAL",
        `Supabase OAuth sign-in failed for ${provider}`,
        getErrorMessage(error),
      );
    }
  }

  async signOut(): Promise<AppResult<null>> {
    try {
      const client = getSupabaseBrowserClient();
      const { error } = await client.auth.signOut();

      if (error) {
        return resultErr("UNAUTHORIZED", "Unable to sign out", error.message);
      }

      return resultOk(null, "supabase");
    } catch (error) {
      return resultErr("INTERNAL", "Supabase sign out failed", getErrorMessage(error));
    }
  }
}
