"use client";

import type { AuthProvider } from "@/lib/auth/types";
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

  async signInWithOtp(email: string, emailRedirectTo?: string): Promise<AppResult<null>> {
    try {
      const client = getSupabaseBrowserClient();
      const { error } = await client.auth.signInWithOtp({
        email,
        options: emailRedirectTo
          ? {
              emailRedirectTo,
            }
          : undefined,
      });

      if (error) {
        return resultErr("UNAUTHORIZED", "Unable to start OTP sign-in flow", error.message);
      }

      return resultOk(null, "supabase");
    } catch (error) {
      return resultErr("INTERNAL", "Supabase OTP request failed", getErrorMessage(error));
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
