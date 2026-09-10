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
      logo: { src: '/clients/inspectus.webp', width: 110, height: 41 },
    },
    {
      name: 'Pacom',
      href: 'https://pacom.si/',
      logo: { src: '/clients/pacom.webp', width: 110, height: 95 },
    },
    {
      name: 'ZaLife',
      href: 'https://www.zalife.eu/',
      logo: { src: '/clients/zalife.webp', width: 110, height: 45 },
    },
    {
      name: 'Elementum',
      href: 'https://elementum.si/',
      logo: { src: '/clients/elementum.webp', width: 110, height: 21 },
    },
    {
      name: 'Tower Spa Celje',
      href: 'https://towerspacelje.com/',
      logo: { src: '/clients/towerspa.webp', width: 101, height: 110 },
    },
    {
      name: 'Dr. Asya Grafy Bio Institute',
      href: 'https://drasyagrafy.com/',
      logo: { src: '/clients/asyagrafy.webp', width: 110, height: 67 },
    },
    {
      name: 'AISOS',
      logo: { src: '/clients/aisos.svg', width: 1168, height: 1104 },
    },
    {
      name: 'SI-BIG',
      href: 'https://si-big.com/',
      logo: { src: '/clients/sibig.webp', width: 110, height: 101 },
    },
    {
      name: 'HEVA',
      href: 'https://www.heva.si/',
      logo: { src: '/clients/heva.webp', width: 110, height: 50 },
    },
    {
      name: 'Epolac',
      href: 'https://www.epolac.com/',
      logo: { src: '/clients/epolac.webp', width: 110, height: 30 },
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
   Our own products first, then the systems built for clients. Every
   picture is a demo screen rendered from tools/pictures/products.html; the
   numbers on the screens are illustrative.

   The first eight entries are described from our repositories and Notion.
   The last six (Elementum, Tower Spa Celje, Dr. Asya Grafy, SI-BIG, HEVA,
   Epolac) were drafted at Ian's request without source material, to fit each
   client's business and our service areas. Ian confirms or corrects them
   before a production deploy. */

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
      simple: 'Aplikacija, v kateri športnik vidi, kaj mora danes narediti, trener pa vidi, kako gre celi ekipi. Če je kdo utrujen, aplikacija to pove.',
      forWhom: 'Za klube, trenerje in športnike, ki treninge še vedno pošiljajo po sporočilih.',
      picture: { src: '/pictures/athlos', alt: 'Aplikacija ATHLOS za športnika z današnjim treningom ob nadzorni plošči za trenerja.', width: 1600, height: 1000 },
    },
    {
      id: 'ais-command',
      kicker: 'Lastni izdelek',
      kind: 'SaaS izdelek',
      name: 'AIS Command',
      body: 'CRM in portal za stranke v enem. Interno: odnosi, prodajni lijak, projekti, storitve, podpora in računi. Za stranko: njeni projekti, stanje storitev, računi in plačilo na enem mestu. V ozadju teče agentno izvajalno okolje, ki pripravlja osnutke, opomnike in mesečno zaračunavanje.',
      simple: 'Ena stran, kjer ekipa vidi vse stranke, delo in račune, stranka pa vidi, kje je njen projekt. Sistem sam predlaga, kaj je naslednje, človek klikne potrdi.',
      forWhom: 'Za agencije in storitvena podjetja z več strankami naenkrat.',
      picture: { src: '/pictures/ais-command', alt: 'AIS Command s prodajnim lijakom, pogledom na stranko in seznamom računov.', width: 1600, height: 1000 },
    },
    {
      id: 'aisos',
      kicker: 'Lastni izdelek',
      kind: 'Agentni sistem',
      name: 'AISOS',
      body: 'Agentni operacijski sistem podjetja. Agenti vsako jutro pripravijo pregled dneva iz koledarja, e-pošte in nalog, pripravijo osnutke vsebin in računov ter povedo, kaj potrebuje človeka. Nič ne gre ven brez potrditve.',
      simple: 'Vsako jutro dobite eno stran: kaj je danes, kdo čaka na odgovor in kaj je že pripravljeno. Kar gre ven, prej potrdite.',
      forWhom: 'Za majhna podjetja, kjer vodja zjutraj bere tri nabiralnike.',
      picture: { src: '/pictures/aisos', alt: 'AISOS z jutranjim pregledom, seznamom agentov in nalogami, ki čakajo na človeka.', width: 1600, height: 1000 },
    },
    {
      id: 'inspectus-vldr',
      kicker: 'Za stranko',
      kind: 'Avtomatizacija',
      name: 'INSPECTUS VLDR',
      client: 'INSPECTUS',
      body: 'Dokumentacijski cevovod za pregled vozil v pristanišču. Sistem prebere izvoz poročila o škodah, uredi podatke po vozilih in za vsako vozilo natisne kartico VLDR v obliki, ki jo zahteva proizvajalec. Ročno urejanje preglednic je odpadlo.',
      simple: 'Preglednico s škodami spustite v orodje. Iz nje nastane kartica za vsako vozilo, točno taka, kot jo hoče proizvajalec.',
      forWhom: 'Za podjetja, ki po istem obrazcu izpolnjujejo stotine dokumentov.',
      picture: { src: '/pictures/inspectus-vldr', alt: 'Seznam vozil iz poročila o pregledu ob predogledu kartice VLDR.', width: 1600, height: 1000 },
    },
    {
      id: 'inspectus-vin',
      kicker: 'Za stranko',
      kind: 'Avtomatizacija',
      name: 'INSPECTUS VIN filter',
      client: 'INSPECTUS',
      body: 'Pametni filter fotografij s pomola. Tablica s številko VIN odpre vozilo, posnetki za njo mu pripadajo, rezultat pa se v obe smeri preveri proti ladijskemu seznamu razkladanja. Neujemanja dobi človek na pregled.',
      simple: 'Telefon slika tablico in nato škode. Sistem ve, katere slike so od katerega avta, in pove, če kaj manjka.',
      forWhom: 'Za ekipe na terenu, ki fotografirajo veliko stvari in jih pozneje težko razvrstijo.',
      picture: { src: '/pictures/inspectus-vin', alt: 'Fotografije s pomola, razvrščene po vozilih, s preverjanjem proti seznamu razkladanja.', width: 1600, height: 1000 },
    },
    {
      id: 'model-premazi',
      kicker: 'Za stranko',
      kind: 'AI model',
      name: 'Model za premaze',
      body: 'Napovedni model za formulacije premazov. Iz sestave izračuna gostoto, viskoznost, suho snov in prekrivnost, preden kdo kaj zmeša, in pove, kako zanesljiva je napoved. Za formulacije zunaj podatkov, na katerih se je učil, odgovor odkloni.',
      simple: 'Vpišete, iz česa je barva, in model pove, kako gosta bo in kako dobro bo prekrila, še preden jo kdo zmeša. Če ni prepričan, to pove.',
      forWhom: 'Za laboratorije in razvoj, kjer vsak poskus stane čas in material.',
      picture: { src: '/pictures/model-premazi', alt: 'Vnos sestave premaza z napovedanimi lastnostmi in oceno zanesljivosti.', width: 1600, height: 1000 },
    },
    {
      id: 'pacom',
      kicker: 'Za stranko',
      kind: 'Marketinški sistem',
      name: 'Pacom',
      client: 'Čistilni servis Pacom',
      body: 'Sistem za obstoječe stranke čistilnega servisa: CRM s segmenti, e-poštne sekvence po prvem čiščenju in vsebinski koledar, ki ga polni vsebinski agent. Objave in sporočila potrdi človek.',
      simple: 'Vse, kar podjetje pove strankam, je na enem mestu: paketi, objave, sporočila. Objave pripravi agent, človek jih potrdi.',
      forWhom: 'Za lokalna storitvena podjetja, ki hočejo obdržati stare stranke in dobiti nove.',
      picture: { src: '/pictures/pacom', alt: 'Stranke po segmentih, e-poštna sekvenca in vsebinski koledar za Pacom.', width: 1600, height: 1000 },
    },
    {
      id: 'zalife',
      kicker: 'Za stranko',
      kind: 'Vsebinski sistem',
      name: 'ZaLife',
      client: 'ZaLife',
      body: 'Znamka in vsebinski sistem za program osebnega razvoja najstnikov: sredstva znamke, ponudbe za šole in starše ter koledar objav na enem mestu, da ekipa ne išče več po mapah.',
      simple: 'Logotipi, ponudbe in objave so v eni mapi, ne v treh glavah. Vsak nov sodelavec ve, kje je kaj.',
      forWhom: 'Za znamke in programe, ki gradivo pošiljajo šolam, staršem in podjetjem.',
      picture: { src: '/pictures/zalife', alt: 'Sredstva znamke, ponudbe in koledar objav za ZaLife.', width: 1600, height: 1000 },
    },
    {
      id: 'elementum',
      kicker: 'Za stranko',
      kind: 'Avtomatizacija prodaje',
      name: 'Elementum',
      client: 'Elementum, plemenite kovine',
      body: 'Spletni svetovalec, ki obiskovalcem v slovenščini odgovarja o nakupu in hrambi zlata in srebra, tudi ponoči, in resna povpraševanja preda svetovalcem. Zjutraj ekipa dobi kratek tržni pregled: cene, novice in premiki konkurence, zbrani iz virov, ki jih prej pregledovali ročno.',
      simple: 'Obiskovalec vpraša o zlatu, svetovalec odgovori iz preverjenih virov, tudi ob polnoči. Resno povpraševanje dobi človek zjutraj.',
      forWhom: 'Za prodajalce, ki dobijo ista vprašanja vsak dan.',
      picture: { src: '/pictures/elementum', alt: 'Jutranji tržni pregled za svetovalce ob pogovoru spletnega svetovalca s stranko.', width: 1600, height: 1000 },
    },
    {
      id: 'tower-spa',
      kicker: 'Za stranko',
      kind: 'Avtomatizacija prodaje',
      name: 'Tower Spa Celje',
      client: 'Tower Spa Celje',
      body: 'Asistent za rezervacije v wellnessu v srednjeveškem stolpu. Odgovarja na vprašanja o paketih, savnah in masažah, sprejme rezervacijo, pošlje opomnik dan prej in ob odpovedi sprosti termin. Vprašanja za skupine in dogodke preda lastniku.',
      simple: 'Gost napiše, kdaj bi prišel, asistent najde termin in ga potrdi. Dan prej gosta spomni.',
      forWhom: 'Za wellnesse, salone in vse, ki rezervirajo termine.',
      picture: { src: '/pictures/tower-spa', alt: 'Tedenski pregled rezervacij Tower Spa z zadnjimi sporočili strank.', width: 1600, height: 1000 },
    },
    {
      id: 'asya-grafy',
      kicker: 'Za stranko',
      kind: 'AI svetovalec',
      name: 'Dr. Asya Grafy Bio Institute',
      client: 'Dr. Asya Grafy Bio Institute',
      body: 'Svetovalec za nego kože v spletni trgovini. Iz dokumentacije o izdelkih odgovori na vprašanja o suhi, občutljivi ali zreli koži, predlaga vrstni red izdelkov in vsak izdelek pošlje v košarico. Zdravstvena vprašanja preda človeku.',
      simple: 'Vpišete, kakšno kožo imate, in svetovalec pove, kateri izdelki so za vas in v kakšnem vrstnem redu. Z enim klikom v košarico.',
      forWhom: 'Za spletne trgovine z izdelki, ki potrebujejo razlago.',
      picture: { src: '/pictures/asya-grafy', alt: 'Svetovalec za nego kože v mobilni trgovini ob pregledu najpogostejših vprašanj strank.', width: 1600, height: 1000 },
    },
    {
      id: 'si-big',
      kicker: 'Za stranko',
      kind: 'Spremljanje trga',
      name: 'SI-BIG',
      client: 'SI-BIG Group',
      body: 'Sistem, ki vsako jutro pregleda razpise, iskanja partnerjev in novice s šestih balkanskih trgov, jih oceni po merilih posamezne stranke in ekipi pripravi seznam, ki ga pošlje naprej. Iskanje, ki je prej vzelo dopoldne, je zdaj pregled ob kavi.',
      simple: 'Vsako jutro pregleda razpise in novice na šestih trgih in pove, kateri so za vas. Vi samo preberete seznam.',
      forWhom: 'Za svetovalce in podjetja, ki delajo na več trgih hkrati.',
      picture: { src: '/pictures/si-big', alt: 'Seznam priložnosti po balkanskih trgih, ocenjenih po ujemanju s strankami.', width: 1600, height: 1000 },
    },
    {
      id: 'heva',
      kicker: 'Za stranko',
      kind: 'Avtomatizacija administracije',
      name: 'HEVA',
      client: 'HEVA, upravljanje nepremičnin',
      body: 'Delovni nalogi za upravljanje in vzdrževanje stavb. Iz e-pošte in telefonskih klicev asistent prepozna naslov, težavo in nujnost, ustvari nalog in predlaga prostega monterja. Ekipa nalog dobi na telefon, po opravljenem delu pa gre račun ven sam.',
      simple: 'Stanovalec napiše, da pušča pipa. Sistem naredi nalog, izbere monterja in po opravilu pripravi račun.',
      forWhom: 'Za upravnike stavb in servise, ki dobijo prijave po e-pošti in telefonu.',
      picture: { src: '/pictures/heva', alt: 'Tabla delovnih nalogov HEVA: novo iz sporočil, razporejeno in opravljeno.', width: 1600, height: 1000 },
    },
    {
      id: 'epolac',
      kicker: 'Za stranko',
      kind: 'AI asistent',
      name: 'Epolac',
      client: 'Epolac, Izrael',
      body: 'Tehnični asistent za proizvajalca barv in premazov. Iz tehničnih in varnostnih listov odgovarja na vprašanja izvajalcev in distributerjev v angleščini in hebrejščini, navede vir in izračuna porabo. Vprašanja o cenah in projektih preda prodaji.',
      simple: 'Mojster na gradbišču vpraša, kako redčiti barvo. Asistent odgovori iz tehničnega lista, v njegovem jeziku, in pove, koliko barve potrebuje.',
      forWhom: 'Za proizvajalce z veliko izdelki in tehnično dokumentacijo.',
      picture: { src: '/pictures/epolac', alt: 'Tehnični asistent Epolac odgovarja na vprašanje o hidroizolaciji z navedbo tehničnega lista.', width: 1600, height: 1000 },
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
  title: 'Kaj je novega',
  lead: 'Kratka obvestila o tem, kaj je AIS Slovenia zgradil in objavil. Samo stvari, ki so se res zgodile, z datumom.',
  metaTitle: 'Novice: kaj je novega pri AIS Slovenia',
  metaDescription:
    'Novice AIS Slovenia: nova spletna stran s štirinajstimi študijami primerov, prva ladja za INSPECTUS v nekaj sekundah in skupni Business HQ za Pacom in ZaLife.',
  answer:
    'AIS Slovenia objavlja kratke novice o opravljenem delu: septembra 2026 novo spletno stran s štirinajstimi študijami primerov in tremi vodiči, julija 2026 prvo resnično serijo 314 vozil za INSPECTUS in aprila 2026 skupni Business HQ za Pacom in ZaLife.',
  items: [
    {
      date: '2026-09-10',
      dateLabel: '10. 9. 2026',
      kicker: 'Spletna stran',
      title: 'Nova spletna stran s štirinajstimi študijami primerov in tremi vodiči',
      body: 'Vsak projekt, ki smo ga zgradili, ima zdaj svojo stran: kaj je bilo narobe, kaj smo naredili in kaj se je spremenilo. Dodali smo tri vodiče za podjetja, ki se šele odločajo, in celotno vsebino v obliki, ki jo lahko berejo tudi AI asistenti.',
    },
    {
      date: '2026-07-14',
      dateLabel: '14. 7. 2026',
      kicker: 'Stranke',
      title: 'INSPECTUS: prva ladja s 314 vozili obdelana v nekaj sekundah',
      body: 'Orodje za pregled vozil v pristanišču je prvič teklo na resničnih podatkih. Iz izvoza s 380 vrsticami je nastalo 314 vrstic za poročilo in 314 kartic VLDR v obliki, ki jo zahteva proizvajalec. Ročno urejanje preglednic je odpadlo.',
    },
    {
      date: '2026-04-25',
      dateLabel: '25. 4. 2026',
      kicker: 'Stranke',
      title: 'Pacom in ZaLife dobita skupni Business HQ',
      body: 'Čistilni servis iz Novega mesta in program za osebni razvoj najstnikov imata zdaj vsak svoj center: pregled znamke, ponudbe, koledar objav in banko idej na enem mestu. Objave pripravi vsebinski agent, potrdi jih človek.',
    },
  ],
  empty: {
    title: 'Vsebina je v pripravi',
    body: 'Novice bomo objavili, ko bodo pripravljene in potrjene za javno predstavitev.',
    action: { label: 'Kontaktirajte nas', href: '/kontakt/' },
  },
};

/* ── Events ───────────────────────────────────────────────────────────── */

export const events = {
  eyebrow: 'Dogodki',
  title: 'Pridite pogledat',
  lead: 'Tri oblike srečanja, na katerih pokažemo, kako sistemi delajo. Termin se dogovori po kratkem pogovoru.',
  metaTitle: 'Dogodki: uvodni pogovor, delavnica, predstavitev | AIS Slovenia',
  metaDescription:
    'Tri oblike srečanja z AIS Slovenia: brezplačen uvodni pogovor, dveurna delavnica za ekipo o delu, ki ne bi smelo biti ročno, in predstavitev sistema v živo.',
  answer:
    'AIS Slovenia ponuja tri oblike srečanja: brezplačen uvodni pogovor (30 minut, na daljavo ali pri vas), delavnico za ekipo (dve uri, pri vas), na kateri skupaj poiščemo delo, ki ne bi smelo biti ročno, in predstavitev delujočega sistema v živo (45 minut). Termin se dogovori po kratkem pogovoru.',
  items: [
    {
      date: '',
      dateLabel: 'Po dogovoru',
      time: '30 minut',
      kicker: 'Za vodstvo',
      title: 'Uvodni pogovor',
      body: 'Povejte, kje se v podjetju izgublja čas. Skupaj preverimo, ali je avtomatizacija smiselna, in če ni, to povemo. Brez priprave in brez obveznosti.',
      mode: 'Na daljavo ali pri vas',
      place: 'Ljubljana in vsa Slovenija',
    },
    {
      date: '',
      dateLabel: 'Po dogovoru',
      time: '2 uri',
      kicker: 'Za ekipo',
      title: 'Delavnica: kaj pri vas ne bi smelo biti ročno delo',
      body: 'Ekipa na tablo napiše, kaj vsak dan prepisuje, išče in preverja. Do konca delavnice ima seznam procesov, razvrščen po tem, kaj se splača prvo, in jasen prvi korak.',
      mode: 'Pri vas',
      place: 'Vaše prostore',
    },
    {
      date: '',
      dateLabel: 'Po dogovoru',
      time: '45 minut',
      kicker: 'Za vse',
      title: 'Predstavitev sistema v živo',
      body: 'Pokažemo delujoč sistem na resničnem primeru: kako iz preglednice nastanejo kartice, kako svetovalec odgovori iz cenika in kako sistem preda človeku, ko ni prepričan. Vprašanja so zaželena.',
      mode: 'Na daljavo',
      place: 'Videoklic',
    },
  ],
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
  lead: 'Kratki zapisi o tem, kaj AI avtomatizacija je, kaj zmore in kako se je lotiti. Napisano tako, da razume vsak.',
  metaTitle: 'Blog o AI avtomatizaciji, razloženo preprosto | AIS Slovenia',
  metaDescription:
    'Blog AIS Slovenia: kaj je AI avtomatizacija, kaj je AI agent, kako izbrati prvi proces in zakaj mora sistem znati reči, da ne ve. Kratko in preprosto.',
  answer:
    'Blog AIS Slovenia razlaga AI avtomatizacijo v preprostem jeziku: kaj je, kaj je AI agent, kako izbrati prvi proces za avtomatizacijo in zakaj mora sistem znati reči, da ne ve. Vsak zapis ima datum in primer iz našega dela.',
  items: [],
  homeTitle: 'Iz bloga',
  homeEmpty: 'Prvi zapisi so v pripravi.',
  empty: {
    title: 'Vsebina je v pripravi',
    body: 'Blog zapise bomo objavili, ko bodo pripravljeni in potrjeni za javno predstavitev.',
    action: { label: 'Kontaktirajte nas', href: '/kontakt/' },
  },
};
