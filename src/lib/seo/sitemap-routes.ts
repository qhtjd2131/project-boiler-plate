import { readdir } from "node:fs/promises";
import path from "node:path";

import { DEFAULT_LOCALE, stripLocaleFromPathname } from "@/lib/i18n/config";
import { getEnabledAppLocales } from "@/lib/i18n/runtime-config";
import { getSanityStudioPath } from "@/lib/sanity/studio-path";

const PAGE_FILE_PATTERN = /^page\.(ts|tsx|js|jsx|mdx)$/;
const LOCALE_TOKEN = "__LOCALE__";

export async function collectAppPageRoutes(): Promise<string[]> {
  const appDirectory = await resolveAppDirectory();
  if (!appDirectory) {
    return ["/"];
  }

  const routeTemplateSet = new Set<string>();
  await walk(appDirectory, [], routeTemplateSet);

  const routeSet = new Set<string>();
  for (const template of routeTemplateSet) {
    for (const expanded of expandRouteTemplate(template)) {
      if (isSitemapEligible(expanded)) {
        routeSet.add(expanded);
      }
    }
  }

  if (!routeSet.has("/")) {
    routeSet.add("/");
  }

  return Array.from(routeSet).sort();
}

async function resolveAppDirectory(): Promise<string | null> {
  const candidates = [path.join(process.cwd(), "src", "app"), path.join(process.cwd(), "app")];

  for (const candidate of candidates) {
    try {
      const entries = await readdir(candidate);
      if (entries.length >= 0) {
        return candidate;
      }
    } catch {
      continue;
    }
  }

  return null;
}

async function walk(currentDir: string, segments: string[], routes: Set<string>): Promise<void> {
  const entries = await readdir(currentDir, { withFileTypes: true });

  const hasPage = entries.some((entry) => entry.isFile() && PAGE_FILE_PATTERN.test(entry.name));
  if (hasPage) {
    routes.add(`/${segments.join("/")}`.replace(/\/+$/, "") || "/");
  }

  await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map(async (entry) => {
        if (shouldIgnoreDirectory(entry.name)) {
          return;
        }

        const routeSegment = toRouteSegment(entry.name);
        if (routeSegment === "__SKIP__") {
          return;
        }

        const nextSegments = routeSegment ? [...segments, routeSegment] : [...segments];
        await walk(path.join(currentDir, entry.name), nextSegments, routes);
      }),
  );
}

function shouldIgnoreDirectory(name: string): boolean {
  if (name === "api") {
    return true;
  }

  return name.startsWith("_") || name.startsWith(".");
}

function toRouteSegment(name: string): string | null | "__SKIP__" {
  if (name === "[locale]") {
    return LOCALE_TOKEN;
  }

  if (name.startsWith("[") && name.endsWith("]")) {
    return "__SKIP__";
  }

  if ((name.startsWith("(") && name.endsWith(")")) || name.startsWith("@")) {
    return null;
  }

  if (name.startsWith("(")) {
    return "__SKIP__";
  }

  return name;
}

function expandRouteTemplate(template: string): string[] {
  if (!template.includes(LOCALE_TOKEN)) {
    return [template];
  }

  const expanded = getEnabledAppLocales().map((locale) => {
    const replacement = locale === DEFAULT_LOCALE ? "" : locale;
    const withLocale = template.replace(new RegExp(LOCALE_TOKEN, "g"), replacement);
    const normalized = withLocale.replace(/\/{2,}/g, "/").replace(/\/+$/, "") || "/";

    return normalized;
  });

  return Array.from(new Set(expanded));
}

function isSitemapEligible(route: string): boolean {
  const baseRoute = stripLocaleFromPathname(route);
  const studioPath = getSanityStudioPath();
  const privatePrefixes =
    studioPath === "/admin"
      ? ["/auth", "/forbidden", "/app", "/status", "/admin"]
      : ["/auth", "/forbidden", "/app", "/status", "/admin", studioPath];

  return !privatePrefixes.some(
    (prefix) => baseRoute === prefix || baseRoute.startsWith(`${prefix}/`),
  );
}
