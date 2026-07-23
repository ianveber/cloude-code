# Kaj smo zgradili za INSPECTUS

**Za:** INSPECTUS d.o.o. · n/r Rok  
**Pripravil:** AIS — podjetje za AI-avtomatizacijo  
**Datum:** 23. julij 2026  
**Predmet:** Pregled zgrajenega — delujoča demonstracija avtomatizacije VLDR

---

## 1. Na kratko

To gradivo prikazuje **delujočo demonstracijo**, ki smo jo zgradili posebej za INSPECTUS — da pokažemo, kaj je pri vašem delu z VLDR mogoče avtomatizirati.

Orodje **od 10. junija teče v živo** za vaše poskusno obdobje: iz vaše izvorne datoteke v **enem koraku** ustvari urejeno poročilo VLDR v slogu obrazca Ford EU 6546. Od takrat smo vgradili vseh 5 popravkov iz vaših povratnih informacij in dodatne izpopolnitve.

> **Pomembno za razumevanje:** to je **demonstracija (delujoč prototip), zgrajena za vas** — dokaz, kaj je izvedljivo. Ni še dokončen, produkcijsko zapakiran izdelek; to je naslednji korak (glej razdelek 5).

---

## 2. Kaj smo zgradili in dostavili

| Obdobje | Kaj je dostavljeno | Status |
|---|---|---|
| **29.–31. maj** | Zasnova + delujoč demo; obdelava vaših **realnih podatkov** (314 vozil, PRIMER 1); kartica VLDR v slogu obrazca Ford EU 6546; izvoz VIN-FILAJ; INSPECTUS videz | ✔ |
| **1.–4. jun** | Tok "datoteka noter → datoteka ven" (takojšen izvoz); popravek stolpca poškodb (»Damage«); funkcija **Združen Survey Report** (široki oštevilčeni stolpci) | ✔ |
| **10. jun** | **Živa uvedba za poskusno obdobje** + zaščita AI dostopa (omejitev izvora + hitrostna omejitev, da je ključ varen) | ✔ **Živo** |
| **12. jun** | **5 popravkov po vaših povratnih informacijah:** (1) poškodba brez opombe se ne izpiše v Remarks; (2) **natančen klon obrazca EU 6546** (dinamični podatki čez pravo predlogo); (3) logotip + podpis; (4) široki oštevilčeni stolpci v Survey Report; (5) **»Vprašaj po podatkih«** — AI odgovarja na vprašanja v slovenščini | ✔ |
| **6.–9. jul** | Dodatne izpopolnitve kartice (postavitev, pisave, poravnava stolpcev) + **popravek izvoza ZIP za velike serije** (300+ vozil naenkrat, brez sesutja) | ✔ |
| **10.–11. jul** | **Predstavitev »Pametni filter«** (10-stranska, za idejo nadgradnje Ares) + **dokument z razlago avtomatizacije** (6-stranski) | ✔ |
| **17.–22. jul** | Izpopolnitve prikaza opomb (Remarks): ohrani »Observation« / »No Damage Evidence«, izpusti le golo »Damage« | ✔ |

---

## 3. Kako deluje

- **Motor:** Anthropic Claude, **naučen na vaši bazi znanja** (FVL/odgovornost, kode AIAG-ECG, razredi poškodb) — zato zna presoditi v vašem jeziku in kontekstu.
- **Zasebnost:** vsa obdelava datoteke teče **v brskalniku**; v oblak gredo le agregatni podatki — **VIN-i ne zapustijo vašega računalnika**.
- **Varnost:** dostop do AI je zaščiten (omejitev izvora + hitrostna omejitev), da je ključ zavarovan pred zlorabo.
- **Uporaba:** naložite izvorno datoteko → orodje takoj vrne urejeno poročilo VLDR + izvoze; inšpektor lahko poljubno postavi vprašanje o podatkih.

---

## 4. Dodatno zgrajeno (demonstracije zmožnosti)

Poleg avtomatizacije VLDR smo pripravili tudi naslednje delujoče prototipe, ki kažejo širši potencial:

- **Nadzorna plošča INSPECTUS OS** — prijava + shranjeni zagoni (zgodovina obdelav).
- **Razvrščevalnik VIN fotografij** (AI vid) — samodejno sortira ~6.000 fotografij ladje v ~200 VIN, kar danes poteka ročno.
- **Constat Joint-Survey builder** (PSA/Stellantis: Opel/Citroën/Peugeot, kode RUA V3) — različica v1.

---

## 5. Kaj to pomeni in naslednji korak

To, kar vidite, je **dokaz koncepta v živo** — zgrajen hitro in prilagojen vašemu dejanskemu procesu. Pokazali smo, da avtomatizacija VLDR deluje na vaših realnih podatkih in da se ročni koraki lahko strnejo v enega.

**Naslednji korak** je prehod iz demonstracije v **produkcijsko različico**: utrjena, dolgoročno vzdrževana in nadzorovana rešitev za vsakodnevno rabo. Obseg, dinamika in pogoji so v ločenem dokumentu (»Ure in stroški«).

---

*Z veseljem gremo skozi katerikoli del v živo.*

**AIS** · ais-slovenia.si
