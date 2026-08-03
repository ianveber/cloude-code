# Predaja preizkusa Harvest Hubu

Vse, kar potrebuješ za izročitev. Spodaj: dostop, kaj poslati, kaj naj preizkusijo, kaj se
zgodi na koncu, in kaj moraš urediti **preden** kdor koli naloži resnično ponudbo.

---

## Dostop

| | |
|---|---|
| **Naslov** | https://harvest-hub-preizkus.vercel.app |
| **Koda za vstop** | v `~/ais-client-data/harvest-hub/preizkus-dostop.txt` |
| **Konec preizkusa** | **17. 8. 2026** — po tem se dostop zapre sam |

> Kode v tem zapisu namenoma ni. Repozitorij je javen, koda pa je edino, kar preizkus varuje —
> zapisana tukaj bi vrata odprla vsem. Živi ob podatkih stranke, zunaj repozitorija:
> ```bash
> cat ~/ais-client-data/harvest-hub/preizkus-dostop.txt
> ```

Koda se vnese enkrat; brskalnik si jo zapomni do konca preizkusa. Stran je neindeksirana in nanjo
ne kaže nobena javna povezava.

**Datum konca lahko premakneš** — če jim preizkusa ne izročiš danes, ga zamakni, da dobijo polnih
14 dni:

```bash
cd "/Users/ianveber/Desktop/Cloude CODE/clients/harvest-hub/trial" && printf '2026-08-24' | vercel env add TRIAL_ENDS production --force && vercel deploy --prod --yes
```

Zapreti ga takoj (npr. če se dogovorita drugače):

```bash
cd "/Users/ianveber/Desktop/Cloude CODE/clients/harvest-hub/trial" && printf '2026-08-03' | vercel env add TRIAL_ENDS production --force && vercel deploy --prod --yes
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
> ali anonimizirane** dokumente. Vzorčni dokument za to je priložen (spodaj).

**2 · Zgornja meja porabe pri Anthropicu.** Vgrajena omejitev v strežniku velja za posamezen
strežniški proces, ne za preizkus kot celoto — ustavi podivjano zanko, ni pa strop. Strop nastavi
v nastavitvah računa Anthropic. Ocena za 14 dni normalne uporabe: **nekaj evrov**, ne desetine.

**3 · Pogoji gostitelja s standardnimi pogodbenimi določili** — aneks (A4) obljublja, da jih na
zahtevo predložiš.

---

## Kaj jim napisati

> Pozdravljeni [ime],
>
> pošiljam preizkusno različico, kot dogovorjeno. Odprete jo na
> **https://harvest-hub-preizkus.vercel.app**, koda za vstop je **[vstavi kodo]**. Vnesete jo
> enkrat.
>
> Deluje tako, da ponudbo (ali celo mapo) povlečete na stran. Kontrolni list se izpolni sam,
> zraven pa piše, kateri podatek je prebran iz ponudbe in kateri potrebuje vašo potrditev.
>
> Preizkus je odprt do **17. 8. 2026**, potem se zapre sam.
>
> Dvoje vas prosim, da veste vnaprej:
>
> 1. **Priložen je vzorčni dokument z izmišljenimi podatki.** Dokler ne podpiševa priloženega
>    aneksa k pogodbi o obdelavi osebnih podatkov, vas prosim, da nalagate ta vzorec in ne
>    resničnih ponudb strank. Aneks pošiljam v priponki — gre za eno stran.
> 2. **Nič se ne shrani.** Ne dokument, ne prebrani podatki. To pomeni tudi, da po koncu
>    preizkusa ni ničesar za izbrisati — in da preizkus ne beleži, kdo je kaj delal.
>
> Zanima me predvsem, kje se moti in kaj manjka. Tisto, kar najdete, popravimo sproti.
>
> Lep pozdrav,
> Anej

Priloge: `Vzorcna-ponudba.pdf`, `10-aneks-1-gostovani-preizkus.md`

---

## Kaj naj preizkusijo

Vrstni red je namenoma tak: najprej kaj zna, potem kje neha.

| | Kaj naredijo | Kaj morajo videti |
|---|---|---|
| 1 | Povlečejo eno ponudbo | Izpolnjen kontrolni list, ob vsakem podatku oznaka izvora. Miška nad oznako pove, zakaj je taka. |
| 2 | Kliknejo *Naloži register zastopnikov* in naložijo svoj seznam (CSV, dva stolpca) | Številka zastopnika se izpolni, oznaka se spremeni v *Iz registra*. Seznam ostane v brskalniku. |
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
2. **Katerega dokumenta ni prepoznal?** Danes prepozna pet vrst; vse ostalo pošteno pove, da ne
   pozna. Kar naštejejo, je seznam za Fazo 1.
3. **Kaj v kontrolnem listu manjka?** Polja so povzeta po njihovem obrazcu, poimenovanja so naša.

---

## Kaj se zgodi 17. 8.

Dostop se zapre sam — tudi tistim, ki so kodo že vnesli. Strežnik odgovori z zavrnitvijo in
kratkim pojasnilom v slovenščini. **Ni ročnega koraka in ne moreš pozabiti.**

Preverjeno tako, da sem datum prestavil v preteklost, namestitev objavil in poskusil vstopiti z
veljavnim piškotkom: 410, tudi na branje dokumenta.

Po koncu jim po aneksu (A6) pisno potrdiš, da pri tebi ni ničesar za izbrisati in da je namestitev
odstranjena. Odstranitev:

```bash
vercel remove harvest-hub-preizkus --yes
```

---

## Kaj preizkus namenoma ni

Povej vnaprej, ne ko vprašajo:

- **Ne shrani ničesar.** Zato tudi ni sledi, kdo je kaj delal. To je odločitev, ne pomanjkljivost
  — a v produkciji bo sled potrebna.
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
| »Preizkus je zaključen« pred 17. 8. | `TRIAL_ENDS` je napačen ali neberljiv — vrata se v tem primeru **zaprejo**, ne odprejo | Nastavi datum znova (ukaz zgoraj) |
| Stran zahteva kodo, čeprav so jo vnesli | Piškotek je potekel ali drug brskalnik | Vnesejo znova |
| Branje se ne konča | Ključ ali strop porabe pri Anthropicu | `vercel logs harvest-hub-preizkus` |
| Vse je jantarno | Register ni naložen | Kliknejo *Naloži register zastopnikov* |

Stanje kadar koli:

```bash
cd "/Users/ianveber/Desktop/Cloude CODE/clients/harvest-hub/trial" && node test-deploy.mjs && node test-logs.mjs
```
