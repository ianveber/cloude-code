/**
 * Home-page showcase sections and the listing blocks for the newer pages.
 *
 * Same contract as sections.mjs: every function returns finished static markup.
 * Motion is layered on afterwards by public/js/motion.js and is never required
 * to read anything here — the text is complete in the HTML on first response.
 */

import { esc, each } from './html.mjs';
import { capabilityArt } from './art.mjs';
import site from '../content/site.mjs';

/* ── Hero ─────────────────────────────────────────────────────────────── */

/**
 * The opening overlay.
 *
 * Rendered by the layout *outside* `<main>`: while the intro runs, the whole
 * page below is faded out, and an element inside a faded parent cannot be
 * shown again by any rule of its own.
 */
export function introOverlay() {
  return `
<div class="hero__intro" data-intro-stage aria-hidden="true">
  <span class="hero__intro-brain">
    <img data-brand-brain src="${esc(site.brand.brain)}" alt=""
      width="${site.brand.brainWidth}" height="${site.brand.brainHeight}">
  </span>
  <img class="hero__intro-lockup" data-brand-lockup
    src="${esc(site.brand.logo)}" alt=""
    width="${site.brand.logoWidth}" height="${site.brand.logoHeight}">
</div>`;
}

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
        <div class="brand-brain__rig">
          <span class="brand-brain__edge"></span>
          <img data-brand-brain src="${esc(site.brand.brain)}" alt=""
            width="${site.brand.brainWidth}" height="${site.brand.brainHeight}">
          <span class="brand-brain__shadow"></span>
        </div>
      </div>
    </div>
  </div>
</section>`;
}

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

/* ── Converge band ────────────────────────────────────────────────────────
   Three clips run side by side, then close into a single frame as the section
   is scrolled. The clips are decorative and silent, so they are muted, looped
   and marked aria-hidden; the caption under each one carries the meaning. */

function screenPanel(screen, index) {
  const sources = each(
    screen.sources,
    (s) => `<source src="${esc(s.src)}" type="${esc(s.type)}">`
  );

  return `
      <figure class="converge__panel" data-converge-panel="${index}">
        <div class="converge__frame">
          <video
            class="converge__video"
            poster="${esc(screen.poster)}"
            width="1280" height="800"
            muted loop playsinline preload="none"
            aria-hidden="true" tabindex="-1"
            data-lazy-video>
            ${sources}
          </video>
        </div>
        <figcaption class="converge__caption">
          <span class="converge__label">${esc(screen.label)}</span>
          <span class="converge__text">${esc(screen.caption)}</span>
        </figcaption>
      </figure>`;
}

export function convergeBand(data) {
  return `
<section class="converge" id="kako-nastane" aria-labelledby="converge-title" data-converge>
  <div class="shell converge__head">
    <p class="eyebrow eyebrow--onDark">${esc(data.eyebrow)}</p>
    <h2 id="converge-title">${esc(data.title)}</h2>
    <p class="lead lead--onDark">${esc(data.lead)}</p>
  </div>

  <div class="converge__stage">
    <div class="converge__rail">
      ${each(data.screens, screenPanel)}
    </div>
  </div>

  <p class="converge__outro">${esc(data.outro)}</p>
</section>`;
}

/* ── Capability band ──────────────────────────────────────────────────────
   Dark band. The opening sentence is split into words that brighten as the
   section scrolls, so it reads as though it is still being written. Splitting
   happens here at build time — the sentence is plain text to a crawler. */

function scrollWords(line) {
  return line
    .split(/\s+/)
    .map((word, i) => `<span class="readline__w" style="--i:${i}">${esc(word)}</span>`)
    .join(' ');
}

export function capabilityBand(data) {
  return `
<section class="capband" id="kaj-delamo" aria-labelledby="capband-title" data-capband>
  <div class="shell">
    <p class="eyebrow eyebrow--onDark">${esc(data.eyebrow)}</p>
    <h2 class="readline" id="capband-title" data-readline>${scrollWords(data.line)}</h2>
  </div>

  <div class="shell capband__list">
    ${each(
      data.items,
      (item, i) => `
    <article class="capitem" id="${esc(item.id)}" data-capitem>
      <div class="capitem__copy">
        <span class="capitem__index" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
        <h3 class="capitem__label">${esc(item.label)}</h3>
        <p class="capitem__body">${esc(item.body)}</p>
      </div>
      <div class="capitem__art" aria-hidden="true">${capabilityArt(item.art)}</div>
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
          width="360" height="360" loading="lazy">
        <span class="teamtile__name">${esc(person.name)}</span>
        <span class="teamtile__role">${esc(person.role)}</span>
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

/** Blog teaser for the home page. */
export function blogTeaser(data) {
  if (data.items.length === 0) return '';
  const posts = data.items.slice(0, 3);

  return `
<section class="section blog-band" aria-labelledby="blog-band">
  <div class="shell">
    <div class="section-head" data-reveal>
      <p class="eyebrow">${esc(data.eyebrow)}</p>
      <h2 id="blog-band">${esc(data.homeTitle)}</h2>
      <p class="lead">${esc(data.homeLead)}</p>
    </div>
    <ul class="postgrid">
      ${posts.map((p, i) => postCard(p, i)).join('\n')}
    </ul>
    <div class="btn-row">
      <a class="btn btn--secondary" href="/blog/">Odprite blog</a>
    </div>
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
