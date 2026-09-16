#!/usr/bin/env node
/**
 * Smoke test for the admin: runs the API against a temporary copy of the
 * content folder and walks through login, save, publish, upload, preview,
 * rename, subpage, delete. No browser and no network.
 *
 *   node tools/admin/check.mjs
 */

import { mkdtemp, cp, rm, readFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { hashPassword } from '../../api/_lib/auth.mjs';
import { createAdminHandler } from '../../api/_lib/handler.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const work = await mkdtemp(path.join(tmpdir(), 'ais-admin-'));
await mkdir(path.join(work, 'content', 'cms'), { recursive: true });
await mkdir(path.join(work, 'public', 'uploads'), { recursive: true });
if (existsSync(path.join(ROOT, 'content', 'cms', 'index.json'))) {
  await cp(path.join(ROOT, 'content', 'cms'), path.join(work, 'content', 'cms'), { recursive: true });
}

const PASSWORD = 'test-geslo-1234567';
let changes = 0;
const handle = createAdminHandler({
  root: work,
  store: 'local',
  env: { ADMIN_PASSWORD_HASH: hashPassword(PASSWORD), ADMIN_SESSION_SECRET: 'secret-for-the-test' },
  onChange: () => {
    changes += 1;
  },
});

const server = createServer(handle);
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}/api/admin`;
let cookie = '';

async function call(method, route, body, { raw = false, headers = {} } = {}) {
  const res = await fetch(base + route, {
    method,
    headers: { 'content-type': 'application/json', 'x-ais-admin': '1', origin: `http://127.0.0.1:${server.address().port}`, cookie, ...headers },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const set = res.headers.get('set-cookie');
  if (set) cookie = set.split(';')[0];
  return { status: res.status, body: raw ? await res.text() : await res.json() };
}

let failures = 0;
const check = (ok, label) => {
  console.log(`${ok ? '  ok ' : ' FAIL'} ${label}`);
  if (!ok) failures += 1;
};

try {
  let r = await call('GET', '/me');
  check(r.status === 401, 'brez prijave: 401');

  r = await call('POST', '/login', { password: 'napacno' });
  check(r.status === 401, 'napačno geslo: 401');

  r = await call('POST', '/login', { password: PASSWORD }, { headers: { origin: 'http://evil.example' } });
  check(r.status === 403, 'tuj izvor: 403');

  r = await call('POST', '/login', { password: PASSWORD });
  check(r.status === 200 && cookie.startsWith('ais_admin='), 'prijava: piškotek');

  r = await call('GET', '/me');
  check(r.status === 200 && r.body.authenticated, 'prijavljen');

  r = await call('PUT', '/items/blog/test-zapis', { title: 'Testni zapis', summary: 'Kratek povzetek.', body: '# Uvod\n\nBesedilo **zapisa**.', date: '2026-09-16' });
  check(r.status === 200 && r.body.item.status === 'draft' && r.body.href === '/blog/test-zapis/', 'osnutek shranjen');

  r = await call('PUT', '/items/blog/test-zapis', { title: 'Testni zapis', summary: 'Kratek povzetek.', body: '', status: 'published', date: '2026-09-16' });
  check(r.status === 400 && /Besedilo je prazno/.test(r.body.error), 'objava praznega besedila zavrnjena');

  const jpg = Buffer.from('ffd8ffe000104a46494600010100000100010000ffd9', 'hex').toString('base64');
  const webp = Buffer.concat([Buffer.from('RIFF'), Buffer.from([4, 0, 0, 0]), Buffer.from('WEBPVP8 ')]).toString('base64');
  r = await call('POST', '/upload', {
    name: 'Moja Slika.png',
    alt: 'Opis slike',
    width: 1600,
    height: 1000,
    files: [
      { suffix: '-800.jpg', data: jpg },
      { suffix: '-1600.jpg', data: jpg },
      { suffix: '-800.webp', data: webp },
      { suffix: '-1600.webp', data: webp },
    ],
  });
  check(r.status === 200 && r.body.picture.src === '/uploads/' + new Date().getFullYear() + '/moja-slika', 'slika naložena');
  const pic = r.body.picture;
  check(existsSync(path.join(work, 'public', pic.src.slice(1) + '-1600.jpg')), 'datoteka slike na disku');

  r = await call('POST', '/upload', { name: 'x.png', files: [{ suffix: '-800.jpg', data: Buffer.from('not an image').toString('base64') }] });
  check(r.status === 400, 'ne-slika zavrnjena');

  const full = {
    title: 'Testni zapis',
    summary: 'Kratek povzetek testnega zapisa za preverjanje.',
    body: '# Uvod\n\nBesedilo **zapisa** in ![Slika](' + pic.src + ' "Podnapis").',
    date: '2026-09-16',
    status: 'published',
    picture: { ...pic, alt: 'Opis slike' },
    seo: { metaTitle: 'Testni zapis | AIS Slovenia', metaDescription: 'Meta opis testnega zapisa, ki je dovolj dolg, da ustreza priporočilu za iskalnike in za odgovore.', keywords: ['test', 'zapis'] },
    links: [{ label: 'Kontakt', href: '/kontakt/' }],
  };
  r = await call('PUT', '/items/blog/test-zapis', full);
  check(r.status === 200 && r.body.item.status === 'published' && r.body.item.publishedAt, 'objavljeno');

  r = await call('POST', '/preview', { ...full, collection: 'blog', slug: 'test-zapis' }, { raw: true });
  check(r.status === 200 && r.body.includes('<h1') && r.body.includes('Testni zapis') && r.body.includes('cms-preview-bar') && r.body.includes(pic.src + '-1600.jpg'), 'predogled je cela stran s sliko');
  check(/<meta name="robots" content="noindex/.test(r.body), 'predogled je noindex');

  r = await call('PUT', '/items/blog/drugi-del', { title: 'Drugi del', summary: 'Podstran.', body: 'Vsebina.', date: '2026-09-17', parent: 'test-zapis' });
  check(r.status === 200 && r.body.href === '/blog/test-zapis/drugi-del/', 'podstran pod nadrejeno');

  r = await call('PUT', '/items/blog/test-zapis', { ...full, parent: 'drugi-del' });
  check(r.status === 400, 'krog nadrejenih zavrnjen');

  r = await call('PUT', '/items/blog/testni-zapis?from=test-zapis', full);
  check(r.status === 200 && !existsSync(path.join(work, 'content/cms/blog/test-zapis.json')) && existsSync(path.join(work, 'content/cms/blog/testni-zapis.json')), 'preimenovanje premakne datoteko');
  const child = JSON.parse(await readFile(path.join(work, 'content/cms/blog/drugi-del.json'), 'utf8'));
  check(child.parent === 'testni-zapis', 'podstran sledi novemu imenu');

  r = await call('GET', '/items?collection=blog');
  check(r.status === 200 && r.body.items.length === 2, 'seznam ima dva zapisa');

  r = await call('GET', '/pages');
  check(r.status === 200 && r.body.pages.some((p) => p.path === '/blog/testni-zapis/drugi-del/'), 'izbirnik strani vidi podstran');

  r = await call('DELETE', '/media', { src: pic.src });
  check(r.status === 409, 'uporabljene slike ni mogoče izbrisati');

  r = await call('POST', '/items/blog/testni-zapis/status', { status: 'draft' });
  check(r.status === 200 && r.body.item.status === 'draft', 'umik iz objave');

  r = await call('DELETE', '/items/blog/testni-zapis');
  check(r.status === 200, 'izbris');
  const orphan = JSON.parse(await readFile(path.join(work, 'content/cms/blog/drugi-del.json'), 'utf8'));
  check(orphan.parent === '', 'podstran po izbrisu nadrejene ostane brez nadrejene');

  r = await call('DELETE', '/items/blog/drugi-del');
  r = await call('DELETE', '/media', { src: pic.src });
  check(r.status === 200 && !existsSync(path.join(work, 'public', pic.src.slice(1) + '-1600.jpg')), 'neuporabljena slika izbrisana');

  const idx = JSON.parse(await readFile(path.join(work, 'content/cms/index.json'), 'utf8'));
  check(idx.items.length === 0 && idx.media.length === 0, 'kazalo prazno');
  check(changes >= 8, `spremembe sprožijo ponovno gradnjo (${changes})`);

  r = await call('POST', '/logout');
  r = await call('GET', '/me');
  check(r.status === 401, 'odjava');
} finally {
  server.close();
  await rm(work, { recursive: true, force: true });
}

console.log(failures ? `\n${failures} napak.` : '\nAdmin: vse preverjeno.');
process.exit(failures ? 1 : 0);
