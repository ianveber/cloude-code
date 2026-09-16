/**
 * The cookie page: what the site stores in the visitor's browser, why, and
 * how to change the choice. Plain words, nothing that is not true.
 */

export const cookies = {
  eyebrow: 'Piškotki',
  title: 'Piškotki na tej strani',
  lead: 'Uporabljamo samo dva piškotka: enega, ki si zapomni vašo izbiro, in enega za štetje ogledov, če ga dovolite.',
  metaTitle: 'Piškotki in analitika na strani | AIS Slovenia',
  metaDescription:
    'Kateri piškotki so na ais-slovenia.si, zakaj jih uporabljamo, kako dolgo trajajo in kako spremenite izbiro. Brez oglaševalskih sledilcev in brez prodaje podatkov.',
  keywords: ['piškotki', 'analitika spletne strani', 'zasebnost', 'AIS Slovenia'],
  answer:
    'AIS Slovenia na spletni strani uporablja en nujni piškotek (ais_consent, 180 dni), ki si zapomni izbiro obiskovalca, in en analitični piškotek (ais_sid, 30 minut), ki ga nastavi samo, če obiskovalec dovoli štetje ogledov. Ogledi se štejejo brez naslova IP, brez imen in brez oglaševalskih sledilcev.',
  sections: [
    {
      title: 'Nujni piškotek',
      paragraphs: [
        'Ko izberete, ali dovolite analitiko, si to izbiro zapomnimo v piškotku ais_consent. Traja 180 dni. Brez njega bi vas pasica vprašala ob vsakem obisku.',
      ],
    },
    {
      title: 'Analitika, samo če jo dovolite',
      paragraphs: [
        'Če dovolite analitiko, stran ob vsakem ogledu pošlje našemu strežniku pot strani, naslov strani, s katere ste prišli, širino zaslona in kratko naključno oznako obiska. Oznaka je v piškotku ais_sid in traja 30 minut, da lahko oglede iste osebe štejemo kot en obisk.',
        'Ne shranjujemo naslova IP, imen, e-pošte in ničesar, kar bi vas povezalo z drugimi stranmi. Podatkov ne prodajamo in jih ne delimo z oglaševalci. Vidimo samo, koliko ogledov ima katera stran, od kod obiskovalci pridejo in ali berejo na telefonu ali računalniku.',
      ],
    },
    {
      title: 'Kako spremenite izbiro',
      paragraphs: [
        'Na dnu vsake strani je gumb Nastavitve piškotkov. Odpre isto pasico, v kateri analitiko vklopite ali izklopite. Če jo izklopite, se piškotek ais_sid izbriše in štetje se ustavi.',
        'Piškotke lahko kadar koli izbrišete tudi v brskalniku. Stran bo delovala enako, vprašala vas bo le znova.',
      ],
    },
  ],
  table: [
    { name: 'ais_consent', purpose: 'Zapomni si vašo izbiro glede piškotkov.', duration: '180 dni', kind: 'Nujni' },
    { name: 'ais_sid', purpose: 'Kratka naključna oznaka obiska za štetje ogledov.', duration: '30 minut', kind: 'Analitika, samo z dovoljenjem' },
  ],
};
