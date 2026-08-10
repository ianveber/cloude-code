# Uradna ponudba

## Avtomatizacija prenosa dokumentacije

**Robotizacija procesa PRENOS · Merkur zavarovalnica**

**Za:** Harvest Hub d.o.o.  ·  **Datum:** 26. julij 2026  ·  **Velja do:** 25. avgusta 2026

---

| PONUDNIK | NAROČNIK |
|---|---|
| **AIS Slovenija — Anej Vučič s.p.** | **Harvest Hub, zavarovalniško zastopanje d.o.o.** |
| Habičeva ulica 11, 1291 Škofljica | Dunajska cesta 190, 1000 Ljubljana |
| Davčna št.: 62598490 | Zavarovalniško zastopanje · Merkur zavarovalnica |
| Operater AI sistemov · Poganja Claude | |

---

## PREDMET

Danes vaš sodelavec za vsako ponudbo Merkurja prevzame dokumentacijo iz e-pošte, jo shrani na
strežnik in **iste podatke dvakrat na roko prepiše** — v eDOKUMENTE in v Zavarovalniški program.
Pri 300–500 ponudbah mesečno in ~7 dokumentih na ponudbo je to več tisoč ročnih posegov letno.

Robot ta proces prevzame: prevzame dokumentacijo, sam prebere podatke iz PDF-jev, izvede dogovorjene
kontrole, prenese vse v oba sistema in vsak korak zabeleži.

> **Ponudba prispe. Vse ostalo se zgodi samo.**

---

## OBSEG

**Osnovni obseg** zajema vrste zavarovanj in tipe dokumentov iz 2. točke vaše specifikacije z dne
23. 7. 2026 (KLP, Privolitvena izjava, Ponudba, 545. člen, IDD, Informacije o obdelavi osebnih
podatkov, Informativni izračun, KID, SEPA, SID, Splošni pogoji) ter Spremni dopis iz priloženih
vzorcev. Seznam se ob zaključku Faze 0 pisno zaključi; vse izven njega je nova uvedba.

| Komponenta | Kaj zajema |
|---|---|
| **Samodejni prevzem** | Prevzem z naslova `ponudbe.merkur@harvest.si`, nespremenljiv arhiv vsake pošiljke. Vir je vezan prek zamenljivega priključka, zato dodaten vir (skupni disk, API) kasneje ne zahteva predelave jedra — sama priključitev ni predmet te ponudbe. |
| **Branje dokumentov** | Dvotirno: hitro branje dokumentov z besedilnim slojem (~80 %) in vizualni AI za tiste brez njega (~20 %). Za vsak dokument sistem sam izbere uporabno pot. |
| **Kontrole in preverjanje** | Preverjanje prisotnosti dokumenta »545. člen« — ob manjkajočem robot prek API-ja v eDOKUMENTE vrne opozorilo in ponudbo zadrži. Kontrolna številka davčne, ujemanje premije z obrokom, skladnost podatkov med dokumenti. Vsak podatek dobi oceno zanesljivosti. |
| **Prenos v vaša sistema** | Dokumenti in metapodatki v eDOKUMENTE, metapodatki v Zavarovalniški program, arhiv na strežnik po vaši obstoječi konvenciji. |
| **Obravnava izjem** | Kolektivna zavarovanja za pravne osebe (brez 545. člena) gredo po posebni poti z zaznamkom in samodejnim opominjanjem do prejema podpisanega dokumenta. |
| **Nadzorna plošča** | Sodelavec vidi samo izjeme — negotove podatke in neuspele prenose. Popravek z enim klikom. Sistem se iz popravkov uči. |
| **Revizijska sled** | Vsak korak zabeležen (kdo, kdaj, kaj) — nespremenljiva sled, ki podpira vaše zahteve po sledljivosti iz GDPR in ZZavar-1. Obveščanje o napakah + tedensko poročilo. |
| **Predaja** | Izvorna koda in materialne avtorske pravice preidejo v vašo last **s plačilom celotne vrednosti**; do tedaj imate pravico do neomejene uporabe. Vključeni dokumentacija, usposabljanje in uvedba 2 novih produktov. |

---

## PREVERJENO

Pred pripravo ponudbe smo tehnično analizirali **vseh 15 vzorčnih dokumentov**, ki ste jih priložili:

- **12 od 15 dokumentov ima uporaben besedilni sloj, 3 ga nimajo.** Dva sta skenirana na napravi
  Canon iR-ADV C3320 (eden z rokopisnimi pripisi), tretji je bil natisnjen prek »Microsoft Print to
  PDF«. Za branje je učinek enak: klasičen razčlenjevalnik iz teh treh ne dobi ničesar. Zato ena sama
  tehnologija branja ni prava rešitev — gradimo dvotirni sistem.
- **Pri večini produktov številka ponudbe nosi podatek o vrsti zavarovanja** (`11x` zdravstveno,
  `22x` riziko, `33x` nezgoda, `44x` business box, `55x` naložbeno) — tam robot razvrstitev in
  dodatno kontrolo dobi brezplačno. **Premoženje (DOM 25) in Popotnik tega polja nimata**, nosita le
  6-mestno »Številko pogodbe« (703179 oz. 529404), zato ju razvrstimo po vsebini. Za ta dva produkta
  v Fazi 0 potrdite tudi ime mape na strežniku — vaša konvencija zanju nima vira.
- **Poimenovanja ključnih polj se razlikujejo** (»Številka ponudbe« pri večini produktov, »Številka
  pogodbe« pri premoženju in popotniku, »Št. ponudbe« na KLP), zato enotna predloga za vse dokumente
  ne more delovati. Gradimo skupno jedro polj in nadgradnje po produktu.

Celotna analiza je v priloženem tehničnem dokumentu.

---

## REFERENCA

Za **INSPECTUS d.o.o.** (avtomobilski nadzor, Luka Koper) smo zgradili sistem, ki iz dokumentacije
samodejno izlušči podatke, jih validira z AI in prenese v naročnikov format. Deluje na naročnikovih
realnih podatkih: **314 vozil obdelanih, 0 izpadov, 0 napačnih oznak.** Referenco lahko preverite
neposredno pri naročniku.

---

## JAMSTVO

**1 · Natančnost.** Na naboru polj, potrjenem ob zaključku Faze 0, jamčimo **najmanj 98 %
natančnost na ravni posameznega polja** (delež pravilno prebranih polj, ne delež brezhibnih ponudb).
Merimo na prevzemnem testu 100 ponudb iz živega prometa, katerega sestava ustreza dejanski strukturi
vašega prometa. Kot pravilno se šteje tudi polje, ki ga sistem sam označi kot negotovo in usmeri v
pregled — to je lastnost zasnove, ne napaka. Izvzeta so polja, ki jih na izvorniku ne more nedvoumno
prebrati niti človek, in dokumenti izven oblik, potrjenih v Fazi 0.

Če prag ni dosežen, brez doplačila izvedemo **največ dva popravna cikla**. Če tudi po drugem ciklu
prag ni dosežen iz razlogov na strani rešitve, **vam zadnjih 30 % ni treba plačati**, izdelano pa
ostane v vaši lasti skupaj z izvorno kodo. To je vaš najslabši možni izid.

**2 · Brez tihih napak.** Podatek pod dogovorjenim pragom zanesljivosti se v vaša sistema ne zapiše —
uvrsti se v pregled sodelavca. To je lastnost zasnove, ne obljuba. Prag potrdimo v Fazi 0. Kadar
sodelavec podatek ročno sprosti, je to odločitev naročnika in se zabeleži v revizijsko sled.

**3 · Garancija za odpravo napak: 12 mesecev** od prevzema. Za napako se šteje odstopanje od obsega,
potrjenega v Fazi 0, na nespremenjenem sistemu. Garancija pokriva **odpravo napak, ne širitve
obsega**. Po prevzemu sistem upravljate vi; obratovanje, nadzor in podpora uporabnikom niso zajeti.

---

## NALOŽBA

Vaša specifikacija predvideva dve rešitvi. Ponujamo obe — oznaki A in B ustrezata REŠITVI 1 in
REŠITVI 2 iz vaše specifikacije.

### Različica A (REŠITEV 1) — robot prevzame prenos

eDOKUMENTI še naprej pripravljajo KLP in Privolitveno izjavo. Robot poskrbi za prevzem, branje,
kontrole in prenos v oba sistema.

**Enkratna implementacija: 8.900 €**

### Različica B (REŠITEV 2) — robot prevzame celoten postopek ★ priporočamo

Vse iz različice A, dodatno pa robot **sam pripravi KLP in Privolitveno izjavo** ter vodi postopek
podpisa. Povratna informacija iz eDOKUMENTOV ni potrebna.

**Enkratna implementacija: 12.000 €**

> **Zakaj priporočamo B.** Pri različici A gre kritična pot skozi sistem, ki ni ne naš ne vaš — če
> eDOKUMENTI ne morejo poslati povratne informacije, se proces ustavi. Različica B to odvisnost
> odpravi. Razlika je 3.100 €.

**Mesečne naročnine ni.** Rešitev deluje na vaši infrastrukturi. Strošek delovanja (AI + gostovanje)
poravnate neposredno ponudnikom in znaša **15–25 € mesečno** — pri vašem obsegu je to **manj kot
0,07 € na obdelano ponudbo**.

To ni ocena, ampak meritev. 30. 7. 2026 smo porabo izmerili na vaših vzorčnih ponudbah: **1,2 centa**
na dokument po besedilni poti in **2,8 centa** po vizualni. Pri 400 ponudbah mesečno in vašem
dejanskem deležu skeniranih dokumentov (~10 na mesec) znese AI **2–16 €**, gostovanje **5–8 €**.
Zgornja meja 25 € vključuje rezervo za rast obsega in za evropski profil obdelave. Razpon je odvisen
od tega, koliko dokumentov iz posamezne pošiljke se dejansko bere — obseg branja pisno potrdimo ob
zaključku Faze 0.

Pri 400 ponudbah mesečno vas različica A stane **1,85 € na ponudbo v prvem letu**, različica B
**2,50 €**. Od drugega leta ostane le strošek delovanja. Za izračun dobe vračila potrebujemo en sam
vaš podatek: koliko minut danes traja obdelava ene ponudbe.

Cene so brez DDV. Plačilo: 40 % ob podpisu · 30 % ob potrditvi Faze 1 (delujoče branje na vaših
resničnih dokumentih) · 30 % ob prevzemu, po uspešno opravljenem prevzemnem testu. Rok plačila 8 dni.

---

## IZVEDBA

**Različica A: 12–13 tednov. Različica B: 15–16 tednov** — od podpisa in prejema vseh dostopov.
Faza 0 (analiza dostopov in potrditev obsega) traja 1–2 tedna in je pogoj za fiksiranje obsega
integracij; ob zaključku obe strani pisno potrdita zaključen nabor polj in kontrol. **Prve rezultate
branja na svojih dokumentih vidite v tretjem tednu.** Zamude na strani naročnika ali zunanjih
ponudnikov podaljšajo roke za enako obdobje.

**Kaj potrebujemo od vas.** Dostop do nabiralnika in arhivskega strežnika; dokumentacijo in testne
dostope do eDOKUMENTOV in Zavarovalniškega programa ter kontakt njihovega dobavitelja (v 10 delovnih
dneh po podpisu); eno imenovano kontaktno osebo z odzivom v 3 delovnih dneh; lasten račun pri
ponudniku AI; potrditve faz v 5 delovnih dneh; 100 ponudb za prevzemni test.

**Ni vključeno:** priključitev vhodnih virov poleg e-pošte (skupni disk, API); nadomestna izvedba
prek avtomatizacije uporabniškega vmesnika, če se v Fazi 0 izkaže, da **kateri koli od sistemov**
nima dokumentiranega in delujočega API-ja za pisanje ali da testno okolje ni na voljo (ovrednotimo
posebej); stroški in dodelave dobaviteljev obeh sistemov; vrste zavarovanj in tipi dokumentov izven
osnovnega obsega, nad vključenima dvema uvedbama; **spremembe potrjenega nabora polj po Fazi 0**;
prilagoditve zaradi sprememb dokumentov s strani Merkurja ali sprememb API-jev; migracija starejše
dokumentacije; posegi tretjih v izvorno kodo; pravna mnenja in izdelava DPIA; infrastruktura in
gostovanje; obratovanje in podpora po prevzemu.

Usposabljanje: dve delavnici po največ 3 ure. Uvedba produkta pomeni novo shemo polj (do 15 polj) s
kontrolami; vključeni sta dve, naročeni v 6 mesecih od prevzema.

---

## POGOJI

**Varstvo podatkov.** Dokumentacija vsebuje tudi podatke, povezane z zdravjem — posebno vrsto
osebnih podatkov po 9. členu GDPR. **Naročnik je upravljavec, izvajalec obdelovalec.** Pred prvim
dostopom do resničnih podatkov stranki skleneta **pogodbo o obdelavi po 28. členu GDPR**. Podatki se
ne uporabljajo za učenje modelov. V produkciji rešitev teče na vaši infrastrukturi in pod vašim
računom pri ponudniku AI — v tem delu ste upravljavec vi. Ponudnika in regijo obdelave potrdimo v
Fazi 0.

**Omejitev odgovornosti.** Skupna odškodninska odgovornost ponudnika je omejena na pogodbeno
vrednost. Ponudnik ne odgovarja za posredno škodo, izgubljeni dobiček, izpad poslovanja ali upravne
globe. Omejitev ne velja za škodo, povzročeno naklepno ali iz hude malomarnosti. Za podatke, ki jih
sodelavec naročnika potrdi ali ročno sprosti, odgovarja naročnik.

**Splošno.** Ob zamudi plačila tečejo zakonske zamudne obresti. Če naročnik v 10 delovnih dneh po
obvestilu o zaključku faze ne poda pisnih pripomb, se faza šteje za potrjeno. Za razmerje velja pravo
Republike Slovenije; za spore je pristojno sodišče v Ljubljani.

---

## SPREJEM PONUDBE

S podpisom naročnik sprejme ponudbo v obsegu izbrane različice.

Izbrana različica:  ☐ A — 8.900 €   ☐ B — 12.000 €   (enkratno, brez DDV)

Kraj in datum: ________________________

| Za ponudnika: | Za naročnika: |
|---|---|
| **AIS Slovenija — Anej Vučič s.p.** | **Harvest Hub d.o.o.** |
| ________________________ | ________________________ |

---

*Termin izvedbe rezerviramo ob podpisu. Z veseljem gremo skozi katerikoli del v živo.*

**AIS** · ais-slovenia.si
