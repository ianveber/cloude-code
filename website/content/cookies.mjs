/**
 * The privacy page at /piskotki/, in two versions. The build picks the one
 * that matches site.analytics.mode: "cookieless" (no cookies, no banner,
 * every view counts) or "consent" (a banner asks first). Plain words,
 * nothing that is not true.
 */

export const cookies = {
  cookieless: {
    eyebrow: 'Zasebnost',
    title: 'Brez piškotkov',
    lead: 'Ta stran ne uporablja piškotkov. Oglede štejemo brez njih, zato vas ne sprašujemo za dovoljenje.',
    metaTitle: 'Zasebnost in analitika brez piškotkov | AIS Slovenia',
    metaDescription:
      'Spletna stran ais-slovenia.si ne uporablja piškotkov. Oglede šteje brez sledilcev, brez naslova IP in brez imen. Kaj točno se pošlje in kaj ne.',
    keywords: ['brez piškotkov', 'zasebnost', 'analitika spletne strani', 'AIS Slovenia'],
    answer:
      'AIS Slovenia na spletni strani ne uporablja piškotkov in ne prikazuje pasice za privolitev. Oglede strani šteje sama: ob vsakem ogledu se pošlje pot strani, naslov strani, s katere je obiskovalec prišel, širina zaslona in država. Naslov IP se ne shrani, obisk pa se loči s kodo, ki se vsak dan spremeni in je ni mogoče povezati z osebo.',
    sections: [
      {
        title: 'V vaš brskalnik ne shranimo ničesar',
        paragraphs: [
          'Stran ne nastavi nobenega piškotka in ne bere ničesar iz vašega brskalnika. Zato ni pasice, ki bi vas prosila za dovoljenje: ni ničesar, kar bi bilo treba dovoliti.',
        ],
      },
      {
        title: 'Kako štejemo oglede',
        paragraphs: [
          'Ob vsakem ogledu stran našemu strežniku pošlje pot strani, naslov strani, s katere ste prišli, širino zaslona in državo, iz katere prihaja zahteva. Iz tega vidimo, koliko ogledov ima katera stran, od kod obiskovalci pridejo in ali berejo na telefonu ali računalniku.',
          'Da oglede iste osebe štejemo kot en obisk, strežnik iz dneva, naslova in brskalnika naredi kratko kodo. Koda se vsak dan spremeni, naslov IP se ne shrani in kode ni mogoče obrniti nazaj v naslov ali osebo.',
          'Ne shranjujemo imen, e-pošte in ničesar, kar bi vas povezalo z drugimi stranmi. Podatkov ne prodajamo in jih ne delimo z oglaševalci.',
        ],
      },
      {
        title: 'Če kdaj dodamo piškotke',
        paragraphs: [
          'Če bomo kdaj potrebovali piškotke, na primer za orodje tretje osebe, se bo pred tem na strani pojavila pasica, ki vas bo vprašala za dovoljenje. Ta stran bo takrat opisala, kateri piškotki so in kako dolgo trajajo.',
        ],
      },
    ],
    table: [
      { name: 'Pot strani', purpose: 'Katera stran je bila ogledana.', duration: 'Shranjeno kot dnevni seštevek', kind: 'Analitika' },
      { name: 'Vir obiska', purpose: 'Samo ime strani, s katere ste prišli, brez celotnega naslova.', duration: 'Shranjeno kot dnevni seštevek', kind: 'Analitika' },
      { name: 'Širina zaslona', purpose: 'Telefon, tablica ali računalnik.', duration: 'Shranjeno kot dnevni seštevek', kind: 'Analitika' },
      { name: 'Država', purpose: 'Iz katere države prihaja zahteva.', duration: 'Shranjeno kot dnevni seštevek', kind: 'Analitika' },
    ],
  },

  consent: {
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
  },
};
