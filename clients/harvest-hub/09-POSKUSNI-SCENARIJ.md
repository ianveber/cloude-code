# Poskusni scenarij — preizkusi prikaz sam

**Zaženi:**

```bash
cd "/Users/ianveber/Desktop/Cloude CODE/clients/harvest-hub/demo" && ./zazeni.sh
```

Odpre se prikaz na `http://localhost:8020` in Finder z dokumenti stranke. Dokumente vlečeš iz
Finderja v stran. **Okno brskalnika naj bo ves čas v ospredju** — skenirani dokumenti se brez tega
ne izrišejo.

Vsak korak spodaj ima **kaj vlečeš** in **kaj mora pisati**. Če se kaj ne ujema, je to napaka in mi
povej — številke so izmerjene, ne ocenjene.

---

## 1 · Ena ponudba — osnovni prikaz

**Povleci:** `2 - Otroci_eden otrok.pdf`

| Kaj mora pisati | |
|---|---|
| Paket dokumentacije | 1 dokument · 1 z besedilom |
| Kontrolni list | 1 |
| Zapišem samodejno | **9/12** |
| V pregled | 3 polja |
| Čas | ~6 s |

Na kartici je izpolnjen kontrolni list, desno predogled obrazca. Vrstice imajo tri stanja:
*Iz ponudbe* (tiho, zeleno) · *Za potrditev* (jantarno) · *Potrebujem register* (jantarno).

> **Pokaži z miško nad oznako.** Vsaka pove, zakaj je taka: »dve neodvisni branji se ujemata in
> besedilo je v dokumentu«. To je nova stvar — ocena zanesljivosti, ne le izvor podatka.

---

## 2 · Zaprta zanka — register zastopnikov

**Klikni:** gumb *Naloži register zastopnikov* v jantarnem opozorilu.

| Prej | Potem |
|---|---|
| Zapišem samodejno **9/12** | **10/12** |
| *Potrebujem register* | *Iz registra* |

Opozorilo o podedovanih podatkih **ostane** — te še vedno potrebujejo človeka. To je pravilno, ne
napaka: register reši eno stvar, ne vsega.

---

## 3 · Cel paket — »niste izbrali lahke datoteke«

**Povleci hkrati:** `0 - 545. člen.pdf`, `2 - Nezgoda.pdf`, `4 - Premoženje.pdf`,
`8 - Business box_zavarovanje pravne osebe.pdf`

| Kaj mora pisati | |
|---|---|
| Popolnost paketa | ✅ **Paket je popoln** — 545. člen je v paketu |
| Kontrolni listi | 3 — 545. člen ni ponudba in ne da lista |
| Seznam paketa | vsak dokument s svojo vrsto, izrisan **preden** se karkoli bere |

Seznam paketa se izriše najprej — nič se ne more tiho preskočiti.

---

## 4 · Kontrola, ki ustavi — brez 545. člena

**Povleci:** samo `2 - Nezgoda.pdf` in `4 - Premoženje.pdf` (brez 545)

Mora pisati: **⚠️ Paket zadržan — v paketu je ponudba, manjka pa 545. člen.**
Kontrolni listi so kljub temu izrisani — zadržanje ne skrije dela.

---

## 5 · Poštena zavrnitev — kolektivna polica

**Povleci:** `9 - Primer Kolektivno Zdravje za pravne osebe.pdf`

Mora pisati: **Kontrolnega lista ne izpolnim** — zavarovanci niso poimensko navedeni.
**Brez predogleda in brez gumbov za shranjevanje.** Prebrani podatki so prikazani, list pa ne
nastane. Sistem ne ugiba.

To je najboljša stvar v prikazu. Vsak zna pokazati, kaj zna prebrati; malokdo pokaže, kje neha.

---

## 6 · Skenirani dokumenti

**Povleci hkrati vse tri:** `2 - Primer Merkur_dva otroka.pdf`,
`3 - Primer Otroci - več produktov.pdf`, `9 - Primer Kolektivno Zdravje za pravne osebe.pdf`

| Kaj mora pisati | |
|---|---|
| Paket | 3 dokumenti · **3 s slike** |
| `2 - dva otroka` | **2 kontrolna lista** — otroka se razdelita tudi iz slike |
| Čas | ~20–25 s |

Rokopisne opombe na dokumentu so prezrte in tako tudi piše. Nikoli ne trdimo, da beremo rokopis.

---

## 7 · Izvoz in obseg

**Klikni:** *Prenesi podatke za eDOKUMENTE* → prenese se datoteka, katere številke se ujemajo s
kartico na zaslonu.

**Klikni:** *Natisni obseg* → stran s tem, kaj prikaz počne in kaj je namenoma zunaj njegovega
obsega.

---

## Kaj povedati, če vprašajo »koliko časa vam to vzame danes«

Odgovorili so nam, da tega podatka nimajo. Panel **»Koliko časa to vzame danes?«** je zato orodje,
s katerim številko **izpeljeta skupaj** na sestanku: šest korakov, vpišeš minute, primerjava se
izriše sama. Ne sprašuj številke, ki so že rekli, da je nimajo — izpelji jo.

---

## Če gre kaj narobe

| Simptom | Vzrok |
|---|---|
| »Za skenirane dokumente naj bo to okno v ospredju« | Okno brskalnika je zadaj. Postavi ga naprej in povleci znova. |
| Branje se ne konča | Preveri, da `~/.anthropic_key` obstaja. |
| `zazeni.sh` javi, da dokumentov ni | Osebni podatki so zunaj repozitorija, v `~/ais-client-data/harvest-hub/`. |
| Vse je jantarno | Register ni naložen — klikni gumb. |

**Številke, ki morajo držati** (preveri kadar koli):

```bash
cd "/Users/ianveber/Desktop/Cloude CODE/clients/harvest-hub/demo"
ANTHROPIC_API_KEY=$(tr -d '[:space:]' < ~/.anthropic_key) node scripts/verify.mjs --vision
```

→ `ACCURACY 157/157 = 100.0%`. Če to pade, ne kaži prikaza.
