"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

import { getPublicEnv, getSupabasePublicKey } from "@/lib/env/public";

let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient() {
  if (browserClient) {
    return browserClient;
  }

  const env = getPublicEnv();
  const supabasePublicKey = getSupabasePublicKey(env);

  if (!env.NEXT_PUBLIC_SUPABASE_URL || !supabasePublicKey) {
    throw new Error(
      "Supabase browser client is not configured. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }

  browserClient = createBrowserClient(env.NEXT_PUBLIC_SUPABASE_URL, supabasePublicKey);
  return browserClient;
}
