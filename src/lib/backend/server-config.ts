import "server-only";

import type { DataSource } from "@/lib/contracts/result";
import { getPublicBackendFlags, getPublicEnv, getSupabasePublicKey } from "@/lib/env/public";
import { getServerEnv, getSupabasePrivilegedKey } from "@/lib/env/server";

import type { BackendStatus } from "@/lib/backend/types";

export function getBackendStatus(): BackendStatus {
  const publicEnv = getPublicEnv();
  const serverEnv = getServerEnv();
  const flags = getPublicBackendFlags();
  const authEnabled = publicEnv.NEXT_PUBLIC_ENABLE_AUTH === "true" && flags.enableSupabase;

  const hasSupabaseProjectId = Boolean(publicEnv.NEXT_PUBLIC_SUPABASE_PROJECT_ID);
  const hasSupabaseUrl = Boolean(publicEnv.NEXT_PUBLIC_SUPABASE_URL);
  const hasSupabasePublicKey = Boolean(getSupabasePublicKey(publicEnv));
  const hasSupabaseSecretKey = Boolean(getSupabasePrivilegedKey(serverEnv));

  const configured = {
    supabase: Boolean(
      hasSupabaseProjectId && hasSupabaseUrl && (hasSupabaseSecretKey || hasSupabasePublicKey),
    ),
    sanity: Boolean(
      publicEnv.NEXT_PUBLIC_SANITY_PROJECT_ID &&
      publicEnv.NEXT_PUBLIC_SANITY_DATASET &&
      publicEnv.NEXT_PUBLIC_SANITY_API_VERSION,
    ),
    auth: Boolean(hasSupabaseProjectId && hasSupabaseUrl && hasSupabasePublicKey),
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
      auth: authEnabled,
    },
    configured,
  };
}
