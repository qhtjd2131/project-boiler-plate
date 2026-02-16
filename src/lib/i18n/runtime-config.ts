import { getPublicEnv } from "@/lib/env/public";
import { DEFAULT_LOCALE, isAppLocale, SUPPORTED_LOCALES, type AppLocale } from "@/lib/i18n/config";

export type I18nRuntimeConfig = {
  enabled: boolean;
  locales: AppLocale[];
};

export function getI18nRuntimeConfig(): I18nRuntimeConfig {
  const env = getPublicEnv();
  const enabled = env.NEXT_PUBLIC_ENABLE_I18N === "true";

  return {
    enabled,
    locales: enabled ? [...SUPPORTED_LOCALES] : [DEFAULT_LOCALE],
  };
}

export function isI18nModuleEnabled(): boolean {
  return getI18nRuntimeConfig().enabled;
}

export function getEnabledAppLocales(): AppLocale[] {
  return getI18nRuntimeConfig().locales;
}

export function isEnabledAppLocale(locale: string): locale is AppLocale {
  if (!isAppLocale(locale)) {
    return false;
  }

  return getEnabledAppLocales().includes(locale);
}
