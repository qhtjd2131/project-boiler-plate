import { NextResponse, type NextRequest } from "next/server";

import { getAuthGuardConfig } from "@/lib/auth/guard-config";
import { findRouteAccessRule, hasMinimumRole, resolveRoleFromUser } from "@/lib/auth/rbac";
import { resultErr } from "@/lib/contracts/result";
import {
  DEFAULT_LOCALE,
  getLocaleFromPathname,
  localizePathname,
  stripLocaleFromPathname,
} from "@/lib/i18n/config";
import { getSanityStudioPath } from "@/lib/sanity/studio-path";
import { createSupabaseMiddlewareClient } from "@/lib/supabase/auth-middleware-client";

const API_PREFIX = "/api/";

export async function proxy(request: NextRequest) {
  const canonicalDefaultLocalePath = resolveDefaultLocaleCanonicalPath(request.nextUrl.pathname);

  if (canonicalDefaultLocalePath) {
    const redirectUrl = new URL(
      `${canonicalDefaultLocalePath}${request.nextUrl.search}`,
      request.url,
    );
    return NextResponse.redirect(redirectUrl);
  }

  const rewritePath = resolveDefaultLocaleRewritePath(request.nextUrl.pathname);
  const requestHeaders = createForwardedHeaders(request);
  const config = getAuthGuardConfig();

  const passThroughResponse = createPassThroughResponse(request, requestHeaders, rewritePath);

  if (!config.enabled) {
    return passThroughResponse;
  }

  const pathname = request.nextUrl.pathname;
  const rule = findRouteAccessRule(pathname);

  if (!rule) {
    return passThroughResponse;
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

  return applyRewriteIfNeeded(request, requestHeaders, supabaseResponse, rewritePath);
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

function createPassThroughResponse(
  request: NextRequest,
  requestHeaders: Headers,
  rewritePath: string | null,
): NextResponse {
  if (!rewritePath) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.rewrite(new URL(rewritePath, request.url), {
    request: {
      headers: requestHeaders,
    },
  });
}

function applyRewriteIfNeeded(
  request: NextRequest,
  requestHeaders: Headers,
  sourceResponse: NextResponse,
  rewritePath: string | null,
): NextResponse {
  if (!rewritePath) {
    return sourceResponse;
  }

  const rewrittenResponse = NextResponse.rewrite(new URL(rewritePath, request.url), {
    request: {
      headers: requestHeaders,
    },
  });

  return withCookies(rewrittenResponse, sourceResponse);
}

function resolveDefaultLocaleCanonicalPath(pathname: string): string | null {
  const defaultPrefix = `/${DEFAULT_LOCALE}`;

  if (pathname === defaultPrefix) {
    return "/";
  }

  if (pathname.startsWith(`${defaultPrefix}/`)) {
    return pathname.slice(defaultPrefix.length) || "/";
  }

  return null;
}

function resolveDefaultLocaleRewritePath(pathname: string): string | null {
  if (pathname === "/") {
    return null;
  }

  if (isStaticAssetPath(pathname)) {
    return null;
  }

  if (pathname === "/api" || pathname.startsWith(API_PREFIX) || pathname.startsWith("/_next/")) {
    return null;
  }

  if (getLocaleFromPathname(pathname)) {
    return null;
  }

  if (isStudioPath(pathname)) {
    return null;
  }

  return `/${DEFAULT_LOCALE}${pathname}`;
}

function isStaticAssetPath(pathname: string): boolean {
  if (pathname.startsWith("/.well-known/")) {
    return true;
  }

  return /\/[^/]+\.[^/]+$/.test(pathname);
}

function isStudioPath(pathname: string): boolean {
  const basePath = stripLocaleFromPathname(pathname);
  const configuredStudioPath = getSanityStudioPath();

  return (
    basePath === "/admin" ||
    basePath.startsWith("/admin/") ||
    basePath === configuredStudioPath ||
    basePath.startsWith(`${configuredStudioPath}/`)
  );
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
