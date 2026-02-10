"use client";

import type { AuthProvider } from "@/lib/auth/types";
import { SupabaseAuthProvider } from "@/lib/auth/supabase-auth-provider";

export function createAuthProvider(): AuthProvider {
  return new SupabaseAuthProvider();
}
