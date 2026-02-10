import "server-only";

import { z } from "zod";

const serverEnvSchema = z.object({
  DIRECTUS_URL: z.string().default(""),
  DIRECTUS_TOKEN: z.string().default(""),
  DIRECTUS_COLLECTION: z.string().default("project_briefs"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().default(""),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cachedServerEnv: ServerEnv | null = null;

export function getServerEnv(): ServerEnv {
  if (cachedServerEnv) {
    return cachedServerEnv;
  }

  cachedServerEnv = serverEnvSchema.parse({
    DIRECTUS_URL: process.env.DIRECTUS_URL,
    DIRECTUS_TOKEN: process.env.DIRECTUS_TOKEN,
    DIRECTUS_COLLECTION: process.env.DIRECTUS_COLLECTION,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  });

  return cachedServerEnv;
}
