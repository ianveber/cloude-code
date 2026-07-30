# Priporočilo ponudnika AI in regije obdelave

**Za:** Harvest Hub, zavarovalniško zastopanje d.o.o.
**Od:** AIS Slovenija — Anej Vučič s.p.
**Datum:** 30. julij 2026
**Vaše vprašanje:** »Zaenkrat računa še nimamo, svetujte kateri ponudnik AI storitev je za našo rešitev
najbolj primeren?«

---

## Odgovor v enem odstavku

Priporočamo **Amazon Bedrock v regiji Frankfurt (`eu-central-1`), z evropskim profilom obdelave**.
Model je isti Claude, kakršnega ste videli na prikazu; razlika je, da obdelava ostane znotraj EU,
pogodbeni obdelovalec je AWS (evropska pravna oseba), Anthropic pa do te infrastrukture nima
dostopa. To vas stane približno **10 % več na porabljen žeton — pri vašem obsegu okoli 5 € mesečno**.
Za dokumentacijo, ki vsebuje zdravstvene podatke in podatke o otrocih, je teh 5 € mesečno
najceneje kupljena skladnostna prednost v celotnem projektu.

**Pomembno in preverjeno:** neposredni račun pri Anthropic (kar prikaz uporablja danes) **obdelave v
EU ne omogoča**. To ni domneva — testirali smo na živem API-ju, izpis testa je v prilogi A.

---

## 1. Kaj smo dejansko preverili

Pravilo tega dokumenta: trditev je označena kot **preverjeno** samo, če zanjo obstaja izpis ukaza,
vrstica izvorne kode ali dokumentacija ponudnika, ki smo jo prebrali. Vse ostalo je označeno kot
**odprto**.

| # | Trditev | Status | Dokazilo |
|---|---|---|---|
| 1 | Neposredni API Anthropic sprejme samo `global` in `us`, `eu` zavrne | **Preverjeno** | Priloga A, test 30. 7. 2026 |
| 2 | Prikaz danes teče na nastavitvi `global` | **Preverjeno** | Priloga A — odgovor API-ja vrne `"inference_geo": "global"` |
| 3 | Bedrock ponuja evropski profil v 8 regijah EU, vključno s Frankfurtom | **Preverjeno** | Dokumentacija Anthropic, tabela regij |
| 4 | Regijski profil na Bedrocku in Vertexu stane +10 % | **Preverjeno** | Dokumentacija Anthropic, cenik |
| 5 | Microsoft Foundry nima evropskega podatkovnega območja | **Preverjeno** | Dokumentacija Anthropic — samo `Global Standard` in `US Data Zone Standard` |
| 6 | Podatki se ne uporabljajo za učenje modelov | **Preverjeno** | Dokumentacija Anthropic o hrambi: »Retained data is never used for model training without your express permission.« |
| 7 | Celoten prikaz uporablja en sam klic, ki ga podpirata tudi Bedrock in Vertex | **Preverjeno** | `demo/lib/claude.mjs` — pregled celotne datoteke, glej razdelek 5 |
| 8 | Kateri točno modeli so odobreni v EU na *vašem* računu | **Odprto** | Vidno šele v konzoli po odprtju računa — glej razdelek 8 |

---

## 2. Razvrstitev možnosti

### 1. mesto — Amazon Bedrock, `eu-central-1` (Frankfurt), evropski profil ★ priporočamo

| | |
|---|---|
| Obdelava | Znotraj regij EU |
| Kdo je obdelovalec | AWS; z njim sklenete pogodbo o obdelavi |
| Dostop Anthropic | Brez — dokumentacija navaja »zero operator access (Anthropic personnel have no access to the inference infrastructure)« |
| Cena | +10 % na žetone glede na globalno usmeritev |
| Zamuda | Frankfurt je najbližje vozlišče Ljubljani |
| Predelava naše kode | Zamenjava dostopne točke in imena modela; nič drugega (razdelek 5) |

**Zakaj to in ne kaj drugega.** Trije razlogi, po teži:

1. **Pravni položaj se poenostavi.** Zdaj je Anthropic v ZDA vaš podobdelovalec in gre za prenos v
   tretjo državo, ki ga je treba pokrivati s standardnimi pogodbenimi klavzulami (to je pošteno
   zapisano v 6. točki pogodbe o obdelavi za ocenjevanje). Z Bedrockom v EU prenosa v tretjo državo
   v tem delu ni. Za posebno vrsto osebnih podatkov po 9. členu GDPR — zdravje, in med njimi
   podatki o otrocih — je to bistvena razlika v tem, kaj morate zagovarjati pred nadzornikom.
2. **Frankfurt je 8 regij EU stran od tveganja izpada.** Evropski profil obdelave razporeja promet
   med regijami EU, ne med celinami.
3. **Cena je zanemarljiva.** Razdelek 4.

**Odkrita ovira, ki jo je treba obravnavati.** Prikaz danes za besedilno pot uporablja model
**Sonnet 4.6**. Ta model na novi (Messages API) dostopni točki Bedrocka **ni na seznamu**
podprtih modelov. Rešitev je ena od dveh: uporabiti starejšo dostopno točko Bedrocka, kjer je
Sonnet 4.6 z evropskim profilom na voljo, ali preiti na **Sonnet 5**. Druga pot ima ceno, ki je
večja od same evropske premije — glej razdelek 4, opozorilo o žetonih.

### 2. mesto — Google Vertex AI, večregijska točka `eu`

Enakovredna po vsebini: obdelava znotraj EU, +10 %, obdelovalec je Google. Večregijska točka `eu`
podpira tudi najnovejše modele. Postavljamo jo za Bedrock iz dveh praktičnih razlogov, ne
tehničnih: AWS je v slovenskem finančnem in zavarovalniškem okolju pogostejši, zato je pot skozi
revizijo krajša; in enoregijske točke (`europe-west1` in podobno) podpirajo samo Sonnet 4.6 in
starejše, torej vas pri prehodu na novejši model potisnejo nazaj na večregijsko točko.

**Vzemite Vertex namesto Bedrocka, če že imate Google Cloud in nimate AWS.** Takrat prihranek pri
uvedbi odtehta zgornja dva razloga.

### 3. mesto — neposredni račun pri Anthropic (kar prikaz uporablja danes)

Najpreprostejši in najcenejši: brez računa pri oblaku, brez 10 % premije, celoten nabor funkcij.
**Vendar obdelave v EU ne omogoča.** Na voljo sta `global` (privzeto — obdelava lahko poteka kjer
koli) in `us` (samo ZDA, +10 %). Za vaš primer zato ni prva izbira.

To je sprejemljivo **samo**, če se zavestno odločite, da obdelavo zunaj EU pokrijete s standardnimi
pogodbenimi klavzulami in to zapišete v evidenco dejavnosti obdelave. Pravno je taka pot mogoča —
GDPR prenosa v tretjo državo ne prepoveduje, če obstaja veljavna varovalka. Ni pa je treba
izbrati, ko alternativa stane 5 € mesečno.

### 4. mesto — Microsoft Foundry: odsvetujemo

Foundry ponuja samo dve vrsti postavitve: `Global Standard` in `US Data Zone Standard`.
**Evropskega podatkovnega območja ni.** Za vašo zahtevo torej ne reši ničesar, kar ne bi rešil že
neposredni račun pri Anthropic, doda pa še eno pogodbeno stranko. Če imate Azure iz drugih
razlogov, to ne spremeni presoje glede regije.

---

## 3. Kaj z izbiro EU izgubite

Pošteno: **za vašo rešitev nič uporabnega.**

Bedrock in Vertex nimata nekaterih funkcij, ki jih ima neposredni API — Files API, strežniška
orodja (spletno iskanje, izvajanje kode), paketna obdelava (Batch API), Managed Agents.
**Preverili smo, česa se rešitev dotakne: nobene od teh.** Podroben pregled je v razdelku 5.

Trije resnični stroški, ki jih ne skrivamo:

1. **+10 % na žetone.** Pri vašem obsegu okoli 5 € mesečno (razdelek 4).
2. **Odpreti je treba račun pri AWS** in ga vzdrževati. Nekaj ur dela ob uvedbi. Ker rešitev tako
   ali tako teče na vaši infrastrukturi in gostovanje že plačujete, to za vas ni nova vrsta
   stroška, ampak isti račun.
3. **Paketna obdelava (Batch API) na Bedrocku ni na voljo.** Ta bi znižala ceno žetonov za 50 %,
   a zahteva obdelavo z zamikom do 24 ur. Vaš proces je sprotni — ponudba prispe in gre naprej —
   zato te možnosti tako ali tako ne bi uporabili. Omenjamo jo, ker je edini res opuščeni
   prihranek.

---

## 4. Kaj to stane

**Osnova ni ocena, ampak meritev.** 27. 7. 2026 smo pognali celotno branje na 11 resničnih
dokumentih iz vaših vzorcev: **0,2118 USD skupaj, torej 0,0193 USD na dokument** (8 dokumentov po
besedilni poti, 3 po vizualni).

| Dokumentov z branjem AI na ponudbo | 400 ponudb / mesec | + evropska premija 10 % |
|---|---|---|
| 1 | ≈ 7 USD (≈ 7 €) | ≈ 8 € |
| 2 | ≈ 15 USD (≈ 14 €) | ≈ 16 € |
| 3 | ≈ 23 USD (≈ 21 €) | ≈ 24 € |
| 7 (vsi v paketu) | ≈ 54 USD (≈ 50 €) | ≈ 55 € |

Pri 500 ponudbah in vseh 7 dokumentih: ≈ 68 USD (≈ 63 €), z evropsko premijo ≈ 69 €.

**Evropska premija vas torej stane med 1 in 6 € mesečno.** To je zgornja meja tega, kar plačate za
to, da zdravstveni podatki vaših strank ne zapustijo EU.

Ocena se ujema z okvirom iz ponudbe (80–110 € mesečno za AI in gostovanje skupaj).

> **Opozorilo, ki je večje od evropske premije.** Če pri prehodu na Bedrock zamenjamo Sonnet 4.6 za
> **Sonnet 5**, se cena na žeton ne spremeni (3 / 15 USD na milijon od 1. 9. 2026), **novi model pa
> za isto besedilo porabi približno 30 % več žetonov**. To pomeni okoli 30 % višji račun — pri
> 50 € mesečno je to +15 € mesečno, torej **trikrat toliko kot izbira regije**. Izbira modela je
> tu pomembnejša od izbire regije. Zato mora Faza 0 vključevati meritev, ne domneve — glej
> razdelek 8.

**Kje je še prihranek.** Približno 80 % vaših dokumentov ima uporaben besedilni sloj in ne
potrebuje zmogljivega modela. Če se na vaših resničnih dokumentih izkaže, da za to pot zadošča
**Haiku 4.5** (1 / 5 USD na milijon namesto 3 / 15), pade cena besedilne poti na tretjino. Tega ne
trdimo vnaprej — jamčimo 98 % natančnost in te meje ne bomo tvegali zaradi nekaj evrov. Izmerimo v
Fazi 0 in odločimo skupaj.

Preračun v evre uporablja tečaj 1 EUR = 1,08 USD. **Tega tečaja za ta dokument nismo preverili pri
viru** — ob potrditvi proračuna ga posodobimo na dnevnega.

---

## 5. Zakaj je selitev poceni: kaj rešitev dejansko kliče

Pregledali smo celotno površino, s katero se rešitev dotakne ponudnika AI. To je **ena sama
datoteka in en sam klic**:

`demo/lib/claude.mjs` pošlje `POST` na `/v1/messages` s štirimi polji: `model`, `max_tokens`,
`system` (z oznako za predpomnjenje) in `messages` (besedilo ali slika strani).

Nič drugega. Iskanje po vsej kodi ni našlo niti ene uporabe funkcij, ki jih Bedrock ali Vertex ne
podpirata (`output_config`, strukturirani izhodi, orodja, Files API, paketna obdelava, spletno
iskanje, izvajanje kode, MCP). Zato je selitev **zamenjava naslova dostopne točke, načina prijave
in imena modela** — ne predelava rešitve.

To je tudi razlog, da vam te odločitve ni treba sprejeti danes dokončno: če se pozneje izkaže, da
je bila napačna, je pot nazaj enako kratka.

---

## 6. Kaj se s tem spremeni v pogodbi o obdelavi

Pogodba o obdelavi za ocenjevanje (`06-pogodba-obdelava-ocenjevanje.md`) v 6. točki pravilno navaja
**Anthropic PBC, ZDA** kot edinega podobdelovalca in obdelavo opisuje kot **prenos v tretjo
državo**. To za fazo ocenjevanja drži in ostane.

Za produkcijo se ob izbiri Bedrocka v EU 6. točka spremeni po vsebini:

| | Danes (ocenjevanje) | Po izbiri Bedrock EU (produkcija) |
|---|---|---|
| Podobdelovalec | Anthropic PBC, ZDA | AWS (evropska pravna oseba) |
| Kraj obdelave | Zunaj EU, privzeto `global` | Regije EU |
| Prenos v tretjo državo | Da, kritje s standardnimi pogodbenimi klavzulami | V tem delu ga ni |
| Dostop Anthropic do vsebine | Po pogodbenih pogojih | Brez dostopa do infrastrukture |
| Učenje modelov | Ne | Ne |

**To je treba pisno uskladiti pred prvim dostopom do resničnih podatkov v produkciji**, ne ob
prevzemu.

Hkrati s tem se odpravi napaka v tehnični prilogi `02-ponudba-prenos-zero.md`, ki na treh mestih
(vrstice 124, 274, 413) trdi »obdelava poteka izključno znotraj EU«. **Ta trditev danes ne drži.**
Poslana uradna ponudba je te trditve nikoli ni vsebovala — pravi, da ponudnika in regijo potrdimo v
Fazi 0, kar je točno to, kar delamo s tem dokumentom. Z izbiro Bedrocka v EU trditev postane
resnična; do takrat velja, da ne drži, in tako je tudi zapisana v pogodbi o obdelavi.

---

## 7. Kaj morate storiti vi

| Korak | Kdo | Kdaj |
|---|---|---|
| Odločitev: Bedrock EU (priporočeno) / Vertex EU / neposredni Anthropic | Harvest Hub | Pred Fazo 0 |
| Odprtje računa AWS in vklop dostopa do modelov Claude v `eu-central-1` | Harvest Hub | Faza 0 |
| Podpis pogodbe o obdelavi z AWS | Harvest Hub | Pred prvimi resničnimi podatki |
| Uskladitev 6. točke pogodbe o obdelavi z nami | Obe strani | Pred produkcijo |
| Meritev natančnosti in cene po modelih na vaših dokumentih | AIS | Faza 0 |

Račun je in ostane **vaš** — tako piše v ponudbi in tako tudi ostane. Rešitev teče pod vašim
računom in na vaši infrastrukturi; mi vam samo povemo, kateri račun odpreti.

---

## 8. Česa ne vemo

Pošteno navedeno, ker se na to ne da odgovoriti brez vašega računa ali brez meritve:

1. **Kateri točno modeli Claude bodo odobreni na vašem računu AWS v `eu-central-1`.** Dostop do
   modelov na Bedrocku se odobrava po posameznem modelu in po regiji. Dokumentacija navaja, da so
   najnovejši modeli odprti za vse stranke Bedrocka, konkretno stanje pa je vidno šele v konzoli.
   **Razreši:** prvi korak Faze 0 je vklop dostopa in izpis seznama razpoložljivih modelov.
2. **Ali Sonnet 4.6 ostane dosegljiv na Bedrocku dovolj dolgo.** Na novi dostopni točki ga ni; na
   starejši je. Roke za umik modelov pri partnerskih platformah določa partner, ne Anthropic.
   **Razreši:** preverba pri AWS ob odprtju računa in odločitev o ciljnem modelu v Fazi 0.
3. **Koliko dokumentov na ponudbo bo dejansko šlo skozi branje AI.** Od tega je odvisna cena, in
   razpon je od 7 € do 55 € mesečno. **Razreši:** določitev nabora polj ob zaključku Faze 0.
4. **Ali Haiku 4.5 doseže 98 % na vaših dokumentih.** Če da, pade cena besedilne poti na tretjino.
   **Razreši:** meritev na 100 ponudbah iz prevzemnega testa.
5. **Ali je za ta obseg obdelave podatkov po 9. členu potrebna ocena učinka (DPIA).** Verjetno je,
   sodeč po obsegu in vrsti podatkov, a to je pravna presoja. Ponudba pravnih mnenj in izdelave
   DPIA izrecno ne vključuje. **Razreši:** vaš pooblaščenec za varstvo podatkov ali zunanji pravni
   svetovalec. Podatke o arhitekturi, ki jih za to potrebuje, mu damo mi.

---

## Priloga A — izpis testa, 30. julij 2026

Test proti `https://api.anthropic.com/v1/messages`:

```
inference_geo="eu"           → HTTP 400
  "inference_geo: must be one of ['global', 'us']"

inference_geo="europe"       → HTTP 400  (ista napaka)
inference_geo="eu-central-1" → HTTP 400  (ista napaka)
```

Ista napaka se vrne pri vseh preizkušenih modelih (Sonnet 4.6, Opus 4.8). **Vrednost `eu` na
neposrednem API-ju ne obstaja.**

Klic brez tega parametra — točno tako, kot ga pošilja prikaz — vrne:

```json
{ "model": "claude-sonnet-4-6",
  "usage": { "inference_geo": "global", ... } }
```

To je neposreden dokaz, da prikaz danes teče na globalni usmeritvi.

---

## Priloga B — opažanji v kodi (interno, ne za stranko)

Pri pregledu za ta dokument sta se pokazali dve stvari. **Nista popravljeni** — koda je pred
predstavitvijo zamrznjena in ta dokument je nima pravice spreminjati.

1. **Predpomnjenje sistemskega poziva se v resnici nikoli ne zgodi.** `demo/lib/claude.mjs:50`
   označi sistemski poziv s `cache_control: { type: "ephemeral" }`, komentar pa pravi »system
   prompt is identical across every document -> cache it«. Izmerjeno: sistemski poziv ima
   **632 žetonov**, najmanjši predpomnljivi predpon za Sonnet 4.6 in Opus 4.8 pa je **1024
   žetonov**. Pod tem pragom se predpomnjenje tiho ne izvede — brez napake in brez opozorila.
   Oznaka je torej mrtva koda.
   *Posledica za ceno:* izmerjenih 0,0193 USD na dokument je cena **brez** predpomnjenja, torej
   konservativna. Če bi predpon zrasel čez prag, bi ponovljeni del padel na 10 % cene.
   *Kako preveriti:* `usage.cache_read_input_tokens` je pri vsakem klicu 0.

2. **Izračun cene v `costUsd()` (`claude.mjs:83–87`) ni pravilen.** Prebrane predpomnjene žetone
   (`cache_read_input_tokens`) šteje po polni vhodni ceni namesto po 0,1×, zapisa v predpomnilnik
   (`cache_creation_input_tokens`, 1,25×) pa sploh ne šteje.
   *Posledica danes:* nobena. Ker se po točki 1 predpomnjenje nikoli ne izvede, sta obe vrednosti
   vedno 0 in prikazana cena je pravilna. **Napaka postane resnična v trenutku, ko bi
   predpomnjenje začelo delovati** — torej takoj, ko bi kdo povečal sistemski poziv ali prešel na
   Opus 5 (prag 512 žetonov). Popraviti pred produkcijo, ne pred predstavitvijo.

---

## Kasneje, ne zdaj

Zunaj obsega naročenega dela. Zapisano samo zato, da se ne izgubi; **ni predlog za doplačilo in ni
pogoj za nič.**

- Če bi obseg kdaj zrasel čez sprotno obdelavo (na primer migracija starejše dokumentacije), je
  paketna obdelava (Batch API) 50 % cenejša — a je na Bedrocku ni, kar bi bil takrat argument za
  ponoven razmislek o ponudniku.
- Anthropic ima za organizacije, ki to zahtevajo, dogovor o ničelni hrambi (ZDR) na neposrednem
  računu. Za vas ni relevanten, ker priporočamo Bedrock, kjer hrambo ureja AWS.

---

**AIS Slovenija — Anej Vučič s.p.** · ais-slovenia.si
