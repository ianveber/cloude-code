# Popravek jamstev 1 in 2 — predlog besedila

**Interno. Za Iana.** Pripravljeno 30. 7. 2026, po ugotovitvi iz vrat G4/PREGLED.

Popravek je **brezplačen do podpisa** in drag po njem. Ponudba je bila poslana 26. 7.; če je še ni
podpisal nihče, gre za dopolnitev, ne za spremembo pogodbe.

---

## Zakaj sploh

Jamstvo 1 pravi dobesedno:

> »Kot pravilno se šteje tudi polje, ki ga sistem sam označi kot negotovo in usmeri v pregled — to
> je lastnost zasnove, ne napaka.«

Nikjer v ponudbi ni **zgornje meje deleža označenih polj**. Iz tega sledi: sistem, ki označi
*vsako* polje, doseže 100 % in prestane prevzemni test, od katerega je odvisnih zadnjih 30 %
vrednosti — naročnik pa še vedno vse prepiše na roko. **Jamstvo je izpolnljivo z ničelno
avtomatizacijo.**

Jamstvo 2 to poslabša z dveh strani:

> »Podatek pod dogovorjenim pragom zanesljivosti se v vaša sistema ne zapiše.«

1. **Praga ni in ga ni mogoče izračunati.** Gradnja proizvaja *izvor* podatka (`ponudba` /
   `pravilo` / `register`), ne ocene zanesljivosti. To sta dve različni stvari: izvor pove, *od kod*
   vrednost je, ne *kako verjetno je pravilna*.
2. **Najvarnejša izvedba Jamstva 2 je označiti več** — kar neposredno napihne rezultat Jamstva 1.
   Jamstvi vlečeta isti vzvod v nasprotni smeri.

Tveganje ni v prvi vrsti finančno. Je ugledno: lahko prestaneš test, dobiš plačilo in ne dostaviš
ničesar. Prva referenca v panogi tega ne prenese.

---

## Popravek A — zgornja meja deleža označenih polj *(nujno)*

Doda se **drugi, neodvisni prag** k istemu prevzemnemu testu. Oba morata biti dosežena.

> **Dopolnitev 1. točke (Natančnost).** Poleg praga natančnosti na prevzemnem testu velja tudi
> **zgornja meja deleža polj, ki jih sistem usmeri v pregled: največ [X] % polj z vsebino.**
> Polja, ki na ponudbi nimajo vrednosti, se v ta delež ne štejejo. Prevzemni test je opravljen le,
> če sta dosežena **oba** praga hkrati. Če je dosežen prag natančnosti, presežena pa meja pregleda,
> se šteje, da prag ni dosežen, in veljajo popravni cikli iz iste točke.

Brez tega člena vsa druga jamstva ne pomenijo nič.

**[X] ni več prazen — izmerjeno 30. 7. 2026** (`demo/scripts/measure-confidence.mjs`, dvojno branje
vseh 11 vzorčnih ponudb z dvema različnima modeloma):

| | |
|---|---|
| Polj skupaj | 154 |
| Od tega praznih (na ponudbi jih ni) | 24 |
| **Polj z vsebino** | **130** |
| Zapisano samodejno | **101 (77,7 %)** |
| V pregled sodelavcu | **29 (22,3 %)** |

**Predlog: [X] = 30 %**, z izmerjenih 22,3 % kot dokazom in ~8 odstotnimi točkami rezerve.

Dve opombi, ki ju je treba povedati ob številki:

1. **Meritev je brez registra zastopnikov.** Največji posamični delež označenih polj je prav
   številka zastopnika — ta se ob naloženem registru razreši sama. Z registrom bi bil delež
   bistveno nižji. **Končni [X] nastavimo po meritvi z registrom, v Fazi 0.**
2. **Merjeno na 11 kuriranih vzorcih, ne na prometu.** Vzorci so bili izbrani, da pokažejo eno od
   vsake vrste — ne pogostosti. Prava številka pride s prevzemnega testa na 100 ponudbah.

## Popravek B — Jamstvo 2 dobi mehanizem ali resnično besedilo *(nujno, izbira med dvema)*

**B1 — poštena preubeseditev (brezplačna, priporočena za zdaj).** Opiše, kar sistem res počne:

> **2 · Brez tihih napak.** V vaša sistema se samodejno zapišejo **samo vrednosti, prebrane
> neposredno z dokumenta**. Vsaka vrednost, ki je izpeljana iz pravila, prevzeta iz drugega
> razdelka ali pridobljena iz zunanje evidence, se **označi in usmeri v pregled** — ne zapiše se
> brez človekove potrditve. Vsaka zapisana vrednost nosi zabeležen izvor. Kadar sodelavec podatek
> ročno sprosti, je to odločitev naročnika in se zabeleži v revizijsko sled.

**B2 — resnična ocena zanesljivosti. ZGRAJENA IN IZMERJENA 30. 7. 2026.** Ta možnost ni več
hipotetična, zato je zdaj **priporočena namesto B1**:

> **2 · Brez tihih napak.** Vsak podatek dobi oceno zanesljivosti, sestavljeno iz treh preverljivih
> znakov: (a) dokument prebereta **dve neodvisni bralni poti** in se njuna rezultata primerjata polje
> po polju, (b) preveri se, ali se vrednost **dobesedno pojavi v dokumentu**, in (c) upošteva se
> izvor podatka — prebran z dokumenta, izpeljan po pravilu ali pridobljen iz vašega registra.
> Podatek pod dogovorjenim pragom se **v vaša sistema ne zapiše**, ampak gre v pregled sodelavca.
> Prag potrdimo ob zaključku Faze 0. Kadar sodelavec podatek ročno sprosti, je to odločitev
> naročnika in se zabeleži v revizijsko sled.

Zakaj to zdrži, česar »ocena zanesljivosti« sicer ne bi:

- **Ni številka, ki si jo model izmisli o sebi.** Samoocena modela ni umerjena in je ni mogoče
  revidirati — na vprašanje »zakaj 0,83?« ni odgovora. Vsi trije znaki so opazljivi in jih je mogoče
  rekonstruirati iz dokumenta.
- **Štiri stopnje namesto ocene 0–1.** Ocena vabi k pragu, ki ga nihče ne zna zagovarjati. Stopnje
  ustrezajo odločitvi, ki jo stranka dejansko sprejme: zapiši ali daj človeku.
- **Dokazano, da loči.** Ker je natančnost 157/157, v vzorcu ni napak, ki bi jih signal lahko ujel —
  mehanizem, preverjen samo na takih podatkih, ni ovrgljiv. Napake so zato vbrizgane v testu
  (`scripts/test-confidence.mjs`, 23 preverb): izmišljena vrednost, razhajanje med branjema,
  vrednost iz pravila. Vsaka mora znižati stopnjo.
- **Na najtežjem dokumentu se je že izkazalo.** Pri skeniranem primeru z dvema otrokoma sta se
  branji razšli prav pri naslovu zavarovalca — to je znana past prelomljenih naslovov. Produkcijska
  pot ga prebere pravilno; signal je razliko pokazal, namesto da bi jo skril.

**Cena:** dvojno branje stane 0,0234 USD na dokument. Pri 400 ponudbah mesečno je to pod 10 € —
znotraj razpona iz popravka E.

## Popravek C — imenovalec prevzemnega testa *(nujno, poceni)*

22,9 % celic v današnji meritvi po zasnovi ne more biti napačnih (`zavarovalnica` je konstanta,
drugi zastopnik je vedno prazen). To ne pomeni, da je meritev napačna — pomeni, da je **prag treba
vezati na polja, ki ločujejo**.

> **Dopolnitev.** Nabor polj, na katerem se meri natančnost, se ob zaključku Faze 0 pisno zaključi.
> Iz merjenja so izvzeta polja s konstantno vrednostjo in polja, ki so v celotnem vzorcu prazna.

## Popravek D — delež ponudb brez človekovega posega *(Ianova poslovna odločitev)*

Popravki A–C zaprejo luknjo. **D je edini, ki obljubi vrednost**, in edini, ki nosi resnično
tveganje za AIS:

> **Dopolnitev.** Na istem prevzemnem testu jamčimo, da se **najmanj [Y] % ponudb** obdela **brez
> vsakršnega človekovega posega** — torej nobeno polje ni usmerjeno v pregled.

To je številka, ki jo bo direktor slišal in si jo zapomnil. Je tudi edina, ki lahko pogodbo dejansko
podre. **Ne predlagam je brez podatka iz razdelka spodaj.**

---

## Česa ne vemo — in brez česar [X] in [Y] nista številki, ampak ugibanje

Glej naslednji razdelek v pogovoru. Na kratko: **ne poznamo dejanske sestave njihovega mesečnega
prometa**, predvsem deleža skeniranih dokumentov. Vzorec 15 datotek je bil izbran, da pokaže **eno
od vsake vrste**, ne da pokaže **pogostost**. Delež 3/15 = 20 % skeniranih je zato branje frekvence
iz vzorca, ki frekvenca ni.

---

## Popravek E — strošek delovanja *(v korist naročnika, pošlji takoj)*

Ponudba pravi **~80–110 € mesečno** in »manj kot 0,40 € na obdelano ponudbo«. Izmerjeno 30. 7. 2026
na njihovih vzorčnih ponudbah je resnica **približno desetkrat nižja**.

| | Ponudba (26. 7.) | Izmerjeno (30. 7.) |
|---|---|---|
| AI | 40–50 € | **2–16 €** |
| Gostovanje | 30–60 € | **5–8 €** |
| **Skupaj** | **80–110 €** | **15–25 €** |
| Na ponudbo | < 0,40 € | **< 0,07 €** |

Kaj se je spremenilo:

1. **Delež skeniranih dokumentov.** Načrt je predpostavljal 20 % (3 od 15 vzorcev). Vzorec je bil
   izbran, da pokaže **eno od vsake vrste**, ne pogostosti. Njihov dejanski podatek: ~10 skeniranih
   na mesec, torej **2–3 %**. Vizualna pot stane 2,8 centa na dokument, besedilna 1,2 centa.
2. **Gostovanje ne potrebuje ne upravljane baze ne objektne shrambe.** Ponudba že določa, da arhiv
   gre »na strežnik po vaši obstoječi konvenciji« in da rešitev teče na njihovi infrastrukturi —
   objektna shramba torej odpade po zasnovi. Pri ~2.800 dokumentih na mesec zadošča majhen strežnik
   v EU z vgrajeno bazo.
3. **Cenovna funkcija je bila napačna.** Predpomnjene žetone je štela po polni ceni. Popravljeno;
   učinek je majhen, ker se predpomnjenje pri tej velikosti poziva sploh ne sproži.

**To je čista korist v pogajanju.** Njihov strošek delovanja je desetkrat nižji, kot smo zapisali,
in številka je izmerjena na njihovih dokumentih. Pošlji jo sam, preden jo izračunajo oni.

---

## Kaj poslati in kdaj

Popravki A, B1 in C so **dopolnitev v korist naročnika** — zaostrujejo naše obveznosti, ne njihovih.
Pošljejo se lahko kot kratek dodatek k ponudbi, brez ponovnega pogajanja o ceni, najbolje **hkrati z
vprašanjem o sestavi prometa**, ker brez odgovora [X] ostane prazen.

Popravek D počaka na ta odgovor.
