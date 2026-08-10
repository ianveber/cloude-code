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

  // API routes must never 302 to an HTML login page — that breaks fetch()/JSON parsing
  // (e.g. if a session expires mid-use). Return a clean 401 the caller can handle. The
  // route stays auth-gated; this just changes the FORM of the rejection, not whether.
  if (!user && path.startsWith("/api")) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
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
  // Run on everything except Next internals and static assets (matched by extension, so
  // any newly-added /public file is covered automatically). /api stays IN scope so the
  // proxy can return a clean 401 JSON (not an HTML redirect) for unauthenticated calls.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|xlsx|txt|xml)$).*)"],
};
