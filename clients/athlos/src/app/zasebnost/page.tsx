import SiteNav from "@/components/marketing/SiteNav";
import SiteFooter from "@/components/marketing/SiteFooter";
import "../landing.css";

export const metadata = {
  title: "ATHLOS — Politika zasebnosti",
  description:
    "Kako ATHLOS zbira, uporablja in varuje tvoje osebne podatke ob prijavi na waitlist. Tvoje pravice po GDPR in kako se odjaviš.",
};

// TODO (Ian): pred večjo promocijo daj politiko v pravni pregled in dopolni
// formalni pravni subjekt (upravljavca) spodaj. Trenutno je pre-launch verzija.

const UPDATED = "4. junij 2026";

export default function PrivacyPage() {
  return (
    <>
      <SiteNav />
      <main className="section" style={{ paddingTop: 140 }}>
        <div className="land" style={{ maxWidth: 760 }}>
          <div className="section-eyebrow">Pravno</div>
          <h1 className="section-title" style={{ marginBottom: 8 }}>
            Politika zasebnosti
          </h1>
          <p
            style={{
              color: "var(--muted)",
              fontFamily: "var(--mono)",
              fontSize: 12,
              letterSpacing: "0.08em",
              marginBottom: 36,
            }}
          >
            ZADNJA POSODOBITEV: {UPDATED}
          </p>

          <div
            style={{ color: "var(--text-2)", fontSize: 15, lineHeight: 1.75 }}
          >
            <p>
              Ta politika pojasnjuje, kako ATHLOS ravna s tvojimi osebnimi
              podatki, ko se prijaviš na naš waitlist. Zbiramo le tisto, kar
              potrebujemo, in nikoli ne prodajamo tvojih podatkov.
            </p>

            <Section title="1. Kdo upravlja tvoje podatke">
              Upravljavec osebnih podatkov je <strong>ATHLOS</strong> (pravni
              subjekt v ustanavljanju). Za vsa vprašanja glede zasebnosti smo
              dosegljivi na{" "}
              <a href="mailto:hello@athlos.si">hello@athlos.si</a>.
            </Section>

            <Section title="2. Katere podatke zbiramo">
              Ob prijavi na waitlist zbiramo:
              <ul>
                <li>tvoj <strong>e-poštni naslov</strong>;</li>
                <li>
                  tehnične podatke prijave: vir (katera stran/CTA te je
                  pripeljala), UTM oznake, čas prijave in tvoje soglasje;
                </li>
                <li>
                  če se kdaj naročiš (ob lansiranju): podatke o naročnini in
                  plačilu, ki jih obdela Stripe — kartični podatki se ne
                  shranjujejo na ATHLOS strežnikih.
                </li>
              </ul>
            </Section>

            <Section title="3. Zakaj jih zbiramo in pravna podlaga">
              Tvoj e-naslov uporabljamo, da ti pošljemo potrditev prijave
              (dvojni opt-in), občasne nasvete za pripravo in novico, ko
              aplikacija izide. Pravna podlaga je tvoja{" "}
              <strong>privolitev</strong> (člen 6(1)(a) GDPR), ki jo daš s
              potrditvijo polja ob prijavi in s klikom na potrditveno povezavo v
              e-pošti. Privolitev lahko kadarkoli prekličeš.
            </Section>

            <Section title="4. Komu posredujemo podatke (obdelovalci)">
              Podatkov ne prodajamo. Za delovanje uporabljamo zaupanja vredne
              obdelovalce, ki podatke obdelujejo izključno v našem imenu:
              <ul>
                <li>
                  <strong>Beehiiv</strong> — pošiljanje e-pošte in vodenje
                  naročnikov;
                </li>
                <li>
                  <strong>Google</strong> (Google Sheets) — interni seznam
                  prijav;
                </li>
                <li>
                  <strong>Supabase</strong> — varna shramba podatkov;
                </li>
                <li>
                  <strong>Stripe</strong> — obdelava plačil (šele ob lansiranju).
                </li>
              </ul>
              Nekateri ponudniki lahko podatke obdelujejo zunaj EU (npr. ZDA);
              v tem primeru se prenos izvaja na podlagi standardnih pogodbenih
              klavzul (SCC) Evropske komisije.
            </Section>

            <Section title="5. Kako dolgo jih hranimo">
              Tvoj e-naslov hranimo, dokler si naročen oziroma dokler ne
              prekličeš privolitve ali se ne odjaviš. Po odjavi podatke v
              razumnem roku izbrišemo ali anonimiziramo, razen kjer nas k
              hrambi zavezuje zakon.
            </Section>

            <Section title="6. Tvoje pravice">
              Po GDPR imaš pravico do:
              <ul>
                <li>dostopa do svojih podatkov in njihove kopije;</li>
                <li>popravka netočnih podatkov;</li>
                <li>izbrisa (&bdquo;pravica do pozabe&ldquo;);</li>
                <li>omejitve ali ugovora obdelavi;</li>
                <li>prenosljivosti podatkov;</li>
                <li>preklica privolitve kadarkoli.</li>
              </ul>
              Za uveljavljanje pravic nam piši na{" "}
              <a href="mailto:hello@athlos.si">hello@athlos.si</a>. Pritožbo
              lahko vložiš tudi pri Informacijskem pooblaščencu RS
              (www.ip-rs.si).
            </Section>

            <Section title="7. Odjava">
              Od e-pošte se lahko odjaviš kadarkoli prek povezave na dnu vsakega
              sporočila. Odjava velja takoj — brez vprašanj.
            </Section>

            <Section title="8. Piškotki">
              Stran za prijavo ne uporablja oglaševalskih piškotkov. Če v
              prihodnje dodamo analitiko, bomo to politiko posodobili in te po
              potrebi prosili za soglasje.
            </Section>

            <Section title="9. Spremembe te politike">
              Politiko lahko občasno posodobimo. Ob pomembnih spremembah te
              bomo obvestili po e-pošti ali na tej strani. Datum zadnje
              posodobitve je naveden na vrhu.
            </Section>

            <Section title="10. Kontakt">
              Vprašanja o zasebnosti?{" "}
              <a href="mailto:hello@athlos.si">hello@athlos.si</a>
            </Section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: 28 }}>
      <h2
        style={{
          fontFamily: "var(--display)",
          fontSize: 17,
          fontWeight: 800,
          color: "var(--text)",
          letterSpacing: "0.01em",
          marginBottom: 8,
        }}
      >
        {title}
      </h2>
      <div>{children}</div>
    </section>
  );
}
