export const SUPPORTED_LOCALES = ["ko", "en"] as const;
export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = "ko";

export function isAppLocale(value: string): value is AppLocale {
  return SUPPORTED_LOCALES.includes(value as AppLocale);
}

export function getLocaleFromPathname(pathname: string): AppLocale | null {
  const firstSegment = pathname.split("/").filter(Boolean)[0];

  if (!firstSegment) {
    return null;
  }

  return isAppLocale(firstSegment) ? firstSegment : null;
}

export function stripLocaleFromPathname(pathname: string): string {
  const locale = getLocaleFromPathname(pathname);

  if (!locale) {
    return pathname;
  }

  const stripped = pathname.replace(new RegExp(`^/${locale}(?=/|$)`), "");
  return stripped || "/";
}

export function localizePathname(pathname: string, locale: AppLocale): string {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const withoutLocale = stripLocaleFromPathname(normalized);

  if (withoutLocale === "/") {
    return `/${locale}`;
  }

  return `/${locale}${withoutLocale}`;
}

export function getLocaleDisplayName(locale: AppLocale): string {
  if (locale === "ko") {
    return "한국어";
  }

  return "English";
}
