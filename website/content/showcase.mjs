/**
 * Copy for the home-page showcase sections and the products, news, events and
 * blog pages. Unpublished material is represented by honest empty states.
 */

/* ── Opening sequence ───────────────────────────────────────────────────
   Typed next to the brain mark, one character at a time, on a white screen.
   The two parts are typed in order: the brand in ink, the tail in AIS blue. */

export const intro = {
  brand: 'AIS',
  tail: 'Slovenia',
};

/* ── Build stage: three screens from the workshop ───────────────────────
   The only dark band on the home page. Three clips play in a fanned stage;
   the front screen is large, the other two wait at its sides and rotate in
   on their own or on request. */

export const buildStage = {
  eyebrow: 'Kako gradimo',
  title: 'Tri okna v našo delavnico',
  lead: 'Vsak sistem nastane v treh korakih: potek dela, koda in izdelek. To so posnetki iz dela, ne slike iz kataloga.',
  screens: [
    {
      id: 'flow',
      number: '01',
      label: 'Avtomatizacija',
      caption: 'Potek dela zmapiramo do zadnjega koraka: sprožilci, pravila, izjeme.',
      poster: '/video/flow-poster.jpg',
      sources: [
        { src: '/video/flow.webm', type: 'video/webm' },
        { src: '/video/flow.mp4', type: 'video/mp4' },
      ],
    },
    {
      id: 'code',
      number: '02',
      label: 'Razvoj',
      caption: 'Iz diagrama nastane koda: agenti, integracije, testi, uvedba.',
      poster: '/video/code-poster.jpg',
      sources: [
        { src: '/video/code.webm', type: 'video/webm' },
        { src: '/video/code.mp4', type: 'video/mp4' },
      ],
    },
    {
      id: 'saas',
      number: '03',
      label: 'SaaS izdelek',
      caption: 'Rezultat je izdelek z nadzorno ploščo, ki prihrani ure in stroške.',
      poster: '/video/saas-poster.jpg',
      sources: [
        { src: '/video/saas.webm', type: 'video/webm' },
        { src: '/video/saas.mp4', type: 'video/mp4' },
      ],
    },
  ],
  outro: 'Trije koraki. En sistem, ki dela namesto vas.',
};

/* ── Clients line ───────────────────────────────────────────────────────
   One row per project we have built: a name, the kind of work, and one
   sentence. No logos, no metrics, no invented names.

   Every entry below is a real project from our own repositories. Before a
   production deploy, confirm with each client that the project may be named
   publicly, and replace the working names with the ones they approve. */

export const clients = {
  eyebrow: 'Reference',
  title: 'S kom smo delali',
  lead: 'Sistemi, ki tečejo v produkciji. Ena vrstica na projekt, brez okrasja.',
  items: [
    {
      name: 'INSPECTUS · VLDR',
      kind: 'Avtomatizacija',
      body: 'Dokumentacijski cevovod za pregled vozil v pristanišču: iz poročil nastane preverjen zapis o vsakem vozilu.',
    },
    {
      name: 'INSPECTUS · VIN',
      kind: 'Avtomatizacija',
      body: 'Fotografije s pomola postanejo vozila: tablica z VIN odpre vozilo, sistem pa ga preveri proti seznamu razkladanja.',
    },
    {
      name: 'ATHLOS',
      kind: 'SaaS izdelek',
      body: 'Športni operacijski sistem: aplikacija za športnika, nadzorna plošča za trenerja in vgrajeni AI trener.',
    },
    {
      name: 'AIS Command',
      kind: 'SaaS izdelek',
      body: 'Interni CRM in portal za stranke z agentnim operacijskim sistemom, izdajanjem računov in plačili.',
    },
    {
      name: 'Model lastnosti premazov',
      kind: 'AI model',
      body: 'Napovedni model, ki gostoto, viskoznost in prekrivnost premaza izračuna, preden ga kdo zmeša.',
    },
  ],
};

/* ── Three pillars ──────────────────────────────────────────────────────
   White section after the dark stage. Each pillar shows one product picture
   rendered from tools/pictures/scene.html, so the visuals stay on-brand and
   honest about being illustrative. */

export const pillars = {
  eyebrow: 'Kaj gradimo',
  title: 'Tri stvari, ki jih znamo narediti dobro',
  lead: 'Vsak projekt se začne pri konkretnem delu, ki ga ekipa danes opravlja ročno. Nato izberemo najkrajšo pot do sistema, ki ga prevzame.',
  items: [
    {
      id: 'saas',
      number: '01',
      title: 'SaaS izdelki',
      body: 'Izdelek z nadzorno ploščo, uporabniki in naročnino. Od prve skice do objave, z merljivim rezultatom na prvem zaslonu.',
      points: [
        'Nadzorna plošča, ki pokaže prihranek in izjeme',
        'Vloge, uporabniki in naročnina od prvega dne',
        'Integracije z orodji, ki jih že uporabljate',
      ],
      picture: {
        src: '/pictures/saas',
        alt: 'Ilustrativna nadzorna plošča SaaS izdelka za obdelavo dokumentov: ključne številke, graf in seznam zadnjih dokumentov.',
        width: 1600,
        height: 1000,
      },
      link: { label: 'Poglejte izdelke', href: '/produkti/' },
    },
    {
      id: 'avtomatizacija',
      number: '02',
      title: 'Avtomatizacije',
      body: 'Diagram poteka, ki teče sam. Sprožilci, pravila in izjeme na enem mestu, vsak zagon pa zabeležen z vhodom, odločitvijo in izhodom.',
      points: [
        'Obdelava dokumentov in sinhronizacija podatkov',
        'Pravila z jasno mejo, kdaj odloči človek',
        'Dnevni pregled zagonov in izjem',
      ],
      picture: {
        src: '/pictures/flow',
        alt: 'Ilustrativni urejevalnik poteka dela: vozlišča za e-račun, AI razčlenitev, pravilo in samodejno knjiženje ter seznam zadnjih zagonov.',
        width: 1600,
        height: 1000,
      },
      link: { label: 'Poglejte storitve', href: '/storitve/' },
    },
    {
      id: 'varnost',
      number: '03',
      title: 'Kibernetska varnost in aplikacije',
      body: 'Aplikacije po meri z varnostjo na poslovni ravni: nadzor dostopa, revizijska sled in šifrirani podatki. Ena aplikacija za en proces, brez odvečnih funkcij.',
      points: [
        'Vloge in pravice, ki jih vidite na enem zaslonu',
        'Revizijska sled za vsako dejanje, tudi agentovo',
        'Šifriranje v mirovanju in prenosu, prijava brez gesla',
      ],
      picture: {
        src: '/pictures/security',
        alt: 'Ilustrativna varnostna konzola ob mobilni aplikaciji: matrika dostopa, šifriranje, revizijska sled in stanje sistema.',
        width: 1600,
        height: 1000,
      },
      link: { label: 'Rezervirajte posvet', href: '/kontakt/' },
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
  homeLead: 'Zapiski iz dela: kaj smo zgradili, kaj se je obneslo in kaj bi naredili drugače.',
  empty: {
    title: 'Vsebina je v pripravi',
    body: 'Blog zapise bomo objavili, ko bodo pripravljeni in potrjeni za javno predstavitev.',
    action: { label: 'Kontaktirajte nas', href: '/kontakt/' },
  },
};
