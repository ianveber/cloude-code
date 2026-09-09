/**
 * Home-page showcase sections and the listing blocks for the newer pages.
 *
 * Same contract as sections.mjs: every function returns finished static markup.
 * Motion is layered on afterwards by public/js/motion.js and is never required
 * to read anything here — the text is complete in the HTML on first response.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { esc, each } from './html.mjs';
import site from '../content/site.mjs';
import { intro as introCopy } from '../content/showcase.mjs';

/* The two paths of the official brain, read once from the traced SVG so the
   hero can stack them in 3D and colour each layer from CSS. */
const BRAIN_SVG = readFileSync(
  path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'brand', 'brain-light.svg'),
  'utf8'
);
const BRAIN_PATHS = [...BRAIN_SVG.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((m) => m[1]);
if (BRAIN_PATHS.length !== 2) {
  throw new Error('public/brand/brain-light.svg must contain exactly two paths (ink, blue).');
}
const BRAIN_VIEWBOX = `0 0 ${site.brand.brainWidth} ${site.brand.brainHeight}`;

/* ── Opening sequence ─────────────────────────────────────────────────── */

/**
 * The opening overlay: a white screen, the brain, and the brand name typed
 * out next to it with a blinking caret. The site loads in once the typing
 * has finished.
 *
 * Rendered by the layout *outside* `<main>`: while the intro runs, the whole
 * page below is faded out, and an element inside a faded parent cannot be
 * shown again by any rule of its own.
 *
 * The full wordmark is present twice: once as an invisible ghost that reserves
 * the final width so nothing shifts while typing, and once as the live text
 * that motion.js fills one character at a time.
 */
export function introOverlay() {
  return `
<div class="intro" data-intro-stage aria-hidden="true">
  <div class="intro__lockup">
    <span class="intro__mark">
      <img data-brand-brain src="${esc(site.brand.brainLight)}" alt=""
        width="${site.brand.brainWidth}" height="${site.brand.brainHeight}">
    </span>
    <span class="intro__type">
      <span class="intro__ghost"><span class="intro__brand">${esc(introCopy.brand)}</span><span class="intro__tail">${esc(introCopy.tail)}</span></span>
      <span class="intro__live"><span class="intro__brand" data-intro-brand data-text="${esc(introCopy.brand)}"></span><span class="intro__tail" data-intro-tail data-text="${esc(introCopy.tail)}"></span><span class="intro__caret" data-intro-caret></span></span>
    </span>
  </div>
</div>`;
}

/* ── Hero ─────────────────────────────────────────────────────────────── */

/**
 * White stage: headline on the left, the brain on the right as a real 3D
 * object. The brain lies at a shallow angle, has visible thickness (the
 * traced shape stacked in depth), a highlight and a light sweep that follow
 * the pointer, and a soft shadow with its own silhouette underneath. The
 * shape itself is the official mark, traced once and never redrawn.
 */
const BRAIN_DEPTH_LAYERS = 8;

export function brainHero(data) {
  /* Slices of the slab, deepest first. --z steps them back in depth; --k
     runs from 0 to 1 toward the face so the edge lightens as it comes forward. */
  const layers = Array.from({ length: BRAIN_DEPTH_LAYERS }, (_, i) => {
    const z = -(BRAIN_DEPTH_LAYERS - i) * 4;
    const k = (i / (BRAIN_DEPTH_LAYERS - 1)).toFixed(2);
    return `            <span class="brand-brain__layer" style="--z:${z}px;--k:${k}"></span>`;
  }).join('\n');

  return `
<section class="hero hero--brain" data-intro>
  <svg class="brand-brain__defs" width="0" height="0" aria-hidden="true" focusable="false">
    <symbol id="brain-shape" viewBox="${BRAIN_VIEWBOX}">
      <path style="fill:var(--brain-ink)" fill-rule="evenodd" d="${BRAIN_PATHS[0]}"/>
      <path style="fill:var(--brain-blue)" fill-rule="evenodd" d="${BRAIN_PATHS[1]}"/>
    </symbol>
  </svg>
  <div class="shell hero__grid">
    <div class="hero__copy">
      <h1 data-type-in>${esc(data.headline)}</h1>
      <div class="btn-row" data-enter="1">
        <a class="btn btn--primary" href="${esc(data.primary.href)}">${esc(data.primary.label)}</a>
        <a class="btn btn--secondary" href="${esc(data.secondary.href)}">${esc(data.secondary.label)}</a>
      </div>
    </div>
    <div class="hero__art" aria-hidden="true">
      <div class="brand-brain" data-brain>
        <div class="brand-brain__float">
          <div class="brand-brain__rig">
            <span class="brand-brain__ground"></span>
            <span class="brand-brain__shadow"></span>
${layers}
            <span class="brand-brain__core"></span>
            <svg class="brand-brain__face" viewBox="${BRAIN_VIEWBOX}" aria-hidden="true" focusable="false"><use href="#brain-shape"/></svg>
            <span class="brand-brain__gloss"></span>
            <span class="brand-brain__sweep"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`;
}

/* The outer shell is the gutter wrapper around the independent card. */
export function emptyState({ id, eyebrow, title, body, action }) {
  return `
<section class="section empty-state" aria-labelledby="${esc(id)}">
  <div class="shell empty-state__shell">
    <div class="empty-state__inner">
      <p class="eyebrow">${esc(eyebrow)}</p>
      <h2 id="${esc(id)}">${esc(title)}</h2>
      <p>${esc(body)}</p>
      <a class="btn btn--secondary" href="${esc(action.href)}">${esc(action.label)}</a>
    </div>
  </div>
</section>`;
}

/* ── Build stage ──────────────────────────────────────────────────────────
   The one dark block: a rounded black panel inside the page margins. Three
   clips take turns in front. Left alone the stage moves in beats: the front
   clip holds, the three spread out side by side, then gather again with the
   next clip in front. The tabs beneath bring any clip forward. The clips are
   decorative and silent, so they are muted, looped and marked aria-hidden;
   the tabs carry the meaning. */

const STAGE_POSITION = ['is-left', 'is-active', 'is-right'];

function stageScreen(screen, index) {
  const sources = each(
    screen.sources,
    (s) => `<source src="${esc(s.src)}" type="${esc(s.type)}">`
  );

  return `
      <figure class="build__screen ${STAGE_POSITION[index]}" data-build-screen="${index}">
        <div class="build__frame">
          <video
            class="build__video"
            poster="${esc(screen.poster)}"
            width="1280" height="800"
            muted loop playsinline preload="none"
            aria-hidden="true" tabindex="-1"
            data-lazy-video>
            ${sources}
          </video>
        </div>
        <figcaption class="visually-hidden">${esc(screen.label)}</figcaption>
      </figure>`;
}

function stageTab(screen, index) {
  const active = index === 1;
  return `
      <button class="build__tab${active ? ' is-active' : ''}" type="button"
        data-build-tab="${index}" aria-pressed="${active ? 'true' : 'false'}">${esc(screen.label)}</button>`;
}

export function buildStage(data) {
  return `
<section class="build" id="kako-nastane" aria-labelledby="build-title" data-build>
  <div class="build__panel">
    <div class="shell build__head">
      <p class="eyebrow eyebrow--onDark">${esc(data.eyebrow)}</p>
      <h2 id="build-title">${esc(data.title)}</h2>
    </div>

    <div class="build__stage" data-build-stage>
      <div class="build__rig" data-build-rig>
        ${each(data.screens, stageScreen)}
      </div>
    </div>

    <div class="build__tabs" data-build-tabs>
      ${each(data.screens, stageTab)}
    </div>
  </div>
</section>`;
}

/* ── Clients marquee ──────────────────────────────────────────────────────
   Two rows of small pills, each with a client's logo and name. The rows
   drift in opposite directions. Each row holds its items twice so the loop
   has no seam; the second copy is hidden from assistive tech. */

function clientPill(item, clone) {
  const tag = item.href ? 'a' : 'span';
  const attrs = item.href ? ` href="${esc(item.href)}" rel="noopener"` : '';
  return `
        <li class="client"${clone ? ' aria-hidden="true"' : ''}>
          <${tag} class="client__tile"${attrs}${clone ? ' tabindex="-1"' : ''}>
            <span class="client__logo${item.tone === 'dark' ? ' client__logo--dark' : ''}">
              <img src="${esc(item.logo.src)}" alt="" width="${item.logo.width}" height="${item.logo.height}" loading="lazy" decoding="async">
            </span>
            <span class="client__name">${esc(item.name)}</span>
          </${tag}>
        </li>`;
}

/* Four copies per row: one set of pills is narrower than a wide screen, so
   the loop needs spares to stay seamless. The animation travels one set. */
const MARQUEE_COPIES = 4;

function marqueeRow(items, reverse) {
  const copies = Array.from({ length: MARQUEE_COPIES }, (_, c) =>
    each(items, (item) => clientPill(item, c > 0))
  ).join('\n');
  return `
    <div class="marquee${reverse ? ' marquee--reverse' : ''}">
      <ul class="marquee__track">
        ${copies}
      </ul>
    </div>`;
}

export function clientsLine(data) {
  /* Alternate clients between the rows so long and short names mix. */
  const rows = [data.items.filter((_, i) => i % 2 === 0), data.items.filter((_, i) => i % 2 === 1)];

  return `
<section class="section clients" aria-labelledby="clients-title" data-clients>
  <div class="shell">
    <div class="section-head" data-reveal>
      <p class="eyebrow">${esc(data.eyebrow)}</p>
      <h2 id="clients-title">${esc(data.title)}</h2>
    </div>
  </div>
  <div class="clients__rows">
    ${marqueeRow(rows[0], false)}
    ${marqueeRow(rows[1].length ? rows[1] : rows[0], true)}
  </div>
</section>`;
}

/* ── Three pillars ────────────────────────────────────────────────────────
   White section. A title and one sentence beside one product picture. The
   picture sits in a soft panel and leans a little toward the pointer. */

function pillarPicture(picture) {
  return `
        <picture>
          <source srcset="${esc(picture.src)}.webp" type="image/webp">
          <img src="${esc(picture.src)}.jpg" alt="${esc(picture.alt)}"
            width="${picture.width}" height="${picture.height}" loading="lazy" decoding="async">
        </picture>`;
}

export function pillarsSection(data) {
  return `
<section class="section pillars" id="kaj-gradimo" aria-labelledby="pillars-title" data-pillars>
  <div class="shell">
    <div class="section-head" data-reveal>
      <p class="eyebrow">${esc(data.eyebrow)}</p>
      <h2 id="pillars-title">${esc(data.title)}</h2>
    </div>
  </div>
  <div class="shell pillars__list">
    ${each(
      data.items,
      (item) => `
    <article class="pillar" id="${esc(item.id)}" data-pillar>
      <div class="pillar__copy" data-reveal>
        <h3 class="pillar__title">${esc(item.title)}</h3>
        <p class="pillar__body">${esc(item.body)}</p>
        <a class="btn btn--secondary" href="${esc(item.link.href)}">${esc(item.link.label)}</a>
      </div>
      <div class="pillar__visual" data-reveal>
        <div class="pillar__panel">
          <div class="pillar__frame" data-tilt>
            ${pillarPicture(item.picture)}
            <span class="pillar__glare"></span>
          </div>
        </div>
      </div>
    </article>`
    )}
  </div>
</section>`;
}

/* ── Team band ────────────────────────────────────────────────────────── */

export function teamBand(data, members) {
  const tiles = members.map((person, i) => `
      <li class="teamtile" style="--i:${i}">
        <img class="teamtile__photo" src="${esc(person.photo)}" alt="${esc(person.name)}"
          width="${person.photoWidth}" height="${person.photoHeight}" loading="lazy">
        <span class="teamtile__name">${esc(person.name)}</span>
        <span class="teamtile__role">${esc(person.role)}</span>
      </li>`).join('\n');

  return `
<section class="section team-band" aria-labelledby="ekipa-band">
  <div class="shell">
    <div class="section-head" data-reveal>
      <p class="eyebrow">${esc(data.eyebrow)}</p>
      <h2 id="ekipa-band">${esc(data.title)}</h2>
    </div>
    <ul class="teamgrid">
${tiles}
    </ul>
    <div class="btn-row">
      <a class="btn btn--secondary" href="/ekipa/">Spoznajte ekipo</a>
    </div>
  </div>
</section>`;
}

/* ── Closing CTA ──────────────────────────────────────────────────────────
   A rounded black panel with a soft blue glow, the title on the left and the
   short form on the right. */

export function immersiveCta(data) {
  const fields = each(data.fields, (field) => {
    const id = `cta-${field.name}`;
    return `
        <p class="ctaform__row">
          <label for="${id}">${esc(field.label)}${field.required ? '' : ' <span class="ctaform__opt">(neobvezno)</span>'}</label>
          <input
            id="${id}"
            name="${esc(field.name)}"
            type="${esc(field.type)}"
            autocomplete="${esc(field.autocomplete)}"
            ${field.required ? 'required' : ''}>
        </p>`;
  });

  /* Same contract as the contact page: works with no backend by opening the
     visitor's mail client, and upgrades to a background POST once
     site.contact.formEndpoint is set. */
  const endpoint = site.contact.formEndpoint;
  const action = endpoint || `mailto:${site.contact.email}`;

  return `
<section class="ctaband" id="povprasevanje" aria-labelledby="cta-title">
  <div class="ctaband__panel">
    <div class="shell ctaband__inner">
      <div class="ctaband__copy">
        <p class="eyebrow eyebrow--onDark">${esc(data.eyebrow)}</p>
        <h2 id="cta-title">${esc(data.title)}</h2>
      </div>

      <form class="ctaform" name="povprasevanje" method="post" action="${esc(action)}"${
        endpoint ? ` data-endpoint="${esc(endpoint)}"` : ' enctype="text/plain"'
      } data-contact-form>
        ${fields}
        <p class="ctaform__actions">
          <button class="btn btn--primary" type="submit">${esc(data.submitLabel)}</button>
        </p>
        <p class="ctaform__status" data-form-status role="status" aria-live="polite"></p>
      </form>
    </div>
  </div>
</section>`;
}

/* ── Blog ─────────────────────────────────────────────────────────────── */

function postCard(post, i) {
  return `
      <li class="postcard" style="--i:${i}">
        <article>
          <p class="postcard__meta">
            <time datetime="${esc(post.date)}">${esc(post.dateLabel)}</time>
            ${post.kicker ? `<span class="postcard__kicker">${esc(post.kicker)}</span>` : ''}
          </p>
          <h3>${post.href ? `<a href="${esc(post.href)}">${esc(post.title)}</a>` : esc(post.title)}</h3>
          <p>${esc(post.body)}</p>
        </article>
      </li>`;
}

/**
 * Blog teaser for the home page. With no posts yet it says so in one line,
 * so the section keeps its place without implying unpublished work exists.
 */
export function blogTeaser(data) {
  const posts = data.items.slice(0, 3);

  const body = posts.length
    ? `
    <ul class="postgrid">
      ${posts.map((p, i) => postCard(p, i)).join('\n')}
    </ul>
    <div class="btn-row">
      <a class="btn btn--secondary" href="/blog/">Odprite blog</a>
    </div>`
    : `
    <div class="blog-band__empty" data-reveal>
      <p>${esc(data.homeEmpty)}</p>
      <a class="btn btn--secondary" href="/blog/">Odprite blog</a>
    </div>`;

  return `
<section class="section blog-band" aria-labelledby="blog-band">
  <div class="shell">
    <div class="section-head" data-reveal>
      <p class="eyebrow">${esc(data.eyebrow)}</p>
      <h2 id="blog-band">${esc(data.homeTitle)}</h2>
    </div>
    ${body}
  </div>
</section>`;
}

/** Full blog index. */
export function blogGrid(data) {
  if (data.items.length === 0) {
    return emptyState({ id: 'blog-list', eyebrow: data.eyebrow, ...data.empty });
  }

  return `
<section class="section" aria-labelledby="blog-list">
  <div class="shell">
    <h2 class="visually-hidden" id="blog-list">Zapisi</h2>
    <ul class="postgrid">
      ${data.items.map((p, i) => postCard(p, i)).join('\n')}
    </ul>
  </div>
</section>`;
}

/* ── Products and projects ──────────────────────────────────────────────
   Each project is a row: a demo screen in a soft panel beside the name, a
   tag and one short paragraph. Sides alternate. The home page shows the
   first four as tiles. */

function projectPicture(picture) {
  return `
        <picture>
          <source srcset="${esc(picture.src)}.webp" type="image/webp">
          <img src="${esc(picture.src)}.jpg" alt="${esc(picture.alt)}"
            width="${picture.width}" height="${picture.height}" loading="lazy" decoding="async">
        </picture>`;
}

export function productGrid(data) {
  if (data.items.length === 0) {
    return emptyState({ id: 'izdelki-list', eyebrow: data.eyebrow, ...data.empty });
  }

  return `
<section class="section projects" aria-labelledby="izdelki-list" data-projects>
  <div class="shell">
    <h2 class="visually-hidden" id="izdelki-list">Seznam izdelkov in projektov</h2>
  </div>
  <div class="shell projects__list">
    ${each(
      data.items,
      (item) => `
    <article class="project" id="${esc(item.id)}" data-project>
      <div class="project__copy" data-reveal>
        <p class="project__kicker">${esc(item.kicker)}${item.kind ? ` <span class="project__kind">${esc(item.kind)}</span>` : ''}</p>
        <h3 class="project__name">${esc(item.name)}</h3>
        ${item.client ? `<p class="project__client">za ${esc(item.client)}</p>` : ''}
        <p class="project__body">${esc(item.body)}</p>
      </div>
      <div class="project__visual" data-reveal>
        <div class="project__panel">
          <div class="project__frame" data-tilt>
            ${projectPicture(item.picture)}
            <span class="pillar__glare"></span>
          </div>
        </div>
      </div>
    </article>`
    )}
  </div>
</section>`;
}

/** Home teaser: the first four products as tiles, then a link to all. */
export function productsTeaser(data) {
  if (data.items.length === 0) return '';
  const items = data.items.slice(0, 4);

  return `
<section class="section products-band" aria-labelledby="products-band" data-products>
  <div class="shell">
    <div class="section-head" data-reveal>
      <p class="eyebrow">${esc(data.eyebrow)}</p>
      <h2 id="products-band">${esc(data.homeTitle)}</h2>
    </div>
    <ul class="ptiles">
      ${each(
        items,
        (item, i) => `
      <li class="ptile" style="--i:${i}">
        <a class="ptile__link" href="/produkti/#${esc(item.id)}">
          <span class="ptile__panel">
            ${projectPicture(item.picture)}
          </span>
          <span class="ptile__name">${esc(item.name)}</span>
          <span class="ptile__kind">${esc(item.kind ?? item.kicker)}</span>
        </a>
      </li>`
      )}
    </ul>
    <div class="btn-row">
      <a class="btn btn--secondary" href="/produkti/">Vsi izdelki in projekti</a>
    </div>
  </div>
</section>`;
}

/* ── News ─────────────────────────────────────────────────────────────── */

export function newsList(data) {
  if (data.items.length === 0) {
    return emptyState({ id: 'novice-list', eyebrow: data.eyebrow, ...data.empty });
  }

  return `
<section class="section" aria-labelledby="novice-list">
  <div class="shell">
    <h2 class="visually-hidden" id="novice-list">Seznam novic</h2>
    <ol class="newslist">
      ${each(
        data.items,
        (item, i) => `
      <li class="newsitem" style="--i:${i}">
        <article>
          <p class="newsitem__meta">
            <time datetime="${esc(item.date)}">${esc(item.dateLabel)}</time>
            <span class="newsitem__kicker">${esc(item.kicker)}</span>
          </p>
          <h3>${esc(item.title)}</h3>
          <p>${esc(item.body)}</p>
        </article>
      </li>`
      )}
    </ol>
  </div>
</section>`;
}

/* ── Events ───────────────────────────────────────────────────────────── */

export function eventList(data) {
  if (data.items.length === 0) {
    return emptyState({ id: 'dogodki-list', eyebrow: data.eyebrow, ...data.empty });
  }

  return `
<section class="section" aria-labelledby="dogodki-list">
  <div class="shell">
    <h2 class="visually-hidden" id="dogodki-list">Seznam dogodkov</h2>
    <ul class="eventlist">
      ${each(
        data.items,
        (item, i) => `
      <li class="eventitem" style="--i:${i}">
        <article>
          <p class="eventitem__when">
            <time datetime="${esc(item.date)}">${esc(item.dateLabel)}</time>
            <span>${esc(item.time)}</span>
          </p>
          <div class="eventitem__body">
            <p class="eventitem__kicker">${esc(item.kicker)}</p>
            <h3>${esc(item.title)}</h3>
            <p>${esc(item.body)}</p>
            <p class="eventitem__where">
              <span class="chip">${esc(item.mode)}</span>
              <span>${esc(item.place)}</span>
            </p>
          </div>
        </article>
      </li>`
      )}
    </ul>
  </div>
</section>`;
}
