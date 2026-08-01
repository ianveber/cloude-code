/**
 * vercel-api.mjs — the Vercel side of `provision`.
 *
 * Wraps the `vercel` CLI rather than the REST API, because the CLI already
 * holds the auth token (~/Library/Application Support/com.vercel.cli/auth.json)
 * and re-implementing that lookup would mean handling the token ourselves.
 *
 * Two invariants this file exists to hold:
 *
 *   1. SECRET VALUES NEVER APPEAR IN ARGV. A command line is visible in the
 *      process table to every process on the machine and lands in shell
 *      history. Env values travel on stdin. Names may be in argv; values may not.
 *
 *   2. GIT IS NEVER CONNECTED TO A VERCEL PROJECT. deploy-guard is the single
 *      choke point blocking deploys below gate-2 green. If Vercel could build
 *      from a git push it would route around that guard entirely, and the whole
 *      security model would be decorative. `assertNoGitConnection` is the
 *      standing check, not a one-time setup step.
 *
 * Verified 2026-08-01: `vercel` 54.5.0, authenticated as ianveber-4538;
 * `vercel project add|list|inspect` and `vercel env add` all present.
 */

import { execFileSync } from 'node:child_process';

export class VercelError extends Error {
  constructor(message) {
    super(message);
    this.name = 'VercelError';
    this.exitCode = 2;
  }
}

/** Vercel project names: lowercase, digits and hyphens, not edge-anchored, ≤100 chars. */
const NAME_RE = /^[a-z0-9](?:[a-z0-9-]{0,98}[a-z0-9])?$/;

function assertName(name) {
  if (typeof name !== 'string' || !NAME_RE.test(name)) {
    throw new VercelError(
      `invalid Vercel project name ${JSON.stringify(name)}: ` +
        `use lowercase letters, digits and hyphens, not starting or ending with a hyphen, max 100 chars`,
    );
  }
}

const defaultExec = (file, args, opts = {}) =>
  execFileSync(file, args, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], ...opts });

export function createVercel({ execImpl = defaultExec } = {}) {
  const run = (args, opts = {}) => {
    try {
      return String(execImpl('vercel', args, opts) ?? '');
    } catch (e) {
      const detail = (e.stderr || e.message || '').toString().slice(0, 400);
      const err = new VercelError(`vercel ${args.filter((a) => a !== '--yes').join(' ')} failed: ${detail}`);
      err.cause = e;
      err.stderr = detail;
      throw err;
    }
  };

  return {
    whoami: () => run(['whoami']).trim(),

    /** Idempotent: an already-existing project is a success, not a failure. */
    createProject(name) {
      assertName(name);
      try {
        run(['project', 'add', name]);
        return { name, alreadyExisted: false };
      } catch (e) {
        if (/already exists/i.test(e.stderr || e.message || '')) {
          return { name, alreadyExisted: true };
        }
        throw e;
      }
    },

    /**
     * Machine-readable project record.
     *
     * Uses `vercel api` rather than `vercel project inspect`: inspect has NO
     * --json flag (verified on 54.5.0 — it errors "unknown or unexpected
     * option") and its human output does not report the git connection at all.
     * `vercel api` returns the raw REST object, which does.
     *
     * Note: `link` is ABSENT from the payload when no repository is connected,
     * not null. Callers must treat absent and null identically.
     */
    inspect(name) {
      assertName(name);
      const out = run(['api', `/v9/projects/${name}`]);
      try {
        return JSON.parse(out);
      } catch {
        throw new VercelError(`could not parse \`vercel api /v9/projects/${name}\` output`);
      }
    },

    /**
     * The standing invariant check. Must pass before any deploy is considered.
     * A connected git repo lets Vercel build from a push and bypass deploy-guard.
     */
    assertNoGitConnection(name) {
      const project = this.inspect(name);
      if (project?.link) {
        throw new VercelError(
          `Vercel project "${name}" has a git repository connected ` +
            `(${project.link.type}: ${project.link.repo ?? 'unknown'}). ` +
            `That lets Vercel deploy straight from a push, bypassing deploy-guard — ` +
            `which is the only thing blocking deploys below gate-2 green. ` +
            `Disconnect it in the Vercel dashboard before continuing.`,
        );
      }
      return true;
    },

    /**
     * DESTRUCTIVE. Removes the Vercel project, then PROVES it is gone.
     *
     * Two traps here, both found by a live run on 2026-08-01:
     *   1. `project rm` has no --yes (that errors), and --non-interactive does
     *      NOT suppress the confirmation prompt — it still asks, reads an empty
     *      answer with no TTY, defaults to "N", and EXITS 0 having deleted
     *      nothing. A zero exit code from this command means nothing on its own.
     *   2. Therefore the only trustworthy signal is a follow-up read. We delete,
     *      then confirm absence. Never report a destructive act as done on the
     *      strength of an exit code.
     */
    removeProject(name) {
      assertName(name);
      const gone = () => {
        try {
          this.inspect(name);
          return false;
        } catch {
          return true; // no longer readable == removed
        }
      };
      if (gone()) return { name, removed: false, alreadyGone: true };

      try {
        run(['project', 'rm', name], { input: 'y\n' });
      } catch (e) {
        if (!/not found|does not exist|no such/i.test(e.stderr || e.message || '')) throw e;
      }

      if (!gone()) {
        throw new VercelError(
          `\`vercel project rm ${name}\` returned without error but the project still exists. ` +
            `Do not treat this as removed — delete it in the dashboard and investigate.`,
        );
      }
      return { name, removed: true };
    },

    /** Non-interactive by construction — --yes so it can never block on a prompt. */
    link(dir, name) {
      assertName(name);
      return run(['link', '--yes', '--project', name], { cwd: dir });
    },

    /**
     * Set an environment variable. The VALUE goes on stdin and never into argv.
     * @param {'production'|'preview'|'development'} target
     */
    setEnv(dir, key, value, target = 'production') {
      if (typeof value !== 'string' || value === '') {
        throw new VercelError(`refusing to set ${key}: value is empty`);
      }
      if (!/^[A-Z_][A-Z0-9_]*$/.test(key)) {
        throw new VercelError(`invalid environment variable name ${JSON.stringify(key)}`);
      }
      return run(['env', 'add', key, target], { cwd: dir, input: value });
    },
  };
}
