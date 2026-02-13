import "server-only";

import { z } from "zod";

const serverEnvSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().default(""),
  SANITY_API_TOKEN: z.string().default(""),
  SANITY_STUDIO_URL: z.string().default(""),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cachedServerEnv: ServerEnv | null = null;

export function getServerEnv(): ServerEnv {
  if (cachedServerEnv) {
    return cachedServerEnv;
  }

  cachedServerEnv = serverEnvSchema.parse({
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    SANITY_API_TOKEN: process.env.SANITY_API_TOKEN,
    SANITY_STUDIO_URL: process.env.SANITY_STUDIO_URL,
  });

  return cachedServerEnv;
}
