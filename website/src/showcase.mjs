/**
 * Home-page showcase sections and the listing blocks for the newer pages.
 *
 * Same contract as sections.mjs: every function returns finished static markup.
 * Motion is layered on afterwards by public/js/motion.js and is never required
 * to read anything here — the text is complete in the HTML on first response.
 */

import { esc, each } from './html.mjs';
import site from '../content/site.mjs';
import { intro as introCopy } from '../content/showcase.mjs';

/* ── Opening sequence ─────────────────────────────────────────────────── */

/**
 * The opening overlay: a white screen, the brain mark, and the brand name
 * typed out next to it with a blinking caret. The site loads in once the
 * typing has finished.
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
      <img data-brand-brain src="${esc(site.brand.brain)}" alt=""
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
 * White stage with the official brain as a glossy slab, tilted toward the
 * visitor. The slab is the only 3D object on the site: a stack of edge layers
 * gives it thickness, a moving highlight gives it shine, and both follow the
 * pointer slowly.
 */
export function brainHero(data) {
  return `
<section class="hero hero--brain" data-intro>
  <div class="shell hero__grid">
    <div class="hero__copy">
      <h1 data-type-in>${esc(data.headline)}</h1>
      <p class="hero__lead" data-enter="1">${esc(data.lead)}</p>
      <div class="btn-row" data-enter="2">
        <a class="btn btn--primary" href="${esc(data.primary.href)}">${esc(data.primary.label)}</a>
        <a class="btn btn--secondary" href="${esc(data.secondary.href)}">${esc(data.secondary.label)}</a>
      </div>
    </div>
    <div class="hero__art" aria-hidden="true">
      <div class="brand-brain" data-brain>
        <div class="brand-brain__float">
          <div class="brand-brain__rig">
            <span class="brand-brain__shadow"></span>
            <span class="brand-brain__side brand-brain__side--3"></span>
            <span class="brand-brain__side brand-brain__side--2"></span>
            <span class="brand-brain__side brand-brain__side--1"></span>
            <img data-brand-brain src="${esc(site.brand.brain)}" alt=""
              width="${site.brand.brainWidth}" height="${site.brand.brainHeight}">
            <span class="brand-brain__gloss"></span>
            <span class="brand-brain__sweep"></span>
            <span class="brand-brain__rim"></span>
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
   The one dark band. Three clips sit in a fanned stage: the front screen is
   large, the other two wait at its sides. Any screen can be brought forward
   by pointer, keyboard or the tabs beneath; left alone, the stage rotates on
   its own. The clips are decorative and silent, so they are muted, looped and
   marked aria-hidden; the tabs carry the meaning. */

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
          <span class="build__glare"></span>
        </div>
        <figcaption class="build__cap">
          <span class="build__cap-label">${esc(screen.label)}</span>
          <span class="build__cap-text">${esc(screen.caption)}</span>
        </figcaption>
      </figure>`;
}

function stageTab(screen, index) {
  const active = index === 1;
  return `
      <button class="build__tab${active ? ' is-active' : ''}" type="button"
        data-build-tab="${index}" aria-pressed="${active ? 'true' : 'false'}">
        <span class="build__tab-num" aria-hidden="true">${esc(screen.number)}</span>
        <span class="build__tab-label">${esc(screen.label)}</span>
        <span class="build__tab-text">${esc(screen.caption)}</span>
      </button>`;
}

export function buildStage(data) {
  return `
<section class="build" id="kako-nastane" aria-labelledby="build-title" data-build>
  <div class="shell build__head">
    <p class="eyebrow eyebrow--onDark">${esc(data.eyebrow)}</p>
    <h2 id="build-title">${esc(data.title)}</h2>
    <p class="lead lead--onDark">${esc(data.lead)}</p>
  </div>

  <div class="build__stage" data-build-stage>
    <div class="build__rig" data-build-rig>
      ${each(data.screens, stageScreen)}
    </div>
  </div>

  <div class="shell">
    <div class="build__tabs" data-build-tabs>
      ${each(data.screens, stageTab)}
    </div>
    <p class="build__outro">${esc(data.outro)}</p>
  </div>
</section>`;
}

/* ── Clients line ─────────────────────────────────────────────────────────
   One horizontal line of the projects we have built. It drifts slowly on its
   own and slows under the pointer; without JS it is a plain scrollable row. */

export function clientsLine(data) {
  return `
<section class="section clients" aria-labelledby="clients-title" data-clients>
  <div class="shell">
    <div class="section-head" data-reveal>
      <p class="eyebrow">${esc(data.eyebrow)}</p>
      <h2 id="clients-title">${esc(data.title)}</h2>
      <p class="lead">${esc(data.lead)}</p>
    </div>
  </div>
  <div class="clients__line" data-clients-line>
    <ul class="clients__track" data-clients-track>
      ${each(
        data.items,
        (item, i) => `
      <li class="client" style="--i:${i}">
        <span class="client__kind">${esc(item.kind)}</span>
        <span class="client__name">${esc(item.name)}</span>
        <span class="client__body">${esc(item.body)}</span>
      </li>`
      )}
    </ul>
  </div>
</section>`;
}

/* ── Three pillars ────────────────────────────────────────────────────────
   White section. Each pillar pairs copy with one product picture; the picture
   sits in a frame that leans toward the pointer a few degrees. */

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
      <p class="lead">${esc(data.lead)}</p>
    </div>
  </div>
  <div class="shell pillars__list">
    ${each(
      data.items,
      (item) => `
    <article class="pillar" id="${esc(item.id)}" data-pillar>
      <div class="pillar__copy" data-reveal>
        <span class="pillar__index" aria-hidden="true">${esc(item.number)}</span>
        <h3 class="pillar__title">${esc(item.title)}</h3>
        <p class="pillar__body">${esc(item.body)}</p>
        <ul class="pillar__points">
          ${each(item.points, (p) => `<li>${esc(p)}</li>`)}
        </ul>
        <a class="link" href="${esc(item.link.href)}">${esc(item.link.label)}</a>
      </div>
      <div class="pillar__visual" data-reveal>
        <div class="pillar__frame" data-tilt>
          ${pillarPicture(item.picture)}
          <span class="pillar__glare"></span>
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
        <a class="teamtile__mail" href="mailto:${esc(person.email)}">${esc(person.email)}</a>
      </li>`).join('\n');

  return `
<section class="section team-band" aria-labelledby="ekipa-band">
  <div class="shell">
    <div class="section-head" data-reveal>
      <p class="eyebrow">${esc(data.eyebrow)}</p>
      <h2 id="ekipa-band">${esc(data.title)}</h2>
      <p class="lead">${esc(data.lead)}</p>
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

/* ── Immersive CTA ────────────────────────────────────────────────────────
   A slow, low-contrast field drifts behind the panel. It is drawn on a canvas
   that sits behind the form, never over it, and it does not render at all when
   the visitor prefers reduced motion. */

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
  <canvas class="ctaband__field" data-cta-field aria-hidden="true"></canvas>
  <div class="shell ctaband__inner">
    <div class="ctaband__copy">
      <p class="eyebrow eyebrow--onDark">${esc(data.eyebrow)}</p>
      <h2 id="cta-title">${esc(data.title)}</h2>
      <p class="lead lead--onDark">${esc(data.lead)}</p>
    </div>

    <form class="ctaform" name="povprasevanje" method="post" action="${esc(action)}"${
      endpoint ? ` data-endpoint="${esc(endpoint)}"` : ' enctype="text/plain"'
    } data-contact-form>
      ${fields}
      <p class="ctaform__actions">
        <button class="btn btn--primary" type="submit">${esc(data.submitLabel)}</button>
      </p>
      <p class="ctaform__note">${esc(data.footnote)}</p>
      <p class="ctaform__status" data-form-status role="status" aria-live="polite"></p>
    </form>
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
 * Blog teaser for the home page. With no posts yet it shows the same honest
 * empty state as the blog index, so the section still has a place on the
 * page without implying unpublished work exists.
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
      <p class="blog-band__empty-title">${esc(data.empty.title)}</p>
      <p>${esc(data.empty.body)}</p>
      <a class="link" href="/blog/">Odprite blog</a>
    </div>`;

  return `
<section class="section blog-band" aria-labelledby="blog-band">
  <div class="shell">
    <div class="section-head" data-reveal>
      <p class="eyebrow">${esc(data.eyebrow)}</p>
      <h2 id="blog-band">${esc(data.homeTitle)}</h2>
      <p class="lead">${esc(data.homeLead)}</p>
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

/* ── Products ─────────────────────────────────────────────────────────── */

export function productGrid(data) {
  if (data.items.length === 0) {
    return emptyState({ id: 'izdelki-list', eyebrow: data.eyebrow, ...data.empty });
  }

  return `
<section class="section" aria-labelledby="izdelki-list">
  <div class="shell">
    <h2 class="visually-hidden" id="izdelki-list">Seznam izdelkov</h2>
    <div class="grid grid--2 productgrid">
      ${each(
        data.items,
        (item) => `
      <article class="product" data-reveal>
        <p class="product__kicker">${esc(item.kicker)}</p>
        <h3 class="product__name">${esc(item.name)}</h3>
        <p class="product__body">${esc(item.body)}</p>
        <ul class="product__points">
          ${each(item.points, (p) => `<li>${esc(p)}</li>`)}
        </ul>
        <p class="product__foot">
          <span class="chip">${esc(item.status)}</span>
          <a class="link" href="${esc(item.href)}">Podrobneje</a>
        </p>
      </article>`
      )}
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
