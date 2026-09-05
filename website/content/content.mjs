/**
 * All site copy, structured as data.
 *
 * The wording here is carried over from the original ais-slovenia.si. Where the
 * original had no text at all (FAQ answers, meta descriptions, per-agent detail),
 * new copy was written in the same voice and stays consistent with the facts in
 * site.mjs. Edit this file and re-run `npm run build` — pages, navigation,
 * sitemap and structured data all regenerate from it.
 */

/* ── Hero ─────────────────────────────────────────────────────────────── */

export const hero = {
  eyebrow: 'AIS — Artificial Intelligence Slovenia',
  headline: 'AI avtomatizacija za podjetja, ki želijo hitrejše procese in manj ročnega dela.',
  lead: 'Povežemo komunikacijo, podatke in operacije v sistem, ki deluje učinkovito — brez nepotrebnih zastojev.',
  primaryCta: { label: 'Rezervirajte posvet', href: '/kontakt/' },
  secondaryCta: { label: 'Poglejte storitve', href: '/storitve/' },
};

/* ── "System" band: what each capability replaces ─────────────────────── */

export const optimization = {
  eyebrow: 'Optimizacija',
  title: 'Kaj nadomestimo',
  lead: 'Vsak sistem, ki ga postavimo, odpravi eno konkretno oviro v vsakodnevnem delu.',
  pairs: [
    { gain: 'Optimizacija', replaces: 'Stroški', accent: 'blue' },
    { gain: 'Hitrost', replaces: 'Zamude', accent: 'violet' },
    { gain: 'Natančnost', replaces: 'Napake', accent: 'teal' },
    { gain: 'Struktura', replaces: 'Kaos', accent: 'amber' },
  ],
};

/* ── Problem section ──────────────────────────────────────────────────── */

export const problems = {
  eyebrow: 'Realnost danes',
  title: 'Večina podjetij se še vedno sooča z:',
  lead: 'Ko obseg dela raste, tak način dela postane omejitev.',
  items: [
    {
      title: 'Počasni odzivi',
      body: 'Povpraševanja čakajo na prostega človeka, namesto da bi bila obravnavana takoj.',
      accent: 'rose',
    },
    {
      title: 'Ročni procesi',
      body: 'Prepisovanje podatkov med orodji porabi ure, ki jih nihče ne zaračuna.',
      accent: 'amber',
    },
    {
      title: 'Ponavljajoče se napake',
      body: 'Iste pomanjkljivosti se vračajo, ker jih lovi človek in ne sistem.',
      accent: 'violet',
    },
    {
      title: 'Preobremenjene ekipe',
      body: 'Ključni ljudje porabijo dan za administracijo namesto za delo, ki šteje.',
      accent: 'blue',
    },
  ],
};

/* ── Eight-step delivery process ──────────────────────────────────────── */

export const processSteps = [
  {
    number: '01',
    title: 'Raziskava',
    duration: '1–2 sestanki',
    body: 'Prvi stik. Razumevanje vaše vizije, izzivov in ambicij.',
    accent: 'blue',
  },
  {
    number: '02',
    title: 'Diagnostika',
    duration: '3–5 dni',
    body: 'Mapiranje vseh poslovnih procesov in identifikacija točk odpadanja.',
    accent: 'violet',
  },
  {
    number: '03',
    title: 'Potopitev',
    duration: '1 teden',
    body: 'Globoko razumevanje vaše kulture, tokov in odločitvenih mehanizmov.',
    accent: 'teal',
  },
  {
    number: '04',
    title: 'Arhitektura',
    duration: '1 teden',
    body: 'Oblikovanje popolnoma personalizirane AI strategije in tehnične arhitekture.',
    accent: 'amber',
  },
  {
    number: '05',
    title: 'Prototip',
    duration: '2–3 tedni',
    body: 'Funkcionalni demo vašega sistema — taktilna izkušnja pred investicijo.',
    accent: 'rose',
  },
  {
    number: '06',
    title: 'Kalibracija',
    duration: '3–5 tednov',
    body: 'Testiranje v realnem času. Kalibracija na vaših podatkih in interakcijah.',
    accent: 'blue',
  },
  {
    number: '07',
    title: 'Uvedba',
    duration: '1–2 tedna',
    body: 'Polna uvedba. Brezplačno usposabljanje vaše ekipe. Podpora 24/7.',
    accent: 'violet',
  },
  {
    number: '08',
    title: 'Evolucija',
    duration: 'Nenehno',
    body: 'Mesečna analitika, optimizacija in kontinuirano izboljševanje.',
    accent: 'teal',
  },
];

export const processMeta = {
  eyebrow: 'Proces',
  title: 'Konfiguracija vašega AI sistema za avtomatizacijo',
  lead: 'Osem natančnih korakov. Nič manj, nič več.',
};

/* ── Services / AI agents ─────────────────────────────────────────────── */

export const servicesMeta = {
  eyebrow: 'Storitve',
  title: 'AI sistemi za podjetja',
  lead: 'Vsak naš AI pomočnik (AI chatboti in voice AI agenti v slovenščini) je specializiran za določeno področje, skupaj pa tvorijo celovito rešitev za avtomatizacijo poslovanja.',
};

export const services = [
  {
    slug: 'ava',
    name: 'AVA',
    role: 'AI operativni in administrativni agent',
    summary:
      'Ava je vaša digitalna sodelavka, ki avtomatizira administrativne procese. Deluje 24/7 in poskrbi, da operacije tečejo brez napak, zamud in ročnega dela.',
    accent: 'blue',
    tags: ['Pripravljena za uvedbo', 'Sinhronizacija 24/7'],
    metaTitle: 'AVA — AI operativni in administrativni agent | AIS Slovenia',
    metaDescription:
      'AVA je AI agent za avtomatizacijo administracije: obdeluje dokumente, sinhronizira podatke med orodji in prevzame ponavljajoče se operativne naloge 24/7.',
    /* Answer-first paragraph: written so AI answer engines can quote it directly. */
    answer:
      'AVA je AI operativni in administrativni agent podjetja AIS Slovenia. Prevzame ponavljajoče se administrativne naloge — obdelavo dokumentov, vnos in sinhronizacijo podatkov ter interno poročanje — in jih izvaja neprekinjeno, brez ročnega dela.',
    capabilities: [
      { title: 'Obdelava dokumentov', body: 'Prebere, razvrsti in povzame vhodne dokumente ter jih pošlje v pravi sistem.' },
      { title: 'Sinhronizacija podatkov', body: 'Podatke drži usklajene med CRM, e-pošto, preglednicami in internimi orodji.' },
      { title: 'Interna poročila', body: 'Redna poročila pripravi in dostavi po urniku, brez opomnikov.' },
      { title: 'Neprekinjeno delovanje', body: 'Deluje 24 ur na dan, tudi izven delovnega časa in med odsotnostmi.' },
    ],
    bestFor: 'Podjetja z veliko administracije, kjer ekipa dnevno prepisuje podatke med orodji.',
  },
  {
    slug: 'lucy',
    name: 'LUCY',
    role: 'AI prodajni agent',
    summary: 'Na spletni strani komunicira s strankami 24/7 in odgovarja na vprašanja.',
    accent: 'violet',
    tags: ['Višja konverzija', 'Slovenščina'],
    metaTitle: 'LUCY — AI prodajni agent za spletno stran | AIS Slovenia',
    metaDescription:
      'LUCY je AI prodajni agent za spletne strani. Odgovarja obiskovalcem v slovenščini 24/7, kvalificira povpraševanja in jih preda vaši prodajni ekipi.',
    answer:
      'LUCY je AI prodajni agent podjetja AIS Slovenia. Na spletni strani komunicira z obiskovalci v slovenščini 24 ur na dan, odgovarja na vprašanja o storitvah, kvalificira povpraševanja in jih preda prodajni ekipi.',
    capabilities: [
      { title: 'Pogovor v slovenščini', body: 'Z obiskovalci se pogovarja naravno, v jeziku vaše stranke.' },
      { title: 'Odgovori 24/7', body: 'Na vprašanja odgovori takoj, tudi ponoči in ob vikendih.' },
      { title: 'Kvalifikacija povpraševanj', body: 'Prepozna resne priložnosti in zbere podatke, ki jih prodaja potrebuje.' },
      { title: 'Predaja ekipi', body: 'Pogovor s celotnim kontekstom preda pravi osebi v vaši ekipi.' },
    ],
    bestFor: 'Podjetja, ki prejemajo veliko podobnih vprašanj prek spletne strani.',
  },
  {
    slug: 'lily',
    name: 'LILY',
    role: 'AI scout agent',
    summary: 'Neprestano pregleduje trg in vam dostavlja najboljše priložnosti.',
    accent: 'teal',
    tags: ['Tržna analiza', 'Dnevni pregled'],
    metaTitle: 'LILY — AI scout agent za spremljanje trga | AIS Slovenia',
    metaDescription:
      'LILY je AI scout agent, ki neprestano spremlja trg, razpise in konkurenco ter vam dostavi le relevantne priložnosti — brez ročnega iskanja.',
    answer:
      'LILY je AI scout agent podjetja AIS Slovenia. Neprestano pregleduje trg, javne razpise in aktivnosti konkurence ter vam dostavlja le priložnosti, ki ustrezajo vašim merilom.',
    capabilities: [
      { title: 'Spremljanje trga', body: 'Redno pregleduje vire, ki so pomembni za vašo panogo.' },
      { title: 'Filtriranje priložnosti', body: 'Dostavi le tisto, kar ustreza vašim vnaprej določenim merilom.' },
      { title: 'Pregled konkurence', body: 'Opozori na premike konkurence, ki vplivajo na vaše odločitve.' },
      { title: 'Strukturiran povzetek', body: 'Ugotovitve dostavi v obliki, ki je pripravljena za odločitev.' },
    ],
    bestFor: 'Ekipe, ki priložnosti danes iščejo ročno in jih pogosto opazijo prepozno.',
  },
];

/* ── Outcomes ─────────────────────────────────────────────────────────── */

export const outcomes = {
  eyebrow: 'Rezultat',
  title: 'Kaj prinaša avtomatizacija?',
  lead: 'Sodelujemo s podjetji, kjer ima AI implementacija dejanski poslovni vpliv.',
  items: [
    { title: 'Hitrejši odzivi', body: 'Povpraševanja in interne zahteve dobijo odgovor takoj.', accent: 'blue' },
    { title: 'Manj administracije', body: 'Ponavljajoče se naloge prevzame sistem namesto ekipe.', accent: 'violet' },
    { title: 'Manj napak', body: 'Podatki tečejo po enem pravilu, ne po spominu posameznika.', accent: 'teal' },
    { title: 'Večja učinkovitost', body: 'Isti ljudje obvladajo večji obseg dela brez dodatnih zaposlitev.', accent: 'amber' },
    { title: 'Fokus na rast', body: 'Ekipa se vrne k delu, ki dejansko premika podjetje naprej.', accent: 'rose' },
  ],
};

/* ── About ────────────────────────────────────────────────────────────── */

export const about = {
  eyebrow: 'Kaj podjetja drži nazaj',
  title: 'Problem ni v ekipi. Problem je v sistemu.',
  lead: 'Dodatni zaposleni in nova orodja pogosto ustvarijo samo več kompleksnosti.',
  approachTitle: 'Drugačen pristop',
  questionWrong: 'Kako narediti več?',
  questionRight: 'Kaj sploh ne bi smelo biti ročno delo?',
  questionIntro: 'Ključno vprašanje ni:',
  questionPivot: 'Ampak:',
};

export const stats = [
  { label: 'Avtomatizirane naloge', value: '1,2 mio+', note: 'Skupaj obdelano v letu 2024', accent: 'blue' },
  { label: 'Rast učinkovitosti', value: '340 %', note: 'Povprečen dvig učinkovitosti', accent: 'violet' },
  { label: 'Zanesljivost sistema', value: 'Enterprise', note: 'Varnost na poslovni ravni', accent: 'teal' },
];

/* ── Team ─────────────────────────────────────────────────────────────── */

export const team = {
  eyebrow: 'Ekipa',
  title: 'Naša ekipa',
  lead: 'Majhna ekipa, ki sisteme postavi in jih tudi vzdržuje.',
  members: [
    {
      name: 'Anej Vučič',
      role: 'CEO',
      email: 'anej@ais-slovenia.si',
      phone: '+386 70 717 087',
      phoneHref: 'tel:+38670717087',
      photo: '/team/anej.jpg',
    },
    {
      name: 'Nejc Feigel Boh',
      role: 'CEO',
      email: 'nejc@ais-slovenia.si',
      phone: '+386 41 709 281',
      phoneHref: 'tel:+38641709281',
      photo: '/team/nejc.jpg',
    },
    {
      name: 'Ian Veber',
      role: 'CTO',
      email: 'ian@ais-slovenia.si',
      photo: '/team/ian.jpg',
    },
  ],
};

/* ── Contact ──────────────────────────────────────────────────────────── */

export const contact = {
  eyebrow: 'Kontakt',
  title: 'Rezervirajte uvodni pogovor',
  lead: 'Rezervirajte uvodni pogovor in preverite, ali je AI avtomatizacija smiselna za vaše podjetje.',
  formFields: [
    { name: 'ime', label: 'Ime in priimek', type: 'text', autocomplete: 'name', required: true },
    { name: 'podjetje', label: 'Podjetje', type: 'text', autocomplete: 'organization', required: false },
    { name: 'email', label: 'E-pošta', type: 'email', autocomplete: 'email', required: true },
    { name: 'sporocilo', label: 'Sporočilo', type: 'textarea', required: true },
  ],
  submitLabel: 'Pošlji sporočilo',
};

/* ── FAQ ──────────────────────────────────────────────────────────────────
   The original site linked to "Pogosta vprašanja" but the page did not exist.
   These answers are the single biggest GEO win: they are the format answer
   engines quote from. Each answer is self-contained and factual. */

export const faq = {
  eyebrow: 'Pogosta vprašanja',
  title: 'Pogosta vprašanja o AI avtomatizaciji',
  lead: 'Odgovori na vprašanja, ki jih najpogosteje slišimo pred začetkom sodelovanja.',
  items: [
    {
      q: 'Kaj je AIS Slovenia?',
      a: 'AIS Slovenia (Artificial Intelligence Slovenia) je slovensko podjetje za avtomatizacijo poslovnih procesov z umetno inteligenco. Razvijamo AI chatbote, voice AI agente in interne sisteme, ki povežejo komunikacijo, podatke in operacije. Delujemo iz Ljubljane, storitve pa izvajamo v slovenskem jeziku.',
    },
    {
      q: 'Katere AI agente ponujate?',
      a: 'Ponujamo tri AI agente. AVA je operativni in administrativni agent, ki prevzame ponavljajoče se administrativne naloge. LUCY je prodajni agent, ki na spletni strani komunicira s strankami 24/7. LILY je scout agent, ki spremlja trg in dostavlja relevantne priložnosti.',
    },
    {
      q: 'Kako poteka uvedba AI sistema?',
      a: 'Uvedba poteka po osmih korakih: raziskava, diagnostika, potopitev, arhitektura, prototip, kalibracija, uvedba in evolucija. Prvi štirje koraki so namenjeni razumevanju in načrtovanju, peti prinese delujoč prototip, zadnji trije pa uvedbo v produkcijo in nenehno izboljševanje.',
    },
    {
      q: 'Koliko časa traja uvedba?',
      a: 'Odvisno od obsega. Diagnostika traja 3 do 5 dni, potopitev in arhitektura po en teden, prototip 2 do 3 tedne, kalibracija 3 do 5 tednov, sama uvedba pa 1 do 2 tedna. Faza evolucije z mesečno analitiko in optimizacijo teče nenehno.',
    },
    {
      q: 'Ali AI agenti govorijo slovensko?',
      a: 'Da. Naši AI chatboti in voice AI agenti komunicirajo v slovenščini. LUCY se z obiskovalci spletne strani pogovarja v slovenskem jeziku 24 ur na dan.',
    },
    {
      q: 'Za katera podjetja je AI avtomatizacija smiselna?',
      a: 'Sodelujemo s podjetji, kjer ima AI implementacija dejanski poslovni vpliv — torej tam, kjer se ponavljajoče se naloge izvajajo ročno, kjer povpraševanja čakajo na prostega človeka in kjer ekipa večino dneva porabi za administracijo namesto za delo, ki prinaša rast.',
    },
    {
      q: 'Ali moramo pred uvedbo zamenjati obstoječa orodja?',
      a: 'Ne. Sistem gradimo okoli orodij, ki jih že uporabljate. V fazi diagnostike zmapiramo obstoječe procese in integracije, nato pa AI agente povežemo z vašim CRM, e-pošto in internimi sistemi.',
    },
    {
      q: 'Ali dobimo demo pred investicijo?',
      a: 'Da. Peti korak procesa je prototip — funkcionalni demo vašega sistema, ki ga preizkusite pred polno investicijo.',
    },
    {
      q: 'Kaj vključuje podpora po uvedbi?',
      a: 'Uvedba vključuje brezplačno usposabljanje vaše ekipe in podporo 24/7. Po uvedbi sledi faza evolucije z mesečno analitiko, optimizacijo in kontinuiranim izboljševanjem sistema.',
    },
    {
      q: 'Kako začnemo sodelovanje?',
      a: 'Sodelovanje se začne z uvodnim pogovorom. Na njem preverimo, ali je AI avtomatizacija za vaše podjetje sploh smiselna. Pišete nam lahko na info@ais-slovenia.si ali pokličete na +386 70 717 087.',
    },
  ],
};
