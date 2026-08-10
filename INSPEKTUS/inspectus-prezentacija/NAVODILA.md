# INSPECTUS · Pametni filter — predstavitev

10-stranska predstavitev (A4 ležeče) za INSPECTUS: današnji 5-koračni ročni postopek,
novi 1-koračni postopek (PWA + pametni filter), delovanje AI-filtra in prihranek.

## Datoteke

- `index.html` — celotna predstavitev (10 strani). Odpri v Chromu za ogled.
- `izvoz/INSPECTUS-Pametni-filter-predstavitev.pdf` — PDF za pošiljanje (WhatsApp/e-pošta).
- `build/` — gradniki (skeleton + fragmenti strani + `assemble.py`); končnemu uporabniku ni treba vedeti zanje.

## Predstavitev v živo

1. Odpri `index.html` v Chromu.
2. Klikni **Celozaslonsko** (gumb spodaj desno).
3. Listaj s puščicama ← → (ali preslednico / PageUp-PageDown).

## Ponovni izvoz PDF-ja

```bash
./render-pdf.sh
```

Skripta izpiše število strani (mora biti 10) in velikost datoteke.

## Spreminjanje vsebine

1. Uredi ustrezni fragment `build/pN-fragment.html` (N = stran 1–10).
   Skupni slog (barve, pisave, okvirji) je v `build/skeleton.html`.
2. Sestavi: `python3 build/assemble.py` (vedno gradi iz čistega skeletona — idempotentno).
3. Izvozi: `./render-pdf.sh`.

## ROI-predpostavke (stran 9)

Vse številke so namerno konzervativne in navedene v okvirju »Predpostavke« —
ko INSPECTUS potrdi svoje podatke (ladij/mesec, min/vozilo, cena ure), jih
zamenjaj v `build/p9-fragment.html` in ponovno izvozi.
