import type { MetadataRoute } from "next";

import { localizePathname } from "@/lib/i18n/config";
import { getEnabledAppLocales } from "@/lib/i18n/runtime-config";
import { getSanityStudioPath } from "@/lib/sanity/studio-path";
import { getSiteUrl } from "@/lib/seo/site-url";

const INTERNAL_STUDIO_PATH = "/admin";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  const studioPath = getSanityStudioPath();
  const enabledLocales = getEnabledAppLocales();
  const privatePaths =
    studioPath === INTERNAL_STUDIO_PATH
      ? ["/auth", "/forbidden", "/app", "/status", INTERNAL_STUDIO_PATH]
      : ["/auth", "/forbidden", "/app", "/status", INTERNAL_STUDIO_PATH, studioPath];

  const localizedPrivatePaths = privatePaths.flatMap((route) =>
    enabledLocales.map((locale) => localizePathname(route, locale)),
  );

  const disallow = Array.from(new Set([...privatePaths, ...localizedPrivatePaths]));

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow,
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
