import type { Metadata } from "next";

import { getOpenGraphLocale, localizePathname, type AppLocale } from "@/lib/i18n/config";
import { getEnabledAppLocales } from "@/lib/i18n/runtime-config";
import { getSiteUrl } from "@/lib/seo/site-url";

type LocalizedMetadataInput = {
  locale: AppLocale;
  pathname: string;
  title: string;
  description: string;
  noIndex?: boolean;
};

export function createLocalizedMetadata(input: LocalizedMetadataInput): Metadata {
  const siteUrl = getSiteUrl();
  const canonicalPath = localizePathname(input.pathname, input.locale);
  const enabledLocales = getEnabledAppLocales();

  const languageAlternates =
    enabledLocales.length > 1
      ? Object.fromEntries(
          enabledLocales.map((locale) => [
            locale,
            new URL(localizePathname(input.pathname, locale), `${siteUrl}/`).toString(),
          ]),
        )
      : undefined;

  const canonicalUrl = new URL(canonicalPath, `${siteUrl}/`).toString();

  return {
    title: input.title,
    description: input.description,
    alternates: languageAlternates
      ? {
          canonical: canonicalUrl,
          languages: languageAlternates,
        }
      : {
          canonical: canonicalUrl,
        },
    openGraph: {
      type: "website",
      locale: getOpenGraphLocale(input.locale),
      title: input.title,
      description: input.description,
      url: canonicalUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
    },
    ...(input.noIndex
      ? {
          robots: {
            index: false,
            follow: false,
          },
        }
      : {}),
  };
}
