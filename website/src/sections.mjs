/**
 * Section components.
 *
 * Each function returns a self-contained block of static markup. They are
 * composed into pages in build.mjs. No component uses absolute positioning to
 * stack content — colour comes from gradient section backgrounds, card top
 * rules and accent dots, all of which stay in normal flow.
 */

import { esc, each, cls, accentMod } from './html.mjs';
import site from '../content/site.mjs';

/** Section heading block: eyebrow + h2 + lead. */
export function sectionHead({ eyebrow, title, lead, accent = 'blue', level = 2, id }) {
  const H = `h${level}`;
  return `
    <div class="section-head">
      ${eyebrow ? `<p class="${cls('eyebrow', accentMod('eyebrow', accent))}">${esc(eyebrow)}</p>` : ''}
      <${H}${id ? ` id="${esc(id)}"` : ''}>${esc(title)}</${H}>
      ${lead ? `<p class="lead">${esc(lead)}</p>` : ''}
    </div>`;
}

/** Answer-first summary box. Written to be quotable by AI answer engines. */
export function takeaway({ label = 'Na kratko', text, accent = 'blue' }) {
  return `
    <div class="${cls('takeaway', accentMod('takeaway', accent))}">
      <p class="takeaway__label">${esc(label)}</p>
      <p>${esc(text)}</p>
    </div>`;
}

/* ── Hero ─────────────────────────────────────────────────────────────── */

export function hero({ eyebrow, headline, lead, primaryCta, secondaryCta, chips = [] }) {
  return `
<section class="hero">
  <div class="shell">
    <div class="hero__inner">
      ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}
      <h1>${esc(headline)}</h1>
      <p class="lead">${esc(lead)}</p>
      <div class="btn-row">
        <a class="btn btn--primary" href="${esc(primaryCta.href)}">${esc(primaryCta.label)}</a>
        ${secondaryCta ? `<a class="btn btn--secondary" href="${esc(secondaryCta.href)}">${esc(secondaryCta.label)}</a>` : ''}
      </div>
      ${
        chips.length
          ? `<ul class="hero__facts">
        ${each(chips, (c) => `<li class="${cls('chip', accentMod('chip', c.accent))}">${esc(c.label)}</li>`)}
      </ul>`
          : ''
      }
    </div>
  </div>
</section>`;
}

/** Sub-page hero: same rhythm as the home hero, one level quieter. */
export function pageHero({ eyebrow, title, lead, accent = 'blue', cta }) {
  return `
<section class="hero">
  <div class="shell">
    <div class="hero__inner">
      <p class="${cls('eyebrow', accentMod('eyebrow', accent))}">${esc(eyebrow)}</p>
      <h1>${esc(title)}</h1>
      <p class="lead">${esc(lead)}</p>
      ${
        cta
          ? `<div class="btn-row"><a class="btn btn--primary" href="${esc(cta.href)}">${esc(cta.label)}</a></div>`
          : ''
      }
    </div>
  </div>
</section>`;
}

/* ── Replacement pairs ────────────────────────────────────────────────── */

export function optimizationSection(data) {
  return `
<section class="section section--tint-blue" aria-labelledby="optimizacija">
  <div class="shell">
    ${sectionHead({ ...data, id: 'optimizacija' })}
    <div class="grid grid--4">
      ${each(
        data.pairs,
        (p) => `
      <div class="${cls('pair', accentMod('pair', p.accent))}">
        <p class="pair__gain">${esc(p.gain)}</p>
        <span class="pair__arrow" aria-hidden="true"></span>
        <p class="pair__replaces">${esc(p.replaces)}</p>
      </div>`
      )}
    </div>
  </div>
</section>`;
}

/* ── Problems ─────────────────────────────────────────────────────────── */

export function problemsSection(data) {
  return `
<section class="section" aria-labelledby="izzivi">
  <div class="shell">
    ${sectionHead({ ...data, accent: 'amber', id: 'izzivi' })}
    <div class="grid grid--4">
      ${each(
        data.items,
        (item) => `
      <article class="${cls('card', accentMod('card', item.accent))}">
        <h3>${esc(item.title)}</h3>
        <p>${esc(item.body)}</p>
      </article>`
      )}
    </div>
  </div>
</section>`;
}

/* ── Process ──────────────────────────────────────────────────────────── */

export function processSection(meta, steps, { headingLevel = 2, showCta = true } = {}) {
  return `
<section class="section section--paper" aria-labelledby="proces">
  <div class="shell">
    ${sectionHead({ ...meta, accent: 'teal', level: headingLevel, id: 'proces' })}
    <ol class="steps">
      ${each(
        steps,
        (s) => `
      <li class="${cls('step', accentMod('step', s.accent))}">
        <span class="step__num" aria-hidden="true">${esc(s.number)}</span>
        <div>
          <div class="step__head">
            <h3>${esc(s.title)}</h3>
            <span class="step__duration">${esc(s.duration)}</span>
          </div>
          <p>${esc(s.body)}</p>
        </div>
      </li>`
      )}
    </ol>
    ${
      showCta
        ? `<div class="btn-row"><a class="btn btn--secondary" href="/proces/">Podrobneje o procesu</a></div>`
        : ''
    }
  </div>
</section>`;
}

/* ── Services ─────────────────────────────────────────────────────────── */

export function servicesSection(meta, services, { linkToDetail = true } = {}) {
  return `
<section class="section section--tint-violet" aria-labelledby="storitve">
  <div class="shell">
    ${sectionHead({ ...meta, accent: 'violet', id: 'storitve' })}
    <div class="grid grid--3">
      ${each(
        services,
        (s) => `
      <article class="${cls('agent', accentMod('agent', s.accent))}">
        <span class="agent__mark" aria-hidden="true">${esc(s.name.slice(0, 2))}</span>
        <h3 class="agent__name">${esc(s.name)}</h3>
        <p class="agent__role">${esc(s.role)}</p>
        <p class="agent__summary">${esc(s.summary)}</p>
        <ul class="agent__tags">
          ${each(s.tags, (t) => `<li class="${cls('chip', accentMod('chip', s.accent))}">${esc(t)}</li>`)}
        </ul>
        ${
          linkToDetail
            ? `<div class="agent__foot">
          <a class="${cls('link', s.accent !== 'blue' ? `link--${s.accent}` : '')}" href="/storitve/${esc(s.slug)}/">Več o agentu ${esc(s.name)} <span aria-hidden="true">&rarr;</span></a>
        </div>`
            : ''
        }
      </article>`
      )}
    </div>
  </div>
</section>`;
}

/* ── Outcomes ─────────────────────────────────────────────────────────── */

export function outcomesSection(data) {
  return `
<section class="section" aria-labelledby="rezultat">
  <div class="shell">
    ${sectionHead({ ...data, accent: 'teal', id: 'rezultat' })}
    <div class="grid grid--3">
      ${each(
        data.items,
        (item) => `
      <article class="${cls('card', accentMod('card', item.accent))}">
        <h3>${esc(item.title)}</h3>
        <p>${esc(item.body)}</p>
      </article>`
      )}
    </div>
  </div>
</section>`;
}

/* ── Stats ────────────────────────────────────────────────────────────── */

export function statsSection(stats) {
  return `
<section class="section section--paper" aria-label="Ključne številke">
  <div class="shell">
    <ul class="stats">
      ${each(
        stats,
        (s) => `
      <li class="${cls('stat', accentMod('stat', s.accent))}">
        <p class="stat__value">${esc(s.value)}</p>
        <p class="stat__label">${esc(s.label)}</p>
        <p class="stat__note">${esc(s.note)}</p>
      </li>`
      )}
    </ul>
  </div>
</section>`;
}

/* ── About ────────────────────────────────────────────────────────────── */

export function aboutSection(data, { headingLevel = 2 } = {}) {
  return `
<section class="section section--tint-violet" aria-labelledby="pristop">
  <div class="shell">
    ${sectionHead({
      eyebrow: data.eyebrow,
      title: data.title,
      lead: data.lead,
      accent: 'violet',
      level: headingLevel,
      id: 'pristop',
    })}
    <div class="approach">
      <h3>${esc(data.approachTitle)}</h3>
      <hr class="approach__divider">
      <p class="approach__label">${esc(data.questionIntro)}</p>
      <p class="approach__q approach__q--muted">&bdquo;${esc(data.questionWrong)}&ldquo;</p>
      <hr class="approach__divider">
      <p class="approach__label">${esc(data.questionPivot)}</p>
      <p class="approach__q">&bdquo;${esc(data.questionRight)}&ldquo;</p>
    </div>
  </div>
</section>`;
}

/* ── Team ─────────────────────────────────────────────────────────────── */

export function teamSection(data, { headingLevel = 2 } = {}) {
  return `
<section class="section" aria-labelledby="ekipa">
  <div class="shell">
    ${sectionHead({ ...data, accent: 'amber', level: headingLevel, id: 'ekipa' })}
    <div class="grid grid--3">
      ${each(
        data.members,
        (m) => `
      <article class="person">
        <img class="person__photo" src="${esc(m.photo)}" alt="${esc(m.name)} — ${esc(m.role)}, ${esc(site.name)}" width="560" height="700" loading="lazy" decoding="async">
        <div class="person__body">
          <p class="person__role">${esc(m.role)}</p>
          <h3 class="person__name">${esc(m.name)}</h3>
          <div class="person__links">
            <a href="mailto:${esc(m.email)}">${esc(m.email)}</a>
            ${m.phone ? `<a href="${esc(m.phoneHref)}">${esc(m.phone)}</a>` : ''}
          </div>
        </div>
      </article>`
      )}
    </div>
  </div>
</section>`;
}

/* ── FAQ ──────────────────────────────────────────────────────────────────
   Rendered as <details>/<summary>. The answer text is present in the HTML
   whether or not the item is expanded, so crawlers and answer engines read it
   without executing any JavaScript. */

export function faqSection(data, { headingLevel = 2, items } = {}) {
  const list = items ?? data.items;
  return `
<section class="section section--paper" aria-labelledby="pogosta-vprasanja">
  <div class="shell">
    ${sectionHead({
      eyebrow: data.eyebrow,
      title: data.title,
      lead: data.lead,
      accent: 'teal',
      level: headingLevel,
      id: 'pogosta-vprasanja',
    })}
    <div class="faq-list">
      ${each(
        list,
        (item, i) => `
      <details class="faq-item"${i === 0 ? ' open' : ''}>
        <summary>${esc(item.q)}</summary>
        <div class="faq-item__answer"><p>${esc(item.a)}</p></div>
      </details>`
      )}
    </div>
  </div>
</section>`;
}

/* ── Contact ──────────────────────────────────────────────────────────── */

function field(f) {
  const required = f.required ? ' required' : '';
  const control =
    f.type === 'textarea'
      ? `<textarea id="${esc(f.name)}" name="${esc(f.name)}"${required}></textarea>`
      : `<input id="${esc(f.name)}" name="${esc(f.name)}" type="${esc(f.type)}"${
          f.autocomplete ? ` autocomplete="${esc(f.autocomplete)}"` : ''
        }${required}>`;

  return `
        <div class="field">
          <label for="${esc(f.name)}">${esc(f.label)}${f.required ? '' : ' <span class="muted">(neobvezno)</span>'}</label>
          ${control}
        </div>`;
}

export function contactSection(data, { headingLevel = 2 } = {}) {
  return `
<section class="section" aria-labelledby="kontakt">
  <div class="shell">
    ${sectionHead({ ...data, level: headingLevel, id: 'kontakt' })}
    <div class="contact-grid">
      <div>
        <dl class="deflist">
          <div class="deflist__row"><dt>E-pošta</dt><dd><a href="mailto:${esc(site.contact.email)}">${esc(site.contact.email)}</a></dd></div>
          <div class="deflist__row"><dt>Telefon</dt><dd><a href="${esc(site.contact.phoneHref)}">${esc(site.contact.phone)}</a></dd></div>
          <div class="deflist__row"><dt>Lokacija</dt><dd>${esc(site.contact.city)}, ${esc(site.contact.country)}</dd></div>
          <div class="deflist__row"><dt>Jezik</dt><dd>Slovenščina, angleščina</dd></div>
        </dl>
      </div>

      ${contactForm(data)}
    </div>
  </div>
</section>
${formScript()}`;
}

/**
 * The form works without JavaScript: it posts to a `mailto:` address, which
 * opens the visitor's mail client with the fields filled in. When
 * `site.contact.formEndpoint` is configured, the inline script below upgrades
 * it to a background submit with inline status messages.
 */
function contactForm(data) {
  const endpoint = site.contact.formEndpoint;
  const action = endpoint || `mailto:${site.contact.email}`;
  const enctype = endpoint ? '' : ' enctype="text/plain"';

  return `<form class="form" name="kontakt" method="post" action="${esc(action)}"${enctype}${
    endpoint ? ` data-endpoint="${esc(endpoint)}"` : ''
  }>
        ${each(data.formFields, field)}
        <div>
          <button class="btn btn--primary" type="submit">${esc(data.submitLabel)}</button>
        </div>
        <p class="form__status" role="status" aria-live="polite" hidden></p>
        <p class="form__note">Odgovorimo v enem delovnem dnevu. Podatke uporabimo izključno za odgovor na vaše povpraševanje. Lahko nam tudi neposredno pišete na <a href="mailto:${esc(
          site.contact.email
        )}">${esc(site.contact.email)}</a>.</p>
      </form>`;
}

function formScript() {
  return `<script>
(function () {
  var form = document.querySelector('form[name="kontakt"][data-endpoint]');
  if (!form) return;

  var status = form.querySelector('.form__status');
  var button = form.querySelector('button[type="submit"]');
  var label = button.textContent;

  function show(message, ok) {
    status.textContent = message;
    status.hidden = false;
    status.className = 'form__status' + (ok ? ' form__status--ok' : ' form__status--error');
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    button.disabled = true;
    button.textContent = 'Pošiljam…';

    fetch(form.dataset.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    })
      .then(function (res) {
        if (!res.ok) throw new Error(res.status);
        form.reset();
        show('Sporočilo je poslano. Odgovorimo v enem delovnem dnevu.', true);
      })
      .catch(function () {
        show('Sporočila ni bilo mogoče poslati. Pišite nam na ${site.contact.email}.', false);
      })
      .finally(function () {
        button.disabled = false;
        button.textContent = label;
      });
  });
})();
</script>`;
}

/* ── Closing CTA ──────────────────────────────────────────────────────── */

export function ctaBand({ title, lead, primary, secondary }) {
  return `
<section class="cta-band">
  <div class="shell cta-band__inner">
    <h2>${esc(title)}</h2>
    <p class="lead">${esc(lead)}</p>
    <div class="btn-row">
      <a class="btn btn--primary" href="${esc(primary.href)}">${esc(primary.label)}</a>
      ${secondary ? `<a class="btn btn--secondary" href="${esc(secondary.href)}">${esc(secondary.label)}</a>` : ''}
    </div>
  </div>
</section>`;
}

/* ── Generic content blocks used by detail pages ──────────────────────── */

export function capabilityGrid(capabilities, accent = 'blue') {
  return `
    <div class="grid grid--2">
      ${each(
        capabilities,
        (c) => `
      <article class="${cls('card', accentMod('card', accent))}">
        <h3>${esc(c.title)}</h3>
        <p>${esc(c.body)}</p>
      </article>`
      )}
    </div>`;
}

export function definitionList(rows) {
  return `
    <dl class="deflist">
      ${each(
        rows,
        (r) => `<div class="deflist__row"><dt>${esc(r.term)}</dt><dd>${esc(r.definition)}</dd></div>`
      )}
    </dl>`;
}
