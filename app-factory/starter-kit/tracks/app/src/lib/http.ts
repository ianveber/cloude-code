import { NextResponse } from 'next/server';
import type { ZodSchema } from 'zod';

/**
 * The route-handler convention, in one place.
 *
 * Gate 2 flags any mutating handler that reads req.json() without parsing it,
 * so every POST/PUT/PATCH goes through this. It is also simply correct: a
 * handler that trusts its body is one bad request from a 500.
 */
export async function parseBody<T>(request: Request, schema: ZodSchema<T>): Promise<
  { ok: true; data: T } | { ok: false; response: NextResponse }
> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return { ok: false, response: NextResponse.json({ error: 'Body must be JSON' }, { status: 400 }) };
  }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Invalid request', issues: parsed.error.issues }, { status: 400 }),
    };
  }
  return { ok: true, data: parsed.data };
}
