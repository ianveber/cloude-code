/**
 * Route policy — generated from spec.protectedRoutes.
 *
 * Kept in one exported constant so Gate 3's anonymous probe and the middleware
 * cannot drift apart: the deployed probe tests exactly these paths.
 */
export const PROTECTED_PREFIXES: string[] = ['/app', '/api'];
export const AUTH_ROUTES: string[] = ['/login', '/reset-password'];
export const HOME_ROUTE = '/app';
