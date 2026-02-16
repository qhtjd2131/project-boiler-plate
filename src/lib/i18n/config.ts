const LOCALE_CONFIG = {
  ko: {
    displayName: "한국어",
    openGraphLocale: "ko_KR",
  },
  en: {
    displayName: "English",
    openGraphLocale: "en_US",
  },
} as const;

export type AppLocale = keyof typeof LOCALE_CONFIG;
export const SUPPORTED_LOCALES = Object.keys(LOCALE_CONFIG) as AppLocale[];

export const DEFAULT_LOCALE: AppLocale = "ko";

export function isAppLocale(value: string): value is AppLocale {
  return value in LOCALE_CONFIG;
}

export function resolveAppLocale(value: string | null | undefined): AppLocale {
  if (!value) {
    return DEFAULT_LOCALE;
  }

  return isAppLocale(value) ? value : DEFAULT_LOCALE;
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

  if (locale === DEFAULT_LOCALE) {
    return withoutLocale;
  }

  if (withoutLocale === "/") {
    return `/${locale}`;
  }

  return `/${locale}${withoutLocale}`;
}

export function getLocaleDisplayName(locale: AppLocale): string {
  return LOCALE_CONFIG[locale].displayName;
}

export function getOpenGraphLocale(locale: AppLocale): string {
  return LOCALE_CONFIG[locale].openGraphLocale;
}
