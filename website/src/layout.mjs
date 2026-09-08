/**
 * Page shell: <head> metadata, header, footer.
 *
 * Everything here is emitted as static HTML at build time. No client-side
 * rendering, so crawlers and AI answer engines receive the complete content of
 * every page in the initial response.
 */

import { esc, join, each, jsonLd, absolute } from './html.mjs';
import { buildGraph } from './schema.mjs';
import { introOverlay } from './showcase.mjs';
import site from '../content/site.mjs';
import { team } from '../content/content.mjs';

const url = (path) => absolute(site.origin, path);

/* ── Head ─────────────────────────────────────────────────────────────── */

function head(page) {
  const canonical = url(page.path);
  const ogImage = url(page.ogImage ?? site.brand.ogImage);

  return join([
    '<meta charset="utf-8">',
    /* No maximum-scale / user-scalable=no: the original blocked pinch zoom,
       which is an accessibility failure and a mobile-usability signal. */
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">',
    `<title>${esc(page.title)}</title>`,
    `<meta name="description" content="${esc(page.description)}">`,
    page.noindex ? null : `<link rel="canonical" href="${canonical}">`,
    page.noindex
      ? '<meta name="robots" content="noindex, follow">'
      : '<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">',
    `<meta name="author" content="${esc(site.legalName)}">`,
    page.keywords?.length ? `<meta name="keywords" content="${esc(page.keywords.join(', '))}">` : null,

    /* Open Graph */
    '<meta property="og:type" content="website">',
    `<meta property="og:site_name" content="${esc(site.name)}">`,
    `<meta property="og:locale" content="${site.locale}">`,
    `<meta property="og:title" content="${esc(page.ogTitle ?? page.title)}">`,
    `<meta property="og:description" content="${esc(page.description)}">`,
    `<meta property="og:url" content="${canonical}">`,
    `<meta property="og:image" content="${ogImage}">`,
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    `<meta property="og:image:alt" content="${esc(page.ogTitle ?? page.title)}">`,

    /* Twitter / X */
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${esc(page.ogTitle ?? page.title)}">`,
    `<meta name="twitter:description" content="${esc(page.description)}">`,
    `<meta name="twitter:image" content="${ogImage}">`,

    /* Icons + theme */
    `<link rel="icon" href="${esc(site.brand.favicon)}" type="image/png">`,
    `<link rel="apple-touch-icon" href="${esc(site.brand.favicon)}">`,
    '<meta name="theme-color" content="#ffffff">',

    /* Language alternates */
    `<link rel="alternate" hreflang="sl-SI" href="${canonical}">`,
    `<link rel="alternate" hreflang="x-default" href="${canonical}">`,

    /* Fonts — preconnect then load without blocking first paint */
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    '<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap">',
    '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap" media="print" onload="this.media=\'all\'">',
    '<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap"></noscript>',

    '<link rel="stylesheet" href="/styles.css">',
    /* Marks the document as script-capable before first paint so entrance
       animations can start hidden. Without this class the page stays fully
       visible — that is the no-JS path. */
    `<script>
document.documentElement.classList.add('js');
try {
  var path = location.pathname;
  var home = path === '/' || path === '' || path === '/index.html';
  /* The intro plays on every fresh arrival. A hop from within the site after
     it has already played skips it; 'skip' is for tooling and previews. */
  var seen = sessionStorage.getItem('ais-intro');
  var internal = false;
  try { internal = Boolean(document.referrer) && new URL(document.referrer).origin === location.origin; } catch (e) {}
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var skip = seen === 'skip' || /(?:^|[?&])nointro(?:&|=|$)/.test(location.search);
  var bot = /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandex|sogou|exabot|facebot|ia_archiver|crawler|spider/i.test(navigator.userAgent);
  if (home && !(seen && internal) && !reduce && !skip && !bot) {
    document.documentElement.classList.add('is-intro');
  }
} catch (e) {}
</script>`,
    `<link rel="sitemap" type="application/xml" href="/sitemap.xml">`,

    `<script type="application/ld+json">${jsonLd(buildGraph(page))}</script>`,
  ]);
}

/* ── Header ───────────────────────────────────────────────────────────── */

function navLink(item, currentPath) {
  const current = item.href === currentPath ? ' aria-current="page"' : '';
  return `<a href="${esc(item.href)}"${current}>${esc(item.label)}</a>`;
}

function navItem(item, currentPath) {
  if (!item.children?.length) return navLink(item, currentPath);

  const open =
    currentPath === item.href || item.children.some((c) => currentPath.startsWith(c.href))
      ? ' aria-current="page"'
      : '';

  return `
    <details class="nav-dd">
      <summary${open}>${esc(item.label)}</summary>
      <div class="nav-dd__panel">
        <a class="nav-dd__all" href="${esc(item.href)}">Vse storitve</a>
        ${each(
          item.children,
          (child) => `<a href="${esc(child.href)}"><strong>${esc(child.label)}</strong>${
            child.note ? `<span>${esc(child.note)}</span>` : ''
          }</a>`
        )}
      </div>
    </details>`;
}

function header(page) {
  return `
<header class="site-header">
  <div class="shell site-header__inner">
    <a class="brand" href="/" aria-label="${esc(site.name)}, domov">
      <img src="${esc(site.brand.logo)}" alt="${esc(site.name)}" width="${site.brand.logoWidth}" height="${site.brand.logoHeight}" fetchpriority="high">
      <span class="visually-hidden">${esc(site.name)}</span>
    </a>

    <nav class="nav" aria-label="Glavna navigacija">
      ${each(site.nav, (item) => navItem(item, page.path))}
    </nav>

    <a class="btn btn--primary header-cta" href="/kontakt/">Rezervirajte posvet</a>

    <details class="nav-toggle">
      <summary aria-label="Odpri meni">
        <span>Meni</span>
        <span class="nav-toggle__icon" aria-hidden="true"><i></i><i></i></span>
      </summary>
      <nav class="nav-panel" aria-label="Mobilna navigacija">
        ${each(site.nav, (item) =>
          item.children?.length
            ? `${navLink(item, page.path)}${each(item.children, (c) => navLink(c, page.path))}`
            : navLink(item, page.path)
        )}
        <a href="/kontakt/">Rezervirajte posvet</a>
      </nav>
    </details>
  </div>
</header>`;
}

/* ── Breadcrumbs ──────────────────────────────────────────────────────── */

function breadcrumbs(page) {
  if (!page.breadcrumbs?.length || page.breadcrumbs.length < 2) return '';
  const items = page.breadcrumbs
    .map((crumb, i, arr) =>
      i === arr.length - 1
        ? `<li><span aria-current="page">${esc(crumb.label)}</span></li>`
        : `<li><a href="${esc(crumb.href)}">${esc(crumb.label)}</a></li>`
    )
    .join('\n        ');

  return `
<nav class="breadcrumbs shell" aria-label="Drobtinice">
  <ol>
        ${items}
  </ol>
</nav>`;
}

/* ── Footer ───────────────────────────────────────────────────────────── */

/**
 * Footer with everything a visitor might need to reach us: the flat lockup,
 * every section of the site, the public inbox and phone, the people behind
 * the company, and the large typographic "AI Slovenia" wordmark that closes
 * the page. No rules, no borders.
 */
function footer() {
  const columns = each(
    site.footer.columns,
    (col) => `
      <div>
        <h4>${esc(col.title)}</h4>
        <ul class="footer-links">
          ${each(col.links, (l) => `<li><a href="${esc(l.href)}">${esc(l.label)}</a></li>`)}
        </ul>
      </div>`
  );

  const people = each(
    team.members,
    (person) => `
          <li><b>${esc(person.name)}</b>, ${esc(person.role)} <a href="mailto:${esc(person.email)}">${esc(person.email)}</a></li>`
  );

  return `
<footer class="site-footer">
  <div class="shell">
    <div class="footer-grid">
      <div class="footer-brand">
        <a class="brand" href="/" aria-label="${esc(site.name)}, domov">
          <img src="${esc(site.brand.logo)}" alt="${esc(site.name)}" width="${site.brand.logoWidth}" height="${site.brand.logoHeight}" loading="lazy">
        </a>
        <p>${esc(site.footer.blurb)}</p>
      </div>
      <div class="footer-nav">
        ${columns}
      </div>
      <div class="footer-contact">
        <h4>Kontakt</h4>
        <ul class="footer-links">
          <li><a href="mailto:${esc(site.contact.email)}">${esc(site.contact.email)}</a></li>
          <li><a href="${esc(site.contact.phoneHref)}">${esc(site.contact.phone)}</a></li>
          <li><span>${esc(site.contact.city)}, ${esc(site.contact.country)}</span></li>
        </ul>
        <h4 class="footer-people__title">Ekipa</h4>
        <ul class="footer-people">
          ${people}
        </ul>
      </div>
    </div>
    <p class="footer-wordmark" data-footer-mark aria-hidden="true">${esc(site.footer.wordmark)}</p>
    <div class="footer-bottom">
      <span>&copy; ${site.copyrightYear} ${esc(site.legalName)}. Vse pravice pridržane.</span>
      <span>${esc(site.contact.city)}, ${esc(site.contact.country)}</span>
    </div>
  </div>
</footer>`;
}

/* ── Document ─────────────────────────────────────────────────────────── */

export function renderPage(page) {
  return `<!doctype html>
<html lang="${site.lang}">
<head>
${head(page)}
</head>
<body>
<a class="skip-link" href="#main">Preskoči na vsebino</a>
${page.showIntro ? introOverlay() : ''}
${header(page)}
${breadcrumbs(page)}
<main id="main">
${page.body}
</main>
${footer()}
<script src="/js/motion.js" defer></script>
</body>
</html>
`;
}
