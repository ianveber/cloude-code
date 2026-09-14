/**
 * The deeper layer of every case study, keyed by product id and merged over
 * content/case-studies.mjs at build time.
 *
 * `before` is a short scene of one working day before the system, `practice`
 * the same day with it, `faq` three questions a reader would ask, `detail`
 * the second rendered screen with its caption. Same rules as the base file:
 * plain Slovene, short sentences, no dashes, no invented client quotes; the
 * six drafted clients stay drafts.
 */

export const deep = {
  athlos: {
    before: [
      'Ponedeljek zjutraj. Trener ima v telefonu tri pogovore z ekipo in preglednico, ki jo je zadnjič uredil v nedeljo zvečer. Pošlje trening za danes v skupino, dva športnika ga preberete šele po šoli, eden trenira po starem načrtu, ker je prezrl sporočilo.',
      'Po treningu nihče ne ve, kako je šlo. Kdo je bil utrujen, kdo je dvignil več, kot je smel, kdo je izpustil zadnji blok. Trener to izve čez teden dni, ko se nekdo pritoži nad bolečino, ki bi jo jutranji check-in pokazal že v torek.',
    ],
    practice: [
      'Isti ponedeljek z ATHLOS. Športnik ob sedmih odgovori na štiri vprašanja o spanju, energiji, bolečinah in stresu. Aplikacija izračuna pripravljenost, recimo 64, in pokaže današnji trening s prilagojenim bremenom. Bloki se odkljukajo sproti, čas počitka teče na zaslonu.',
      'Trener na nadzorni plošči vidi vso ekipo v enem stolpcu: kdo je pripravljen, kdo naj trenira lažje, kdo naj počiva. Ko športnik vpraša ZEUS, ali lahko zmanjša serije, ZEUS predlaga tri namesto štirih, športnik potrdi, trener pa spremembo vidi v zgodovini in jo lahko z enim klikom vrne.',
    ],
    faq: [
      { q: 'Ali ATHLOS deluje z uro ali pametno zapestnico?', a: 'Trenutno ne. Pripravljenost se računa iz jutranjega check-ina in hidracije. Povezava z napravami je načrtovana, a je ne obljubljamo, dokler ne teče.' },
      { q: 'Ali lahko AI trener sam spremeni trening?', a: 'Samo, če športnik to dovoli. Privzeto vsako spremembo potrdi, lahko da stalno dovoljenje ali AI urejanje izklopi. Vsako spremembo je mogoče razveljaviti, trener pa za vsakogar v svoji ekipi.' },
      { q: 'Kje tečejo podatki športnikov?', a: 'V bazi z dostopom po vrsticah: športnik vidi svoje, trener svojo ekipo. Ključi do AI modelov nikoli ne zapustijo strežnika.' },
    ],
    detail: { src: '/pictures/athlos-detail', alt: 'Trenerjev pogled na ekipo v ATHLOS z ocenami pripravljenosti in predlogom ZEUS, ki čaka na potrditev.', caption: 'Trener vidi pripravljenost cele ekipe. Desno ZEUS predlaga spremembo, ki jo mora športnik potrditi, spodaj je zgodovina z gumbom za razveljavitev.' },
  },

  'ais-command': {
    before: [
      'Torek popoldne. Stranka pokliče in vpraša, kdaj bo končana druga faza. Sodelavec odpre CRM, potem preglednico s projekti, potem nabiralnik, kjer je zadnji dogovor. Čez petnajst minut pokliče nazaj z odgovorom, ki bi moral biti na zaslonu.',
      'Zadnji dan v mesecu se trije ljudje spomnijo, da je treba izdati račune za storitve. Nekdo prepisuje zneske iz pogodb, nekdo preverja, ali je kdo že plačal, en opomin gre napačni osebi.',
    ],
    practice: [
      'Isti torek z AIS Command. Stranka odpre portal na telefonu in vidi obe fazi z napredkom, stanje storitve v navadnem jeziku in odprt račun z gumbom za plačilo. Klica ni.',
      'Zjutraj ob sedmih so agenti že pripravili predloge: naslednji korak pri dveh poslih, en račun za izdajo, en opomin za zamudo. Vsak predlog ima potrdi ali zavrni. Mesečni računi so nastali kot osnutki v bazi ponoči, objavi in pošlje jih človek. Nič ne odide samo.',
    ],
    faq: [
      { q: 'Ali agenti lahko sami pošljejo račun ali opomin?', a: 'Ne. Delavci samo predlagajo. Tri vrste dejanj se izvedejo po potrditvi, vsako se pred izvedbo znova preveri in ob odstopanju zavrne. Da nič načrtovanega ne doseže pošiljatelja samo od sebe, preverja avtomatski test.' },
      { q: 'Kaj stranka vidi v portalu?', a: 'Svoje projekte z napredkom, zdravje storitev z dosegljivostjo zadnjih 30 dni, mesečnim obsegom in zadnjim pregledom, račune in plačilo s kartico. Portal je narejen najprej za telefon.' },
      { q: 'Ali je AIS Command že v redni uporabi?', a: 'Je pred zagonom. Prvi pilot je v pripravi, plačila so še izklopljena. Na tej strani ne trdimo, da teče v produkciji, dokler ne bo.' },
    ],
    detail: { src: '/pictures/ais-command-detail', alt: 'Portal AIS Command na telefonu s projekti, zdravjem storitve in računom, ob njem seznam predlogov agentov za potrditev.', caption: 'Stranka vidi projekte, stanje storitve in račune na telefonu. Desno so predlogi agentov za danes, vsak s potrdi in zavrni.' },
  },

  aisos: {
    before: [
      'Sreda, 7.10. Vodja odpre e-pošto, 31 novih sporočil. Nato koledar, tri stvari se prekrivajo. Nato seznam nalog v drugem orodju in odprte zadeve v tretjem. Ob osmih ve, kaj je danes, in še ni naredil ničesar.',
      'Objava za ta teden ni napisana, ker je vsako jutro pomembnejše nekaj drugega. Račun za opravljeno delo čaka od petka, ker nihče ne mara začeti s prazno stranjo.',
    ],
    practice: [
      'Ista sreda z AISOS. Ob sedmih je pregled dneva napisan: tri sestanke, štirje ljudje čakajo na odgovor, dva roka ta teden, en račun pripravljen. Vodja ga prebere ob kavi v treh minutah.',
      'Pod pregledom čakajo osnutki: odgovor stranki, objava po koledarju, račun po opravljenem delu. Vsak ima potrdi, popravi ali zavrni. Kar potrdi, gre naprej, kar zavrne, agenti naslednjič ne predlagajo več. Nič ne gre ven brez njegove potrditve, tudi če bi kdo narobe nastavil pravilo.',
    ],
    faq: [
      { q: 'Kaj vse agenti berejo?', a: 'Koledar, nabiralnik, naloge in odprte zadeve v orodjih, ki jih podjetje že uporablja. E-poštni agent samo bere in razvršča, ne pošilja.' },
      { q: 'Kako hitro je nov agent uporaben?', a: 'Prvi teden samo bere, drugi teden piše osnutke, ki jih vse pregleda človek. Ko so osnutki dovolj dobri, pregled pade na vzorec. Če se kakovost poslabša, gre agent po lestvi nazaj.' },
      { q: 'Ali AISOS lahko dobi tudi drugo podjetje?', a: 'AISOS najprej teče pri nas. Isto ogrodje, torej agenti, skupni spomin in vrsta za potrditev, uporabimo pri strankah, prilagojeno njihovim orodjem.' },
    ],
    detail: { src: '/pictures/aisos-detail', alt: 'Jutranji pregled dneva v AISOS s koledarjem, seznamom ljudi, ki čakajo na odgovor, roki in osnutki za potrditev.', caption: 'Pregled dneva ob sedmih: koledar, kdo čaka, kateri roki so blizu, in desno osnutki, ki čakajo na potrditev.' },
  },

  'inspectus-vldr': {
    before: [
      'Ladja je razložena v sredo. V četrtek zjutraj pregledovalec izvozi poročilo: 380 vrstic, vsaka vrstica ena škoda. Sodelavka jih začne združevati po vozilih v novi preglednici, pri tem iz opomb ročno briše razred, ki ga proizvajalec ne želi videti.',
      'Popoldne odpre obrazec proizvajalca in ga izpolnjuje vozilo za vozilom. Pri vozilu 140 zamenja dve številki VIN. Napaka gre v petek naprej k proizvajalcu in se vrne čez teden dni z vprašanjem.',
    ],
    practice: [
      'Ista sreda z orodjem VLDR. Pregledovalec spusti izvoz v brskalnik. Program vrstice združi po številki VIN, sestavi opombe po pravilu stranke in pripravi list za poročilo. Za vsako vozilo nastane kartica v obliki obrazca proizvajalca, vse kartice v enem arhivu. Traja nekaj sekund.',
      'Preden gre serija naprej, model napiše povzetek in preveri podatke: vozila brez opomb, dvojne številke, nenavadne vrednosti. Ekipa prebere povzetek, popravi, kar je treba, in pošlje. Obdelava je zapisana v Centru, tako da vsi delajo z isto različico orodja.',
    ],
    faq: [
      { q: 'Kaj se zgodi, če se pravilo proizvajalca spremeni?', a: 'Pravilo za opombe je v kodi na enem mestu in pokrito s testi. Spremeni se enkrat, velja za vse naslednje ladje.' },
      { q: 'Ali orodje potrebuje namestitev?', a: 'Ne. Teče v brskalniku na računalniku, prijava je z e-poštnim naslovom podjetja. Nova različica je za vse hkrati.' },
      { q: 'Koliko časa je prihranjenega?', a: 'Natančne številke ne objavljamo, ker je stranka ni izmerila. Kar vemo: ročno urejanje preglednic je odpadlo, obdelava serije 314 vozil traja nekaj sekund.' },
    ],
    detail: { src: '/pictures/inspectus-vldr-detail', alt: 'Kartica VLDR za eno vozilo v obliki obrazca proizvajalca in seznam obdelav v Centru.', caption: 'Ena kartica na vozilo, do piksla po obrazcu proizvajalca. Desno zgodovina obdelav v Centru, med njimi prva resnična serija s 314 vozili.' },
  },

  'inspectus-vin': {
    before: [
      'Ladja z dvesto vozili. Dva pregledovalca na pomolu, vsak s svojim telefonom, fotografirata tablico in nato škode, vozilo za vozilom. Do večera je na dveh telefonih več tisoč posnetkov, oštevilčenih tako, kot ju je oštevilčil telefon.',
      'Naslednji dan sodelavka odpira posnetke enega za drugim in ugiba, kje se konča eno vozilo in začne drugo. Če je pregledovalec tablico fotografiral dvakrat, je vozilo dvakrat. Če je pozabil, so škode pripisane sosednjemu.',
    ],
    practice: [
      'Ista ladja s filtrom VIN. Posnetki se uredijo po času zajema, zapisanem v fotografiji, ne po imenu datoteke. Dva telefona sta dva tokova. Bralnik na napravi prebere tablico in jo primerja z zaprtim seznamom vozil z ladje; kar prebere, odpre vozilo, posnetki za njim mu pripadajo do naslednje tablice.',
      'Ob koncu ima vsako vozilo svojo mapo in oceno zanesljivosti. Vozilo s seznama brez fotografij in tablica, ki je ni na seznamu, prideta v opozorila. Kar ostane nejasno, pristane v mapi Nerazvrščeno, kjer človek v minuti odloči. To je zasnova, preizkušena na testnih posnetkih; pilot na prvi ladji jo bo potrdil ali popravil.',
    ],
    faq: [
      { q: 'Ali gredo fotografije v oblak?', a: 'Branje poteka najprej na napravi. V oblak gredo samo posnetki, ki jih bralnik ne reši, in tudi ti brez shranjevanja. Na testnem naboru je bilo 29 od 30 posnetkov prebranih na napravi.' },
      { q: 'Kaj, če bralnik prebere napačno črko?', a: 'Prebrana številka se primerja s seznamom vozil z ladje. Program sme popraviti eno samo zamenljivo črko, in to le, če je popravek edini možen. Sicer gre posnetek v pregled.' },
      { q: 'Ali sistem že teče na resnični ladji?', a: 'Ne še. Zasnova in prototip razvrščanja sta narejena in preizkušena na testnih posnetkih, ponudba za uvedbo je iz avgusta 2026. Prvi pilot bo pokazal, kako se obnese na pomolu.' },
    ],
    detail: { src: '/pictures/inspectus-vin-detail', alt: 'Sedem korakov filtra VIN, posnetki v vrstnem redu zajema razvrščeni po vozilih, opozorila in mapa Nerazvrščeno.', caption: 'Sedem korakov od posnetka do vozila. Tablica odpre vozilo, posnetki za njo mu pripadajo, neujemanja v obe smeri gredo v opozorila.' },
  },

  'model-premazi': {
    before: [
      'Tehnolog ima idejo za novo recepturo: malo več polnila, malo manj veziva. Da bi vedel, ali bo barva še dovolj prekrivala in ali bo viskoznost še v mejah, jo mora zmešati, počakati in izmeriti štiri lastnosti, vsako po svojem standardu. To je dan ali dva dela.',
      'Od desetih idej jih pet ne pride v poštev že na papirju, če bi kdo imel številke. Ker jih nima, gredo vse v laboratorij, in dober teden je porabljen za slabe kandidate.',
    ],
    practice: [
      'Z modelom tehnolog vpiše deleže surovin in v sekundi dobi štiri napovedi: gostoto, suho snov, viskoznost in prekrivnost, vsako z intervalom. Gostota in suha snov sledita fiziki mešanja, model popravlja le odstopanje. Viskoznost ima širši interval in model to pove.',
      'Če v recepturi vpiše surovino, ki je model ne pozna, dobi zavrnitev z razlogom. Če je receptura preveč drugačna od vsega, kar je videl pri učenju, dobi zavrnitev s številko razdalje in mejo. Tako v laboratorij gredo samo kandidati, za katere je vredno mešati. Trenutno se model uči na sintetičnih družinah receptur; vsaka napoved je označena kot testna, dokler laboratorij ne vnese realnih meritev.',
    ],
    faq: [
      { q: 'Zakaj model kdaj odkloni odgovor?', a: 'Iz dveh razlogov: neznana surovina ali receptura predaleč od učnih podatkov. Odklon ima vedno razlog in številko. Model, ki bi samozavestno ugibal, bi bil slabši od nobenega.' },
      { q: 'Kako natančen je?', a: 'Na sintetičnih družinah receptur je gostota s fizikalnim sidrom na R² 0,999, brez fizike 0,91. Viskoznost brez realnih meritev še ni zanesljiva in model to pokaže s širšim intervalom. Številke z realnimi podatki bodo objavljene, ko bodo.' },
      { q: 'Kako se model uporablja?', a: 'Trenutno iz ukazne vrstice: tabele surovin, receptur in meritev v mapi, receptura v datoteki, odgovor kot besedilo. Aplikacija pride, ko bodo realni podatki.' },
    ],
    detail: { src: '/pictures/model-premazi-detail', alt: 'Napoved štirih lastnosti premaza z intervali zaupanja in dve zavrnitvi z razlogom.', caption: 'Štiri lastnosti z intervalom, ne le številka. Spodaj dve zavrnitvi: neznana surovina in receptura, ki je predaleč od učnih podatkov.' },
  },

  pacom: {
    before: [
      'Ponedeljek pri Pacomu. Direktorica ima v glavi trideset let strank, v telefonu tri neodgovorjena povpraševanja in na mizi ponudbo, ki jo bo napisala znova, ker je vsaka drugačna. Objava na Facebooku je bila zadnjič pred tremi tedni, ko je bil čas.',
      'Na Googlu je podjetje ocenjeno z desetimi ocenami, čeprav ima stranke, ki mu zaupajo že dvajset let. Nihče jih ni prosil.',
    ],
    practice: [
      'Isti ponedeljek z Business HQ. Vsako povpraševanje dobi enega od treh paketov, Pisarna, Dom ali Nova, z jasno ceno in garancijo. Ponudba je gotova v petih minutah, ker se ne piše znova.',
      'Koledar objav za trideset dni je napolnjen: ekipa, prej in potem, pričevanja. Vsebinski agent po koledarju pripravi osnutek objave in sporočila, direktorica ju potrdi ali popravi na telefonu. Vzporedno teče kampanja za ocene: klic petdesetim najboljšim strankam, trideset ocen v tridesetih dneh.',
    ],
    faq: [
      { q: 'Ali objave piše AI?', a: 'Osnutke pripravi vsebinski agent po koledarju in v tonu znamke. Vsako objavo pred objavo potrdi človek pri Pacomu. Nič ne gre ven samo.' },
      { q: 'Kaj so garancije v paketih?', a: 'Pisarna: vračilo mesečnega zneska, če ne pride ista oseba. Dom: rezervna kolegica, da storitev nikoli ne odpade. Nova: prihod v 48 urah ali popust. Garancije so del ponudbe, ker jih Pacom lahko izpolni.' },
      { q: 'Kje sistem teče?', a: 'V Notionu, ki ga ekipa že pozna: pregled znamke, segmenti, sekvence, koledar, naloge in banka idej na enem mestu. Brez novega orodja, ki bi ga bilo treba učiti.' },
    ],
    detail: { src: '/pictures/pacom-detail', alt: 'Koledar objav za en teden z osnutki agenta in potrjenimi objavami, ob njem trije paketi z garancijami.', caption: 'Teden v koledarju objav: rumeno so osnutki agenta, zeleno potrjene objave. Desno trije paketi, vsak z garancijo.' },
  },

  zalife: {
    before: [
      'Šola prosi za ponudbo. Sodelavka išče zadnjo različico predstavitve v treh mapah, logotip v četrti, cenik v sporočilu izpred meseca dni. Ponudbo napiše znova, ker prejšnje ne najde. Objava na Instagramu čaka, dokler ne bo časa.',
      'Na sestanku pade dobra ideja o delavnici za starše v podjetjih. Zapiše se v klepet in tam ostane.',
    ],
    practice: [
      'Isti dan z Business HQ. Ponudba za šolo je v seznamu ponudb, s ceno in opombami, pripravljena za pošiljanje v nekaj minutah. Logotipi, predstavitve in fotografije so v eni mapi z opisom, kdaj se kaj uporabi. Nov sodelavec prebere pregled znamke in v pol ure ve, komu je program namenjen in kaj obljublja.',
      'Ideja o delavnici za starše zaposlenih gre v banko idej z oceno in naslednjim korakom. Čez dva tedna je iz nje nastala ponudba za podjetja. Koledar objav ima stanje od ideje do objavljeno, zato je vidno, kaj manjka ta teden.',
    ],
    faq: [
      { q: 'Kaj je Business HQ?', a: 'En prostor v Notionu s pregledom znamke, ponudbami, koledarjem objav, seznamom nalog in banko idej. Isto ogrodje, kot ga uporabljamo za druge stranke, prilagojeno programu za najstnike.' },
      { q: 'Ali AI piše objave tudi tukaj?', a: 'Lahko pripravi osnutek po koledarju, ko ekipa to želi. Vsako objavo potrdi človek. Pri ZaLife je poudarek najprej na redu: ena mapa, en koledar, ena resnica o znamki.' },
      { q: 'Kaj se je zgodilo z idejo za podjetja?', a: 'Iz banke idej je nastala ponudba: delavnica za starše zaposlenih kot del skrbi za zaposlene. To je primer, kako sistem spremeni idejo iz klepeta v ponudbo z naslednjim korakom.' },
    ],
    detail: { src: '/pictures/zalife-detail', alt: 'Business HQ za ZaLife s pregledom znamke, ponudbami, banko idej in mapo sredstev znamke.', caption: 'Pregled znamke, ponudbe za šole, starše in podjetja, banka idej z ocenami in sredstva znamke, vse na eni strani.' },
  },

  elementum: {
    before: [
      'Sobota, 22.40. Obiskovalec na spletni strani bere o naložbenem zlatu in ima tri vprašanja: razlika med palico in kovancem, ali je zlato obdavčeno, kako poteka hramba. Napiše sporočilo. Odgovor dobi v ponedeljek dopoldne, ko je že kupil drugje.',
      'V ponedeljek zjutraj vsak svetovalec pol ure pregleduje cene, novice in konkurenco, preden lahko začne z delom. Isti pregled, trikrat.',
    ],
    practice: [
      'Ista sobota s svetovalcem na spletni strani. Obiskovalec vpraša o hrambi in v nekaj sekundah dobi odgovor iz potrjenih virov, z navedbo strani, na kateri piše več. Ko vpraša, ali naj kupi zdaj, svetovalec pove, da o tem ne svetuje, in ponudi pogovor s človekom. Obiskovalec pusti ime in telefon.',
      'V ponedeljek ob sedmih ima svetovalec v nabiralniku povpraševanje s povzetkom sobotnega pogovora in ob osmih tržni pregled: cene zlata in srebra, tri novice, dva premika pri konkurenci. Dan se začne s klicem, ne z brskanjem.',
    ],
    faq: [
      { q: 'Ali svetovalec daje naložbene nasvete?', a: 'Ne. Odgovarja samo o tem, kar piše v potrjenih virih: vrste izdelkov, hramba, postopek nakupa in odkupa, davki po objavljenih pravilih. O tem, kdaj kupiti, ne svetuje in to jasno pove.' },
      { q: 'Kaj se zgodi s povpraševanjem?', a: 'Svetovalec zbere ime, kontakt in kratek povzetek pogovora in ga preda svetovalcu, ne v splošni nabiralnik. Svetovalec pokliče s pripravljenim ozadjem.' },
      { q: 'Od kod so podatki v jutranjem pregledu?', a: 'Iz virov, ki jih je ekipa prej pregledovala ročno: cene, novice in strani konkurence. Agent jih strne v pregled, ki ga ekipa prebere v petih minutah.' },
    ],
    detail: { src: '/pictures/elementum-detail', alt: 'Spletni svetovalec Elementum odgovori o hrambi zlata z navedbo vira in ponudi klic svetovalca, ob njem jutranji tržni pregled.', caption: 'Odgovor z virom in ponudba, da pokliče svetovalec. Levo jutranji tržni pregled, ki ga ekipa prebere ob kavi.' },
  },

  'tower-spa': {
    before: [
      'Petek zvečer v stolpu. Ena oseba skrbi za goste v savni, medtem ko telefon zvoni in na Instagramu čakajo štiri sporočila o prostih terminih za soboto. Odgovori pridejo ob enajstih, ko sta dva gosta že rezervirala drugje.',
      'V soboto ob dvanajstih odpove par, ki je imel termin ob petih. Termin ostane prazen, ker ni časa, da bi ga kdo ponudil naprej.',
    ],
    practice: [
      'Isti petek z asistentom. Gost napiše, da bi v soboto rad savno za dva. Asistent ponudi tri proste termine iz koledarja, gost izbere sedemnajsto uro, dobi potrditev s paketom, ceno in hišnimi pravili. V petek ob petih dobi opomnik.',
      'Odpoved v soboto opoldne asistent sprejme v enem koraku, termin sprosti in ga ponudi gostoma s čakalnega seznama. Vprašanje skupine dvanajstih oseb za rojstni dan ne ugiba: zbere podatke in jih preda lastniku s povzetkom.',
    ],
    faq: [
      { q: 'V katerih jezikih asistent odgovarja?', a: 'V slovenščini in angleščini, glede na jezik gosta. Ponudbo, cene in hišna pravila bere iz enega vira, ki ga ureja ekipa.' },
      { q: 'Ali lahko rezervacijo tudi spremeni ali odpove?', a: 'Da. Odpoved je en korak, sproščen termin gre gostom s čakalnega seznama. Spremembo termina asistent uredi enako kot novo rezervacijo.' },
      { q: 'Kaj gre k lastniku?', a: 'Skupine, dogodki in posebne želje, torej vse, česar ni v ponudbi. Lastnik dobi povzetek pogovora in kontakt, ne odprtega klepeta.' },
    ],
    detail: { src: '/pictures/tower-spa-detail', alt: 'Rezervacija savne v klepetu na telefonu s potrditvijo in opomnikom, ob njej povpraševanje skupine, predano lastniku.', caption: 'Gost izbere termin v klepetu in dobi potrditev z opomnikom. Desno povpraševanje za skupino, ki gre k lastniku s povzetkom.' },
  },

  'asya-grafy': {
    before: [
      'Obiskovalka spletne trgovine ima suho, občutljivo kožo in rdečico. Na strani je šestnajst izdelkov z dobrimi opisi. Prebere tri, se ne odloči in napiše sporočilo. Ekipa odgovori naslednji dan, ko je zavihek že zaprt.',
      'V nabiralniku je vsak teden isto: kateri izdelek zame, v kakšnem vrstnem redu, ali se ta dva skladata. Med njimi tudi vprašanje o rozacei, na katero ekipa ne sme odgovoriti.',
    ],
    practice: [
      'Ista obiskovalka s svetovalcem. Napiše, kakšno kožo ima, svetovalec vpraša še dvoje in sestavi rutino: tri koraki zjutraj, trije zvečer, pri vsakem izdelku razlog v enem stavku. Vsak izdelek gre v košarico z enim klikom. Vse iz dokumentacije inštituta, nič izmišljenega.',
      'Ko vpraša o rozacei, svetovalec prijazno pove, da je to vprašanje za strokovnjakinjo, in ga preda naprej s povzetkom. Odgovor pride v enem dnevu, obiskovalka pa medtem že ima rutino za občutljivo kožo.',
    ],
    faq: [
      { q: 'Od kod svetovalec ve, kaj priporočiti?', a: 'Samo iz dokumentacije izdelkov in navodil inštituta: sestavine, namen, uporaba, opozorila. Ko inštitut dokument posodobi, se posodobijo tudi odgovori.' },
      { q: 'Kaj se zgodi z zdravstvenimi vprašanji?', a: 'Svetovalec jih prepozna, jih ne odgovarja in jih preda človeku s povzetkom. Vprašanja o boleznih, zdravilih in nosečnosti so vedno pri človeku.' },
      { q: 'Ali svetovalec sili v nakup?', a: 'Ne. Predlaga rutino z razlogi, v košarico gre samo tisto, kar obiskovalec sam klikne. Priporočila so dosledna, ker vsi berejo isto dokumentacijo.' },
    ],
    detail: { src: '/pictures/asya-grafy-detail', alt: 'Priporočena jutranja in večerna rutina za nego kože z razlogi in gumbi za košarico, ob njej predano zdravstveno vprašanje.', caption: 'Rutina za jutro in večer, vsak korak z razlogom in gumbom v košarico. Spodaj vprašanje, ki je šlo k človeku.' },
  },

  'si-big': {
    before: [
      'Osem zjutraj v pisarni SI-BIG. Svetovalka odpre portale za razpise v Srbiji, Bosni in Makedoniji, nato zbornične novice, nato iskanja partnerjev. Bere v treh jezikih in za vsako od enajstih strank presoja, ali je kaj zanjo. Ob enajstih je pri polovici virov in začne pravo delo.',
      'Ko je teden gost, viri počakajo. Razpis z rokom v ponedeljek se pokaže v torek.',
    ],
    practice: [
      'Isto jutro s sistemom. Ob sedmih je seznam pripravljen: dvainštirideset pregledanih virov, devet zadetkov, razvrščenih po strankah, vsak z oceno in razlogom v enem stavku, v jeziku stranke. Svetovalka ga prebere ob kavi, dva zadetka črta, sedem z enim klikom pošlje naprej.',
      'Kar je črtala, sistem upošteva pri naslednjem pregledu, zato podobnih zadetkov ne ponuja več. Nov vir se doda brez programiranja. Nobena stranka ni odvisna od tega, ali je bil dan miren.',
    ],
    faq: [
      { q: 'Katere vire sistem spremlja?', a: 'Portale za razpise, zbornice, iskanja partnerjev in novice na šestih trgih. Nov vir se doda v seznam, brez programiranja.' },
      { q: 'Kako ve, kaj je za katero stranko?', a: 'Vsaka stranka ima svoja merila: panogo, države, velikost, rok. Vsak zadetek dobi oceno in razlog. Črtani zadetki znižajo oceno podobnih pri naslednjem pregledu.' },
      { q: 'Ali gre kaj strankam brez pregleda?', a: 'Ne. Seznam pregleda svetovalka in pošlje samo, kar potrdi. Sistem pripravlja, človek odloča.' },
    ],
    detail: { src: '/pictures/si-big-detail', alt: 'Jutranji seznam zadetkov po strankah s trgi, ocenami in razlogi ter gumbi za pošiljanje ali črtanje.', caption: 'Jutranji seznam po strankah: trg, ocena in razlog za vsak zadetek, pošlji ali črtaj z enim klikom.' },
  },

  heva: {
    before: [
      'Torek, 7.12. V nabiralnik upravnika pride sporočilo: v kleti pušča cev pri števcih, voda je na tleh. Sporočilo prebere ob devetih, ga prepiše v nalog, pokliče dva monterja, prvi je zaseden. Ob enajstih je nalog dodeljen, klet pa je pod vodo že štiri ure.',
      'Ob koncu tedna pisarna prepisuje opravljeno delo iz sporočil in listkov v račune. Ena ura za dvigalo je pozabljena, en račun gre napačnemu naslovu.',
    ],
    practice: [
      'Isti torek s sistemom. Sporočilo ob 7.12 asistent prebere, prepozna stavbo, težavo in nujnost, ustvari nalog in predlaga prostega monterja ob devetih. Dispečer ob 7.30 predlog potrdi na telefonu. Monter ima nalog s podatki, naslovom in fotografijami v žepu.',
      'Po opravljenem delu monter označi porabljeni material in čas. Iz tega nastane osnutek računa v računovodskem sistemu, pisarna ga samo potrdi. Podatki so bili vneseni enkrat, na začetku, in so potovali do računa.',
    ],
    faq: [
      { q: 'Kako sistem bere telefonske klice?', a: 'Iz prepisa klica. Asistent iz besedila prepozna naslov, težavo in nujnost enako kot iz e-pošte, ob nalogu pa ostane izvirno sporočilo.' },
      { q: 'Kaj, če asistent prijave ne razume?', a: 'Vsaka prepoznava ima stopnjo zaupanja. Nejasne prijave gredo dispečerju v pregled z izvirnim sporočilom, ne v nalog z ugibanjem.' },
      { q: 'Ali gredo računi ven sami?', a: 'Nastane osnutek iz opravljenega dela. Potrdi ga pisarna. Tako ostane pregled nad tem, kaj se zaračuna, brez prepisovanja.' },
    ],
    detail: { src: '/pictures/heva-detail', alt: 'Delovni nalog na monterjevem telefonu s fotografijami in poljem za material in čas, ob njem osnutek računa, ki čaka na potrditev.', caption: 'Nalog na telefonu z naslovom, fotografijami in materialom. Desno osnutek računa, ki je nastal iz istih podatkov.' },
  },

  epolac: {
    before: [
      'Gradbišče ob sedmih zvečer. Izvajalec ima v rokah primer z dvokomponentnim temeljnim premazom in vprašanje: koliko redčiti za brezzračno brizganje. Tehnični list je nekje v e-pošti. Pokliče tehnično službo, ki ima že konec delovnika. Vprašanje enako kot prejšnji teden, samo druga oseba.',
      'Naslednji dan tehnolog odgovori na dvanajst takih vprašanj v angleščini in hebrejščini in za razvoj ne ostane časa.',
    ],
    practice: [
      'Isti večer z asistentom. Izvajalec vpraša v angleščini in v nekaj sekundah dobi korake za redčenje, s točnim izdelkom, listom in odstavkom, iz katerega je odgovor vzet. Vpiše površino, podlago in število nanosov in dobi porabo ter predlog pakiranja. Distributer v Tel Avivu naslednji dan vpraša isto v hebrejščini in dobi odgovor v hebrejščini.',
      'Vprašanje o ceni za projekt asistent ne odgovarja: zbere podatke in jih preda prodaji s povzetkom. Tehnična služba enkrat na teden pregleda pogovore in popravi list, kjer je bil odgovor slab. Popravek lista popravi vse prihodnje odgovore.',
    ],
    faq: [
      { q: 'Od kod asistent jemlje odgovore?', a: 'Samo iz tehničnih in varnostnih listov, ki jih vzdržuje tehnična služba. Vsak odgovor navede izdelek, dokument in odstavek. Kar ni v listih, asistent ne izmisli.' },
      { q: 'Kako deluje izračun porabe?', a: 'Iz površine, podlage in števila nanosov in teoretične porabe z lista izračuna količino in predlaga pakiranje. Izvajalec vidi račun, ne le številko.' },
      { q: 'Zakaj cene in projekti gredo prodaji?', a: 'Ker so odvisni od količin, pogodb in rokov, ki jih list ne pozna. Prodaja dobi povpraševanje s povzetkom pogovora, ne z golim kontaktom.' },
    ],
    detail: { src: '/pictures/epolac-detail', alt: 'Odgovor tehničnega asistenta v angleščini z navedbo tehničnega lista, izračun porabe in vrstica v hebrejščini.', caption: 'Odgovor z virom v angleščini, izračun porabe iz površine in nanosov, in ista storitev v hebrejščini.' },
  },
};
