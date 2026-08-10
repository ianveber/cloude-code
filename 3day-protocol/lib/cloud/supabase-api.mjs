/**
 * supabase-api.mjs — Supabase Management API client for `provision`.
 *
 * Design rule: the guards run INSIDE this client, before any request is
 * issued. A refused call must never reach the wire — not merely fail once it
 * gets there. Call sites cannot forget to check, because there is no path to a
 * destructive verb that does not pass through assertOwned() here.
 *
 * Endpoints verified live on 2026-08-01 (read-only GETs):
 *   GET   /v1/organizations                  -> 200
 *   GET   /v1/projects                       -> 200
 *   GET   /v1/projects/{ref}/config/auth     -> 200, 242 keys
 * `supabase config push` is deliberately never used: it would push all 242
 * auth settings at the project, not the one being changed.
 *
 * `supabase link` is also never used. Every call carries its ref in the URL,
 * which sidesteps the trap where `--linked` resolves the NEAREST supabase/ dir
 * walking up and a stray parent link silently captures every project beneath it.
 */

import { execFileSync } from 'node:child_process';
import { assertOwned, recordOwned, GuardViolation, DEFAULT_REGISTRY } from './guards.mjs';

const API = 'https://api.supabase.com';

/** Regions inside the EU. Ian is in Slovenia and his clients are EU — GDPR default. */
const EU_REGIONS = new Set(['eu-central-1', 'eu-west-1', 'eu-west-2', 'eu-west-3', 'eu-central-2', 'eu-north-1']);
export const DEFAULT_REGION = 'eu-central-1';

/**
 * Resolve the Management API token without it ever passing through argv,
 * a transcript, or the process table.
 * Order: explicit > env > macOS keychain (where the supabase CLI stores it).
 */
export function resolveToken({ token = null, env = process.env } = {}) {
  if (token) return token;
  if (env.SUPABASE_ACCESS_TOKEN) return env.SUPABASE_ACCESS_TOKEN;
  try {
    const out = execFileSync(
      'security',
      ['find-generic-password', '-s', 'Supabase CLI', '-a', 'supabase', '-w'],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
    ).trim();
    if (out) return out;
  } catch {
    // Not in the keychain — fall through to the explicit error below.
  }
  throw new Error(
    'No Supabase access token. Run `supabase login`, or set SUPABASE_ACCESS_TOKEN. ' +
      'Never paste a token into a chat or onto a command line.',
  );
}

export function createClient({
  token,
  baseUrl = API,
  fetchImpl = globalThis.fetch,
  registry = DEFAULT_REGISTRY,
} = {}) {
  if (!token) throw new Error('createClient requires a Management API token');
  if (typeof fetchImpl !== 'function') throw new Error('createClient requires a fetch implementation');

  async function request(method, urlPath, body) {
    const res = await fetchImpl(`${baseUrl}${urlPath}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    if (!res.ok) {
      let detail = '';
      try {
        detail = await res.text();
      } catch {
        /* body unreadable — status alone still tells the story */
      }
      throw new Error(`Supabase API ${method} ${urlPath} failed: ${res.status} ${detail.slice(0, 400)}`);
    }
    return res.json();
  }

  return {
    /** Read-only. Deliberately does NOT require ownership — listing is safe. */
    listProjects: () => request('GET', '/v1/projects'),
    listOrganizations: () => request('GET', '/v1/organizations'),
    getProject: (ref) => request('GET', `/v1/projects/${ref}`),

    /**
     * Create a project. The password is generated and persisted by the caller
     * BEFORE this is called, and only ever travels in an HTTPS body.
     */
    async createProject({ name, orgSlug, dbPass, region = DEFAULT_REGION, acknowledgeNonEU = false, plan }) {
      if (typeof dbPass !== 'string' || dbPass.length < 32) {
        throw new GuardViolation('refusing to create a project with a database password shorter than 32 characters');
      }
      if (!EU_REGIONS.has(region) && !acknowledgeNonEU) {
        throw new GuardViolation(
          `refusing region "${region}": it is outside the EU. Ian and his clients are EU (GDPR). ` +
            `Pass acknowledgeNonEU:true to override deliberately.`,
        );
      }
      const project = await request('POST', '/v1/projects', {
        name,
        organization_id: orgSlug,
        region,
        db_pass: dbPass,
        ...(plan ? { plan } : {}),
      });
      // Record ownership immediately: every later verb depends on this row.
      if (project?.ref) recordOwned(project.ref, { registry, project: name });
      return project;
    },

    /**
     * Block until the database can actually answer queries.
     *
     * A freshly created project returns COMING_UP for a minute or two, and any
     * query against it fails with a 500 "ipv6 address is not defined" — an
     * error message that says nothing about the real cause. Observed live on
     * 2026-08-01: create returned, the very next call died on exactly this.
     * Provisioning is not complete when the API returns; it is complete when
     * the project says ACTIVE_HEALTHY.
     */
    async waitUntilHealthy(ref, { timeoutMs = 300_000, intervalMs = 5_000, sleep, onTick } = {}) {
      assertOwned(ref, { registry });
      const nap = sleep ?? ((ms) => new Promise((r) => setTimeout(r, ms)));
      const deadline = Date.now() + timeoutMs;
      let last = null;

      while (Date.now() < deadline) {
        const project = await request('GET', `/v1/projects/${ref}`);
        last = project?.status;
        if (last === 'ACTIVE_HEALTHY') return project;
        if (last === 'INACTIVE' || String(last).includes('FAILED')) {
          throw new Error(`project ${ref} reached terminal status ${last} — it will not become healthy`);
        }
        if (onTick) onTick(last);
        await nap(intervalMs);
      }
      throw new Error(
        `project ${ref} was still "${last}" after ${Math.round(timeoutMs / 1000)}s. ` +
          `Nothing is lost — re-run \`provision apply\` to continue from here.`,
      );
    },

    /** Destructive. Guarded. */
    async runSql(ref, query) {
      assertOwned(ref, { registry });
      return request('POST', `/v1/projects/${ref}/database/query`, { query });
    },

    /** Read-only but project-scoped, so still guarded. */
    async getApiKeys(ref) {
      assertOwned(ref, { registry });
      return request('GET', `/v1/projects/${ref}/api-keys?reveal=true`);
    },

    /**
     * DESTRUCTIVE AND IRREVERSIBLE. Guarded by assertOwned, which means a ref
     * in DENY_REFS can never reach it and neither can a project the factory
     * did not create. Callers must confirm with a human first — nothing in
     * this file does that for them.
     */
    async deleteProject(ref) {
      assertOwned(ref, { registry });
      return request('DELETE', `/v1/projects/${ref}`);
    },

    async getAuthConfig(ref) {
      assertOwned(ref, { registry });
      return request('GET', `/v1/projects/${ref}/config/auth`);
    },

    /**
     * Patch auth config, then READ IT BACK and assert every requested key
     * actually stuck. A silently-ignored PATCH that leaves public signup on is
     * exactly the failure this must catch — asserting is the whole point.
     */
    async setAuthConfig(ref, patch) {
      assertOwned(ref, { registry });
      await request('PATCH', `/v1/projects/${ref}/config/auth`, patch);
      const after = await request('GET', `/v1/projects/${ref}/config/auth`);
      for (const [k, want] of Object.entries(patch)) {
        if (after?.[k] !== want) {
          throw new Error(
            `auth config read-back failed for ${ref}: ${k} is ${JSON.stringify(after?.[k])}, ` +
              `expected ${JSON.stringify(want)}. The PATCH did not take effect — do not proceed.`,
          );
        }
      }
      return after;
    },
  };
}
