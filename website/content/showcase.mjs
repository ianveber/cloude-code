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

/* ── Products and projects ──────────────────────────────────────────────
   Our own products first, then the systems we built for clients. Every
   picture is a demo screen rendered from tools/pictures/products.html after
   the real system; the numbers on the screens are illustrative. */

export const products = {
  eyebrow: 'Izdelki in projekti',
  title: 'Kaj smo zgradili',
  lead: 'Izdelki, ki jih razvijamo sami, in sistemi, ki smo jih postavili za stranke.',
  homeTitle: 'Kaj smo zgradili',
  metaTitle: 'Izdelki in projekti | AIS Slovenia',
  metaDescription:
    'SaaS izdelki, avtomatizacije in AI modeli, ki jih je AIS Slovenia zgradila zase in za stranke: ATHLOS, AIS Command, AISOS, INSPECTUS, Pacom in ZaLife.',
  answer:
    'AIS Slovenia razvija lastne izdelke (ATHLOS, AIS Command, AISOS) in gradi sisteme za stranke: avtomatizaciji za INSPECTUS, marketinški sistem za Pacom, vsebinski sistem za ZaLife in napovedni model za premaze.',
  items: [
    {
      id: 'athlos',
      kicker: 'Lastni izdelek',
      kind: 'SaaS izdelek',
      name: 'ATHLOS',
      body: 'Športni operacijski sistem. Športnik v aplikaciji vidi današnji trening, ga izvede po blokih in opravi jutranji check-in, iz katerega dobi oceno pripravljenosti. Trener sestavlja treninge iz svoje knjižnice in spremlja obremenitev ekipe. Vgrajeni AI trener ZEUS odgovarja na vprašanja in sme s privoljenjem športnika popraviti serije, vsako spremembo pa trener lahko razveljavi.',
      picture: { src: '/pictures/athlos', alt: 'Aplikacija ATHLOS za športnika z današnjim treningom ob nadzorni plošči za trenerja.', width: 1600, height: 1000 },
    },
    {
      id: 'ais-command',
      kicker: 'Lastni izdelek',
      kind: 'SaaS izdelek',
      name: 'AIS Command',
      body: 'CRM in portal za stranke v enem. Interno: odnosi, prodajni lijak, projekti, storitve, podpora in računi. Za stranko: njeni projekti, stanje storitev, računi in plačilo na enem mestu. V ozadju teče agentno izvajalno okolje, ki pripravlja osnutke, opomnike in mesečno zaračunavanje.',
      picture: { src: '/pictures/ais-command', alt: 'AIS Command s prodajnim lijakom, pogledom na stranko in seznamom računov.', width: 1600, height: 1000 },
    },
    {
      id: 'aisos',
      kicker: 'Lastni izdelek',
      kind: 'Agentni sistem',
      name: 'AISOS',
      body: 'Agentni operacijski sistem podjetja. Agenti vsako jutro pripravijo pregled dneva iz koledarja, e-pošte in nalog, pripravijo osnutke vsebin in računov ter povedo, kaj potrebuje človeka. Nič ne gre ven brez potrditve.',
      picture: { src: '/pictures/aisos', alt: 'AISOS z jutranjim pregledom, seznamom agentov in nalogami, ki čakajo na človeka.', width: 1600, height: 1000 },
    },
    {
      id: 'inspectus-vldr',
      kicker: 'Za stranko',
      kind: 'Avtomatizacija',
      name: 'INSPECTUS VLDR',
      client: 'INSPECTUS',
      body: 'Dokumentacijski cevovod za pregled vozil v pristanišču. Sistem prebere izvoz poročila o škodah, uredi podatke po vozilih in za vsako vozilo natisne kartico VLDR v obliki, ki jo zahteva proizvajalec. Ročno urejanje preglednic je odpadlo.',
      picture: { src: '/pictures/inspectus-vldr', alt: 'Seznam vozil iz poročila o pregledu ob predogledu kartice VLDR.', width: 1600, height: 1000 },
    },
    {
      id: 'inspectus-vin',
      kicker: 'Za stranko',
      kind: 'Avtomatizacija',
      name: 'INSPECTUS VIN filter',
      client: 'INSPECTUS',
      body: 'Pametni filter fotografij s pomola. Tablica s številko VIN odpre vozilo, posnetki za njo mu pripadajo, rezultat pa se v obe smeri preveri proti ladijskemu seznamu razkladanja. Neujemanja dobi človek na pregled.',
      picture: { src: '/pictures/inspectus-vin', alt: 'Fotografije s pomola, razvrščene po vozilih, s preverjanjem proti seznamu razkladanja.', width: 1600, height: 1000 },
    },
    {
      id: 'model-premazi',
      kicker: 'Za stranko',
      kind: 'AI model',
      name: 'Model za premaze',
      body: 'Napovedni model za formulacije premazov. Iz sestave izračuna gostoto, viskoznost, suho snov in prekrivnost, preden kdo kaj zmeša, in pove, kako zanesljiva je napoved. Za formulacije zunaj podatkov, na katerih se je učil, odgovor odkloni.',
      picture: { src: '/pictures/model-premazi', alt: 'Vnos sestave premaza z napovedanimi lastnostmi in oceno zanesljivosti.', width: 1600, height: 1000 },
    },
    {
      id: 'pacom',
      kicker: 'Za stranko',
      kind: 'Marketinški sistem',
      name: 'Pacom',
      client: 'Čistilni servis Pacom',
      body: 'Sistem za obstoječe stranke čistilnega servisa: CRM s segmenti, e-poštne sekvence po prvem čiščenju in vsebinski koledar, ki ga polni vsebinski agent. Objave in sporočila potrdi človek.',
      picture: { src: '/pictures/pacom', alt: 'Stranke po segmentih, e-poštna sekvenca in vsebinski koledar za Pacom.', width: 1600, height: 1000 },
    },
    {
      id: 'zalife',
      kicker: 'Za stranko',
      kind: 'Vsebinski sistem',
      name: 'ZaLife',
      client: 'ZaLife',
      body: 'Znamka in vsebinski sistem za program osebnega razvoja najstnikov: sredstva znamke, ponudbe za šole in starše ter koledar objav na enem mestu, da ekipa ne išče več po mapah.',
      picture: { src: '/pictures/zalife', alt: 'Sredstva znamke, ponudbe in koledar objav za ZaLife.', width: 1600, height: 1000 },
    },
  ],
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
