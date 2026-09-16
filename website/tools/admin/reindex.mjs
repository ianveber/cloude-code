#!/usr/bin/env node
/**
 * Rebuilds content/cms/index.json from the item files and public/uploads.
 * Run it if the index was edited by hand or a merge left it stale.
 */

import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { COLLECTION_KEYS, normalizeItem, indexEntry } from '../../src/cms.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const CMS = path.join(ROOT, 'content', 'cms');
const UPLOADS = path.join(ROOT, 'public', 'uploads');

const indexPath = path.join(CMS, 'index.json');
const previous = existsSync(indexPath) ? JSON.parse(await readFile(indexPath, 'utf8')) : { items: [], media: [] };

const items = [];
for (const key of COLLECTION_KEYS) {
  const dir = path.join(CMS, key);
  if (!existsSync(dir)) continue;
  for (const file of (await readdir(dir)).filter((f) => f.endsWith('.json')).sort()) {
    const raw = JSON.parse(await readFile(path.join(dir, file), 'utf8'));
    const { item, errors } = normalizeItem({ ...raw, slug: raw.slug ?? file.replace(/\.json$/, '') }, key);
    if (errors.length) {
      console.error(`${key}/${file}: ${errors.join(' ')}`);
      process.exit(1);
    }
    item.updatedAt = raw.updatedAt ?? item.updatedAt;
    items.push(indexEntry(item));
  }
}

const media = [];
if (existsSync(UPLOADS)) {
  const seen = new Map();
  for (const year of await readdir(UPLOADS)) {
    const dir = path.join(UPLOADS, year);
    if (!(await stat(dir)).isDirectory()) continue;
    for (const file of await readdir(dir)) {
      const m = file.match(/^(.+?)-(800|1600)\.(webp|jpg)$/);
      if (!m) continue;
      const src = `/uploads/${year}/${m[1]}`;
      const entry = seen.get(src) ?? { src, alt: '', width: 1600, height: 1000, webp: false, bytes: 0, name: m[1], uploadedAt: '' };
      const info = await stat(path.join(dir, file));
      entry.bytes += info.size;
      if (m[3] === 'webp') entry.webp = true;
      const when = info.mtime.toISOString();
      if (!entry.uploadedAt || when < entry.uploadedAt) entry.uploadedAt = when;
      seen.set(src, entry);
    }
  }
  for (const entry of seen.values()) {
    const old = previous.media?.find((x) => x.src === entry.src);
    media.push(old ? { ...entry, alt: old.alt, width: old.width, height: old.height, uploadedAt: old.uploadedAt } : entry);
  }
}

items.sort((a, b) => a.collection.localeCompare(b.collection) || (a.date < b.date ? 1 : a.date > b.date ? -1 : 0) || a.slug.localeCompare(b.slug));
media.sort((a, b) => (a.uploadedAt < b.uploadedAt ? 1 : -1));
await writeFile(indexPath, JSON.stringify({ items, media }, null, 2) + '\n');
console.log(`index.json: ${items.length} vsebin, ${media.length} slik`);
