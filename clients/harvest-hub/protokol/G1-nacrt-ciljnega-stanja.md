# G1 — Načrt ciljnega stanja: proces PRENOS

**Naročnik:** Harvest Hub, zavarovalniško zastopanje d.o.o. · **Izvajalec:** AIS Slovenija — Anej Vučič s.p.
**Datum:** 30. 7. 2026 · **Vrata:** G1 (BLUEPRINT) protokola AI Infrastructure Protocol
**Podlaga:** `G0-posnetek-procesa.md` (30. 7. 2026), `07-odgovori-harvest.md` (30. 7. 2026),
`03-uradna-ponudba.md` (26. 7. 2026, zavezujoča), `G3a-varnost-obstojecega.md`, `G3b-ponudnik-in-regija.md`
**Status vrat:** ⚠️ **DELNO ZELENO** — vsak korak ima dispozicijo in imenovano komponento, razvrstitev
zaostanka pa ne stoji na urah, ker jih naročnik nima. Razlog v §8.

> **Namen dokumenta.** To je notranji načrt ciljnega stanja in hkrati osnutek izdelka, ki ga ponudba
> dolguje ob zaključku **Faze 0** (»ob zaključku obe strani pisno potrdita zaključen nabor polj in
> kontrol«, `03-uradna-ponudba.md`, IZVEDBA). Ko bodo odprte točke iz §6 zaprte, se ta dokument
> dopolni s potrjenimi vrednostmi in podpiše — ne piše se znova.

---

## 0. Kaj iz standardnega G1 tu namenoma ni

Protokolov G1 predpisuje ciljni operativni model **celotnega podjetja**, z dispozicijo za vsak proces
vsakega oddelka in razvrstitvijo zaostanka po **urah in donosnosti**. Tu izdelujemo ožji izdelek, iz
dveh razlogov, zapisanih že v G0:

1. Naročeni obseg je **en proces** (PRENOS), po fiksni ceni, brez naročnine. Ciljni model drugih
   procesov ni bil naročen in ga ne bomo predlagali kot potrebnega.
2. **Ur ni.** Naročnik je 30. 7. 2026 pisno odgovoril »Ne razpolagamo s podatkom«. Zato v tem
   dokumentu **ni nobene številke o prihranku, urah, dobi vračila ali donosnosti**. Razvrstitev
   zaostanka v §5 stoji na izmerjenih nadomestkih (količina ročnih posegov, blokade, tveganje
   napake) in to je pri vsaki vrstici izrecno zapisano.

Prav tako tu ni ocene v evrih za novo delo iz §4. Te ocene ne pripravlja ta dokument — pripravi jo
Ian, ko se odloči, kako z novim delom ravnati.

---

## 1. Kako brati oznake

Iste kot v G0. Brez oznake ni trditve.

| Oznaka | Pomen |
|---|---|
| **[M]** | **Izmerjeno.** Pognan ukaz ali prebrana vrstica izvorne kode. Vir naveden. |
| **[S]** | **Navedla stranka.** Njena pisna trditev, nepreverjena. |
| **[I]** | **Izpeljano** iz [M] ali [S]; izpeljava zapisana. |
| **[?]** | **Neznano.** V §6 je zapisano, kaj vprašanje zapre. |

Dispozicije so tri, kot jih zahteva protokol:

| Dispozicija | Pomen |
|---|---|
| **AVTOMATIZIRAJ** | Robot izvede korak brez človeka. Privzeta izbira. |
| **PODPRI Z AI** | Robot pripravi, človek potrdi. Izjema, ki jo je treba **utemeljiti**. |
| **OSTANE ČLOVEK** | Robot koraka ne izvaja. Izjema, ki jo je treba utemeljiti. |
| **ZUNAJ NAS** | Korak ni v naši pristojnosti (Merkur, stranka). |

Protokolovo pravilo velja: »ker bi bilo varneje, da to dela človek« **ni** utemeljitev. Utemeljitev
je regulativna zahteva, pogodbena razmejitev odgovornosti ali izmerjena tehnična nezmožnost.

---

## 2. Ciljni model — dispozicija za vsak korak

Koraki A1–A9 so iz `G0-posnetek-procesa.md`, §2. Vsak dobi dispozicijo in **imenovano komponento**,
ki jo izvede. Komponente so opisane v §3.

### Pregled

| Korak (sedaj) | Dispozicija | Komponenta | Stanje danes |
|---|---|---|---|
| **A1** Merkur pošlje pošiljko | ZUNAJ NAS | — | nespremenjeno |
| **A2** Sodelavec odpre in razvrsti | **AVTOMATIZIRAJ** | **K1 Prevzem** + **K3 Razvrstitev** | K3 delno zgrajen |
| **A3** Shranjevanje v mapo na strežniku | **AVTOMATIZIRAJ** | **K2 Arhiv** | ni zgrajen |
| **A4** Ročna kontrola 545. člena | **AVTOMATIZIRAJ** | **K5 Kontrole** | jedro zgrajeno |
| **A5a** Branje podatkov iz dokumentov | **AVTOMATIZIRAJ** | **K4 Branje** | zgrajen in izmerjen |
| **A5b** Preoblikovanje v obliko eDOKUMENTOV | **AVTOMATIZIRAJ** | **K6 Preoblikovanje** | **delno — manjkajo tri delitve** |
| **A5c** Poišči obstoječo stranko ali ustvari novo | **PODPRI Z AI** | **K7 Stranka** | **ni zgrajen — nova naloga** |
| **A5d** Zapis v eDOKUMENTE | **AVTOMATIZIRAJ** | **K8 Prenos eDOKUMENTI** | ni zgrajen, čaka API |
| **A6** Priprava KLP in Privolitvene izjave | A: ZUNAJ NAS · **B: AVTOMATIZIRAJ** | **K9 Generator listin** | zgrajen in izmerjen (B) |
| **A7** Sodelavec potrdi KLP | **PODPRI Z AI** | **K10 Nadzorna plošča** | ni zgrajen |
| **A8** Stranka izpolni in podpiše | ZUNAJ NAS (robot pošlje in opominja) | **K11 Opominjanje** | ni zgrajen |
| **A9** Zapis v Zavarovalniški program | **AVTOMATIZIRAJ — odloženo** | **K12 Šifrant + preslikava** | **odloženo na zahtevo stranke** |
| *prečno* | — | **K13 Ocena zanesljivosti**, **K14 Revizijska sled**, **K15 Učenje iz popravkov**, **K16 Ponudnik AI in regija** | glej §3 |

---

### A1 · Merkur pošlje pošiljko — ZUNAJ NAS

Ne spreminjamo ničesar na strani Merkurja in tega tudi ne predlagamo.

**Kar iz tega koraka vzamemo brezplačno [M]:** zadeva sporočila je strukturirana —
`Harvest Hub …: <PRIIMEK IME>, MERKUR <PRODUKT>, <št. ponudbe>`, pošiljatelj je strojni račun
`eponudbePOS@merkur-zav.si`. Priimek, ime, produkt in številka ponudbe so torej znani, **preden se
odpre en sam PDF**. Vzorec je `n = 1`; potrditev na ~20 zadevah je v §6.

**Odprto [?]:** ali paket prispe neposredno z avtomata ali ga človek posreduje naprej (gnezdene
priloge). Razlika je v zahtevnosti K1, ne v njegovi zasnovi.

---

### A2 · Odpiranje in razvrščanje pošte — **AVTOMATIZIRAJ**

**Komponenti:** K1 Prevzem, K3 Razvrstitev.

Utemeljitve za izjemo ni: korak nima presoje, ki bi je stroj ne zmogel, in nima regulativne zahteve
po človeku. Robot prevzame vso pošto z `ponudbe.merkur@harvest.si`, vsako pošiljko zapiše v
**nespremenljiv arhiv, preden se je karkoli dotakne**, in je idempotenten na `Message-ID` (dvakrat
dostavljena pošta nikoli ne ustvari dveh ponudb).

**Kar mora K3 znati, česar danes ne zna [M]:** prikazna koda razvrsti pet razredov
(`ponudba`, `clen545`, `klp`, `privolitvena`, `neznano` + `nebrano`) in **namenoma** ne razvršča
preostale taksonomije — `lib/classify.js` to izrecno zapiše (»pretending to would be a fabricated
capability«). Ciljni model potrebuje celotni seznam iz 2. točke specifikacije plus `Spremni dopis`
plus **`IPID`**, ki ga je G0 našel v realni mapi in ga specifikacija ne pozna.

---

### A3 · Shranjevanje v mapo na strežniku — **AVTOMATIZIRAJ**

**Komponenta:** K2 Arhiv.

Konvencija je izmerjena **[M]**: `DD.MM. Priimek Ime Številka` (s piko in presledkom, brez leta,
brez pomišljajev) — ne tako, kot jo opisuje specifikacija. Robot potrebuje številko ponudbe in
razdeljeno ime; oboje dobi iz zadeve sporočila (A1) ali iz branja (K4).

Dve odprti mesti, obe že v ponudbi napovedani za Fazo 0:

- **Premoženje in Popotnik nimata devetmestne številke ponudbe** — nosita šestmestno številko
  pogodbe (`70xxxx`, `52xxxx`) **[M]**. Ime mape zanju potrdi naročnik.
- **Podvojena datoteka s pripono `(1)`** v realnem paketu **[M]** — robot potrebuje pravilo
  (obdrži obe / obdrži zadnjo / označi za pregled). Priporočamo: **obdrži obe, označi za pregled**;
  tiho odvrženi dokument je edina napaka v tem koraku, ki je pozneje ni mogoče opaziti.

---

### A4 · Kontrola popolnosti in 545. člena — **AVTOMATIZIRAJ**

**Komponenta:** K5 Kontrole.

Jedro **obstaja in je testirano [M]** (`demo/lib/gate.js`, 123 vrstic, čista logika brez V/I, ista
koda teče v brskalniku in v testu): zadrži paket brez 545. člena, prepusti paket s 545. členom,
in **kolektivno zavarovanje pravne osebe označi kot izjemo namesto da bi ga zadržal** — obe
zahtevani znaki (`kolektivno` **in** `tipZavarovalca === "pravna"`) morata biti izrecno postavljeni,
sicer izjeme ni.

**Meja, ki jo je treba ohraniti in ki je koda že spoštuje [M]:** kontrola preverja **prisotnost, ne
ujemanja**. 545. člen in Privolitvena izjava na sebi nimata **nobene** številke ponudbe in
**nobenega** imena stranke — povezava s ponudbo obstaja izključno prek pripadnosti paketu. Pri
paketu z več ponudbami in enim 545. členom stroj ne more ugotoviti, kateri ponudbi pripada, in tega
tudi ne sme trditi. Ta omejitev gre v Fazo 0 kot zapisana lastnost sistema, ne kot pomanjkljivost.

**Kontrole, ki jih ponudba obljublja in jih danes ni [M]:** kontrolna številka davčne (mod-11),
ujemanje letne premije z obrokom × frekvenco, skladnost imena in naslova med Ponudbo ↔ SEPA ↔ IDD.
Vse tri so deterministične in ne potrebujejo modela — to je prednost, ne pomanjkljivost: kar se da
preveriti aritmetično, se ne sme preverjati verjetnostno.

---

### A5 · Vnos v eDOKUMENTE — razpade na štiri korake

To je mesto, kjer po G0 nastaja največ ročnega dela, in **ni prepis, ampak preoblikovanje**.

#### A5a · Branje podatkov — **AVTOMATIZIRAJ** · komponenta **K4 Branje**

Edina komponenta, katere jedro je že **zgrajeno in izmerjeno [M]**
(`demo/scripts/verify.mjs`, ki uvozi isti `lib/extract.js` kot vmesnik — ne ločen testni pripomoček):

| Meritev (27.–30. 7. 2026) | Vrednost |
|---|---|
| Natančnost na ravni polja | **157/157 = 100,0 %** na 11 dokumentih |
| Tirov | 8 besedilnih · 3 slikovni · **0 napačnih usmeritev** |
| Strošek | $0,0193 / dokument |
| Skenirani dokumenti (v brskalniku, 30. 7.) | 3 dokumenti hkrati, **22,6 s**, brez zastoja, 36/42 polj |

Dvotirnost je utemeljena z meritvijo, ne z domnevo: **12 od 15 vzorcev ima uporaben besedilni sloj,
3 ga nimajo**, razmik med najslabšim digitalnim (535 znakov) in najboljšim skeniranim (132) pa je
**štirikraten [M]** — prag števila znakov je zato trden, ne mejen.

**Kar K4 danes ne pokriva [M]:** bere **samo prvo stran** dokumenta in samo **ponudbo**. Ciljni model
mora prebrati celoten paket. To ni napaka prikaza — prikaz je bil zgrajen za KLP — je pa razlika med
prikazanim in naročenim, ki mora biti tu zapisana.

#### A5b · Preoblikovanje v obliko eDOKUMENTOV — **AVTOMATIZIRAJ** · komponenta **K6 Preoblikovanje**

Od 30. 7. 2026 je ciljni obrazec znan **[S]** (zaslonska slika v `07-odgovori-harvest.md`): razdelki
`IZBERI STRANKO`, `DODATNI PODATKI STRANKE` (**Ime · Priimek** ločeno), `KONTAKT`
(**Email**, **klicna koda** in **številka** ločeno), `NASLOV`
(**Ulica · Hišna številka · Poštna številka · Kraj** — štiri polja).

Izmerjeno stanje kode **[M]** (`demo/lib/klp.js`, vrstice 164–177):

| Delitev | Danes | Za eDOKUMENTE potrebno | Vrzel |
|---|---|---|---|
| Ime → Ime + Priimek | `splitName()` — **samo dvodelna imena**, sicer `null` | Ime + Priimek | tri- in večdelna imena, nazivi pravnih oseb |
| Naslov → Ulica + Pošta | `splitAddress()` — **dvodelno**, zavrne tujo poštno številko | **štiridelno** | ločitev **hišne številke** od ulice, **kraja** od poštne številke |
| Telefon | **nobene normalizacije** — vrednost gre skozi `trim()` | klicna koda ločena, številka **brez vodilne ničle** | celotna normalizacija |

Telefon je najbolj podcenjena vrstica te tabele. Izmerjeno **[M]**: vseh 8 digitalnih ponudb piše
`+386` + 8 mest **brez vodilne ničle**, KLP in Privolitvena pišeta `+386` + 9 mest **z vodilno
ničlo**, eDOKUMENTI hočejo klicno kodo ločeno in številko brez vodilne ničle. `truth.json` to vodi
kot **odprto vprašanje** in izrecno prepove ugibanje.

**Zasnovno pravilo, ki ga je prikaz že postavil in ki mora ostati [M]:** delitve **zavrnejo, namesto
da ugibajo**. Tridelno ime, `s.p.` v nazivu in tuja poštna številka (italijanski `34170 GORIZIA`)
vrnejo `null` in gredo k človeku. Napačen naslov na podpisani privolitveni izjavi ni popravljiva
napaka.

#### A5c · Poišči obstoječo stranko ali ustvari novo — **PODPRI Z AI** · komponenta **K7 Stranka**

**To je nova naloga. Ni je v specifikaciji, ni je v ponudbi in ni je v prikazu.**

Zapis stranke v eDOKUMENTIH nosi **interni ID** in obrazec ponuja gumb `Dodaj novo stranko` **[S]**.
Da je to redna in ne robna situacija, je **izmerjeno [M]**: v 20 vidnih vrsticah seznama map v
štirih dneh je ena oseba ustvarila tri mape in dve osebi po dve — ker je **ključ mape številka
ponudbe, ne stranka**.

**Zakaj tu ne pišemo AVTOMATIZIRAJ.** Napačno ujemanje po imenu pripiše zavarovanje napačni osebi;
napačna neuspešna najdba ustvari dvojnik v njihovi bazi strank. Obe napaki sta trajni in ju robot,
ki nima dostopa do njihove zgodovine, ne more razrešiti. Ciljna zasnova: robot poišče po
**e-naslovu in davčni številki** (deterministično), ob **enoličnem** zadetku poveže sam, ob
**dvoumnem ali nobenem** zadetku pa vrne odločitev v nadzorno ploščo (K10). Ko bo iz Faze 1 znano,
kolikšen delež je enoličen, se dispozicija lahko pomakne proti AVTOMATIZIRAJ — takrat z merjeno
podlago.

**Odvisnost [?]:** ali eDOKUMENTI API sploh omogoča **iskanje** strank, ne le ustvarjanja. Brez tega
K7 ni izvedljiv v tej obliki.

#### A5d · Zapis v eDOKUMENTE — **AVTOMATIZIRAJ** · komponenta **K8 Prenos eDOKUMENTI**

Dokumenti + metapodatki + zaznamek za manjkajoči 545. člen. Robot ima celoten življenjski krog
zaznamka: postavi → opominja po urniku → sam počisti ob prihodu podpisanega dokumenta → sprosti
ponudbo naprej.

**Priporočilo, ki ga je naročnik izrecno zahteval** (in ga je treba pri dobavitelju eDOKUMENTOV
potrditi): **strukturirano statusno polje** na zapisu ponudbe (`545_CLEN: PENDING/RECEIVED`) plus
datiran zaznamek. Naročnik je 30. 7. potrdil, da eDOKUMENTI **podpirajo strukturirana fiksna statusna
polja [S]** — to priporočilo je s tem izvedljivo. Prostotekstovni zaznamek je zasilna pot: robot ga
ne more poizvedovati in torej ne more sam potrditi razrešitve.

**Tveganje je odslej terminsko, ne tehnično [S]:** »planirajte, da dokumentiran API dobimo, če še ni
pripravljen, ga bodo pripravili«, dobavitelj je seznanjen. Datuma ni in ni v naši pristojnosti.
Ponudba za primer, da API-ja ali testnega okolja ni, že ima izhod (nadomestna izvedba prek
avtomatizacije uporabniškega vmesnika, **ovrednotena posebej**).

---

### A6 · Priprava KLP in Privolitvene izjave

**Različica A: ZUNAJ NAS.** eDOKUMENTI to počnejo naprej; robot čaka njihovo povratno informacijo.
To je natanko odvisnost, zaradi katere ponudba priporoča različico B.

**Različica B: AVTOMATIZIRAJ · komponenta K9 Generator listin.** Zgrajeno in izmerjeno **[M]**:
**34/34 besedilnih elementov znotraj 2,5 pt** od naročnikovega lastnega KLP. Tehnika je njihova
lastna — njihov KLP izdela mPDF 6.0 (PHP HTML→PDF), zato je HTML/CSS sled, natisnjena iz
brskalnika, isti pristop in ostane vektorska. Podpisni blok in `Datum podpisa` ostaneta prazna
namenoma: generiranje se ustavi pri dokumentu in preda njihovemu obstoječemu toku
`epodpis@harvest.si`.

---

### A7 · Potrditev KLP — **PODPRI Z AI** · komponenta **K10 Nadzorna plošča**

**Utemeljitev izjeme (proti privzetku AVTOMATIZIRAJ), trije razlogi, vsi zunanji:**

1. **Pogodbena razmejitev odgovornosti.** Ponudba, POGOJI: »Za podatke, ki jih sodelavec naročnika
   potrdi ali ročno sprosti, odgovarja naročnik.« Če ni človeka, ki potrdi, ta stavek nima
   nosilca.
2. **Jamstvo 2 (brez tihih napak).** Podatek pod pragom zanesljivosti se **ne zapiše** v njihova
   sistema, temveč gre v pregled. Nadzorna plošča ni udobje — je izpolnitev jamstva.
3. **Izmerjena vrzel [M]:** številka zavarovalnega zastopnika (`NNN-NNNN`) **ne obstaja v nobeni
   vhodni ponudbi**. Iskanje te oblike po vseh ponudbah vrne nič; ponudbe nosijo licenco AZN, ki je
   drug register in druga oblika. Robot te vrednosti ne more prebrati, ker je nikjer ni.

Zasnova plošče je **čakalna vrsta, ne nadzorna plošča**: prikaže se **samo izjema** — negotovo
polje, dvoumna stranka, manjkajoč dokument, neuspel prenos. Ob dokumentu je izvirnik, popravek je en
klik.

Kar mora ostati iz prikaza **[M]**: provenienca poganja barvo (`ponudba` zeleno, `pravilo` in
`register` jantarno), vsakdanji primer je **najtišja** oznaka na kartici, imena datotek so v dnevniku
maskirana (`safeName()`) — tri od petnajstih vzorčnih datotek nosijo ime stranke v imenu datoteke,
dnevnik pa je panel, ki na deljenem zaslonu ostane ves sestanek.

---

### A8 · Podpis stranke — ZUNAJ NAS (robot pošlje in opominja) · komponenta **K11 Opominjanje**

Edini korak celotnega procesa, kjer **čakalna doba ni v rokah Harvest Hub**. Robot pošlje, vodi
zaznamek in opominja do prejema; hitrejši ne more biti.

**Izmerjeno [M, n = 1]:** na vzorčni Privolitveni izjavi je med `Kraj, datum` (14. 10.) in
`Datum podpisa` (28. 10.) **14 dni**. Iz enega vzorca ni povprečja, je pa dovolj, da se v Fazi 0
postavi vprašanje: če zastoj sedi tu in ne v prepisovanju, je to drug projekt z drugačno
donosnostjo. Pošteneje je, da to izvemo prej kot pozneje.

Oblika podpisa je **slikovni prikaz podpisa, ne kvalificiran e-podpis [S]** — kot zahteva njihova
specifikacija.

---

### A9 · Zapis v Zavarovalniški program — **AVTOMATIZIRAJ, odloženo** · komponenta **K12**

Naročnikov odgovor z dne 30. 7. **[S]**: »Za zavarovalniški program pripravimo naknadno, potrebno
narediti šifrant zavarovalnice in povezati s šifrantom iz zavarovalniškega programa.«

Do obstoja šifranta ta korak **ostane človek** — ne zato, ker bi ga ne bilo mogoče avtomatizirati,
temveč ker **ni ciljne strukture, v katero bi robot pisal**. To je neujemanje z obsegom in je
obravnavano v §4 (N1).

---

## 3. Katalog komponent

Vsaka komponenta je imenovani nosilec dispozicije, kot to zahteva G1. Stolpec **»Delež AI«** je
protokolova ocena vpletenosti modela; namenoma je pri večini komponent nizek, ker je to prednost —
kar se da izračunati, se ne sme ugibati.

| # | Komponenta | Kaj naredi | Delež AI | Stanje danes | Dokaz |
|---|---|---|---|---|---|
| **K1** | **Prevzem** | poštni priključek, idempotenca na `Message-ID`, nespremenljiv surovi arhiv | brez | ni zgrajen | — |
| **K2** | **Arhiv** | mapa po konvenciji `DD.MM. Priimek Ime Številka` | brez | ni zgrajen | konvencija **[M]** |
| **K3** | **Razvrstitev** | kateri tip dokumenta je to | nizek (model le pri resnični dvoumnosti) | **delno** — 5 razredov od ~12 | `lib/classify.js` **[M]** |
| **K4** | **Branje** | dokument → strukturirana polja, dvotirno | **visok — edina komponenta, kjer model odloča** | **zgrajen, 157/157** | `verify.mjs` **[M]** |
| **K5** | **Kontrole** | 545. člen, izjema kolektivno, davčna mod-11, premija × frekvenca, skladnost med dokumenti | brez (deterministično) | **jedro zgrajeno** (545 + izjema) | `lib/gate.js` **[M]** |
| **K6** | **Preoblikovanje** | oblika izvora → oblika eDOKUMENTOV (ime, naslov 4×, telefon) | brez (deterministično, testabilno) | **delno — tri delitve manjkajo** | `lib/klp.js:164-177` **[M]** |
| **K7** | **Stranka** | poišči obstoječo ali ustvari novo, po e-naslovu in davčni | nizek | **ni zgrajen — nova naloga** | seznam map **[M]** |
| **K8** | **Prenos eDOKUMENTI** | zapis dokumentov, metapodatkov in statusnega zaznamka | brez | ni zgrajen, čaka API | odgovor **[S]** |
| **K9** | **Generator listin** | KLP + Privolitvena izjava (samo različica B) | brez | **zgrajen, 34/34 v 2,5 pt** | `render.mjs --fidelity` **[M]** |
| **K10** | **Nadzorna plošča** | čakalna vrsta izjem, popravek z enim klikom | brez | ni zgrajen (prikaz ima le kartice ene serije) | — |
| **K11** | **Opominjanje** | življenjski krog zaznamka in opominjanje do prejema | brez | ni zgrajen | — |
| **K12** | **Šifrant + preslikava** | šifrant zavarovalnice ↔ šifrant Zavarovalniškega programa | brez | **odloženo na zahtevo stranke** | odgovor **[S]** |
| **K13** | **Ocena zanesljivosti** | številčna ocena na polje + prag, pod katerim se ne zapiše | srednji | **ni zgrajen** — prikaz ima **provenienco, ne ocene** | `lib/extract.js` **[M]** |
| **K14** | **Revizijska sled** | nespremenljiv zapis vsakega koraka, obveščanje o napakah, tedensko poročilo | brez | ni zgrajen | — |
| **K15** | **Učenje iz popravkov** | popravek sodelavca → označeni podatek → boljša naslednja obdelava | srednji | **ni zgrajen** | grep po `lib/` in `app.js`: nič **[M]** |
| **K16** | **Ponudnik AI in regija** | izbira ponudnika, regije in modela | — | **odločitev pripravljena** | `G3b` **[M]** |

### Tri opombe, ki jih ta tabela nosi in ki jih je lažje spregledati

**Vpletenost AI je zbrana v eni sami komponenti.** Model odloča samo v **K4**. Vse ostalo je
deterministična koda, ki se da testirati z enotskimi testi. To je zasnovna odločitev, ne slučaj —
in pomeni, da **jamstvo 98 % v celoti visi na K4**. Zato je K4 tudi edina komponenta, katere
natančnost je bila izmerjena, preden je bila cena podpisana.

**K13 in K15 sta obljubljeni v ponudbi in ju danes ni.** Ponudba pravi »Vsak podatek dobi oceno
zanesljivosti« in »Sistem se iz popravkov uči«. Prikaz ima **provenienco** (`ponudba` / `pravilo` /
`register`) — to ni ocena zanesljivosti, ampak izvor. Obe komponenti sta **znotraj naročenega
obsega** in ju je tu treba imeti zapisani, da se ne izgubita med tistim, kar je videti že narejeno.

**K16 je izdelek, ki ga naročnik pričakuje.** Vprašal je izrecno: »svetujte kateri ponudnik AI
storitev je za našo rešitev najbolj primeren«. Odgovor je pripravljen v `G3b-ponudnik-in-regija.md`
in je: **Amazon Bedrock, regija `eu-central-1` (Frankfurt)**, ker je to edina od preverjenih poti,
ki obdelavo dejansko zadrži v EU (prvostranski API to **zavrne** — parameter sprejme le `global` in
`us`, preverjeno na živem API-ju 30. 7. 2026 **[M]**). Doplačilo za regijo je +10 %, kar je pri
njihovem obsegu nekaj evrov na mesec. Prenos je poceni, ker je celotna stična površina s
ponudnikom **en sam POST** s štirimi polji (`demo/lib/claude.mjs` **[M]**) — menjajo se končna
točka, avtentikacija in ime modela.

---

## 4. Obseg — kaj je kupljeno in kaj je novo

Ta razdelek obstaja zato, da novo delo ne izgine tiho v fiksno ceno in da se hkrati ne napihne.
Nobena vrstica tu ni predlog za doplačilo — predlog je Ianova odločitev.

### 4.1 V FIKSNEM OBSEGU (`03-uradna-ponudba.md`, razdelek OBSEG)

| Komponenta | Vrstica ponudbe |
|---|---|
| K1 Prevzem, K2 Arhiv | »Samodejni prevzem« + »arhiv na strežnik po vaši obstoječi konvenciji« |
| K3 Razvrstitev, K4 Branje | »Branje dokumentov« — dvotirno, ~80 / ~20 |
| K5 Kontrole | »Kontrole in preverjanje« — 545. člen, davčna, premija, skladnost |
| K6 Preoblikovanje | del »Prenos v vaša sistema«; **nabor polj se pisno zaključi ob koncu Faze 0** |
| K8 Prenos eDOKUMENTI | »Prenos v vaša sistema« |
| K9 Generator listin | samo različica B — »robot sam pripravi KLP in Privolitveno izjavo« |
| K10 Nadzorna plošča | »Nadzorna plošča« — sodelavec vidi samo izjeme |
| K11 Opominjanje | »Obravnava izjem« — zaznamek in samodejno opominjanje |
| K13 Ocena zanesljivosti | »Vsak podatek dobi oceno zanesljivosti« + Jamstvo 2 |
| K14 Revizijska sled | »Revizijska sled« + obveščanje + tedensko poročilo |
| K15 Učenje iz popravkov | »Sistem se iz popravkov uči« |
| K16 Ponudnik in regija | POGOJI: »Ponudnika in regijo obdelave potrdimo v Fazi 0« |
| Prenos v Zavarovalniški program | »metapodatki v Zavarovalniški program« — **glej N1** |

### 4.2 NOVO DELO, odkrito po oddaji ponudbe

Označeno, ne obračunano. Vsaka vrstica ima izvor in predlog, kako z njo ravnati.

| # | Novo delo | Izvor | Velikost | Predlog |
|---|---|---|---|---|
| **N1** | **Šifrant zavarovalnice + preslikava med šifrantoma** — pogoj za A9 | odgovor 30. 7. **[S]** | **velika, neocenljiva brez nabora polj** | **Razmejiti vsebino od izvedbe.** Vsebina šifranta je naročnikova (njihova koda, njihov produktni seznam) — tega ne moremo napisati mi. **Preslikava in izvedba prenosa ostaneta v fiksnem obsegu**, ko vsebina obstaja. To razmejitev je treba zapisati v zapisnik Faze 0, ker ponudba prenos šteje v osnovni obseg, izdelave šifranta pa ne omenja. |
| **N2** | **K7 Poišči-ali-ustvari stranko** | zaslonska slika eDOKUMENTOV 30. 7. **[S]** + seznam map **[M]** | srednja | **Genuinely novo** — ni je v specifikaciji, ponudbi ali prikazu. Odvisna od tega, ali API omogoča iskanje. Odločitev Iana: absorbirati ali ovrednotiti posebej. Naše mnenje: brez tega zapis v eDOKUMENTE **ne more delovati**, zato jo je treba narediti tako ali tako — vprašanje je le, kdo jo plača. |
| **N3** | **Tri manjkajoče delitve** (hišna številka, kraj, klicna koda telefona) | zaslonska slika eDOKUMENTOV **[S]** + `lib/klp.js` **[M]** | majhna | **Absorbirati.** Ponudba nabor polj izrecno prepušča Fazi 0 (»ob zaključku obe strani pisno potrdita zaključen nabor polj«). To **je** ta nabor polj. Zahtevati doplačilo za obliko polja, ki jo je ponudba sama odložila, bi bilo slabo. |
| **N4** | **Pravilo za podvojeno datoteko `(1)`** | realna mapa **[M]** | majhna | Absorbirati; eno pravilo. |
| **N5** | **`IPID` v taksonomiji** (specifikacija navaja `KID`) | realna mapa **[M]** | majhna | Absorbirati; ponudba obseg opredeljuje kot »tipe iz 2. točke vaše specifikacije **ter Spremni dopis iz priloženih vzorcev**« — torej specifikacija **plus vzorci**, in IPID je iz vzorcev. |
| **N6** | **Razčlenitev zadeve e-pošte** kot razvrstitveni vir | zaslonska slika **[M]** | majhna | **Ni obvezna.** Zniža ceno in tveganje razvrščanja. Absorbirati, če se v Fazi 0 potrdi na ~20 zadevah; sicer opustiti. Ne predstavljati kot potrebno. |
| **N7** | **Prepis pogodbe o obdelavi ob izbiri Bedrock EU** | `G3b` **[M]** | majhna, a **pravna** | Podobdelovalec se spremeni iz Anthropic PBC (ZDA) v AWS (EU) in prenos v tretjo državo v tem delu odpade. `06-pogodba-obdelava-ocenjevanje.md`, 6. točka je za **fazo ocenjevanja pravilna** in mora ostati; produkcijska pogodba se prepiše **pred prvim dostopom do resničnih podatkov**, ne ob predaji. |

### 4.3 IZVEN OBSEGA (ponudba to že izključuje — ne odpirati znova)

Priključitev drugih vhodnih virov; nadomestna izvedba prek avtomatizacije uporabniškega vmesnika
(ovrednotena posebej, če v Fazi 0 pade API); stroški in dodelave dobaviteljev obeh sistemov; vrste
zavarovanj in tipi dokumentov nad vključenima dvema uvedbama; **spremembe potrjenega nabora polj po
Fazi 0**; prilagoditve zaradi sprememb dokumentov Merkurja ali API-jev; migracija starejše
dokumentacije; **pravna mnenja in izdelava DPIA**; infrastruktura in gostovanje; obratovanje in
podpora po prevzemu.

> **Opomba o DPIA.** Ob podatkih iz 9. člena GDPR, med njimi o otrocih, pri 300–500 ponudbah
> mesečno je ocena učinka verjetno potrebna. To je **pravna presoja njihovega DPO ali odvetnika** —
> ponudba jo izrecno izključuje. Mi priskrbimo arhitekturna dejstva, presoje ne.

---

## 5. Razvrščen zaostanek — učinek × napor

**Kako je razvrščeno in kako ni.** Protokol tu predpisuje razvrstitev po urah in donosnosti. Ur ni
(§0). Zato je **učinek** ocenjen na treh izmerjenih nadomestkih — (a) koliko ročnih posegov na
ponudbo korak odpravi, (b) ali blokira drugo delo, (c) katero tveganje napake odpravi — in vsaka
vrstica pove, na katerem od njih stoji. **Napor** je relativen (S/M/L), ne v dnevih. Nobena od teh
številk ni cena in nobena ni obljuba roka.

| # | Postavka | Komponente | Učinek | Podlaga učinka | Napor | Odvisnost | Faza |
|---:|---|---|:--:|---|:--:|---|---|
| **1** | **Odločitve Faze 0** — ponudnik in regija, nabor polj, dostopi, register zastopnikov | K16 | **5** | blokira vse ostalo; brez potrjenega nabora polj ni ne K6 ne prevzemnega testa | **S** | naročnik | 0 |
| **2** | **Prevzem in arhiv** | K1, K2 | **5** | odpravi korake A2 in A3 v celoti; **brez zunanje odvisnosti** — edina velika postavka, ki se lahko gradi takoj | **M** | dostop do nabiralnika | 2 |
| **3** | **Branje celotnega paketa** (razširitev K4 z ene strani in ene vrste dokumenta na paket) | K4, K3 | **5** | jedro je izmerjeno 157/157; to je razlika med prikazom in izdelkom | **M** | vzorci realnih paketov | 1 |
| **4** | **Preoblikovanje + tri delitve** | K6 | **4** | izmerjeno: ime 1→2 polji, naslov 1→4 polja, telefon spremeni obliko — to je vir ročnega dela v A5 | **S** | potrjen nabor polj (#1) | 1 |
| **5** | **Ocena zanesljivosti in prag** | K13 | **4** | **nosilec Jamstva 2**; brez tega »nič se ne zapiše pod pragom« ni izvedljivo | **M** | — | 1 |
| **6** | **Kontrole do polnega obsega** (davčna mod-11, premija × frekvenca, skladnost med dokumenti) | K5 | **4** | deterministično ujame napake, ki jih model ne bi | **M** | — | 2 |
| **7** | **Razvrstitev na celotno taksonomijo** (+ IPID, + pravilo `(1)`) | K3 | **3** | danes 5 razredov od ~12 | **S** | vzorci vsakega tipa | 2 |
| **8** | **Zapis v eDOKUMENTE** | K8 | **5** | zaključi glavno pot; brez tega ni prenosa | **L** | **API — brez datuma [?]** | 3 |
| **9** | **Poišči-ali-ustvari stranko** | K7 | **4** | izmerjeno: podvajanje je redna situacija; napaka je trajna | **M** | API mora omogočati **iskanje** [?] | 3 |
| **10** | **Nadzorna plošča** | K10 | **4** | brez nje izjeme nimajo kam; pogoj za prevzemni test | **L** | K13 | 4 |
| **11** | **Revizijska sled + obveščanje + tedensko poročilo** | K14 | **3** | zahteva ponudbe in podlaga sledljivosti po GDPR/ZZavar-1 | **M** | — | 4 |
| **12** | **Generator listin** (samo različica B) | K9 | **4** | odpravi odvisnost od povratne informacije eDOKUMENTOV — razlog, zakaj priporočamo B | **M** | 34/34 že izmerjeno | 3 |
| **13** | **Zaznamek in opominjanje** | K11 | **3** | zapre izjemo manjkajočega 545. člena | **M** | statusno polje v API-ju | 3 |
| **14** | **Učenje iz popravkov** | K15 | **2** | obljuba ponudbe; učinek raste s časom, ne takoj | **M** | K10 (vir popravkov) | 4 |
| **15** | **Zavarovalniški program** | K12 | **3** | drugi ročni vnos istih podatkov | **L** | **šifrant — odloženo [S]** | po 4 |

**Kaj iz te razvrstitve sledi za vrstni red dela.** Postavke 2, 4 in 5 nimajo nobene zunanje
odvisnosti in skupaj odpravijo večino ročnega dela v korakih A2, A3 in A5 — **gradijo se lahko,
preden API sploh obstaja**. Postavke 8, 9 in 13 so vse za istim vratom (API eDOKUMENTOV), ki ima
zavezo brez datuma. Če se to vrata zamakne, se zamakne tretjina zaostanka naenkrat; ponudba to že
pokriva (»zamude na strani … zunanjih ponudnikov podaljšajo roke za enako obdobje«), a to je
tveganje, ki ga je treba **na sestanku izgovoriti**, ne skriti v drobni tisk.

---

## 6. Faza 0 — kaj mora biti zaprto in kdo to zapre

Združeno iz G0 (10 neznank), G3b in tega dokumenta. Nič v tej tabeli ni raziskovalno delo; vse so
odgovori, ki jih nekdo ima.

| # | Odprto | Nosilec | Kaj to zapre |
|---:|---|---|---|
| 1 | **Minute na ponudbo** | naročnik | Sodelavec za 10 zaporednih ponudb zabeleži začetek in konec (~1 dan). **Do takrat nobene številke o prihranku.** |
| 2 | Število vključenih sodelavcev | naročnik | eno vprašanje (vprašanje 7 ni bilo odgovorjeno) |
| 3 | Ali paket prispe neposredno ali posredovan | naročnik | ena surova `.eml` datoteka z glavami |
| 4 | Ali se nabor polj razlikuje med tipi zavarovanj | naročnik | vprašanje 5, postavljeno znova |
| 5 | Katera številka gre v `Št. ponudbe` na KLP | naročnik | trije resnični pari ponudba → izpolnjen KLP |
| 6 | Pravilo za drugega (pomožnega) zastopnika | naročnik | eno vprašanje |
| 7 | **Register zastopnikov** (`ime → NNN-NNNN`) | naročnik | ~20 vrstic Excela; **te vrednosti ni v nobenem vhodnem dokumentu [M]** |
| 8 | Roki hrambe po ZZavar-1 in interni politiki | naročnik | njihova politika hrambe (odgovor je bil splošen) |
| 9 | Ali paket vedno vsebuje `Spremni dopis` in `IPID`, kako pogosto je `(1)` | naročnik | seznam **imen datotek** 20 zaporednih paketov |
| 10 | Dejanska mesečna mešanica produktov | naročnik | izvoz **imen map** za en mesec — brez osebnih podatkov |
| 11 | **Ali eDOKUMENTI API omogoča iskanje strank** (ne le ustvarjanja) | dobavitelj eDOKUMENTOV | dokumentacija API; **pogoj za K7** |
| 12 | Ali API podpira strukturirano statusno polje za zaznamek | dobavitelj eDOKUMENTOV | dokumentacija API; sicer zasilna pot |
| 13 | **Datum, ko bo API na voljo** | dobavitelj eDOKUMENTOV | zaveza z datumom; danes obstaja zaveza brez datuma **[S]** |
| 14 | Testno okolje obeh sistemov | naročnik + dobavitelja | ponudba to zahteva v 10 delovnih dneh po podpisu |
| 15 | Ime mape na strežniku za Premoženje in Popotnik | naročnik | ponudba to že napoveduje |
| 16 | **Katere modele bo njihov račun na Bedrock `eu-central-1` dejansko imel** | AIS + naročnik | odpiranje računa + vklop dostopa do modelov |
| 17 | **Koliko dokumentov na ponudbo gre skozi AI branje** | obe strani | to je glavna spremenljivka stroška delovanja; zaključi se s potrjenim naborom polj |
| 18 | Ali je bila tehnična priloga (`Ponudba-PRENOS-ZERO-…pdf`) stranki poslana | **samo Ian** | nosi trditev »obdelava izključno znotraj EU«, ki **ne drži [M]**; če je bila poslana, je treba popraviti ustno na sestanku |

---

## 7. Kaj v ciljnem stanju ostane človeku — in zakaj

Protokol zahteva, da je vsaka izjema od privzetka »avtomatiziraj« utemeljena proti privzetku.
V ciljnem modelu ostanejo človeku **tri** stvari:

| Kaj | Utemeljitev | Bi se lahko premaknilo? |
|---|---|---|
| **Potrditev izjem** (A7, K10) | Pogodbena razmejitev odgovornosti v ponudbi in Jamstvo 2. Brez človeka, ki potrdi, stavek »za podatke, ki jih sodelavec potrdi, odgovarja naročnik« nima nosilca. | Ne. To je zasnovna lastnost, ne začasno stanje. |
| **Razrešitev dvoumne stranke** (A5c, K7) | Napačno ujemanje pripiše zavarovanje napačni osebi; obe napaki sta trajni. | **Da**, delno — ob enoličnem zadetku po e-naslovu in davčni robot poveže sam. Delež se izmeri v Fazi 1. |
| **Podpis stranke** (A8) | Zunaj podjetja. | Ne. Merjenje čakalne dobe pa je smiselno. |

Vse ostalo v ciljnem stanju **ni** človekovo delo. To je 6 od 9 korakov v celoti in del sedmega.

---

## 8. Zakaj vrata G1 niso povsem zelena

Protokolov pogoj: *»vsak proces iz posnetka ima dispozicijo, vsaka avtomatizacija ima imenovan
nosilni artefakt, zaostanek je razvrščen z oceno vpletenosti AI«.*

| Pogoj | Stanje |
|---|---|
| Dispozicija za vsak korak A1–A9 | ✅ popolna, vključno z utemeljitvijo vsake izjeme |
| Imenovana komponenta za vsako avtomatizacijo | ✅ K1–K16 |
| Ocena vpletenosti AI | ✅ v katalogu §3 — in **zbrana v eni komponenti (K4)**, kar je zapisano izrecno |
| **Zaostanek razvrščen po učinku** | ⚠️ razvrščen po **izmerjenih nadomestkih**, ne po urah — ker ur ni. Podeduje rdeče iz G0. |
| Ciljni model celotnega podjetja | ⛔ **namenoma izpuščeno** (§0) |
| Dve dispoziciji sta pogojni | ⚠️ A5d/A8 čakata API brez datuma, A9 čaka šifrant |

**Vrata zato ostajajo delno zelena.** Zeleno jih naredita dve stvari, obe iz §6: **točka 1**
(izmerjene minute, ki dajo razvrstitvi pravo podlago) in **točka 13** (datum API-ja, ki tretjini
zaostanka odvzame pogojnost).

---

## 9. Kasneje, ne zdaj

Ni predmet naročenega obsega, ne sme se predstaviti kot potrebno, in zapisano samo zato, da se ne
izgubi.

- **Razrešitev podvajanja strank kot samostojna funkcija** — čiščenje obstoječih dvojnikov v njihovi
  bazi strank. K7 preprečuje nove; starih ne popravlja.
- **Merjenje in krajšanje koraka A8** (čakanje na podpis stranke). Če zastoj sedi tam, je to drug
  projekt.
- **Prevzem prek zadeve e-pošte kot glavna pot** (N6, če se izkaže na 20 zadevah) — razvrstitev in
  poimenovanje mape brez odpiranja PDF.
- **Predpomnjenje sistemskega poziva.** `G3b` je izmeril, da je danes mrtva koda (632 žetonov proti
  pragu 1024) in da je zato objavljeni strošek $0,0193/dokument **konservativen**. Popravek zniža
  že tako nizek račun — zato ni predlog.
- **Cenejši model za besedilni tir.** ~80 % dokumentov je digitalnih; če Haiku doseže 98 % na
  njihovih dokumentih, je besedilni tir tretjinski. **Izmeriti, ne predpostaviti** — in šele po
  prevzemnem testu.

---

## Priloge — kaj je bilo pognano za ta dokument

| Kaj | Nad čim | Kdaj |
|---|---|---|
| Branje izvorne kode (samo branje, brez sprememb) | `demo/lib/{extract,classify,gate,klp,edokumenti,runstats,layout}.js`, `demo/README.md`, `server.mjs` | 30. 7. 2026 |
| `grep` za oceno zanesljivosti in učenjem | `demo/lib/*.js`, `demo/app.js` — **nič zadetkov** | 30. 7. 2026 |
| `grep` za normalizacijo telefona | `demo/lib/*.js` — samo `trim()` | 30. 7. 2026 |
| Branje normalizacijskih pravil (samo ključ `_normalization_rules`) | `demo/truth.json` | 30. 7. 2026 |
| Prevzem meritev | `G0-posnetek-procesa.md`, `G3a`, `G3b`, `demo/README.md` | 30. 7. 2026 |

**Koda prikaza ni bila spremenjena.** Nobena datoteka pod `clients/harvest-hub/demo/` ni bila
odprta za pisanje.
