/**
 * access.ts — the single place that decides who may see what.
 *
 * Deliberately PURE: no Next, no Supabase, no cookies, no I/O. It takes facts
 * and returns a decision, which means the auth boundary can be exhaustively
 * tested without a browser, a server, or a database. Middleware does the I/O
 * and then asks this function; it never decides anything itself.
 *
 * ⚠️ THE RULE THAT MATTERS MOST — env-unset must FAIL CLOSED.
 *
 * The tempting shape is: no Supabase configured, so there is no session, so
 * let the request through and let the page sort it out. That is exactly
 * backwards. A missing NEXT_PUBLIC_SUPABASE_URL in production — a typo, a
 * forgotten Vercel env var, a bad deploy — would then serve every protected
 * page to the open internet, and nothing would look broken. So an
 * unconfigured app refuses protected routes with 503 rather than passing them
 * through. A visibly broken app is recoverable; a silently open one is not.
 */

export type Action =
  | { action: 'allow' }
  | { action: 'redirect'; to: string }
  | { action: 'json401' }
  | { action: 'gate503'; reason: string };

export interface AccessInput {
  /** Pathname only, no query string. */
  path: string;
  /** Is there an authenticated user for this request? */
  hasUser: boolean;
  /** Are the Supabase env vars present? */
  hasEnv: boolean;
  /** Path prefixes that require a session. */
  protectedPrefixes: string[];
  /** Auth pages themselves — reachable signed out, redirected away signed in. */
  authRoutes: string[];
  /** Where to send a signed-in user who lands on an auth page. */
  homeRoute?: string;
}

const isUnder = (path: string, prefix: string) =>
  path === prefix || path.startsWith(prefix.endsWith('/') ? prefix : prefix + '/');

export function decide({
  path,
  hasUser,
  hasEnv,
  protectedPrefixes,
  authRoutes,
  homeRoute = '/',
}: AccessInput): Action {
  const isProtected = protectedPrefixes.some((p) => isUnder(path, p));
  // An API route must answer 401 as JSON. Redirecting a fetch() to an HTML
  // login page produces a parse error at the call site instead of a clear
  // "you are not signed in", which sends people debugging the wrong thing.
  const isApi = path === '/api' || path.startsWith('/api/');

  if (!hasEnv) {
    // Fail closed. See the header comment — this is the whole point.
    if (isProtected) {
      return {
        action: 'gate503',
        reason:
          'Supabase is not configured, so no request can be authenticated. ' +
          'Refusing protected routes rather than serving them unprotected.',
      };
    }
    return { action: 'allow' };
  }

  if (isProtected && !hasUser) {
    return isApi ? { action: 'json401' } : { action: 'redirect', to: `/login?next=${encodeURIComponent(path)}` };
  }

  // A signed-in user on the login page is sent home rather than shown a form
  // they cannot use.
  if (hasUser && authRoutes.some((r) => isUnder(path, r))) {
    return { action: 'redirect', to: homeRoute };
  }

  return { action: 'allow' };
}
