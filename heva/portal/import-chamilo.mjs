#!/usr/bin/env node
/* =====================================================================
   Arhiv Heva — import the real archive out of a Chamilo export.

   Zero dependencies: Node 18+ built-in fetch only.

   It signs in as a MANAGER account and writes through the normal RLS
   policies — it never uses the secret key. If this script can write it,
   it's because the manager role is genuinely allowed to; the security
   model is not bypassed to run the migration.

   USAGE
     # 1. see what it WOULD do — writes nothing
     node import-chamilo.mjs --source ~/Downloads/arhiv

     # 2. after checking the mapping, actually do it
     node import-chamilo.mjs --source ~/Downloads/arhiv --commit --replace

   FLAGS
     --source <dir>   extracted Chamilo export (required)
     --commit         actually write (default is a dry run)
     --replace        delete the seeded PLACEHOLDER documents for each
                      matched building first (recommended for the first
                      real run — otherwise you get both)
     --map <file>     JSON { "COURSE DIR NAME": "building-slug" } for any
                      folder whose name doesn't match a building
     --only <slug>    import a single building (good for a first trial)

   EXPECTED LAYOUT — one directory per objekt, folders inside:

     arhiv/
       RAZGLEDNA 2/
         GASILNIKI/            Servisni zapisnik 2026.pdf
         RAČUNI/               Račun 07-2026.pdf
       GOSPOSKA 2/
         ...

   Chamilo 1.9 keeps course files at <chamilo>/courses/<CODE>/document/,
   so each course's "document" directory, renamed to the objekt name,
   is exactly the layout above.
   ===================================================================== */

import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative, extname, basename } from 'node:path';
import { existsSync, readFileSync } from 'node:fs';

/* ── args ──────────────────────────────────────────────────────────── */
const argv = process.argv.slice(2);
const arg = n => { const i = argv.indexOf(n); return i === -1 ? null : argv[i + 1]; };
const has = n => argv.includes(n);

const SOURCE  = arg('--source');
const COMMIT  = has('--commit');
const REPLACE = has('--replace');
const ONLY    = arg('--only');
const MAPFILE = arg('--map');

if (!SOURCE) {
  console.error('Missing --source <dir>.  See the header of this file for usage.');
  process.exit(1);
}
if (!existsSync(SOURCE)) {
  console.error(`--source does not exist: ${SOURCE}`);
  process.exit(1);
}

/* ── config ────────────────────────────────────────────────────────── */
const ENV = Object.fromEntries(
  readFileSync(new URL('./.env.local', import.meta.url), 'utf8')
    .split('\n').filter(l => l.trim() && !l.startsWith('#') && l.includes('='))
    .map(l => { const [k, ...r] = l.split('='); return [k.trim(), r.join('=').trim()]; })
);
const URL_ = ENV.NEXT_PUBLIC_SUPABASE_URL;
const KEY  = ENV.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/* Manager credentials come from the environment only. There is deliberately
   no default password here — a working credential committed to git stays
   valid long after the demo accounts are supposed to be gone. */
const EMAIL = process.env.HEVA_EMAIL;
const PASS  = process.env.HEVA_PASSWORD;
if (!EMAIL || !PASS) {
  console.error(
    'Missing manager credentials.\n' +
    '  HEVA_EMAIL=... HEVA_PASSWORD=... node import-chamilo.mjs --source <dir>\n' +
    'The importer signs in as a manager and writes through normal RLS,\n' +
    'so it needs a real account — never the secret key.'
  );
  process.exit(1);
}

const BUCKET = 'dokumenti';

/* Chamilo internals that are not documents. */
const SKIP_DIRS  = new Set([
  'chat_files', 'shared_folder', 'Mape uporabnikov', 'Zgodovina konverzacije iz klepeta',
  'certificates', 'HotPotatoes_files', '__MACOSX', '.git'
]);
const SKIP_FILES = new Set(['.htaccess', '.DS_Store', 'Thumbs.db', 'index.html']);

const MIME = {
  '.pdf':'application/pdf', '.doc':'application/msword',
  '.docx':'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xls':'application/vnd.ms-excel',
  '.xlsx':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.png':'image/png', '.gif':'image/gif',
  '.txt':'text/plain', '.csv':'text/csv', '.zip':'application/zip'
};
const mimeOf = f => MIME[extname(f).toLowerCase()] || 'application/octet-stream';

const slugify = s => s.toLowerCase()
  .replace(/[čć]/g,'c').replace(/š/g,'s').replace(/ž/g,'z').replace(/đ/g,'d')
  .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

/* Supabase Storage rejects non-ASCII object keys outright ("InvalidKey"),
   and this archive is full of them — RAČUNI, Račun 07-2026.pdf, and so on.
   So the KEY gets folded to ASCII while documents.name / folders.name keep
   the real Slovene text. Only the storage path changes; nothing the user
   reads does. Diacritics are folded rather than stripped so "RAČUNI" and
   "RACUNI" don't collide into the same key. */
const asciiKey = s => s
  .normalize('NFD').replace(/[̀-ͯ]/g, '')   // é -> e, č -> c
  .replace(/[đĐ]/g, 'd')
  .replace(/[^A-Za-z0-9._\-/]+/g, '-')
  .replace(/-{2,}/g, '-')
  .replace(/(^|\/)-+|-+(\/|$)/g, '$1$2');

const fmtMB = b => (b / 1024 / 1024).toFixed(2).replace('.', ',') + ' MB';

/* ── api ───────────────────────────────────────────────────────────── */
let TOKEN = null;
const H = (extra = {}) => ({
  apikey: KEY,
  Authorization: `Bearer ${TOKEN || KEY}`,
  ...extra
});

async function login() {
  const r = await fetch(`${URL_}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { apikey: KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASS })
  });
  const j = await r.json();
  if (!j.access_token) throw new Error(`login failed: ${j.msg || j.error_description || r.status}`);
  TOKEN = j.access_token;
}

async function rest(path, opts = {}) {
  const r = await fetch(`${URL_}/rest/v1/${path}`, {
    ...opts,
    headers: H({ 'Content-Type': 'application/json', ...(opts.headers || {}) })
  });
  const text = await r.text();
  if (!r.ok) throw new Error(`${path} -> ${r.status} ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : null;
}

async function uploadFile(storagePath, buf, contentType) {
  const r = await fetch(`${URL_}/storage/v1/object/${BUCKET}/${encodeURI(storagePath)}`, {
    method: 'POST',
    headers: H({ 'Content-Type': contentType, 'x-upsert': 'true' }),
    body: buf
  });
  if (!r.ok) throw new Error(`upload ${storagePath} -> ${r.status} ${(await r.text()).slice(0, 200)}`);
}

/* ── walk ──────────────────────────────────────────────────────────── */
async function walk(dir, out = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') && e.name !== '.') continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      await walk(p, out);
    } else if (e.isFile() && !SKIP_FILES.has(e.name)) {
      out.push(p);
    }
  }
  return out;
}

/* ── main ──────────────────────────────────────────────────────────── */
const log = (...a) => console.log(...a);

(async () => {
  log(`\nArhiv Heva — Chamilo import`);
  log(`source : ${SOURCE}`);
  log(`mode   : ${COMMIT ? 'COMMIT (writes)' : 'DRY RUN (writes nothing)'}${REPLACE ? ' +replace placeholders' : ''}\n`);

  await login();
  log(`signed in as ${EMAIL}`);

  const buildings = await rest('buildings?select=id,name,slug&order=name');
  if (!buildings.length) throw new Error('no buildings visible — is this account a manager?');
  log(`${buildings.length} objects visible\n`);

  const bySlug = new Map(buildings.map(b => [b.slug, b]));
  const byName = new Map(buildings.map(b => [b.name.toLowerCase().trim(), b]));
  const manual = MAPFILE ? JSON.parse(readFileSync(MAPFILE, 'utf8')) : {};

  const courseDirs = (await readdir(SOURCE, { withFileTypes: true }))
    .filter(e => e.isDirectory() && !SKIP_DIRS.has(e.name) && !e.name.startsWith('.'))
    .map(e => e.name);

  if (!courseDirs.length) throw new Error(`no directories inside ${SOURCE} — is the export extracted?`);

  /* --- map each export directory to a building --- */
  const matched = [], unmatched = [];
  for (const d of courseDirs) {
    const b = (manual[d] && bySlug.get(manual[d]))
           || byName.get(d.toLowerCase().trim())
           || bySlug.get(slugify(d));
    b ? matched.push({ dir: d, building: b }) : unmatched.push(d);
  }

  log('MAPPING');
  for (const m of matched) log(`  ok    ${m.dir}  ->  ${m.building.name}`);
  for (const u of unmatched) log(`  MISS  ${u}  ->  ?  (add to --map as "${u}": "<slug>")`);
  log('');

  if (unmatched.length) {
    log(`⚠️  ${unmatched.length} folder(s) unmatched. They will be SKIPPED.`);
    log(`   Map them with --map file.json, or rename the folders to match the object names.\n`);
  }

  const targets = ONLY ? matched.filter(m => m.building.slug === ONLY) : matched;
  if (ONLY && !targets.length) throw new Error(`--only ${ONLY} matched nothing`);

  let totalFiles = 0, totalBytes = 0, uploaded = 0, failed = [];

  for (const { dir, building } of targets) {
    const root  = join(SOURCE, dir);
    const files = await walk(root);
    if (!files.length) { log(`— ${building.name}: no files, skipped`); continue; }

    const bytes = (await Promise.all(files.map(async f => (await stat(f)).size)))
                    .reduce((a, b) => a + b, 0);
    totalFiles += files.length; totalBytes += bytes;
    log(`${building.name}: ${files.length} files · ${fmtMB(bytes)}`);

    if (!COMMIT) {
      for (const f of files.slice(0, 3)) log(`    ${relative(root, f)}`);
      if (files.length > 3) log(`    … and ${files.length - 3} more`);
      continue;
    }

    /* Placeholder rows carry seeded storage_paths that were never uploaded.
       Clearing them first keeps the real import from doubling the list. */
    if (REPLACE) {
      await rest(`documents?building_id=eq.${building.id}`, { method: 'DELETE' });
      await rest(`folders?building_id=eq.${building.id}`,   { method: 'DELETE' });
    }

    /* folders: one row per distinct directory under the object */
    const folderNames = [...new Set(files.map(f => {
      const rel = relative(root, f);
      const parts = rel.split('/');
      return parts.length > 1 ? parts[0] : 'Dokumenti';
    }))];

    const existing = await rest(`folders?building_id=eq.${building.id}&select=id,name`);
    const folderId = new Map(existing.map(f => [f.name, f.id]));
    const toCreate = folderNames.filter(n => !folderId.has(n));
    if (toCreate.length) {
      const created = await rest('folders', {
        method: 'POST',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify(toCreate.map(name => ({ building_id: building.id, name })))
      });
      created.forEach(f => folderId.set(f.name, f.id));
    }

    const usedKeys = new Set();
    for (const f of files) {
      const rel      = relative(root, f);
      const parts    = rel.split('/');
      const folder   = parts.length > 1 ? parts[0] : 'Dokumenti';
      const name     = basename(f);
      const st       = await stat(f);

      // ASCII-fold the key, then guarantee uniqueness — folding could in
      // principle map two distinct names onto one, and storage_path is
      // UNIQUE in the schema.
      let storagePath = `${building.slug}/${asciiKey(rel)}`;
      if (usedKeys.has(storagePath)) {
        const ext = extname(storagePath);
        let n = 2;
        while (usedKeys.has(`${storagePath.slice(0, -ext.length || undefined)}-${n}${ext}`)) n++;
        storagePath = `${storagePath.slice(0, -ext.length || undefined)}-${n}${ext}`;
      }
      usedKeys.add(storagePath);

      try {
        await uploadFile(storagePath, await readFile(f), mimeOf(name));
        await rest('documents', {
          method: 'POST',
          headers: { Prefer: 'resolution=merge-duplicates' },
          body: JSON.stringify({
            building_id: building.id,
            folder_id:   folderId.get(folder) || null,
            name,
            storage_path: storagePath,
            size_bytes:  st.size,
            mime_type:   mimeOf(name),
            created_at:  st.mtime.toISOString()
          })
        });
        uploaded++;
        if (uploaded % 25 === 0) log(`    … ${uploaded} uploaded`);
      } catch (e) {
        failed.push({ file: rel, error: String(e.message || e).slice(0, 160) });
      }
    }
  }

  log('\n────────────────────────────────────────');
  log(`objects   : ${targets.length}`);
  log(`files     : ${totalFiles}`);
  log(`size      : ${fmtMB(totalBytes)}`);
  if (COMMIT) {
    log(`uploaded  : ${uploaded}`);
    log(`failed    : ${failed.length}`);
    failed.slice(0, 20).forEach(f => log(`   ✗ ${f.file} — ${f.error}`));
    if (failed.length > 20) log(`   … and ${failed.length - 20} more`);
  } else {
    log(`\nDRY RUN — nothing was written.`);
    log(`Re-run with --commit --replace once the mapping above looks right.`);
  }
  log('');
  process.exit(failed.length ? 1 : 0);
})().catch(e => { console.error(`\nERROR: ${e.message}\n`); process.exit(1); });
