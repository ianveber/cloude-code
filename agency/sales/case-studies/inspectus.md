# INSPECTUS — 314 vozil, 380 poškodb, nič izgubljenih

> **STATUS: OSNUTEK — ni za objavo.** Naročnik še ni bil zaprošen za dovoljenje. Glej interni dodatek na dnu (v angleščini), preden karkoli od tega zapusti to mapo.

**Panoga:** neodvisen avtomobilski nadzor · **Trg:** Slovenija, Luka Koper · **Faza:** 1 — izvedeno in v živo od junija 2026

---

## Povzetek

INSPECTUS d.o.o. je neodvisna kontrolna organizacija, ki v Luki Koper pregleduje vozila ob razkladanju. Njihov izdelek ni pregled — izdelek je **zapis** pregleda: dokumentacija VLDR, na katero se opirajo ladjar, zavarovalnica in proizvajalec, ko odločajo, kdo je odgovoren za poškodbo.

Zapis je nastajal ročno iz Excelove datoteke SURVEY REPORT. AIS je ta korak avtomatiziral. Sistem je v živo od junija 2026 in na resničnih podatkih naročnika obdelal **314 vozil s 380 poškodbami — brez enega izpada in brez ene napačne oznake.**

---

## 1 · Kdo je naročnik

INSPECTUS d.o.o., Ferrarska ulica 16, Koper. Neodvisen avtomobilski nadzor v Luki Koper — enem največjih avtomobilskih pristanišč v Evropi, skozi katero letno steče približno 800.000 vozil.

Naročnik obdela **500–600 obrazcev na teden**. Odločevalec je lastnik-operater: o obsegu in podpisu odloči v isti sobi, brez komisije in brez nabavnega postopka.

Bistveno za razumevanje ostalega: kot neodvisna kontrolna organizacija INSPECTUS ne prodaja mnenja, ampak **preverljiv zapis**. Napačna oznaka ni administrativna nevšečnost — je sporno poročilo za naročnika in vprašaj nad celotnim pregledom.

## 2 · Problem

Med terenskim pregledom in končno dokumentacijo je stal ročni korak.

Inšpektor je zapis oddal kot **SURVEY REPORT.xlsx** — eno vrstico na poškodbo, več vrstic na vozilo. Iz tega je bilo treba pripraviti:

- **VIN-FILAJ** — eno vrstico na vozilo, v obliki, ki jo sprejme njihova predloga PRINT VLDR
- **kartice VLDR** na obrazcu EU 6546
- **združen Survey Report** — isti stolpci, strnjeni na eno vrstico na vozilo

Vsak od teh korakov je pomenil združevanje po VIN, brisanje dvojnikov in preverjanje polj. Pri 500–600 obrazcih na teden je bila to ponovljiva, monotona obdelava — in monotonija je najdražji del vsakega postopka, ker se napaka v njej ne opazi.

Tri konkretne pasti, ki jih je ročni postopek puščal odprte:

1. **Napačne ali neobstoječe kode poškodb** — koda, ki je AIAG-ECG / M-22 ne pozna, gre skozi neopažena.
2. **Prazna polja CLASS** — vozilo brez razreda poškodbe je nepopoln zapis.
3. **Nelogične kombinacije** — resnost in razred, ki se izključujeta.

Nobena od teh ne ustavi izvoza. Vse tri pridejo do naročnika.

## 3 · Kaj je sistem prevzel

Eno funkcijo, od začetka do konca: **iz oddanega SURVEY REPORT do dokumentacije VLDR, pripravljene za tisk.**

Sistem prevzame:

| Komponenta | Kaj počne |
|---|---|
| Samodejni ETL | Uvoz SURVEY REPORT, združevanje po VIN, brisanje dvojnikov, preverjanje polj |
| VIN-FILAJ + VLDR | Izvoz pade naravnost v obstoječo predlogo PRINT VLDR, po formatu AIAG-ECG / M-22 |
| Kartice VLDR | Kartica za vsako vozilo na obrazcu EU 6546, izvoz v JPG |
| Združen Survey Report | Isti stolpci, ena vrstica na vozilo |
| Validacija z AI | Označi napačne kode, prazne CLASS in nelogične kombinacije — s predlogom popravka |
| Slovenski povzetki | Povzetek poročila v jeziku odgovornosti prevoznikov |
| Poizvedba v naravnem jeziku | »Pokaži vse VINe z resnostjo 3 in razredom Večja« → takojšen filter |

Kar sistem **ni** prevzel: sam pregled. Strokovna presoja inšpektorja na terenu je jedro izdelka in ostaja nedotaknjena. Prav tako ostaja pri človeku zadnja beseda pred izvozom — zavihek za urejanje obstaja ravno zato.

## 4 · Kako je zgrajen

Tri odločitve, ki so oblikovale rešitev, in vse tri izhajajo iz tega, da gre za regulirano kontrolno dejavnost.

**Obdelava teče lokalno v brskalniku.** Excelove datoteke se ne naložijo nikamor. Surovi podatki o vozilih — VIN številke — **ne zapustijo naprave**. Umetna inteligenca prejme le agregirano statistiko: število vozil, porazdelitev razredov. Nikoli posameznega VIN.

**Sistem teče na ključih naročnika, koda je njegova.** Brez vezave na ponudnika. Če AIS jutri izgine, sistem teče naprej.

**Validacija predlaga, ne popravlja.** AI označi nedosledno kodo in predlaga popravek. Potrdi ga človek. Za neodvisno kontrolno organizacijo je to edina sprejemljiva razmejitev — zapis, ki ga je tiho popravil stroj, ni več preverljiv zapis.

Uvedba je tekla **ob boku obstoječega postopka**, ne namesto njega. Dokler ekipa ni potrdila, da je bolje, se v tekočem delu ni spremenilo nič.

## 5 · Kaj je izmerjeno

Na resničnih podatkih naročnika, prvo poročilo:

| | |
|---|---|
| **314** | obdelanih vozil |
| **380** | zabeleženih poškodb |
| **0** | izpadov |
| **0** | napačnih oznak |
| **0** | izgubljenih poškodb |

Izvoz pade neposredno v obstoječo predlogo PRINT VLDR — brez ročnega preurejanja stolpcev.

Sistem je v živo na `inspectus-vldr.vercel.app` in ga ekipa uporablja v tekočem delu.

**Kar ni izmerjeno, in tega ne bomo predstavljali, kot da je.** Prihranka časa za to fazo nismo merili. Pogodba je ob podpisu ocenila, da nekaj minut prihranka na primer pri 500–600 obrazcih na teden pomeni več deset ur na mesec — a to je bila ocena pred zagonom, ne meritev po njem. Dokler ne izmerimo, ostaja ocena.

Dosežena številka je zato **točnost, ne hitrost**: 314 vozil, nič napačnih oznak. Za kontrolno organizacijo je to tudi tista, ki šteje bolj.

## 6 · Kaj ni šlo gladko

**Prihranka časa nismo izmerili, ker nismo posneli izhodiščnega stanja.** Napaka na naši strani in je ni mogoče popraviti za nazaj — izhodiščni čas obstaja samo, dokler stari postopek še teče. Odslej se čas na obrazec izmeri pred zagonom, preden se karkoli spremeni.

**Uvajalna lestvica ni bila formalno dokumentirana.** Orodje je po zasnovi človek-v-zanki — operater pregleda in potrdi pred izvozom — zato tveganje samodejnega zapisa ne obstaja. To je bil dober rezultat iz pravega razloga, a ne nadomešča zapisanega poteka od branja do samostojnega delovanja. Pri naslednji fazi se dokumentira.

**Naslednja faza je zgrajena in obstala.** Prijava in shranjeni zagoni (INSPECTUS OS, faza 2) so razviti, a čakajo na okolje, ki še ni bilo ustvarjeno. Gradnja pred pripravljeno infrastrukturo je zapravljeno delo — in tega dela je zdaj nekaj na polici.

## 7 · Kaj sledi

Faza 1 je avtomatizirala vse **od datoteke naprej**. Vse pred datoteko je še vedno ročno.

Danes inšpektor fotografira približno 200 vozil na ladjo, kar nanese okoli 6.000 fotografij v eni mapi, poimenovanih samo z zaporedno številko. Nekdo v pisarni nato med njimi išče fotografije VIN tablic in ročno prepiše 17 znakov na vozilo.

Predlagana naslednja faza je **pametni filter**, ki fotografije razvrsti k pravim vozilom sproti. V nadzorovanem testu je bralnik pravilno prebral **9 od 9 VIN številk**, z dvema neodvisnima kontrolama: oblika VIN (17 dovoljenih znakov) in primerjava s seznamom razkladanja. Kar ne prestane obeh kontrol, gre v predal za ročni pregled — sistem ne ugiba.

Ta faza še ni potrjena. Njeni prihranki so **projekcija, ne rezultat**, in so v ponudbi tudi tako označeni.

## 8 · Če vodite podoben postopek

Vzorec, ki ga je INSPECTUS pokazal, se ponovi povsod, kjer strukturiran dokument pride v hišo in ga nekdo prepiše naprej:

- **Če isti podatek vtipkate dvakrat, imate dva sistema in človeka namesto povezave med njima.** To je najzanesljivejši znak, da je funkcijo mogoče prevzeti v celoti.
- **Merite izhodiščno stanje, preden karkoli spremenite.** Mi tega nismo naredili in številke o prihranku zato nimamo. Traja pol ure.
- **Zahtevajte, da sistem nikoli tiho ne popravi zapisa.** Predlog, ki ga potrdi človek, je preverljiv. Samodejen popravek ni.
- **Vprašajte, kje živijo vaši podatki.** Pri INSPECTUS VIN številke ne zapustijo naprave. To ni bila dodatna zahteva — bila je pogoj zasnove.

---
---

# INTERNAL — NOT FOR THE CLIENT

Everything below stays in the repo. Nothing here goes into a Slovene client document.

## Status

**Draft. No permission has been asked for.** Per `sales/case-study-template.md` the sequence is: written acknowledgment of intent → draft → 2-week client review → written sign-off filed at `engagements/inspectus/case-study/approval.md`. Step one has not happened. This draft exists to make that ask concrete rather than to pre-empt it.

Suggested ask to the sponsor:

> Faza 1 teče od junija in rezultat je dober — 314 vozil brez napačne oznake. Radi bi to opisali kot referenčni primer za našo prakso. Ste odprti za to? Lahko objavimo z imenom, anonimizirano ali nekje vmes — vaša izbira.

## What was corrected while writing this

`engagements/inspectus/client.json` recorded the engagement as **€14,900 + €590/mo**. That is the **unsigned VIN smart-filter proposal** from August 2026, not delivered work. The delivered engagement is **Contract A, 4 June 2026: €1,900 one-off + €200/mo** (existing subscription now €227/mo per the August economics doc). Corrected in `client.json`; the dashboard now shows the real figures.

This matters beyond bookkeeping: a case study built on the €14,900 number would have described work the client has not bought.

## Commercial judgment — do not publish the Phase 1 fee

The draft deliberately contains **no fee figures**. Publishing "€1,900 + €200/mo" would anchor every future document-operations prospect at that number, and `verticals/document-operations.md` §6 already establishes that AIS is underpricing this vertical (INSPECTUS VIN: €14,900 against a €19,700 internal recommendation, €47–60/hour effective).

If Ian wants pricing in the published version, use a band tied to shape rather than the historical figure — **`€15K–€22K build + €900–€1,400/mo`** for a single document type and one target system, per `verticals/document-operations.md` §6 (band revised upward 2026-08-09; the earlier €12K–€18K + €350–€600/mo is superseded and must not be published — it was derived from what INSPECTUS happened to pay rather than from what the work replaces).

## Facts used, and where each came from

| Claim | Source |
|---|---|
| 314 vehicles, 0 dropouts, 0 mislabels | `Pogodba-A-Avtomatizacija-VLDR-izvedeno.docx`, DOKAZANO section |
| 380 damages, 0 lost | `prezentacija-vin/index.html`, slide 2 |
| 500–600 forms/week | Contract A, NALOŽBA section |
| ~800,000 vehicles/year at Luka Koper | `Pogodba-C`, scalability line |
| Local browser processing, VINs never leave device | `NAVODILA-VLDR.md`, Zasebnost |
| Client's own API keys, code is theirs | Contract A, POGOJI |
| 9/9 VIN in controlled test | `prezentacija-vin/index.html`, slides 8 and 12 |
| ~200 vehicles, ~6,000 photos per ship | `prezentacija-vin/index.html`, slides 2–3 |
| AIAG-ECG / M-22, EU 6546, PRINT VLDR | Contract A, OBSEG; presentation slide 2 |

**Deliberately excluded as unverified:** the ~11 hours/ship and 90% reduction figures (VIN filter projection, unsigned), the ~20 hours/month retyping figure (Contract B, unsigned), and any Phase 1 time saving (never measured).

## Items needing client confirmation before publication

1. Attribution — named or anonymized
2. The 314 / 380 / 0 / 0 figures as publishable
3. Naming Luka Koper and the automotive-inspection vertical
4. Section 6 (»Kaj ni šlo gladko«) — clients are often surprised we want this published. It is what makes the rest credible, and Claude-based AI search cites hedged, limitation-acknowledging content at roughly 1.7× while penalising absolutist marketing language at ~0.2×. Worth explaining rather than dropping.
5. Whether `inspectus-vldr.vercel.app` may be named publicly

## Anchor metric

**314 vehicles, 380 damages, zero mislabels, on live client data.**

Quantifiable, defensible from the contract, material to a control organisation whose product is a verifiable record, and specific to this engagement. It is deliberately an *accuracy* metric rather than a time metric, because the time metric does not exist.

## Distribution once approved

Per `sales/case-study-template.md`: AIS site day 0 → LinkedIn day 1–3 → vertical syndication day 7 → inbound enablement day 14 → outbound day 30 → retrospective day 90.

Two additions specific to this vertical, from `sales/profile-funnel.md`:

- This is nurture piece #6 in the sequence. Pieces 1–5 do not work without it.
- Structure it for AI search when it goes on the site: answer-first paragraph, `llms.txt` entry, GEAF headings. Slovene-language queries about document automation in regulated flows have almost no competition.

## Still open

Harvest Hub's case study. Two engagements, one draft. The second one is the one with a live trial and an unsigned annexe expiring 17 August — write it while the relationship is warm.
