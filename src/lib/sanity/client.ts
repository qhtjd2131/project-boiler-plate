import "server-only";

import { createClient, type SanityClient } from "@sanity/client";

import { getPublicEnv } from "@/lib/env/public";
import { getServerEnv } from "@/lib/env/server";

export function getSanityClient(): SanityClient | null {
  const env = getPublicEnv();
  const serverEnv = getServerEnv();

  if (env.NEXT_PUBLIC_ENABLE_SANITY !== "true") {
    return null;
  }

  if (
    !env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
    !env.NEXT_PUBLIC_SANITY_DATASET ||
    !env.NEXT_PUBLIC_SANITY_API_VERSION
  ) {
    return null;
  }

  return createClient({
    projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION,
    token: serverEnv.SANITY_API_TOKEN || undefined,
    useCdn: true,
    perspective: "published",
  });
}

export async function checkSanityConnection(): Promise<boolean> {
  const client = getSanityClient();

  if (!client) {
    return false;
  }

  try {
    await client.fetch("count(*[_type match '*'])");
    return true;
  } catch {
    return false;
  }
}
