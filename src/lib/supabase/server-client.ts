import "server-only";

import { createClient } from "@supabase/supabase-js";

import { getPublicEnv } from "@/lib/env/public";
import { getServerEnv } from "@/lib/env/server";

export function getSupabaseServerClient() {
  const publicEnv = getPublicEnv();
  const serverEnv = getServerEnv();

  const supabaseUrl = publicEnv.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    serverEnv.SUPABASE_SERVICE_ROLE_KEY || publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
