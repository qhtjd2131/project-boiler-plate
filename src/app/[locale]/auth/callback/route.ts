import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { DEFAULT_LOCALE, isAppLocale, localizePathname, type AppLocale } from "@/lib/i18n/config";

function sanitizeNextPath(value: string | null, locale: AppLocale): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return localizePathname("/app", locale);
  }

  return value;
}

type RouteContext = {
  params: Promise<{ locale: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { locale } = await context.params;
  const safeLocale: AppLocale = isAppLocale(locale) ? locale : DEFAULT_LOCALE;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const code = request.nextUrl.searchParams.get("code");
  const nextPath = sanitizeNextPath(request.nextUrl.searchParams.get("next"), safeLocale);

  if (!supabaseUrl || !supabaseAnonKey) {
    const fallback = new URL(localizePathname("/auth/sign-in", safeLocale), request.url);
    fallback.searchParams.set("error", "auth_not_configured");
    return NextResponse.redirect(fallback);
  }

  const redirectResponse = NextResponse.redirect(new URL(nextPath, request.url));

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          redirectResponse.cookies.set(name, value, options);
        }
      },
    },
  });

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  return redirectResponse;
}
