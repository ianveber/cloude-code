/**
 * Blog posts. Written by AIS Slovenia in plain Slovene: short sentences, one
 * idea at a time, an example from our own work where it helps. Each post is
 * a page at /blog/<slug>/ with an Article node, a visible date and one
 * rendered illustration from tools/pictures/blog.html. Dates are the day the
 * post was written, not invented earlier ones.
 */

const pic = (slug, alt) => ({ src: `/pictures/blog-${slug}`, alt, width: 1600, height: 1000 });

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
    picture: pic('kaj-je-ai-avtomatizacija', 'Prej: devet sporočil, ročno prepisanih v 45 minutah. Potem: isti seznam nalog, pregledan v treh minutah.'),
    sections: [
      {
        title: 'Kaj to pomeni',
        paragraphs: [
          'Predstavljajte si sodelavca, ki vsak dan prebere vsa sporočila, iz njih izpiše, kaj je treba narediti, in to vpiše v seznam nalog. Nikoli ne pozabi in nikoli ni utrujen. To je AI avtomatizacija. Računalnik prevzame delo, ki je vedno enako, ljudje pa se ukvarjajo s tistim, kar zahteva premislek.',
          'Pri AIS Slovenia to pomeni zelo konkretne stvari: iz izvoza preglednice nastane kartica za vsako vozilo, iz e-pošte nastane delovni nalog, iz vprašanja na spletni strani nastane odgovor iz cenika.',
        ],
      },
      {
        title: 'Kako se razlikuje od navadne avtomatizacije',
        paragraphs: [
          'Navadna avtomatizacija dela s pravili: če pride e-pošta z besedo račun, jo daj v mapo Računi. Odpove, ko sporočilo ne izgleda tako, kot je pričakovala. AI avtomatizacija razume vsebino. Sporočilo, ki pravi, da v kleti pušča cev, razume kot prijavo napake z nujnostjo, čeprav besede napaka v njem ni.',
          'Zato lahko prevzame delo, ki je bilo doslej preveč raznoliko za računalnik, a preveč ponavljajoče za človeka: branje, razvrščanje, povzemanje, priprava osnutkov.',
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
          'Za INSPECTUS je bil prvi proces prepis poročila o škodah v kartice za vozila. Za HEVA prijave napak. Za Pacom ponudbe, ki so se pisale znova za vsako povpraševanje. Vsakič ena stvar, ki je bila vsak dan enaka.',
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
    picture: pic('kaj-je-ai-agent', 'Zanka agenta: prebere, odloči po pravilih, predlaga, človek potrdi. Vsako jutro ob sedmih.'),
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
          'Lestev je dvosmerna. Če se kakovost osnutkov poslabša, gre agent nazaj na stopnjo, kjer vsak osnutek pregleda človek. To ni kazen, ampak varovalka.',
        ],
      },
      {
        title: 'Primer iz enega jutra',
        paragraphs: [
          'Ob sedmih agent za e-pošto prebere 31 novih sporočil in jih razvrsti: štiri čakajo na odgovor, dve sta računa, ostalo so obvestila. Agent za koledar vidi, da se dva sestanka prekrivata. Agent za projekte najde rok v četrtek. Skupaj napišejo eno stran. Vodja jo prebere, potrdi dva osnutka odgovorov, tretjega popravi. Cel postopek vzame deset minut, ki so bile prej ura.',
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
    picture: pic('prvi-proces-za-avtomatizacijo', 'Štiri vprašanja s kljukicami in dva primera dobrih prvih procesov; pogajanja prečrtana z oznako ne prvo.'),
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
        title: 'Kako izmeriti, preden začnete',
        paragraphs: [
          'En teden si zapisujte: kolikokrat se proces zgodi, koliko minut vzame vsakič, koliko napak opazite. Tri številke na listku. To je vaše izhodišče in edini pošten način, da čez dva meseca veste, ali je avtomatizacija delovala.',
          'Če procesa ne morete izmeriti, ga verjetno tudi ne morete jasno opisati. To je znak, da še ni pravi za začetek.',
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
    picture: pic('sistem-mora-znati-reci-ne-vem', 'Lestvica zaupanja od 0 do 100 z oznako pri 41 v območju za pregled in kartica primera, predanega človeku.'),
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
        title: 'Kje je prag',
        paragraphs: [
          'Prag ni ena številka za vse. Pri razvrščanju fotografij je lahko nizek, ker napačno razvrščen posnetek človek opazi in premakne. Pri odgovoru stranki o ceni je prag zelo visok, ker napačne cene ni mogoče vzeti nazaj. Prag nastavimo skupaj s stranko, po tem, koliko boli napaka, in ga po prvih tednih popravimo.',
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
  {
    slug: 'kako-ai-odgovarja-iz-dokumentov',
    kicker: 'Kako gradimo',
    date: '2026-09-14',
    dateLabel: '14. 9. 2026',
    title: 'Kako AI odgovarja iz vaših dokumentov, ne iz glave',
    metaTitle: 'Kako AI odgovarja iz vaših dokumentov, ne iz glave | AIS Slovenia',
    metaDescription:
      'AI svetovalec ne sme ugibati. AIS Slovenia razloži, kako sistem najde pravi odlomek v ceniku ali navodilih, odgovori z virom in pove, ko odgovora v dokumentih ni.',
    keywords: ['AI odgovori iz dokumentov', 'RAG razlaga preprosto', 'AI svetovalec spletna stran', 'AI chatbot z virom'],
    summary:
      'Dober AI svetovalec ne odgovarja iz spomina, ampak iz vaših dokumentov. Najprej najde pravi odlomek, potem iz njega sestavi odgovor in navede vir. Če odlomka ni, to pove.',
    picture: pic('kako-ai-odgovarja-iz-dokumentov', 'Trije dokumenti, vprašanje, odgovor z navedbo vira in prečrtano ugibanje.'),
    sections: [
      {
        title: 'Dve vrsti odgovorov',
        paragraphs: [
          'AI model lahko odgovori iz tega, kar se je naučil nekje na spletu, ali iz tega, kar mu pokažete. Prvo je kot sodelavec, ki je nekoč nekaj slišal. Drugo je kot sodelavec, ki odpre vaš cenik in prebere vrstico. Za podjetje je uporaben samo drugi.',
          'Zato vsi svetovalci, ki jih gradi AIS Slovenia, delajo v dveh korakih: najprej iskanje, potem odgovor.',
        ],
      },
      {
        title: 'Kako to deluje, preprosto',
        paragraphs: [
          'Vaše dokumente, na primer cenik, pogosta vprašanja in navodila, sistem razreže na kratke odlomke in si za vsakega zapomni, o čem govori. Ko obiskovalec vpraša, kako poteka hramba, sistem najde tri odlomke, ki so temu najbližje, in samo te da modelu z navodilom: odgovori iz tega in navedi, od kod.',
          'Model potem sestavi odgovor v naravnem jeziku in ob njem izpiše vir: dokument in odstavek. Obiskovalec lahko preveri, ekipa pa vidi, kateri dokument je odgovoril.',
        ],
      },
      {
        title: 'Kaj se zgodi, ko odgovora ni',
        paragraphs: [
          'Če noben odlomek ni dovolj blizu vprašanju, sistem ne izmisli odgovora. Pove, da tega v virih ni, in ponudi človeka. Pri Elementum tako na vprašanje o gibanju cen svetovalec odgovori, da o tem ne svetuje, in ponudi klic.',
        ],
      },
      {
        title: 'Kako vzdrževati',
        paragraphs: [
          'Ko se cenik spremeni, se spremeni dokument, ne sistem. Novi odlomki so na voljo takoj. Enkrat na teden nekdo pregleda pogovore, kjer je sistem predal človeku, in dopolni dokument, kjer je manjkal odgovor. Sistem postane boljši tako, da so boljši dokumenti.',
        ],
      },
      {
        title: 'Primer iz našega dela',
        paragraphs: [
          'Za Epolac, proizvajalca barv in premazov, so vir tehnični in varnostni listi za več sto izdelkov. Izvajalec na gradbišču vpraša, kako redčiti temeljni premaz za brezzračno brizganje. Sistem najde odstavek o redčenju v pravem listu, sestavi korake in ob njih izpiše izdelek, list in odstavek. Ko tehnična služba list popravi, je popravljen tudi vsak prihodnji odgovor. Nihče ne uči sistema; ekipa ureja dokumente, kot jih je urejala prej.',
        ],
      },
      {
        title: 'Kaj to pomeni za vas',
        paragraphs: [
          'Ne potrebujete popolne dokumentacije za začetek. Potrebujete deset dokumentov, ki odgovorijo na osemdeset odstotkov vprašanj, in navado, da jih posodabljate. Ostalo gre k človeku, kot je šlo doslej.',
        ],
      },
    ],
  },
  {
    slug: 'koliko-casa-vzame-uvedba',
    kicker: 'Nasvet',
    date: '2026-09-14',
    dateLabel: '14. 9. 2026',
    title: 'Koliko časa vzame uvedba AI sistema',
    metaTitle: 'Koliko časa vzame uvedba AI sistema | AIS Slovenia',
    metaDescription:
      'Od prvega pogovora do delujočega prototipa mine nekaj tednov, ne mesecev. AIS Slovenia razloži osem korakov uvedbe in kaj mora prispevati stranka.',
    keywords: ['koliko časa vzame uvedba AI', 'uvedba AI sistema koraki', 'AI prototip v tednih', 'proces uvedbe avtomatizacije'],
    summary:
      'Prvi pogovor vzame pol ure. Do delujočega prototipa na vaših podatkih mine nekaj tednov. Do sistema, ki teče vsak dan, še nekaj. Tukaj je, kaj se zgodi v vsakem koraku in kaj potrebujemo od vas.',
    picture: pic('koliko-casa-vzame-uvedba', 'Osem korakov uvedbe na časovnici od prvega tedna naprej, prototip označen kot delujoč demo na vaših podatkih.'),
    sections: [
      {
        title: 'Osem korakov, kratko',
        paragraphs: [
          'Raziskava, diagnostika, potopitev, arhitektura, prototip, kalibracija, uvedba, evolucija. Prvi štirje so razumevanje in načrt, peti je delujoč demo, zadnji trije so uvedba in izboljševanje. Isti koraki za majhen svetovalec na spletni strani in za sistem, ki obdeluje dokumente za cele ladje; razlika je v trajanju.',
        ],
      },
      {
        title: 'Prvi teden: razumeti',
        paragraphs: [
          'Uvodni pogovor vzame pol ure. Nato skupaj popišemo proces: kdo ga začne, kaj vstopi, kaj izstopi, kje se zatakne. Potrebujemo primere iz resničnega dela, na primer deset resničnih sporočil ali en resnični izvoz. Brez resničnih primerov se ne da narediti resničnega sistema.',
        ],
      },
      {
        title: 'Drugi in tretji teden: prototip',
        paragraphs: [
          'Prototip teče na vaših podatkih in ga preizkusite pred odločitvijo. Pri INSPECTUS je bil prototip orodje, ki je iz resničnega izvoza naredilo kartice. Ko ga vidite, veste, ali je vredno naprej. Če ni, se tukaj pošteno konča.',
        ],
      },
      {
        title: 'Naslednji tedni: kalibracija in uvedba',
        paragraphs: [
          'Sistem teče vzporedno z obstoječim delom in ekipa primerja rezultate. Popravljajo se pravila, pragovi in besedila. Potem sistem prevzame delo, ekipa dobi navodila in nekoga, ki ga pokliče, ko kaj ne štima.',
          'Koliko časa to vzame, je odvisno predvsem od tega, kako hitro stranka pregleduje in odgovarja. Sistem je pogosto pripravljen prej kot odločitev.',
        ],
      },
      {
        title: 'Kaj uvedbo najbolj upočasni',
        paragraphs: [
          'Trije stvari, vedno iste. Prva: resničnih primerov ni, ker jih je treba šele zbrati. Druga: nihče v podjetju nima zadnje besede o procesu, zato vsak pregled čaka na sestanek. Tretja: želja, da bi sistem že v prvem koraku pokril vse izjeme. Če se vnaprej dogovorimo, kdo odloča, in začnemo s primeri, ki jih že imate, se tedni ne raztegnejo v mesece.',
        ],
      },
      {
        title: 'Potem: evolucija',
        paragraphs: [
          'Po uvedbi sistem spremljamo, zbiramo povratne informacije in ga izboljšujemo. Prvi mesec je pregledov največ, potem pa se sistem umiri in začne rasti okoli tistega, kar že dela.',
        ],
      },
    ],
  },
  {
    slug: 'kaj-se-zgodi-z-vasimi-podatki',
    kicker: 'Kako gradimo',
    date: '2026-09-14',
    dateLabel: '14. 9. 2026',
    title: 'Kaj se zgodi z vašimi podatki',
    metaTitle: 'Kaj se zgodi z vašimi podatki pri AI | AIS Slovenia',
    metaDescription:
      'Kam gredo dokumenti, e-pošta in podatki strank, ko jih obdeluje AI sistem. AIS Slovenia razloži, kaj ostane pri vas, kaj vidi model in kdo lahko preveri.',
    keywords: ['AI in varstvo podatkov', 'kam gredo podatki pri AI', 'AI avtomatizacija GDPR', 'varna uporaba AI v podjetju'],
    summary:
      'Vaši dokumenti ostanejo pri vas. Model dobi samo vprašanje in odlomek, ki ga potrebuje za odgovor, in na vaših podatkih se ne uči. Vsak korak je zapisan, tako da je vedno mogoče preveriti, kdo je kaj naredil.',
    picture: pic('kaj-se-zgodi-z-vasimi-podatki', 'Okvir vašega podjetja z dokumenti, e-pošto in podatki strank; model zunaj njega dobi samo vprašanje in odlomek in vrne odgovor.'),
    sections: [
      {
        title: 'Kaj ostane pri vas',
        paragraphs: [
          'Dokumenti, e-pošta in podatki strank ostanejo v vaših orodjih in vaši bazi. Sistem, ki ga gradi AIS Slovenia, jih bere tam, kjer so, in ne dela kopij, ki bi živele nekje drugje. Dostop je omejen po vlogah: kdor vidi stranko, vidi svojo stranko.',
        ],
      },
      {
        title: 'Kaj vidi model',
        paragraphs: [
          'Ko sistem potrebuje odgovor, modelu pošlje vprašanje in odlomek, ki je za odgovor potreben, ne cele baze. Model odgovori in odlomek pozabi. Uporabljamo modele ponudnikov, pri katerih poslovni podatki niso učno gradivo; to preverimo v pogodbi, ne v oglasu.',
          'Za posebej občutljive podatke sistem nastavimo tako, da model dobi še manj: samo strukturo brez imen, ali pa se korak izvede brez modela, s pravili.',
        ],
      },
      {
        title: 'Kdo lahko preveri',
        paragraphs: [
          'Vsak korak sistema je zapisan: kdo ali kaj je kaj naredil, kdaj in na podlagi česa. Ko stranka vpraša, zakaj je dobila to sporočilo, je odgovor v dnevniku, ne v ugibanju. Isti dnevnik uporabimo, ko sistem izboljšujemo.',
        ],
      },
      {
        title: 'Kaj gre ven samo s potrditvijo',
        paragraphs: [
          'Vse, kar zapusti podjetje: sporočilo stranki, račun, objava. Sistem pripravi, človek potrdi. To ni nastavitev, ki bi jo bilo mogoče pomotoma izklopiti, ampak meja v kodi, in pri AIS Command jo preverja avtomatski test.',
        ],
      },
      {
        title: 'Primer: fotografije s pomola',
        paragraphs: [
          'Pri filtru fotografij za INSPECTUS je bilo vprašanje podatkov jasno od prvega dne: posnetki vozil ne smejo po nepotrebnem zapuščati naprave. Zato bralnik številk VIN teče na telefonu in v oblak gre samo posnetek, ki ga bralnik ne reši, brez shranjevanja. Na testnem naboru je bilo 29 od 30 posnetkov prebranih na napravi. Sistem je zasnovan okrog tega, kaj sme zapustiti podjetje, ne obratno.',
        ],
      },
      {
        title: 'Kaj vprašati vsakega ponudnika',
        paragraphs: [
          'Kje so shranjeni podatki. Ali se model uči na njih. Kdo ima dostop in kako se to preverja. Kaj se zgodi s podatki, ko sodelovanje neha. Če ponudnik na katero od teh vprašanj ne zna odgovoriti v enem stavku, počakajte z odločitvijo.',
        ],
      },
    ],
  },
  {
    slug: 'ai-chatbot-v-slovenscini',
    kicker: 'Osnove',
    date: '2026-09-14',
    dateLabel: '14. 9. 2026',
    title: 'AI chatbot v slovenščini: kaj deluje in kaj ne',
    metaTitle: 'AI chatbot v slovenščini: kaj deluje in kaj ne | AIS Slovenia',
    metaDescription:
      'Ali AI chatbot res govori slovensko? Kaj deluje, kje se zatakne in kako narediti, da obiskovalec dobi pravi odgovor ali pravega človeka. Iz izkušenj AIS Slovenia.',
    keywords: ['AI chatbot slovenščina', 'chatbot za spletno stran slovensko', 'AI svetovalec v slovenščini', 'chatbot podjetje Slovenija'],
    summary:
      'Sodobni modeli govorijo slovensko dobro, s sklanjatvami in dvojino. Težava ni jezik, ampak vsebina: chatbot je dober toliko, kot so dobri dokumenti, iz katerih odgovarja, in kako hitro preda človeku, ko ne ve.',
    picture: pic('ai-chatbot-v-slovenscini', 'Klepet v slovenščini: vprašanje o odpiralnem času, naraven odgovor, pritožba, predana sodelavki.'),
    sections: [
      {
        title: 'Ali res govori slovensko',
        paragraphs: [
          'Da. Modeli, ki jih uporabljamo, pišejo slovensko s pravilnimi sklanjatvami, dvojino in vljudnostnimi oblikami. Pred dvema letoma je bilo to še težava, danes ni več. Kar še preverimo, so imena krajev, izdelkov in strokovni izrazi vaše panoge; te modelu povemo v navodilih.',
        ],
      },
      {
        title: 'Kje se zatakne',
        paragraphs: [
          'Pri vsebini, ne pri jeziku. Chatbot, ki odgovarja iz spomina, bo obiskovalcu o vaši ponudbi povedal nekaj, kar zveni prav in ni res. Chatbot, ki odgovarja iz vaših dokumentov, pove tisto, kar v njih piše, in navede vir. Razlika je v gradnji, ne v modelu.',
          'Druga past je ton. Chatbot, ki je preveč navdušen, deluje tuje. Nastavimo ga tako, da piše kot vaša sodelavka na dobrem dnevu: kratko, jasno, prijazno, brez klicajev.',
        ],
      },
      {
        title: 'Kaj mora znati poleg odgovarjanja',
        paragraphs: [
          'Vprašati nazaj, ko vprašanje ni jasno. Priznati, ko odgovora ni. Predati človeku s povzetkom, ne z golim kontaktom. In se ustaviti pri stvareh, ki niso njegove: cene po dogovoru, pritožbe, zdravstvena vprašanja. Pri Tower Spa Celje asistent rezervira termine, skupine pa preda lastniku. Pri Dr. Asya Grafy svetuje o negi, o boleznih pa ne.',
        ],
      },
      {
        title: 'Primer dobrega odgovora',
        paragraphs: [
          'Obiskovalec vpraša, ali imate odprto v soboto. Slab odgovor: dolga zahvala za vprašanje, tri vzklike in odpiralni čas na koncu. Dober odgovor: da, v soboto od devetih do štirih, in vprašanje, ali želi rezervirati. Ko drugi obiskovalec napiše pritožbo, dober chatbot ne opravičuje v imenu podjetja in ne ponuja popusta, ki ga ni. Pove, da bo pritožbo predal sodelavki, ki odgovori še danes, in jo res preda, s celotnim besedilom.',
        ],
      },
      {
        title: 'Kako veste, ali dela dobro',
        paragraphs: [
          'Enkrat na teden preberite dvajset pogovorov. Koliko jih je dobilo pravi odgovor, koliko jih je šlo k človeku, koliko je bilo napačnih. Prvi mesec bo napačnih nekaj, potem skoraj nič, če dokumente sproti popravljate. Chatbot ni projekt, ki se konča z uvedbo, ampak sodelavec, ki ga je treba občasno poslušati.',
        ],
      },
    ],
  },
];
