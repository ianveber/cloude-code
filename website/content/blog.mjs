/**
 * Blog posts. Written by AIS Slovenia in plain Slovene: short sentences, one
 * idea at a time, an example from our own work where it helps. Each post is
 * a page at /blog/<slug>/ with an Article node and a visible date. Dates are
 * the day the post was written, not invented earlier ones.
 */

export const blogPosts = [
  {
    slug: 'kaj-je-ai-avtomatizacija',
    kicker: 'Osnove',
    date: '2026-09-10',
    dateLabel: '10. 9. 2026',
    title: 'Kaj je AI avtomatizacija, razloženo preprosto',
    metaTitle: 'Kaj je AI avtomatizacija, razloženo preprosto | AIS Slovenia',
    metaDescription:
      'AI avtomatizacija pomeni, da računalnik prevzame delo, ki se ponavlja: bere, razvršča, prepisuje in pripravi osnutek. AIS Slovenia razloži, kaj zmore in česa ne.',
    keywords: ['kaj je AI avtomatizacija', 'AI avtomatizacija razlaga', 'avtomatizacija poslovnih procesov preprosto', 'umetna inteligenca za podjetja'],
    summary:
      'AI avtomatizacija pomeni, da računalnik prevzame delo, ki se ponavlja vsak dan: bere sporočila, razvršča, prepisuje in pripravi osnutek. Odločitve ostanejo pri ljudeh.',
    sections: [
      {
        title: 'Kaj to pomeni',
        paragraphs: [
          'Predstavljajte si sodelavca, ki vsak dan prebere vsa sporočila, iz njih izpiše, kaj je treba narediti, in to vpiše v seznam nalog. Nikoli ne pozabi in nikoli ni utrujen. To je AI avtomatizacija. Računalnik prevzame delo, ki je vedno enako, ljudje pa se ukvarjajo s tistim, kar zahteva premislek.',
          'Pri AIS Slovenia to pomeni zelo konkretne stvari: iz izvoza preglednice nastane kartica za vsako vozilo, iz e-pošte nastane delovni nalog, iz vprašanja na spletni strani nastane odgovor iz cenika.',
        ],
      },
      {
        title: 'Kaj AI zmore in česa ne',
        paragraphs: [
          'Zmore brati besedilo, ga razumeti in razvrstiti. Zmore napisati osnutek odgovora, poročila ali objave. Zmore najti podatek v dolgi dokumentaciji in ga navesti z virom. Zmore to delati ob treh zjutraj, brez čakanja.',
          'Ne sme pa sam odločati o stvareh, ki imajo posledice: poslati računa, obljubiti cene, spremeniti pogodbe. Zato vsak sistem, ki ga zgradi AIS Slovenia, predlaga, človek pa potrdi. Ko sistem ni prepričan, to pove in vpraša.',
        ],
      },
      {
        title: 'Kje se začne',
        paragraphs: [
          'Ne s celotnim podjetjem, ampak z enim procesom. Najboljši prvi proces se ponavlja vsak dan, ima jasen začetek in konec in ga je mogoče izmeriti. Kadar nekdo vsak dan pol ure prepisuje podatke iz sporočil v preglednico, je to pravi začetek.',
        ],
      },
      {
        title: 'Kako veste, da deluje',
        paragraphs: [
          'Izmerite čas prej in potem. Preštejte napake prej in potem. Če se številki ne premakneta, avtomatizacija ni bila prava. Pri AIS Slovenia uvedbo začnemo s prototipom na vaših podatkih, da se to vidi, preden se odločite.',
        ],
      },
    ],
  },
  {
    slug: 'kaj-je-ai-agent',
    kicker: 'Osnove',
    date: '2026-09-10',
    dateLabel: '10. 9. 2026',
    title: 'Kaj je AI agent in kaj ni',
    metaTitle: 'Kaj je AI agent in kaj ni | AIS Slovenia',
    metaDescription:
      'AI agent je program, ki prebere, kaj se dogaja, po pravilih izbere naslednji korak in pripravi predlog. AIS Slovenia pove, kako ga drži v mejah in kdaj je smiseln.',
    keywords: ['kaj je AI agent', 'AI agenti za podjetja', 'agentni sistem razlaga', 'AI agent Slovenija'],
    summary:
      'AI agent je program, ki prebere, kaj se dogaja, se po pravilih odloči za naslednji korak in pripravi predlog. Ni čarobni zaposleni, ki bi delal sam. Dober agent ima meje in vedno pove, kaj je naredil.',
    sections: [
      {
        title: 'Kaj agent dela',
        paragraphs: [
          'Navaden program naredi natanko to, kar mu je rečeno: pritisnete gumb, zgodi se ena stvar. Agent ima cilj in nekaj orodij. Prebere koledar, nabiralnik in naloge, ugotovi, kaj je danes pomembno, in pripravi pregled. Če vidi, da stranka čaka na odgovor, pripravi osnutek. Sam se odloči, kateri korak je naslednji, a samo znotraj pravil, ki jih je dobil.',
          'V AISOS, sistemu AIS Slovenia za lastno podjetje, to počne pet agentov vsako jutro ob sedmih. Ob kavi je pregled dneva že napisan.',
        ],
      },
      {
        title: 'Kaj agent ni',
        paragraphs: [
          'Ni zaposleni, ki bi ga pustili samega. Agent ne pozna vašega podjetja, dokler mu ga ne pokažete, in ne ve, kdaj je bolje molčati, dokler mu tega ne poveste. Kdor agentu da dostop do vsega prvi dan, dobi hitre napake namesto hitrega dela.',
        ],
      },
      {
        title: 'Kako ga držimo v mejah',
        paragraphs: [
          'Pri AIS Slovenia nov agent prvi teden samo bere. Drugi teden piše osnutke, ki jih vsakega pregleda človek. Šele ko so osnutki dovolj dobri, pregled pade na vzorec. Nič, kar gre k stranki, ne gre brez potrditve. In vsak korak agenta je zapisan, tako da je vedno mogoče pogledati, zakaj je naredil, kar je naredil.',
        ],
      },
      {
        title: 'Kdaj je agent smiseln',
        paragraphs: [
          'Kadar je delo vsak dan podobno, a ne čisto enako. Priprava osnutkov, razvrščanje prijav, pregled virov, opomniki. Kadar je delo vedno popolnoma enako, zadostuje navadna avtomatizacija. Kadar je vsak primer drugačen, ostane pri človeku.',
        ],
      },
    ],
  },
  {
    slug: 'prvi-proces-za-avtomatizacijo',
    kicker: 'Nasvet',
    date: '2026-09-10',
    dateLabel: '10. 9. 2026',
    title: 'Kako izbrati prvi proces za avtomatizacijo',
    metaTitle: 'Kako izbrati prvi proces za avtomatizacijo | AIS Slovenia',
    metaDescription:
      'Prvi proces za avtomatizacijo naj se ponavlja vsak dan, ima jasen vhod in izhod in se ga da izmeriti. AIS Slovenia pove, kaj izbrati in česa ne začeti prvega.',
    keywords: ['prvi proces za avtomatizacijo', 'kako začeti z AI avtomatizacijo', 'kateri proces avtomatizirati', 'AI za mala podjetja'],
    summary:
      'Dober prvi proces se ponavlja vsak dan, ima jasen začetek in konec, se ga da izmeriti in napaka v njem ne boli preveč. Vse drugo pride kasneje.',
    sections: [
      {
        title: 'Štiri vprašanja',
        paragraphs: [
          'Ali se ponavlja vsak dan ali vsak teden? Ali ima jasen vhod in jasen izhod, na primer sporočilo noter, nalog ven? Ali lahko izmerite, koliko časa danes vzame? Ali napaka v njem povzroči neprijetnost ali škodo? Če so odgovori da, da, da in neprijetnost, ste našli prvi proces.',
        ],
      },
      {
        title: 'Dobri prvi primeri',
        paragraphs: [
          'Prepisovanje podatkov iz sporočil v preglednico ali sistem. Priprava vedno istega dokumenta iz vedno istih podatkov. Odgovarjanje na ista vprašanja strank. Pregledovanje istih virov vsako jutro. Za INSPECTUS je bil prvi proces prepis poročila o škodah v kartice za 314 vozil. Za HEVA prijave napak, ki so prihajale po e-pošti in telefonu.',
        ],
      },
      {
        title: 'Česa ne začeti prvega',
        paragraphs: [
          'Procesov, kjer vsak primer zahteva presojo, na primer pogajanj ali reklamacij. Procesov, ki gredo neposredno k stranki brez vmesnega pregleda. Procesov, ki jih nihče ne zna opisati v petih stavkih. Ti pridejo na vrsto, ko sistem že teče in ekipa ve, kako z njim dela.',
        ],
      },
      {
        title: 'Kaj sledi',
        paragraphs: [
          'Ko prvi proces teče in številke pokažejo razliko, se dodajo sosednji procesi, ki uporabljajo iste podatke. Tako sistem raste okoli tistega, kar že dela, ne okoli tistega, kar bi bilo lepo imeti. Uvodni pogovor z AIS Slovenia je namenjen prav temu: skupaj poiskati prvi proces ali ugotoviti, da ga še ni.',
        ],
      },
    ],
  },
  {
    slug: 'sistem-mora-znati-reci-ne-vem',
    kicker: 'Kako gradimo',
    date: '2026-09-10',
    dateLabel: '10. 9. 2026',
    title: 'Zakaj mora sistem znati reči: ne vem',
    metaTitle: 'Zakaj mora AI sistem znati reči: ne vem | AIS Slovenia',
    metaDescription:
      'AI sistem, ki vedno odgovori, je nevaren. Sistemi AIS Slovenia povedo, kako prepričani so, in nejasne primere predajo človeku. Zakaj to gradi zaupanje.',
    keywords: ['zanesljivost AI sistema', 'AI halucinacije podjetje', 'AI predaja človeku', 'varna AI avtomatizacija'],
    summary:
      'Sistem, ki vedno odgovori, prej ali slej odgovori narobe. Sistemi AIS Slovenia povedo, kako prepričani so, in kar ni jasno, predajo človeku. Zato jim ekipa lahko zaupa.',
    sections: [
      {
        title: 'Težava s samozavestnim odgovorom',
        paragraphs: [
          'AI modeli so dobri v tem, da zvenijo prepričljivo. To je koristno, dokler je odgovor pravilen, in nevarno, ko ni. Stranka, ki dobi napačno ceno z nasmehom, je slabša kot stranka, ki dobi odgovor, da bo poklical človek.',
        ],
      },
      {
        title: 'Kako to rešujemo',
        paragraphs: [
          'Vsak odgovor ima vir. Svetovalec na spletni strani odgovarja samo iz dokumentov, ki jih je potrdila stranka, in če česa ni v virih, tega ne izmisli. Vsaka razvrstitev ima oceno. Filter fotografij za INSPECTUS vsak posnetek označi z oceno zaupanja; nizka ocena pomeni pregled, ne ugibanje. Model za premaze recepturo, ki je preveč drugačna od vsega, kar pozna, preprosto odkloni, in pove, zakaj.',
        ],
      },
      {
        title: 'Predaja človeku ni napaka',
        paragraphs: [
          'Je del zasnove. Kar sistem preda, pride k človeku z izvirnim sporočilom in razlogom, zakaj je obtičalo. Človek odloči v minuti, sistem pa se iz tega uči, kaj naj naslednjič vpraša prej.',
        ],
      },
      {
        title: 'Zakaj to gradi zaupanje',
        paragraphs: [
          'Ekipa sistemu zaupa, ko ve, kje so njegove meje. Sistem, ki reče, da ne ve, je lažje pustiti pri delu kot sistem, ki vedno ve. Pri AIS Slovenia je to pravilo, ne nastavitev.',
        ],
      },
    ],
  },
];
