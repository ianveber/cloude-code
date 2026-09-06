/**
 * Copy for the home-page showcase sections and the four newer pages
 * (products, news, events, blog).
 *
 * Blocks marked PLACEHOLDER are waiting on real material — partner logos, team
 * photographs, published posts. They render as reserved slots rather than being
 * hidden, so the layout is already the final layout; dropping the real data in
 * is the only remaining step. Search engines are never shown a placeholder as
 * if it were a real item: reserved slots carry no link and no fake date.
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

/* ── Case studies / partners ──────────────────────────────────────────── */

export const caseStudies = {
  eyebrow: 'Reference',
  title: 'S kom sodelujemo',
  lead: 'Sistemi, ki jih postavljamo, se delijo na tri vrste dela.',
  /* PLACEHOLDER — replace `partners` with real names and logo paths.
     Add a `logo: '/partners/ime.svg'` key to render the image instead of the
     reserved monogram tile. */
  partners: [
    { name: 'Partner 01' },
    { name: 'Partner 02' },
    { name: 'Partner 03' },
    { name: 'Partner 04' },
    { name: 'Partner 05' },
    { name: 'Partner 06' },
  ],
  partnersNote: 'Logotipi partnerjev in študije primerov so v pripravi.',
  work: [
    {
      title: 'SaaS izdelki',
      body: 'Lastni izdelki z nadzorno ploščo, uporabniškimi računi in naročninskim modelom.',
      accent: 'blue',
    },
    {
      title: 'Avtomatizacija po meri',
      body: 'Potek dela, ki povezuje orodja, ki jih že uporabljate, in odpravi ročne korake.',
      accent: 'violet',
    },
    {
      title: 'Aplikacije po meri',
      body: 'Interne in javne aplikacije, zgrajene okoli enega konkretnega poslovnega procesa.',
      accent: 'teal',
    },
  ],
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
      accent: 'violet',
    },
    {
      id: 'varnost',
      art: 'shield',
      label: 'Kibernetska varnost',
      body: 'Nadzor dostopa, revizijska sled in šifrirani podatki. Varnost na poslovni ravni.',
      accent: 'teal',
    },
    {
      id: 'aplikacije',
      art: 'app',
      label: 'Aplikacije po meri',
      body: 'Ena aplikacija za en proces. Brez odvečnih funkcij, ki jih nihče ne uporablja.',
      accent: 'amber',
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

/* ── Team showcase ────────────────────────────────────────────────────────
   PLACEHOLDER — `slots` sets how many tiles the band reserves. Members from
   content.mjs fill the first tiles; the rest render as reserved space waiting
   for photographs. */

export const teamShowcase = {
  eyebrow: 'Ekipa',
  title: 'Ljudje za sistemi',
  lead: 'Majhna ekipa, ki sisteme postavi, uvede in jih tudi vzdržuje.',
  slots: 6,
  placeholderNote: 'Mesto rezervirano',
};

/* ── Products ─────────────────────────────────────────────────────────── */

export const products = {
  eyebrow: 'Izdelki',
  title: 'Naši izdelki',
  lead: 'Izdelki, ki jih razvijamo in vzdržujemo sami. Vsak pokriva en jasno omejen proces in ga je mogoče prilagoditi vašemu podjetju.',
  metaTitle: 'Izdelki — SaaS rešitve za avtomatizacijo | AIS Slovenia',
  metaDescription:
    'SaaS izdelki AIS Slovenia za avtomatizacijo poslovnih procesov: obdelava dokumentov, komunikacija s strankami, spremljanje trga in nadzor varnosti.',
  answer:
    'AIS Slovenia razvija štiri lastne SaaS izdelke: sistem za obdelavo dokumentov, sistem za komunikacijo s strankami, sistem za spremljanje trga in sistem za nadzor dostopa ter revizijsko sled. Vsak izdelek deluje samostojno ali kot del večjega sistema.',
  items: [
    {
      name: 'Obdelava dokumentov',
      kicker: 'Administracija',
      body: 'Prebere vhodne dokumente, izlušči podatke, jih uskladi z naročilnico in knjiži v vaš sistem.',
      points: ['Branje PDF in e-pošte', 'Ujemanje z naročilnico', 'Knjiženje v ERP'],
      status: 'V produkciji',
      accent: 'blue',
      href: '/storitve/avtomatizacija-administracije/',
    },
    {
      name: 'Komunikacija s strankami',
      kicker: 'Prodaja',
      body: 'Odgovarja obiskovalcem spletne strani v slovenščini, kvalificira povpraševanja in jih preda ekipi.',
      points: ['Pogovor v slovenščini', 'Delovanje 24/7', 'Predaja s kontekstom'],
      status: 'V produkciji',
      accent: 'violet',
      href: '/storitve/avtomatizacija-prodaje/',
    },
    {
      name: 'Spremljanje trga',
      kicker: 'Analitika',
      body: 'Neprestano pregleduje razpise, konkurenco in vire v vaši panogi ter dostavi le relevantno.',
      points: ['Dnevni pregled', 'Filtri po merilih', 'Strukturiran povzetek'],
      status: 'V produkciji',
      accent: 'teal',
      href: '/storitve/spremljanje-trga/',
    },
    {
      name: 'Nadzor in varnost',
      kicker: 'Varnost',
      body: 'Nadzor dostopa do podatkov, revizijska sled vsake avtomatizirane odločitve in opozorila na odstopanja.',
      points: ['Revizijska sled', 'Nadzor dostopa', 'Opozorila na odstopanja'],
      status: 'V razvoju',
      accent: 'amber',
      href: '/kontakt/',
    },
  ],
};

/* ── News ─────────────────────────────────────────────────────────────────
   PLACEHOLDER — starter entries. Replace with real announcements; the page,
   sitemap and structured data pick up whatever is listed here. */

export const news = {
  eyebrow: 'Novice',
  title: 'Novice',
  lead: 'Kaj je novega pri AIS Slovenia — izdelki, sodelovanja in objave.',
  metaTitle: 'Novice in obvestila | AIS Slovenia',
  metaDescription:
    'Novice AIS Slovenia: nove funkcije izdelkov, sodelovanja s partnerji in objave o AI avtomatizaciji poslovnih procesov.',
  answer:
    'Na strani z novicami AIS Slovenia objavlja obvestila o novih funkcijah izdelkov, sodelovanjih in dogodkih, povezanih z AI avtomatizacijo poslovnih procesov.',
  emptyNote: 'Prostor za naslednjo objavo.',
  reserveSlots: 2,
  items: [
    {
      date: '2026-08-18',
      dateLabel: '18. avgust 2026',
      kicker: 'Izdelek',
      title: 'Obdelava dokumentov zdaj usklajuje tudi dobavnice',
      body: 'Sistem za obdelavo dokumentov poleg računov obdela še dobavnice in jih samodejno uskladi z naročilnico.',
      accent: 'blue',
    },
    {
      date: '2026-06-04',
      dateLabel: '4. junij 2026',
      kicker: 'Podjetje',
      title: 'Širimo ekipo za razvoj integracij',
      body: 'Iščemo razvijalce za integracije z ERP in CRM sistemi, ki jih slovenska podjetja dejansko uporabljajo.',
      accent: 'violet',
    },
    {
      date: '2026-03-11',
      dateLabel: '11. marec 2026',
      kicker: 'Izdelek',
      title: 'Spremljanje trga dobi dnevni povzetek',
      body: 'Priložnosti so odslej dostavljene kot en strukturiran dnevni povzetek namesto posameznih obvestil.',
      accent: 'teal',
    },
  ],
};

/* ── Events ───────────────────────────────────────────────────────────────
   PLACEHOLDER — starter entries; replace with real dates and locations. */

export const events = {
  eyebrow: 'Dogodki',
  title: 'Dogodki',
  lead: 'Delavnice in predstavitve, kjer v živo pokažemo, kako postavimo sistem.',
  metaTitle: 'Dogodki, delavnice in predstavitve | AIS Slovenia',
  metaDescription:
    'Dogodki AIS Slovenia: delavnice o AI avtomatizaciji, predstavitve izdelkov in srečanja za podjetja v Ljubljani in po spletu.',
  answer:
    'AIS Slovenia organizira delavnice in predstavitve o AI avtomatizaciji poslovnih procesov. Dogodki potekajo v Ljubljani in po spletu, udeležba pa je namenjena podjetjem, ki avtomatizacijo šele načrtujejo.',
  emptyNote: 'Prostor za naslednji dogodek.',
  reserveSlots: 2,
  items: [
    {
      date: '2026-10-15',
      dateLabel: '15. oktober 2026',
      time: '09.00–12.00',
      place: 'Ljubljana',
      mode: 'V živo',
      kicker: 'Delavnica',
      title: 'Zmapirajte svoj proces v treh urah',
      body: 'Praktična delavnica: kako proces razstaviti na sprožilce, pravila in izjeme, preden se ga sploh lotimo avtomatizirati.',
      accent: 'blue',
    },
    {
      date: '2026-11-06',
      dateLabel: '6. november 2026',
      time: '10.00–11.00',
      place: 'Splet',
      mode: 'Spletno',
      kicker: 'Predstavitev',
      title: 'Obdelava dokumentov v praksi',
      body: 'Predstavitev v živo: od prejetega računa do knjižbe v ERP, brez ročnih korakov.',
      accent: 'violet',
    },
  ],
};

/* ── Blog ─────────────────────────────────────────────────────────────────
   PLACEHOLDER — no posts published yet. `reserveSlots` renders empty tiles so
   the grid already has its final shape. */

export const blog = {
  eyebrow: 'Blog',
  title: 'Blog',
  lead: 'Zapiski o avtomatizaciji, AI agentih in tem, kaj v praksi deluje in kaj ne.',
  metaTitle: 'Blog o AI avtomatizaciji poslovnih procesov | AIS Slovenia',
  metaDescription:
    'Blog AIS Slovenia: praktični zapiski o AI avtomatizaciji, AI agentih, integracijah in avtomatizaciji poslovnih procesov v slovenskih podjetjih.',
  answer:
    'Blog AIS Slovenia zbira praktične zapiske o avtomatizaciji poslovnih procesov z umetno inteligenco — kako se sistemi postavljajo, kje se avtomatizacija izplača in katere napake se pri uvedbi ponavljajo.',
  emptyNote: 'Prostor za naslednji zapis.',
  reserveSlots: 6,
  items: [],
  homeTitle: 'Iz bloga',
  homeLead: 'Prvi zapisi so v pripravi.',
  homeSlots: 3,
};
