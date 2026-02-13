import { defineConfig, type Config } from "sanity";
import { structureTool } from "sanity/structure";

import { getPublicBackendFlags, getPublicEnv } from "@/lib/env/public";
import { getSanityStudioPath } from "@/lib/sanity/studio-path";
import { studioSchemaTypes } from "@/lib/sanity/studio-schema";

export function isSanityStudioEnabled(): boolean {
  const flags = getPublicBackendFlags();
  const env = getPublicEnv();

  return Boolean(
    flags.enableSanity &&
    env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
    env.NEXT_PUBLIC_SANITY_DATASET &&
    env.NEXT_PUBLIC_SANITY_API_VERSION,
  );
}

export function getSanityStudioConfig(): Config | null {
  const env = getPublicEnv();

  if (!isSanityStudioEnabled()) {
    return null;
  }

  return defineConfig({
    name: "default",
    title: "Content Studio",
    projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION,
    basePath: getSanityStudioPath(env),
    plugins: [structureTool()],
    schema: {
      types: studioSchemaTypes,
    },
  });
}
