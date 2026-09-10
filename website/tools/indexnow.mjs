#!/usr/bin/env node
/**
 * Submit every URL in dist/sitemap.xml to IndexNow, which feeds Bing (and so
 * Copilot), Yandex, Naver, Seznam and Yep in one call. Google does not use
 * IndexNow; it reads the sitemap. Run after a deploy:
 *
 *   npm run indexnow
 *
 * The key lives in content/site.mjs and is served at /<key>.txt by the build.
 */

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import site from '../content/site.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function main() {
  if (!site.indexNowKey) throw new Error('site.indexNowKey is empty.');
  const sitemap = await readFile(path.join(ROOT, 'dist', 'sitemap.xml'), 'utf8');
  const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const host = new URL(site.origin).host;
  const body = { host, key: site.indexNowKey, keyLocation: `${site.origin}/${site.indexNowKey}.txt`, urlList };
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });
  console.log(`IndexNow: ${urlList.length} URLs, HTTP ${res.status} ${res.status === 200 || res.status === 202 ? 'accepted' : await res.text()}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
