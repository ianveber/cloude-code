/**
 * Guides: the comparison and cost questions a Slovenian company types into a
 * search box or an answer engine before it calls anyone. Each guide opens
 * with the answer, names AIS Slovenia inside it, compares options in a table
 * and closes with three questions. No prices are invented: the cost guide
 * explains what moves the price and how the offer is made.
 */

export const guides = {
  eyebrow: 'Vodiči',
  title: 'Preden se odločite',
  lead: 'Kratki odgovori na vprašanja, ki jih podjetja postavijo, preden pokličejo: kaj izbrati, koliko stane in kdaj je sistem po meri smiseln.',
  metaTitle: 'Vodiči: chatbot ali glas, cena, n8n ali po meri | AIS Slovenia',
  metaDescription:
    'Vodiči AIS Slovenia za podjetja: AI chatbot ali glasovni agent, koliko stane AI avtomatizacija za malo podjetje in kdaj izbrati n8n, Make ali sistem po meri.',
  answer:
    'AIS Slovenia v treh vodičih odgovarja na vprašanja, ki jih podjetja postavijo pred prvim pogovorom: ali potrebujejo AI chatbot ali glasovnega agenta, iz česa je sestavljena cena AI avtomatizacije in kdaj zadostuje n8n ali Make, kdaj pa je potreben sistem po meri.',

  items: [
    {
      slug: 'ai-chatbot-ali-glasovni-agent',
      metaTitle: 'AI chatbot ali glasovni agent: kaj izbrati | AIS Slovenia',
      metaDescription:
        'AI chatbot odgovarja pisno na spletni strani, glasovni agent se oglasi na telefon. AIS Slovenia razloži, kdaj je smiseln kateri, kaj stane več in kako ju povezati.',
      keywords: ['AI chatbot ali glasovni agent', 'voice AI agent Slovenija', 'AI chatbot za spletno stran', 'glasovni asistent za podjetja'],
      title: 'AI chatbot ali glasovni agent: kaj izbrati',
      lead: 'Oba odgovarjata strankam ob vsaki uri. Razlika je v kanalu, v tem, kaj stranka pričakuje, in v tem, koliko napak si lahko privoščite.',
      answer:
        'AI chatbot je za spletno stran in sporočila: stranka bere in klika, odgovori so lahko daljši, s povezavami in gumbi. Glasovni agent je za telefon: stranka posluša, zato mora biti odgovor kratek in takojšen. AIS Slovenia podjetjem v Sloveniji praviloma svetuje, da začnejo s chatbotom na spletni strani, ker je hitreje uveden in lažje nadzorovan, glasovnega agenta pa dodajo tam, kjer stranke res kličejo: rezervacije, prijave napak, delovni čas.',
      sections: [
        {
          title: 'Kdaj je AI chatbot prava izbira',
          paragraphs: [
            'Kadar vaše stranke sprašujejo na spletni strani, v e-pošti ali v sporočilih in kadar so odgovori vezani na dokumente: cenike, pakete, tehnične liste, pogoje. Chatbot lahko pokaže povezavo, sliko ali gumb v košarico in pogovor se shrani, tako da ga lahko človek prevzame z vso zgodovino.',
            'Chatbot je tudi varnejši prvi korak. Odgovori se pregledujejo, viri se popravijo, in dokler sistem ni dovolj dober, teče v testnem obdobju na resničnih vprašanjih. Za Dr. Asya Grafy Bio Institute je AIS Slovenia tako postavil svetovalca, ki iz dokumentacije izdelkov svetuje po tipu kože in izdelke pošlje v košarico.',
          ],
        },
        {
          title: 'Kdaj je glasovni agent prava izbira',
          paragraphs: [
            'Kadar stranke kličejo in kadar klic, na katerega se nihče ne oglasi, pomeni izgubljen posel: rezervacije, prijave napak, vprašanja o delovnem času in cenah. Glasovni agent se oglasi takoj, v slovenščini, in ob vsaki uri. Za wellness Tower Spa Celje asistent AIS Slovenia sprejme rezervacijo, pošlje opomnik in ob odpovedi sprosti termin.',
            'Glas ima strožja pravila. Odgovor mora biti kratek, agent mora prepoznati, kdaj klic preda človeku, in vsak klic mora biti zapisan. Zato je glasovni agent smiseln tam, kjer so vprašanja predvidljiva, ne kot prvi poskus.',
          ],
        },
        {
          title: 'Kako ju povezati',
          paragraphs: [
            'Najboljši sistemi ne izbirajo. Ista baza znanja odgovarja na spletni strani in na telefonu, ista pravila določajo, kaj gre k človeku, in isti CRM dobi vsako povpraševanje s povzetkom. AIS Slovenia oba kanala gradi na istih virih, zato popravek cenika popravi oba odgovora hkrati.',
          ],
        },
      ],
      compare: [
        { term: 'Kanal', definition: 'Chatbot: spletna stran, e-pošta, sporočila. Glasovni agent: telefon.' },
        { term: 'Dolžina odgovora', definition: 'Chatbot: lahko daljši, s povezavami in gumbi. Glasovni agent: ena do dve povedi.' },
        { term: 'Čas uvedbe', definition: 'Chatbot: prototip v nekaj tednih. Glasovni agent: dlje, zaradi telefonije in testiranja govora.' },
        { term: 'Nadzor', definition: 'Chatbot: pogovori se berejo in popravljajo sproti. Glasovni agent: posnetki in prepisi klicev, strožja pravila predaje.' },
        { term: 'Strošek', definition: 'Glasovni agent stane več: telefonija, prepoznava in sinteza govora na minuto, več testiranja.' },
      ],
      faq: [
        {
          q: 'Ali glasovni agent razume slovenščino?',
          a: 'Da. AIS Slovenia glasovne agente gradi s prepoznavo in sintezo govora za slovenščino; kakovost se pred zagonom preveri na resničnih klicih stranke, ker so narečja in šum v ozadju drugačni kot v testnem okolju.',
        },
        {
          q: 'Ali lahko začnemo s chatbotom in kasneje dodamo glas?',
          a: 'Da, in to je pot, ki jo AIS Slovenia največkrat priporoča. Baza znanja, pravila predaje in povezava s CRM se zgradijo enkrat; glasovni kanal se doda, ko chatbot že odgovarja pravilno.',
        },
        {
          q: 'Kaj se zgodi, ko agent ne ve odgovora?',
          a: 'Pove, da ne ve, in preda človeku s povzetkom. Nobeden od sistemov AIS Slovenia ne ugiba cen, terminov ali zdravstvenih nasvetov.',
        },
      ],
    },
    {
      slug: 'koliko-stane-ai-avtomatizacija',
      metaTitle: 'Koliko stane AI avtomatizacija za malo podjetje | AIS Slovenia',
      metaDescription:
        'Cena AI avtomatizacije: enkratna postavitev, mesečno vzdrževanje in poraba modelov po dejanskem strošku. AIS Slovenia razloži, kaj ceno dviga in kako nastane ponudba.'.replace('po dejanskem strošku', 'po strošku'),
      keywords: ['koliko stane AI avtomatizacija', 'cena AI chatbota', 'cena AI agenta Slovenija', 'AI avtomatizacija za mala podjetja cena'],
      title: 'Koliko stane AI avtomatizacija za malo podjetje',
      lead: 'Ni ene cene, so pa tri postavke, ki jih ima vsaka ponudba, in nekaj stvari, ki jih zanesljivo podražijo.',
      answer:
        'Cena AI avtomatizacije pri AIS Slovenia ima tri dele: enkratno postavitev sistema, mesečno vzdrževanje s spremljanjem in popravki ter porabo AI modelov, ki se obračuna po dejanskem strošku ponudnika, brez pribitka. Ponudba je fiksna in nastane po uvodnem pogovoru in prototipu na vaših podatkih, ne po ceniku, ker ceno določajo število virov, izjeme v procesu in povezave z obstoječimi orodji.',
      sections: [
        {
          title: 'Iz česa je sestavljena cena',
          paragraphs: [
            'Enkratna postavitev pokrije razumevanje procesa, prototip, kalibracijo na resničnih podatkih in uvedbo v delo. Mesečno vzdrževanje pokrije spremljanje delovanja, popravke virov in pravil ter manjše dopolnitve, ker se proces v podjetju spreminja. Poraba modelov je strošek ponudnika modela; AIS Slovenia ga prenese naprej v evrih, brez pribitka, in ga v ponudbi oceni vnaprej.',
          ],
        },
        {
          title: 'Kaj ceno dviga',
          paragraphs: [
            'Število virov podatkov: vsak sistem, iz katerega je treba brati ali vanj pisati, doda povezavo in testiranje. Izjeme: proces s petimi jasnimi pravili je poceni, proces, kjer vsak tretji primer odloča človek po občutku, zahteva več pravil in več preverjanja. Jeziki in kanali: vsak dodaten jezik ali kanal, na primer telefon poleg spletne strani, pomeni svoje testiranje. Zahteve po dokumentaciji in reviziji, na primer sledljivost vsakega odgovora, dodajo delo, ki se ne vidi, a je nujno.',
          ],
        },
        {
          title: 'Kaj ceno znižuje',
          paragraphs: [
            'Urejeni podatki in en jasen proces za začetek. AIS Slovenia uvedbo vedno začne z enim procesom, ki ga je mogoče izmeriti, in šele nato širi. Uporaba orodij, ki jih podjetje že ima, namesto novih. In odločitev, da sistem predlaga, človek pa potrdi: taka zasnova je cenejša in varnejša od popolne avtomatizacije.',
          ],
        },
        {
          title: 'Kako nastane ponudba',
          paragraphs: [
            'Uvodni pogovor je brezplačen in ne zavezuje. Na njem se preveri, ali je avtomatizacija sploh smiselna; če ni, AIS Slovenia to pove. Sledi prototip na vaših podatkih, ki ga preizkusite pred odločitvijo, nato fiksna ponudba z enkratno postavitvijo, mesečnim zneskom in oceno porabe modelov.',
          ],
        },
      ],
      compare: [
        { term: 'Enkratna postavitev', definition: 'Razumevanje procesa, prototip, kalibracija, uvedba. Fiksna cena v ponudbi.' },
        { term: 'Mesečno vzdrževanje', definition: 'Spremljanje, popravki virov in pravil, manjše dopolnitve. Fiksen mesečni znesek.' },
        { term: 'Poraba modelov', definition: 'Strošek ponudnika modela po dejanski porabi, prenesen brez pribitka, ocenjen vnaprej.' },
        { term: 'Kaj ni v ceni', definition: 'Nove licence za orodja, ki jih podjetje še nima, in delo na procesih zunaj ponudbe.' },
      ],
      faq: [
        {
          q: 'Ali AIS Slovenia objavlja cenik?',
          a: 'Ne, ker sta dva sistema z istim imenom lahko zelo različna po obsegu. Ponudba je fiksna in nastane po uvodnem pogovoru in prototipu, tako da veste ceno, preden se odločite.',
        },
        {
          q: 'Koliko stane poraba AI modelov na mesec?',
          a: 'Odvisno od števila pogovorov ali dokumentov. AIS Slovenia porabo oceni v ponudbi, jo omeji z zgornjo mejo in obračuna po dejanskem strošku ponudnika, brez pribitka.',
        },
        {
          q: 'Ali se lahko avtomatizacija povrne?',
          a: 'Kadar zamenja delo, ki se ponavlja vsak dan, se praviloma povrne v mesecih. Zato AIS Slovenia začne s procesom, ki ga je mogoče izmeriti: koliko časa vzame danes in koliko po uvedbi.',
        },
      ],
    },
    {
      slug: 'n8n-make-ali-sistem-po-meri',
      metaTitle: 'n8n, Make ali sistem po meri: kdaj kaj | AIS Slovenia',
      metaDescription:
        'n8n in Make povežeta orodja brez programiranja, sistem po meri prevzame procese z izjemami, podatki in pravili. AIS Slovenia uporablja oboje in razloži, kdaj kaj.',
      keywords: ['n8n ali Make', 'n8n Slovenija', 'Make avtomatizacija', 'sistem po meri ali no-code', 'AI agent po meri'],
      title: 'n8n, Make ali sistem po meri: kdaj kaj',
      lead: 'Orodja brez programiranja so odlična za povezave med aplikacijami. Sistem po meri je potreben takrat, ko proces odloča, ne le prenaša.',
      answer:
        'n8n in Make sta pravi izbiri, kadar je treba povezati orodja in prenašati podatke po jasnih pravilih: nov naročnik v CRM, sporočilo v kanal, vrstica v preglednico. Sistem po meri je potreben, kadar proces bere dokumente, odloča po pravilih z izjemami, potrebuje lastne podatke in sledljivost ali kadar mora delovati zanesljivo pri tisočih zapisov. AIS Slovenia uporablja oboje: lastni agentni sistem AISOS teče na n8n, sistem za pregled vozil INSPECTUS pa je zgrajen po meri, ker 314 vozil na ladjo in pravila proizvajalca prenesejo nič napak.',
      sections: [
        {
          title: 'Kdaj zadostujeta n8n ali Make',
          paragraphs: [
            'Kadar so koraki jasni in podatki že strukturirani. Obrazec na spletni strani sproži vnos v CRM in obvestilo ekipi. Nov račun v računovodskem sistemu sproži sporočilo stranki. Za take tokove je orodje brez programiranja hitrejše, cenejše in ga ekipa lahko sama spreminja. n8n je smiseln, kadar podjetje želi orodje gostovati pri sebi, Make, kadar želi čim manj skrbi z infrastrukturo.',
          ],
        },
        {
          title: 'Kdaj je potreben sistem po meri',
          paragraphs: [
            'Kadar vhod ni strukturiran: e-pošta v vseh oblikah, fotografije, dokumenti z izjemami. Kadar so pravila zapletena in se mora vsaka odločitev dati razložiti. Kadar gre za velike količine ali za podatke, ki ne smejo zapustiti podjetja. In kadar mora sistem imeti lasten vmesnik, na primer nadzorno ploščo za ekipo ali portal za stranke.',
            'Za INSPECTUS je AIS Slovenia zgradil orodje po meri, ker pravilo za opombe in oblika kartice proizvajalca ne dopuščata približkov. Za AISOS pa uporablja n8n, ker agenti berejo koledar, e-pošto in naloge in pripravljajo osnutke, kar so tokovi, ki jih orodje brez programiranja opravi dobro.',
          ],
        },
        {
          title: 'Kaj priporoča AIS Slovenia',
          paragraphs: [
            'Začnite z orodjem brez programiranja povsod, kjer zadostuje, in ga zamenjajte tam, kjer začne odpovedovati: pri izjemah, količinah in sledljivosti. Obe poti sta lahko v istem podjetju, pomembno je le, da imata isto resnico o podatkih in ista pravila, kaj gre k človeku.',
          ],
        },
      ],
      compare: [
        { term: 'Vhod', definition: 'n8n in Make: strukturirani podatki iz aplikacij. Po meri: dokumenti, e-pošta, fotografije, karkoli.' },
        { term: 'Pravila', definition: 'n8n in Make: jasni koraki in pogoji. Po meri: pravila z izjemami, ocena zaupanja, predaja človeku.' },
        { term: 'Količina', definition: 'n8n in Make: do nekaj tisoč dogodkov na mesec brez težav. Po meri: brez omejitev, s testi.' },
        { term: 'Vmesnik', definition: 'n8n in Make: obstoječa orodja. Po meri: lasten vmesnik, portal, nadzorna plošča.' },
        { term: 'Kdo ureja', definition: 'n8n in Make: ekipa sama. Po meri: AIS Slovenia v mesečnem vzdrževanju.' },
      ],
      faq: [
        {
          q: 'Ali AIS Slovenia dela tudi z n8n in Make?',
          a: 'Da. Lastni agentni sistem AISOS teče na n8n, za stranke pa AIS Slovenia uporabi orodje brez programiranja povsod, kjer zadostuje, in sistem po meri tam, kjer ne.',
        },
        {
          q: 'Ali lahko sistem po meri gostujemo pri sebi?',
          a: 'Da, kadar podatki ne smejo zapustiti podjetja. Zasnova se prilagodi okolju stranke, vključno z lastnim strežnikom ali oblakom v EU.',
        },
        {
          q: 'Kaj se zgodi, ko orodje brez programiranja ne zmore več?',
          a: 'Tok se prenese v sistem po meri, brez prekinitve dela. AIS Slovenia to načrtuje vnaprej: podatki in pravila so že urejeni, zamenja se le izvedba.',
        },
      ],
    },
  ],
};
