/**
 * Case studies: one per project on /produkti/, same ids.
 *
 * The product record (name, kind, client, picture) lives in showcase.mjs;
 * this file holds only the story. Four fixed parts on every page: the
 * problem, what we built, the parts of the system, what changed. Copy is
 * short, concrete and free of dashes, like the rest of the site.
 *
 * Sources. ATHLOS, AIS Command, AISOS, both INSPECTUS projects and the
 * coatings model are written from their repositories; Pacom and ZaLife from
 * the Business HQ in Notion. The last six (Elementum, Tower Spa Celje,
 * Dr. Asya Grafy, SI-BIG, HEVA, Epolac) are drafted without source material,
 * like their product entries, and carry `draft: true`. Ian confirms or
 * corrects them before the site goes live. Nothing here claims a wearable
 * sync, a payment flow or a production launch that the code does not have.
 */

export const caseStudies = {
  eyebrow: 'Študije primerov',
  title: 'Kako so nastali',
  lead: 'Vsak projekt s te spletne strani, opisan od težave do sistema, ki teče. Kaj je bilo narobe, kaj smo zgradili in kaj se je spremenilo.',
  metaTitle: 'Študije primerov: AI sistemi, ki smo jih zgradili | AIS Slovenia',
  metaDescription:
    'Štirinajst študij primerov AIS Slovenia: lastni izdelki in sistemi za stranke, od avtomatizacije dokumentov v pristanišču do AI svetovalcev in agentnih sistemov.',
  answer:
    'AIS Slovenia je zgradil štirinajst sistemov: tri lastne izdelke (ATHLOS, AIS Command, AISOS) in enajst projektov za stranke, od avtomatizacije dokumentov za INSPECTUS do AI svetovalcev, asistentov za rezervacije in spremljanja trga. Vsaka študija pove, kaj je bilo prej, kaj smo naredili in kaj se je spremenilo.',

  items: [
    /* ── Lastni izdelki ─────────────────────────────────────────────── */
    {
      id: 'athlos',
      metaTitle: 'ATHLOS, športni operacijski sistem | Študija primera',
      metaDescription:
        'Kako smo zgradili ATHLOS: aplikacijo za športnike, nadzorno ploščo za trenerje in AI trenerja ZEUS, ki sme spremeniti trening le s privoljenjem športnika.',
      keywords: ['ATHLOS', 'športna aplikacija', 'AI trener', 'ocena pripravljenosti', 'aplikacija za trenerje'],
      summary:
        'Ena aplikacija za športnika, ena za trenerja, ista baza. Vmes AI trener, ki sme spremeniti trening samo, če športnik to dovoli, in vsako spremembo je mogoče razveljaviti.',
      facts: [
        { term: 'Stranka', definition: 'Lastni izdelek' },
        { term: 'Panoga', definition: 'Šport, treniranje ekip in posameznikov' },
        { term: 'Vrsta', definition: 'SaaS izdelek' },
        { term: 'Obseg', definition: 'Aplikacija za športnike, nadzorna plošča za trenerje, AI trener ZEUS' },
        { term: 'Stanje', definition: 'V uporabi, javna različica' },
      ],
      challenge: [
        'Trener ima treninge v preglednicah in sporočilih. Športnik zjutraj ne ve, kaj ga čaka, in po treningu nihče ne izve, kako je šlo. Obremenitev cele ekipe vidi samo tisti, ki jo ročno sešteva.',
        'AI trener v aplikaciji je zanimiv samo, če ne more ničesar pokvariti. Model, ki bi športniku sam spreminjal serije in bremena, je večja težava kot rešitev.',
      ],
      build: [
        'Ena koda, dve aplikaciji, ena baza. Športnik dobi spletno aplikacijo za telefon, trener nadzorno ploščo, oboje bere in piše v isto bazo z dostopom, omejenim na vrstico. Ključi do modelov nikoli ne zapustijo strežnika.',
        'ZEUS ne piše v trening neposredno. Model predlaga spremembe v strogi obliki, program jih preveri po pravilih in zavrne vse, kar ni jasno: neznana vaja, serije zunaj 1 do 12, ponovitve zunaj 1 do 300, breme zunaj 0 do 500 kg. Kar je zavrnjeno, se ne zaokroži, ampak ostane, kot je bilo.',
      ],
      parts: [
        { name: 'Aplikacija za športnika', body: 'Danes, koledar, skupnost in profil. Trening se izvaja po blokih, jutranji check-in vpraša po spanju, energiji, bolečinah in stresu.' },
        { name: 'Ocena pripravljenosti', body: 'Uteži za okrevanje, počutje, hitrost, prehrano in hidracijo. Manjkajoči vnos izpade in uteži se prerazporedijo. Nad 70 poln trening, 40 do 69 lažji, pod 40 počitek.' },
        { name: 'Nadzorna plošča za trenerja', body: 'Sestavljalnik treningov iz lastne knjižnice in predlog, pregled ekipe, klub in sezona na enem mestu.' },
        { name: 'ZEUS s privoljenjem', body: 'Športnik izbere: vsako spremembo potrdi, da stalno dovoljenje ali AI urejanje izklopi. Vsaka sprememba se zapiše s stanjem prej in potem.' },
        { name: 'Razveljavitev', body: 'Športnik razveljavi spremembo na isti kartici, trener pa za vsakogar v svoji ekipi. Trenerjevih opomb model ne more prepisati, to varuje sprožilec v bazi.' },
      ],
      outcome: [
        'Športnik odpre aplikacijo in ve, kaj je danes in koliko je pripravljen.',
        'Trener sestavi teden iz svoje knjižnice namesto iz preglednic in vidi obremenitev cele ekipe.',
        'Vsak poseg AI trenerja je zabeležen, potrjen in razveljavljiv.',
        'Nobenega ključa v aplikaciji: modeli tečejo za strežniško funkcijo, podatki pod dostopom po vrsticah.',
      ],
      tools: ['React 19', 'Vite', 'Supabase', 'Claude', 'Gemini kot rezerva', 'Vercel', 'PWA'],
      draft: false,
    },
    {
      id: 'ais-command',
      metaTitle: 'AIS Command, CRM in portal za stranke | Študija primera',
      metaDescription:
        'Kako smo zgradili AIS Command: CRM, projekte, storitve in račune za ekipo, portal za stranko in agente, ki predlagajo naslednje korake, a ničesar ne pošljejo sami.',
      keywords: ['AIS Command', 'CRM za agencijo', 'portal za stranke', 'agentni sistem', 'avtomatsko zaračunavanje'],
      summary:
        'CRM in portal za stranke na eni bazi. Agenti v ozadju predlagajo naslednje korake, opomnike in mesečne račune, človek jih potrdi in šele takrat gre kaj ven.',
      facts: [
        { term: 'Stranka', definition: 'Lastni izdelek' },
        { term: 'Panoga', definition: 'Agencije in storitvena podjetja' },
        { term: 'Vrsta', definition: 'SaaS izdelek' },
        { term: 'Obseg', definition: 'Interni CRM, portal za stranke, agentno izvajalno okolje, zaračunavanje' },
        { term: 'Stanje', definition: 'Pred zagonom, prvi pilot v pripravi' },
      ],
      challenge: [
        'Majhna ekipa ima stranke v enem orodju, projekte v drugem, račune v tretjem. Ko stranka vpraša, kje smo, nekdo pol ure zbira odgovor. Mesečni računi za storitve nastajajo ročno in vedno malo prepozno.',
        'Agenti, ki bi to reševali, so uporabni le, če jim ni treba zaupati. Vsak korak, ki gre k stranki, mora ostati v človeških rokah.',
      ],
      build: [
        'Ena baza z dostopom po vrsticah, nad njo dva vmesnika. Interni del pokriva stranke, delo, nabiralnik, agente, račune, stroške in vrednost. Portal je narejen najprej za telefon in stranki pokaže projekte, stanje storitev v navadnem jeziku, račune in plačilo.',
        'Agentno okolje ima osem delavcev in enega pregledovalca, ki nastopa kot šest vodij. Vsi samo predlagajo. Izvedejo se le tri vrste dejanj, in to po potrditvi: naslednji korak pri poslu, izdaja računa in opomin za plačilo. Vsako se pred izvedbo znova preveri in ob odstopanju zavrne.',
      ],
      parts: [
        { name: 'Interni del', body: 'Pregled, stranke s celotno sliko, posli, projekti in storitve, podpora, računi, stroški, vrednost in ekipa.' },
        { name: 'Portal za stranko', body: 'Projekti z napredkom, zdravje storitev z dosegljivostjo zadnjih 30 dni, mesečnim obsegom in zadnjim pregledom, računi in plačilo s kartico.' },
        { name: 'Agentno okolje', body: 'Jutranji utrip ob 6.45 in agenti ob 7.00. Zbiralec zamud, prodajni lijak, marža, dostava, zanesljivost, povpraševanje in zaračunavanje.' },
        { name: 'Zaračunavanje', body: 'Mesečne ponavljajoče se postavke se ustvarijo kot osnutki neposredno v bazi. Objava in pošiljanje ostaneta človeški korak.' },
        { name: 'Varovala', body: 'Plačilo je plačano šele po preverjenem obvestilu ponudnika. Opomin brez imenovanega odobritelja se ne pošlje. Test potrjuje, da nič načrtovanega ne doseže pošiljatelja samo od sebe.' },
      ],
      outcome: [
        'Ena resnica o stranki: odnos, posli, projekti in računi na enem mestu.',
        'Stranka vidi stanje brez klica, na telefonu, v jeziku brez žargona.',
        'Mesečni računi so pripravljeni kot osnutki, preden se kdo spomni nanje.',
        'Nič ne gre ven brez odobritve, in to je preverjeno v kodi, ne obljubljeno v dokumentu.',
      ],
      tools: ['Next.js 16', 'React 19', 'TypeScript', 'Supabase', 'Stripe', 'Claude', 'Composio', 'Vercel'],
      draft: false,
    },
    {
      id: 'aisos',
      metaTitle: 'AISOS, agentni operacijski sistem podjetja | Študija primera',
      metaDescription:
        'Kako deluje AISOS: agenti vsako jutro pripravijo pregled dneva iz koledarja, e-pošte in nalog, osnutke vsebin in računov ter povedo, kaj potrebuje človeka.',
      keywords: ['AISOS', 'agentni operacijski sistem', 'AI agenti za podjetje', 'jutranji pregled', 'avtomatizacija pisarne'],
      summary:
        'Agenti vsako jutro preberejo koledar, e-pošto in naloge, pripravijo pregled dneva ter osnutke vsebin in računov. Kar gre ven, potrdi človek.',
      facts: [
        { term: 'Stranka', definition: 'Lastni izdelek, najprej za lastno podjetje' },
        { term: 'Panoga', definition: 'Vodenje malega podjetja' },
        { term: 'Vrsta', definition: 'Agentni sistem' },
        { term: 'Obseg', definition: 'Jutranji pregled, osnutki, naloge za človeka, potrjevanje' },
        { term: 'Stanje', definition: 'V lastni uporabi' },
      ],
      challenge: [
        'Dan v malem podjetju se začne z branjem: koledar, nabiralnik, naloge iz treh orodij. Preden kdo kaj naredi, mine ura. Vsebine in računi čakajo, ker nihče nima časa začeti s prazno stranjo.',
        'Popolnoma samodejen sistem bi pošiljal napačne stvari pravim ljudem. Potrebovali smo sistem, ki dela pripravo, ne odločitev.',
      ],
      build: [
        'AISOS je pet agentov s skupnim spominom o podjetju: za e-pošto, koledar, projekte, znanje in datoteke. Vsako jutro ob sedmih preberejo koledar, nabiralnik, naloge in odprte zadeve, iz tega sestavijo pregled dneva in seznam stvari, ki potrebujejo človeka, razvrščen po nujnosti.',
        'Ob tem pripravijo osnutke: odgovore na e-pošto, objave, račune. Vsak osnutek čaka v vrsti za potrditev. Agent ne more ničesar poslati, objaviti ali izdati. To ni nastavitev, ki bi jo bilo mogoče vklopiti, ampak meja v kodi.',
      ],
      parts: [
        { name: 'Pet agentov', body: 'E-pošta bere in razvršča, samo bere. Koledar pozna dan. Projekti spremljajo odprte zadeve. Znanje odgovarja iz zapiskov. Datoteke urejajo mape na računalniku.' },
        { name: 'Jutranji pregled ob 7.00', body: 'Kaj je danes, kdo čaka na odgovor, kateri roki so blizu. Ena stran, prebrana ob kavi.' },
        { name: 'Osnutki', body: 'Odgovori na sporočila, objave po koledarju in računi po opravljenem delu. Napisani v tonu podjetja iz skupnega spomina.' },
        { name: 'Vrsta za potrditev', body: 'Vsak predlog ima potrdi, popravi ali zavrni. Zavrnjeni predlogi učijo agente, česa ne predlagati več.' },
        { name: 'Lestev zaupanja', body: 'Nov agent prvi teden samo bere. Drugi teden piše osnutke, ki jih vse pregleda človek. Šele ko so dovolj dobri, pregled pade na vzorec, in če se kakovost poslabša, gre agent po lestvi nazaj.' },
        { name: 'Spomin', body: 'Stranke, projekti, dogovori in ton v enem trezorju zapiskov. Agenti berejo isto resnico kot ljudje, zato ne ugibajo.' },
      ],
      outcome: [
        'Dan se začne s pregledom namesto z branjem treh nabiralnikov.',
        'Vsebine in računi so pripravljeni kot osnutki, ekipa jih samo potrdi ali popravi.',
        'Nič ne gre ven brez potrditve, tudi ko se kdo zmoti pri nastavitvah.',
      ],
      tools: ['Claude', 'n8n', 'Google Workspace', 'Notion', 'GitHub', 'Obsidian'],
      draft: false,
    },

    /* ── Za stranke ─────────────────────────────────────────────────── */
    {
      id: 'inspectus-vldr',
      metaTitle: 'INSPECTUS VLDR: kartice za pregled vozil | Študija primera',
      metaDescription:
        'Kako iz izvoza poročila o škodah v nekaj sekundah nastanejo urejena preglednica po vozilih in kartica VLDR za vsako vozilo v obliki, ki jo zahteva proizvajalec.',
      keywords: ['INSPECTUS', 'VLDR', 'pregled vozil v pristanišču', 'avtomatizacija dokumentov', 'Luka Koper'],
      summary:
        'Iz izvoza poročila o škodah v nekaj sekundah nastanejo urejena preglednica po vozilih in kartica VLDR za vsako vozilo, v obliki, ki jo zahteva proizvajalec.',
      facts: [
        { term: 'Stranka', definition: 'INSPECTUS, pregled vozil v pristanišču Koper' },
        { term: 'Panoga', definition: 'Logistika, pregled novih vozil ob razkladanju ladij' },
        { term: 'Vrsta', definition: 'Avtomatizacija dokumentov' },
        { term: 'Obseg', definition: 'Spletno orodje, Center s prijavo in zgodovino obdelav, preverjanje z AI' },
        { term: 'Stanje', definition: 'V uporabi od julija 2026' },
      ],
      challenge: [
        'Po vsaki ladji ekipa izvozi poročilo o pregledu, kjer je vsaka vrstica ena škoda. Prva resnična serija je imela 380 vrstic za 314 vozil. Te vrstice je bilo treba združiti po vozilih, iz opomb izločiti tisto, česar proizvajalec ne želi videti, in za vsako vozilo izpolniti obrazec proizvajalca.',
        'Vse to je potekalo ročno v preglednicah. Pravilo za opombe je živelo v glavah, obrazec se je izpolnjeval vozilo za vozilom in vsaka napaka je šla naprej k proizvajalcu.',
      ],
      build: [
        'Orodje teče v brskalniku. Ekipa vanj spusti izvoz, program vrstice združi po številki VIN, sestavi opombe po pravilu stranke in pripravi list za poročilo s sedmimi mesti za škode v vrstici in nadaljevalnimi vrsticami, ko jih je več.',
        'Iz istih podatkov nastane kartica VLDR za vsako vozilo, natančna kopija obrazca proizvajalca s štiriindvajsetimi mesti za škode, vse kartice pa v enem arhivu. Nad tem teče model, ki pripravi povzetek serije, preveri podatke in odgovarja na vprašanja o njih. Center dodaja prijavo z e-poštnim naslovom podjetja in zgodovino vseh obdelav.',
      ],
      parts: [
        { name: 'Uvoz in združevanje', body: 'Poročilo o pregledu se prebere neposredno iz preglednice, vrstice se združijo po vozilih.' },
        { name: 'Pravilo za opombe', body: 'Samostojni razred Damage se nikoli ne izpiše, opažanja in vozila brez škod pa. Pravilo je v kodi in popravljeno na en sam kraj.' },
        { name: 'Kartice VLDR', body: 'Ena kartica na vozilo, oblika obrazca proizvajalca do piksla, izvoz v sliko in skupen arhiv.' },
        { name: 'Preverjanje z AI', body: 'Povzetek serije, preverjanje podatkov in klepet o seriji z znanjem o postopku, ki je predpomnjeno.' },
        { name: 'Center', body: 'Prijava, zgodovina obdelav in ena različica orodja za vse, da si kopije ne razidejo.' },
      ],
      outcome: [
        'Serija 314 vozil da 314 vrstic za poročilo in 314 kartic v eni potezi, kar je bilo julija 2026 prvič narejeno na resničnih podatkih.',
        'Ročno urejanje preglednic je odpadlo, obdelava traja nekaj sekund.',
        'Pravilo za opombe je zapisano v kodi in preverjeno s testi, ne več v spominu ekipe.',
        'Ekipa dela v brskalniku na računalniku, po vsaki ladji, s prijavo podjetja.',
      ],
      tools: ['JavaScript', 'SheetJS', 'html2canvas', 'Claude Sonnet', 'Next.js', 'Supabase', 'Vercel'],
      draft: false,
    },
    {
      id: 'inspectus-vin',
      metaTitle: 'INSPECTUS VIN filter: fotografije po vozilih | Študija primera',
      metaDescription:
        'Prototip filtra, ki fotografije s pomola razvrsti po vozilih: tablica z VIN odpre vozilo, posnetki za njo mu pripadajo, rezultat se preveri proti ladijskemu seznamu.',
      keywords: ['INSPECTUS', 'VIN', 'razvrščanje fotografij', 'OCR', 'pregled vozil'],
      summary:
        'Prototip filtra, ki fotografije s pomola razvrsti po vozilih: tablica z VIN odpre vozilo, posnetki za njo mu pripadajo, rezultat se v obe smeri preveri proti ladijskemu seznamu.',
      facts: [
        { term: 'Stranka', definition: 'INSPECTUS, pregled vozil v pristanišču Koper' },
        { term: 'Panoga', definition: 'Logistika, dokumentiranje škod na vozilih' },
        { term: 'Vrsta', definition: 'Avtomatizacija' },
        { term: 'Obseg', definition: 'Zasnova sedmih korakov, delujoč prototip razvrščanja, ponudba za uvedbo' },
        { term: 'Stanje', definition: 'Prototip, preizkušen na testnih posnetkih, pilot na prvi ladji sledi' },
      ],
      challenge: [
        'Pregledovalci na pomolu fotografirajo vsako vozilo: najprej tablico s številko VIN, nato škode. Na ladjo pride več tisoč posnetkov z dveh telefonov. Razvrščanje po vozilih poteka ročno in za nazaj, ko nihče več ne ve, kateri posnetek sodi h kateremu vozilu.',
        'Napačno razvrščena fotografija pomeni škodo, pripisano napačnemu vozilu. Rešitev mora biti prepričana, ali pa mora vprašati.',
      ],
      build: [
        'Filter dela v sedmih korakih: vrstni red iz časa zajema v posnetku, ne iz imena datoteke, vrsta posnetka, branje VIN, razvrščanje, primerjava z ladijskim seznamom, ocena zanesljivosti in zapis vozila. Dva telefona sta dva ločena tokova, posnetek brez časa nima mesta v zaporedju.',
        'Branje poteka najprej na napravi. Prebrana številka se primerja z zaprtim seznamom vozil z ladje, zato sme program popraviti eno samo zamenljivo črko, in to le, če je popravek edini možen. Šele nerešeni posnetki gredo v oblak. Opozorila tečejo v obe smeri: VIN, ki ga ni na seznamu, in vozilo s seznama brez fotografij. Kar ostane, pristane v mapi Nerazvrščeno za človeka.',
      ],
      parts: [
        { name: 'Vrstni red iz posnetka', body: 'Čas zajema iz fotografije določa zaporedje, sistem datotek ni zaupanja vreden.' },
        { name: 'Branje VIN na napravi', body: 'Odprtokodni bralnik v brskalniku, primerjava z zaprtim seznamom, samo nerešeno gre v oblak.' },
        { name: 'Razvrščanje', body: 'Tablica odpre vozilo, posnetki za njo mu pripadajo, do naslednje tablice.' },
        { name: 'Preverjanje proti seznamu', body: 'Neujemanja v obe smeri dobi človek, s posnetkom in razlogom.' },
        { name: 'Zanesljivost', body: 'Vsaka razvrstitev nosi oceno; nizka ocena pomeni pregled, ne ugibanje.' },
      ],
      outcome: [
        'Na testnem naboru je bilo 29 od 30 posnetkov prebranih na napravi, brez pošiljanja v oblak.',
        'Zasnova je potrjena s 49 avtomatskimi testi in ponudbo za uvedbo iz avgusta 2026.',
        'Bralnik še ni bil preizkušen na resničnih fotografijah z ladje; to je naloga pilota, ne obljuba te strani.',
      ],
      tools: ['JavaScript', 'Tesseract v brskalniku', 'Claude', 'EXIF', 'Vercel'],
      draft: false,
    },
    {
      id: 'model-premazi',
      metaTitle: 'Napovedni model za formulacije premazov | Študija primera',
      metaDescription:
        'Model, ki iz sestave premaza izračuna gostoto, suho snov, viskoznost in prekrivnost, pove, kako zanesljiva je napoved, in odkloni recepture zunaj svojega znanja.',
      keywords: ['napovedni model', 'premazi', 'formulacije barv', 'strojno učenje kemija', 'Gaussov proces'],
      summary:
        'Model, ki iz sestave premaza izračuna gostoto, suho snov, viskoznost in prekrivnost, preden kdo kaj zmeša. Pove, kako zanesljiva je napoved, in recepture zunaj svojega znanja odkloni.',
      facts: [
        { term: 'Stranka', definition: 'Proizvajalec barv in premazov, ime ni objavljeno' },
        { term: 'Panoga', definition: 'Kemija, razvoj premazov' },
        { term: 'Vrsta', definition: 'AI model' },
        { term: 'Obseg', definition: 'Model, ocena zanesljivosti, zavrnitev zunaj podatkov, ukazna vrstica za laboratorij' },
        { term: 'Stanje', definition: 'Prva plast, učena na sintetičnih družinah receptur, pripravljena na realne meritve' },
      ],
      challenge: [
        'Vsaka nova receptura pomeni mešanje in merjenje: gostota, suha snov, viskoznost, prekrivnost, vsaka po svojem standardu. Laboratorij porabi dneve za variante, ki bi jih izkušen tehnolog izločil že na papirju, če bi imel številke.',
        'Model, ki samozavestno ugiba, je slabši od nobenega modela. Tehnolog mora vedeti, kdaj napovedi verjeti in kdaj je receptura zunaj tega, kar model pozna.',
      ],
      build: [
        'Receptura vstopi kot deleži surovin. Iz njih program izračuna značilke: deleže veziva, pigmenta, polnila, topila, aditivov in vode, pigmentno volumsko koncentracijo in fizikalno gostoto ter suho snov iz mešalnih pravil. Gostoto in suho snov tako večinoma da fizika, model se uči le ostanka. Viskoznost se uči v logaritemskem merilu.',
        'Za vsako lastnost teče Gaussov proces, ki poleg napovedi vrne interval. Interval ima spodnjo mejo, zato model ne more trditi, da je natančnejši, kot dopuščajo podatki. Odgovor odkloni v dveh primerih: če je v recepturi surovina, ki je ne pozna, ali če je receptura po razdalji v prostoru značilk dlje od vsega, kar je videl pri učenju.',
      ],
      parts: [
        { name: 'Fizikalno sidro', body: 'Gostota in suha snov iz mešalnih pravil, model popravlja samo odstopanje. Na sintetičnih družinah R² 0,999 proti 0,91 za model brez fizike.' },
        { name: 'Ocena zanesljivosti', body: 'Vsaka napoved z intervalom in spodnjo mejo šuma, ki je ni mogoče zaobiti.' },
        { name: 'Zavrnitev', body: 'Neznana surovina ali prevelika razdalja od učnih podatkov, oboje z razlogom in številko.' },
        { name: 'Pošteno preverjanje', body: 'Preverjanje po družinah receptur, ne po naključnih vrsticah. Tako se pokaže, da viskoznost brez realnih meritev še ni zanesljiva.' },
        { name: 'Ukazna vrstica', body: 'Tabele surovin, receptur in meritev v mapi, receptura v datoteki, odgovor v besedilu. Brez aplikacije, dokler ni realnih podatkov.' },
      ],
      outcome: [
        'Napoved štirih lastnosti pred mešanjem, vsaka z intervalom zaupanja.',
        'Model reče, da ne ve, namesto da bi ugibal, in pove, zakaj.',
        'Vse teče na sintetičnih družinah receptur; vsaka napoved je označena kot testna, dokler laboratorij ne vnese realnih meritev.',
      ],
      tools: ['Python', 'scikit-learn', 'Gaussovi procesi', 'pandas', 'pytest'],
      draft: false,
    },
    {
      id: 'pacom',
      metaTitle: 'Pacom: marketinški sistem za čistilni servis | Študija primera',
      metaDescription:
        'Sistem za obstoječe stranke čistilnega servisa Pacom iz Novega mesta: paketi z garancijami, segmenti, e-poštne sekvence in koledar objav z vsebinskim agentom.',
      keywords: ['Pacom', 'čistilni servis Novo mesto', 'marketinški sistem', 'vsebinski koledar', 'e-poštne sekvence'],
      summary:
        'Sistem za obstoječe stranke čistilnega servisa iz Novega mesta: paketi z garancijami, segmenti strank, e-poštne sekvence in koledar objav, ki ga polni vsebinski agent. Objave potrdi človek.',
      facts: [
        { term: 'Stranka', definition: 'Čistilni servis Pacom, Novo mesto' },
        { term: 'Panoga', definition: 'Čiščenje za podjetja in domove, Dolenjska' },
        { term: 'Vrsta', definition: 'Marketinški sistem' },
        { term: 'Obseg', definition: 'Ponudbeni paketi, segmenti in sekvence, vsebinski koledar, kampanja za ocene' },
        { term: 'Stanje', definition: 'V uporabi od aprila 2026' },
      ],
      challenge: [
        'Pacom čisti trideset let in njegova prednost je preprosta: ista oseba pride v iste prostore, vsakič. Te prednosti ni nihče povedal naglas. Ponudbe so nastajale za vsako povpraševanje posebej, objave takrat, ko je bil čas, ocene na Googlu pa niso odražale dvajsetletnih strank.',
        'Cilj ni bil več oglasov, ampak sistem, ki obstoječe stranke drži, jih vabi k ocenam in novim daje jasno ponudbo.',
      ],
      build: [
        'Najprej sporočilo: isti ključi, iste roke, isto zaupanje. Nato trije paketi z garancijo, ki to sporočilo dokazujejo: Pisarna za podjetja z vračilom mesečnega zneska, če ne pride ista oseba, Dom z rezervno kolegico, da storitev nikoli ne odpade, in Nova za novogradnje s prihodom v 48 urah.',
        'Okrog tega teče Business HQ: pregled znamke, segmenti strank, e-poštne sekvence po prvem čiščenju, koledar objav, banka idej in seznam nalog. Vsebinski agent po koledarju pripravi osnutke objav in sporočil, oseba pri Pacomu jih potrdi. Vzporedno teče kampanja za ocene: klic petdesetim najboljšim strankam, trideset ocen v tridesetih dneh.',
      ],
      parts: [
        { name: 'Ponudbeni paketi', body: 'Pisarna, Dom in Nova, vsak z jasno ceno in garancijo, ki jo je mogoče izpolniti.' },
        { name: 'Segmenti in sekvence', body: 'Podjetja, družine in gradbinci, vsak s svojo e-poštno potjo po prvem čiščenju.' },
        { name: 'Vsebinski koledar', body: 'Tridesetdnevni sprint: ekipa, prej in potem, pričevanja. Osnutke piše agent, potrdi jih človek.' },
        { name: 'Ocene', body: 'Strukturirana kampanja za Google ocene iz obstoječih dolgoletnih strank.' },
        { name: 'Oglasi', body: 'Ločeni kampanji za podjetja in domove v krogu 30 km, pripravljeni in čakata na zagon.' },
      ],
      outcome: [
        'Znamka, paketi, vsebine in naloge so na enem mestu, ne v treh glavah.',
        'Paketi z garancijami so zamenjali ponudbo za vsako povpraševanje posebej.',
        'Objave nastajajo po koledarju, ne po navdihu, in vsaka gre čez človeka.',
      ],
      tools: ['Notion', 'Claude', 'E-poštne sekvence', 'Meta Ads', 'Google Business Profile'],
      draft: false,
    },
    {
      id: 'zalife',
      metaTitle: 'ZaLife: znamka in vsebinski sistem | Študija primera',
      metaDescription:
        'Znamka in vsebinski sistem za program osebnega razvoja najstnikov ZaLife: sredstva znamke, ponudbe za šole in starše, koledar objav in banka idej na enem mestu.',
      keywords: ['ZaLife', 'osebni razvoj najstnikov', 'vsebinski sistem', 'znamka', 'ponudba za šole'],
      summary:
        'Znamka in vsebinski sistem za program osebnega razvoja najstnikov: sredstva znamke, ponudbe za šole in starše, koledar objav in banka idej na enem mestu, da ekipa ne išče več po mapah.',
      facts: [
        { term: 'Stranka', definition: 'ZaLife' },
        { term: 'Panoga', definition: 'Izobraževanje, osebni razvoj mladih' },
        { term: 'Vrsta', definition: 'Vsebinski sistem' },
        { term: 'Obseg', definition: 'Business HQ, sredstva znamke, ponudbe in paketi, koledar objav, banka idej' },
        { term: 'Stanje', definition: 'V uporabi' },
      ],
      challenge: [
        'Program je bil dober, gradivo pa razpršeno: logotipi v eni mapi, predstavitve v drugi, ponudba za vsako šolo napisana znova. Objave so nastajale v presledkih, ideje so se izgubljale v pogovorih.',
        'Ekipa je potrebovala en kraj, kjer so znamka, ponudbe in vsebine skupaj, in navado, da tja vsak teden kaj doda.',
      ],
      build: [
        'Postavili smo Business HQ z enakim ogrodjem kot za druge stranke: pregled znamke s ciljno skupino in obljubo, ponudbe in paketi, koledar objav, seznam nalog in banka idej. Sredstva znamke, od logotipov do predstavitev, so v eni mapi z opisom, kdaj se kaj uporabi.',
        'Iz banke idej so že zrasle nove ponudbe, na primer program za podjetja, ki delavnico za starše zaposlenih ponudi kot del skrbi za zaposlene.',
      ],
      parts: [
        { name: 'Pregled znamke', body: 'Kdo je stranka, kaj program spremeni in v kakšnem času. Ena stran, ki jo prebere vsak nov sodelavec.' },
        { name: 'Ponudbe in paketi', body: 'Ponudbe za šole, starše in podjetja z vsebino, ceno in opombami, pripravljene za pošiljanje.' },
        { name: 'Koledar objav', body: 'Objave po tednih, s stanjem od ideje do objavljeno.' },
        { name: 'Banka idej', body: 'Vsaka ideja z oceno in naslednjim korakom, da ne obstane v klepetu.' },
      ],
      outcome: [
        'Vsa sredstva znamke in ponudbe na enem mestu, brez iskanja po mapah.',
        'Nova ponudba za podjetja je nastala iz banke idej, ne iz naključja.',
        'Objave imajo koledar in stanje, zato je vidno, kaj manjka.',
      ],
      tools: ['Notion', 'Claude'],
      draft: false,
    },

    /* ── Drafted without source material, see the note at the top ─── */
    {
      id: 'elementum',
      metaTitle: 'Elementum: svetovalec za plemenite kovine | Študija primera',
      metaDescription:
        'Spletni svetovalec, ki v slovenščini odgovarja o nakupu in hrambi zlata in srebra, resna povpraševanja preda svetovalcem in ekipi zjutraj pripravi tržni pregled.',
      keywords: ['Elementum', 'plemenite kovine', 'AI svetovalec', 'spletni klepet', 'tržni pregled'],
      summary:
        'Spletni svetovalec, ki obiskovalcem v slovenščini odgovarja o nakupu in hrambi zlata in srebra, tudi ponoči, resna povpraševanja preda svetovalcem, zjutraj pa ekipi pripravi kratek tržni pregled.',
      facts: [
        { term: 'Stranka', definition: 'Elementum, plemenite kovine' },
        { term: 'Panoga', definition: 'Prodaja in hramba naložbenega zlata in srebra' },
        { term: 'Vrsta', definition: 'Avtomatizacija prodaje' },
        { term: 'Obseg', definition: 'Svetovalec na spletni strani, predaja svetovalcem, jutranji tržni pregled' },
        { term: 'Stanje', definition: 'V uporabi' },
      ],
      challenge: [
        'Ista vprašanja vsak dan: kakšna je razlika med palico in kovancem, ali je zlato obdavčeno, kako poteka hramba, kaj se zgodi ob odkupu. Svetovalci so nanje odgovarjali po telefonu in e-pošti, tudi zvečer, ko je obiskovalec že odšel drugam.',
        'Zjutraj je vsak svetovalec sam pregledoval cene, novice in konkurenco, preden je lahko začel z delom.',
      ],
      build: [
        'Svetovalec na spletni strani odgovarja samo iz potrjenih virov: strani podjetja, pogosta vprašanja in interna navodila. O gibanju cen in naložbenih odločitvah ne svetuje, to jasno pove in ponudi pogovor s človekom. Ko obiskovalec pokaže resen namen, svetovalec zbere ime, kontakt in kratek povzetek in ga preda svetovalcu.',
        'Vsako jutro drug agent zbere cene, novice in spremembe pri konkurenci ter jih strne v pregled, ki ga ekipa prebere v petih minutah.',
      ],
      parts: [
        { name: 'Svetovalec na spletni strani', body: 'Odgovori v slovenščini iz potrjenih virov, brez naložbenih nasvetov, ob vsaki uri.' },
        { name: 'Predaja svetovalcu', body: 'Povpraševanje s povzetkom pogovora in kontaktom pristane pri svetovalcu, ne v splošnem nabiralniku.' },
        { name: 'Jutranji tržni pregled', body: 'Cene, novice in premiki konkurence iz virov, ki jih je ekipa prej pregledovala ročno.' },
        { name: 'Nadzor odgovorov', body: 'Vsak odgovor ima vir, pogovori se pregledujejo in odgovori, ki niso bili dobri, se popravijo v virih.' },
      ],
      outcome: [
        'Vprašanja ponoči in ob koncu tedna dobijo odgovor, svetovalci pa zjutraj pripravljena povpraševanja.',
        'Svetovalci začnejo dan s pregledom namesto z brskanjem.',
        'Nobenega ugibanja o cenah: kar ni v virih, gre k človeku.',
      ],
      tools: ['Claude', 'Spletni klepet', 'E-pošta', 'Zajem virov'],
      draft: true,
    },
    {
      id: 'tower-spa',
      metaTitle: 'Tower Spa Celje: asistent za rezervacije | Študija primera',
      metaDescription:
        'Asistent za rezervacije v wellnessu v srednjeveškem stolpu: odgovarja o paketih, sprejme rezervacijo, pošlje opomnik in ob odpovedi sprosti termin.',
      keywords: ['Tower Spa Celje', 'asistent za rezervacije', 'wellness', 'AI rezervacije', 'opomniki'],
      summary:
        'Asistent za rezervacije v wellnessu v srednjeveškem stolpu. Odgovarja o paketih, savnah in masažah, sprejme rezervacijo, pošlje opomnik dan prej in ob odpovedi sprosti termin. Skupine in dogodke preda lastniku.',
      facts: [
        { term: 'Stranka', definition: 'Tower Spa Celje' },
        { term: 'Panoga', definition: 'Wellness in gostinstvo' },
        { term: 'Vrsta', definition: 'Avtomatizacija prodaje' },
        { term: 'Obseg', definition: 'Asistent za vprašanja in rezervacije, opomniki, odpovedi, predaja lastniku' },
        { term: 'Stanje', definition: 'V uporabi' },
      ],
      challenge: [
        'Majhna ekipa, ki hkrati skrbi za goste in za telefon. Vprašanja o paketih in prostih terminih so prihajala po telefonu, sporočilih in e-pošti, večinoma zvečer. Kdor ni dobil odgovora, je rezerviral drugje.',
        'Odpovedi v zadnjem trenutku so puščale prazne termine, ker ni bilo časa, da bi jih kdo ponudil naprej.',
      ],
      build: [
        'Asistent pozna ponudbo: pakete, savne, masaže, trajanje in cene, ter proste termine v koledarju. Odgovori v slovenščini in angleščini, sprejme rezervacijo, pošlje potrditev in dan prej opomnik. Ob odpovedi termin sprosti in ga ponudi čakajočim.',
        'Vprašanja o skupinah, dogodkih in posebnih željah ne ugiba: zbere podatke in jih preda lastniku s povzetkom.',
      ],
      parts: [
        { name: 'Odgovori o ponudbi', body: 'Paketi, savne, masaže, trajanje, cene in hišna pravila iz enega vira, ki ga ureja ekipa.' },
        { name: 'Rezervacija', body: 'Prost termin iz koledarja, potrditev gostu in vnos v koledar ekipe.' },
        { name: 'Opomniki in odpovedi', body: 'Opomnik dan prej, odpoved v enem koraku, sproščen termin gre čakajočim.' },
        { name: 'Predaja lastniku', body: 'Skupine, dogodki in vse, kar ni v ponudbi, s povzetkom pogovora.' },
      ],
      outcome: [
        'Gost dobi odgovor in termin ob uri, ko sprašuje, tudi zvečer.',
        'Odpovedani termini se ponudijo naprej, ne ostanejo prazni.',
        'Ekipa se ukvarja z gosti v stolpu, ne s telefonom.',
      ],
      tools: ['Claude', 'Spletni klepet', 'Koledar', 'SMS in e-pošta'],
      draft: true,
    },
    {
      id: 'asya-grafy',
      metaTitle: 'Dr. Asya Grafy: svetovalec za nego kože | Študija primera',
      metaDescription:
        'Svetovalec za nego kože v spletni trgovini: iz dokumentacije o izdelkih svetuje po tipu kože, predlaga vrstni red in izdelke pošlje v košarico.',
      keywords: ['Dr. Asya Grafy', 'svetovalec za nego kože', 'spletna trgovina', 'AI svetovalec', 'kozmetika'],
      summary:
        'Svetovalec za nego kože v spletni trgovini. Iz dokumentacije o izdelkih odgovori na vprašanja o suhi, občutljivi ali zreli koži, predlaga vrstni red izdelkov in vsakega pošlje v košarico. Zdravstvena vprašanja preda človeku.',
      facts: [
        { term: 'Stranka', definition: 'Dr. Asya Grafy Bio Institute' },
        { term: 'Panoga', definition: 'Kozmetika in nega kože' },
        { term: 'Vrsta', definition: 'AI svetovalec' },
        { term: 'Obseg', definition: 'Svetovalec v spletni trgovini, priporočila po tipu kože, vrstni red uporabe, košarica' },
        { term: 'Stanje', definition: 'V uporabi' },
      ],
      challenge: [
        'Izdelki imajo dobro dokumentacijo, obiskovalec pa jo redko prebere. Vprašanja so bila vedno ista: kateri izdelek za mojo kožo, v kakšnem vrstnem redu, ali se ta dva skladata. Odgovarjala je ekipa, po e-pošti, z zamikom dneva.',
        'Nekatera vprašanja so bila zdravstvena. Nanje ne sme odgovarjati ne ekipa ne program.',
      ],
      build: [
        'Svetovalec bere samo dokumentacijo izdelkov in navodila inštituta. Vpraša po tipu kože in težavi, predlaga izdelke in vrstni red uporabe zjutraj in zvečer, vsak izdelek pa lahko obiskovalec pošlje v košarico neposredno iz pogovora.',
        'Vprašanja o boleznih kože, zdravilih in nosečnosti prepozna in jih preda človeku, s prijaznim pojasnilom, zakaj.',
      ],
      parts: [
        { name: 'Znanje iz dokumentacije', body: 'Sestavine, namen, uporaba in opozorila vsakega izdelka, iz istih dokumentov, ki jih ureja inštitut.' },
        { name: 'Priporočila po tipu kože', body: 'Suha, občutljiva, mešana ali zrela koža, s kratkim razlogom za vsak predlog.' },
        { name: 'Vrstni red uporabe', body: 'Jutranja in večerna rutina iz izbranih izdelkov.' },
        { name: 'Košarica', body: 'Vsak predlagan izdelek gre v košarico z enim klikom.' },
        { name: 'Zdravstvena vprašanja', body: 'Prepoznana in predana človeku, brez ugibanja.' },
      ],
      outcome: [
        'Obiskovalec dobi odgovor in rutino v pogovoru, ne po e-pošti naslednji dan.',
        'Ekipa odgovarja samo na vprašanja, ki res potrebujejo človeka.',
        'Priporočila so dosledna, ker vsi berejo isto dokumentacijo.',
      ],
      tools: ['Claude', 'Spletna trgovina', 'Dokumentacija izdelkov'],
      draft: true,
    },
    {
      id: 'si-big',
      metaTitle: 'SI-BIG: spremljanje razpisov na šestih trgih | Študija primera',
      metaDescription:
        'Sistem, ki vsako jutro pregleda razpise, iskanja partnerjev in novice s šestih balkanskih trgov, jih oceni po merilih stranke in ekipi pripravi seznam za naprej.',
      keywords: ['SI-BIG', 'spremljanje razpisov', 'balkanski trgi', 'spremljanje trga', 'iskanje partnerjev'],
      summary:
        'Sistem, ki vsako jutro pregleda razpise, iskanja partnerjev in novice s šestih balkanskih trgov, jih oceni po merilih posamezne stranke in ekipi pripravi seznam, ki ga pošlje naprej.',
      facts: [
        { term: 'Stranka', definition: 'SI-BIG Group' },
        { term: 'Panoga', definition: 'Poslovno povezovanje in svetovanje na Balkanu' },
        { term: 'Vrsta', definition: 'Spremljanje trga' },
        { term: 'Obseg', definition: 'Zajem virov, ocena po merilih stranke, jutranji seznam, pošiljanje naprej' },
        { term: 'Stanje', definition: 'V uporabi' },
      ],
      challenge: [
        'Šest trgov, šest jezikov, na desetine virov: portali za razpise, zbornice, iskanja partnerjev, novice. Ekipa je vsako dopoldne preverjala vire in za vsako stranko presojala, ali je kaj zanjo. Ko je bilo dela veliko, so viri počakali, in priložnosti z njimi.',
      ],
      build: [
        'Agent vsako jutro zajame nove objave iz dogovorjenih virov, jih prevede in vsako oceni po merilih posamezne stranke: panoga, država, velikost, rok. Kar doseže prag, pride na seznam z razlogom in povezavo, razvrščeno po stranki.',
        'Ekipa seznam pregleda, kaj črta in ostalo z enim klikom pošlje strankam. Kar je bilo črtano, agent upošteva pri naslednjem ocenjevanju.',
      ],
      parts: [
        { name: 'Viri', body: 'Razpisi, iskanja partnerjev in novice s šestih trgov, dodajanje novih virov brez programiranja.' },
        { name: 'Ocena po merilih', body: 'Vsaka stranka ima svoja merila, vsak zadetek razlog in oceno.' },
        { name: 'Jutranji seznam', body: 'Ena stran po strankah, pripravljena pred začetkom dela.' },
        { name: 'Pošiljanje naprej', body: 'Potrjeni zadetki gredo strankam v njihovem jeziku.' },
        { name: 'Učenje', body: 'Črtani zadetki znižajo oceno podobnih pri naslednjem pregledu.' },
      ],
      outcome: [
        'Iskanje, ki je vzelo dopoldne, je pregled ob kavi.',
        'Nobena stranka ni odvisna od tega, ali je bil dan miren.',
        'Vsak zadetek ima razlog, zato ekipa ve, zakaj ga vidi.',
      ],
      tools: ['Claude', 'Zajem virov', 'Prevajanje', 'E-pošta'],
      draft: true,
    },
    {
      id: 'heva',
      metaTitle: 'HEVA: delovni nalogi iz e-pošte in klicev | Študija primera',
      metaDescription:
        'Delovni nalogi za upravljanje stavb: iz e-pošte in klicev asistent prepozna naslov, težavo in nujnost, ustvari nalog, predlaga monterja in pripravi račun.',
      keywords: ['HEVA', 'upravljanje nepremičnin', 'delovni nalogi', 'avtomatizacija administracije', 'vzdrževanje stavb'],
      summary:
        'Delovni nalogi za upravljanje in vzdrževanje stavb. Iz e-pošte in telefonskih klicev asistent prepozna naslov, težavo in nujnost, ustvari nalog in predlaga prostega monterja. Ekipa nalog dobi na telefon, po opravljenem delu pa gre račun ven sam.',
      facts: [
        { term: 'Stranka', definition: 'HEVA, upravljanje nepremičnin' },
        { term: 'Panoga', definition: 'Upravljanje in vzdrževanje stavb' },
        { term: 'Vrsta', definition: 'Avtomatizacija administracije' },
        { term: 'Obseg', definition: 'Zajem prijav, delovni nalogi, razporejanje, nalogi na telefonu, računi' },
        { term: 'Stanje', definition: 'V uporabi' },
      ],
      challenge: [
        'Prijave napak prihajajo po e-pošti in telefonu, ob vsaki uri, v vseh oblikah. Nekdo jih je prepisoval v naloge, iskal prostega monterja in po opravljenem delu spet prepisoval podatke v račun. Vsako prepisovanje je bila priložnost za napako in za zamik.',
      ],
      build: [
        'Asistent bere nabiralnik in prepise klicev. Iz sporočila prepozna stavbo, stanovanje, težavo in nujnost, ustvari delovni nalog in predlaga monterja glede na razpored in vrsto dela. Dispečer predlog potrdi ali popravi.',
        'Monter nalog dobi na telefon s podatki in naslovom, po opravljenem delu označi porabljen material in čas. Iz tega nastane osnutek računa v računovodskem sistemu; potrdi ga pisarna.',
      ],
      parts: [
        { name: 'Zajem prijav', body: 'E-pošta in prepisi klicev v en tok, z izvirnim sporočilom ob vsakem nalogu.' },
        { name: 'Prepoznava', body: 'Naslov, težava in nujnost, s stopnjo zaupanja; nejasne prijave dobi dispečer.' },
        { name: 'Razporejanje', body: 'Predlog prostega monterja po vrsti dela in razporedu, potrditev v enem kliku.' },
        { name: 'Nalog na telefonu', body: 'Naslov, opis, fotografije in kontakt; zaključek z materialom in časom.' },
        { name: 'Račun', body: 'Osnutek iz opravljenega dela, potrditev v pisarni, brez prepisovanja.' },
      ],
      outcome: [
        'Prijava postane nalog v minutah, ne ob koncu dneva.',
        'Podatki se vnesejo enkrat in potujejo do računa.',
        'Dispečer odloča, ne prepisuje.',
      ],
      tools: ['Claude', 'Prepis klicev', 'E-pošta', 'Mobilni nalogi', 'Računovodski sistem'],
      draft: true,
    },
    {
      id: 'epolac',
      metaTitle: 'Epolac: tehnični asistent za barve in premaze | Študija primera',
      metaDescription:
        'Tehnični asistent za proizvajalca barv in premazov: iz tehničnih in varnostnih listov odgovarja v angleščini in hebrejščini, navede vir in izračuna porabo.',
      keywords: ['Epolac', 'tehnični asistent', 'barve in premazi', 'tehnični listi', 'AI asistent hebrejščina'],
      summary:
        'Tehnični asistent za proizvajalca barv in premazov. Iz tehničnih in varnostnih listov odgovarja na vprašanja izvajalcev in distributerjev v angleščini in hebrejščini, navede vir in izračuna porabo. Vprašanja o cenah in projektih preda prodaji.',
      facts: [
        { term: 'Stranka', definition: 'Epolac, Izrael' },
        { term: 'Panoga', definition: 'Proizvodnja barv in premazov' },
        { term: 'Vrsta', definition: 'AI asistent' },
        { term: 'Obseg', definition: 'Znanje iz tehničnih in varnostnih listov, odgovori v dveh jezikih z virom, izračun porabe, predaja prodaji' },
        { term: 'Stanje', definition: 'V uporabi' },
      ],
      challenge: [
        'Na stotine izdelkov, vsak s tehničnim in varnostnim listom. Izvajalci na gradbišču sprašujejo o pripravi podlage, redčenju, času sušenja in porabi, pogosto zvečer in v obeh jezikih. Tehnična služba je odgovarjala isto, znova in znova, in medtem ni delala razvoja.',
      ],
      build: [
        'Asistent odgovarja samo iz listov, ki jih vzdržuje tehnična služba. Vsak odgovor navede izdelek, list in odstavek, iz katerega je vzet. Iz površine, podlage in števila nanosov izračuna porabo in predlaga pakiranje.',
        'Odgovarja v angleščini in hebrejščini, glede na jezik vprašanja. Vprašanja o cenah, dobavi in projektih ne odgovarja, ampak jih s povzetkom preda prodaji.',
      ],
      parts: [
        { name: 'Znanje iz listov', body: 'Tehnični in varnostni listi kot edini vir; posodobitev lista posodobi odgovore.' },
        { name: 'Odgovori z virom', body: 'Izdelek, dokument in odstavek pri vsakem odgovoru, v angleščini ali hebrejščini.' },
        { name: 'Izračun porabe', body: 'Površina, podlaga in nanosi dajo količino in predlog pakiranja.' },
        { name: 'Predaja prodaji', body: 'Cene, dobava in projekti gredo prodaji s povzetkom pogovora.' },
        { name: 'Nadzor', body: 'Tehnična služba pregleduje pogovore in popravlja liste, ne asistenta.' },
      ],
      outcome: [
        'Izvajalec dobi odgovor z virom na gradbišču, v svojem jeziku.',
        'Tehnična služba odgovarja na nova vprašanja, ne na ista.',
        'Prodaja dobi povpraševanja s povzetkom, ne z golim kontaktom.',
      ],
      tools: ['Claude', 'Tehnični listi', 'Spletni klepet', 'Hebrejščina in angleščina'],
      draft: true,
    },
  ],
};
