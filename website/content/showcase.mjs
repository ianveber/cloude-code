/**
 * Copy for the home-page showcase sections and the products, news, events and
 * blog pages. Unpublished material is represented by honest empty states.
 *
 * Home sections carry a tag and a title, nothing more. Body copy appears only
 * where a section needs it (one sentence per client, one per pillar).
 */

/* ── Opening sequence ───────────────────────────────────────────────────
   Typed next to the brain, one character at a time, on a white screen. */

export const intro = {
  brand: 'AIS',
  tail: 'Slovenia',
};

/* ── Build stage: three clips from the workshop ─────────────────────────
   The only dark block on the home page. Three clips take turns in front,
   then spread out side by side, then gather again with the next one in front. */

export const buildStage = {
  eyebrow: 'Delavnica',
  title: 'Kako nastane sistem',
  screens: [
    {
      id: 'flow',
      label: 'Avtomatizacija',
      poster: '/video/flow-poster.jpg',
      sources: [
        { src: '/video/flow.webm', type: 'video/webm' },
        { src: '/video/flow.mp4', type: 'video/mp4' },
      ],
    },
    {
      id: 'code',
      label: 'Razvoj',
      poster: '/video/code-poster.jpg',
      sources: [
        { src: '/video/code.webm', type: 'video/webm' },
        { src: '/video/code.mp4', type: 'video/mp4' },
      ],
    },
    {
      id: 'saas',
      label: 'SaaS izdelek',
      poster: '/video/saas-poster.jpg',
      sources: [
        { src: '/video/saas.webm', type: 'video/webm' },
        { src: '/video/saas.mp4', type: 'video/mp4' },
      ],
    },
  ],
};

/* ── Clients marquee ────────────────────────────────────────────────────
   Two rows of small pills, each with a client's logo and name, nothing else.

   Logos come from each client's own website (public/clients/). INSPECTUS,
   Pacom, ZaLife, Elementum, Tower Spa Celje, Dr. Asya Grafy Bio Institute,
   SI-BIG, HEVA and Epolac are clients; AISOS, VETA and ATHLOS are our own
   products and brands. `tone: 'dark'` puts a dark disc behind a logo drawn
   for dark surfaces. Before a production deploy, confirm with each client
   that their logo may appear here. */

export const clients = {
  eyebrow: 'Reference',
  title: 'S kom smo delali',
  items: [
    {
      name: 'INSPECTUS',
      href: 'https://inspectus.si/',
      logo: { src: '/clients/inspectus.png', width: 608, height: 224 },
    },
    {
      name: 'Pacom',
      href: 'https://pacom.si/',
      logo: { src: '/clients/pacom.png', width: 300, height: 259 },
    },
    {
      name: 'ZaLife',
      href: 'https://www.zalife.eu/',
      logo: { src: '/clients/zalife.png', width: 593, height: 240 },
    },
    {
      name: 'Elementum',
      href: 'https://elementum.si/',
      logo: { src: '/clients/elementum.png', width: 443, height: 85 },
    },
    {
      name: 'Tower Spa Celje',
      href: 'https://towerspacelje.com/',
      logo: { src: '/clients/towerspa.png', width: 400, height: 436 },
    },
    {
      name: 'Dr. Asya Grafy Bio Institute',
      href: 'https://drasyagrafy.com/',
      logo: { src: '/clients/asyagrafy.png', width: 600, height: 363 },
    },
    {
      name: 'AISOS',
      logo: { src: '/clients/aisos.svg', width: 1168, height: 1104 },
    },
    {
      name: 'SI-BIG',
      href: 'https://si-big.com/',
      logo: { src: '/clients/sibig.png', width: 592, height: 541 },
    },
    {
      name: 'HEVA',
      href: 'https://www.heva.si/',
      logo: { src: '/clients/heva.png', width: 110, height: 50 },
    },
    {
      name: 'Epolac',
      href: 'https://www.epolac.com/',
      logo: { src: '/clients/epolac.png', width: 308, height: 83 },
      tone: 'dark',
    },
    {
      name: 'VETA',
      logo: { src: '/clients/veta.svg', width: 512, height: 512 },
    },
    {
      name: 'ATHLOS',
      logo: { src: '/clients/athlos.svg', width: 48, height: 46 },
    },
  ],
};

/* ── Three pillars ──────────────────────────────────────────────────────
   White section after the dark stage. Each pillar is a title, one sentence
   and a product picture rendered from tools/pictures/scene.html. */

export const pillars = {
  eyebrow: 'Storitve',
  title: 'Kaj gradimo',
  items: [
    {
      id: 'saas',
      title: 'SaaS izdelki',
      body: 'Izdelek z nadzorno ploščo, uporabniki in naročnino. Od prve skice do objave.',
      picture: {
        src: '/pictures/saas',
        alt: 'Nadzorna plošča SaaS izdelka za obdelavo dokumentov s ključnimi številkami, grafom in seznamom zadnjih dokumentov.',
        width: 1600,
        height: 1000,
      },
      link: { label: 'Poglejte izdelke', href: '/produkti/' },
    },
    {
      id: 'avtomatizacija',
      title: 'Avtomatizacije',
      body: 'Potek dela, ki teče sam. Sprožilci, pravila in izjeme na enem mestu, vsak zagon zabeležen.',
      picture: {
        src: '/pictures/flow',
        alt: 'Urejevalnik poteka dela z vozlišči za e-račun, AI razčlenitev, pravilo in samodejno knjiženje ter seznamom zadnjih zagonov.',
        width: 1600,
        height: 1000,
      },
      link: { label: 'Poglejte storitve', href: '/storitve/' },
    },
    {
      id: 'varnost',
      title: 'Varnost in aplikacije',
      body: 'Aplikacije po meri z nadzorom dostopa, revizijsko sledjo in šifriranimi podatki.',
      picture: {
        src: '/pictures/security',
        alt: 'Varnostna konzola ob mobilni aplikaciji: matrika dostopa, šifriranje, revizijska sled in stanje sistema.',
        width: 1600,
        height: 1000,
      },
      link: { label: 'Rezervirajte posvet', href: '/kontakt/' },
    },
  ],
};

/* ── Closing CTA ──────────────────────────────────────────────────────── */

export const ctaBlock = {
  eyebrow: 'Začnimo',
  title: 'Povejte nam, kaj vas zadržuje',
  fields: [
    { name: 'ime', label: 'Ime in priimek', type: 'text', autocomplete: 'name', required: true },
    { name: 'podjetje', label: 'Podjetje', type: 'text', autocomplete: 'organization', required: false },
    { name: 'email', label: 'Poslovna e-pošta', type: 'email', autocomplete: 'email', required: true },
  ],
  submitLabel: 'Pošljite povpraševanje',
};

/* ── Team showcase ────────────────────────────────────────────────────── */

export const teamShowcase = {
  eyebrow: 'Ekipa',
  title: 'Ljudje za sistemi',
};

/* ── Products ─────────────────────────────────────────────────────────── */

export const products = {
  eyebrow: 'Izdelki',
  title: 'Naši izdelki',
  lead: 'Na tej strani bomo objavili preverjene informacije o izdelkih AIS Slovenia.',
  metaTitle: 'Izdelki in SaaS rešitve za avtomatizacijo | AIS Slovenia',
  metaDescription:
    'Informacije o izdelkih AIS Slovenia bodo objavljene, ko bodo pripravljene in potrjene za javno predstavitev.',
  answer:
    'AIS Slovenia trenutno nima javno objavljenega kataloga izdelkov. Preverjene informacije bomo dodali na to stran.',
  items: [],
  empty: {
    title: 'Vsebina je v pripravi',
    body: 'Izdelke bomo objavili, ko bodo pripravljeni in potrjeni za javno predstavitev.',
    action: { label: 'Kontaktirajte nas', href: '/kontakt/' },
  },
};

/* ── News ─────────────────────────────────────────────────────────────── */

export const news = {
  eyebrow: 'Novice',
  title: 'Novice',
  lead: 'Na tej strani bodo objavljena preverjena obvestila AIS Slovenia.',
  metaTitle: 'Novice in obvestila | AIS Slovenia',
  metaDescription:
    'Preverjene novice in obvestila AIS Slovenia bodo objavljeni na tej strani.',
  answer:
    'AIS Slovenia trenutno nima javno objavljenih novic. Potrjena obvestila bomo dodali na to stran.',
  items: [],
  empty: {
    title: 'Vsebina je v pripravi',
    body: 'Novice bomo objavili, ko bodo pripravljene in potrjene za javno predstavitev.',
    action: { label: 'Kontaktirajte nas', href: '/kontakt/' },
  },
};

/* ── Events ───────────────────────────────────────────────────────────── */

export const events = {
  eyebrow: 'Dogodki',
  title: 'Dogodki',
  lead: 'Na tej strani bodo objavljeni potrjeni dogodki AIS Slovenia.',
  metaTitle: 'Dogodki, delavnice in predstavitve | AIS Slovenia',
  metaDescription:
    'Potrjeni dogodki AIS Slovenia in njihove osnovne informacije bodo objavljeni na tej strani, ko bodo pripravljeni za javnost.',
  answer:
    'AIS Slovenia trenutno nima javno objavljenih dogodkov. Potrjene dogodke bomo dodali na to stran.',
  items: [],
  empty: {
    title: 'Vsebina je v pripravi',
    body: 'Dogodke bomo objavili, ko bodo pripravljeni in potrjeni za javno predstavitev.',
    action: { label: 'Kontaktirajte nas', href: '/kontakt/' },
  },
};

/* ── Blog ─────────────────────────────────────────────────────────────── */

export const blog = {
  eyebrow: 'Blog',
  title: 'Blog',
  lead: 'Na tej strani bodo objavljeni potrjeni zapisi AIS Slovenia.',
  metaTitle: 'Blog o AI avtomatizaciji poslovnih procesov | AIS Slovenia',
  metaDescription:
    'Potrjeni zapisi AIS Slovenia o AI avtomatizaciji bodo objavljeni na tej strani.',
  answer:
    'AIS Slovenia trenutno nima javno objavljenih blog zapisov. Potrjene članke bomo dodali na to stran.',
  items: [],
  homeTitle: 'Iz bloga',
  homeEmpty: 'Prvi zapisi so v pripravi.',
  empty: {
    title: 'Vsebina je v pripravi',
    body: 'Blog zapise bomo objavili, ko bodo pripravljeni in potrjeni za javno predstavitev.',
    action: { label: 'Kontaktirajte nas', href: '/kontakt/' },
  },
};
