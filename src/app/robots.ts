import type { MetadataRoute } from "next";

import { localizePathname, SUPPORTED_LOCALES } from "@/lib/i18n/config";
import { getSanityStudioPath } from "@/lib/sanity/studio-path";
import { getSiteUrl } from "@/lib/seo/site-url";

const INTERNAL_STUDIO_PATH = "/admin";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  const studioPath = getSanityStudioPath();
  const privatePaths =
    studioPath === INTERNAL_STUDIO_PATH
      ? ["/auth", "/forbidden", "/app", INTERNAL_STUDIO_PATH]
      : ["/auth", "/forbidden", "/app", INTERNAL_STUDIO_PATH, studioPath];

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        ...privatePaths,
        ...privatePaths.flatMap((route) =>
          SUPPORTED_LOCALES.map((locale) => localizePathname(route, locale)),
        ),
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
