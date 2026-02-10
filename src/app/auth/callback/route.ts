import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function sanitizeNextPath(value: string | null): string {
  if (!value || !value.startsWith("/")) {
    return "/app";
  }

  return value;
}

export async function GET(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const code = request.nextUrl.searchParams.get("code");
  const nextPath = sanitizeNextPath(request.nextUrl.searchParams.get("next"));

  if (!supabaseUrl || !supabaseAnonKey) {
    const fallback = new URL("/auth/sign-in", request.url);
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
