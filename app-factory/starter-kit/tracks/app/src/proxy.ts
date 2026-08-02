import type { NextRequest } from 'next/server';

import { updateSession } from '@/lib/supabase/middleware';

/**
 * Next 16 renamed this convention from `middleware` to `proxy`; building with
 * the old name prints a deprecation warning on every run.
 *
 * ⚠️ The rename is NOT cosmetic. It moves the handler off the Edge runtime
 * onto Node.js (not configurable) and out of middleware-manifest.json into
 * functions-config-manifest.json. For a NEW app that is fine — there is no
 * prior Edge behaviour to preserve, and Node has the wider API surface. When
 * MIGRATING an existing app, verify with a response-header probe rather than
 * assuming it is a rename.
 */
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon|assets/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
};
