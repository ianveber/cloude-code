#!/usr/bin/env node
/**
 * Lighthouse on the built site, three representative pages, mobile profile.
 *
 *   npm run lighthouse            (needs the preview: npm run dev, port 4321)
 *   BASE=http://127.0.0.1:55814 node tools/lighthouse.mjs
 *
 * Prints the four category scores and the lab metrics per page. Lighthouse
 * is fetched through npx on first use; Chrome comes from CHROME_PATH or the
 * usual macOS location. The local server sends no compression and no cache
 * headers, so "cache" and "compression" findings are expected here and
 * disappear on Vercel.
 */

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { existsSync } from 'node:fs';

const run = promisify(execFile);
const BASE = process.env.BASE || 'http://127.0.0.1:4321';
const PAGES = [
  ['/?nointro', 'domov'],
  ['/studije-primerov/inspectus-vldr/', 'studija'],
  ['/storitve/avtomatizacija-prodaje/', 'storitev'],
];
const CHROME =
  process.env.CHROME_PATH ||
  ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find((p) => existsSync(p));

async function main() {
  const dir = await mkdtemp(path.join(tmpdir(), 'lh-'));
  try {
    for (const [route, tag] of PAGES) {
      const out = path.join(dir, `${tag}.json`);
      await run('npx', ['--yes', 'lighthouse', BASE + route, '--output=json', `--output-path=${out}`, '--chrome-flags=--headless=new --no-sandbox', '--only-categories=performance,accessibility,best-practices,seo', '--quiet'], {
        env: { ...process.env, CHROME_PATH: CHROME },
        maxBuffer: 64 * 1024 * 1024,
      });
      const r = JSON.parse(await readFile(out, 'utf8'));
      const c = r.categories;
      const m = r.audits.metrics.details.items[0];
      const score = (k) => String(Math.round(c[k].score * 100)).padStart(3);
      console.log(
        `${tag.padEnd(8)} perf ${score('performance')}  a11y ${score('accessibility')}  best ${score('best-practices')}  seo ${score('seo')}   LCP ${(m.largestContentfulPaint / 1000).toFixed(1)} s  TBT ${m.totalBlockingTime} ms  CLS ${m.cumulativeLayoutShift.toFixed(3)}`
      );
    }
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
