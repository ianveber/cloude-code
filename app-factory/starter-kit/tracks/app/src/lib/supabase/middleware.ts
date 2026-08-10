import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

import { decide } from '@/lib/access';
import { PROTECTED_PREFIXES, AUTH_ROUTES, HOME_ROUTE } from '@/lib/routes';

/**
 * Refresh the session, then ask access.decide() what to do.
 *
 * This file does the I/O. It does not make policy — every branch below comes
 * straight from decide(), which is pure and exhaustively tested. Keeping the
 * decision out of here is what makes the auth boundary verifiable at all.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const hasEnv = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  let hasUser = false;
  if (hasEnv) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          },
        },
      },
    );
    // getUser(), never getSession(): getSession trusts the cookie, getUser
    // verifies it with the auth server. Only one of those is a security check.
    const { data } = await supabase.auth.getUser();
    hasUser = Boolean(data.user);
  }

  const verdict = decide({
    path: request.nextUrl.pathname,
    hasUser,
    hasEnv,
    protectedPrefixes: PROTECTED_PREFIXES,
    authRoutes: AUTH_ROUTES,
    homeRoute: HOME_ROUTE,
  });

  switch (verdict.action) {
    case 'gate503':
      return new NextResponse(`Not configured. ${verdict.reason}`, { status: 503 });
    case 'json401':
      return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
    case 'redirect': {
      const url = request.nextUrl.clone();
      const [pathname, search] = verdict.to.split('?');
      url.pathname = pathname;
      url.search = search ? `?${search}` : '';
      return NextResponse.redirect(url);
    }
    default:
      return response;
  }
}
