import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_ENABLE_SUPABASE: z.enum(["true", "false"]).default("false"),
  NEXT_PUBLIC_ENABLE_SANITY: z.enum(["true", "false"]).default("false"),
  NEXT_PUBLIC_ENABLE_AUTH: z.enum(["true", "false"]).default("true"),
  NEXT_PUBLIC_ENABLE_GA: z.enum(["true", "false"]).default("false"),
  NEXT_PUBLIC_SITE_URL: z.string().default("http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_PROJECT_ID: z.string().default(""),
  NEXT_PUBLIC_SUPABASE_URL: z.string().default(""),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().default(""),
  NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().default(""),
  NEXT_PUBLIC_SANITY_DATASET: z.string().default("production"),
  NEXT_PUBLIC_SANITY_API_VERSION: z.string().default("2026-02-16"),
  NEXT_PUBLIC_SANITY_STUDIO_PATH: z.string().default("/admin"),
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().default(""),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;

export type PublicBackendFlags = {
  enableSupabase: boolean;
  enableSanity: boolean;
};

export type PublicAnalyticsFlags = {
  enableGa: boolean;
  gaMeasurementId: string;
};

let cachedPublicEnv: PublicEnv | null = null;

export function getPublicEnv(): PublicEnv {
  if (cachedPublicEnv) {
    return cachedPublicEnv;
  }

  cachedPublicEnv = publicEnvSchema.parse({
    NEXT_PUBLIC_ENABLE_SUPABASE: process.env.NEXT_PUBLIC_ENABLE_SUPABASE,
    NEXT_PUBLIC_ENABLE_SANITY: process.env.NEXT_PUBLIC_ENABLE_SANITY,
    NEXT_PUBLIC_ENABLE_AUTH: process.env.NEXT_PUBLIC_ENABLE_AUTH,
    NEXT_PUBLIC_ENABLE_GA: process.env.NEXT_PUBLIC_ENABLE_GA,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SUPABASE_PROJECT_ID: process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
    NEXT_PUBLIC_SANITY_API_VERSION: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
    NEXT_PUBLIC_SANITY_STUDIO_PATH: process.env.NEXT_PUBLIC_SANITY_STUDIO_PATH,
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  });

  return cachedPublicEnv;
}

export function getSupabasePublicKey(env: PublicEnv = getPublicEnv()): string {
  return env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
}

export function getPublicBackendFlags(): PublicBackendFlags {
  const env = getPublicEnv();

  return {
    enableSupabase: env.NEXT_PUBLIC_ENABLE_SUPABASE === "true",
    enableSanity: env.NEXT_PUBLIC_ENABLE_SANITY === "true",
  };
}

export function getPublicAnalyticsFlags(): PublicAnalyticsFlags {
  const env = getPublicEnv();

  return {
    enableGa: env.NEXT_PUBLIC_ENABLE_GA === "true",
    gaMeasurementId: env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  };
}
