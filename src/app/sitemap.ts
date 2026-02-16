import type { MetadataRoute } from "next";

import {
  DEFAULT_LOCALE,
  getLocaleFromPathname,
  localizePathname,
  stripLocaleFromPathname,
  type AppLocale,
} from "@/lib/i18n/config";
import { getEnabledAppLocales } from "@/lib/i18n/runtime-config";
import { collectAppPageRoutes } from "@/lib/seo/sitemap-routes";
import { getSiteUrl } from "@/lib/seo/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const routes = await collectAppPageRoutes();
  const routeSet = new Set(routes);
  const enabledLocales = getEnabledAppLocales();
  const now = new Date();

  return routes.map((route) => {
    const locale = getLocaleFromPathname(route);
    const basePath = stripLocaleFromPathname(route);
    const localeForAlternates = resolveLocaleForAlternates(
      locale,
      basePath,
      routeSet,
      enabledLocales,
    );

    const alternates =
      localeForAlternates && enabledLocales.length > 1
        ? {
            languages: Object.fromEntries(
              enabledLocales.map((targetLocale) => [
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

function resolveLocaleForAlternates(
  localeFromPath: string | null,
  basePath: string,
  routeSet: Set<string>,
  enabledLocales: readonly AppLocale[],
): string | null {
  if (localeFromPath) {
    return localeFromPath;
  }

  const hasLocaleSibling = enabledLocales.some((targetLocale) => {
    if (targetLocale === DEFAULT_LOCALE) {
      return false;
    }

    return routeSet.has(localizePathname(basePath, targetLocale));
  });

  return hasLocaleSibling ? DEFAULT_LOCALE : null;
}
