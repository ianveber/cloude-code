# G4 — PREVZEM IN PREDAJA (acceptance & handover)

**Protokol:** AI Infrastructure Protocol · Gate 4, preoblikovan
**Naročnik:** Harvest Hub, zavarovalniško zastopanje d.o.o.
**Izvajalec:** AIS Slovenija — Anej Vučič s.p.
**Datum:** 30. 7. 2026 · **Avtor:** interni pregled
**Jezik:** analiza v angleščini; **razdelka 1.7, 2.2, 2.3 in 3.2 so v slovenščini in so pripravljeni za prenos v prilogo pogodbe.**

> **Status: RUMEN.** The acceptance test and the handover package can both be fully specified today,
> and this document specifies them. What is not resolvable here is a single commercial decision that
> only Ian can make (§1.2, the second threshold) and one contractual sentence that must be added
> before signature (§3.2, model retirement). Neither is expensive. Both become expensive later.

---

## ⚠️ 0a · The build moved again while this gate was running — and it is not running now

Recorded, not worked around, exactly as G2 recorded the 10:45–10:51 move.

- `demo/server.mjs` was modified at **11:16:11**, mid-gate. Nothing in this gate wrote to `demo/`;
  every command here was a read. Verified: all other `lib/*.js` and `scripts/*.mjs` mtimes predate
  11:06.
- The change is **+48 lines** and is a good fix — it closes G3a R-3 by adding a Host/Origin
  loopback guard on **every** route plus a rate limit (60 calls/min) and a cost ceiling ($5/run) on
  `/api/extract`.
- **But it is unverified, and the server is down.** Live probe just now: `curl http://127.0.0.1:8020/`
  → connection refused (exit 7). The process G3a observed (PID 41880) is gone. So the demo has not
  been run once against this code.
- **Concrete risk for a presentation that may be today:** the new guard 403s the *static* routes too,
  not just the paid API. `isLocal()` accepts exactly `localhost:8020`, `127.0.0.1:8020`, `[::1]:8020`.
  Any other host spelling the operator's browser sends — a bookmark to `0.0.0.0:8020`, a trailing-dot
  hostname, a different port from an env override reaching a stale bookmark — now returns
  `403 forbidden — local requests only` for the **whole page**, not a degraded feature. Before this
  change the worst case was a working page; now it is a blank refusal in front of the client.

**Recommendation before the meeting, in this order:** start the server, load
`http://localhost:8020/` in the browser that will be used, drag one text-track sample and one scan
through the full flow, and confirm the KLP preview renders. That is a five-minute check and it is
the only thing standing between a good fix and a dead demo.

---

## 0 · What this gate drops, and why

The protocol's Pillar ④ packages a company for investors: moat narrative, unit economics from
cost-taken-out, scalability/defensibility story, an investor-readiness rubric, and an
`INFRASTRUCTURE-REPORT.md` investor annex.

**Harvest Hub is not raising capital.** They are a five-ish-person insurance intermediary buying one
fixed-scope robot. All of it dropped — the rubric, the artifacts→investment-language translation,
the whole package structure. Additionally dropped for the same reason as every prior gate: any hour,
saving, payback or ROI figure, because 07-odgovori records *"Ne razpolagamo s podatkom."*

What replaces it is the thing that is genuinely load-bearing and genuinely undefined: **30 % of the
contract price hangs on a `prevzemni test` that nobody has specified, and the whole engagement ends
in a `predaja` whose contents are one sentence long.** Both are cheap to define now and expensive to
argue about later.

---

# 1 · THE ACCEPTANCE TEST

## 1.1 What the offer actually commits to

From `03-uradna-ponudba.md` (the binding document):

- **JAMSTVO 1**, lines 85–90: *"Na naboru polj, potrjenem ob zaključku Faze 0, jamčimo najmanj 98 %
  natančnost na ravni posameznega polja (delež pravilno prebranih polj, ne delež brezhibnih
  ponudb). Merimo na prevzemnem testu 100 ponudb iz živega prometa, katerega sestava ustreza
  dejanski strukturi vašega prometa. **Kot pravilno se šteje tudi polje, ki ga sistem sam označi kot
  negotovo in usmeri v pregled** — to je lastnost zasnove, ne napaka. Izvzeta so polja, ki jih na
  izvorniku ne more nedvoumno prebrati niti človek, in dokumenti izven oblik, potrjenih v Fazi 0."*
- Lines 92–94: two free correction cycles; if the threshold is still missed **for reasons on the
  solution's side**, the final 30 % is not payable and the client keeps the code.
- Line 138: payment `30 % ob prevzemu, po uspešno opravljenem prevzemnem testu`.
- Line 153: the client supplies `100 ponudb za prevzemni test`.

That is a well-drafted clause. It has one hole, and the hole is large.

## 1.2 🔴 THE HOLE: 98 % is satisfiable with zero automation

Because a **flagged** field counts as **correct**, a system that flags every single field scores
**100 % accuracy** and passes the acceptance test — while saving the client nothing at all. Every
value would still be typed by a human, exactly as today.

Grepped `03-uradna-ponudba.md` for any cap on the flag rate, any straight-through target, any
automation-share number: **there is none.** The word `delež` appears once (line 86) and it is the
accuracy fraction.

This is not a hypothetical drafting quibble, for two reasons:

1. **The design pushes in that direction on purpose.** G2 established that the build has no
   confidence score at all — it has *provenance* (`ponudba` / `pravilo` / `register`), and two of
   those three values already render amber, i.e. "for review". `register`-sourced cells are amber by
   construction. The safest possible implementation of Jamstvo 2 ("nothing below the threshold gets
   written") is to flag more. Jamstvo 1 rewards exactly that.
2. **It is also the number the client will actually judge us on.** Arithmetic, not prediction: at
   ~14 fields per offer, a 2 % per-cell rate of *not-clean* (wrong or flagged) means roughly
   **1 in 4 offers is touched by a human** (0.98¹⁴ ≈ 0.75). If the flag rate is higher than that,
   more. The client will not experience "98 % accurate"; they will experience "how many offers do I
   still have to open".

**Recommendation (Ian's decision, not this document's):** the Faza 0 written sign-off must fix a
**second number** alongside the accuracy threshold — the *samodejna prehodnost* (straight-through
share): the percentage of fields written into eDOKUMENTI with no human touch. Report it at the
acceptance test either way. Whether it is made contractually binding, and at what level, is a
commercial call. Two observations that should inform it:

- We currently have **no basis whatsoever** for setting that number. The demo measures accuracy on
  page 1 of the ponudba only, with no eDOKUMENTI write path in existence. Committing to a
  straight-through percentage today would be inventing a figure — exactly what every prior gate
  refused to do.
- The honest move is therefore: **measure and report it, do not guarantee it, in this contract.**
  State the number at the Faza 1 milestone (week 3, first real reading results) when it is
  measurable, and let both parties see it long before the acceptance test.

There is a third measure, and it is the one that matters most for liability — see §1.7 measure **C**.

## 1.3 What the existing harness measures — exactly

`demo/scripts/verify.mjs` is the working precedent and it is a good one. Verified today (read of the
source; scoring itself deliberately not re-run — see G2 §4 on why re-sending Art. 9 health data to
re-confirm a four-day-old number is not proportionate).

Re-derived the composition of the `157/157` independently from `truth.json` in Python:

| Dokument | Track | VALUE | ABSENT | UNMAPPED | KLP |
|---|---|---:|---:|---:|---:|
| 1 - Naložbeno zavarovanje | text | 11 | 2 | 1 | 1 |
| 2 - Nezgoda | text | 11 | 2 | 1 | 1 |
| 5 - Riziko | text | 11 | 2 | 1 | 1 |
| 2 - Otroci_eden otrok | text | 11 | 2 | 1 | 1 |
| 4 - Premoženje | text | 11 | 2 | 1 | 1 |
| 6 - Zdravstveno zavarovanje | text | 11 | 2 | 1 | 1 |
| 7 - Popotnik | text | 10 | 4 | 0 | 1 |
| 8 - Business box (pravna oseba) | text | 11 | 2 | 1 | 1 |
| 2 - Primer Merkur_dva otroka | VISION | 22 | 4 | 2 | 2 |
| 3 - Primer Otroci - več produktov | VISION | 11 | 2 | 1 | 1 |
| 9 - Primer Kolektivno Zdravje | VISION | 7 | 6 | 1 | 0 |
| **Skupaj** | | **127** | **30** | **11** | **12** |

**127 + 30 = 157.** The denominator is 127 cells where a value exists and had to be read, plus **30
cells (19,1 %) where the correct answer is "leave it blank."** The 11 UNMAPPED cells (the agent's
register number — the one field that exists in no input document at all, G0) are excluded and
reported separately, which is correct and is stated in the file's own header.

## 1.4 🔴 22,9 % of the current denominator cannot be scored wrong

Per-field breakdown, computed from `truth.json`:

| Polje | VALUE | ABSENT | UNMAPPED |
|---|---:|---:|---:|
| `zastopnik_2.ime_priimek` | 0 | **12** | 0 |
| `zastopnik_2.stevilka` | 0 | **12** | 0 |
| `zavarovalnica` | **12** | 0 | 0 |
| `zastopnik_1.stevilka` | 0 | 1 | 11 |
| `zavarovalec.*` (4 polja) | 12 each | 0 | 0 |
| `zavarovanec.*` (4 polja) | 11 each | 1 each | 0 |
| `st_ponudbe` | 12 | 0 | 0 |
| `zastopnik_1.ime_priimek` | 11 | 1 | 0 |

Two of those rows are free cells:

- **`zastopnik_2` is empty on all twelve units — 24 of the 30 ABSENT cells (80 %).** The second
  agent row is blank on every sample document we hold. The extractor earns 24 cells, 15,3 % of the
  denominator, by leaving blank a row that is always blank. (Separately: G0 flagged that the *rule*
  for the second agent row is unknown and needs one question to the client. It is unknown **and**
  it is silently carrying a sixth of the accuracy score.)
- **`zavarovalnica` is a hardcoded constant.** `lib/extract.js:24` defines
  `ZAVAROVALNICA = "Merkur zavarovalnica d.d."` and line 161 writes it into every KLP. It is never
  read from the document — `truth.json`'s own normalisation note says so explicitly (*"Do not read
  it from the logo; set it from the document class"*). It cannot be wrong. 12 cells, 7,6 %.

**24 + 12 = 36 of 157 cells = 22,9 % of the score is unmissable by construction.** A system that
read nothing at all would score 22,9 %.

This does **not** invalidate the 157/157 — the 121 remaining cells were genuinely read and genuinely
correct, and the harness is honest about its own states. But it does two things to the production
test:

1. The headline percentage must never be quoted without its denominator composition beside it.
2. **Minor honesty defect worth fixing before production (not now, build is frozen):**
   `extract.js:161` labels the hardcoded constant `source: "ponudba"`, so the UI shows the client
   *"Iz ponudbe"* — a green dot claiming the value was read off their document. It was not. It is
   the only cell in the system whose provenance label is factually wrong.

## 1.5 What the current harness does NOT cover

Stated plainly, because the production test is an extension of it and every gap here is a gap there:

| # | Not covered | Consequence for the acceptance test |
|---|---|---|
| 1 | **Only the 14 KLP fields.** | The Faza-0 field set will be larger (eDOKUMENTI needs 4 address fields + split phone + split name). Those splits are the fields most likely to fail and none of them are scored today. |
| 2 | **Only page 1, only the ponudba.** | 7 of 11 document classes are never read. The packet-level fields (SEPA, KID, IDD, Spremni dopis) have no truth data at all. |
| 3 | **Only 11 documents, 1 product each.** | The real monthly product mix is unknown (G0). A 100-offer sample drawn wrong would measure the wrong thing. |
| 4 | **Truth keyed by one person, by eye, and that person is the supplier.** | See §1.6 — this is the single biggest methodological problem for a *contractual* test. |
| 5 | **No confidence / threshold.** | Jamstvo 2 has nothing to measure (G2 G-3). |
| 6 | **No flag-rate / straight-through measure.** | §1.2. |
| 7 | **No silent-error measure.** | The single most important number for liability. §1.7 measure C. |
| 8 | **No classification scoring in the accuracy number.** | `test-classify.mjs` (50 assertions) is a separate offline suite; document routing is not part of the 157. |
| 9 | **No gate/control scoring.** | The 545. člen check, davčna mod-11, premija-vs-obrok — none are in the accuracy denominator. |
| 10 | **Annotation defence is not exercised.** | README says so itself: the red handwritten *"Doba napišeš 1 leto"* sits beside a printed *"15 let"*, but `zavarovalna doba` is not one of the 14 fields, so nothing catches a regression. A non-KLP probe field must be added before this is relied on. |

## 1.6 Two defects in the harness itself

Found by reading `verify.mjs`. Neither was fixed (build frozen); both must be fixed before the
harness carries contractual weight.

**D-10 — `matchUnit()` is not bijective (verify.mjs:100–105, 145–155).** On a document that fans out
to several kontrolni listi, each produced output is matched to a truth unit by insured name, and on
no match it silently falls back to `units[0]`:

```js
function matchUnit(units, got) {
  if (units.length === 1) return units[0];
  const name = norm(got["zavarovanec.ime_priimek"]?.value);
  return units.find((u) => eq(u.cells["zavarovanec.ime_priimek"].value, name)) || units[0];
}
```

Failure scenario: a document with two insured children where the extractor emits **child A twice**.
`klp_count` is 2, so the count assertion passes. Both outputs match unit A by name, so both score
against A's truth — and both score 100 %. Child B is never compared to anything and its disappearance
is invisible. Today the blast radius is one document (only `2 - Primer Merkur_dva otroka.pdf` fans
out). On 100 real offers with children it is a live hole in a contractual number.
**Fix:** consume each truth unit at most once; any unmatched truth unit scores all its cells wrong.

**D-11 — no per-field-class reporting.** The harness prints one aggregate percentage. §1.4 shows why
that is not enough: without a breakdown by field class (read / derived / constant / correctly-blank),
a passing score can be carried by cells that cannot fail. The production harness must print the
breakdown, not just the total.

## 1.7 🇸🇮 PROTOKOL PREVZEMNEGA TESTA — pripravljeno za prilogo

> Ta razdelek je namenjen naročniku. Vstavi se kot priloga k pogodbi ali kot zapisnik ob zaključku
> Faze 0, ko je nabor polj pisno potrjen.

### A · Kaj se meri

Meri se **na ravni posamezne celice**: eno polje iz potrjenega nabora, na eni ponudbi. Vsaka celica
dobi eno od štirih ocen:

| Ocena | Pomen |
|---|---|
| **PRAVILNO** | Vrednost, ki jo je sistem zapisal, se ujema z resnico. |
| **OZNAČENO** | Sistem vrednosti ni zapisal, ampak jo je označil kot negotovo in usmeril v pregled. Po Jamstvu 1 se šteje kot pravilno. |
| **NAPAČNO** | Sistem je zapisal vrednost, ki se z resnico ne ujema, in je ni označil. |
| **IZVZETO** | Polje, ki ga na izvorniku ne more nedvoumno prebrati niti človek, ali dokument izven oblik, potrjenih v Fazi 0. Ne šteje v imenovalec. |

### B · Tri številke, ne ena

| | Merilo | Formula | Prag |
|---|---|---|---|
| **A** | **Natančnost** | (PRAVILNO + OZNAČENO) ÷ (PRAVILNO + OZNAČENO + NAPAČNO) | **≥ 98 %** — pogodbeni prag iz Jamstva 1 |
| **B** | **Samodejna prehodnost** | PRAVILNO ÷ (PRAVILNO + OZNAČENO + NAPAČNO) | Se **izmeri in poroča**; prag se dogovori ob zaključku Faze 0, ko je prvič merljiv |
| **C** | **Tihe napake** | število NAPAČNO | To je edino merilo Jamstva 2 |

**Zakaj tri.** Merilo A samo po sebi ne pove, koliko dela je robot prevzel: sistem, ki bi vsa polja
označil za pregled, doseže 100 % po merilu A in naročniku ne prihrani ničesar. Merilo B pove, koliko
dela je dejansko odpadlo. Merilo C pove, kolikokrat je sistem tiho zapisal napačen podatek — to je
edina vrsta napake, ki je naročnik ne vidi, in edina, ki je resnično nevarna.

Poleg treh številk se poroča tudi **razčlenitev imenovalca po vrsti polja**: prebrano iz dokumenta /
izpeljano po pravilu / konstanta / pravilno pusti prazno. Skupna odstotna vrednost brez te
razčlenitve ni popolna informacija.

### C · Vzorec

- **100 ponudb iz živega prometa**, kot določa ponudba.
- **Sestava ustreza dejanski strukturi prometa.** Delež po vrstah zavarovanja se določi iz izvoza
  imen map na strežniku za en cel mesec (izvoz vsebuje samo imena map, nobenega osebnega podatka).
  Ta izvoz je predpogoj za test in je naveden med odprtimi vprašanji Faze 0.
- **Skenirani dokumenti so v vzorcu v dejanskem deležu.** Iz 15 vzorcev je to približno 20 %
  (izmerjeno: 12 od 15 dokumentov ima uporaben besedilni sloj, 3 ga nimajo). Vzorec brez skenov meri
  samo lažjo od obeh poti.
- **Vzorec se zapečati pred zagonom.** Seznam 100 ponudb obe strani pisno potrdita, preden robot
  karkoli prebere. Nobena ponudba se po zagonu ne izloči, razen po pravilu IZVZETO iz razdelka A, in
  vsaka taka izločitev se posebej zabeleži z razlogom.

### D · Resnica (kdo določi, kaj je pravilno)

To je najobčutljivejši del testa in v ponudbi ni urejen.

- Resnico **prepiše sodelavec naročnika** z izvirnega dokumenta, na oko, ne iz izpisa sistema in ne
  iz izvoza robota.
- Prepis nastane **preden** se pogleda rezultat robota.
- Ob neskladju med prepisom in rezultatom robota celico pregledata **dve osebi** — po ena z vsake
  strani. Če se ne strinjata, se celica označi kot IZVZETO in se zabeleži razlog. Izvzetih celic ne
  sme biti več kot 2 % vseh; nad tem se test ponovi z jasnejšim naborom polj.

**Zakaj naročnik in ne izvajalec.** Trenutna referenčna datoteka `truth.json` je bila prepisana na
oko s strani izvajalca. Za razvoj je to pravilno in dokumentirano. Za pogodbeni test ni: izvajalec
ne more hkrati postavljati vprašanj in ocenjevati odgovorov.

### E · Ponovljivost

Ob zagonu testa se zabeleži in preda naročniku:

- točna oznaka uporabljenega modela in različica navodila (prompt),
- različica izvorne kode (git commit),
- različica izvajalnega okolja (node in ostale odvisnosti),
- datum in čas zagona,
- **surova rezultatska datoteka** — vsaka celica, ocena, prebrana vrednost, pričakovana vrednost.

Ta paket je izhodiščna meritev. Vsaka kasnejša trditev, da je sistem "slabši kot ob prevzemu", se
meri proti njemu — ne proti spominu.

### F · Izid

| Izid | Posledica |
|---|---|
| A ≥ 98 % | Test uspešen. Zadnjih 30 % zapade v plačilo. |
| A < 98 % | Izvajalec brez doplačila izvede popravni cikel in test se ponovi na **istem** vzorcu. Največ dva popravna cikla. |
| A < 98 % tudi po drugem ciklu, iz razlogov na strani rešitve | Zadnjih 30 % ni treba plačati; izdelano ostane v lasti naročnika skupaj z izvorno kodo. |
| C > 0 | Vsaka tiha napaka se posebej analizira in zabeleži: vzrok, ali gre za sistemsko napako ali za posamičen primer, in kaj je bilo popravljeno. Merilo C ni pogodbeni prag, je pa obvezna postavka zapisnika. |

### G · Kaj test ne pokriva

Zapisano vnaprej, da o tem ni razprave po testu: test meri **pravilnost prebranih in prenesenih
podatkov**. Ne meri hitrosti obdelave, razpoložljivosti sistemov naročnika, ravnanja ob izpadu
zunanjih ponudnikov niti vedenja na oblikah dokumentov, ki niso bile potrjene v Fazi 0.

## 1.8 What running it actually costs

Grounded in the measured figure, not estimated: `$0.0193/document` (README, 11 documents,
`$0.2118`, 66,6 s).

| Obseg | Dokumentov | Ocenjen strošek | Ocenjen čas |
|---|---:|---:|---:|
| 100 ponudb, samo ponudba (kot danes) | 100 | **≈ 2 $** | ≈ 10 min |
| 100 ponudb, cel paket ~7 dokumentov | 700 | **≈ 14 $** | ≈ 70 min |

The acceptance test is financially trivial to run and to **re-run**. That matters more than it
looks: it means the correction cycles cost nothing, the client can be handed the harness and re-run
it themselves whenever they like (§2.2 item 5), and there is no reason ever to argue about accuracy
from memory. Caveat carried forward from G3b: these figures rest on the `PRICES` constants in
`lib/claude.mjs`, which were **not** independently verified (G2 D-3), and on a model migration not
having happened (G3b: a Bedrock port likely means Sonnet 5, ~30 % more tokens for the same text).

---

# 2 · THE HANDOVER PACKAGE

## 2.1 What `predaja` currently means

The entire contractual content of the handover is one table row (`03-uradna-ponudba.md:49`):

> *"Izvorna koda in materialne avtorske pravice preidejo v vašo last s plačilom celotne vrednosti;
> do tedaj imate pravico do neomejene uporabe. Vključeni dokumentacija, usposabljanje in uvedba 2
> novih produktov."*

Plus line 164: *"Usposabljanje: dve delavnici po največ 3 ure."*

"Dokumentacija" is undefined. That is the whole specification.

The gap is not that the client refused a retainer — that was their right and it is respected
throughout. The gap is that on the last day they will own **an AWS account with Bedrock access, a
host, a database of Art. 9 health data about children, an immutable archive of every document ever
received, write credentials into two systems of record, a mailbox credential and a staff-reachable
console** (G3c), and nobody has written down what they are being handed. Documentation *is* in
scope. This section spends it well.

## 2.2 🇸🇮 PAKET OB PREDAJI — kontrolni seznam

> Ta razdelek je namenjen naročniku. Vsaka postavka ima obliko izdelka, ne obljube.

| # | Postavka | Kaj to je | Zakaj |
|---|---|---|---|
| **1** | **Izvorna koda** | Zaseben repozitorij z vso zgodovino, prenesen na račun naročnika. **Brez vzorčnih ali resničnih dokumentov v drevesu.** V repozitoriju je različicno voden pregled pred oddajo (pre-commit), ki prepreči, da bi kdo osebni podatek dodal kasneje. | Lastništvo kode je pogodbeno. Če je bil karkoli kdaj oddan v repozitorij, se prenese skupaj z njim — in naprej vsakomur, s komer ga naročnik kasneje deli. |
| **2** | **Navodilo za zagon in odvisnosti** | Zapisana različica izvajalnega okolja in vseh zunanjih orodij. Skripta za zagon, ki jasno pade, če katero od njih manjka. | Danes sistem teče, ker teče na računalniku, na katerem je nastal. Zapisano ni nikjer. |
| **3** | **Popis dostopov** | Kaj obstaja (ključ ponudnika AI, dostop do nabiralnika, servisni račun v eDOKUMENTIH, dostop do baze), kje je shranjeno, kdo ga lahko zamenja in kako. | Ob predaji so vsi ti dostopi naročnikovi. Brez popisa ne ve, kaj ima. |
| **4** | **Izhodiščna meritev** | Paket iz razdelka 1.7 E: oznaka modela, različica kode, surova rezultatska datoteka prevzemnega testa. | Vsaka kasnejša trditev "sistem je slabši kot prej" se meri proti tej datoteki. |
| **5** | **Merilno orodje** ⭐ | Skripta, s katero **naročnik sam** kadarkoli izmeri natančnost na svojih dokumentih, ter navodilo, kako pripravi referenčne podatke. | To je najkoristnejša postavka celotnega paketa in v ponudbi ni omenjena. Spremeni vprašanje "se mi zdi, da dela slabše" iz razprave v meritev, ki jo naročnik opravi sam, v pol ure in za nekaj evrov. |
| **6** | **Priročnik za obratovanje** | Razdelek 2.3. | Brez njega je vsaka motnja klic izvajalcu, ki po pogodbi ni dolžan odgovoriti. |
| **7** | **Postopek hrambe in izbrisa** | Kako se dokument izbriše, kako se odgovori na zahtevo posameznika po izbrisu, kaj se pri tem zgodi z revizijsko sledjo. | Naročnik je upravljavec. Roki hrambe po ZZavar-1 so ob pisanju tega dokumenta še odprto vprašanje Faze 0. |
| **8** | **Seznam prepovedi** | Kratek seznam nastavitev, ki jih ni dovoljeno vklopiti: deljenje podatkov s ponudnikom modela, beleženje vsebine zahtevkov pri ponudniku AI, oddaja prevzemnega korpusa v repozitorij. | Vsaka od njih je ena kljukica v konzoli in vsaka ustvari trajno zbirko posebne vrste osebnih podatkov v naročnikovem računu. Podrobno v G3c. |
| **9** | **Imenovani skrbnik in naslov za obvestila** | Ena oseba pri naročniku in en naslov, kamor sistem pošilja obvestila o napakah in tedensko poročilo. | Obveščanje o napakah je v obsegu ponudbe. Naslov, ki ga nihče ne bere, ni obveščanje. |
| **10** | **Stavek o garanciji** | Ena vrstica: garancija 12 mesecev pokriva **odpravo napak**, ne obratovanja, ne nadzora, ne podpore uporabnikom, ne prilagoditev. Tako že piše v ponudbi (Jamstvo 3); ob predaji se ponovi. | Ker bo ta razlika predmet vsakega pogovora v naslednjih 12 mesecih. |
| **11** | **Program obeh delavnic** | Dve delavnici po največ 3 ure, vezani na priročnik. Na eni od njiju se **v živo izvede ena vaja iz priročnika** — po možnosti obnovitev iz varnostne kopije. | Postopek obnovitve, ki ni bil nikoli izveden, ni postopek. |

## 2.3 🇸🇮 PRIROČNIK ZA OBRATOVANJE — obvezne teme

> Vsaka tema ima obliko: **znak → prvi korak → kdo → kdaj klicati koga**.

**① Ponudnik AI ni dosegljiv.** Znak: obdelava se ustavi, obvestilo o napaki. Robot ponudbe ne
zavrže — zadrži jo v vrsti in poskuša znova. Sodelavec ne naredi ničesar prvih 30 minut. Če stanje
traja dlje, se ponudbe do konca dneva obdelajo po **starem, ročnem postopku** — ta pot mora ostati
opisana in uporabna tudi leto po prevzemu.

**② Natančnost je padla.** Znak: več označenih polj kot običajno, ali sodelavec opazi napake. Prvi
korak je **meritev, ne ugibanje**: požene se merilno orodje (postavka 5) na 20 svežih ponudbah in
rezultat se primerja z izhodiščno meritvijo (postavka 4). Nato eno od treh: (a) spremenil se je
vhod — Merkur je spremenil obrazec; (b) spremenil se je model pri ponudniku; (c) napaka v rešitvi.
Samo (c) je napaka po Jamstvu 3. Razlikovanje je izvedljivo prav zato, ker izhodiščna meritev
obstaja.

**③ Pojavi se nova vrsta zavarovanja ali nov tip dokumenta.** Kaj se zgodi samo od sebe: sistem ga
**ne prepozna** in ga **ne zapiše** — uvrsti ga med izjeme. To je pravilno vedenje in ne napaka.
(Modul za razvrščanje danes izrecno zavrne ugibanje pri vrstah dokumentov, za katere nimamo vzorcev;
to je preverjeno s testom.) Kaj mora narediti naročnik: sporočiti izvajalcu. V paketu sta **dve
uvedbi novega produkta, naročeni v 6 mesecih od prevzema** — teh šest mesecev je rok, ki hitro
mine; skrbnik naj si ga zabeleži.

**④ Zamenjava ključa pri ponudniku AI.** Kdaj: ob odhodu sodelavca, ob sumu razkritja, sicer po
notranji politiki. Postopek: ustvari se nov ključ, zapiše v hrambo skrivnosti, sistem se ponovno
zažene, preveri se z eno testno ponudbo, **šele nato** se stari ključ prekliče. Vrstni red je
pomemben — preklic pred preverjanjem ustavi obdelavo.

**⑤ Zamenjava ponudnika AI.** Tehnično je to majhen poseg: celotna povezava s ponudnikom je **ena
datoteka in en klic** (`lib/claude.mjs`, en `POST` s štirimi polji; preverjeno s pregledom celotnega
drevesa — nič, česar druge platforme ne bi podpirale). Zamenjajo se naslov, način prijave in oznaka
modela. **Vendar:** ob zamenjavi ponudnika ali modela je treba (a) **ponoviti prevzemni test** —
natančnost je lastnost modela, ne kode, in stara meritev za nov model ne velja; (b) preveriti
**stroškovno posledico** — različni modeli isto besedilo razbijejo na različno število enot, kar
lahko spremeni mesečni strošek tudi pri nespremenjeni ceni na enoto; (c) **urediti pogodbeno stran**
— zamenjava ponudnika pomeni drugega podobdelovalca in praviloma drugo regijo obdelave.

**⑥ eDOKUMENTI niso dosegljivi ali je zapis delno uspel.** Znak: prenos se ustavi sredi zapisa —
dokumenti so prenešeni, metapodatki ne, ali pa je stranka ustvarjena, zapis ponudbe pa ne. Ta primer
mora imeti **zapisan postopek okrevanja**; ob pisanju tega dokumenta ga ni nikjer (ugotovitev G3c).
Nevarnost ni izpad, ampak ponovni poskus, ki ustvari **podvojeno stranko** — natanko tisto, čemur se
iskanje obstoječe stranke izogiba.

**⑦ V eDOKUMENTE je bil zapisan napačen podatek.** Kdo popravi (sodelavec, v eDOKUMENTIH, po
običajnem postopku), kaj se zabeleži v revizijsko sled, in — če gre za sistemsko napako in ne za
posamičen primer — kako se sporoči izvajalcu v garancijskem roku.

---

# 3 · THE BOUNDARY: defect vs new feature

## 3.1 The one that is genuinely not covered anywhere

Jamstvo 3 defines a defect as *"odstopanje od obsega, potrjenega v Fazi 0, **na nespremenjenem
sistemu**"*.

**The model the system runs on will be retired inside the warranty period, and nobody has changed
the system.**

Evidence, not assumption:

- `demo/lib/claude.mjs:12–13` pins two model identifiers: `claude-sonnet-4-6` (text track) and
  `claude-opus-4-8` (vision track).
- Anthropic publishes model retirements with dates and honours them. Currently published: three
  models already retired in 2026 (`claude-3-7-sonnet` and `claude-3-5-haiku` on 19. 2. 2026,
  `claude-3-opus` on 5. 1. 2026), and four more deprecated with dates in 2026 (`claude-3-haiku`
  19. 4. 2026, `claude-opus-4` and `claude-sonnet-4` 15. 6. 2026, `claude-opus-4-1` 5. 8. 2026).
  A retired model returns a 404, not a degraded answer.
- Timeline: signature → 12–16 weeks build → acceptance → **12 months warranty**. On any plausible
  schedule the warranty runs deep into 2027. Both pinned models will by then be two or more
  generations old.

So the predictable event is: one morning the robot stops, or starts reading differently, and
**nothing on the client's side changed**. Under the literal wording of Jamstvo 3 the client will
read that as a defect. Under any reasonable reading it is a supplier-of-a-supplier change, like
Merkur changing its PDF template — which the offer *does* exclude by name (line 161) while saying
nothing about the model.

**This costs one sentence to fix now and is unarguable later.** Proposed wording:

> *Sprememba, ukinitev ali umik modela oziroma vmesnika na strani ponudnika AI se obravnava enako
> kot sprememba dokumentov s strani Merkurja ali sprememba API-jev sistemov naročnika: ne šteje za
> napako po tem jamstvu. Prilagoditev se ovrednoti posebej. Ob vsaki taki prilagoditvi se ponovi
> prevzemni test.*

The second sentence is as important as the first — it protects both sides. It stops the client from
inheriting an unmeasured system, and it stops us from being asked to re-guarantee 98 % on a model we
never measured.

## 3.2 🇸🇮 KAJ JE NAPAKA IN KAJ NI — pripravljeno za prilogo

> Namen te tabele ni omejevanje pravic naročnika, ampak preprečevanje razprave. Vse spodaj že izhaja
> iz ponudbe; tu je zbrano na enem mestu in v razumljivem jeziku.

| Naročnik bo prosil za … | Napaka po Jamstvu 3? | Podlaga |
|---|---|---|
| Sistem je nehal delati / bere napačno, pri nas se ni nič spremenilo | **Da**, če vzrok leži v rešitvi | Jamstvo 3 |
| Merkur je spremenil obliko dokumenta | **Ne** | Izrecno izvzeto (»prilagoditve zaradi sprememb dokumentov s strani Merkurja«) |
| Ponudnik AI je ukinil model, ki ga sistem uporablja | **Ne** | ⚠️ **Danes ni nikjer zapisano.** Predlog besedila v razdelku 3.1 — dodati pred podpisom |
| Dobavitelj eDOKUMENTOV je spremenil vmesnik | **Ne** | Izrecno izvzeto (»spremembe API-jev«) |
| Dodajmo eno polje v nabor | **Ne** | Izrecno izvzeto (»spremembe potrjenega nabora polj po Fazi 0«) |
| Uvedimo novo vrsto zavarovanja | **Ne** — vključeni sta **dve**, naročeni v 6 mesecih od prevzema; nato posebej | Predaja + IZVEDBA |
| Priključimo še en vir (skupni disk, drug nabiralnik, API) | **Ne** | Izrecno izvzeto |
| Prenos v Zavarovalniški program: izdelava šifranta in preslikave | ⚠️ **Odprto** — ponudba prenos šteje v osnovni obseg in šifranta ne omenja; naročnik je 30. 7. sporočil, da je prenos odložen in zahteva izdelavo šifranta | **Uskladiti v Fazi 0 in zapisati v zapisnik** |
| »Sistem se ne uči iz popravkov« | ⚠️ **Odprto** — obljuba je v obsegu, mehanizma ni | **V Fazi 0 dobi zapisan, omejen pomen in merilo, sicer je to trajen zahtevek** |
| Obseg je zrasel s 400 na 1.200 ponudb mesečno | **Ne** — ni napaka; je vprašanje stroška delovanja in po potrebi zmogljivosti | Strošek delovanja poravnava naročnik neposredno ponudnikom |
| Sistem je počasen | **Ne** — hitrost ni nikjer obljubljena | ⚠️ Ni ne obljubljena ne izvzeta — glej opombo spodaj |
| Spremenimo videz nadzorne plošče / dodajmo poročilo | **Ne** | Ni v obsegu |
| Gostovanje, nadzor, podpora uporabnikom po prevzemu | **Ne** | Izrecno izvzeto, dvakrat |
| Nekdo tretji je posegel v izvorno kodo in ne dela | **Ne** | Izrecno izvzeto (»posegi tretjih v izvorno kodo«) |

**Opomba o hitrosti.** Nikjer v ponudbi ni obljubljen ne odzivni čas ne prepustnost. Ker proces po
naravi ni sinhron (pošta pride, robot obdela, človek pregleda izjeme), to ni pomanjkljivost — je pa
edina vrstica v tabeli, ki ni podprta z besedilom ponudbe. Priporočilo: v Fazi 0 zapisati eno
vrstico o pričakovanem času obdelave ene pošiljke, izrecno kot **pričakovanje in ne jamstvo**.

## 3.3 Two boundary items that are ours to close, not the client's

Restated here because they land on the handover, not on the process map:

- **`Sistem se iz popravkov uči`** (offer line 47) has no mechanism, no design and no acceptance
  criterion anywhere in the build or the plans (G2). Inside a fixed price, an unbounded promise is a
  permanent open claim. It must be given a bounded, written meaning in the Faza 0 minutes — e.g. *a
  store of human corrections, replayed as examples on subsequent reads*, or *a human-editable
  normalisation table* — together with the one sentence that says how anyone would know it works.
- **`Vsak podatek dobi oceno zanesljivosti`** (offer line 44) + Jamstvo 2's threshold: G2 established
  there is no score, only provenance. Either a score gets built in Faza 0 (self-report, dual-read
  agreement, or token-level confidence) or the guarantee is re-worded to what provenance actually
  delivers. **Until then, the amber/green marks on screen must not be presented to the client as the
  guaranteed threshold.** They are an origin label, not a confidence measure.

---

# 4 · GATE TABLE

| Kriterij | Stanje | Dokaz |
|---|---|---|
| Acceptance test is measurable | **ZELENO** | Working precedent exists (`verify.mjs`, 157/157 re-derived today), full protocol specified in §1.7 |
| Acceptance threshold is unambiguous | **RDEČE → rešljivo danes** | §1.2: 98 % is satisfiable by flagging everything; needs a second reported measure |
| Acceptance denominator is honest | **RUMENO** | §1.4: 22,9 % of the current denominator cannot be wrong; production test must report the breakdown |
| Truth-setting is independent | **RDEČE** | §1.7 D: current truth was keyed by the supplier; contractual truth must be keyed by the client |
| Harness is fit for contractual use | **RDEČE** | §1.6: D-10 non-bijective matching, D-11 no per-class reporting |
| Handover contents are defined | **RDEČE → rešljivo danes** | §2.2 specifies 11 items against one sentence in the offer |
| Operating runbook exists | **RDEČE → rešljivo danes** | §2.3 specifies 7 scenarios; none written today |
| Defect/feature boundary is written | **RUMENO** | §3.2: most rows already flow from the offer; **one row (model retirement) is genuinely uncovered and needs a sentence before signature** |
| Client can operate what they receive | **UNKNOWN** | Depends entirely on §2.2 items 2, 3, 5 and 9 existing; today none do |

**Nothing in this gate widens the fixed scope.** §1.7 operationalises a test the offer already sells;
§2.2 fills in "dokumentacija", which the offer already includes; §2.3 is the content of the two
workshops it already includes; §3.2 restates exclusions that are already in the offer, plus one
sentence that protects both parties.

---

# 5 · Kasneje, ne zdaj

Not part of the purchased scope. Not to be presented as necessary.

- **Continuous accuracy monitoring** — the weekly report could carry the accuracy measure
  automatically instead of on demand. Cheap once the harness ships, but it is not sold and the
  client has no operations budget.
- **Dual-read confidence** — reading a document twice and scoring agreement is the most robust way to
  produce a real confidence number. It roughly doubles the AI cost (from a base of a few euros a
  month) and it is the honest answer to Jamstvo 2 if a lighter mechanism does not clear the bar.
  Decide in Faza 0, build only if the lighter option fails.
- **Model-pinning discipline** — pinning to dated model snapshots rather than moving aliases, so a
  provider-side change can never move the system silently. Worth doing at build time; not a
  deliverable.

---

## Appendix · Files and lines this gate rests on

| Claim | Source |
|---|---|
| Acceptance clause, flagging counts as correct | `03-uradna-ponudba.md:85–94` |
| 30 % tied to the acceptance test; client supplies 100 offers | `03-uradna-ponudba.md:138, 153` |
| Handover = one sentence; 2 workshops × 3 h | `03-uradna-ponudba.md:49, 164` |
| Warranty covers defects, not scope extensions | `03-uradna-ponudba.md:100–102` |
| Exclusions (Merkur doc changes, API changes, field-set changes, third-party code edits) | `03-uradna-ponudba.md:155–162` |
| 157 = 127 VALUE + 30 ABSENT; 11 UNMAPPED excluded | `~/ais-client-data/harvest-hub/truth.json`, recomputed in Python 30. 7. 2026 |
| `zastopnik_2` ABSENT on all 12 units (24 cells) | same, per-field breakdown |
| `zavarovalnica` is a hardcoded constant labelled `ponudba` | `demo/lib/extract.js:24, 161` |
| Non-bijective truth matching | `demo/scripts/verify.mjs:100–105, 145–155` |
| Harness imports the shipping modules | `demo/scripts/verify.mjs:15–17` |
| Pinned model identifiers | `demo/lib/claude.mjs:12–13` |
| Entire provider surface is one POST with four fields | `demo/lib/claude.mjs:39–53` |
| $0.0193/document, 11 docs, 66,6 s | `demo/README.md:13–22` |
| Annotation defence not exercised by the score | `demo/README.md:169–172` |
| 12/15 documents have a text layer | `03-uradna-ponudba.md:57`, measured in G0 |
| No confidence score exists; provenance ≠ confidence | G2 §G-3 |
| No persistence, no rollback design for a half-written record | G3c |
| Client has no timing data; Zavarovalniški program deferred + šifrant required | `07-odgovori-harvest.md` |
| Model retirement dates are published and honoured | Anthropic model lifecycle documentation, read 30. 7. 2026 |

*No code was modified. Nothing under `demo/` was touched. The paid accuracy harness was not re-run.*
