import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getPublicEnv, getSupabasePublicKey } from "@/lib/env/public";

function sanitizeNextPath(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/app";
  }

  return value;
}

export async function GET(request: NextRequest) {
  const publicEnv = getPublicEnv();
  const supabaseUrl = publicEnv.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublicKey = getSupabasePublicKey(publicEnv);
  const code = request.nextUrl.searchParams.get("code");
  const nextPath = sanitizeNextPath(request.nextUrl.searchParams.get("next"));

  if (!supabaseUrl || !supabasePublicKey) {
    const fallback = new URL("/auth/sign-in", request.url);
    fallback.searchParams.set("error", "auth_not_configured");
    return NextResponse.redirect(fallback);
  }

  const redirectResponse = NextResponse.redirect(new URL(nextPath, request.url));

  const supabase = createServerClient(supabaseUrl, supabasePublicKey, {
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
