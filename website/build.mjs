#!/usr/bin/env node
/**
 * Static site generator for ais-slovenia.si.
 *
 * Reads content from ./content, renders every page to fully-formed static HTML,
 * and derives sitemap.xml, robots.txt and llms.txt from the same page list — so
 * adding a page automatically registers it everywhere it needs to appear.
 *
 *   node build.mjs            build into ./dist
 *   node build.mjs --serve    build, then serve ./dist on http://localhost:4321
 */

import { mkdir, writeFile, rm, cp, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import site from './content/site.mjs';
import {
  hero,
  pageHero,
  optimizationSection,
  problemsSection,
  processSection,
  servicesSection,
  outcomesSection,
  statsSection,
  aboutSection,
  teamSection,
  faqSection,
  contactSection,
  ctaBand,
  statementBand,
  featureExplorer,
  useCaseSlider,
  twinCtaSection,
  sectionHead,
  takeaway,
  capabilityGrid,
  definitionList,
} from './src/sections.mjs';
import { renderPage } from './src/layout.mjs';
import {
  faqNode,
  serviceNode,
  howToNode,
  teamNodes,
  contactPageNode,
} from './src/schema.mjs';
import { esc, absolute } from './src/html.mjs';
import * as C from './content/content.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(ROOT, 'dist');
const PUBLIC = path.join(ROOT, 'public');

const url = (p) => absolute(site.origin, p);

/* ── Shared page fragments ────────────────────────────────────────────── */

const HOME_CRUMB = { label: 'Domov', href: '/' };

const closingCta = ctaBand({
  title: 'Preverimo, ali je avtomatizacija smiselna za vas',
  lead: 'Rezervirajte uvodni pogovor in preverite, ali je AI avtomatizacija smiselna za vaše podjetje.',
  primary: { label: 'Rezervirajte posvet', href: '/kontakt/' },
  secondary: { label: 'Pogosta vprašanja', href: '/pogosta-vprasanja/' },
});

/* ── Page definitions ─────────────────────────────────────────────────── */

function homePage() {
  const body = [
    hero({
      eyebrow: C.hero.eyebrow,
      headline: C.hero.headline,
      lead: C.hero.lead,
      primaryCta: C.hero.primaryCta,
      secondaryCta: C.hero.secondaryCta,
      chips: [
        { label: 'AI chatboti v slovenščini', accent: 'blue' },
        { label: 'Voice AI agenti', accent: 'violet' },
        { label: 'CRM integracije', accent: 'teal' },
        { label: 'Ljubljana, Slovenija', accent: 'amber' },
      ],
    }),

    statementBand(C.statement),
    featureExplorer(C.services),
    useCaseSlider(C.useCases),
    twinCtaSection(C.twinCta),
    processSection(C.processMeta, C.processSteps),
    statsSection(C.stats),
    faqSection(C.faq, { items: C.faq.items.slice(0, 5) }),
    closingCta,
  ].join('\n');

  return {
    path: '/',
    title: 'AI avtomatizacija in AI chatboti za podjetja | AIS Slovenia',
    ogTitle: 'AI rešitve za podjetja v Sloveniji — AIS Slovenia',
    description:
      'AIS Slovenia razvija AI chatbote, voice AI agente in sisteme za avtomatizacijo poslovanja. AI rešitve za podjetja v Sloveniji, v slovenščini.',
    keywords: [
      'AI rešitve za podjetja',
      'AI avtomatizacija Slovenija',
      'AI chatbot slovenščina',
      'voice AI agent',
      'avtomatizacija poslovnih procesov',
      'umetna inteligenca za podjetja',
    ],
    breadcrumbs: [HOME_CRUMB],
    priority: '1.0',
    changefreq: 'weekly',
    schema: [faqNode(C.faq.items.slice(0, 5), '/'), howToNode('/')],
    body,
  };
}

function servicesIndexPage() {
  const body = [
    pageHero({
      eyebrow: C.servicesMeta.eyebrow,
      title: 'AI sistemi za podjetja: administracija, prodaja in trg',
      lead: C.servicesMeta.lead,
      accent: 'violet',
      cta: { label: 'Rezervirajte posvet', href: '/kontakt/' },
    }),

    `<section class="section section--plain section--flush-top">
  <div class="shell">
    ${takeaway({
      accent: 'violet',
      label: 'Na kratko',
      text: 'AIS Slovenia pokriva tri področja avtomatizacije. Avtomatizacija administracije prevzame ponavljajoče se operativne naloge, avtomatizacija prodaje na spletni strani odgovarja strankam 24/7, spremljanje trga pa dostavlja relevantne priložnosti. Vsak sistem deluje samostojno, skupaj pa tvorijo celovito rešitev za avtomatizacijo poslovanja.',
    })}
  </div>
</section>`,

    servicesSection({ eyebrow: 'Področja', title: 'Tri področja avtomatizacije', lead: '' }, C.services),

    `<section class="section">
  <div class="shell">
    ${sectionHead({
      eyebrow: 'Primerjava',
      title: 'Katera storitev rešuje kateri problem',
      lead: 'Hiter pregled, če še niste prepričani, kje začeti.',
      accent: 'teal',
    })}
    ${definitionList(
      C.services.map((s) => ({
        term: `${s.name} — ${s.role}`,
        definition: s.bestFor,
      }))
    )}
  </div>
</section>`,

    processSection(C.processMeta, C.processSteps),
    closingCta,
  ].join('\n');

  return {
    path: '/storitve/',
    title: 'AI sistemi za podjetja — storitve | AIS Slovenia',
    description:
      'Tri področja avtomatizacije za podjetja: administracija in operacije, prodaja in komunikacija s strankami ter spremljanje trga. Vse v slovenščini.',
    keywords: ['AI agenti za podjetja', 'AI chatbot za spletno stran', 'voice AI agent slovenščina'],
    breadcrumbs: [HOME_CRUMB, { label: 'Storitve', href: '/storitve/' }],
    priority: '0.9',
    changefreq: 'monthly',
    schema: C.services.map(serviceNode),
    body,
  };
}

function servicePage(service) {
  const body = [
    pageHero({
      eyebrow: service.role,
      title: service.name,
      lead: service.summary,
      accent: service.accent,
      cta: { label: 'Rezervirajte posvet', href: '/kontakt/' },
    }),

    `<section class="section section--plain section--flush-top">
  <div class="shell">
    ${takeaway({ accent: service.accent, label: 'Na kratko', text: service.answer })}
  </div>
</section>`,

    `<section class="section">
  <div class="shell">
    ${sectionHead({
      eyebrow: 'Zmožnosti',
      title: 'Kaj sistem prevzame',
      lead: 'Štiri naloge, ki jih sistem prevzame od vaše ekipe.',
      accent: service.accent,
    })}
    ${capabilityGrid(service.capabilities, service.accent)}
  </div>
</section>`,

    `<section class="section section--paper">
  <div class="shell">
    ${sectionHead({
      eyebrow: 'Podrobnosti',
      title: 'Storitev na kratko',
      accent: service.accent,
    })}
    ${definitionList([
      { term: 'Področje', definition: service.role },
      { term: 'Jezik', definition: 'Slovenščina' },
      { term: 'Razpoložljivost', definition: '24 ur na dan, vse dni v letu' },
      { term: 'Primerno za', definition: service.bestFor },
      { term: 'Ponudnik', definition: `${site.legalName}, ${site.contact.city}, ${site.contact.country}` },
    ])}
  </div>
</section>`,

    processSection(
      {
        eyebrow: 'Uvedba',
        title: 'Kako sistem uvedemo',
        lead: C.processMeta.lead,
      },
      C.processSteps
    ),

    closingCta,
  ].join('\n');

  return {
    path: `/storitve/${service.slug}/`,
    title: service.metaTitle,
    description: service.metaDescription,
    keywords: [service.name, service.role, 'AI avtomatizacija Slovenija'],
    breadcrumbs: [
      HOME_CRUMB,
      { label: 'Storitve', href: '/storitve/' },
      { label: service.name, href: `/storitve/${service.slug}/` },
    ],
    priority: '0.8',
    changefreq: 'monthly',
    schema: [serviceNode(service)],
    body,
  };
}

function processPage() {
  const body = [
    pageHero({
      eyebrow: C.processMeta.eyebrow,
      title: C.processMeta.title,
      lead: C.processMeta.lead,
      accent: 'teal',
      cta: { label: 'Rezervirajte posvet', href: '/kontakt/' },
    }),

    `<section class="section section--plain section--flush-top">
  <div class="shell">
    ${takeaway({
      accent: 'teal',
      label: 'Na kratko',
      text: 'Uvedba AI sistema poteka po osmih korakih: raziskava, diagnostika, potopitev, arhitektura, prototip, kalibracija, uvedba in evolucija. Prvi štirje koraki so namenjeni razumevanju in načrtovanju, peti prinese delujoč prototip, zadnji trije pa uvedbo v produkcijo in nenehno izboljševanje.',
    })}
  </div>
</section>`,

    processSection(
      { eyebrow: 'Koraki', title: 'Osem korakov od ideje do delujočega sistema', lead: '' },
      C.processSteps,
      { showCta: false }
    ),

    `<section class="section">
  <div class="shell">
    ${sectionHead({
      eyebrow: 'Trajanje',
      title: 'Koliko časa vzame posamezen korak',
      lead: 'Okvirni časovni okvir. Natančen razpored določimo po diagnostiki.',
      accent: 'amber',
    })}
    ${definitionList(C.processSteps.map((s) => ({ term: `${s.number} — ${s.title}`, definition: s.duration })))}
  </div>
</section>`,

    closingCta,
  ].join('\n');

  return {
    path: '/proces/',
    title: 'Proces uvedbe AI sistema — 8 korakov | AIS Slovenia',
    description:
      'Kako poteka uvedba AI avtomatizacije: raziskava, diagnostika, potopitev, arhitektura, prototip, kalibracija, uvedba in evolucija. Osem korakov z okvirnim trajanjem.',
    keywords: ['uvedba AI sistema', 'proces avtomatizacije', 'AI implementacija'],
    breadcrumbs: [HOME_CRUMB, { label: 'Proces', href: '/proces/' }],
    priority: '0.8',
    changefreq: 'monthly',
    schema: [howToNode('/proces/')],
    body,
  };
}

function aboutPage() {
  const body = [
    pageHero({
      eyebrow: 'O podjetju',
      title: 'Problem ni v ekipi. Problem je v sistemu.',
      lead: C.about.lead,
      accent: 'violet',
      cta: { label: 'Spoznajte ekipo', href: '/ekipa/' },
    }),

    `<section class="section section--plain section--flush-top">
  <div class="shell">
    ${takeaway({
      accent: 'violet',
      label: 'O nas',
      text: 'AIS Slovenia (Artificial Intelligence Slovenia) je slovensko podjetje za avtomatizacijo poslovnih procesov z umetno inteligenco. Delujemo iz Ljubljane, storitve izvajamo v slovenskem jeziku, sisteme pa gradimo okoli orodij, ki jih podjetje že uporablja.',
    })}
  </div>
</section>`,

    problemsSection(C.problems),
    aboutSection(C.about),
    statsSection(C.stats),
    outcomesSection(C.outcomes),
    teamSection(C.team),
    closingCta,
  ].join('\n');

  return {
    path: '/o-podjetju/',
    title: 'O podjetju AIS Slovenia — AI avtomatizacija iz Ljubljane',
    description:
      'AIS Slovenia je slovensko podjetje za avtomatizacijo poslovnih procesov z umetno inteligenco. Sisteme gradimo okoli orodij, ki jih podjetje že uporablja.',
    keywords: ['AIS Slovenia', 'Artificial Intelligence Slovenia', 'AI podjetje Ljubljana'],
    breadcrumbs: [HOME_CRUMB, { label: 'O podjetju', href: '/o-podjetju/' }],
    priority: '0.7',
    changefreq: 'monthly',
    body,
  };
}

function teamPage() {
  const body = [
    pageHero({
      eyebrow: C.team.eyebrow,
      title: C.team.title,
      lead: C.team.lead,
      accent: 'amber',
      cta: { label: 'Kontaktirajte nas', href: '/kontakt/' },
    }),
    teamSection({ ...C.team, eyebrow: 'Ljudje', title: 'Kdo stoji za AIS', lead: '' }),
    closingCta,
  ].join('\n');

  return {
    path: '/ekipa/',
    title: 'Ekipa AIS Slovenia — Anej Vučič, Nejc Feigel Boh, Ian Veber',
    description:
      'Spoznajte ekipo AIS Slovenia: Anej Vučič (CEO), Nejc Feigel Boh (CEO) in Ian Veber (CTO). Majhna ekipa, ki AI sisteme postavi in jih tudi vzdržuje.',
    keywords: ['ekipa AIS Slovenia', 'Anej Vučič', 'Nejc Feigel Boh', 'Ian Veber'],
    breadcrumbs: [HOME_CRUMB, { label: 'Ekipa', href: '/ekipa/' }],
    priority: '0.6',
    changefreq: 'yearly',
    schema: teamNodes(),
    body,
  };
}

function faqPage() {
  const body = [
    pageHero({
      eyebrow: C.faq.eyebrow,
      title: C.faq.title,
      lead: C.faq.lead,
      accent: 'teal',
      cta: { label: 'Rezervirajte posvet', href: '/kontakt/' },
    }),
    faqSection({ ...C.faq, eyebrow: 'Odgovori', title: 'Vprašanja in odgovori', lead: '' }, { variant: 'list' }),
    closingCta,
  ].join('\n');

  return {
    path: '/pogosta-vprasanja/',
    title: 'Pogosta vprašanja o AI avtomatizaciji | AIS Slovenia',
    description:
      'Odgovori na pogosta vprašanja o AI avtomatizaciji: kaj je AIS Slovenia, katere AI agente ponujamo, kako poteka uvedba, koliko časa traja in kako začeti.',
    keywords: ['pogosta vprašanja AI', 'AI avtomatizacija vprašanja'],
    breadcrumbs: [HOME_CRUMB, { label: 'Pogosta vprašanja', href: '/pogosta-vprasanja/' }],
    priority: '0.8',
    changefreq: 'monthly',
    schema: [faqNode(C.faq.items, '/pogosta-vprasanja/')],
    body,
  };
}

function contactPage() {
  const body = [
    pageHero({
      eyebrow: C.contact.eyebrow,
      title: C.contact.title,
      lead: C.contact.lead,
      accent: 'blue',
    }),
    contactSection({
      ...C.contact,
      eyebrow: 'Pišite nam',
      title: 'Kontaktni podatki in obrazec',
      /* The hero above already carries C.contact.lead; repeating it here read
         as a duplicated paragraph. */
      lead: 'Odgovorimo v enem delovnem dnevu. Pišite nam po e-pošti, pokličite ali izpolnite obrazec.',
    }),
  ].join('\n');

  return {
    path: '/kontakt/',
    title: 'Kontakt — rezervirajte uvodni pogovor | AIS Slovenia',
    description:
      'Rezervirajte uvodni pogovor in preverite, ali je AI avtomatizacija smiselna za vaše podjetje. Pišite na info@ais-slovenia.si ali pokličite +386 70 717 087.',
    keywords: ['kontakt AIS Slovenia', 'AI posvet', 'rezervacija posveta'],
    breadcrumbs: [HOME_CRUMB, { label: 'Kontakt', href: '/kontakt/' }],
    priority: '0.9',
    changefreq: 'monthly',
    schema: [contactPageNode('/kontakt/')],
    body,
  };
}

function notFoundPage() {
  const body = `
<section class="hero">
  <div class="shell hero__inner">
    <p class="eyebrow">Napaka 404</p>
    <h1>Te strani ni.</h1>
    <p class="lead">Povezava je morda zastarela. Poskusite z eno od spodnjih strani.</p>
    <div class="btn-row">
      <a class="btn btn--primary" href="/">Nazaj na domov</a>
      <a class="btn btn--secondary" href="/storitve/">Poglejte storitve</a>
    </div>
  </div>
</section>`;

  return {
    path: '/404.html',
    title: 'Strani ni — AIS Slovenia',
    description:
      'Iskane strani ni bilo mogoče najti. Vrnite se na domačo stran AIS Slovenia ali si oglejte naše storitve za avtomatizacijo poslovnih procesov.',
    breadcrumbs: [HOME_CRUMB],
    noindex: true,
    body,
  };
}

/* ── Page registry ────────────────────────────────────────────────────── */

export function collectPages() {
  return [
    homePage(),
    servicesIndexPage(),
    ...C.services.map(servicePage),
    processPage(),
    aboutPage(),
    teamPage(),
    faqPage(),
    contactPage(),
    notFoundPage(),
  ];
}

/* ── Derived files ────────────────────────────────────────────────────── */

function sitemapXml(pages, lastmod) {
  const entries = pages
    .filter((p) => !p.noindex)
    .map(
      (p) => `  <url>
    <loc>${url(p.path)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${p.changefreq ?? 'monthly'}</changefreq>
    <priority>${p.priority ?? '0.5'}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
}

/**
 * robots.txt.
 *
 * AI answer-engine crawlers are named explicitly and allowed. Being cited by
 * ChatGPT, Claude, Perplexity and Google's AI surfaces requires their crawlers
 * to be able to fetch the pages in the first place.
 */
function robotsTxt() {
  const aiAgents = [
    'GPTBot',
    'OAI-SearchBot',
    'ChatGPT-User',
    'ClaudeBot',
    'Claude-User',
    'anthropic-ai',
    'PerplexityBot',
    'Perplexity-User',
    'Google-Extended',
    'Applebot-Extended',
    'CCBot',
    'meta-externalagent',
    'Bytespider',
    'cohere-ai',
    'DuckAssistBot',
    'MistralAI-User',
  ];

  return `# robots.txt — ${site.name}

User-agent: *
Allow: /

# AI answer engines are welcome to read and cite this site.
${aiAgents.map((a) => `User-agent: ${a}\nAllow: /`).join('\n\n')}

Sitemap: ${url('/sitemap.xml')}
`;
}

/**
 * llms.txt — a plain-text brief for large language models.
 *
 * A page of HTML costs an answer engine tokens to parse. This file states the
 * same facts in the most quotable form possible, which is the cheapest way to
 * influence how the business gets described in generated answers.
 */
function llmsTxt(pages) {
  const pageLines = pages
    .filter((p) => !p.noindex)
    .map((p) => `- [${p.title.split('|')[0].trim()}](${url(p.path)}): ${p.description}`)
    .join('\n');

  return `# ${site.name}

> ${site.description}

## Dejstva

${site.facts.map((f) => `- ${f}`).join('\n')}

## Kontakt

- E-pošta: ${site.contact.email}
- Telefon: ${site.contact.phone}
- Lokacija: ${site.contact.city}, ${site.contact.country}

## Storitve

${C.services.map((s) => `- **${s.name}** (${s.role}): ${s.answer}`).join('\n')}

## Proces uvedbe

${C.processSteps.map((s) => `${Number(s.number)}. **${s.title}** (${s.duration}) — ${s.body}`).join('\n')}

## Strani

${pageLines}

## Pogosta vprašanja

${C.faq.items.map((i) => `### ${i.q}\n\n${i.a}`).join('\n\n')}
`;
}

/* ── OG image (SVG source, rendered to PNG separately) ────────────────── */

function ogImageSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="${esc(site.name)}">
  <defs>
    <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#1d77fe"/>
      <stop offset="34%" stop-color="#7358f5"/>
      <stop offset="62%" stop-color="#0ea5a0"/>
      <stop offset="84%" stop-color="#d98218"/>
      <stop offset="100%" stop-color="#e2506e"/>
    </linearGradient>
    <radialGradient id="washA" cx="0.14" cy="0.02" r="0.7">
      <stop offset="0%" stop-color="#1d77fe" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="#1d77fe" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="washB" cx="0.9" cy="0.1" r="0.65">
      <stop offset="0%" stop-color="#7358f5" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#7358f5" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="washC" cx="0.62" cy="1" r="0.6">
      <stop offset="0%" stop-color="#0ea5a0" stop-opacity="0.13"/>
      <stop offset="100%" stop-color="#0ea5a0" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="630" fill="#fbfbfd"/>
  <rect width="1200" height="630" fill="url(#washA)"/>
  <rect width="1200" height="630" fill="url(#washB)"/>
  <rect width="1200" height="630" fill="url(#washC)"/>

  <rect x="80" y="92" width="132" height="5" rx="2.5" fill="url(#rule)"/>

  <text x="80" y="152" font-family="Plus Jakarta Sans, Segoe UI, sans-serif" font-size="23" font-weight="600" letter-spacing="3.4" fill="#666d7d">AIS — ARTIFICIAL INTELLIGENCE SLOVENIA</text>

  <text x="80" y="286" font-family="Plus Jakarta Sans, Segoe UI, sans-serif" font-size="72" font-weight="700" letter-spacing="-2.4" fill="#15171d">AI avtomatizacija.</text>
  <text x="80" y="376" font-family="Plus Jakarta Sans, Segoe UI, sans-serif" font-size="72" font-weight="700" letter-spacing="-2.4" fill="#15171d">Hitrejši procesi.</text>

  <text x="80" y="486" font-family="Plus Jakarta Sans, Segoe UI, sans-serif" font-size="26" font-weight="500" fill="#666d7d">Administracija &#183; Prodaja &#183; Trg &#8212; AI sistemi v slovenščini</text>

  <g font-family="Plus Jakarta Sans, Segoe UI, sans-serif" font-size="22" font-weight="600" fill="#3d434f">
    <circle cx="88" cy="551" r="6" fill="#1d77fe"/>
    <text x="106" y="559">ais-slovenia.si</text>
    <circle cx="330" cy="551" r="6" fill="#7358f5"/>
    <text x="348" y="559">Ljubljana, Slovenija</text>
  </g>
</svg>
`;
}

/* ── Build ────────────────────────────────────────────────────────────── */

async function build() {
  const started = Date.now();
  const lastmod = new Date().toISOString().slice(0, 10);

  await rm(DIST, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });

  if (existsSync(PUBLIC)) {
    await cp(PUBLIC, DIST, { recursive: true });
  }

  const css = await readFile(path.join(ROOT, 'src', 'styles.css'), 'utf8');
  await writeFile(path.join(DIST, 'styles.css'), css);

  const pages = collectPages();

  for (const page of pages) {
    const isFile = page.path.endsWith('.html');
    const outPath = isFile
      ? path.join(DIST, page.path.replace(/^\//, ''))
      : path.join(DIST, page.path.replace(/^\//, ''), 'index.html');

    await mkdir(path.dirname(outPath), { recursive: true });
    await writeFile(outPath, renderPage(page));
  }

  await writeFile(path.join(DIST, 'sitemap.xml'), sitemapXml(pages, lastmod));
  await writeFile(path.join(DIST, 'robots.txt'), robotsTxt());
  await writeFile(path.join(DIST, 'llms.txt'), llmsTxt(pages));

  await mkdir(path.join(DIST, 'brand'), { recursive: true });
  await writeFile(path.join(DIST, 'brand', 'og-default.svg'), ogImageSvg());

  console.log(`Built ${pages.length} pages in ${Date.now() - started} ms → ${path.relative(process.cwd(), DIST)}`);
  for (const p of pages) console.log(`  ${p.path}`);
  console.log('  /sitemap.xml\n  /robots.txt\n  /llms.txt');

  return pages;
}

/* ── Dev server ───────────────────────────────────────────────────────── */

async function serve(port = 4321) {
  const { createServer } = await import('node:http');
  const { readFile: read, stat } = await import('node:fs/promises');

  const TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.xml': 'application/xml; charset=utf-8',
    '.txt': 'text/plain; charset=utf-8',
  };

  createServer(async (req, res) => {
    let rel = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let file = path.join(DIST, rel);

    try {
      const info = await stat(file).catch(() => null);
      if (!info || info.isDirectory()) file = path.join(file, 'index.html');
      const body = await read(file);
      res.writeHead(200, { 'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream' });
      res.end(body);
    } catch {
      const body = await read(path.join(DIST, '404.html')).catch(() => 'Not found');
      res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
      res.end(body);
    }
  }).listen(port, () => console.log(`Serving ${DIST} on http://localhost:${port}`));
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isMain) {
  await build();
  if (process.argv.includes('--serve')) await serve();
}

export { build };
