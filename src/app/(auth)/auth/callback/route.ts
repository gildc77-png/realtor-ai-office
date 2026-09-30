import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSafeReturnPath } from "@/lib/auth/safe-redirect";
import { getSupabasePublicConfig } from "@/lib/supabase/env";

export async function GET(request: NextRequest) {
  const config = getSupabasePublicConfig();
  const code = request.nextUrl.searchParams.get("code");
  const destination = getSafeReturnPath(request.nextUrl.searchParams.get("next"), "/onboarding");
  const cookiesToSet: Array<{
    name: string;
    value: string;
    options: Parameters<typeof NextResponse.redirect>[0] extends never ? never : import("@supabase/ssr").CookieOptions;
  }> = [];

  if (!config || !code) {
    return NextResponse.redirect(new URL("/login?notice=callback-failed", request.url));
  }

  const supabase = createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookies) {
        cookiesToSet.push(...cookies);
        cookies.forEach(({ name, value }) => request.cookies.set(name, value));
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  const response = NextResponse.redirect(
    new URL(error ? "/login?notice=callback-failed" : destination, request.url),
  );

  cookiesToSet.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });

  return response;
}