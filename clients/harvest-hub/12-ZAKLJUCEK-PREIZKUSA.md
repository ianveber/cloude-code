# Zaključek preizkusa — kaj poslati Petri

**Osnutek. Ni poslano.** Pošlje Anej (podpisal je predajno pismo in ima odnos).

**Rok: 18. 8. 2026.** Preizkus se zapre 19. 8. ob 00:00 — preverjeno na sami strani, ne po spominu.

---

## Zakaj je to najbolj nujna stvar v celotnem načrtu

Števec »Prihranek v tem preizkusu« teče **v Petrinem brskalniku**. Ko se preizkus zapre, ta številka
izgine in je ni mogoče rekonstruirati — stari postopek do takrat teče, potem ne več.

Pri INSPECTUSU se je zgodilo točno to: časovnega prihranka nihče ni izmeril pred zagonom, zato
študija primera stoji na točnosti (314 vozil, 0 napačnih oznak) in ne na času. To je zapisano v
`agency/sales/case-studies/inspectus.md` kot stvar, ki ni delovala.

Harvest Hub je prvi primer, kjer je merilni instrument **vgrajen v sam preizkus**. Če se preizkus
zapre brez te številke, izgubimo isto stvar drugič — in tokrat po lastni krivdi, ker je merilnik
tam in samo nihče ni vprašal.

Ta številka opravi tri stvari hkrati:

1. **Zapre posel.** Cena ni več naša ocena, ampak njihova izmerjena ura.
2. **Postane študija primera** — druga v vertikali, obe pa sta pogoj za vsako pot pridobivanja
   strank v `agency/sales/`.
3. **Postavi ceno vzdrževanja.** Novi pas je 900–1.800 €/mes. in je vezan na delo, ki ga sistem
   nadomesti. Brez njihove številke je to naša trditev; z njo je aritmetika.

---

## Osnutek pisma

Zadeva: **Preizkus se zapre 18. 8. — dve stvari, preden ugasne**

> Pozdravljena Petra,
>
> preizkus je odprt še do vključno **18. avgusta**, potem se zapre sam. Preden se to zgodi, bi vas
> prosil za dvoje.
>
> **Prvo je številka.** V kartici »Prihranek v tem preizkusu« kliknite **Kopiraj povzetek** in mi ga
> prilepite v odgovor. Ta števec teče pri vas v brskalniku in se ob zaprtju izgubi — rekonstruirati
> ga pozneje ni mogoče, ker takrat stari postopek ne teče več.
>
> Povem odkrito, zakaj vztrajam: to je edina številka v celotnem projektu, ki je vaša in ne moja.
> Vse ostalo, kar bi lahko rekel o prihranku, je ocena. Če se izkaže, da je prihranek majhen — ali
> da je stroj kje počasnejši od vas — je to prav tako uporabno in to tudi povejte. Takrat gledava,
> kje se da skrajšati, ne pa iskati lepšo številko.
>
> Če časa za ročni postopek niste vpisali, ni prepozno: vpišete ga zdaj, panel »Koliko časa to vzame
> danes?« preračuna nazaj čez vse, kar ste dali skozi.
>
> **Drugo je aneks.** Priložen je še vedno nepodpisan. Dokler ni podpisan, v preizkus ne smejo
> resnične ponudbe strank — osnovna pogodba dodajanje gostitelja brez pisnega soglasja izrecno
> prepoveduje, pri dokumentih z zdravstvenimi podatki pa to ni formalnost. Ena stran, en podpis.
>
> In tri vprašanja, na katera bi rad slišal odgovor, preden se dogovoriva o nadaljevanju:
>
> 1. **Kateri podatek je prebral narobe?** Konkreten primer je vreden več kot splošen vtis.
> 2. **Katerega dokumenta ni prepoznal?** Danes jih pozna štiri; kar naštejete, je seznam za
>    naslednjo fazo.
> 3. **Kaj v kontrolnem listu manjka?** Polja so povzeta po vašem obrazcu, poimenovanja so naša.
>
> Ko to dobim, predlagam kratek klic — pol ure — kjer se pogovoriva o obsegu in terminu. Povzetek
> pošljite tudi, če se za nadaljevanje ne odločite; takrat vam po aneksu pisno potrdim, da pri nas
> ni ničesar za izbrisati in da je namestitev odstranjena.
>
> Lep pozdrav,
> Anej

Priloga: `10-aneks-1-gostovani-preizkus.md` (oz. `Aneks-1-Harvest-Hub.pdf`)

---

## Preden pošlješ

- [ ] Zaženi `./scan-personal-data.sh` — repozitorij je javen in enkrat je vanj že ušel resničen
      e-naslov zastopnika.
- [ ] Preveri, da je preizkus res še odprt (edini zanesljiv vir je stran sama):
      `curl -s https://harvest-hub-preizkus.vercel.app/ | grep -o "Preizkus je odprt[^.]*"`
- [ ] Pripni aneks.

## Če ne odgovori do 15. 8.

Pokliči. Preizkus se zapre sam in ne čaka na odgovor — po 19. 8. te številke ni več, ne glede na to,
kako se posel konča. Klic v tem primeru ni pritisk na prodajo, ampak zajem meritve, ki je ni mogoče
ponoviti.

## Po zaprtju (aneks, točka A6)

Pisno potrdi, da pri nas ni ničesar za izbrisati in da je namestitev odstranjena:

```bash
vercel remove harvest-hub-preizkus --yes && vercel project rm harvest-hub-preizkus --yes
```
