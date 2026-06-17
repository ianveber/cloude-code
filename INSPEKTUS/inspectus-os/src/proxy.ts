import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Next.js 16.2.6 renamed the middleware convention to `proxy.ts` / `export function proxy`.
// This file IS the registered middleware — do not rename it back to middleware.ts.
export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Seed mode: no auth wired — let everything render.
  if (!url || !key) return NextResponse.next({ request });

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() { return request.cookies.getAll(); },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;
  const isAuthRoute = path.startsWith("/prijava") || path.startsWith("/auth");

  if (!user && !isAuthRoute) {
    const to = request.nextUrl.clone();
    to.pathname = "/prijava";
    return NextResponse.redirect(to);
  }
  if (user && path.startsWith("/prijava")) {
    const to = request.nextUrl.clone();
    to.pathname = "/";
    return NextResponse.redirect(to);
  }
  return response;
}

export const config = {
  // Run on everything except static assets and the favicon/logo.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|inspectus-logo.png|sample-survey-report.xlsx|eu6546-form.png|inspectus-signature.jpeg).*)"],
};
