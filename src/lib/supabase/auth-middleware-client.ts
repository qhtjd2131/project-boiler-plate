import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

import { getPublicEnv, getSupabasePublicKey } from "@/lib/env/public";

type MiddlewareClientResult = {
  supabase: SupabaseClient | null;
  response: NextResponse;
  configured: boolean;
};

export function createSupabaseMiddlewareClient(
  request: NextRequest,
  requestHeaders: Headers,
): MiddlewareClientResult {
  const publicEnv = getPublicEnv();
  const supabaseUrl = publicEnv.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublicKey = getSupabasePublicKey(publicEnv);

  let response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  if (!supabaseUrl || !supabasePublicKey) {
    return {
      supabase: null,
      response,
      configured: false,
    };
  }

  const supabase = createServerClient(supabaseUrl, supabasePublicKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }

        response = NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        });

        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  return {
    supabase,
    response,
    configured: true,
  };
}
