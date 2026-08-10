# AIS — Stroški AI za INSPECTUS

**Za:** INSPECTUS d.o.o.  ·  **Pripravil:** AIS  ·  **Datum:** junij 2026

## Kaj uporabljate

Vaš sistem VLDR ob vsakem poročilu pokliče AI trikrat:

- **Validacija** podatkov o poškodbah — preverjanje kod AIAG-ECG in razredov
- **Povzetek** poročila — 4–6 stavkov
- **Filter** — odgovarja na vaša vprašanja o podatkih v slovenščini

Povprečno poročilo (~150 vrstic poškodb) porabi približno **15.000 vhodnih in 1.800 izhodnih žetonov (tokenov)**.

## Cena na token

| Model | Vhod /1M tok. | Izhod /1M tok. | Na 1 vhodni token | Na 1 izhodni token |
|---|---|---|---|---|
| **Opus 4.7** | 4,63 € | 23,15 € | 0,0000046 € | 0,0000231 € |
| **Sonnet 4.6** | 2,78 € | 13,89 € | 0,0000028 € | 0,0000139 € |

Objavljene cene Anthropic, v EUR pri tečaju 1 € = 1,08 $. Izhodni žetoni so ~5× dražji od vhodnih.

## Kaj to pomeni za vas

| | Opus 4.7 | Sonnet 4.6 |
|---|---|---|
| **Na poročilo** | ~0,11 € | ~0,07 € |
| **Na 1.000 poročil** | ~110 € | ~70 € |

To je celoten strošek AI — drugega ni.
