# Predaja preizkusa Harvest Hubu

Vse, kar potrebuješ za izročitev. Spodaj: dostop, kaj poslati, kaj naj preizkusijo, kaj se
zgodi na koncu, in kaj moraš urediti **preden** kdor koli naloži resnično ponudbo.

---

## Dostop

| | |
|---|---|
| **Naslov** | https://harvest-hub-preizkus.vercel.app |
| **Koda za vstop** | v `~/ais-client-data/harvest-hub/preizkus-dostop.txt` |
| **Poteka** | **5. 8. – 18. 8. 2026** (14 dni). Pred 5. 8. je stran zaprta, po 18. 8. se zapre sama. |
| **Vzorčni dokument** | v sami aplikaciji, pod poljem za nalaganje |

> Kode v tem zapisu namenoma ni. Repozitorij je javen, koda pa je edino, kar preizkus varuje —
> zapisana tukaj bi vrata odprla vsem. Živi ob podatkih stranke, zunaj repozitorija:
> ```bash
> cat ~/ais-client-data/harvest-hub/preizkus-dostop.txt
> ```

Koda se vnese enkrat; brskalnik si jo zapomni do konca preizkusa. Stran je neindeksirana in nanjo
ne kaže nobena javna povezava.

**Preizkus je odprt od 5. 8.** Če ga Petri izročiš pozneje, zamakni konec, da dobi polnih 14 dni
(premakni tudi `TRIAL_STARTS`, sicer je odprt že od 5. 8.):

```bash
cd "/Users/ianveber/Desktop/Cloude CODE/clients/harvest-hub/trial" && vercel env rm TRIAL_ENDS production --yes; echo "2026-08-25T22:00:00Z" | vercel env add TRIAL_ENDS production && vercel deploy --prod --yes
```

**Vedno preveri, kaj je dejansko nastavljeno** — vstopna stran izpiše obe meji sama:

```bash
curl -s https://harvest-hub-preizkus.vercel.app/ | grep -o "Preizkus je odprt[^.]*"
```

Datum začetka je `TRIAL_STARTS`, konca `TRIAL_ENDS`. Oba sta trenutek, ne dan: `TRIAL_STARTS` je
prvi trenutek, ko je odprto, `TRIAL_ENDS` prvi trenutek, ko ni več.

Ne zanašaj se na `vercel env ls` ali `vercel env pull`: prvi pokaže samo, da spremenljivka
obstaja, drugi pa za vse šifrirane vrednosti izpiše prazno. Edini zanesljiv vir je stran sama.

Zapreti ga takoj (npr. če se dogovorita drugače):

```bash
cd "/Users/ianveber/Desktop/Cloude CODE/clients/harvest-hub/trial" && vercel env rm TRIAL_ENDS production --yes; echo "2020-01-01T00:00:00Z" | vercel env add TRIAL_ENDS production && vercel deploy --prod --yes
```

---

## Preden pošlješ

Troje, in prvo je edino, ki resnično blokira.

**1 · Podpisan Aneks št. 1** (`10-aneks-1-gostovani-preizkus.md`). Osnovna pogodba opisuje
obdelavo na tvojem računalniku. Ta preizkus teče na strežniku in doda drugega podobdelovalca
(gostitelja), kar 6. točka osnovne pogodbe brez pisnega soglasja **izrecno prepoveduje**. Dokler
aneks ni podpisan, imaš pogodbo, ki opisuje nekaj drugega, kot se dejansko dogaja — v dokumentih z
zdravstvenimi podatki po 9. členu je to slabše kot nič.

> Do podpisa jim preizkus lahko izročiš samo z izrecnim navodilom, naj vanj nalagajo **izmišljene
> ali anonimizirane** dokumente. Vzorčna ponudba je za to vgrajena v samo stran, pod poljem za
> nalaganje — ni je treba pripenjati in je ne morejo zgrešiti.

**2 · Zgornja meja porabe pri Anthropicu.** Vgrajena omejitev v strežniku velja za posamezen
strežniški proces, ne za preizkus kot celoto — ustavi podivjano zanko, ni pa strop. Strop nastavi
v nastavitvah računa Anthropic. Ocena za 14 dni normalne uporabe: **nekaj evrov**, ne desetine.

**3 · Pogoji gostitelja s standardnimi pogodbenimi določili** — aneks (A4) obljublja, da jih na
zahtevo predložiš.

---

## Kaj napisati Petri

Zadeva: **Preizkusna različica: avtomatizacija prenosa dokumentacije**

> Pozdravljena Petra,
>
> preizkusna različica je pripravljena. Odprete jo na
> **https://harvest-hub-preizkus.vercel.app**, koda za vstop je **[vstavi kodo]**. Vnesete jo samo
> enkrat, potem si jo brskalnik zapomni.
>
> Odprta je **od danes, 5. 8., do vključno 18. 8. 2026**. Obe meji pišeta na vstopni strani.
>
> Preden začnete, eno pojasnilo, ki se mi zdi pomembnejše od navodil za uporabo. **To, kar boste
> videli, je približek avtomatizacije in približek končnega produkta, ni pa še produkt.** Je naše
> izhodišče. Pokazati mora, da se dokumenti dajo brati zanesljivo in da kontrolni list nastane sam,
> in prav to tudi pokaže. Ni pa še povezan z eDOKUMENTI ne z Zavarovalniškim programom, nima
> uporabniških računov in ne vodi evidence, kdo je kaj naredil. Vse to pride v končni rešitvi.
>
> Iz tega izhodišča gradimo naprej, in teh štirinajst dni je tisto, kar določi, v katero smer. Kar
> boste povedali, gre neposredno v končni produkt, ne v predal s pripombami.
>
> Deluje tako, da ponudbo ali celo mapo povlečete na stran. Kontrolni list se izpolni sam, ob
> vsakem podatku pa piše, ali je prebran iz ponudbe ali čaka na vašo potrditev.
>
> **Dvoje bi vas prosil, da spremljate.**
>
> Prvo je, kje se moti. Vsak konkreten primer, kjer je podatek prebral narobe ali dokumenta ni
> prepoznal, je za nas več vreden kot splošen vtis. Kar najdete, popravimo sproti, še med
> preizkusom.
>
> Drugo je čas. Cela stvar obstaja zato, da vam ga prihrani, in edina številka, ki to zares pove,
> je vaša. V panelu »Koliko časa to vzame danes?« vpišete, koliko minut vam posamezna ponudba
> vzame ročno danes: prevzem iz e-pošte, shranjevanje, preverjanje popolnosti, prepis v
> eDOKUMENTE, prepis istih podatkov v Zavarovalniški program, izpolnitev kontrolnega lista in
> privolitvene izjave. Vpišete enkrat. Od tam naprej se v kartici »Prihranek v tem preizkusu«
> sešteva, koliko ste prihranili, čez vse, kar ste dali skozi. Ob koncu kliknete »Kopiraj
> povzetek« in mi ga pošljete.
>
> To je številka, ki jo bova gledala, ko se bova pogovarjala o nadaljevanju, in raje jo imam vašo
> kot svojo. Če se izkaže, da je prihranek majhen ali da je stroj kje celo počasnejši od vas, mi
> to prav tako povejte. Takrat je smiselno gledati, kje se da še kaj skrajšati, ne pa iskati lepšo
> številko.
>
> Dvoje pa še, da veste vnaprej:
>
> 1. **Vzorčni dokument je kar v aplikaciji.** Pod poljem za nalaganje piše »Nimate ponudbe pri
>    roki?«, kliknete *Prenesite vzorčno ponudbo* in jo povlečete nazaj na stran. Podatki v njej
>    so izmišljeni. Dokler ne podpiševa priloženega aneksa k pogodbi o obdelavi osebnih podatkov,
>    vas prosim, da uporabljate ta vzorec in ne resničnih ponudb strank. Aneks je v priponki, ena
>    stran.
> 2. **Pri nas se ne shrani nič**, ne dokument ne prebrani podatki. Števec prihranka teče v vašem
>    brskalniku, na vaši napravi, in vsebuje samo števila in čas. K nam ne pride, dokler mi ga
>    sami ne pošljete. Ker preizkus teče na gostovanem strežniku, gostitelj vodi svoj tehnični
>    dnevnik zahtevkov (čas, naslov strani, status), brez vsebine dokumentov. Vse to piše v
>    aneksu.
>
> Če se pri čemer koli zatakne, mi kar pišite.
>
> Lep pozdrav,
> Anej

Priloga: `10-aneks-1-gostovani-preizkus.md`
(vzorčno ponudbo prenesejo iz same aplikacije — ni treba pripenjati)

---

## Kaj naj preizkusijo

Vrstni red je namenoma tak: najprej kaj zna, potem kje neha.

| | Kaj naredijo | Kaj morajo videti |
|---|---|---|
| 0 | Kliknejo *Prenesite vzorčno ponudbo* pod poljem za nalaganje | Prenese se `Vzorcna-ponudba.pdf` z izmišljenimi podatki — edini dokument, ki ga smejo uporabiti pred podpisom aneksa. |
| 1 | Povlečejo to ponudbo nazaj na stran | Izpolnjen kontrolni list, ob vsakem podatku oznaka izvora. Miška nad oznako pove, zakaj je taka. |
| 2 | Kliknejo *Naloži register zastopnikov* in naložijo svoj seznam (CSV, dva stolpca) — ali vzorčnega s strani | Številka zastopnika se izpolni, oznaka se spremeni v *Iz registra*. Seznam ostane v brskalniku. |
| 3 | Povlečejo cel paket naenkrat | Seznam paketa se izriše **prej** kot karkoli drugega — nič se ne more tiho preskočiti. |
| 4 | Povlečejo paket **brez** 545. člena | ⚠️ *Paket zadržan*. Kontrola, ki ustavi. |
| 5 | Povlečejo kolektivno polico | *Kontrolnega lista ne izpolnim* — zavarovanci niso poimensko navedeni. Brez predogleda, brez gumbov. |
| 6 | Povlečejo skeniran dokument | Prebere se s slike. Počasneje. Rokopisne opombe so prezrte in tako tudi piše. |
| 7 | Kliknejo *Prenesi podatke za eDOKUMENTE* | Datoteka, katere številke se ujemajo s tem, kar je na zaslonu. |

**Točka 5 je najpomembnejša.** Vsak zna pokazati, kaj zna prebrati; to, da sistem pove, kje neha,
je stvar, ki jo kupijo.

Če vprašajo »koliko časa nam to vzame danes«: tega podatka nimajo, sami so tako rekli. Panel
*Koliko časa to vzame danes?* je zato tam, da številko **izpeljeta skupaj** — šest korakov, vpišeta
minute, primerjava se izriše sama.

---

## Kaj vprašati po koncu

Tri vprašanja, ki odločijo o Fazi 1 — ne »vam je bilo všeč«:

1. **Kateri podatek je prebral narobe?** Vsak konkreten primer je vreden več kot splošen vtis.
2. **Katerega dokumenta ni prepoznal?** Danes prepozna **štiri** vrste — Ponudba, 545. člen,
   Kontrolni list, Privolitvena izjava; vse ostalo pošteno pove, da ne pozna. Kar naštejejo, je
   seznam za Fazo 1.
3. **Kaj v kontrolnem listu manjka?** Polja so povzeta po njihovem obrazcu, poimenovanja so naša.

---

## Kaj se zgodi 19. 8.

Dostop se zapre sam — tudi tistim, ki so kodo že vnesli. Strežnik odgovori z zavrnitvijo in
kratkim pojasnilom v slovenščini. **Ni ročnega koraka in ne moreš pozabiti.**

Preverjeno tako, da sem datum prestavil v preteklost, namestitev objavil in poskusil vstopiti z
veljavnim piškotkom: 410, tudi na branje dokumenta.

Po koncu jim po aneksu (A6) pisno potrdiš, da pri tebi ni ničesar za izbrisati in da je namestitev
odstranjena. Odstranitev:

```bash
vercel remove harvest-hub-preizkus --yes && vercel project rm harvest-hub-preizkus --yes
```

`vercel remove` odstrani samo namestitve — projekt in njegove nastavitve (vključno s kodo za
vstop) ostanejo, dokler ne odstraniš še projekta.

---

## Kaj preizkus namenoma ni

Povej vnaprej, ne ko vprašajo:

- **Pri nas se ne shrani nič.** Zato tudi ni sledi, kdo je kaj delal. To je odločitev, ne
  pomanjkljivost — a v produkciji bo sled potrebna. Gostitelj vodi svoj dnevnik zahtevkov (čas,
  naslov, status), brez vsebine dokumentov.
- **Ena skupna koda**, ne uporabniški računi.
- **Ni povezave z eDOKUMENTI ali zavarovalniškim programom.** Izvoz je predlog strukture, ki ga
  predajo svojemu dobavitelju; poimenovanja polj potrdite skupaj v Fazi 0.
- **Ni zagotovljene razpoložljivosti.** Občasno lahko ni dosegljivo.
- **Branje ne poteka v EU.** Gostovanje je v Frankfurtu, samo branje pa še vedno v ZDA. Aneks
  (A4) to pove izrecno, ker je razlika taka, ki se jo hitro narobe razume.

---

## Če kaj ne dela

| Simptom | Kaj je | Kaj narediti |
|---|---|---|
| »Preizkus je zaključen« pred 19. 8. | `TRIAL_ENDS` je napačen ali neberljiv — vrata se v tem primeru **zaprejo**, ne odprejo | Nastavi datum znova (ukaz zgoraj) |
| Stran zahteva kodo, čeprav so jo vnesli | Piškotek je potekel ali drug brskalnik | Vnesejo znova |
| Branje se ne konča | Ključ ali strop porabe pri Anthropicu | `vercel logs harvest-hub-preizkus` |
| Vse je jantarno | Register ni naložen | Kliknejo *Naloži register zastopnikov* |

Stanje kadar koli:

```bash
cd "/Users/ianveber/Desktop/Cloude CODE/clients/harvest-hub/trial" && node test-deploy.mjs && node test-logs.mjs && node test-gate.mjs
```

**Pred vsakim commitom** (repozitorij je javen — enkrat je vanj že ušel resničen e-naslov
zastopnika, ker je bil zapisan z velikimi črkami in so ga vse preverbe brez `-i` spregledale):

```bash
cd "/Users/ianveber/Desktop/Cloude CODE/clients/harvest-hub" && ./scan-personal-data.sh
```
