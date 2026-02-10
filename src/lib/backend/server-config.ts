import "server-only";

import type { DataSource } from "@/lib/contracts/result";
import { getPublicBackendFlags, getPublicEnv } from "@/lib/env/public";
import { getServerEnv } from "@/lib/env/server";
import type { BackendName, BackendStatus } from "@/lib/backend/types";

export function getBackendStatus(): BackendStatus {
  const publicEnv = getPublicEnv();
  const serverEnv = getServerEnv();
  const flags = getPublicBackendFlags();

  const configured = {
    supabase: Boolean(
      publicEnv.NEXT_PUBLIC_SUPABASE_URL && publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    ),
    directus: Boolean(serverEnv.DIRECTUS_URL && serverEnv.DIRECTUS_TOKEN),
  } satisfies Record<BackendName, boolean>;

  const candidates: BackendName[] =
    flags.primaryBackend === "supabase" ? ["supabase", "directus"] : ["directus", "supabase"];

  let activeSource: DataSource = "none";

  for (const source of candidates) {
    const isEnabled = source === "supabase" ? flags.enableSupabase : flags.enableDirectus;
    if (isEnabled && configured[source]) {
      activeSource = source;
      break;
    }
  }

  return {
    primaryBackend: flags.primaryBackend,
    activeSource,
    enabled: {
      supabase: flags.enableSupabase,
      directus: flags.enableDirectus,
    },
    configured,
  };
}
