import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const studioPath = normalizeSanityStudioPath(process.env.NEXT_PUBLIC_SANITY_STUDIO_PATH);

    if (studioPath === "/admin") {
      return [];
    }

    return [
      {
        source: studioPath,
        destination: "/admin",
      },
      {
        source: `${studioPath}/:tool*`,
        destination: "/admin/:tool*",
      },
    ];
  },
};

export default nextConfig;

function normalizeSanityStudioPath(value?: string): string {
  const trimmed = (value || "").trim();

  if (!trimmed) {
    return "/admin";
  }

  const withoutProtocol = trimmed.replace(/^https?:\/\/[^/]+/i, "");
  const withLeadingSlash = withoutProtocol.startsWith("/")
    ? withoutProtocol
    : `/${withoutProtocol}`;
  const compacted = withLeadingSlash.replace(/\/{2,}/g, "/");
  const normalized = compacted.replace(/\/+$/, "") || "/";

  return normalized === "/" ? "/admin" : normalized;
}
