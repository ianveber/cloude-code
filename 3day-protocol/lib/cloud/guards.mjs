/**
 * guards.mjs — the safety core of `provision`.
 *
 * Ian's Supabase org holds LIVE databases alongside anything the factory
 * creates: the AIS client portal, the Heva family portal, ATHLOS. An
 * autonomous build agent reaching a destructive verb on one of those is a
 * real-world outage, not a failed test.
 *
 * Two independent rules, in this order:
 *
 *   1. DENY_REFS is absolute. A denied ref is refused even if something has
 *      written it into the ownership registry. The registry is data; this list
 *      is code. Forging the data must not move the boundary.
 *   2. Ownership must be positively proven. A ref the factory has no record of
 *      creating is refused. Absence of evidence is a refusal, never a default-open.
 *
 * These functions are called from INSIDE the API client, not at call sites, so
 * no code path can reach a destructive verb without passing through them.
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

/**
 * Projects that exist and must never be touched by the factory.
 * Verified against the Supabase Management API on 2026-08-01.
 * Adding a live project to Ian's org means adding it here.
 */
export const DENY_REFS = new Set([
  'myqcdljzseefrlicwnbm', // "ian.veber@gmail.com's Project" = the LIVE AIS client portal DB
  'cdmllcscbfrmkvhzidam', // heva-portal — his father's company, live
  'fuhmndzrjzwhfbcmfaii', // ATHLOS
]);

/** Default ownership registry. Append-only; one JSON object per line. */
export const DEFAULT_REGISTRY = path.join(os.homedir(), '.factory', 'owned.jsonl');

export class GuardViolation extends Error {
  constructor(message) {
    super(message);
    this.name = 'GuardViolation';
    /** Distinct from a normal failure so callers can exit(2) on refusal. */
    this.exitCode = 2;
  }
}

/** Supabase project refs are exactly 20 lowercase alphanumeric characters. */
const REF_RE = /^[a-z0-9]{20}$/;

function assertValidRef(ref) {
  if (typeof ref !== 'string' || !REF_RE.test(ref)) {
    throw new GuardViolation(
      `refusing to act on a malformed project ref: ${JSON.stringify(ref)} ` +
        `(expected 20 lowercase alphanumeric characters)`,
    );
  }
}

/**
 * Has the factory recorded creating this project?
 * A missing or unreadable registry answers "no" — never "assume yes".
 */
export function isOwned(ref, { registry = DEFAULT_REGISTRY } = {}) {
  if (typeof ref !== 'string' || !REF_RE.test(ref)) return false;
  let raw;
  try {
    raw = fs.readFileSync(registry, 'utf8');
  } catch {
    return false;
  }
  for (const line of raw.split('\n')) {
    const t = line.trim();
    if (!t) continue;
    try {
      if (JSON.parse(t).ref === ref) return true;
    } catch {
      // A corrupt line is skipped, never fatal, and never grants ownership.
    }
  }
  return false;
}

/**
 * The gate every destructive verb passes through.
 * Throws GuardViolation unless `ref` is both not-denied and factory-created.
 */
export function assertOwned(ref, { registry = DEFAULT_REGISTRY } = {}) {
  assertValidRef(ref);

  // Rule 1 first, and independent of any on-disk state.
  if (DENY_REFS.has(ref)) {
    throw new GuardViolation(
      `refusing to act on ${ref}: this is a protected live project. ` +
        `Denied by DENY_REFS regardless of any ownership record.`,
    );
  }

  // Rule 2.
  if (!isOwned(ref, { registry })) {
    throw new GuardViolation(
      `refusing to act on ${ref}: not created by the factory (no record in ${registry}). ` +
        `If the factory really did create it, the registry entry is missing — investigate rather than override.`,
    );
  }
  return true;
}

/**
 * Record a project the factory just created. Idempotent.
 * Refuses to record a denied ref, closing the "record it, then it is owned" bypass.
 */
export function recordOwned(ref, { registry = DEFAULT_REGISTRY, project = null } = {}) {
  assertValidRef(ref);
  if (DENY_REFS.has(ref)) {
    throw new GuardViolation(`refusing to record ${ref} as factory-owned: it is a protected live project.`);
  }
  if (isOwned(ref, { registry })) return false;

  fs.mkdirSync(path.dirname(registry), { recursive: true, mode: 0o700 });
  fs.appendFileSync(
    registry,
    JSON.stringify({ ref, project, createdBy: 'provision', ts: new Date().toISOString() }) + '\n',
    { mode: 0o600 },
  );
  return true;
}

/**
 * iCloud-synced directories. On Ian's Mac, Desktop and Documents both sync,
 * which has already evicted files mid-work (2026-07-11) and corrupts
 * node_modules. Run projects belong in ~/builds.
 */
const ICLOUD_PREFIXES = [
  path.join(os.homedir(), 'Desktop'),
  path.join(os.homedir(), 'Documents'),
  path.join(os.homedir(), 'Library', 'Mobile Documents'),
];

/** Throws unless `dir` is somewhere a Next.js build can actually survive. */
export function assertSafeRunDir(dir) {
  if (typeof dir !== 'string' || !dir.trim()) {
    throw new GuardViolation(`refusing a malformed run directory: ${JSON.stringify(dir)}`);
  }
  // Normalise first so ~/builds/../Desktop/x cannot slip through.
  const resolved = path.resolve(dir);
  for (const prefix of ICLOUD_PREFIXES) {
    if (resolved === prefix || resolved.startsWith(prefix + path.sep)) {
      throw new GuardViolation(
        `refusing to build in ${resolved}: that path is iCloud-synced. ` +
          `iCloud breaks next dev, file watchers and node_modules. Use ~/builds/<project> instead.`,
      );
    }
  }
  return true;
}
