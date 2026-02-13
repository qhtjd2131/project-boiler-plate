import { getPublicEnv } from "@/lib/env/public";
import { getSiteUrl } from "@/lib/seo/site-url";
import { getSanityStudioPath } from "@/lib/sanity/studio-path";

export function getSanityStudioUrl(): string {
  const env = getPublicEnv();
  const studioPath = getSanityStudioPath(env);

  return new URL(studioPath, `${getSiteUrl()}/`).toString();
}
