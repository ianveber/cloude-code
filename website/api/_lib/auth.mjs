/* Password and session handling for the admin. One shared password, stored
   only as a scrypt hash in ADMIN_PASSWORD_HASH; sessions are signed cookies
   with ADMIN_SESSION_SECRET. Nothing here touches the network. */

import { scryptSync, randomBytes, timingSafeEqual, createHmac } from 'node:crypto';

const SCRYPT = { N: 16384, r: 8, p: 1 };
const SESSION_HOURS = 12;

export function hashPassword(password) {
  const salt = randomBytes(16);
  const hash = scryptSync(String(password), salt, 32, SCRYPT);
  return `scrypt$${salt.toString('base64url')}$${hash.toString('base64url')}`;
}

export function verifyPassword(password, stored) {
  try {
    const [scheme, saltB64, hashB64] = String(stored ?? '').split('$');
    if (scheme !== 'scrypt' || !saltB64 || !hashB64) return false;
    const salt = Buffer.from(saltB64, 'base64url');
    const expected = Buffer.from(hashB64, 'base64url');
    const actual = scryptSync(String(password ?? ''), salt, expected.length, SCRYPT);
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

const sign = (payload, secret) => createHmac('sha256', secret).update(payload).digest('base64url');

export function createSession(secret) {
  const exp = Date.now() + SESSION_HOURS * 3600 * 1000;
  const payload = `${exp}.${randomBytes(12).toString('base64url')}`;
  return { value: `${payload}.${sign(payload, secret)}`, maxAge: SESSION_HOURS * 3600 };
}

export function verifySession(value, secret) {
  if (!value || !secret) return false;
  const parts = String(value).split('.');
  if (parts.length !== 3) return false;
  const [exp, nonce, sig] = parts;
  const expected = sign(`${exp}.${nonce}`, secret);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  return Number(exp) > Date.now();
}

/* A few wrong passwords lock the address out for a while. Per process, so a
   best effort on serverless; the scrypt cost does the rest. */
const attempts = new Map();
const MAX_FAILS = 8;
const LOCK_MS = 15 * 60 * 1000;

export function loginAllowed(ip) {
  const a = attempts.get(ip);
  if (!a) return true;
  if (a.until && a.until > Date.now()) return false;
  if (a.until && a.until <= Date.now()) attempts.delete(ip);
  return true;
}

export function noteFailure(ip) {
  const a = attempts.get(ip) ?? { count: 0, until: 0 };
  a.count += 1;
  if (a.count >= MAX_FAILS) a.until = Date.now() + LOCK_MS;
  attempts.set(ip, a);
}

export function noteSuccess(ip) {
  attempts.delete(ip);
}
