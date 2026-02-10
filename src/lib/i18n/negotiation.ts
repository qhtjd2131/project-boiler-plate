import { DEFAULT_LOCALE, isAppLocale, type AppLocale } from "@/lib/i18n/config";

export function negotiateLocaleFromAcceptLanguage(headerValue: string | null): AppLocale {
  if (!headerValue) {
    return DEFAULT_LOCALE;
  }

  const candidates = headerValue
    .split(",")
    .map((entry) => entry.split(";")[0]?.trim().toLowerCase())
    .filter(Boolean);

  for (const candidate of candidates) {
    if (!candidate) {
      continue;
    }

    const baseLocale = candidate.split("-")[0] ?? candidate;

    if (isAppLocale(baseLocale)) {
      return baseLocale;
    }
  }

  return DEFAULT_LOCALE;
}
