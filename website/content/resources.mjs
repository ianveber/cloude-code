/**
 * Free resources: tools anyone may use at no cost. Some AIS built, some it
 * took from open source and made better. Every claim here is checked against
 * the repository of the resource; keep it that way.
 */

export const resources = {
  eyebrow: 'Brezplačni viri',
  title: 'Brezplačni viri',
  lead: 'Orodja, ki jih lahko uporabite brezplačno. Nekatera smo naredili sami, nekatera smo vzeli iz odprte kode in jih naredili boljša.',
  metaTitle: 'Brezplačni viri: orodja, ki jih lahko uporabite | AIS Slovenia',
  metaDescription:
    'Brezplačna orodja AIS Slovenia. God’s Eye View, slovenska izdaja: živ 3D globus z letali, ladjami, sateliti in več kot 650 javnimi kamerami po Sloveniji.',
  keywords: ['brezplačni viri', 'brezplačna orodja', 'God’s Eye View slovenska izdaja', 'javne kamere Slovenija', 'AIS Slovenia'],
  answer:
    'AIS Slovenia objavlja brezplačne vire: orodja, ki jih lahko uporabi vsak. Prvi je God’s Eye View, slovenska izdaja: živ 3D globus z letali, ladjami, sateliti in potresi, ki mu je AIS dodal 657 javnih prometnih in vremenskih kamer po Sloveniji, prenos žive slike in bolj berljiv zaslon.',
  items: [
    {
      id: 'gods-eye-view',
      kicker: 'Odprtokodna aplikacija',
      kind: 'Brezplačno',
      name: 'God’s Eye View, slovenska izdaja',
      body:
        'Živ 3D globus v brskalniku: letala, ladje, sateliti, potresi in javne kamere na enem zaslonu. Slovenska izdaja AIS doda vse javne prometne in vremenske kamere po Sloveniji in pokaže njihovo živo sliko.',
      simple:
        'Odprete stran, zavrtite Zemljo do Slovenije in vidite, kaj se dogaja zdaj: kje letijo letala, kje so ladje, kaj kaže kamera na avtocesti pred vami.',
      picture: {
        src: '/pictures/gods-eye-view',
        alt: 'God’s Eye View, slovenska izdaja: 3D pogled na Ljubljano s satelitsko sliko in oznakami javnih kamer.',
        width: 1600,
        height: 1000,
      },
      can: [
        'Živa letala, ladje in sateliti z javnih virov (ADS-B, AIS, CelesTrak).',
        'Potresi in požari z USGS in NASA, promet po resničnih cestah.',
        'Javne kamere po svetu, v slovenski izdaji tudi po vsej Sloveniji.',
        'Glasovno upravljanje z AI agentom, če dodate svoj ključ.',
        'Teče v brskalniku, brez namestitve in brez obveznih ključev.',
      ],
      added: [
        '657 javnih kamer po Sloveniji: avtoceste in ceste (promet.si, DARS) ter vremenske kamere ARSO, zbrane samodejno iz javnih katalogov.',
        'Prenos žive slike kamer skozi lasten posrednik, tako da se slika res osveži.',
        'Čistejši in bolj berljiv zaslon: brez okroglega radarja, manj šuma, večje pisave.',
        'Hitrejši zagon in manj nepotrebnih zahtev ob odpiranju.',
      ],
      facts: [
        { term: 'Izdaja', definition: 'Slovenska izdaja, pripravil AIS Slovenia (2026).' },
        { term: 'Cena', definition: 'Brezplačno, brez registracije.' },
        { term: 'Izvorni projekt', definition: 'God’s Eye View, odprta koda pod licenco MIT.' },
        { term: 'Slike kamer', definition: 'promet.si in DARS (nekomercialna raba z navedbo vira), ARSO.' },
      ],
      actions: [
        { label: 'Zaprosite za slovensko izdajo', href: '/kontakt/', primary: true },
        { label: 'Izvorna koda projekta', href: 'https://github.com/bilawalsidhu/gods-eye-view', external: true },
      ],
      note: 'Slovensko izdajo pošljemo na zahtevo, dokler ne objavimo javnega prenosa. Izvorni projekt je odprta koda; kar smo dodali, ostane odprto.',
    },
  ],
  empty: {
    title: 'Vsebina je v pripravi',
    body: 'Brezplačne vire bomo objavili, ko bodo pripravljeni.',
    action: { label: 'Kontaktirajte nas', href: '/kontakt/' },
  },
};
