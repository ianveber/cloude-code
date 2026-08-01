/**
 * manifest.mjs — secrets on disk, and the record that makes provisioning resumable.
 *
 * Creating a cloud project is the one step in the pipeline that a rollback
 * cannot undo. So the sequence is always:
 *
 *     recordIntent()  ──▶  the irreversible call  ──▶  writeManifest({clearIntent})
 *
 * If the process dies in the middle, a pending intent is left on disk naming
 * what was attempted. Resume reconciles BY NAME rather than creating a second
 * project — the failure mode this exists to prevent is a crash silently
 * leaving two paid projects behind, one of them orphaned and unrecorded.
 *
 * Secret discipline (the Heva precedent): a generated password is written to a
 * mode-600 file FIRST, and only then sent in an HTTPS body. It never passes
 * through argv, the process table, a log line, or the transcript.
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

/** Steps whose failure leaves real infrastructure behind. */
export const STEPS = {
  CREATE_SUPABASE: 'create-supabase',
  APPLY_SCHEMA: 'apply-schema',
  CLOSE_SIGNUP: 'close-signup',
  CREATE_VERCEL: 'create-vercel',
  LINK_VERCEL: 'link-vercel',
  SET_ENV: 'set-env',
};

const PROTOCOL_DIR = '.protocol';
const MANIFEST = 'provision.json';
const INTENT = 'provision.intent.json';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/**
 * 40 alphanumeric characters from a CSPRNG.
 * Alphanumeric-only on purpose: punctuation in a database password reliably
 * breaks something downstream in a connection string, a URL, or a shell.
 * At 62^40 the character-class restriction costs nothing that matters.
 */
export function generateDbPassword(length = 40) {
  const bytes = crypto.randomBytes(length * 2);
  let out = '';
  for (let i = 0; out.length < length; i++) {
    // Rejection sampling keeps the distribution uniform (256 % 62 !== 0).
    const b = bytes[i % bytes.length];
    if (b < 248) out += ALPHABET[b % ALPHABET.length];
    else out += ALPHABET[crypto.randomInt(ALPHABET.length)];
  }
  return out;
}

/** Write a secret mode-600, refusing to clobber one that already exists. */
export function writeSecretFile(file, value) {
  if (fs.existsSync(file)) {
    throw new Error(`refusing to overwrite ${file}: a secret already exists there. Move it aside deliberately.`);
  }
  fs.mkdirSync(path.dirname(file), { recursive: true, mode: 0o700 });
  fs.writeFileSync(file, value, { mode: 0o600 });
  fs.chmodSync(file, 0o600); // umask can defeat the mode argument on some systems
  return file;
}

const manifestPath = (runDir) => path.join(runDir, PROTOCOL_DIR, MANIFEST);
const intentPath = (runDir) => path.join(runDir, PROTOCOL_DIR, INTENT);

export function readManifest(runDir) {
  try {
    return JSON.parse(fs.readFileSync(manifestPath(runDir), 'utf8'));
  } catch {
    return null;
  }
}

/** Merge into the manifest. Mode 600 — it names real infrastructure. */
export function writeManifest(runDir, patch, { clearIntent = false } = {}) {
  const file = manifestPath(runDir);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const current = readManifest(runDir) ?? { schemaVersion: 1, createdAt: new Date().toISOString() };
  const next = { ...current, ...patch, schemaVersion: 1, updatedAt: new Date().toISOString() };
  fs.writeFileSync(file, JSON.stringify(next, null, 2) + '\n', { mode: 0o600 });
  fs.chmodSync(file, 0o600);
  if (clearIntent) clearPendingIntent(runDir);
  return next;
}

/**
 * Persist what we are ABOUT to do, and flush it, before doing it.
 * The fsync matters: without it a power loss can lose the intent while the
 * remote side has already created the project.
 */
export function recordIntent(runDir, step, detail = {}) {
  const file = intentPath(runDir);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const payload = JSON.stringify({ step, detail, ts: new Date().toISOString() }, null, 2) + '\n';
  const fd = fs.openSync(file, 'w', 0o600);
  try {
    fs.writeFileSync(fd, payload);
    fs.fsyncSync(fd);
  } finally {
    fs.closeSync(fd);
  }
  return { step, detail };
}

export function pendingIntent(runDir) {
  try {
    return JSON.parse(fs.readFileSync(intentPath(runDir), 'utf8'));
  } catch {
    return null;
  }
}

export function clearPendingIntent(runDir) {
  try {
    fs.unlinkSync(intentPath(runDir));
  } catch {
    /* already gone */
  }
}
