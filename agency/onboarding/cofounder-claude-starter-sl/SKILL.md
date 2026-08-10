---
name: cofounder-claude-starter-sl
description: Uvede so-ustanovitelja AIS Slovenia v Claude od začetka in ga korak za korakom pripelje do prve prave poslovne avtomatizacije. Uporabi, ko se so-ustanovitelj uči uporabljati Claude, želi nastaviti osebnega AI asistenta ali avtomatizirati ponavljajoče se opravilo (pregled e-pošte, priprava na sestanke, tedenski povzetek, nadaljnja sporočila, raziskava strank), da ima več časa za posel.
---

# Claude — Hitri začetek za so-ustanovitelje AIS

**Cilj:** v enem popoldnevu od *"Claude sem komaj kdaj uporabljal"* do *"imam AI asistenta, ki vsak dan zame opravi eno pravo delo."* Potem pa gradiš naprej, kadar koli želiš.

To preberi **enkrat od začetka do konca**. Korake delaj sproti. Preden prideš do konca, boš že v pogonu.

> 💡 **Nasvet za začetek:** karkoli v tem dokumentu ti ni jasno, prilepi v Claude in napiši: *"Razloži mi to preprosto, kot da sem začetnik."* To je tudi najhitrejši način, da se naučiš.

---

## Kontrolni seznam za 1. dan (po vrsti)

Odkljukaj sproti. Vse skupaj traja ~45 minut.

- [ ] **1.** Odpri [claude.ai](https://claude.ai) in se prijavi (ali odpri namizno aplikacijo Claude).
- [ ] **2.** Preberi *"Claude v 3 minutah"* spodaj, da bo vse ostalo imelo smisel.
- [ ] **3.** Ustvari **Projekt (Project)** z imenom **"Moj AIS operater"** in vanj prilepi blok agenta (2. del).
- [ ] **4.** Preizkusi ga s 3 začetnimi vprašanji.
- [ ] **5.** Vklopi **Gmail** in **Google Calendar** povezavi (connectors).
- [ ] **6.** Nastavi **ENO** avtomatizacijo iz menija (3. del).
- [ ] **7.** Pusti, da teden dni teče. Popravi besedilo. Potem dodaj naslednjo.

To je vse. Vse spodaj le razloži vsak korak.

---

## 1. del — Claude v 3 minutah

Predstavljaj si Claude kot **bistrega sodelavca, ki mu naročaš z navadnimi besedami.** Nič ne programiraš. Razložiš, kaj želiš — tako kot bi razložil pametnemu novemu sodelavcu — in on to naredi.

Posebej dober je pri stvareh, ki ti požirajo dan:
- Branje in povzemanje (dolge e-pošte, dokumenti, pogovori)
- Pisanje osnutkov (e-pošte, sporočila, ponudbe, zapiski)
- Raziskovanje (podjetja, trgi, potencialne stranke)
- Urejanje (iz razmetanih misli v jasen načrt)

Obstajajo **tri ravni**, vsaka bolj samodejna od prejšnje:

| Raven | Kaj je | Za kaj |
|---|---|---|
| **1. Klepet (Chat)** | Vpišeš vprašanje, dobiš odgovor. Enkratno. | Hitra vprašanja. "Povzemi to." "Napiši osnutek odgovora." |
| **2. Projekt (Project)** | Shranjen prostor s **stalnimi navodili** + datotekami. | Tvoj naučen asistent, ki že ve, kako delaš in kaj je AIS. **To je tvoj "agent".** |
| **3. Avtomatizacija** | Claude teče **po urniku** in sega v tvoj **Gmail / Koledar / Notion**. | Opravila, ki naj se dogajajo sama. "Vsako jutro mi uredi prejeto pošto." |

Miselni model:
- **Klepet** = vprašaj enkrat.
- **Projekt** = sodelavec, ki si vsakič vse zapomni.
- **Avtomatizacija** = ta sodelavec se pojavi in opravi delo, ne da bi ga prosil.

Najprej nastaviš Projekt (tvoj agent), nato nanj usmeriš eno avtomatizacijo. Končano.

---

## 2. del — Nastavi svojega operativnega agenta (15 min)

To je jedro. Ustvariš enega asistenta, ki ve, kaj je AIS, ve, kako rad delaš, in nikoli ne naredi nič tveganega brez tvoje potrditve.

**Korak 1 — Ustvari Projekt.**
Na claude.ai (ali v namizni aplikaciji) poišči **Projects** v levem stolpcu → **New Project** → poimenuj ga **"Moj AIS operater."**

> Če ne vidiš Projektov, lahko vseeno narediš vse spodaj — blok prilepi na **začetek vsakega novega klepeta**. Projekti so lepši, ker navodila ostanejo trajno.

**Korak 2 — Prilepi navodila.**
Odpri polje za **navodila (instructions / custom instructions)** v Projektu in prilepi ta celoten blok. (To je "agent". Uredi dele v [oklepajih].)

```text
Si moj AIS operater — osebni poslovni asistent so-ustanovitelja podjetja AIS
Slovenia. Jaz sem tvoj edini človeški lastnik. Tvoja naloga je, da mi prihraniš
čas, da se lahko posvečam rasti podjetja.

## O AIS Slovenia (tvoj kontekst)
AIS Slovenia je AI-domorodno podjetje s tremi so-ustanovitelji. Gradimo in
upravljamo nameščene sisteme AI agentov, ki prevzamejo eno določeno, omejeno
funkcijo znotraj poslovanja stranke. NE prodajamo "AI licenc/sedežev", ur ali
splošnega svetovanja. Cena je strošek izgradnje + mesečna naročnina za delovanje.
Naša prva plačljiva stranka je INSPECTUS (pregledi vozil — avtomatizirali smo
njihov tok podatkov za poročila o poškodbah). Večina strank so slovenska podjetja,
ki še delajo ročno / v Excelu.
Moje ime je [TVOJE IME]. Moj glavni fokus v AIS je [npr. prodaja in stranke /
strategija in AI / pravo in operativa].

## Kaj ti pripada
Prvi osnutki, povzetki, raziskave, urejanje in priprava — vse, kar bom pregledal,
preden šteje. Moje razmetane zapiske, predale in pol-misli spremeniš v jasen,
prioretiziran rezultat, pripravljen za ukrepanje.

## Česar NIKOLI ne narediš brez moje izrecne potrditve
Pred čimerkoli od tega mi pokaži osnutek in počakaj, da rečem "da, pošlji":
- Pošlješ e-pošto, sporočilo ali DM komurkoli zunaj AIS.
- Daš obvezo, ceno ali obljubo stranki v mojem imenu.
- Karkoli javno objaviš.
Vse to lahko prosto PRIPRAVIŠ kot osnutek. Le sam nikoli ne pošlješ ali objaviš.
Gumb pritisnem jaz.

## Kako govoriš
- Kratko in jasno. Najprej odgovor ali dejanje. Brez ogrevanja.
- Brez praznih marketinških fraz: nič "izkoristiti sinergije", "vrhunska rešitev",
  "revolucionarno", "ključni igralec na trgu". Povej konkretno stvar.
- Vsebina za stranke v slovenščini → piši v slovenščini. Notranje razmišljanje je
  lahko v angleščini.
- Ko ti kaj manjka, mi raje postavi ENO ostro vprašanje, kot da ugibaš.
- Če je naloga večja, kot se zdi, povej in predlagaj najmanjši prvi korak.

## Kdaj se ustaviš in me opozoriš
- Karkoli glede denarja, prava, pritožbe stranke ali odločitve, ki je ne morem
  razveljaviti → najprej se ustavi in vprašaj.
- Če mora osnutek za stranko zveneti kot določena oseba, me najprej prosi za
  resnične primere njenega pisanja (več kot je, bolje je). Vsebine, odvisne od
  glasu, ne pošiljamo iz nič.

Vsako sejo začni z vprašanjem: "Kaj imaš danes na mizi?" — in mi pomagaj to počistiti.
```

**Korak 3 (neobvezno) — Daj mu spomin.**
Če ima Projekt razdelek **"knowledge" / datoteke**, vanj naloži vse, kar naj vedno ve: kratek dokument o tem, kaj AIS dela, seznam storitev, cene. Več ko ve, manj ponavljaš.

**Korak 4 — Preizkusi ga.** Začni klepet *znotraj Projekta* in poskusi:
1. *"Kaj imam danes na mizi?"* — poglej, kako začne.
2. *"Tu so moji grobi zapiski s klica s stranko: [prilepi 3 razmetane vrstice]. Napiši kratek osnutek nadaljnje e-pošte v slovenščini. Ne pošlji ga."*
3. *"Imam 2 prosti uri popoldne. Glede na to, kaj je AIS, kaj je najbolj vredna stvar, ki bi jo lahko naredil?"*

Če se odgovori ne zdijo pravi, uredi blok z navodili in poskusi znova. **Urejanje navodil je način, kako ga "treniraš".** To je celotna veščina.

---

## 3. del — Zgradi prvo avtomatizacijo (najboljši del)

Zdaj poskrbiš, da teče *sam*. Najprej vklopi orodja, ki jih potrebuje:

**Povezave (connectors).** V **Settings → Connectors** (imena se na tvojem paketu lahko malo razlikujejo) poveži **Gmail** in **Google Calendar**. Če uporabljaš **Notion** ali **Google Drive**, poveži tudi to. Ne najdeš? Vprašaj kar Claude: *"Kako na svojem paketu povežem Gmail?"* — te bo vodil.

Nato izberi **eno opravilo, ki ti vzame največ tedna**, iz tega menija in ga nastavi. Vsako je za prilepiti.

> **Kako nastaviti urnik:** poišči **"Tasks" / "Scheduled" / "Automations"** v Claude, ustvari novo in prilepi navodilo. Če tvoj paket urnika še nima, navodilo poganjaj ročno vsako jutro — še vedno prihrani čas, manjka ti le časovnik.

### 1. Pregled e-pošte — *"kaj me danes res potrebuje"*
**Naredi:** prebere neprebrano pošto in ti da razvrščen seznam namesto strašljivega predala.
```text
Vsak delovnik ob 7:30 poglej mojo neprebrano Gmail pošto zadnjih 24 ur. Razvrsti
jo v: (1) Potrebuje moj odgovor danes, (2) Samo v vednost, (3) Lahko prezrem. Za
skupino 1 mi daj eno vrstico, kaj želijo, plus predlog odgovora v enem stavku, ki
ga lahko uredim. Ničesar NE pošlji.
```
**Varovalo:** samo osnutki — pošlješ ti.

### 2. Priprava na sestanke — *vstopi pripravljen*
**Naredi:** polstranski povzetek pred vsakim zunanjim sestankom.
```text
Vsako jutro poglej današnji koledar. Za vsak sestanek z nekom zunaj AIS mi daj
kratko pripravo: kdo so, cilj sestanka, 3 pametna vprašanja, ki naj jih postavim,
in eno stvar, ki bi lahko šla narobe. Največ pol strani na sestanek.
```
**Varovalo:** samo zame, interno.

### 3. Tedenski AIS povzetek — *zaključi teden čisto*
**Naredi:** petkov povzetek, da ponedeljek ni hladen start.
```text
Vsak petek ob 16:00 mi postavi 3 hitra vprašanja o mojem tednu. Nato napiši
enostranski povzetek: zmage, kaj je obtičalo, in mojih top 3 prioritet za naslednji
teden. Povzetek shrani, da ga lahko naslednji petek primerjamo.
```
**Varovalo:** samo interno.

### 4. Osnutki nadaljnjih sporočil — *nikoli ne izgubi stika*
**Naredi:** iz zapiskov s klica naredi sporočilo, pripravljeno za pošiljanje. (Po potrebi — brez urnika.)
```text
Prilepil bom zapiske s klica. Napiši kratek osnutek nadaljnje e-pošte v slovenščini:
zahvali se, povzemi dogovorjeno in navedi EN naslednji korak z datumom. Manj kot
120 besed. Ne pošlji ga — daj mi ga v pregled.
```
**Varovalo:** samo osnutek. Če mora zveneti kot ti, mu prej daj nekaj svojih pravih e-pošt.

### 5. Raziskava strank / trga — *pridi poučen*
**Naredi:** strukturiran povzetek o katerem koli podjetju ali temi. (Po potrebi.)
```text
Razišči [ime podjetja]. Povej mi: kaj delajo, kakšni znaki kažejo, da še delajo
ročno ali v Excelu, KATERO funkcijo bi AIS lahko prvo prevzel zanje, in 3-stavčni
uvodni kot za prvi pogovor. Navedi, kje si našel vsako dejstvo.
```
**Varovalo:** to je izhodišče — dejstva preveri, preden ukrepaš.

**Spravi v pogon eno to tednu.** Ne nastavljaj vseh petih. Izberi tisto eno, ki ustreza tvojemu največjemu tedenskemu požiralcu časa, jo spravi v pogon danes, pusti, da teče pet dni, in popravi besedilo. *Šele nato* dodaj drugo.

---

## 4. del — Pravila (preberi enkrat, te varujejo)

To so hišna pravila AIS, po domače. Ni birokracija — to je tisto, kar prepreči, da bi te AI osramotil.

1. **Lastnik si ti.** Vsaka avtomatizacija ima točno enega človeka, ki je zanjo odgovoren: tebe. Brez "nastavi in pozabi za vedno" — pogled na rezultat vržeš.
2. **Claude piše osnutke, ti pošiljaš.** Nič ne pride do stranke ali v javnost brez tvojega pritiska na gumb. To ni za debato.
3. **Brez plačanih oglasov.** AIS ne dela kampanj na Googlu/Meti. Ne prosi Claude za oglaševalske strategije — to ni naš model.
4. **Pravi glas potrebuje primere.** Vsebina za stranke zveni človeško šele, ko Claude vidi ~15 resničnih primerov pisanja te osebe. Do takrat njegove besede jemlji kot grob osnutek, ne kot dokončno različico.
5. **Brez praznih fraz.** Če osnutek reče "izkoristiti sinergije", "vrhunska rešitev" ali "revolucionarno", izbriši stavek in prosi za konkretno različico. AIS piše ostro in konkretno.
6. **Pazi na podatke.** Zaupnih datotek stranke ne lepi v naključen klepet, če jih ne bi poslal po e-pošti. Ko si v dvomih, raje povzemi, kot da prilepiš surovo.

---

## 5. del — Naslednja stopnja (ko ti gre)

**Navodilo iz 4 delov.** Kadar je rezultat slab, običajno manjka eno od teh. Daj Claude vse štiri:
> **Vloga** (kdo naj bo) + **Naloga** (kaj naj naredi) + **Kontekst** (ozadje) + **Oblika** (kakšen naj bo odgovor).
>
> *Primer:* "**Si moj prodajni asistent.** **Napiši nadaljnjo e-pošto.** **Stranka je slovensko logistično podjetje, ki smo ga spoznali v torek; demo jim je bil všeč, a jih skrbi cena.** **V slovenščini, manj kot 100 besed, prijazno a neposredno.**"

**Pusti, da te Claude uči.** Zataknjen? Vprašaj ga. Poskusi: *"Sem nov pri Claude — pokaži mi 3 načine, kako bi mi ta teden prihranil eno uro,"* ali *"Kaj v moji vlogi pri AIS bi lahko avtomatiziral, pa nisem pomislil?"*

**Iz dobrega navodila naredi veščino (Skill).** Ko navodilo super deluje in ga ves čas ponavljaš, reci: *"Iz tega naredi veščino (Skill), ki jo lahko shranim in pokličem po imenu."* Claude ti jo oblikuje.

**Kdaj pokličeš Iana:**
- Nastavitve, skozi katere te ta dokument ni spravil (povezave, urniki, tvoj paket).
- Želiš *poseben* agent za določen AIS potek dela (te gradi Ian s Claude Code).
- Karkoli, kar se dotika skupnih AIS sistemov (nadzorne plošče za stranke, INSPECTUS, VPS).

---

## Dodatek — namesti to datoteko kot veščino (Skill) (bonus)

90 % vrednosti si že dobil iz Projekta v 2. delu. To je neobvezna pika na i.

**Veščina (Skill)** je zmožnost, ki jo Claude prikliče po imenu. Za namestitev te:
1. Datoteka naj ostane poimenovana **`SKILL.md`** znotraj mape **`cofounder-claude-starter-sl`**.
2. V Claude pojdi v **Settings → Capabilities → Skills** (besedilo se po paketu lahko razlikuje) in **dodaj / naloži** mapo (ali zip).
3. Zdaj jo lahko kadar koli prikličeš tako, da vprašaš po veščini "cofounder claude starter".

> Ne vidiš možnosti Skills? Odvisno je od tvojega paketa Claude. Brez skrbi — metoda s **Projektom** je za vse v tem vodniku enako močna. Če želiš veščine vklopiti, vprašaj Iana.

---

*Narejeno za so-ustanovitelje AIS Slovenia. Vprašanja → Ian. Zdaj pa počisti svojo mizo.*
