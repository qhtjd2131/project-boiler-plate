import { getPublicEnv, type PublicEnv } from "@/lib/env/public";

const FALLBACK_STUDIO_PATH = "/admin";

export function getSanityStudioPath(env: PublicEnv = getPublicEnv()): string {
  return normalizeSanityStudioPath(env.NEXT_PUBLIC_SANITY_STUDIO_PATH);
}

export function isSanityStudioPath(pathname: string, env: PublicEnv = getPublicEnv()): boolean {
  const studioPath = getSanityStudioPath(env);
  const normalizedPathname = normalizeSanityStudioPath(pathname);

  return normalizedPathname === studioPath || normalizedPathname.startsWith(`${studioPath}/`);
}

export function normalizeSanityStudioPath(value?: string): string {
  const trimmed = (value || "").trim();

  if (!trimmed) {
    return FALLBACK_STUDIO_PATH;
  }

  const withoutProtocol = trimmed.replace(/^https?:\/\/[^/]+/i, "");
  const withLeadingSlash = withoutProtocol.startsWith("/")
    ? withoutProtocol
    : `/${withoutProtocol}`;

  const compacted = withLeadingSlash.replace(/\/{2,}/g, "/");
  const normalized = compacted.replace(/\/+$/, "") || "/";

  if (normalized === "/") {
    return FALLBACK_STUDIO_PATH;
  }

  return normalized;
}
