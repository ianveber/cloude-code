/**
 * Copy for the home-page showcase sections and the products, news, events and
 * blog pages. Unpublished material is represented by honest empty states.
 */

/* ── Converge band: three screens that become one product ─────────────── */

export const converge = {
  eyebrow: 'Kako nastane',
  title: 'Od diagrama do delujočega izdelka',
  lead: 'Vsak sistem gre skozi iste tri korake. Najprej zmapiramo potek dela, nato ga sprogramiramo, na koncu pa iz njega nastane izdelek, ki dela namesto vas.',
  screens: [
    {
      id: 'flow',
      label: 'Diagram poteka',
      caption: 'Proces zmapiramo do zadnjega koraka — sprožilci, pravila, izjeme.',
      poster: '/video/flow-poster.jpg',
      sources: [
        { src: '/video/flow.webm', type: 'video/webm' },
        { src: '/video/flow.mp4', type: 'video/mp4' },
      ],
    },
    {
      id: 'code',
      label: 'Razvoj',
      caption: 'Iz diagrama nastane koda — agenti, integracije, testi, uvedba.',
      poster: '/video/code-poster.jpg',
      sources: [
        { src: '/video/code.webm', type: 'video/webm' },
        { src: '/video/code.mp4', type: 'video/mp4' },
      ],
    },
    {
      id: 'saas',
      label: 'Izdelek',
      caption: 'Rezultat je SaaS izdelek z nadzorno ploščo, ki prihrani ure in stroške.',
      poster: '/video/saas-poster.jpg',
      sources: [
        { src: '/video/saas.webm', type: 'video/webm' },
        { src: '/video/saas.mp4', type: 'video/mp4' },
      ],
    },
  ],
  outro: 'Trije koraki, en sistem.',
};

/* ── Black capability band ────────────────────────────────────────────────
   The lead line is revealed word by word as the section scrolls, so the
   sentence reads as if it is still being written. The text is complete in the
   HTML — the effect only changes opacity. */

export const capabilities = {
  eyebrow: 'Kaj delamo',
  /* Kept as one sentence: the scroll reveal reads best without a hard break. */
  line: 'Gradimo programsko opremo, ki prevzame delo — SaaS izdelke, avtomatizacijo procesov, kibernetsko varnost in aplikacije po meri.',
  items: [
    {
      id: 'saas',
      art: 'saas',
      label: 'SaaS izdelki',
      body: 'Izdelek z nadzorno ploščo, uporabniki in naročnino. Od prve skice do objave.',
      accent: 'blue',
    },
    {
      id: 'avtomatizacija',
      art: 'flow',
      label: 'Avtomatizacija',
      body: 'Diagram poteka, ki teče sam. Sprožilci, pravila in izjeme na enem mestu.',
      accent: 'blue',
    },
    {
      id: 'varnost',
      art: 'shield',
      label: 'Kibernetska varnost',
      body: 'Nadzor dostopa, revizijska sled in šifrirani podatki. Varnost na poslovni ravni.',
      accent: 'blue',
    },
    {
      id: 'aplikacije',
      art: 'app',
      label: 'Aplikacije po meri',
      body: 'Ena aplikacija za en proces. Brez odvečnih funkcij, ki jih nihče ne uporablja.',
      accent: 'blue',
    },
  ],
};

/* ── Immersive CTA ────────────────────────────────────────────────────── */

export const ctaBlock = {
  eyebrow: 'Začnimo',
  title: 'Povejte nam, kaj vas zadržuje',
  lead: 'Pustite kontakt in pripravimo predlog, kje se avtomatizacija najhitreje izplača.',
  fields: [
    { name: 'ime', label: 'Ime in priimek', type: 'text', autocomplete: 'name', required: true },
    { name: 'podjetje', label: 'Podjetje', type: 'text', autocomplete: 'organization', required: false },
    { name: 'email', label: 'Poslovna e-pošta', type: 'email', autocomplete: 'email', required: true },
  ],
  submitLabel: 'Pošljite povpraševanje',
  footnote: 'Odgovorimo v enem delovnem dnevu. Brez naročniške liste.',
};

/* ── Team showcase ────────────────────────────────────────────────────── */

export const teamShowcase = {
  eyebrow: 'Ekipa',
  title: 'Ljudje za sistemi',
  lead: 'Majhna ekipa, ki sisteme postavi, uvede in jih tudi vzdržuje.',
};

/* ── Products ─────────────────────────────────────────────────────────── */

export const products = {
  eyebrow: 'Izdelki',
  title: 'Naši izdelki',
  lead: 'Na tej strani bomo objavili preverjene informacije o izdelkih AIS Slovenia.',
  metaTitle: 'Izdelki — SaaS rešitve za avtomatizacijo | AIS Slovenia',
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
  homeLead: 'Potrjeni zapisi bodo objavljeni na blogu.',
  empty: {
    title: 'Vsebina je v pripravi',
    body: 'Blog zapise bomo objavili, ko bodo pripravljeni in potrjeni za javno predstavitev.',
    action: { label: 'Kontaktirajte nas', href: '/kontakt/' },
  },
};
