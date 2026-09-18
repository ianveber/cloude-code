import { ctaBand } from './sections.mjs';

/* The closing band under every content page. Shared by the build and the
   admin preview so a draft looks exactly like the published page. */
export const closingCta = ctaBand({
  title: 'Preverimo, ali je avtomatizacija smiselna za vas',
  lead: 'Rezervirajte uvodni pogovor in preverite, ali je AI avtomatizacija smiselna za vaše podjetje.',
  primary: { label: 'Rezervirajte posvet', href: '/kontakt/' },
  secondary: { label: 'Pogosta vprašanja', href: '/pogosta-vprasanja/' },
});
