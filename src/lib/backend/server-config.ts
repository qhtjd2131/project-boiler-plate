import "server-only";

import type { DataSource } from "@/lib/contracts/result";
import { getPublicBackendFlags, getPublicEnv } from "@/lib/env/public";

import type { BackendStatus } from "@/lib/backend/types";

export function getBackendStatus(): BackendStatus {
  const publicEnv = getPublicEnv();
  const flags = getPublicBackendFlags();

  const configured = {
    supabase: Boolean(
      publicEnv.NEXT_PUBLIC_SUPABASE_URL && publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    ),
    sanity: Boolean(
      publicEnv.NEXT_PUBLIC_SANITY_PROJECT_ID &&
      publicEnv.NEXT_PUBLIC_SANITY_DATASET &&
      publicEnv.NEXT_PUBLIC_SANITY_API_VERSION,
    ),
  };

  const operationalSource: DataSource =
    flags.enableSupabase && configured.supabase ? "supabase" : "none";

  const contentSource: DataSource = flags.enableSanity && configured.sanity ? "sanity" : "none";

  return {
    operationalSource,
    contentSource,
    enabled: {
      supabase: flags.enableSupabase,
      sanity: flags.enableSanity,
    },
    configured,
  };
}
