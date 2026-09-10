/**
 * Section components.
 *
 * Each function returns a self-contained block of static markup. They are
 * composed into pages in build.mjs. No component uses absolute positioning to
 * stack content; restrained AIS-blue rules stay in normal flow.
 */

import { esc, each, cls } from './html.mjs';
import { serviceGlyph, stageScene } from './decor.mjs';
import { explorer as explorerCopy } from '../content/content.mjs';
import site from '../content/site.mjs';

/** Section heading block: eyebrow + h2 + lead. */
export function sectionHead({ eyebrow, title, lead, level = 2, id }) {
  const H = `h${level}`;
  return `
    <div class="section-head" data-reveal>
      ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}
      <${H}${id ? ` id="${esc(id)}"` : ''}>${esc(title)}</${H}>
      ${lead ? `<p class="lead">${esc(lead)}</p>` : ''}
    </div>`;
}

/** Answer-first summary box. Written to be quotable by AI answer engines. */
export function takeaway({ label = 'Na kratko', text }) {
  return `
    <div class="takeaway">
      <p class="takeaway__label">${esc(label)}</p>
      <p>${esc(text)}</p>
    </div>`;
}

/* ── Hero ─────────────────────────────────────────────────────────────────
   The home page uses brainHero() from showcase.mjs. This is the quieter
   sub-page variant. */
export function pageHero({ eyebrow, title, lead, cta }) {
  return `
<section class="hero hero--page">
  <div class="shell">
    <div class="hero__inner">
      <p class="eyebrow" data-enter="1">${esc(eyebrow)}</p>
      <h1 data-type-in>${esc(title)}</h1>
      <p class="lead" data-enter="2">${esc(lead)}</p>
      ${
        cta
          ? `<div class="btn-row"><a class="btn btn--primary" href="${esc(cta.href)}">${esc(cta.label)}</a></div>`
          : ''
      }
      <p class="hero__meta">Posodobljeno <time datetime="{{dateModifiedIso}}">{{dateModified}}</time></p>
    </div>
  </div>
</section>`;
}

/* ── Feature explorer ─────────────────────────────────────────────────── */

export function featureExplorer(services) {
  return `
<section class="explorer" id="storitve" aria-labelledby="explorer-title" data-services>
  <div class="shell explorer__head">
    <p class="eyebrow">${esc(explorerCopy.eyebrow)}</p>
    <h2 id="explorer-title">${esc(explorerCopy.title)}</h2>
    <p class="lead">${esc(explorerCopy.lead)}</p>
  </div>
  <div class="shell explorer__grid">
    <ol class="explorer__list">
      ${each(
        services,
        (s, i) => `
      <li class="${cls('explorer__item', i === 0 ? 'is-active' : '')}" data-explorer-item="${esc(s.slug)}">
        <a class="explorer__copy" href="/storitve/${esc(s.slug)}/">
          <span class="explorer__kicker">${esc(s.role)}</span>
          <h3>${esc(s.name)}</h3>
          <p>${esc(s.summary)}</p>
        </a>
      </li>`
      )}
    </ol>
    <div class="explorer__stage" aria-hidden="true">
      ${each(
        services,
        (s, i) => `
      <figure class="${cls('explorer__scene', i === 0 ? 'is-active' : '')}" data-explorer-scene="${esc(s.slug)}">
        ${stageScene(s.slug)}
      </figure>`
      )}
    </div>
  </div>
</section>`;
}

/* ── Twin CTA cards ───────────────────────────────────────────────────── */

export function twinCtaSection(data) {
  return `
<section class="twin" aria-label="${esc(data.eyebrow)}">
  <div class="shell twin__grid">
    ${each(
      data.items,
      (item, i) => `
    <article class="twin__card" data-reveal>
      <p class="twin__kicker">${esc(item.kicker)}</p>
      <h2>${esc(item.title)}</h2>
      <p>${esc(item.body)}</p>
      <a class="btn ${i === 0 ? 'btn--primary' : 'btn--secondary'}" href="${esc(item.cta.href)}">${esc(item.cta.label)}</a>
    </article>`
    )}
  </div>
</section>`;
}

/* ── Replacement pairs ────────────────────────────────────────────────── */

export function optimizationSection(data) {
  return `
<section class="section" aria-labelledby="optimizacija">
  <div class="shell">
    ${sectionHead({ ...data, id: 'optimizacija' })}
    <div class="grid grid--4">
      ${each(
        data.pairs,
        (p) => `
      <div class="pair">
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
    ${sectionHead({ ...data, id: 'izzivi' })}
    <div class="grid grid--4">
      ${each(
        data.items,
        (item) => `
      <article class="card">
        <h3>${esc(item.title)}</h3>
        <p>${esc(item.body)}</p>
      </article>`
      )}
    </div>
  </div>
</section>`;
}

/* ── Process ──────────────────────────────────────────────────────────── */

export function processOverview(meta, phases) {
  return `
<section class="section process-overview" aria-labelledby="proces-pregled" data-process-overview>
  <div class="shell">
    ${sectionHead({ ...meta, id: 'proces-pregled' })}
    <ol class="process-overview__track">
      ${each(
        phases,
        (phase) => `
      <li class="card">
        <span class="step__num" aria-hidden="true">${esc(phase.number)}</span>
        <h3>${esc(phase.title)}</h3>
        <p>${esc(phase.body)}</p>
        <a class="link" href="${esc(phase.href)}">Podrobneje</a>
      </li>`
      )}
    </ol>
  </div>
</section>`;
}

export function processSection(meta, steps, { headingLevel = 2, showCta = true } = {}) {
  return `
<section class="section" aria-labelledby="proces">
  <div class="shell">
    ${sectionHead({ ...meta, level: headingLevel, id: 'proces' })}
    <ol class="steps">
      ${each(
        steps,
        (s) => `
      <li class="step"${s.id ? ` id="${esc(s.id)}"` : ''}>
        <span class="step__num" aria-hidden="true">${esc(s.number)}</span>
        <div>
          <div class="step__head">
            <h3>${esc(s.title)}</h3>
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
<section class="section" aria-labelledby="storitve">
  <div class="shell">
    ${sectionHead({ ...meta, id: 'storitve' })}
    <div class="grid grid--3">
      ${each(
        services,
        (s) => `
      <article class="svc">
        <span class="svc__mark" aria-hidden="true">${serviceGlyph(s.slug)}</span>
        <h3 class="svc__name">${esc(s.name)}</h3>
        <p class="svc__role">${esc(s.role)}</p>
        <p class="svc__summary">${esc(s.summary)}</p>
        <ul class="svc__tags">
          ${each(s.tags, (t) => `<li class="chip">${esc(t)}</li>`)}
        </ul>
        ${
          linkToDetail
            ? `<div class="svc__foot">
          <a class="link" href="/storitve/${esc(s.slug)}/">Več o storitvi</a>
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
    ${sectionHead({ ...data, id: 'rezultat' })}
    <div class="grid grid--3">
      ${each(
        data.items,
        (item) => `
      <article class="card">
        <h3>${esc(item.title)}</h3>
        <p>${esc(item.body)}</p>
      </article>`
      )}
    </div>
    ${
      data.audience
        ? `<div class="audience">
      <h3>${esc(data.audience.title)}</h3>
      <p>${esc(data.audience.body)}</p>
    </div>`
        : ''
    }
  </div>
</section>`;
}

/* ── About ────────────────────────────────────────────────────────────── */

export function aboutSection(data, { headingLevel = 2 } = {}) {
  return `
<section class="section" aria-labelledby="pristop">
  <div class="shell">
    ${sectionHead({
      eyebrow: data.eyebrow,
      title: data.title,
      lead: data.lead,
      level: headingLevel,
      id: 'pristop',
    })}
    <div class="approach">
      <h3>${esc(data.approachTitle)}</h3>
      <p class="approach__label">${esc(data.questionIntro)}</p>
      <p class="approach__q approach__q--muted">&bdquo;${esc(data.questionWrong)}&ldquo;</p>
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
    ${sectionHead({ ...data, level: headingLevel, id: 'ekipa' })}
    <div class="grid grid--3">
      ${each(
        data.members,
        (m) => `
      <article class="person">
        <img class="person__photo" src="${esc(m.photo)}" alt="${esc(m.name)}, ${esc(m.role)}, ${esc(site.name)}" width="560" height="700" loading="lazy" decoding="async">
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
   Answers stay in the HTML for crawlers. Home disclosures start closed so
   the plus affordance is honest. The dedicated FAQ page uses the
   always-visible list variant.

   'list'       — plain headings and paragraphs, for the dedicated FAQ page.
   'disclosure' — closed <details>, collapsible for scanning. */

export function faqSection(data, { headingLevel = 2, items, variant = 'disclosure', dark = false } = {}) {
  const list = items ?? data.items;

  const body =
    variant === 'list'
      ? each(
          list,
          (item) => `
      <article class="faq-entry">
        <h3 class="faq-entry__q">${esc(item.q)}</h3>
        <p class="faq-entry__a">${esc(item.a)}</p>
      </article>`
        )
      : each(
          list,
          (item) => `
      <details class="faq-item">
        <summary>${esc(item.q)}<span class="faq-item__icon" aria-hidden="true"></span></summary>
        <div class="faq-item__answer"><p>${esc(item.a)}</p></div>
      </details>`
        );

  const head = sectionHead({
    eyebrow: data.eyebrow,
    title: data.title,
    lead: dark ? '' : data.lead,
    level: headingLevel,
    id: 'pogosta-vprasanja',
  });

  /* The home page puts the questions in a rounded black panel. */
  if (dark) {
    return `
<section class="section faq faq--dark" aria-labelledby="pogosta-vprasanja">
  <div class="faq__panel">
    <div class="shell">
      ${head.replace('class="eyebrow"', 'class="eyebrow eyebrow--onDark"')}
      <div class="faq-list">
        ${body}
      </div>
    </div>
  </div>
</section>`;
  }

  return `
<section class="section" aria-labelledby="pogosta-vprasanja">
  <div class="shell">
    ${head}
    <div class="faq-list">
      ${body}
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

export function capabilityGrid(capabilities) {
  return `
    <div class="grid grid--2">
      ${each(
        capabilities,
        (c) => `
      <article class="card">
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
