import Link from "next/link";
import { headers } from "next/headers";

import { Badge } from "@/components/ui/badge";
import { getBackendStatus } from "@/lib/backend/server-config";
import { DEFAULT_LOCALE, isAppLocale, localizePathname, type AppLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

type ModuleBadgeProps = {
  label: string;
  enabled: boolean;
  onLabel: string;
  offLabel: string;
};

function ModuleBadge({ label, enabled, onLabel, offLabel }: ModuleBadgeProps) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-xs">
      <span>{label}</span>
      <Badge variant={enabled ? "secondary" : "outline"}>{enabled ? onLabel : offLabel}</Badge>
    </li>
  );
}

export async function SiteFooter() {
  const headerStore = await headers();
  const localeHeader = headerStore.get("x-app-locale") || DEFAULT_LOCALE;
  const locale: AppLocale = isAppLocale(localeHeader) ? localeHeader : DEFAULT_LOCALE;

  const messages = getMessages(locale);
  const status = getBackendStatus();
  const year = new Date().getFullYear();

  const links = [
    { href: localizePathname("/", locale), label: messages.common.dashboard },
    { href: localizePathname("/blog", locale), label: messages.common.blog },
    { href: localizePathname("/status", locale), label: messages.common.systemStatus },
    ...(status.enabled.auth
      ? [{ href: localizePathname("/auth/sign-in", locale), label: messages.common.signIn }]
      : []),
  ];

  return (
    <footer className="border-t border-border/80 bg-zinc-50/80">
      <div className="grid w-full gap-6 px-4 py-8 tablet:px-6 laptop:grid-cols-3 laptop:px-8 desktop:px-12">
        <section className="space-y-2">
          <h2 className="text-sm font-semibold tracking-tight">{messages.footer.brandTitle}</h2>
          <p className="max-w-xs text-xs leading-5 text-muted-foreground">
            {messages.footer.brandDescription}
          </p>
          <div className="pt-2">
            <h3 className="text-xs font-semibold tracking-tight text-foreground">
              {messages.footer.deliveryTitle}
            </h3>
            <p className="max-w-xs pt-1 text-xs leading-5 text-muted-foreground">
              {messages.footer.deliveryDescription}
            </p>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold tracking-tight">
            {messages.footer.quickLinksTitle}
          </h2>
          <ul className="grid gap-2 text-xs">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-muted-foreground hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold tracking-tight">
            {messages.footer.moduleStatusTitle}
          </h2>
          <ul className="grid gap-2">
            <ModuleBadge
              label={messages.footer.moduleSupabase}
              enabled={status.enabled.supabase}
              onLabel={messages.footer.onState}
              offLabel={messages.footer.offState}
            />
            <ModuleBadge
              label={messages.footer.moduleSanity}
              enabled={status.enabled.sanity}
              onLabel={messages.footer.onState}
              offLabel={messages.footer.offState}
            />
            <ModuleBadge
              label={messages.footer.moduleAuth}
              enabled={status.enabled.auth}
              onLabel={messages.footer.onState}
              offLabel={messages.footer.offState}
            />
            <ModuleBadge
              label={messages.footer.moduleI18n}
              enabled={status.enabled.i18n}
              onLabel={messages.footer.onState}
              offLabel={messages.footer.offState}
            />
          </ul>
        </section>
      </div>

      <div className="border-t border-border/70 px-4 py-3 text-xs text-muted-foreground tablet:px-6 laptop:px-8 desktop:px-12">
        <p>
          {year} {messages.footer.brandTitle}. {messages.footer.copyright}
        </p>
      </div>
    </footer>
  );
}
