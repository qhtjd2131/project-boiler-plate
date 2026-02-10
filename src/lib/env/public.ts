import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_ENABLE_SUPABASE: z.enum(["true", "false"]).default("false"),
  NEXT_PUBLIC_ENABLE_DIRECTUS: z.enum(["true", "false"]).default("false"),
  NEXT_PUBLIC_ENABLE_GOOGLE_ANALYTICS: z.enum(["true", "false"]).default("false"),
  NEXT_PUBLIC_PRIMARY_BACKEND: z.enum(["supabase", "directus"]).default("supabase"),
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().default(""),
  NEXT_PUBLIC_SUPABASE_URL: z.string().default(""),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().default(""),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;

export type PublicBackendFlags = {
  enableSupabase: boolean;
  enableDirectus: boolean;
  primaryBackend: "supabase" | "directus";
};

let cachedPublicEnv: PublicEnv | null = null;

export function getPublicEnv(): PublicEnv {
  if (cachedPublicEnv) {
    return cachedPublicEnv;
  }

  cachedPublicEnv = publicEnvSchema.parse({
    NEXT_PUBLIC_ENABLE_SUPABASE: process.env.NEXT_PUBLIC_ENABLE_SUPABASE,
    NEXT_PUBLIC_ENABLE_DIRECTUS: process.env.NEXT_PUBLIC_ENABLE_DIRECTUS,
    NEXT_PUBLIC_ENABLE_GOOGLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_GOOGLE_ANALYTICS,
    NEXT_PUBLIC_PRIMARY_BACKEND: process.env.NEXT_PUBLIC_PRIMARY_BACKEND,
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  return cachedPublicEnv;
}

export function getPublicBackendFlags(): PublicBackendFlags {
  const env = getPublicEnv();

  return {
    enableSupabase: env.NEXT_PUBLIC_ENABLE_SUPABASE === "true",
    enableDirectus: env.NEXT_PUBLIC_ENABLE_DIRECTUS === "true",
    primaryBackend: env.NEXT_PUBLIC_PRIMARY_BACKEND,
  };
}
