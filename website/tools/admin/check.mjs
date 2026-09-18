#!/usr/bin/env node
/**
 * Smoke test for IHG: runs the API against a temporary copy of the content
 * folder and walks through login, save, publish, upload, preview, rename,
 * subpage, move between collections, categories, the page-view beacon and
 * analytics, delete. No browser and no network.
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
import { createAnalytics, createHitHandler } from '../../api/_lib/analytics.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const work = await mkdtemp(path.join(tmpdir(), 'ihg-'));
await mkdir(path.join(work, 'content', 'cms'), { recursive: true });
await mkdir(path.join(work, 'public', 'uploads'), { recursive: true });
if (existsSync(path.join(ROOT, 'content', 'cms', 'index.json'))) {
  await cp(path.join(ROOT, 'content', 'cms'), path.join(work, 'content', 'cms'), { recursive: true });
}

const PASSWORD = 'test-geslo-1234567';
let changes = 0;
const analytics = createAnalytics({ root: work, env: {} });
const handle = createAdminHandler({
  root: work,
  store: 'local',
  env: { ADMIN_PASSWORD_HASH: hashPassword(PASSWORD), ADMIN_SESSION_SECRET: 'secret-for-the-test' },
  analytics,
  onChange: () => {
    changes += 1;
  },
});
const hit = createHitHandler({ analytics });

const server = createServer((req, res) => (req.url.startsWith('/api/hit') ? hit(req, res) : handle(req, res)));
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const origin = `http://127.0.0.1:${server.address().port}`;
const base = `${origin}/api/admin`;
let cookie = '';

async function call(method, route, body, { raw = false, headers = {}, url = null } = {}) {
  const res = await fetch(url ?? base + route, {
    method,
    headers: { 'content-type': 'application/json', 'x-ais-admin': '1', origin, cookie, ...headers },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const set = res.headers.get('set-cookie');
  if (set) cookie = set.split(';')[0];
  if (res.status === 204) return { status: 204, body: null };
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

  /* categories */
  r = await call('GET', '/categories');
  check(r.status === 200 && r.body.categories.blog.includes('Osnove'), 'privzete kategorije');
  r = await call('PUT', '/categories', { categories: { ...r.body.categories, blog: ['Osnove', 'Nova rubrika'] } });
  check(r.status === 200 && r.body.categories.blog.includes('Nova rubrika'), 'kategorije shranjene');

  /* html body with hostile markup */
  const html = '<h2>Uvod</h2><p onclick="x()">Besedilo <b>zapisa</b> <span class="c-blue" style="color:red">modro</span> <script>alert(1)</script></p><figure class="cms-figure cms-figure--w50 cms-figure--right"><img data-src="/uploads/2026/x" src="/uploads/2026/x-1600.jpg" alt="Slika"><figcaption>Podnapis</figcaption></figure>';
  r = await call('PUT', '/items/blog/test-zapis', { title: 'Testni zapis', summary: 'Kratek povzetek.', format: 'html', body: html, date: '2026-09-16', category: 'Osnove' });
  check(r.status === 200 && r.body.item.status === 'draft' && r.body.href === '/blog/test-zapis/', 'osnutek shranjen');
  check(r.body.item.body.includes('<strong>zapisa</strong>') && !/onclick|script|style=/.test(r.body.item.body) && r.body.item.body.includes('class="c-blue"'), 'HTML očiščen, razredi ostanejo');
  check(r.body.item.kicker === 'Osnove', 'kategorija shranjena kot oznaka');

  r = await call('PUT', '/items/blog/test-zapis', { title: 'Testni zapis', summary: 'Kratek povzetek.', format: 'html', body: '', status: 'published', date: '2026-09-16' });
  check(r.status === 400 && /Besedilo je prazno/.test(r.body.error), 'objava praznega besedila zavrnjena');

  const jpg = Buffer.from('ffd8ffe000104a46494600010100000100010000ffd9', 'hex').toString('base64');
  const webp = Buffer.concat([Buffer.from('RIFF'), Buffer.from([4, 0, 0, 0]), Buffer.from('WEBPVP8 ')]).toString('base64');
  r = await call('POST', '/upload', {
    name: 'Moja Slika.png',
    alt: 'Opis slike',
    width: 1200,
    height: 750,
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
    format: 'html',
    body: `<h2>Uvod</h2><p>Besedilo <strong>zapisa</strong> in povezava na <a href="/kontakt/">kontakt</a>.</p><figure class="cms-figure cms-figure--w100 cms-figure--center"><img data-src="${pic.src}" src="${pic.src}-1600.jpg" alt="Slika"><figcaption>Podnapis</figcaption></figure><p class="align-center"><a class="cms-cta" href="/kontakt/">Gumb</a></p>`,
    date: '2026-09-16',
    status: 'published',
    picture: { ...pic, alt: 'Opis slike', caption: 'Podnapis glavne slike' },
    cta: { label: 'Pišite nam', href: '/kontakt/' },
    seo: {
      metaTitle: 'Testni zapis | AIS Slovenia',
      metaDescription: 'Meta opis testnega zapisa, ki je dovolj dolg, da ustreza priporočilu za iskalnike in za odgovore.',
      keywords: ['test', 'zapis'],
      ogTitle: 'Deljeni naslov',
      ogDescription: 'Deljeni opis.',
      canonical: 'https://ais-slovenia.si/blog/test-zapis/',
      schemaType: 'BlogPosting',
      nofollow: true,
      faq: [{ q: 'Kaj je to?', a: 'Preizkus.' }],
    },
    links: [{ label: 'Kontakt', href: '/kontakt/' }],
  };
  r = await call('PUT', '/items/blog/test-zapis', full);
  check(r.status === 200 && r.body.item.status === 'published' && r.body.item.publishedAt, 'objavljeno');

  r = await call('POST', '/preview', { ...full, collection: 'blog', slug: 'test-zapis' }, { raw: true });
  check(r.status === 200 && r.body.includes('<h1') && r.body.includes('cms-preview-bar') && r.body.includes(pic.src + '-1600.jpg'), 'predogled je cela stran s sliko');
  check(/<meta name="robots" content="noindex/.test(r.body), 'predogled je noindex');
  check(/"@type":\s*"BlogPosting"/.test(r.body) && /"@type":\s*"FAQPage"/.test(r.body) && r.body.includes('class="faq-item"'), 'BlogPosting in FAQ v strukturiranih podatkih in na strani');
  check(r.body.includes('property="og:title" content="Deljeni naslov"') && r.body.includes('cms-figure--w100') && r.body.includes('class="cms-cta"') && r.body.includes('Pišite nam'), 'OG naslov, slika v besedilu, gumb in CTA');
  check(r.body.includes(`${pic.src}-1600.jpg 1200w`), 'srcset navaja pravo širino');

  r = await call('PUT', '/items/blog/drugi-del', { title: 'Drugi del', summary: 'Podstran.', body: 'Vsebina.', date: '2026-09-17', parent: 'test-zapis' });
  check(r.status === 200 && r.body.href === '/blog/test-zapis/drugi-del/', 'podstran pod nadrejeno');
  r = await call('PUT', '/items/blog/test-zapis', { ...full, parent: 'drugi-del' });
  check(r.status === 400, 'krog nadrejenih zavrnjen');

  r = await call('PUT', '/items/blog/testni-zapis?from=test-zapis', full);
  check(r.status === 200 && !existsSync(path.join(work, 'content/cms/blog/test-zapis.json')) && existsSync(path.join(work, 'content/cms/blog/testni-zapis.json')), 'preimenovanje premakne datoteko');
  const child = JSON.parse(await readFile(path.join(work, 'content/cms/blog/drugi-del.json'), 'utf8'));
  check(child.parent === 'testni-zapis', 'podstran sledi novemu imenu');

  /* move to another collection */
  r = await call('PUT', '/items/novice/testni-zapis?from=testni-zapis&fromCollection=blog', { ...full, status: 'draft' });
  check(r.status === 200 && r.body.href === '/novice/testni-zapis/' && !existsSync(path.join(work, 'content/cms/blog/testni-zapis.json')) && existsSync(path.join(work, 'content/cms/novice/testni-zapis.json')), 'premik v drugo rubriko');
  const orphan = JSON.parse(await readFile(path.join(work, 'content/cms/blog/drugi-del.json'), 'utf8'));
  check(orphan.parent === '', 'podstran po premiku ostane v stari rubriki brez nadrejene');

  r = await call('GET', '/items?collection=novice');
  check(r.status === 200 && r.body.items.length === 1, 'seznam novic ima en zapis');
  r = await call('GET', '/pages');
  check(r.status === 200 && r.body.pages.some((p) => p.path === '/blog/drugi-del/'), 'izbirnik strani vidi podstran');

  /* the beacon and the analytics view */
  r = await call('POST', '/hit', { p: '/blog/drugi-del/', r: 'www.google.com', w: 390, s: 'abcdef1234' }, { url: `${origin}/api/hit`, headers: { 'x-ais-admin': '' } });
  check(r.status === 204, 'beacon sprejet');
  r = await call('POST', '/hit', { p: '/blog/drugi-del/', w: 1440, s: 'abcdef1234' }, { url: `${origin}/api/hit` });
  r = await call('POST', '/hit', { p: '/', w: 800 }, { url: `${origin}/api/hit` }); /* no id: the daily code counts the visit */
  r = await call('POST', '/hit', { p: '/', w: 800 }, { url: `${origin}/api/hit` });
  r = await call('POST', '/hit', { p: '/admin/', w: 1440 }, { url: `${origin}/api/hit` });
  r = await call('POST', '/hit', { p: '/', w: 800 }, { url: `${origin}/api/hit`, headers: { 'user-agent': 'Googlebot/2.1' } });
  await analytics.flush?.();
  r = await call('GET', '/analytics?days=7');
  check(r.status === 200 && r.body.configured && r.body.totals.views === 4 && r.body.totals.sessions === 2, `analitika šteje oglede in obiske, tudi brez piškotka (${r.body.totals?.views}/${r.body.totals?.sessions})`);
  check(r.body.pages[0]?.key === '/blog/drugi-del/' && r.body.refs[0]?.key === 'google.com' && r.body.devices.phone === 1 && r.body.devices.desktop === 1 && r.body.devices.tablet === 2, 'strani, viri in naprave');
  check(!r.body.pages.some((p) => p.key.startsWith('/admin')), 'admin in roboti se ne štejejo');

  r = await call('DELETE', '/media', { src: pic.src });
  check(r.status === 409, 'uporabljene slike ni mogoče izbrisati');
  r = await call('POST', '/items/novice/testni-zapis/status', { status: 'published' });
  check(r.status === 200 && r.body.item.status === 'published', 'objava prek stanja');
  r = await call('POST', '/items/novice/testni-zapis/status', { status: 'draft' });
  check(r.status === 200 && r.body.item.status === 'draft', 'umik iz objave');
  r = await call('DELETE', '/items/novice/testni-zapis');
  check(r.status === 200, 'izbris');
  r = await call('DELETE', '/items/blog/drugi-del');
  r = await call('DELETE', '/media', { src: pic.src });
  check(r.status === 200 && !existsSync(path.join(work, 'public', pic.src.slice(1) + '-1600.jpg')), 'neuporabljena slika izbrisana');

  const idx = JSON.parse(await readFile(path.join(work, 'content/cms/index.json'), 'utf8'));
  check(idx.items.length === 0 && idx.media.length === 0, 'kazalo prazno');
  check(changes >= 10, `spremembe sprožijo ponovno gradnjo (${changes})`);

  r = await call('POST', '/logout');
  r = await call('GET', '/me');
  check(r.status === 401, 'odjava');
} finally {
  server.close();
  await rm(work, { recursive: true, force: true });
}

console.log(failures ? `\n${failures} napak.` : '\nIHG: vse preverjeno.');
process.exit(failures ? 1 : 0);
