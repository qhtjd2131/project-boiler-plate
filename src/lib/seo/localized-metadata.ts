import type { Metadata } from "next";

import {
  getOpenGraphLocale,
  localizePathname,
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/lib/i18n/config";
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

  const languageAlternates = Object.fromEntries(
    SUPPORTED_LOCALES.map((locale) => [
      locale,
      new URL(localizePathname(input.pathname, locale), `${siteUrl}/`).toString(),
    ]),
  );

  const canonicalUrl = new URL(canonicalPath, `${siteUrl}/`).toString();

  return {
    title: input.title,
    description: input.description,
    alternates: {
      canonical: canonicalUrl,
      languages: languageAlternates,
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
