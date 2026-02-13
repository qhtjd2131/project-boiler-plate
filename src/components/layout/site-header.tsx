"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DEFAULT_LOCALE,
  getLocaleDisplayName,
  getLocaleFromPathname,
  localizePathname,
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

const localeSwitches: AppLocale[] = [...SUPPORTED_LOCALES];

export function SiteHeader() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname) ?? DEFAULT_LOCALE;
  const messages = getMessages(locale);

  const navigation = [
    { href: localizePathname("/", locale), label: messages.common.dashboard },
    { href: localizePathname("/app", locale), label: messages.common.app },
    { href: localizePathname("/blog", locale), label: messages.common.blog },
    { href: localizePathname("/auth/sign-in", locale), label: messages.common.signIn },
    { href: "/api/backends/status", label: messages.common.backendStatusApi },
    { href: "/api/backends/briefs", label: messages.common.briefsApi },
  ];

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

          <div className="ml-2 flex items-center gap-1">
            {localeSwitches.map((targetLocale) => (
              <Button
                key={targetLocale}
                variant={targetLocale === locale ? "secondary" : "outline"}
                size="sm"
                asChild
              >
                <Link href={localizePathname(pathname || "/", targetLocale)}>
                  {getLocaleDisplayName(targetLocale)}
                </Link>
              </Button>
            ))}
          </div>
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
        {localeSwitches.map((targetLocale) => (
          <Button
            key={targetLocale}
            variant={targetLocale === locale ? "secondary" : "ghost"}
            size="sm"
            asChild
          >
            <Link
              href={localizePathname(pathname || "/", targetLocale)}
              className="whitespace-nowrap"
            >
              {getLocaleDisplayName(targetLocale)}
            </Link>
          </Button>
        ))}
      </nav>
    </header>
  );
}
