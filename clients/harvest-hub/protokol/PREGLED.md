# PREGLED — kaj je ta pregled ugotovil in kaj je zdaj treba narediti

**Za:** Ian · **Datum:** 30. 7. 2026 · **Podlaga:** G0, G1, G2, G3a, G3b, G3c, G4 v tej mapi
**Status kode:** zamrznjena. Nič v tem pregledu ni spremenilo nobene datoteke pod `demo/`.

Ta dokument ni povzetek vrat. Je odločitveni dokument. Vsaka postavka ima nosilca in rok, vezan
na dogodek (predstavitev / Faza 0 / prvi resnični dokument / prvi zapis / predaja), ne na datum.

---

## 0. Najbolj pomembna ugotovitev celotnega teka

**Jamstvo 1 in Jamstvo 2 iz podpisu pripravljene ponudbe se med seboj izničujeta, in Jamstvo 2
nima mehanizma.**

Trije stavki, vsi iz `03-uradna-ponudba.md`, ki je zavezujoč dokument:

1. »Kot pravilno se šteje tudi polje, ki ga sistem sam označi kot negotovo in usmeri v pregled.«
   (vrstici 88–89)
2. »Podatek pod dogovorjenim pragom zanesljivosti se v vaša sistema ne zapiše.« (Jamstvo 2)
3. »Vsak podatek dobi oceno zanesljivosti.« (OBSEG)

Kaj to pomeni skupaj:

- **Nikjer v ponudbi ni omejitve deleža označenih polj.** Preveril G4 z iskanjem po celotnem
  besedilu ponudbe: omejitve ni. Sistem, ki **vsako** polje označi za pregled, doseže **100 %
  natančnost** in prevzemni test opravi — naročnik pa vsak podatek še vedno vtipka na roko. Kupili
  so robota, plačali 30 % ob prevzemnem testu, in dobili merilo, ki ga zadovolji nič avtomatizacije.
- **In prav to je najvarnejša izvedba Jamstva 2.** »Nič pod pragom se ne zapiše« → varno je označiti
  več. Jamstvo 1 označevanje **nagrajuje**. Dve jamstvi si nasprotujeta v isti smeri.
- **Praga sploh ni.** G2 je izmeril, da gradnja ne proizvaja nobene ocene zanesljivosti. Proizvaja
  **izvor** (`ponudba` / `pravilo` / `register`) — to je oznaka, od kod vrednost prihaja, ne mera,
  kako zanesljiva je. Vrednost, prebrana z ponudbe, je zelena ne glede na to, kako berljiva je bila.
  Prag potrebuje **številko**, številka potrebuje mehanizem, mehanizma ni. Iskanje po
  `demo/lib/*.js` in `demo/app.js` za `confidence|learn|uci` vrne **nič zadetkov**.

**Zakaj je to najbolj pomembno.** Vse ostalo v tem pregledu je bodisi tehnično tveganje (rešljivo z
delom) bodisi pogodbena podrobnost (rešljiva s stavkom). To je edina ugotovitev, ki hkrati (a) sedi
v podpisu pripravljenem dokumentu, (b) se tiče 30 % pogodbene vrednosti, (c) je nerešljiva po
podpisu brez aneksa, in (d) bi jo naročnik povsem upravičeno bral kot to, da smo mu prodali številko,
ki ne meri tega, kar misli, da meri.

**Kaj to popravi, in stane nič, če se naredi pred podpisom oziroma v zapisniku Faze 0:**

| # | Poseg | Kdaj | Nosilec |
|---|---|---|---|
| 1 | Na prevzemnem testu se poročajo **tri številke, ne ena**: **A natančnost** (pogodbeni prag ≥ 98 %), **B samodejna prehodnost** (delež polj, zapisanih brez človeka — **izmeri se in poroča, prag se ne jamči**, ker nimamo podlage zanj), **C tihe napake** (število napačno zapisanih in neoznačenih celic — edino resnično merilo Jamstva 2). Celotni protokol je napisan in slovenski v `G4 §1.7`, pripravljen za prilogo. | Faza 0, pisno | Ian |
| 2 | Odločiti, ali merilo **B postane pogodbeno zavezujoče**. Naše mnenje: **ne v tej pogodbi** — nimamo nobene podlage za številko in izmišljanje je natanko to, kar so vsa prejšnja vrata zavrnila. Izmeriti in poročati ob mejniku Faze 1 (3. teden), ko je prvič merljivo. | Odločitev pred Fazo 0 | **samo Ian** |
| 3 | Jamstvo 2 dobi **mehanizem ali novo besedilo**. Bodisi se v Fazi 0 zgradi resnična ocena (dvojno branje in ujemanje / samoocena modela / verjetnost na ravni žetona), bodisi se jamstvo preoblikuje v to, kar izvor dejansko dá. Obojega hkrati ni. | Faza 0 | Ian + AIS |
| 4 | **Do takrat se rumene in zelene pike na zaslonu ne smejo predstaviti kot zajamčeni prag.** To velja tudi za predstavitev, ki je lahko danes. | Takoj | Ian |

---

## 1. Kaj zdaj vemo, česa prej nismo

Razvrščeno po posledici, ne po vratih. Vsaka vrstica ima dokazilo; kjer ga ni, piše NEZNANO.

### 1.1 Ugotovitve, ki se dotikajo denarja ali pogodbe

| # | Ugotovitev | Dokazilo | Posledica |
|---|---|---|---|
| **A** | **98 % je dosegljivo brez avtomatizacije** (razdelek 0). | `03-uradna-ponudba.md:88–89`; iskanje po ponudbi za omejitev deleža → ni je | 30 % vrednosti visi na merilu, ki ne meri prihranka |
| **B** | **22,9 % sedanjega imenovalca natančnosti se ne more zmotiti.** `zastopnik_2.ime_priimek` in `zastopnik_2.stevilka` sta prazna na **vseh 12 enotah** (24 celic, 15,3 %); `zavarovalnica` je trdo zapisana konstanta (12 celic, 7,6 %). Sistem, ki ne bi prebral ničesar, doseže 22,9 %. | `truth.json` preračunan v Pythonu; `demo/lib/extract.js:24, 161` | 157/157 **ostane veljaven** (preostalih 121 celic je bilo resnično prebranih), ampak **odstotka se nikoli ne sme navesti brez sestave imenovalca** |
| **C** | **Resnico je prepisal izvajalec.** `truth.json` je Ian prepisal na oko. Za razvoj pravilno in dokumentirano. Za **pogodbeni** test ne: izvajalec ne more hkrati postavljati vprašanj in ocenjevati odgovorov. | `G4 §1.7 D` | Resnico na prevzemnem testu prepiše **sodelavec naročnika**, pred pogledom na rezultat robota; spore razsodita dve osebi, ena z vsake strani |
| **D** | **Ukinitev modela ni pokrita nikjer.** Jamstvo 3 definira napako kot odstopanje »na nespremenjenem sistemu«. `demo/lib/claude.mjs:12–13` pripenja `claude-sonnet-4-6` in `claude-opus-4-8`. Anthropic objavlja in spoštuje roke umika — trije modeli so bili umaknjeni že v 2026. Podpis + 12–16 tednov + 12 mesecev garancije sega globoko v 2027. | Dokumentacija o življenjskem ciklu modelov, brano 30. 7.; `claude.mjs:12–13` | Nekega jutra se robot ustavi in **pri naročniku se ni nič spremenilo**. Po dobesednem branju je to napaka. **Stane en stavek pred podpisom** — predlog besedila je v `G4 §3.1` |
| **E** | **Šifrant Zavarovalniškega programa je največja odprta komercialna izpostavljenost.** `03` prenos šteje v osnovni obseg in šifranta ne omenja. `07-odgovori` pravi, da je prenos **odložen** in zahteva izdelavo šifranta zavarovalnice ter preslikavo med dvema šifrantoma. Nihče ni ocenil, koliko vrstic je to. | `03-uradna-ponudba.md` OBSEG vs `07-odgovori-harvest.md` | **Uskladiti v zapisniku Faze 0.** Naš predlog (G1 N1): **vsebina šifranta je njihova** (njihova koda, njihov produktni seznam — tega ne moremo napisati mi), **preslikava in izvedba ostaneta v fiksni ceni**, ko vsebina obstaja |
| **F** | **»Sistem se iz popravkov uči« je neomejena obljuba v fiksni ceni.** Nima mehanizma, zasnove ne merila — nikjer v gradnji ali načrtih. | iskanje po `demo/lib/*.js`, `demo/app.js` → nič | V Fazi 0 dobi **omejen, zapisan pomen** (npr. shramba popravkov, ki se predvaja kot primeri; ali normalizacijska tabela, ki jo človek ureja) **in en stavek o tem, kako bi kdo vedel, da deluje.** Sicer je to trajen zahtevek |
| **G** | **Cene modelov v kodi so pravilne.** Preverjeno danes proti trenutnemu katalogu modelov: Sonnet 4.6 = 3 / 15 USD na milijon, Opus 4.8 = 5 / 25 USD. `PRICES` v `claude.mjs:79–82` se ujema. | katalog modelov, 30. 7. 2026 | **Zapre odprto točko G2 D-3.** Vse stranki predstavljene cenovne številke stojijo na pravilnih konstantah |

### 1.2 Ugotovitve o varnosti in skladnosti

| # | Ugotovitev | Stanje danes |
|---|---|---|
| **H** | **Resnični dokumenti stranke s podatki po 9. členu so bili v delovnem drevesu javnega repozitorija** — v neposrednem nasprotju s § 5(a) podpisu pripravljene pogodbe o obdelavi, ki obljublja hrambo »izven delovnega drevesa katerega koli repozitorija izvorne kode«. | **ODPRAVLJENO 30. 7. ob 10:49–10:51.** Preverjeno danes znova: `~/ais-client-data/harvest-hub` je `drwx------`, `git ls-files clients/harvest-hub` vrne **prazno** (nič ni bilo nikoli sledeno ali oddano). Dve podvojeni kopiji izvirnega zipa v `~/Downloads` sta izbrisani |
| **I** | **Zastavica `DEMO_SAMPLES`, ki jo koda sama označuje z »nikoli ne vklopi«, je bila trdo vklopljena v edini zabeleženi zagonski poti** in je resnične zdravstvene PDF-je stregla po HTTP brez preverjanja. | **ODPRAVLJENO.** Odstranjena iz `.claude/launch.json`; živa preverba vrne 404. Koristno: iskanje za `samples` v `app.js` in `index.html` vrne **nič** — pot ni bila nikoli povezana z gumbom, zato izklop **ne stane nobene zmožnosti prikaza** |
| **J** | **`/api/extract` je bil brez prijave, brez omejitve hitrosti, brez stroškovne meje in brez preverjanja izvora** — kdorkoli iz katere koli strani, odprte v operaterjevem brskalniku, bi lahko izpraznil ključ. | **POPRAVLJENO 30. 7. ob 11:16** (+48 vrstic: zapora na `Host`/`Origin`, 60 klicev/min, 5 USD na zagon). **Preveril sem danes:** strežnik teče od 11:19:35 na novi kodi; `localhost:8020` → 200, `0.0.0.0:8020` → **403**. Popravek je dober; glej razdelek 2, ker ima posledico za predstavitev |
| **K** | **Trditev »obdelava izključno znotraj EU« ne drži.** Živi test 30. 7.: neposredni API sprejme samo `global` in `us`; `eu` zavrne. Prikaz ne pošilja nobenega parametra regije, torej teče na `global`. | **Zavezujoča ponudba `03` je čista** — pravi, da ponudnika in regijo potrdimo v Fazi 0 (vrstice 174–176). Napačna trditev preživi **samo v dolgi tehnični prilogi** (`02-…md`, vrstice 124, 274, 413). Ta priloga se ne sme ponovno poslati |
| **L** | **Revizijska sled, kot je zasnovana, je neizbrisljiva zbirka podatkov po 9. členu.** Ponudba prodaja »nespremenljivo sled«; edina zapisana zasnova (`PLAN-prenos-zero.md §⑦`) hrani **prej/potem** — torej imena, naslove, datume rojstva, davčne in popravljene zdravstvene vrednosti — v dnevniku, katerega definicijska lastnost je, da se ne da spremeniti. Trči ob 5(1)(e), 16. in 17. člen GDPR **in ob 7. točko naše lastne pogodbe o obdelavi**, v kateri obljubljamo pomoč pri odgovarjanju natanko na te zahteve. | **Odprto.** Rešitev stane nič, če se odloči zdaj: sled hrani **sklice in odločitve, ne vrednosti** (id ponudbe, zgoščena vrednost dokumenta, **ime polja**, odločitev, izvor, akter, čas, kazalec na verzionirani zapis; kjer je dokazovanje človekove spremembe res potrebno, **zgoščeni vrednosti** stare in nove). Podrobno v `G3c §3.6` |
| **M** | **Vhodni kanal ne preverja ničesar.** Pasivni DNS 30. 7.: `_dmarc.merkur-zav.si` = `p=none` — Merkurjeva politika je samo opazovalna. Zasnova preverja le enkratnost `Message-ID`, G1 pa predlaga zaupanje **zadevi e-pošte** kot viru razvrstitve. V ciljni zasnovi ponarejena pošiljka doseže (a) pisanje v regulirani sistem evidenc in (b) v različici B izhodni kanal, ki listine pošlje na naslov, ki ga navaja pošiljka. Človeška potrditev izjem tega ne zapre, ker dobro sestavljen ponaredek ne sproži izjeme. | **Odprto, popravek je poceni in strukturen:** zaupanje se izpelje iz glave `Authentication-Results` (SPF `pass` **in** DKIM `pass` z `d=merkur-zav.si`), nikoli iz niza `From:` in nikoli iz zadeve. Kar pade, gre v izjeme kot »nepreverjen pošiljatelj« |
| **N** | **Ploščad, na kateri vse to stoji, nima nosilca.** Gradnja nima **nobene** trajne shrambe (preverjeno znova danes: iskanje za `localStorage|indexedDB|writeFile|sqlite|postgres` po `lib/`, `app.js`, `server.mjs`, `index.html` → **nič zadetkov**). Vsaka preostala komponenta (arhiv, enkratnost pošte, vrsta izjem, ura opominjanja, shramba popravkov, revizijska sled) potrebuje isto manjkajočo stvar. Ponudba pa **dvakrat izrecno izključi** gostovanje in obratovanje, naročnik pa nam je pisno sporočil, da računa pri ponudniku AI **še nima**. | To **ni** argument za vzdrževalno pogodbo — te so izrecno zavrnili. So tri stvari znotraj že prodanega: **imenovan nosilec na vsako kontrolo**, **operativni zapis v paketu ob predaji** (dokumentacija **je** v obsegu), in **en stavek**, da 12-mesečna garancija pokriva napake, ne obratovanja |
| **O** | **Vrsta nabiralnika je neznana in odgovor spremeni celoten nabor kontrol.** DNS je resnično dvoumen: MX kaže na gostiteljev strežnik (`212.44.106.43`), `autodiscover` pa na Microsoft 365; SPF pooblašča Microsoft **in** Google **in** oglaševalskega pošiljatelja, konča z mehkim `~all` in vsebuje naslov IPv6, s katerega pošta ne more nikoli legitimno priti. | **NEZNANO.** Če je Exchange Online, obstaja **dokazljivo omejena** poverilnica (in ena ukazna vrstica, ki to dokaže). Če je IPMAP pri gostitelju, omejevanja ni sploh in potrebni so nadomestni ukrepi. **Eno vprašanje njihovi informatiki to zapre** — isto vprašanje kot surova `.eml` datoteka iz Faze 0. *(Na njihov produkcijski poštni strežnik se nismo povezali — to bi bilo aktivno preiskovanje tretje osebe.)* |
| **P** | **Pogodba o obdelavi za ocenjevanje za produkcijo ni uporabna, in to piše sama.** Pet določil postane neresničnih v trenutku, ko se začne produkcija (datoteka se ne naloži na noben strežnik; k podobdelovalcu gre samo prva stran; baze se ne vzpostavi; strežnik posluša samo na `127.0.0.1`; edini podobdelovalec je Anthropic PBC ZDA). Njena lastna 1. točka to predvidi: »Produkcijska obdelava se uredi z ločeno pogodbo pred Fazo 1.« | **Prepis pred Fazo 1, ne ob predaji.** Dvanajst dodatkov je naštetih v `G3c §6`; prvi trije spremenijo obliko, ne besedila — zlasti **trifazna karta vlog**, brez katere je 12-mesečna garancija nedefinirana pravica do stalnega dostopa |

### 1.3 ⚠️ Gradnja ni zamrznjena — spreminja se v tem trenutku

Zapisano, ne obideno. Zaporedje časov spremembe datotek pod `demo/`, odčitano ob **11:34:39**:

| Čas | Datoteka | Kaj |
|---|---|---|
| 10:45–10:51 | `materiali/`, `truth.json`, `register-zastopnikov.json`, `out/`, `server.mjs`, `verify.mjs`, `render.mjs` | Sanacija po G3a. Med tem je `verify.mjs` šest minut padal z `ENOENT`, `render.mjs` pa je še ob 10:50 pisal PDF-je z resničnimi osebnimi podatki v `demo/out` (popravljeno ob 10:51) |
| 11:16:11 | `server.mjs` | +48 vrstic: zapora Host/Origin, omejitev hitrosti, stroškovna meja. **Dober popravek** — zapre R-3 iz G3a |
| **11:22:54** | **`app.js`** | Celoten uporabniški vmesnik prikaza |
| 11:24:17 | `README.md` | verjetno popravek zastarelih poti (D-4, D-5) |
| 11:29:37 | `package-lock.json` | **sprememba odvisnosti** |
| **11:30:35** | **`lib/layout.js`** | Edini modul **brez lastnega testnega paketa** (G2 D-9) in lastnik odločitve o usmeritvi dokumenta (`VISION_THRESHOLD = 500`) — torej odločitve, ki dokument pošlje po dražji vizualni poti |
| **11:34:46** | **`package.json`** | **Nekaj sekund pred zaključkom tega pregleda** |

**To ni ena sanacija — to je odprta seja urejanja, ki teče vzporedno s tem pregledom.** Nič v tem
pregledu ni pisalo v `demo/`; vse te spremembe so tuje.

**Kaj to pomeni, in to je pomembnejše od katere koli posamezne datoteke:**

- **Vsaka meritev v vsakem dokumentu vrat — vključno z mojimi — nosi časovni žig, drevo pa se je od
  takrat premaknilo.** 157/157 je bilo izmerjeno 27. 7.; `layout.js`, ki sestavi geometrijo, podano
  modelu, se je spremenil ob 11:30 danes. **Meritev 157/157 od 11:30 opisuje kodo, ki ne obstaja
  več v isti obliki.**
- **Vsebine nobene od teh sprememb ni mogoče ugotoviti.** Nič pod `clients/harvest-hub` ni nikoli
  bilo sledeno v gitu (`git ls-files` vrne prazno), zato izhodišča za primerjavo ni. To je isti
  podatek, ki je v razdelku 1.2 H dobra novica (nič ni ušlo v javni repozitorij) in je tu slaba
  (nič se ne da primerjati).
- **`package.json` in `package-lock.json` sta se spremenila**, kar pomeni spremembo odvisnosti —
  in to sedi točno na rdečem iz G2 glede ponovljivosti (ni zapisane različice izvajalnega okolja,
  ni CI, nedokumentirani `python3` + PyMuPDF in Chrome na trdo zapisani poti macOS).

**Kar sem preveril ob ~11:32, torej po `layout.js` in pred `package.json`:**

- **Vseh 285 trditev v štirih neplačanih testnih paketih še vedno uspe** po spremembi:
  `test-gate` 69/69 · `test-classify` 50/50 · `test-edokumenti` 77/77 · `test-runstats` vse uspele.
- Med njimi `test-classify` prebere **vseh 15 resničnih vzorčnih PDF-jev** in dobi
  `1 clen545 · 2 klp · 3 nebrano · 8 ponudba · 1 privolitvena` — **enako kot pred spremembo**. To
  pomeni, da **usmerjanje** (edina stvar, ki jo `layout.js` odloča navzven) na resničnih dokumentih
  še vedno deluje pravilno.
- Česar to **ne** pokriva: geometrija vrstic in celic, ki jo `layout.js` sestavi in poda modelu.
  To meri **samo plačani prevzemni pripomoček**, in ta od spremembe ni bil pognan. **Meritev
  157/157 zato od 11:30 opisuje kodo, ki ne obstaja več v isti obliki.**

**Česar to ne pokriva:** geometrija vrstic in celic, ki jo `layout.js` sestavi in poda modelu — to
meri **samo plačani prevzemni pripomoček**, in ta od spremembe ni bil pognan. In nič od tega ne
pokriva sprememb `app.js` (11:22) in `package.json` (11:34): **uporabniški vmesnik prikaza od
zadnje spremembe ni bil pognan skozi celoten tok.** Zato je razdelek 2.1 zdaj nujen, ne priporočen.

> **Iz tega sledi eno pravilo za naprej, in je za produkt pomembnejše od katere koli od teh
> datotek:** zamrznjena gradnja, ki ni v gitu, ni zamrznjena — je samo **neopazovana**. Zamrznitev
> brez verzijskega nadzora ni zamrznitev, ampak dogovor, in dogovora ni mogoče preveriti.
> Produkcijski repozitorij mora biti pod verzijskim nadzorom od prve oddaje, zaseben, z
> **verzioniranim** pregledom pred oddajo (današnja zaščita je lokalna kljukica, ki se ob predaji ne
> prenese). Če bi bilo to drevo v gitu, bi ta razdelek namesto seznama časov vseboval `git diff` in
> ne bi bilo treba ugibati.

---

## 2. Pred predstavitvijo — danes, brez sprememb kode

| # | Kaj | Zakaj | Nosilec | Čas |
|---|---|---|---|---|
| **2.1** | **NUJNO — prikaz pognati od začetka do konca v brskalniku, ki bo v uporabi, in šele ko se urejanje neha.** Ponovno zaženi strežnik, naloži `http://localhost:8020/`, povleci **en besedilni vzorec in en skeniran**, potrdi, da se predogled KLP izriše. | **Osem datotek pod `demo/` se je spremenilo v zadnjih 20 minutah, zadnja 7 sekund pred zaključkom tega pregleda** (razdelek 1.3). Strežnik teče od 11:19 in **ne** nosi sprememb `app.js` (11:22), `layout.js` (11:30) in `package.json` (11:34) — te poti prikaz od zadnje spremembe ni pognal niti enkrat. Poleg tega nova zapora vrne `403 forbidden — local requests only` za **celotno stran**, ne le za plačani klic, in sprejme natanko `localhost:8020`, `127.0.0.1:8020`, `[::1]:8020`. Zaznamek na `0.0.0.0:8020` **danes vrne prazno zavrnitev** — preverjeno. Prej je bil najslabši možni izid delujoča stran; zdaj je bela stran pred stranko. | Ian | 5 min |
| **2.1b** | **Po zaustavitvi urejanja pognati štiri neplačane testne pakete:** `node scripts/test-gate.mjs`, `test-classify.mjs`, `test-edokumenti.mjs`, `test-runstats.mjs`. Ob ~11:32 je vseh 285 trditev uspelo; od takrat sta se spremenila `package.json` in `package-lock.json`. | Stane nič in nič ne pošlje ven | Ian | 1 min |
| **2.2** | **98 % se ne navede brez sestave imenovalca.** Če pade številka, pade z njo tudi: »od 157 ocenjenih celic jih je 121 zares prebranih; ostalo so polja, ki so pravilno prazna, in ena konstanta.« | Razdelek 1.1 B. Če to pove naročnikov revizor prvi, je pogovor drug pogovor | Ian | — |
| **2.3** | **Rumene in zelene pike se ne predstavijo kot zajamčeni prag zanesljivosti.** So oznaka izvora. Če vprašajo: »prag potrdimo v Fazi 0, mehanizem zanj je del Faze 0«. | Razdelek 0 | Ian | — |
| **2.4** | **Če vprašajo, kje se podatki obdelujejo:** danes na globalni usmeritvi, ker je to prikaz na prenosniku po pogodbi o ocenjevanju; za produkcijo priporočamo Frankfurt. **Ne reči »v EU« za današnje stanje.** | Razdelek 1.2 K | Ian | — |
| **2.5** | **Izročiti `PRIPOROCILO-PONUDNIK.md`.** To so izrecno zahtevali (»svetujte kateri ponudnik AI storitev je za našo rešitev najbolj primeren«) in je edini izdelek, ki pride pred pogodbo. | `07-odgovori-harvest.md` | Ian | — |
| **2.6** | **Minute na ponudbo izpeljati na sestanku.** Napisali so »Ne razpolagamo s podatkom«. Dokler te številke ni, **nobena številka o prihranku, urah ali dobi vračila ne sme nikjer nastopiti** — tudi 10/15 min iz `PLAN-prenos-zero.md:322` ne, ki je označena kot nepotrjena. Zapisati kot **skupno oceno**, ne kot njihov podatek. | `07-odgovori` | Ian | — |
| **2.7** | **Na glas povedati, da API eDOKUMENTOV nima datuma.** Zaveza obstaja, datuma ni. Za tem enim vratom sedijo **tri postavke zaostanka od petnajstih** (zapis v eDOKUMENTE, poišči-ali-ustvari stranko, zaznamek in opominjanje). Ponudba to že pokriva v drobnem tisku; drobni tisk ni isto kot povedano. | `G1 §5` | Ian | — |
| **2.8** | *(neobvezno, 10 sekund)* Izbrisati simbolno povezavo `~/Library/Mobile Documents/com~apple~CloudDocs/Desktop → ~/Desktop`. Še obstaja, preverjeno danes. Zapre edino odprto neznanko iz G3a brez stroška. | `G3a` | Ian | 10 s |

**Česa pred predstavitvijo NE delati:** ne popravljati kode. Zamrznitev je pravilna. Vse najdene
napake so zapisane kot ugotovitve, nobena ni bila popravljena s strani tega pregleda.

---

## 3. Pred zaključkom Faze 0

Faza 0 traja 1–2 tedna in je po ponudbi pogoj za fiksiranje obsega. **Ob zaključku obe strani pisno
potrdita zaključen nabor polj in kontrol** — to je edina točka, kjer se spodnje odločitve še dajo
zapisati brez aneksa.

### 3.1 Odločitve, ki jih lahko sprejme samo Ian

| # | Odločitev | Zakaj zdaj |
|---|---|---|
| **3.1.1** | Ali **samodejna prehodnost** postane pogodbeni prag ali samo merjena številka. | Razdelek 0. Naše mnenje: merjena, ne zajamčena — podlage za številko ni |
| **3.1.2** | Kako se pokrije **šifrant Zavarovalniškega programa** (razdelek 1.1 E). Predlog: vsebina njihova, preslikava naša, zapisano v zapisnik. | Edina postavka z neznanim obsegom v fiksni ceni |
| **3.1.3** | Ali se **N2 (poišči-ali-ustvari stranko)** absorbira ali ovrednoti posebej. Naše mnenje: **brez tega zapis v eDOKUMENTE ne more delovati**, torej se bo naredilo tako ali tako — vprašanje je samo, kdo plača. | Odkrito šele iz zaslonske slike z dne 30. 7. |
| **3.1.4** | Ali je bila tehnična priloga `Ponudba-PRENOS-ZERO-Harvest-Hub.pdf` stranki kdaj **poslana**. Nosi trditev o EU, ki ne drži. Če je bila, popravek spada v sestanek, ne v opombo. | **Odgovoriti more samo Ian** |
| **3.1.5** | Ali v `PRIPOROCILO-PONUDNIK.md` ostane stavek »Če ste v katerem koli našem zgodnejšem gradivu zasledili drugačno navedbo, velja ta dokument.« Naše priporočilo: **ostane** — če priloge niso dobili, stavek nič ne stane; če so jo, ta stavek stvar zapre brez neprijetnega pogovora. | Vezano na 3.1.4 |

### 3.2 Vprašanja, na katera odgovori naročnik (18 postavk, združeno iz G0, G1, G3b, G3c)

Nič od tega ni raziskovalno delo. Vse so odgovori, ki jih nekdo ima.

| # | Odprto | Kaj to zapre |
|---|---|---|
| 1 | **Minute na ponudbo** | Sodelavec zabeleži začetek in konec pri 10 zaporednih ponudbah (~1 dan). Blokira vsako številko o prihranku |
| 2 | Število vključenih sodelavcev | Vprašanje 7 ni bilo odgovorjeno |
| 3 | **Ena surova `.eml` z glavami** | Zapre **tri stvari hkrati**: ali pošiljka pride neposredno ali posredovana (ugnezdene priloge); ali njihov strežnik sploh zapiše `Authentication-Results` (razdelek 1.2 M); in ali je nabiralnik na Exchange Online ali IMAP (razdelek 1.2 O). **Najcenejša datoteka v celotni Fazi 0** |
| 4 | Ali se nabor polj razlikuje med tipi zavarovanj | Vprašanje 5 ni bilo odgovorjeno. Izmerjena matrika po produktih močno kaže, da se |
| 5 | Katera številka gre v `Št. ponudbe` na KLP | Trije resnični pari ponudba → izpolnjen KLP |
| 6 | Pravilo za drugega (pomožnega) zastopnika | **Eno vprašanje — in ta neznanka tiho nosi 15,3 % ocene natančnosti** (razdelek 1.1 B) |
| 7 | **Register zastopnikov** (`ime → NNN-NNNN`) | ~20 vrstic Excela. Te vrednosti **ni v nobenem vhodnem dokumentu** |
| 8 | **Roki hrambe po ZZavar-1 in interni politiki** | Odgovor je bil splošen. **Eno neodgovorjeno vprašanje blokira tri komponente**: arhiv, revizijsko sled in objektno shrambo — nobene se ne da nastaviti brez številke |
| 9 | Ali paket vedno vsebuje Spremni dopis in IPID, kako pogosto je podvojena datoteka `(1)` | Seznam **imen datotek** 20 zaporednih paketov |
| 10 | Dejanska mesečna mešanica produktov | Izvoz **imen map** za en mesec. Brez osebnih podatkov. **Pogoj za sestavo prevzemnega vzorca** |
| 11 | **Ali API eDOKUMENTOV omogoča iskanje strank**, ne le ustvarjanja | Pogoj za K7. Brez tega ni razrešitve podvojenih strank |
| 12 | Ali API podpira strukturirano statusno polje za zaznamek | Sicer zasilna pot |
| 13 | **Datum, ko bo API na voljo** | Danes obstaja zaveza brez datuma. Za tem vratom je tretjina zaostanka |
| 14 | **Testno okolje obeh sistemov** | Za sistem, ki piše v regulirani sistem evidenc, testiranje proti produkciji ni nevšečnost — je sprožilec obstoječe, posebej ovrednotene klavzule iz ponudbe |
| 15 | Ime mape na strežniku za Premoženje in Popotnik | Ponudba to že napoveduje |
| 16 | **Ali sme vsak zaposlen videti zdravstvene dokumente vsake stranke**, ali obstaja meja po vlogah | **En stavek od njih.** Če se to vpraša po tem, ko je nadzorna plošča zgrajena, je to predelava, ne nastavitev |
| 17 | Kateri modeli bodo dejansko odobreni na njihovem računu v Frankfurtu, in katere regije doseže njihov profil obdelave | Prvi korak Faze 0 po odprtju računa |
| 18 | Koliko dokumentov na ponudbo gre skozi branje AI | **Glavna spremenljivka stroška delovanja** — niha med ~7 € in ~55 € mesečno. Zapre se s potrjenim naborom polj |

### 3.3 Kar mora v zapisnik Faze 0, ker se pozneje ne da

- Protokol prevzemnega testa iz `G4 §1.7` (A–G) — štiri ocene celice, tri številke, sestava vzorca
  iz izvoza imen map, **vzorec zapečaten pisno pred zagonom**, neodvisen prepis resnice, paket za
  ponovljivost, in **izrecno napisano, česa test ne pokriva** (hitrost, razpoložljivost njihovih
  sistemov, oblike dokumentov, ki niso bile potrjene).
- Stavek o **ukinitvi modela** (razdelek 1.1 D) — predlog besedila v `G4 §3.1`, skupaj z drugim
  stavkom, ki ščiti obe strani: vsaka taka prilagoditev sproži **ponovitev prevzemnega testa**,
  ker je natančnost lastnost modela, ne kode.
- **Razmejitev šifranta** (razdelek 1.1 E).
- **Omejen pomen »sistem se uči«** (razdelek 1.1 F).
- **Ena vrstica o pričakovanem času obdelave**, izrecno kot pričakovanje in **ne** kot jamstvo.
  Hitrost je edina vrstica v razmejitveni tabeli, ki je ponudba niti ne obljublja niti ne izključuje.

---

## 4. Pred prvim resničnim dokumentom v produkciji

> **Sprožilec je bistveno prej, kot kdorkoli načrtuje.** Ponudba obljublja: »Prve rezultate branja
> na svojih dokumentih vidite v **tretjem tednu**.« To je prvi resnični produkcijski dokument —
> teden 3, ne ob zagonu, in dolgo preden ploščad sploh obstaja.

| # | Kontrola | Dokaz, da obstaja | Nosilec |
|---|---|---|---|
| **A1** | **Produkcijska pogodba o obdelavi podpisana.** Pogodba za ocenjevanje tega ne pokriva in to sama pove. | Podpisan dokument | Ian + naročnik |
| **A2** | **Račun pri AWS v Frankfurtu, hramba nastavljena na »nič«, zaklenjeno s pravilom.** Če model zahteva hrambo, se zahtevek **zavrne z napako**, namesto da bi se tiho hranil. En klic in eno pravilo. | Izpis nastavitve + priloženo pravilo | naročnik nastavi, AIS določi |
| **A3** | **Beleženje vsebine zahtevkov potrjeno izklopljeno.** Privzeto je izklopljeno, a ko se vklopi, zapisuje **celotno telo zahtevka** (in slike strani) v shrambo **brez samodejnega poteka**. | Izpis, da konfiguracije ni | AIS preveri |
| **A4** | **Profil obdelave potrjeno omejen na EU.** Kjer hramba velja in je čezregijska obdelava vklopljena, se hranjeni podatki shranijo v ciljnih regijah — trditev o EU je torej odvisna od tega profila. | Izpis regij profila | AIS preveri |
| **A5** | **Dokumenti izven vsakega repozitorija, na šifrirani napravi.** Danes drži (razdelek 1.2 H) — mora **ostati** držati. | `git ls-files` prazen + `drwx------` | AIS |
| **A6** | **Imenovan seznam ljudi pri AIS**, ki smejo odpreti resničen dokument, pisno. | Seznam, po § 4 pogodbe o obdelavi | AIS |
| **A7** | **Roki hrambe pridobljeni** (3.2, točka 8). | Njihov pisni odgovor | naročnik |

---

## 5. Pred prvim zapisom v eDOKUMENTE ali Zavarovalniški program

| # | Kontrola | Dokaz | Nosilec |
|---|---|---|---|
| **B1** | **Preverjanje pošiljatelja v vhodni poti** — SPF + DKIM iz `Authentication-Results`; nepreverjene pošiljke v izjeme (razdelek 1.2 M). | Test, ki podtakne ponarejeno pošiljko in preveri, da gre v karanteno | AIS |
| **B2** | **Omejena poverilnica nabiralnika** — samo branje, samo en nabiralnik, **ločena identiteta za odhodno pošto**. Ena poverilnica, ki hkrati bere nabiralnik s podatki po 9. členu in pošilja pošto v imenu podjetja, je natanko tisto, česar standard ne dovoli. | Če Exchange: izpis, da je v obsegu ta nabiralnik in ni drug. Če IMAP: podpisan seznam nadomestnih ukrepov | AIS + njihova informatika |
| **B3** | **Imenovani servisni računi** v obeh ciljnih sistemih, brez pravic brisanja in prepisa, vidni pod svojim imenom v **njihovi** revizijski sledi. | Potrditev dobavitelja | naročnik + dobavitelja |
| **B4** | **Okrevanje po delno uspelem zapisu.** Nikjer — ne v G1, ne v načrtu, ne v ponudbi — ni zapisano, kaj se zgodi, ko so dokumenti preneseni, metapodatki pa ne, ali ko je stranka ustvarjena, zapis ponudbe pa ne. Brez tega revizijska sled zapiše uspeh za delen zapis, **drugi poskus pa ustvari natanko tisto podvojeno stranko, ki jo K7 preprečuje**. | Test, ki ubije povezovalnik sredi zapisa in preveri, da ni podvojitve in ni lažnega uspeha | AIS |
| **B5** | **Revizijska sled ne nosi osebnih vrednosti** (razdelek 1.2 L). Gradnja že ima pravi refleks: `runstats.js` ima test, ki trdi, da modul ne vsebuje ničesar denarnega. **Ista disciplina, uporabljena za osebne podatke, JE ta kontrola.** | Test, ki pade, če pisalec sledi dobi vrednost tam, kjer pričakuje ime polja | AIS |
| **B6** | **Meja obsega in stroška** — omejitev na uro in na dan, ki pade v izjeme; največja velikost priloge in število strani; opozorilo na proračun. Standardna »nezaščitena končna točka AI« tu ne obstaja — **zloraba se dogaja po poštnem kanalu**, ki je odprt vsakomur, ki izve naslov, in nič ga ne omejuje. | Nastavitev + test, da se N+1. pošiljka postavi v vrsto | AIS + naročnik |
| **B7** | **Prijava v nadzorno ploščo** — identiteta na uporabnika (brez skupne prijave), resnično preverjanje z dvema dejavnikoma, potek seje, PDF-ji za prijavo. **Zasnove prijave danes ni nikjer.** Jamstvo 2 zahteva, da se ve, **kateri** sodelavec je podatek sprostil, sicer nima nosilca. | Anonimna zahteva na pot konzole in na naslov dokumenta vrne 401/403 | AIS |
| **B8** | **Pisno pravilo dostopa od naročnika** (3.2, točka 16). | En stavek od njih, spremenjen v vlogo | naročnik |
| **B9** | **Testni okolji obeh sistemov** — ali pa se sproži obstoječa, posebej ovrednotena klavzula. | Delujoči testni dostopi | naročnik + dobavitelja |
| **B10** | **Skrivnosti v upravitelju skrivnosti, zaseben repozitorij, verzioniran pregled pred oddajo.** | Čist izpis pregleda + nastavitev vidnosti repozitorija | AIS |

**Nič v razdelkih 4 in 5 ne širi obsega `03-uradna-ponudba.md`.** A2–A4, B1, B4–B7 so izvedbene
lastnosti komponent, ki so že prodane; A1 in paket ob predaji sta pogodba in dokumentacija, ki ju
ponudba že imenuje.

---

## 6. Pred predajo

Na dan zadnjega plačila naročnik dobi: račun pri AWS z dostopom do modelov, gostitelja, bazo
osebnih podatkov po 9. členu, nespremenljiv arhiv vsakega kdaj prejetega dokumenta, poverilnice za
pisanje v dva ključna sistema, poverilnico nabiralnika in konzolo, dosegljivo njihovim zaposlenim.
Od istega trenutka dobi tudi: menjavo ključev, popravke, preverjanje varnostnih kopij, pregled
dnevnikov, odzivanje na incidente in uro hrambe.

**Vrzel ni, da so zavrnili vzdrževalno pogodbo — to je bila njihova pravica in se spoštuje skozi
ves ta pregled. Vrzel je, da nihče ni zapisal, kaj dobijo v roke.** Dokumentacija **je** v obsegu.

Celoten seznam enajstih postavk je v `G4 §2.2`, slovensko in v obliki kontrolnega seznama, kjer je
vsaka vrstica **izdelek, ne obljuba**. Tri, ki jih je najlažje spregledati:

- **Postavka 5 — merilno orodje.** Skripta, s katero **naročnik sam** kadarkoli izmeri natančnost na
  svojih dokumentih. V ponudbi ni omenjena in je najkoristnejša postavka celotnega paketa: spremeni
  »zdi se mi, da dela slabše« iz razprave v meritev, ki jo opravi sam, v pol ure in za nekaj evrov.
  Podlaga: prevzemni test stane **~2 USD** za 100 ponudb po eni strani oziroma **~14 USD** za cel
  paket. Popravna cikla sta zato finančno nična.
- **Postavka 8 — seznam prepovedi.** Tri kljukice, od katerih vsaka v **njihovem** računu ustvari
  trajno zbirko posebne vrste osebnih podatkov: deljenje podatkov s ponudnikom modela, beleženje
  vsebine zahtevkov, oddaja prevzemnega korpusa 100 resničnih ponudb v repozitorij.
- **Postavka 11 — ena vaja iz priročnika izvedena v živo** na eni od dveh delavnic, po možnosti
  obnovitev iz varnostne kopije. Postopek obnovitve, ki ni bil nikoli izveden, ni postopek.

Poleg tega **sedem scenarijev priročnika za obratovanje** (`G4 §2.3`), od katerih je najbolj
pomemben ② »natančnost je padla«: prvi korak je **meritev, ne ugibanje** — merilno orodje na 20
svežih ponudbah proti izhodiščni meritvi, nato veja na tri (spremenil se je vhod / spremenil se je
model / naša napaka), in samo tretja je napaka po Jamstvu 3. **Ta veja je odločljiva samo zato, ker
izhodiščna meritev obstaja.** To je edini razlog, zakaj je paket ob predaji vreden truda.

---

## 7. Odprte kodne napake — zapisane, nepopravljene

Gradnja je zamrznjena; nič od tega ni bilo popravljeno. Nobena ni ovira za predstavitev.

| # | Kje | Kaj | Kdaj popraviti |
|---|---|---|---|
| D-1 | `claude.mjs:50` | **Predpomnjenje sistemskega poziva je mrtva koda** — 632 žetonov proti pragu 1024, tiho se ne izvede. **Posledica je v našo korist:** objavljenih 0,0193 USD/dokument je cena **brez** predpomnjenja, torej konservativna | ni nujno |
| D-2 | `claude.mjs:83–87` | Izračun cene šteje prebrane predpomnjene žetone po polni ceni. Danes brez učinka (ker D-1), postane resničen v trenutku, ko bi predpomnjenje začelo delovati | pred produkcijo |
| **D-10** | `verify.mjs:100–105` | **Ujemanje z resnico ni bijektivno.** Pri dokumentu, ki se razveji na več kontrolnih listov, se izhod ujema z enoto po imenu zavarovanca, ob neujemanju pa **tiho pade na `units[0]`**. Scenarij: izluščevalnik dvakrat izpiše otroka A → število se ujema, oba izhoda se ocenita proti A, oba dosežeta 100 %, **izginotje otroka B je nevidno**. Danes en dokument; na 100 resničnih ponudbah z otroki je to živa luknja v **pogodbeni** številki | **pred prevzemnim testom** |
| D-11 | `verify.mjs` | Ena skupna odstotna vrednost, brez razčlenitve po vrsti polja — natanko to omogoča, da se 22,9 % skrije | pred prevzemnim testom |
| D-3 | `claude.mjs:79–82` | **ZAPRTO.** Cene preverjene danes proti katalogu modelov, ujemajo se | — |
| D-4, D-5 | `README.md:96–97, 128–132` | **Zastarelo po današnji selitvi datotek** — bralca pošlje na napačne poti. Past pri vaji pred sestankom | pred vajo |
| D-6 | `server.mjs:84` | `GET /api/register` ne preverja metode | nizka |
| D-9 | `lib/layout.js` | **Edini modul brez lastnega testnega paketa**, lastnik praga usmerjanja. Danes še bolj pomembno kot ob zapisu — glej razdelek 1.3 | pred produkcijo |
| G2 red | ponovljivost | **Ni zapisane različice izvajalnega okolja, ni CI, nedokumentirani odvisnosti** (`python3` + PyMuPDF, Chrome na trdo zapisani poti macOS). Danes je vse teklo, ker je teklo na računalniku, kjer je nastalo | do predaje |

---

## 8. Odkrit pošten pregled protokola samega

To je za tvoj produkt pomembnejše od laskave ocene, zato brez olepšav.

### 8.1 Katera vrata so si zaslužila svoje mesto

| Vrata | Sodba | Utemeljitev |
|---|---|---|
| **G3a — varnost obstoječega** | **Najvišja vrednost na porabljeno minuto v celotnem teku.** Nedvoumno zaslužena | Našel resnične zdravstvene dokumente stranke v delovnem drevesu **javnega** repozitorija, v nasprotju z našo lastno podpisu pripravljeno pogodbo, in zastavico »nikoli ne vklopi«, ki je bila vklopljena in je te dokumente stregla po HTTP. Oboje odpravljeno isti dan. Nobena druga metoda tega ne bi našla pred stranko |
| **G3b — ponudnik in regija** | **Zaslužena, in edina, ki je proizvedla izdelek za stranko** | Odgovorila na vprašanje, ki so ga izrecno postavili, in **ubila napačno trditev v našem lastnem gradivu z živim testom**, ne z domnevo |
| **G3c — varnost produkcijske zasnove** | **Zaslužena — in v protokolu je sploh ni** | Devet rdečih proti **zasnovi** stane danes nič; šest jih je po gradnji nepopravljivih brez predelave. Nespremenljiva sled kot neizbrisljiva zbirka po 9. členu in nepreverjen vhodni kanal sta obe strukturni in obe bi po gradnji pomenili predelavo |
| **G4 — prevzem in predaja** | **Zaslužena, in našla največjo posamično postavko** | 30 % pogodbene vrednosti je viselo na testu, ki ga nihče ni specificiral. Razdelek 0 tega pregleda je iz teh vrat |
| **G1 — načrt ciljnega stanja** | **Zaslužena, iz enega razloga** | Pravilo »vsaka avtomatizacija ima **imenovan** nosilni artefakt« je tisto, kar je razkrilo K13 in K15 — dve prodani obljubi z nič kode za njima. Brez tega pravila bi ostali nevidni do predaje. Razpad koraka A5 na štiri je bil drugi tak zadetek |
| **G0 — posnetek procesa** | **Zaslužena šele po tem, ko je bilo 80 % standardnega izpisa zavrženo** | Vrednost je bila **izmerjena raven dokumentov** (12/15 z besedilnim slojem, matrika polj po produktih, družine številk ponudbe, tri oblike istega podatka). Standardni izpis — skeniranje celotnega podjetja, organigram, ocena pripravljenosti na AI, razvrstitev priložnosti po oddelkih — je bil mrtva teža in bi pomenil prodajanje nazaj dela, ki ga je stranka opravila sama v svoji 5-stranski specifikaciji |
| **G2 — register izdelkov** | **Najšibkejša vrata v teku** | Popis 18 datotek s `sha256` in trajnimi identifikatorji je bil obred za 8 modulov brez korakov gradnje. Kar si je **res** zaslužilo mesto, je bil **seznam vrzeli, preslikan ena-na-ena proti tabeli OBSEG zavezujoče ponudbe** — in tega v protokolu ni, to je lokalna iznajdba. Če G2 preživi, naj preživi v tej obliki |

### 8.2 Kaj je bila mrtva teža

Za to angažiranost — en proces, eno podjetje s pet ljudmi, 12.000 €, izrecno zavrnjena vzdrževalna
pogodba — je bilo neuporabno naslednje, in vsakič je bilo izpuščeno z zapisanim razlogom:

- **Izolacija najemnikov / RLS / pgTAP.** En najemnik. Ni baze. Ta razdelek bi bil čisto polnjenje
  predloge. Uporabna **lokalna** oblika istega vprašanja — *kateri ljudje znotraj Harvest Hub smejo
  videti dokumente po 9. členu* — v protokolu ne obstaja in je bila iznajdena tu.
- **Aparat `.protocol/artifacts.json`, dokazne datoteke na kontrolo, `gate-check`.** Ena
  angažiranost, en izdelek. Dokazila sodijo v besedilo, kjer jih bo bralec videl.
- **Skeniranje celotnega podjetja in ciljni model celotnega podjetja** (G0, G1). Nikoli kupljeno.
- **Ocena pripravljenosti za vlagatelje** (celoten steber ④). Ne zbirajo kapitala. **Celotna vrata
  je bilo treba na novo izumiti** kot prevzem in predajo.
- **Vsaka številka ROI, ur, prihranka in dobe vračila.** Protokol jih zahteva in **predpostavlja, da
  podatek obstaja**. Stranka je pisno napisala, da ga nima. Vsaka taka številka bi bila izmišljena.

### 8.3 Tri ugotovitve za tvoj produkt

**1. Protokol predpostavlja preobrazbo podjetja. Približno 60 % njegovega standardnega izpisa je
bilo tu nepomembnega.** To ni napaka protokola — je napaka manjkajočega profila. Priporočam
**profil »ena angažiranost, en proces«**, ki privzeto izpusti: skeniranje podjetja, ciljni model
podjetja, register artefaktov s trajnimi identifikatorji, RLS/najemnike, aparat `.protocol/`, steber
za vlagatelje in vso aritmetiko ROI. Kar ostane, se prilega na sedem dokumentov, ki jih lahko
prebere direktor zavarovalniške agencije.

**2. Preživelo je natanko tisto, kar ima pripeto dokazno pravilo.** »PASS samo ob datoteki, izpisu
ukaza ali vrstici izvorne kode; vse drugo je RDEČE ali NEZNANO« je edino pravilo v celotnem
protokolu, ki je proizvedlo vsako posamezno ugotovitev v razdelku 0 in 1. Vrata brez tega pravila
(G0, G2 v standardni obliki) so proizvedla opis. **Če iz protokola prodajaš eno stvar, prodaj to
pravilo.** Ostalo je struktura okoli njega.

**3. Protokol ima ena vrata za varnost; potrebuje jih dvoje.** G3a (kar obstaja) in G3c (zasnova,
preden je napisana) sta se izkazala za **popolnoma različni vrsti dela z različnimi izkupički**:
G3a je našel uhajanje podatkov, ki se je že zgodilo; G3c je našel devet strukturnih odločitev, od
katerih šestih po gradnji ni več mogoče popraviti brez predelave. Združena v ena vrata bi drugo od
obojega izpadlo, ker je prvo bolj nujno. To je najbolj koristna sprememba, ki jo lahko narediš.

**Dodatek, neprijeten in resničen:** vrata, ki so proizvedla največ vrednosti, so bila tista o
**tveganju in pogodbi** (G3a, G3b, G3c, G4), ne tista o **zasnovi** (G0, G1). G0 in G1 sta v veliki
meri na novo izpeljala tisto, kar sta strankina lastna specifikacija in naš lastni prikaz že
vsebovala. Če bi ta pregled tekel s polovico časa, bi izpustil G0 in G2 in ne bi izgubil skoraj
ničesar iz razdelka 0.

---

## 9. En stavek za sestanek, če se odpre vprašanje pogodbe o obdelavi

> *Pogodba, ki jo imate pred sabo, pokriva 15 vzorcev in prikaz, in se namenoma tam ustavi.
> Produkcija dobi svojo pogodbo, pred Fazo 1, in bo drug dokument, ker je produkcija drug sistem.*

To je 1. točka te pogodbe, povedana na glas.

---

## Priloga — kaj je bilo za ta pregled pognano

| Kaj | Rezultat |
|---|---|
| Branje vseh sedmih vrat + `03`, `07`, `06`, `02`, `PLAN`, `04` | podlaga |
| `curl` na `127.0.0.1:8020/`, `localhost:8020/`, `0.0.0.0:8020/`, `/api/register` | 200 · 200 · **403** · 200 — potrjuje popravek in tveganje iz razdelka 2.1 |
| `ps -eo lstart` na strežniškem procesu | teče od 11:19:35, torej na kodi z 11:16 |
| `stat` mtime na vseh datotekah pod `demo/`, dvakrat (ob ~11:20 in ob 11:34:39) | **osem datotek spremenjenih med tekom tega pregleda**, zadnja `package.json` ob 11:34:46 — razdelek 1.3 |
| `node scripts/test-gate.mjs` · `test-classify` · `test-edokumenti` · `test-runstats` | 69/69 · 50/50 · 77/77 · vse uspele — **285 trditev, pognanih ob ~11:32**, torej po `layout.js` in **pred** `package.json` |
| `test-classify` nad vseh 15 resničnih PDF | `1 clen545 · 2 klp · 3 nebrano · 8 ponudba · 1 privolitvena` — nespremenjeno |
| `ls -la ~/ais-client-data/harvest-hub`, `ls ~/Downloads`, `ls -ld` simbolne povezave CloudDocs | podatki zunaj drevesa (`drwx------`) · zipa izbrisana · **simbolna povezava še obstaja** |
| Branje `demo/lib/claude.mjs` (konstante cen, pripeti modeli) | `PRICES` preverjene proti katalogu modelov — **D-3 zaprt** |

**Nobena datoteka pod `demo/` ni bila odprta za pisanje. Plačani prevzemni pripomoček ni bil
pognan** — ponovno pošiljanje zdravstvenih dokumentov po 9. členu na končno točko v regiji `global`
zaradi potrditve štiri dni stare številke ni sorazmerno. Sorazmerna zamenjava, če jo želiš pred
sestankom: **en zagon po besedilni poti, 8 dokumentov, ~0,05 USD, ~40 s.**
