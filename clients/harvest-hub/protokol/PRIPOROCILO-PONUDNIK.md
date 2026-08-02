# Priporočilo ponudnika AI storitev in kraja obdelave podatkov

**Za:** Harvest Hub, zavarovalniško zastopanje d.o.o.
**Od:** AIS Slovenija — Anej Vučič s.p.
**Datum:** 30. julij 2026

> **Vaše vprašanje (odgovori z dne 30. 7. 2026):** »Zaenkrat računa še nimamo, svetujte kateri
> ponudnik AI storitev je za našo rešitev najbolj primeren?«

---

## Odgovor

Priporočamo **Amazon Bedrock v regiji Frankfurt (`eu-central-1`), z evropskim profilom obdelave.**

Model je isti Claude, kakršnega ste videli na prikazu — razlika je v tem, kje se obdelava izvede in
s kom sklenete pogodbo. Pri tej izbiri obdelava ostane **znotraj regij Evropske unije**, vaš
pogodbeni obdelovalec je **AWS kot evropska pravna oseba**, izdelovalec modela pa do te
infrastrukture nima dostopa. Račun je in ostane **vaš**, kot piše v ponudbi; mi vam samo povemo,
kateri odpreti.

Stane vas približno **10 % več na porabljeno enoto besedila — pri vašem obsegu okoli 5 € mesečno.**
Za dokumentacijo, ki vsebuje zdravstvene podatke in podatke o otrocih, je to najceneje kupljena
skladnostna prednost v celotnem projektu.

**Dvoje, kar morate vedeti, ker je preverjeno in ker vpliva na vašo presojo:**

1. **Neposredni račun pri izdelovalcu modela obdelave v EU ne omogoča.** To ni domneva — 30. 7. 2026
   smo to preizkusili na živem vmesniku. Izpis testa je v Prilogi A. Na voljo sta samo globalna
   usmeritev in Združene države.
2. **Prikaz, ki ste ga videli oziroma ga boste videli, danes teče na globalni usmeritvi.** Tako je
   tudi zapisano v pogodbi o obdelavi za fazo ocenjevanja, ki jo imate. Ta dokument opisuje, kako se
   to za produkcijo spremeni. Če ste v katerem koli našem zgodnejšem gradivu zasledili drugačno
   navedbo o kraju obdelave, **velja ta dokument.**

---

## 1. Pravilo, po katerem je pisan ta dokument

Trditev je označena kot **preverjeno** samo, če zanjo obstaja izpis opravljenega testa ali
dokumentacija ponudnika, ki smo jo dejansko prebrali. Vse ostalo je označeno kot **odprto** in je
zbrano v 8. razdelku.

| # | Trditev | Status | Podlaga |
|---|---|---|---|
| 1 | Neposredni vmesnik izdelovalca modela sprejme samo globalno usmeritev in ZDA; evropske ne | **Preverjeno** | Priloga A — naš test, 30. 7. 2026 |
| 2 | Prikaz danes teče na globalni usmeritvi | **Preverjeno** | Priloga A — odgovor vmesnika izrecno navede `global` |
| 3 | Bedrock ponuja evropski profil obdelave v 8 regijah EU, vključno s Frankfurtom | **Preverjeno** | dokumentacija ponudnika, tabela regij |
| 4 | Evropski profil stane +10 % na enoto besedila | **Preverjeno** | dokumentacija ponudnika, cenik |
| 5 | Cene modelov, na katerih temelji izračun v 5. razdelku | **Preverjeno** | uradni cenik modelov, preverjen 30. 7. 2026 |
| 6 | Bedrock privzeto ne hrani vhodov in izhodov in noben operater storitve do njih nima dostopa | **Preverjeno** | dokumentacija AWS, brano 30. 7. 2026 — dobesedno: »by default, Amazon Bedrock does not store model inputs or outputs« in »no operators of the service can access model input or output« |
| 7 | Podatki se ne uporabljajo za učenje modelov | **Preverjeno** | dokumentacija izdelovalca o hrambi — »Retained data is never used for model training without your express permission« |
| 8 | Microsoft Foundry nima evropskega podatkovnega območja | **Preverjeno** | dokumentacija ponudnika — na voljo sta samo globalna in ameriška postavitev |
| 9 | Selitev naše rešitve na Bedrock je zamenjava naslova, prijave in imena modela | **Preverjeno** | pregled celotne izvorne kode rešitve — glej 6. razdelek |
| 10 | Kateri točno modeli bodo odobreni na **vašem** računu | **Odprto** | vidno šele v konzoli po odprtju računa — 8. razdelek |

---

## 2. Kje se podatki obdelujejo in po kateri pravni podlagi

To je razdelek, ki ga bo verjetno bral vaš pooblaščenec za varstvo podatkov.

| | **Danes — faza ocenjevanja** | **Po izbiri Frankfurta — produkcija** |
|---|---|---|
| Kraj obdelave | Zunaj EU, privzeta globalna usmeritev | **Regije Evropske unije** |
| Kdo je obdelovalec pri AI | Izdelovalec modela, družba v ZDA | **AWS**, evropska pravna oseba, s katero pogodbo sklenete **vi** |
| Prenos v tretjo državo | **Da** — pokrit s standardnimi pogodbenimi klavzulami | **V tem delu ga ni** |
| Dostop izdelovalca modela do vsebine | Po pogodbenih pogojih | **Brez dostopa do infrastrukture** |
| Uporaba za učenje modelov | Ne | Ne |
| Kaj to ureja | Pogodba o obdelavi za ocenjevanje, ki jo imate | **Ločena produkcijska pogodba o obdelavi, sklenjena pred Fazo 1** |

**Zakaj je to za vas bistveno in ne kozmetično.** Zdaj gre za prenos osebnih podatkov v tretjo
državo, ki ga je treba pokrivati s standardnimi pogodbenimi klavzulami, zabeležiti v evidenci
dejavnosti obdelave in po potrebi zagovarjati pred nadzornikom. Pri **posebni vrsti osebnih podatkov
po 9. členu GDPR** — zdravstveni podatki, med njimi podatki o otrocih — je to razlika med tem, da
prenos v tretjo državo utemeljujete, in tem, da ga v tem delu preprosto ni.

Pravno je tudi pot skozi tretjo državo mogoča — GDPR je ne prepoveduje, če obstaja veljavna
varovalka. Ni pa je treba izbrati, ko alternativa stane 5 € mesečno.

---

## 3. Kaj se s podatki zgodi

Štiri stvari, vsaka s svojo podlago.

**① Privzeto se ne hranijo.** Dokumentacija AWS navaja, da Bedrock privzeto ne shranjuje vhodov in
izhodov modela in da noben operater storitve do njih nima dostopa. Ker izdelovalci modelov nimajo
dostopa do računov, v katerih storitev teče, tudi nimajo dostopa do dnevnikov, pozivov ali odgovorov.

**② To privzeto vrednost je treba zakleniti, ne le podedovati — in to bomo naredili.** Pri nekaterih
novejših modelih se privzeta vrednost razlikuje: zahtevajo hrambo do 30 dni in privolitev v deljenje
prometa z izdelovalcem modela za zaznavanje zlorab, kar lahko vključuje **človeški pregled**. Za
zdravstvene podatke o otrocih je to povsem druga podatkovna slika in se ne sme zgoditi po nesreči,
ker bi kdo zamenjal ime modela.

Zato v Fazi 0 na ravni vašega računa nastavimo **hrambo na »nič«** in jo zaklenemo s pravilom.
Posledica te nastavitve, dobesedno po dokumentaciji: nobeni podatki zahtevka ali odgovora se ne
zapišejo v trajno shrambo in se ne delijo z izdelovalcem modela — in če bi kak model hrambo
**zahteval**, se zahtevek **zavrne z napako**, namesto da bi se tiho hranil. To je pomembno: napaka
je vidna, tiha hramba ni.

**③ Ena nastavitev, ki je ne smete nikoli vklopiti.** Bedrock ima možnost beleženja vsebine
zahtevkov. Privzeto je izklopljena. Ko se vklopi, zapisuje **celotno telo zahtevka** — torej
besedilo dokumenta, pri skeniranih dokumentih pa tudi sliko strani — v vaš lastni prostor za
shranjevanje, **brez samodejnega poteka veljavnosti**. Nekdo, ki bi čez pol leta odpravljal napako
pri branju, bi to stikalo našel. To bo zapisano med prepovedmi v dokumentaciji ob predaji, skupaj z
alternativo: beleži se število obdelanih dokumentov in poraba, nikoli vsebina.

**④ Za učenje modelov se ne uporabljajo.** Dokumentacija izdelovalca navaja, da se hranjeni podatki
nikoli ne uporabijo za učenje modelov brez izrecnega dovoljenja, in da se vsebina pogovorov privzeto
ne hrani. To je bila trditev že v ponudbi in po preverbi drži.

---

## 4. Zakaj Frankfurt in ne kaj drugega

### 1. mesto — Amazon Bedrock, Frankfurt, evropski profil obdelave ★ priporočamo

| | |
|---|---|
| Obdelava | Znotraj regij EU |
| Obdelovalec | AWS; pogodbo o obdelavi sklenete z njim |
| Dostop izdelovalca modela | Brez dostopa do infrastrukture |
| Cena | +10 % na enoto besedila glede na globalno usmeritev |
| Odzivnost | Frankfurt je najbližje vozlišče Ljubljani |
| Predelava naše rešitve | Zamenjava naslova, načina prijave in imena modela; nič drugega |

Trije razlogi, po teži: **pravni položaj se poenostavi** (2. razdelek); **evropski profil razporeja
promet med osmimi regijami EU**, ne med celinami, kar pomeni odpornost na izpad brez tega, da bi
podatki zapustili Unijo; in **cena je zanemarljiva** (5. razdelek).

### 2. mesto — Google Vertex AI, evropska večregijska točka

Po vsebini enakovredna: obdelava znotraj EU, +10 %, obdelovalec je Google. Postavljamo jo za
Bedrock iz dveh **praktičnih**, ne tehničnih razlogov: AWS je v slovenskem finančnem in
zavarovalniškem okolju pogostejši, zato je pot skozi morebitno revizijo krajša; in enoregijske
evropske točke podpirajo le starejše modele, kar vas pri prehodu na novejši model potisne nazaj na
večregijsko točko.

**Vzemite Vertex namesto Bedrocka, če že imate Google Cloud in nimate AWS.** Takrat prihranek pri
uvedbi odtehta zgornja dva razloga.

### 3. mesto — neposredni račun pri izdelovalcu modela

Najpreprostejši in najcenejši: brez računa pri oblaku, brez 10 % premije, celoten nabor funkcij.
**Vendar obdelave v EU ne omogoča** (Priloga A). Sprejemljivo **samo**, če se zavestno odločite, da
obdelavo zunaj EU pokrijete s standardnimi pogodbenimi klavzulami in to zapišete v evidenco
dejavnosti obdelave.

### 4. mesto — Microsoft Foundry: odsvetujemo

Na voljo sta samo globalna in ameriška postavitev. **Evropskega podatkovnega območja ni.** Za vašo
zahtevo torej ne reši ničesar, kar ne bi rešil že neposredni račun, doda pa še eno pogodbeno stranko.
Če imate Azure iz drugih razlogov, to presoje glede regije ne spremeni.

---

## 5. Kaj to stane

**Osnova ni ocena, ampak meritev.** 27. 7. 2026 smo pognali celotno branje na **11 resničnih
dokumentih iz vaših vzorcev**: skupaj **0,2118 USD**, torej **0,0193 USD na dokument** (8 dokumentov
po hitri besedilni poti, 3 po vizualni). Cene modelov, na katerih ta izračun stoji, so bile
ponovno preverjene 30. 7. 2026.

| Dokumentov z branjem AI na ponudbo | 400 ponudb / mesec | z evropsko premijo (+10 %) |
|---|---|---|
| 1 | ≈ 7 € | ≈ 8 € |
| 2 | ≈ 14 € | ≈ 16 € |
| 3 | ≈ 21 € | ≈ 24 € |
| 7 (cel paket) | ≈ 50 € | ≈ 55 € |

Pri 500 ponudbah in vseh 7 dokumentih: ≈ 63 €, z evropsko premijo ≈ 69 €.

**Evropska premija vas torej stane med 1 in 6 € mesečno.** To je zgornja meja tega, kar plačate za
to, da zdravstveni podatki vaših strank ne zapustijo EU. Ocena se ujema z okvirom iz ponudbe
(80–110 € mesečno za AI in gostovanje skupaj).

> **Opozorilo, ki je večje od evropske premije, in ga ne skrivamo.** Ob prehodu na Frankfurt bomo
> najverjetneje prešli tudi na novejšo generacijo modela. Cena na enoto besedila ostane enaka, **novi
> model pa za isto besedilo porabi približno 30 % več enot**. To pomeni okoli 30 % višji račun —
> pri 50 € mesečno je to +15 € mesečno, torej **trikrat toliko kot izbira regije**. Izbira modela je
> tu pomembnejša od izbire regije, zato mora Faza 0 vključevati **meritev**, ne domneve.

**Kje je še prihranek.** Približno 80 % vaših dokumentov ima uporaben besedilni sloj in morda ne
potrebuje najzmogljivejšega modela. Če se na vaših resničnih dokumentih izkaže, da za to pot zadošča
manjši model, pade cena te poti na približno tretjino. **Tega vnaprej ne trdimo** — jamčimo 98 %
natančnost in te meje ne bomo tvegali zaradi nekaj evrov. Izmerimo v Fazi 0 in se odločimo skupaj.

*Preračun v evre uporablja tečaj 1 EUR = 1,08 USD; ob potrditvi proračuna ga posodobimo na dnevnega.*

---

## 6. Zakaj je ta izbira poceni in povratna

Pregledali smo celotno površino, s katero se naša rešitev dotakne ponudnika AI. To je **ena sama
datoteka in en sam klic** s štirimi polji. Iskanje po vsej kodi ni našlo niti ene uporabe funkcij,
ki jih Bedrock ali Vertex ne podpirata.

Zato je selitev **zamenjava naslova dostopne točke, načina prijave in imena modela** — ne predelava
rešitve. To je hkrati razlog, da vam te odločitve **ni treba sprejeti dokončno danes**: če se pozneje
izkaže za napačno, je pot nazaj enako kratka. In je razlog, zakaj v ponudbi piše, da ponudnika in
regijo potrdimo v Fazi 0 — natanko to delamo s tem dokumentom.

---

## 7. Kaj z izbiro EU izgubite

Pošteno: **za vašo rešitev nič uporabnega.** Bedrock in Vertex nimata nekaterih funkcij, ki jih ima
neposredni vmesnik. Preverili smo, česa se vaša rešitev dotakne: **nobene od njih.**

Trije resnični stroški, ki jih ne skrivamo:

1. **+10 % na enoto besedila.** Pri vašem obsegu 1–6 € mesečno.
2. **Odpreti in vzdrževati je treba račun pri AWS.** Nekaj ur dela ob uvedbi. Ker rešitev tako ali
   tako teče na vaši infrastrukturi in gostovanje že plačujete, to za vas ni nova vrsta stroška.
3. **Paketna obdelava z zamikom na Bedrocku ni na voljo.** Ta bi znižala ceno za 50 %, a zahteva
   obdelavo z zamikom do 24 ur. Vaš proces je sproten — ponudba prispe in gre naprej — zato te
   možnosti tako ali tako ne bi uporabili. Omenjamo jo, ker je edini res opuščeni prihranek.

---

## 8. Česa ne vemo

Zapisano pošteno, ker se na to ne da odgovoriti brez vašega računa ali brez meritve.

1. **Kateri točno modeli bodo odobreni na vašem računu AWS v Frankfurtu.** Dostop se odobrava po
   posameznem modelu in po posamezni regiji; konkretno stanje je vidno šele v konzoli.
   **Razreši:** prvi korak Faze 0 — vklop dostopa in izpis seznama razpoložljivih modelov.
2. **Katere regije doseže vaš profil obdelave.** Kjer hramba velja in je vklopljena čezregijska
   obdelava, se hranjeni podatki shranijo v ciljnih regijah. Trditev o EU je torej odvisna od tega,
   da je profil omejen na EU — kar preverimo, ne predpostavimo.
   **Razreši:** izpis regij profila ob odprtju računa.
3. **Koliko dokumentov na ponudbo bo dejansko šlo skozi branje AI.** Od tega je odvisna cena in
   razpon je od ~8 € do ~55 € mesečno. **Razreši:** nabor polj, ki ga obe strani pisno potrdita ob
   zaključku Faze 0.
4. **Ali manjši, cenejši model doseže 98 % na vaših dokumentih.** Če da, pade cena besedilne poti na
   tretjino. **Razreši:** meritev na 100 ponudbah iz prevzemnega testa.
5. **Ali je za ta obseg obdelave podatkov po 9. členu potrebna ocena učinka (DPIA).** Sodeč po
   obsegu in vrsti podatkov je verjetno, a to je **pravna presoja**, ki je naša ponudba izrecno ne
   vključuje. **Razreši:** vaš pooblaščenec za varstvo podatkov ali zunanji pravni svetovalec.
   Podatke o arhitekturi, ki jih za to potrebuje, mu priskrbimo mi.

---

## 9. Kaj je treba storiti in kdo to stori

| Korak | Kdo | Kdaj |
|---|---|---|
| Odločitev: Frankfurt (priporočeno) / Vertex EU / neposredni račun | Harvest Hub | pred Fazo 0 |
| Odprtje računa AWS in vklop dostopa do modelov v Frankfurtu | Harvest Hub | Faza 0 |
| Nastavitev hrambe na »nič« in zaklep s pravilom; preverba, da je beleženje vsebine izklopljeno; preverba, da je profil omejen na EU | AIS določi, Harvest Hub nastavi | Faza 0 |
| Podpis pogodbe o obdelavi z AWS | Harvest Hub | **pred prvimi resničnimi podatki** |
| Sklenitev **produkcijske** pogodbe o obdelavi med nama | obe strani | **pred Fazo 1** |
| Meritev natančnosti in cene po modelih na vaših dokumentih | AIS | Faza 0 |

**Ena opomba o pogodbi.** Pogodba o obdelavi, ki jo imate, pokriva 15 vzorčnih dokumentov in prikaz,
in se namenoma tam ustavi — tako piše v njeni prvi točki. Produkcija dobi svojo pogodbo, sklenjeno
pred Fazo 1, in bo drug dokument, ker je produkcija drug sistem. Izbira Frankfurta je eden od
razlogov, zakaj: podobdelovalec se spremeni iz družbe v ZDA v AWS v EU, in prenosa v tretjo državo v
tem delu ni več.

---

## Priloga A — izpis testa, 30. julij 2026

Test proti neposrednemu vmesniku izdelovalca modela, s parametrom za regijo obdelave:

```
regija = "eu"            → HTTP 400
  "inference_geo: must be one of ['global', 'us']"

regija = "europe"        → HTTP 400  (ista napaka)
regija = "eu-central-1"  → HTTP 400  (ista napaka)
```

Ista napaka se vrne pri vseh preizkušenih modelih. **Vrednosti za Evropsko unijo na neposrednem
vmesniku ni.**

Klic brez tega parametra — točno tako, kot ga pošilja prikaz — vrne:

```json
{ "usage": { "inference_geo": "global" } }
```

To je neposreden dokaz, da prikaz danes teče na globalni usmeritvi, in razlog, zakaj za produkcijo
priporočamo Frankfurt.

---

**AIS Slovenija — Anej Vučič s.p.** · Habičeva ulica 11, 1291 Škofljica · ais-slovenia.si
