# Odgovori Harvest Hub na vprašanja pred ponudbo

Vir: e-pošta »Fwd: RE: Robotizacija procesa PRENOS — vprašanja pred pripravo ponudbe«,
prejeto/posredovano 30. 7. 2026. Odgovori stranke so označeni rumeno v izvirniku.

> **Opomba o osebnih podatkih.** Priloga vsebuje zaslonsko sliko zaslona eDOKUMENTOV z vzorčnim
> zapisom stranke (ime, e-naslov, telefon, naslov). Tu je zapisana **samo struktura polj in oblika
> zapisa**, ne pa vrednosti — te ostanejo v e-pošti. Ta repozitorij je javen.

---

## Integracije

**V: Ali sistema eDOKUMENTI in Zavarovalniški program razpolagata z dokumentiranim API-jem, ki
omogoča tudi pisanje in ne le branja?**

> **O:** »Planirajte, da dokumentiran API dobimo, če še ni pripravljen, ga bodo pripravili.«

**V: Kdo je kontaktna oseba pri ponudniku sistema eDOKUMENTI in ali lahko računamo na njihovo
sodelovanje pri integraciji?**

> **O:** »Seveda lahko računamo, so že seznanjeni, da planiramo razviti robota.«

**V: Ali eDOKUMENTI podpirajo strukturirana statusna polja na zapisu ponudbe ali so na voljo zgolj
prostotekstovni zaznamki?**

> **O:** »Podpirajo strukturirana fiksna statusna polja kot na primer:« *(priložena zaslonska slika)*

---

## Struktura zaslona eDOKUMENTI — iz priložene zaslonske slike

Najpomembnejši tehnični podatek v celotnem odgovoru. To je ciljni obrazec, ki ga mora robot
izpolniti.

**Zavihki:** `Zavarovalec` · `Zavarovanec` · `Privolitvena izjava` · `⊘ Kontrolni list ponudb`
→ kontrolni list je torej **že zavihek v eDOKUMENTIH**, ne le ločen PDF. Rdeča ikona pri njem
verjetno pomeni »obvezno/nepopolno«.

**Razdelki in polja:**

| Razdelek | Polja |
|---|---|
| IZBERI STRANKO | `Stranka` (spustni seznam, zapis nosi **interni ID v oglatih oklepajih**) + gumb `Dodaj novo stranko` |
| DODATNI PODATKI STRANKE | `Ime` · `Priimek` — **ločeno** |
| KONTAKT | `Email` · `Mobilna številka` — **ločena izbirnika za klicno kodo (+386) in številko** |
| NASLOV | `Ulica` · `Hišna številka` · `Poštna številka` · `Kraj` — **štiri ločena polja** |

**Oblika zapisa, ki jo je razbrati iz vzorca:**

- Telefon: klicna koda je ločena od številke, številka je **brez vodilne ničle**
  (vodilna ničla odpade).
- Naslov je razbit na **štiri** dele. Naša ponudba/KLP nosita naslov **združen**
  (`naslov_posta_kraj`), `splitAddress()` v `demo/lib/klp.js` pa zna le **dvojno** delitev
  (ulica s hišno številko / poštna številka s krajem). **Za eDOKUMENTE manjka delitev hišne
  številke od ulice in kraja od poštne številke.**
- Ime in priimek sta ločena — to `splitName()` že zna, z varovalko za tridelna imena in nazive
  pravnih oseb.
- Zapis stranke ima interni ID → robot bo moral **poiskati obstoječo stranko ali ustvariti novo**
  (`Dodaj novo stranko`). Podvajanje strank je resnično tveganje in v specifikaciji ni obdelano.

---

## Obseg podatkov

**V: Kateri točno določeni podatki morajo biti preneseni v Zavarovalniški program?**

> **O:** »Za zavarovalniški program pripravimo naknadno, potrebno narediti šifrant zavarovalnice in
> povezati s šifrantom iz zavarovalniškega programa.«

→ Prenos v Zavarovalniški program je **odložen** in pogojen z izdelavo šifranta ter preslikavo med
šifrantoma. To je nova, prej neznana naloga.

**V: Ali se nabor polj razlikuje med posameznimi tipi zavarovanj ali gre za enoten seznam?**

> **NI ODGOVORJENO.**

---

## Trenutni proces

**V: Koliko minut danes v povprečju traja obdelava ene ponudbe od prejema e-pošte do zaključenega
vnosa v oba sistema?**

> **O:** »Ne razpolagamo s podatkom.«

→ Podlage za izračun prihranka ni. Panel »Koliko časa to vzame danes?« v prikazu zato ni več
orodje za zajem njihove številke, ampak orodje, s katerim številko **skupaj izpeljemo** na sestanku.

**V: Koliko sodelavcev je vključenih v proces?**

> **NI ODGOVORJENO.**

---

## Okolje in skladnost

**V: Kdo bo po predaji upravljal infrastrukturo in ali ima družba že vzpostavljen račun pri
ponudniku AI storitev?**

> **O:** »Zaenkrat računa še nimamo, svetujte kateri ponudnik AI storitev je za našo rešitev najbolj
> primeren?«

→ **Stranka nas izrecno prosi za priporočilo ponudnika.** Ker računa še nimajo, regija obdelave ni
vnaprej določena — izbira je odprta in je naša odločitev, ki jo moramo utemeljiti.

**V: Kakšne so obveznosti hrambe te dokumentacije po ZZavar-1 in vaši interni politiki?**

> **O:** »Spoštujejo se določila ZVOP-2, Uredba GDPR, ZZavar-1, …«

→ Splošen odgovor; konkretnih rokov hrambe nismo dobili. Za Fazo 0 ostaja odprto.

---

## Kaj se s tem spremeni

1. **R1 (največje tveganje v ponudbi) je razrešeno v našo korist.** API bo na voljo; dobavitelj je
   seznanjen. Ostaja **terminsko** tveganje (tretja oseba, brez datuma), ne več tehnično.
2. **Dobili smo ciljno strukturo polj eDOKUMENTOV** — nadgradnja izvoza v prikazu je s tem mogoča.
3. **Prenos v Zavarovalniški program je odložen** in zahteva šifrant + preslikavo (nova naloga).
4. **Izračuna prihranka ne moremo opreti na njihov podatek** — izpeljati ga je treba na sestanku.
5. **Dolžni smo jim priporočilo ponudnika AI** — to je zdaj naš izdelek, ne njihova odločitev.
