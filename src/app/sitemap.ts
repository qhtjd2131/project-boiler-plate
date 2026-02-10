import type { MetadataRoute } from "next";

import {
  getLocaleFromPathname,
  localizePathname,
  stripLocaleFromPathname,
  SUPPORTED_LOCALES,
} from "@/lib/i18n/config";
import { collectAppPageRoutes } from "@/lib/seo/sitemap-routes";
import { getSiteUrl } from "@/lib/seo/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const routes = await collectAppPageRoutes();
  const now = new Date();

  return routes.map((route) => {
    const locale = getLocaleFromPathname(route);
    const basePath = stripLocaleFromPathname(route);

    const alternates = locale
      ? {
          languages: Object.fromEntries(
            SUPPORTED_LOCALES.map((targetLocale) => [
              targetLocale,
              new URL(localizePathname(basePath, targetLocale), `${siteUrl}/`).toString(),
            ]),
          ),
        }
      : undefined;

    return {
      url: new URL(route, `${siteUrl}/`).toString(),
      lastModified: now,
      changeFrequency: route === "/" ? "daily" : "weekly",
      priority: route === "/" ? 1 : 0.7,
      ...(alternates ? { alternates } : {}),
    };
  });
}
