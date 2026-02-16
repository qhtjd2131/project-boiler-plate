import { getPublicBackendFlags, getPublicEnv, getSupabasePublicKey } from "@/lib/env/public";

export type AuthRuntimeConfig = {
  enabled: boolean;
  configured: boolean;
  ready: boolean;
};

export function getAuthRuntimeConfig(): AuthRuntimeConfig {
  const env = getPublicEnv();
  const backendFlags = getPublicBackendFlags();

  const enabled = env.NEXT_PUBLIC_ENABLE_AUTH === "true" && backendFlags.enableSupabase;
  const configured = Boolean(
    env.NEXT_PUBLIC_SUPABASE_PROJECT_ID &&
    env.NEXT_PUBLIC_SUPABASE_URL &&
    getSupabasePublicKey(env),
  );

  return {
    enabled,
    configured,
    ready: enabled && configured,
  };
}

export function isAuthModuleEnabled(): boolean {
  return getAuthRuntimeConfig().enabled;
}
