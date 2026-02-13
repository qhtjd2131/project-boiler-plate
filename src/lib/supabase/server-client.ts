import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getPublicEnv } from "@/lib/env/public";
import { getServerEnv } from "@/lib/env/server";

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

  const key = serverEnv.SUPABASE_SERVICE_ROLE_KEY || publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!key) {
    return null;
  }

  return createSupabaseServerClient(key);
}

export function getSupabaseWriteServerClient(): SupabaseClient | null {
  const publicEnv = getPublicEnv();
  const serverEnv = getServerEnv();

  if (!publicEnv.NEXT_PUBLIC_SUPABASE_URL || !serverEnv.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }

  return createSupabaseServerClient(serverEnv.SUPABASE_SERVICE_ROLE_KEY);
}
