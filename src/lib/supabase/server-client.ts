import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getPublicEnv, getSupabasePublicKey } from "@/lib/env/public";
import { getServerEnv, getSupabasePrivilegedKey } from "@/lib/env/server";

function createSupabaseServerClient(key: string): SupabaseClient {
  const publicEnv = getPublicEnv();

  return createClient(publicEnv.NEXT_PUBLIC_SUPABASE_URL, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function getSupabaseReadServerClient(): SupabaseClient | null {
  const publicEnv = getPublicEnv();
  const serverEnv = getServerEnv();

  if (!publicEnv.NEXT_PUBLIC_SUPABASE_URL) {
    return null;
  }

  const key = getSupabasePrivilegedKey(serverEnv) || getSupabasePublicKey(publicEnv);

  if (!key) {
    return null;
  }

  return createSupabaseServerClient(key);
}

export function getSupabaseWriteServerClient(): SupabaseClient | null {
  const publicEnv = getPublicEnv();
  const serverEnv = getServerEnv();
  const privilegedKey = getSupabasePrivilegedKey(serverEnv);

  if (!publicEnv.NEXT_PUBLIC_SUPABASE_URL || !privilegedKey) {
    return null;
  }

  return createSupabaseServerClient(privilegedKey);
}
