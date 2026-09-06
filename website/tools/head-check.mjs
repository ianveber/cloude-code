#!/usr/bin/env node
/**
 * Checks that character-split text (animated headlines and explorer copy) still
 * reads correctly: no characters lost, and no word broken across two lines.
 *
 *   node tools/head-check.mjs
 *
 * Expects the dev server on http://127.0.0.1:4321 (npm run serve).
 */

import puppeteer from 'puppeteer-core';

const BASE = process.env.BASE || 'http://127.0.0.1:4321';
const CHROME = process.env.CHROME_PATH || '/usr/local/bin/google-chrome';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const PAGES = ['/', '/produkti/', '/novice/', '/dogodki/', '/blog/', '/storitve/', '/proces/', '/kontakt/', '/o-podjetju/', '/ekipa/'];
const WIDTHS = [390, 768, 1024, 1440];

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(() => {
    try { sessionStorage.setItem('ais-intro', '1'); } catch (e) {}
  });

  let failures = 0;
  let checked = 0;

  for (const width of WIDTHS) {
    await page.setViewport({ width, height: 900 });
    for (const url of PAGES) {
      await page.goto(BASE + url, { waitUntil: 'networkidle0' });
      await wait(700);

      /* Explorer copy only splits once its item scrolls into view. */
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
      await wait(600);
      await page.evaluate(() => window.scrollTo(0, 0));
      await wait(300);

      const found = await page.evaluate(() => {
        const out = [];
        document.querySelectorAll('[data-split="1"]').forEach((el) => {
          const original = el.dataset.original || '';
          const shown = el.textContent;
          const broken = [];
          el.querySelectorAll('.word').forEach((w) => {
            /* offsetTop reflects layout only. Bounding rects would also pick up
               the reveal transform, which shifts characters that have not been
               typed in yet and reads as a false break. */
            const tops = new Set([...w.querySelectorAll('.char')].map((c) => c.offsetTop));
            if (tops.size > 1) broken.push(w.textContent);
          });
          out.push({
            tag: el.tagName.toLowerCase(),
            lost: original.replace(/\s+/g, ' ').trim() !== shown.replace(/\s+/g, ' ').trim(),
            broken,
            sample: original.slice(0, 46),
          });
        });
        return out;
      });

      for (const f of found) {
        checked++;
        if (f.lost || f.broken.length) {
          failures++;
          console.log(`FAIL ${String(width).padEnd(5)} ${url.padEnd(16)} <${f.tag}> "${f.sample}"`);
          if (f.lost) console.log('       text does not match the original');
          if (f.broken.length) console.log(`       words split across lines: ${f.broken.join(', ')}`);
        }
      }
    }
  }

  await browser.close();
  console.log(`\n${checked} split blocks checked across ${WIDTHS.length} widths — ${failures} problem(s).`);
  process.exit(failures ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(1); });
