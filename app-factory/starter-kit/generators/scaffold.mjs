/**
 * scaffold.mjs — spec.json + template → a real app directory.
 *
 * Three kinds of file, and the distinction matters when the kit is later
 * upgraded under an app that has since been edited:
 *
 *   verbatim   copied byte for byte (auth, http, tokens) — safe to re-copy
 *   subst      copied with {{PLACEHOLDER}} replaced — safe to re-copy
 *   generated  written from the spec (routes, schema, RLS cases) — regenerate
 *   seed       written once, then owned by the app (pages) — never overwritten
 *
 * Everything here is deterministic: same spec in, same bytes out. That is what
 * lets `kit doctor` tell an intentional edit from drift later on.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { generateSchema } from './schema.mjs';
import { generateRlsTests } from './rlstests.mjs';

const KIT_ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const TRACK = path.join(KIT_ROOT, 'tracks', 'app');

/** Files the app owns after first write — regenerating would discard real work. */
const SEED = new Set([
  'src/app/page.tsx',      // public landing
  'src/app/app/page.tsx',  // authed home — a REAL /app segment, not a route
                           // group: `(app)` creates no URL segment, so it would
                           // have served the signed-in page from / while
                           // routes.ts protected an /app that did not exist.
  'src/app/login/page.tsx',
  'src/app/layout.tsx',
]);

function walk(dir, base = dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, base, out);
    else out.push(path.relative(base, full));
  }
  return out;
}

function substitute(text, vars) {
  return text.replace(/\{\{([A-Z_]+)\}\}/g, (whole, key) => {
    if (!(key in vars)) {
      // A placeholder with no value would ship literal {{FOO}} to a user. Fail
      // loudly at scaffold time instead.
      throw new Error(`template placeholder {{${key}}} has no value in the spec`);
    }
    return vars[key];
  });
}

export function scaffold(spec, outDir, { force = false } = {}) {
  const slug = spec.slug || spec.project;
  if (!slug) throw new Error('spec needs a project or slug');

  const vars = {
    APP_NAME: spec.name || spec.project || slug,
    APP_SLUG: slug,
    APP_DESCRIPTION: spec.description || spec.oneLiner || `${spec.name || slug}`,
    LOCALE: spec.i18n?.locale || 'en',
  };

  const written = [];
  const skipped = [];

  for (const rel of walk(TRACK)) {
    const src = path.join(TRACK, rel);
    // package.json ships as package.json.tmpl so the kit's own tooling never
    // mistakes the template for a real manifest.
    const dest = path.join(outDir, rel.replace(/\.tmpl$/, ''));
    const relOut = path.relative(outDir, dest);

    if (SEED.has(relOut) && fs.existsSync(dest) && !force) {
      skipped.push(relOut);
      continue;
    }

    const body = substitute(fs.readFileSync(src, 'utf8'), vars);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, body);
    written.push(relOut);
  }

  // ── generated from the spec ────────────────────────────────────────────────

  // routes.ts is the single source both middleware and Gate 3's anonymous probe
  // read, so they cannot drift apart.
  const protectedPrefixes = Array.isArray(spec.protectedRoutes) && spec.protectedRoutes.length
    ? spec.protectedRoutes
    : ['/app', '/api'];
  const routesTs =
    `/**\n * Generated from spec.protectedRoutes — do not edit by hand.\n` +
    ` * Gate 3 probes exactly these paths anonymously, so middleware and the\n` +
    ` * deployed check cannot disagree about what is protected.\n */\n` +
    `export const PROTECTED_PREFIXES: string[] = ${JSON.stringify(protectedPrefixes)};\n` +
    `export const AUTH_ROUTES: string[] = ["/login", "/reset-password"];\n` +
    `export const HOME_ROUTE = ${JSON.stringify(spec.homeRoute || '/app')};\n`;
  fs.writeFileSync(path.join(outDir, 'src', 'lib', 'routes.ts'), routesTs);
  written.push('src/lib/routes.ts');

  if (spec.data?.tables?.length) {
    fs.mkdirSync(path.join(outDir, 'supabase', 'tests', 'cases'), { recursive: true });
    fs.writeFileSync(path.join(outDir, 'supabase', 'schema.sql'), generateSchema(spec));
    written.push('supabase/schema.sql');

    const { files } = generateRlsTests(spec);
    for (const [rel, body] of Object.entries(files)) {
      const p = path.join(outDir, 'supabase', 'tests', rel);
      fs.mkdirSync(path.dirname(p), { recursive: true });
      fs.writeFileSync(p, body);
      written.push(`supabase/tests/${rel}`);
    }
  }

  return { written, skipped, vars, protectedPrefixes };
}
