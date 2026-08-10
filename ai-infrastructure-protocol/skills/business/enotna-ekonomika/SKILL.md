---
name: enotna-ekonomika
description: Check whether an offer is financially sustainable using unit economics (LTV, CAC, payback, margins) before scaling spend or celebrating revenue. Use when "should I scale ads", "am I actually profitable", planning growth, raising prices, calculating how much to spend to acquire a customer, or revenue is up but cash is tight. Trigger on "unit economics", "LTV", "CAC", "payback", "can I afford ads", "is this profitable", "margin", "how much to spend on ads", "enotna ekonomika", "ali se izplača", "koliko za oglase". Runs BEFORE scaling — it tells you if the engine is sound or leaking. Output in Slovenian.
---

# Enotna ekonomika — ali motor sploh drži

Prihodek ni dobiček. Rast slabo zastavljenega modela te samo hitreje pripelje do težav. Enotna ekonomika pove, ali je **ena stranka** finančno smiselna — preden vložiš v skaliranje.

Ta spretnost postavi finančne varovalke. Vrni izhod v **slovenščini**. Uporabljaj metrike knjižnice, ne izmišljenih.

---

## 4 številke, ki jih moraš poznati

1. **LTV** (življenjska vrednost stranke) = povprečna vrednost naročila (`aov`) × koliko krat kupi (`repeat_rate`) × marža. Toliko ti ena stranka prinese skozi čas.
2. **CAC** (strošek pridobitve) = koliko porabiš (oglasi + čas + orodja), deljeno s številom pridobljenih strank.
3. **Razmerje LTV : CAC** — zdravo je **≥ 3 : 1**. Pod 3 je motor tesen; pod 1 goriš denar.
4. **Doba povračila (payback)** — koliko časa/nakupov, da ti stranka povrne CAC. Krajše = manj tveganja z denarnim tokom.

---

## Kaj ti povedo

- **LTV : CAC < 1** → vsaka nova stranka te stane; ne skaliraj, popravi ponudbo ali kanal.
- **LTV : CAC 1–3** → deluje, a tesno; poglej, kje dvigniti LTV (ponovni nakup, cena, marža) ali znižati CAC.
- **LTV : CAC > 3** → zdravo; zdaj skaliranje smiselno.
- **Dolg payback + tesen denarni tok** → tudi če je razmerje dobro, te lahko ubije **timing**: denar odteče prej, kot se vrne.

---

## Postopek

1. Izračunaj LTV (bodi konzervativen z `repeat_rate` — ne domnevaj ponovitev, ki jih še ni).
2. Izračunaj pravi CAC (vključi **vse**: oglase, orodja, svoj čas).
3. Poglej razmerje in payback.
4. Odloči: **skaliraj / popravi / ustavi** — in kaj konkretno.

---

## Izhod

```
LTV: ... € (razčlenjeno: aov × repeat_rate × marža)
CAC: ... € (kaj je všteto)
LTV : CAC = ... : 1  → [zdravo / tesno / gori]
PAYBACK: ... (nakupov / mesecev)
ODLOČITEV: [skaliraj / popravi X / ustavi] — ker ...
```

## Pravilo
Ne skaliraj kanala, dokler enotna ekonomika ne drži — skaliranje pomnoži tudi izgubo. Blank/konzervativna številka je boljša od optimistične izmišljene: če `repeat_rate` še ne poznaš, ga postavi na 1 in računaj najslabši scenarij.
