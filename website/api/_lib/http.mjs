/* Small helpers over Node's request and response objects. They work the same
   under Vercel's Node runtime and under the local dev server in build.mjs. */

const MAX_BODY = 4 * 1024 * 1024;

export async function readBody(req) {
  /* Vercel's helper may already have parsed the body. */
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === 'string') return req.body ? JSON.parse(req.body) : {};
    if (Buffer.isBuffer(req.body)) return req.body.length ? JSON.parse(req.body.toString('utf8')) : {};
    return req.body;
  }
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY) throw Object.assign(new Error('Sporočilo je preveliko.'), { status: 413 });
    chunks.push(chunk);
  }
  const text = Buffer.concat(chunks).toString('utf8');
  return text ? JSON.parse(text) : {};
}

export function send(res, status, body, headers = {}) {
  const isText = typeof body === 'string';
  res.writeHead(status, {
    'content-type': isText ? 'text/html; charset=utf-8' : 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-robots-tag': 'noindex, nofollow, noarchive',
    'x-content-type-options': 'nosniff',
    ...headers,
  });
  res.end(isText ? body : JSON.stringify(body));
}

export const json = (res, body, status = 200, headers = {}) => send(res, status, body, headers);
export const fail = (res, status, message, extra = {}) => send(res, status, { ok: false, error: message, ...extra });

export function parseCookies(req) {
  const out = {};
  for (const part of String(req.headers.cookie ?? '').split(';')) {
    const i = part.indexOf('=');
    if (i < 0) continue;
    out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

export function cookie(name, value, { maxAge, secure, path = '/api/admin' }) {
  const parts = [`${name}=${encodeURIComponent(value)}`, `Path=${path}`, 'HttpOnly', 'SameSite=Strict'];
  if (maxAge !== undefined) parts.push(`Max-Age=${maxAge}`);
  if (secure) parts.push('Secure');
  return parts.join('; ');
}

export function isSecure(req) {
  if (process.env.VERCEL) return true;
  const proto = String(req.headers['x-forwarded-proto'] ?? '').split(',')[0].trim();
  return proto === 'https';
}

export function clientIp(req) {
  const fwd = String(req.headers['x-forwarded-for'] ?? '').split(',')[0].trim();
  return fwd || req.socket?.remoteAddress || 'unknown';
}

/** Same-origin check for state-changing requests (defence in depth next to SameSite). */
export function sameOrigin(req) {
  const origin = req.headers.origin;
  const host = req.headers['x-forwarded-host'] ?? req.headers.host;
  if (!origin) {
    const site = req.headers['sec-fetch-site'];
    return !site || site === 'same-origin' || site === 'none';
  }
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
