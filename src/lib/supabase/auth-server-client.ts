import "server-only";

import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

import { getPublicEnv, getSupabasePublicKey } from "@/lib/env/public";

export async function getSupabaseAuthServerClient(): Promise<SupabaseClient | null> {
  const publicEnv = getPublicEnv();
  const supabaseUrl = publicEnv.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublicKey = getSupabasePublicKey(publicEnv);

  if (!supabaseUrl || !supabasePublicKey) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabasePublicKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          try {
            cookieStore.set(name, value, options);
          } catch {
            continue;
          }
        }
      },
    },
  });
}
