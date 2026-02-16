"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { isAuthModuleEnabled } from "@/lib/auth/runtime-config";
import {
  DEFAULT_LOCALE,
  getLocaleDisplayName,
  getLocaleFromPathname,
  localizePathname,
  type AppLocale,
} from "@/lib/i18n/config";
import { getEnabledAppLocales, isI18nModuleEnabled } from "@/lib/i18n/runtime-config";
import { getMessages } from "@/lib/i18n/messages";

export function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname) ?? DEFAULT_LOCALE;
  const messages = getMessages(locale);
  const authEnabled = isAuthModuleEnabled();
  const i18nEnabled = isI18nModuleEnabled();
  const localeOptions = getEnabledAppLocales();
  const activeLocale = localeOptions.includes(locale) ? locale : DEFAULT_LOCALE;

  const navigation = [
    { href: localizePathname("/", locale), label: messages.common.dashboard },
    { href: localizePathname("/blog", locale), label: messages.common.blog },
    { href: localizePathname("/status", locale), label: messages.common.systemStatus },
    ...(authEnabled
      ? [
          { href: localizePathname("/app", locale), label: messages.common.app },
          { href: localizePathname("/auth/sign-in", locale), label: messages.common.signIn },
        ]
      : []),
  ];

  const localePathname = pathname || "/";

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="flex w-full items-center justify-between gap-4 px-4 py-3 tablet:px-6 laptop:px-8 desktop:px-12">
        <div className="flex items-center gap-3">
          <Link
            href={localizePathname("/", locale)}
            className="text-base font-semibold tracking-tight tablet:text-lg"
          >
            Delivery Boilerplate
          </Link>
          <Badge variant="outline" className="hidden tablet:inline-flex">
            Next.js 16
          </Badge>
        </div>

        <nav className="hidden items-center gap-2 laptop:flex">
          {navigation.map((item) => (
            <Button key={item.href} variant="ghost" size="sm" asChild>
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}

          {i18nEnabled && localeOptions.length > 1 ? (
            <label className="ml-2 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="sr-only">Language</span>
              <select
                className="h-8 rounded-md border bg-background px-2 text-xs"
                value={activeLocale}
                onChange={(event) => {
                  const targetLocale = event.target.value as AppLocale;
                  router.push(localizePathname(localePathname, targetLocale));
                }}
              >
                {localeOptions.map((targetLocale) => (
                  <option key={targetLocale} value={targetLocale}>
                    {getLocaleDisplayName(targetLocale)}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
        </nav>
      </div>

      <nav className="flex w-full gap-2 overflow-x-auto px-4 pb-3 laptop:hidden tablet:px-6 laptop:px-8 desktop:px-12">
        {navigation.map((item) => (
          <Button key={item.href} variant="outline" size="sm" asChild>
            <Link href={item.href} className="whitespace-nowrap">
              {item.label}
            </Link>
          </Button>
        ))}
        {i18nEnabled && localeOptions.length > 1 ? (
          <label className="ml-auto flex items-center text-xs text-muted-foreground">
            <span className="sr-only">Language</span>
            <select
              className="h-8 rounded-md border bg-background px-2 text-xs"
              value={activeLocale}
              onChange={(event) => {
                const targetLocale = event.target.value as AppLocale;
                router.push(localizePathname(localePathname, targetLocale));
              }}
            >
              {localeOptions.map((targetLocale) => (
                <option key={targetLocale} value={targetLocale}>
                  {getLocaleDisplayName(targetLocale)}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </nav>
    </header>
  );
}
