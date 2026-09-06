/**
 * Page shell: <head> metadata, header, footer.
 *
 * Everything here is emitted as static HTML at build time. No client-side
 * rendering, so crawlers and AI answer engines receive the complete content of
 * every page in the initial response.
 */

import { esc, join, each, jsonLd, absolute } from './html.mjs';
import { buildGraph } from './schema.mjs';
import { decorSprite } from './decor.mjs';
import site from '../content/site.mjs';

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
    '<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap">',
    '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" media="print" onload="this.media=\'all\'">',
    '<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"></noscript>',

    '<link rel="stylesheet" href="/styles.css">',
    /* Marks the document as script-capable before first paint so entrance
       animations can start hidden. Without this class the page stays fully
       visible — that is the no-JS path. */
    `<script>
document.documentElement.classList.add('js');
try {
  var path = location.pathname;
  var home = path === '/' || path === '' || path === '/index.html';
  var seen = sessionStorage.getItem('ais-intro');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var skip = /(?:^|[?&])nointro(?:&|=|$)/.test(location.search);
  if (home && !seen && !reduce && !skip) {
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
        <a href="${esc(item.href)}">Vse storitve</a>
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
    <a class="brand" href="/" aria-label="${esc(site.name)} — domov">
      <img src="${esc(site.brand.logo)}" alt="${esc(site.name)}" width="${site.brand.logoWidth}" height="${site.brand.logoHeight}" fetchpriority="high">
      <span class="visually-hidden">${esc(site.name)}</span>
    </a>

    <nav class="nav" aria-label="Glavna navigacija">
      ${each(site.nav, (item) => navItem(item, page.path))}
    </nav>

    <a class="btn btn--primary header-cta" href="/kontakt/">Rezervirajte posvet</a>

    <details class="nav-toggle">
      <summary aria-label="Odpri meni">Meni</summary>
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

  return `
<footer class="site-footer">
  <div class="shell">
    <hr class="footer-rule" aria-hidden="true">
    <div class="footer-grid">
      <div class="footer-brand">
        <a class="brand" href="/" aria-label="${esc(site.name)} — domov">
          <img src="${esc(site.brand.logo)}" alt="${esc(site.name)}" width="${site.brand.logoWidth}" height="${site.brand.logoHeight}" loading="lazy">
        </a>
        <p>${esc(site.footer.blurb)}</p>
      </div>
      ${columns}
      <div>
        <h4>Kontakt</h4>
        <ul class="footer-links">
          <li><a href="mailto:${esc(site.contact.email)}">${esc(site.contact.email)}</a></li>
          <li><a href="${esc(site.contact.phoneHref)}">${esc(site.contact.phone)}</a></li>
          <li><span>${esc(site.contact.city)}, ${esc(site.contact.country)}</span></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; ${site.copyrightYear} ${esc(site.name)}. Vse pravice pridržane.</span>
      <span>${esc(site.legalName)}</span>
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
${header(page)}
${breadcrumbs(page)}
<main id="main">
${page.body}
</main>
${footer()}
${decorSprite(page.body)}
<script src="/js/motion.js" defer></script>
</body>
</html>
`;
}
