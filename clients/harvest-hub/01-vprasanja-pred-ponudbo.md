# Vprašanja pred pripravo ponudbe — Harvest Hub

**Namen:** poslati PRED ponudbo. Ostra, konkretna vprašanja nas pozicionirajo kot resnega ponudnika
in — kar je bolj pomembno — številke za izračun prihranka dobimo od njih, ne iz naše glave.

**Kanal:** e-pošta. Kratko, brez uvoda, oštevilčeno.
**Ian — interna opomba:** vprašanji 1 in 3 sta ključni. 1 določa, ali projekt sploh stoji (glej R1 v planu).
3 je edina številka, ki naredi izračun donosnosti verodostojen — če jo izrečejo oni, je neizpodbitna.

---

## Osnutek e-pošte

**Zadeva:** Robotizacija procesa PRENOS — vprašanja pred pripravo ponudbe

---

Spoštovani,

hvala za specifikacijo in vzorčno dokumentacijo. Dokumente smo pregledali v celoti — vključno s
tehnično analizo vseh 15 priloženih PDF-jev — in imamo jasno sliko rešitve.

Pred oddajo ponudbe potrebujemo odgovore na spodnja vprašanja. Od njih je odvisen natančen obseg in
posledično cena; brez njih bi ponudba temeljila na predpostavkah, česar pri projektu te vrste ne
želimo početi.

**Integracije**

1. Ali sistema **eDOKUMENTI** in **Zavarovalniški program** razpolagata z dokumentiranim API-jem, ki
   omogoča tudi **pisanje** (ne le branje)? Če da, prosimo za dokumentacijo oz. kontakt ponudnika.
2. Kdo je kontaktna oseba pri ponudniku sistema eDOKUMENTI in ali lahko računamo na njihovo
   sodelovanje pri integraciji?
3. Ali eDOKUMENTI podpira **strukturirana statusna polja** na zapisu ponudbe, ali so na voljo zgolj
   prostotekstovni zaznamki? *(Vpliva na to, kako robot vodi opozorilo o manjkajočem 545. členu — v
   ponudbi predlagamo tri različice.)*

**Obseg podatkov**

4. Kateri **točno določeni podatki** morajo biti preneseni v Zavarovalniški program? Natančen seznam
   polj = natančen obseg projekta.
5. Ali se seznam polj razlikuje med posameznimi tipi zavarovanj, ali gre za enoten nabor?

**Trenutni proces**

6. Koliko **minut** danes v povprečju traja obdelava ene ponudbe od prejema e-pošte do zaključenega
   vnosa v oba sistema?
7. Koliko sodelavcev je vključenih v proces in kako je delo razdeljeno med njimi?

**Okolje in skladnost**

8. Kdo bo po predaji upravljal infrastrukturo (strežnik, baza) in ali ima družba že vzpostavljen
   račun pri ponudniku AI storitev? *(Rešitev predajamo v vašo last in upravljanje — mesečne naročnine ni.)*
9. Kakšne so obveznosti hrambe te dokumentacije po ZZavar-1 in vaši interni politiki?

Ponudbo pripravimo v petih delovnih dneh od prejema odgovorov.

Lep pozdrav,
**Ian Veber**
AIS

---

## Zakaj vsako vprašanje (interno — ne pošiljati)

| # | Kaj v resnici preverjamo |
|---|---|
| 1 | **Največje tveganje projekta.** Specifikacija predpostavlja obstoj API-jev. Če jih ni, je to RPA projekt — drug obseg, druga cena. Faza 0 je zato pogodbeni prag za ponovno oceno. |
| 2 | Ali smo odvisni od zunanjega ponudnika, ki nima interesa sodelovati. Če je odgovor mlačen, gre Rešitev 1 s tega seznama. |
| 3 | Odgovorimo na njihovo lastno vprašanje („svetujte kako naj ga robot doda") s tremi konkretnimi možnostmi. Zastonj kredibilnost. |
| 4–5 | Zaklene obseg. Brez tega je „prenos metapodatkov" neomejena obveza. |
| 6 | **Edina številka, ki poganja izračun donosnosti.** Mora priti od njih. |
| 7 | Pove, kako velik je problem interno in kdo bo rešitev branil oz. blokiral. |
| 8 | Ker mesečne naročnine ne želijo, morata lastništvo in strošek delovanja biti zapisana črno na belem. |
| 9 | Vpliva na politiko hrambe in arhitekturo revizijske sledi. |
