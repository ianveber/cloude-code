# Aneks št. 1 k Pogodbi o obdelavi osebnih podatkov — gostovani preizkus

| UPRAVLJAVEC | OBDELOVALEC |
|---|---|
| **Harvest Hub, zavarovalniško zastopanje d.o.o.**, Dunajska cesta 190, 1000 Ljubljana | **AIS Slovenija — Anej Vučič s.p.**, Habičeva ulica 11, 1291 Škofljica, davčna št. 62598490 |

Kraj in datum: **[kraj], [datum]**

---

**Uvodno pojasnilo.** Osnovna pogodba opisuje obdelavo, ki v celoti poteka na lokalni delovni
postaji obdelovalca. Upravljavec je zaprosil za **preizkus, do katerega njegovi sodelavci
dostopajo sami, s svojih računalnikov**. Tega ni mogoče izvesti brez strežnika, zato 5. točka
osnovne pogodbe v delu, ki opisuje lokalno obdelavo, za ta način dela ne drži več. Ta aneks tega
ne prikriva: opisuje, kaj se je spremenilo, in dodaja podobdelovalca, ki ga 6. točka brez
predhodnega pisnega soglasja izrecno prepoveduje.

**Vse ostale določbe osnovne pogodbe ostanejo nespremenjene in v veljavi.**

---

**A1 · Predmet in trajanje aneksa.** Aneks ureja obdelavo prek spletne različice prikaza
(»preizkus«), dostopne na naslovu **https://harvest-hub-preizkus.vercel.app**. Preizkus traja
**14 dni, od 5. avgusta 2026 do vključno 18. avgusta 2026**. Po tem se dostop **zapre samodejno**:
strežnik vsem zahtevkom odgovori z zavrnitvijo, tudi tistim, ki so kodo za vstop že vnesli.
Zaprtje ni odvisno od ročnega ukrepa obdelovalca. Enako velja za začetek: pred 5. avgustom 2026
stran ni dostopna, tudi z veljavno kodo ne, da se dogovorjenih 14 dni ne skrajša. Obe meji sta
izpisani na vstopni strani, tako da ju upravljavec kadar koli preveri sam. Upravljavec lahko
preizkus kadar koli prej pisno prekine; s tem nastopi 9. točka osnovne pogodbe.

**A1a · Vzorčni dokument.** Na strani preizkusa je za prenos na voljo **vzorčna ponudba z
izmišljenimi podatki** in vzorčni seznam zastopnikov. Namenjena sta preizkušanju brez osebnih
podatkov. Do podpisa tega aneksa upravljavec v preizkus nalaga **izključno ta vzorčna dokumenta**
ali lastne anonimizirane dokumente, ne pa resničnih ponudb strank.

**A1b · Merjenje prihranjenega časa.** Namen preizkusa ni le pokazati, da branje deluje, temveč
**izmeriti, koliko časa upravljavcu prihrani**. Preizkus zato v brskalniku vodi števec: koliko
pregledov je bilo opravljenih, koliko ponudb prebranih in koliko strojnega časa je za to porabil.
V povezavi z minutami ročnega postopka, ki jih vpiše upravljavec sam, iz tega izračuna skupni
prihranek.

Pogodbenici izrecno ugotavljata:

- Števec vsebuje **izključno števila in čas**. Ne vsebuje dokumentov, ne prebranih podatkov, ne
  imen datotek, ne nobene vrednosti iz dokumenta.
- Hrani se **v brskalniku upravljavčevega sodelavca, na njegovi napravi**. Do obdelovalca ne pride
  in zanj ni vmesnika, ki bi ga sprejel; točka A3(d) zato ostane v celoti veljavna.
- Vezan je na posamezen brskalnik in napravo. Vsak sodelavec ima svojega, brisanje podatkov strani
  ga izbriše.
- Minute ročnega postopka so **ocena upravljavca**, strojni čas je merjen. Obdelovalec ne vnaša
  svoje ocene.

Upravljavec lahko povzetek kadar koli izpiše z gumbom v aplikaciji in ga posreduje obdelovalcu.
Posredovanje je prostovoljno.

**A2 · Kdo sme dostopati.** Dostop je zaščiten s kodo za vstop, ki jo obdelovalec izroči
kontaktni osebi upravljavca. Upravljavec kodo posreduje **samo svojim pooblaščenim sodelavcem**
in vodi evidenco, komu jo je izročil. Stran je označena kot neindeksirana in do nje ni povezav z
nobene javne strani. Koda je ena sama in skupna — **obdelovalec izrecno opozarja, da preizkus
zato ne omogoča ugotavljanja, kateri sodelavec je posamezen dokument obdelal.** Za produkcijo se
uredi z ločeno pogodbo pred Fazo 1.

**A3 · Kaj nadomesti 5. točko osnovne pogodbe.** Za obdelavo prek preizkusa se namesto točk 5(b),
5(d) in 5(e) osnovne pogodbe uporablja naslednje; točke 5(a), 5(c) in 5(f) ostanejo nespremenjene.

(b) Dokument se **ne naloži** na strežnik. Bere se v brskalniku sodelavca upravljavca; na strežnik
obdelovalca potuje **izluščeno besedilo prve strani**, pri dokumentu **brez uporabnega besedilnega
sloja** pa **izrisana slika prve strani**. Datoteka sama ostane na napravi sodelavca. Povezava je
šifrirana (TLS).

Katero od obeh poti uporabi, določi brskalnik sam, in sicer **glede na število znakov, ki jih
izlušči s prve strani (prag 500 znakov)** — ne glede na to, ali je dokument skeniran. Praviloma gre
za skenirane dokumente, **ni pa izključeno, da se tako obravnava tudi digitalno izdelan dokument z
malo besedila**; v tem primeru na strežnik potuje slika celotne prve strani. Pogodbenici to
izrecno ugotavljata, ker slika strani lahko vsebuje tudi elemente, ki jih izluščeno besedilo ne bi
(podpisi, žigi, ročne opombe).

(d) Obdelovalec **ne vzpostavi podatkovne baze in ne shrani ničesar**: ne dokumenta, ne besedila,
ne slike, ne prebranih podatkov. Strežniška funkcija podatek obdela v okviru posameznega zahtevka
in ga ne zapiše. Izpolnjeni KLP in Privolitvene izjave nastanejo **v brskalniku sodelavca** in
ostanejo na njegovi napravi; obdelovalec do njih nima dostopa.

(e) Strežniški dnevnik **ne vsebuje osebnih podatkov niti njihovih odlomkov**. Zabeleži se
izključno vrsta napake, njena velikost in oblika. Obdelovalec to preverja s samodejnim testom, ki
skozi resnično strežniško kodo požene podstavljeno identiteto in preveri, da se v dnevniku ne
pojavi noben njen niz osmih znakov.

(g) *(novo)* Piškotek, ki ga brskalnik obdrži po vnosu kode, **ne vsebuje kode**, temveč njeno
zgoščeno vrednost; označen je `HttpOnly`, `Secure` in `SameSite=Lax` in **poteče najpozneje s
koncem preizkusa**. Koda sama je shranjena med nastavitvami gostitelja v berljivi obliki, dostopna
le obdelovalcu — pogodbenici to izrecno ugotavljata; koda varuje dostop do preizkusa, ni pa
geslo, ki bi ga smel kdor koli uporabiti drugje.

**A4 · Drugi podobdelovalec (28(3)(d), 44.–46. člen).** Poleg podobdelovalca iz 6. točke osnovne
pogodbe (Anthropic PBC, ZDA) upravljavec pooblašča še:

> **Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, ZDA** — gostovanje spletnega preizkusa.

**Kje obdelava dejansko poteka.** Strežniška funkcija je nastavljena na regijo **`fra1` —
Frankfurt, Zvezna republika Nemčija**, torej v EU. Obdelovalec je to **izmeril na delujoči
namestitvi**, ne le nastavil. Pogodbenici pa izrecno ugotavljata dvoje:

1. **Sedež ponudnika je v ZDA.** Dejstvo, da obdelava teče v Frankfurtu, samo po sebi ne odpravi
   možnosti dostopa iz tretje države. Varovalka po 46. členu izhaja iz pogodbenih pogojev
   ponudnika o obdelavi podatkov, ki vključujejo standardna pogodbena določila Evropske komisije;
   obdelovalec jih sprejme pred začetkom preizkusa ter jih skupaj z dokazilom o veljavnosti za
   uporabljeni račun predloži ob podpisu ali v 5 delovnih dneh po zahtevi.
2. **Prenos k podobdelovalcu iz 6. točke ostane nespremenjen.** Branje dokumenta še naprej poteka
   pri Anthropic PBC v ZDA. Frankfurt je kraj gostovanja, ne kraj branja. **Gostovani preizkus
   torej ne zmanjša prenosa v ZDA in ga upravljavec ne sme tako razumeti.**

Drugega podobdelovalca obdelovalec ne vključi brez predhodnega pisnega soglasja upravljavca.

**A5 · Kaj ostane odprto — izrecno opozorilo obdelovalca.** Obdelovalec upravljavca opozarja, da
preizkus **ni produkcijski sistem** in da mu manjkajo naslednje lastnosti, ki bi jih produkcija
morala imeti. Upravljavec s podpisom potrjuje, da je bil na to opozorjen **pred** začetkom
uporabe:

| | |
|---|---|
| **Ni revizijske sledi** | Ni zapisa, kdo je kdaj kateri dokument obdelal. Posledica odločitve, da se ne shrani nič. |
| **Ni ločenih uporabniških računov** | Ena skupna koda za vstop (A2). |
| **Ni pogodbeno zagotovljene razpoložljivosti** | Preizkus lahko občasno ni dosegljiv; obdelovalec ne jamči odzivnih časov. |
| **Ni obdelave v EU pri branju** | Glej A4(2). |
| **Omejitev porabe ni absolutna** | Strežnik ima vgrajeno omejitev števila branj na minuto in zgornjo mejo porabe, vendar velja **za posamezen strežniški proces**, ne za preizkus kot celoto. Ustavi podivjano zanko; ni jamstvo, da poraba ne more preseči predvidene. |

**A6 · Podatki po koncu preizkusa.** Ker se pri obdelovalcu ne shrani nič (A3(d)), po koncu
preizkusa pri njem ni podatkov za izbris; obdelovalec to **pisno potrdi** v 5 delovnih dneh po
koncu, skupaj s potrdilom, da je namestitev odstranjena. Obveznost izbrisa iz 9. točke osnovne
pogodbe se nespremenjeno uporablja za vzorčne dokumente in iz njih izvedene datoteke na lokalni
delovni postaji obdelovalca. **Datoteke, ki jih sodelavci upravljavca med preizkusom shranijo na
svoje naprave, so v sferi upravljavca.**

**A7 · Razmerje do osnovne pogodbe.** V primeru neskladja med tem aneksom in osnovno pogodbo se
za obdelavo prek preizkusa uporablja ta aneks, za vso drugo obdelavo pa osnovna pogodba. Aneks je
sestavljen v dveh enakih izvodih, po enega prejme vsaka pogodbenica.

| Za upravljavca: Harvest Hub d.o.o. | Za obdelovalca: AIS Slovenija — Anej Vučič s.p. |
|---|---|
| [ime, funkcija] — **[podpis in žig]** | [ime] — **[podpis]** |
