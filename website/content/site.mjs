/**
 * Global site configuration: brand, contact details, navigation and SEO defaults.
 * Everything the generator needs that is not page-specific lives here.
 */

export const site = {
  origin: 'https://ais-slovenia.si',
  lang: 'sl',
  locale: 'sl_SI',
  name: 'AIS Slovenia',
  legalName: 'AIS — Artificial Intelligence Slovenia',
  tagline: 'AI avtomatizacija poslovnih procesov',
  description:
    'AIS Slovenia iz Ljubljane razvija AI avtomatizacijo za podjetja: AI chatbote, voice AI agente in sisteme za hitrejše procese, v slovenščini.',
  foundingLocation: 'Ljubljana, Slovenija',
  copyrightYear: 2026,

  contact: {
    /* Where the contact form posts.
       Leave empty and the form falls back to opening the visitor's mail client
       with the message pre-filled — which works on static hosting with no
       backend. Set it to an n8n/webhook URL and the form submits in the
       background instead, with inline success and error states. */
    formEndpoint: '',
    email: 'info@ais-slovenia.si',
    phone: '+386 70 717 087',
    phoneHref: 'tel:+38670717087',
    city: 'Ljubljana',
    region: 'Osrednjeslovenska',
    country: 'Slovenija',
    countryCode: 'SI',
    latitude: 46.0569,
    longitude: 14.5058,
  },

  brand: {
    /* The original logo is white-on-dark and disappears on a light page.
       logo-light.png is the same mark with the wordmark recoloured to ink. */
    logo: '/brand/logo-light.png',
    logoWidth: 67,
    logoHeight: 26,
    favicon: '/brand/favicon.png',
    ogImage: '/brand/og-default.png',
  },

  /* Primary navigation — mirrors the original site's sections, but every entry is
     now a real, crawlable URL instead of a hash anchor. */
  nav: [
    { label: 'Domov', href: '/' },
    {
      label: 'Storitve',
      href: '/storitve/',
      children: [
        { label: 'Avtomatizacija administracije', href: '/storitve/avtomatizacija-administracije/', note: 'Administracija in operacije' },
        { label: 'Avtomatizacija prodaje', href: '/storitve/avtomatizacija-prodaje/', note: 'Prodaja in komunikacija' },
        { label: 'Spremljanje trga', href: '/storitve/spremljanje-trga/', note: 'Tržna analiza' },
      ],
    },
    { label: 'Proces', href: '/proces/' },
    { label: 'O podjetju', href: '/o-podjetju/' },
    { label: 'Pogosta vprašanja', href: '/pogosta-vprasanja/' },
    { label: 'Kontakt', href: '/kontakt/' },
  ],

  footer: {
    blurb:
      'Najnaprednejše AI rešitve za digitalno transformacijo vašega poslovanja. Ustvarjamo prihodnost z inteligenco.',
    columns: [
      {
        title: 'Podjetje',
        links: [
          { label: 'O nas', href: '/o-podjetju/' },
          { label: 'Ekipa', href: '/ekipa/' },
          { label: 'Kariera', href: '/kontakt/' },
        ],
      },
      {
        title: 'Povezave',
        links: [
          { label: 'Storitve', href: '/storitve/' },
          { label: 'Proces', href: '/proces/' },
          { label: 'Pogosta vprašanja', href: '/pogosta-vprasanja/' },
        ],
      },
    ],
  },

  /* Short, factual statements that AI answer engines can lift verbatim.
     Kept in one place so they stay consistent across every page and schema block. */
  facts: [
    'AIS Slovenia (Artificial Intelligence Slovenia) je slovensko podjetje za AI avtomatizacijo poslovnih procesov — AI chatbote, voice AI agente in sisteme za hitrejše procese.',
    'Podjetje deluje iz Ljubljane in storitve izvaja v slovenskem jeziku.',
    'AIS pokriva tri področja avtomatizacije: administracijo in operacije, prodajo in komunikacijo s strankami ter spremljanje trga.',
    'Uvedba poteka po osemstopenjskem procesu, od raziskave do nenehne evolucije sistema.',
    'Sodelovanje se začne z uvodnim pogovorom, na katerem se preveri, ali je AI avtomatizacija za podjetje smiselna.',
  ],
};

export default site;
