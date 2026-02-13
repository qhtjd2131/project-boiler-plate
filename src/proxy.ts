import { NextResponse, type NextRequest } from "next/server";

import { getAuthGuardConfig } from "@/lib/auth/guard-config";
import { findRouteAccessRule, hasMinimumRole, resolveRoleFromUser } from "@/lib/auth/rbac";
import { resultErr } from "@/lib/contracts/result";
import { DEFAULT_LOCALE, getLocaleFromPathname, localizePathname } from "@/lib/i18n/config";
import { createSupabaseMiddlewareClient } from "@/lib/supabase/auth-middleware-client";

const API_PREFIX = "/api/";

export async function proxy(request: NextRequest) {
  const requestHeaders = createForwardedHeaders(request);
  const config = getAuthGuardConfig();

  if (!config.enabled) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  const pathname = request.nextUrl.pathname;
  const rule = findRouteAccessRule(pathname);

  if (!rule) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  const {
    supabase,
    response: supabaseResponse,
    configured,
  } = createSupabaseMiddlewareClient(request, requestHeaders);

  if (!configured || !supabase) {
    return rejectForMissingAuthConfig(request, supabaseResponse);
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return rejectUnauthorized(request, config.signInPath, supabaseResponse);
  }

  const role = resolveRoleFromUser(user);

  if (!hasMinimumRole(role, rule.minRole)) {
    return rejectForbidden(request, config.forbiddenPath, supabaseResponse);
  }

  return supabaseResponse;
}

function createForwardedHeaders(request: NextRequest): Headers {
  const headers = new Headers(request.headers);
  const locale = getLocaleFromPathname(request.nextUrl.pathname) ?? DEFAULT_LOCALE;

  headers.set("x-app-locale", locale);
  headers.set("x-app-pathname", request.nextUrl.pathname);
  return headers;
}

function rejectForMissingAuthConfig(request: NextRequest, sourceResponse: NextResponse) {
  if (isApiRequest(request.nextUrl.pathname)) {
    return withCookies(
      NextResponse.json(
        resultErr(
          "NOT_CONFIGURED",
          "Auth guard is enabled but Supabase auth is not configured",
          "Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
        ),
        { status: 500 },
      ),
      sourceResponse,
    );
  }

  const signInPath = localizeIfPresent(request.nextUrl.pathname, "/auth/sign-in");
  const signInUrl = new URL(signInPath, request.url);
  signInUrl.searchParams.set("error", "auth_not_configured");
  return withCookies(NextResponse.redirect(signInUrl), sourceResponse);
}

function rejectUnauthorized(
  request: NextRequest,
  signInPath: string,
  sourceResponse: NextResponse,
) {
  if (isApiRequest(request.nextUrl.pathname)) {
    return withCookies(
      NextResponse.json(resultErr("UNAUTHORIZED", "Authentication required"), { status: 401 }),
      sourceResponse,
    );
  }

  const localizedSignInPath = localizeIfPresent(request.nextUrl.pathname, signInPath);
  const signInUrl = new URL(localizedSignInPath, request.url);
  signInUrl.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
  return withCookies(NextResponse.redirect(signInUrl), sourceResponse);
}

function rejectForbidden(
  request: NextRequest,
  forbiddenPath: string,
  sourceResponse: NextResponse,
) {
  if (isApiRequest(request.nextUrl.pathname)) {
    return withCookies(
      NextResponse.json(resultErr("FORBIDDEN", "Insufficient role for this resource"), {
        status: 403,
      }),
      sourceResponse,
    );
  }

  const localizedForbiddenPath = localizeIfPresent(request.nextUrl.pathname, forbiddenPath);
  return withCookies(
    NextResponse.redirect(new URL(localizedForbiddenPath, request.url)),
    sourceResponse,
  );
}

function isApiRequest(pathname: string): boolean {
  return pathname.startsWith(API_PREFIX);
}

function withCookies(response: NextResponse, sourceResponse: NextResponse): NextResponse {
  for (const cookie of sourceResponse.cookies.getAll()) {
    const { name, value, ...options } = cookie;
    response.cookies.set(name, value, options);
  }

  return response;
}

function localizeIfPresent(pathname: string, targetPath: string): string {
  const locale = getLocaleFromPathname(pathname);

  if (!locale) {
    return targetPath;
  }

  return localizePathname(targetPath, locale);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
