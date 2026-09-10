/**
 * Three questions per service, answered the way a person at AIS Slovenia
 * answers them on a first call. Each answer names the company, states one
 * concrete thing and stays honest about what depends on the client.
 */

export const serviceFaq = {
  'avtomatizacija-administracije': [
    {
      q: 'Katere administrativne naloge lahko AIS Slovenia avtomatizira?',
      a: 'Tiste, ki se ponavljajo in imajo jasen vhod in izhod: prepis podatkov iz dokumentov in e-pošte v preglednice ali sistem, priprava poročil in kartic v predpisani obliki, usklajevanje podatkov med orodji in delovni nalogi iz prijav. Za INSPECTUS na primer sistem iz enega izvoza v nekaj sekundah naredi urejeno preglednico in kartico za vsako od 314 vozil.',
    },
    {
      q: 'Kako dolgo traja uvedba avtomatizacije administracije?',
      a: 'Prvi delujoč prototip na resničnih podatkih stranke AIS Slovenia praviloma postavi v nekaj tednih, ker se uvedba začne z enim procesom in ne s celotnim podjetjem. Koliko traja do polne uporabe, je odvisno od števila virov podatkov in od tega, koliko izjem ima proces.',
    },
    {
      q: 'Kaj se zgodi, ko sistem naleti na primer, ki ga ne razume?',
      a: 'Ne ugiba. Vsak sistem AIS Slovenia ima pot za nejasne primere: nalog gre k človeku z izvirnim sporočilom in razlogom, zakaj je obtičal. Sistem prevzame ponavljajoče se delo, odločitve o izjemah ostanejo pri ekipi.',
    },
  ],
  'avtomatizacija-prodaje': [
    {
      q: 'Ali AI svetovalec na spletni strani odgovarja v slovenščini?',
      a: 'Da. Sistemi AIS Slovenia odgovarjajo v slovenščini, po potrebi tudi v angleščini ali drugem jeziku, in to ob vsaki uri. Odgovarjajo samo iz virov, ki jih potrdi stranka, na primer s spletnih strani, iz cenikov in dokumentacije izdelkov, zato ne izmišljajo cen ali obljub.',
    },
    {
      q: 'Kaj se zgodi z resnim povpraševanjem?',
      a: 'Svetovalec zbere ime, kontakt in kratek povzetek pogovora in ga preda prodajni ekipi, po e-pošti ali v CRM. Vprašanja, ki jih ne sme reševati sam, na primer o cenah po meri, skupinah ali zdravstvenih temah, preda človeku takoj, s pojasnilom, zakaj.',
    },
    {
      q: 'Kako AIS Slovenia prepreči, da bi svetovalec povedal kaj narobe?',
      a: 'Vsak odgovor izhaja iz potrjenih virov in pogovori se pregledujejo. Kadar odgovor ni dober, se popravi vir, ne svetovalec. Pred zagonom sistem teče v testnem obdobju na resničnih vprašanjih stranke, dokler odgovori ne ustrezajo.',
    },
  ],
  'spremljanje-trga': [
    {
      q: 'Katere vire lahko sistem za spremljanje trga pregleduje?',
      a: 'Javne razpise, portale za iskanje partnerjev, novice, objave konkurence in cenike, v več jezikih. Za SI-BIG Group sistem AIS Slovenia vsako jutro pregleda vire s šestih balkanskih trgov; nov vir se doda brez programiranja.',
    },
    {
      q: 'Kako sistem ve, kaj je pomembno za nas?',
      a: 'Vsaka stranka ima svoja merila: panogo, državo, velikost, rok, ključne besede. Vsak zadetek dobi oceno in razlog, zakaj je na seznamu. Kar ekipa črta, sistem upošteva pri naslednjem ocenjevanju, zato je seznam vsak teden boljši.',
    },
    {
      q: 'Kako pogosto dobimo pregled?',
      a: 'Praviloma vsako jutro, pred začetkom dela, kot eno stran po strankah ali področjih. AIS Slovenia pogostost in obliko prilagodi: dnevno, tedensko ali takoj, ko se pojavi razpis, ki ustreza merilom.',
    },
  ],
};
