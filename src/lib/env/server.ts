import "server-only";

import { z } from "zod";

const serverEnvSchema = z.object({
  SUPABASE_SECRET_KEY: z.string().default(""),
  SANITY_API_TOKEN: z.string().default(""),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cachedServerEnv: ServerEnv | null = null;

export function getServerEnv(): ServerEnv {
  if (cachedServerEnv) {
    return cachedServerEnv;
  }

  cachedServerEnv = serverEnvSchema.parse({
    SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
    SANITY_API_TOKEN: process.env.SANITY_API_TOKEN,
  });

  return cachedServerEnv;
}

export function getSupabasePrivilegedKey(env: ServerEnv = getServerEnv()): string {
  return env.SUPABASE_SECRET_KEY;
}
