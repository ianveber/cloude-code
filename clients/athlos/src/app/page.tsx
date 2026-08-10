import Link from "next/link";
import SiteNav from "@/components/marketing/SiteNav";
import SiteFooter from "@/components/marketing/SiteFooter";
import WaitlistForm from "@/components/marketing/WaitlistForm";
import PhoneFrame from "@/components/mock-app/PhoneFrame";
import AthleteTodayScreen from "@/components/mock-app/AthleteTodayScreen";
import "./landing.css";
import "@/components/marketing/waitlist.css";
import "@/components/mock-app/phone.css";
import "@/components/mock-app/screens.css";

export default function LandingPage() {
  return (
    <>
      <SiteNav active="landing" />

      <div className="surface-switcher" id="surf">
        <span className="mono lbl">SURFACE</span>
        <Link href="/" className="mono act">LANDING</Link>
        <Link href="/onboarding" className="mono">WEB · ONBOARDING</Link>
        <Link href="/app" className="mono">APP</Link>
      </div>

      <section className="hero" data-screen-label="01 Hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/hero-barbell.svg" alt="" className="hero-bg-img" />
        <div className="hero-overlay"></div>
        <div className="hero-grid"></div>
        <div className="land hero-inner">
          <div className="hero-text">
            <div className="hero-eyebrow">
              <span className="dot"></span>
              <span>Athlete Operating System · 2026</span>
            </div>
            <h1>
              THE&nbsp;SYSTEM<br />
              THAT&nbsp;KNOWS<br />
              <span className="accent">EVERY ATHLETE.</span>
            </h1>
            <p className="hero-sub">
              Personaliziran program fizične priprave za vsakega profesionalnega športnika — ne glede na poškodbe, sezono ali ovire. AI sistem, ki ga je verificiral strokovnjak.
            </p>
            <div className="hero-cta">
              <Link href="/onboarding" className="btn-xl primary">
                Začni 30-min onboarding
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M5 12h14m-6-6l6 6-6 6" /></svg>
              </Link>
              <Link href="/app" className="btn-xl ghost">Preglej demo app</Link>
            </div>

            <div className="hero-floating-tags">
              <div className="hero-tag">
                <span className="hero-tag-dot"></span>
                <div>
                  <div className="hero-tag-lbl">LIVE · HRV</div>
                  <div className="hero-tag-val">72ms</div>
                </div>
              </div>
              <div className="hero-tag">
                <div>
                  <div className="hero-tag-lbl">READINESS</div>
                  <div className="hero-tag-val accent">8.4 / 10</div>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-meta">
            <div className="hero-meta-item">
              <div className="num">294+</div>
              <div className="lbl">Verificiranih vaj</div>
            </div>
            <div className="hero-meta-item">
              <div className="num">24/7</div>
              <div className="lbl">AI asistent</div>
            </div>
            <div className="hero-meta-item">
              <div className="num">&lt;30<span style={{ fontSize: 22, color: "var(--muted)" }}>min</span></div>
              <div className="lbl">Do prvega treninga</div>
            </div>
            <div className="hero-meta-item">
              <div className="num">€29<span style={{ fontSize: 22, color: "var(--muted)" }}>/mes</span></div>
              <div className="lbl">Early bird — prvih 100</div>
            </div>
          </div>
        </div>
      </section>

      {/* PHONE SHOWCASE */}
      <section className="showcase" id="produkt-showcase">
        <div className="land showcase-inner">
          <div className="showcase-text">
            <div className="showcase-eyebrow">Pogled iz aplikacije</div>
            <h2>
              Vsako jutro veš<br />
              <span className="accent">točno kaj narediti.</span>
            </h2>
            <p>
              Readiness score, današnji trening, AI komentar zakaj je program prilagojen točno tako kot je. Brez ugibanja, brez generičnih nasvetov, brez izgovorov.
            </p>
            <ul className="showcase-features">
              <li>Readiness 0–10 generiran iz HRV, spanja, RPE in obremenitve</li>
              <li>Vaje s setji, ponovitvami in % maksimuma — pripravljeno za telovadnico</li>
              <li>AI razlaga, zakaj je danes deload ali kaj nadomesti vajo pri bolečini</li>
              <li>Trening starta z enim tapom — brez 20 ekranov klikanja</li>
            </ul>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Link href="/onboarding" className="btn-xl primary">
                Začni
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M5 12h14m-6-6l6 6-6 6" /></svg>
              </Link>
              <Link href="/science" className="btn-xl ghost">Kako deluje?</Link>
            </div>
          </div>

          <div className="showcase-phone">
            <PhoneFrame>
              <AthleteTodayScreen />
            </PhoneFrame>
          </div>
        </div>
      </section>

      <section className="section" id="produkt" data-screen-label="02 Problem">
        <div className="land">
          <div className="section-eyebrow">Problem</div>
          <h2 className="section-title">
            Profesionalni športnik nima<br />
            <span className="muted">dostopa do strokovne ekipe</span><br />
            <span className="accent">kot jo imajo veliki klubi.</span>
          </h2>

          <div className="problem-grid">
            <div className="problem-col good">
              <h3>Kar ima veliki klub</h3>
              <div className="sub">Status quo · Liga 1</div>
              <ul>
                <li><svg className="mark" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>Fizioterapevt + kinezolog + osebni trener</li>
                <li><svg className="mark" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>Personaliziran program za vsak položaj</li>
                <li><svg className="mark" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>Rehab protokol pri vsaki poškodbi</li>
                <li><svg className="mark" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>Sezonsko načrtovanje in periodizacija</li>
                <li><svg className="mark" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>Nutricistično vodenje</li>
              </ul>
            </div>
            <div className="problem-col bad">
              <h3>Kar ima povprečni športnik</h3>
              <div className="sub">Realnost · vsi ostali</div>
              <ul>
                <li><svg className="mark" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>YouTube vadbe in generični plani</li>
                <li><svg className="mark" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>Intuicija in lastne izkušnje</li>
                <li><svg className="mark" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>Ni strukturiranega okrevanja</li>
                <li><svg className="mark" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>Ni sezonske periodizacije</li>
                <li><svg className="mark" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>Ni nutricističnega vodenja</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="strokovnjak" data-screen-label="03 Strokovnjak">
        <div className="land">
          <div className="section-eyebrow">Strokovnjak za sistemom</div>
          <h2 className="section-title">Za vsakim programom<br /><span className="accent">stoji človek.</span></h2>

          <div className="expert">
            <div className="expert-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/hero-athlete.svg" alt="Tim Drenovc" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", borderRadius: 22 }} />
              <div className="placeholder" style={{ position: "absolute", bottom: 16, left: 16, right: 16, background: "rgba(10,10,10,0.7)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "12px 14px", display: "flex", flexDirection: "row", alignItems: "center", gap: 10, justifyContent: "flex-start", zIndex: 2 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 0 4px rgba(0,255,135,0.18)" }}></div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.16em", color: "var(--text-2)" }}>FOTO V PRIPRAVI</div>
              </div>
            </div>
            <div>
              <h3>TIM<br />DRENOVC</h3>
              <div className="role">Fiziolog · Osebni trener · Avtor protokolov</div>
              <p className="quote">
                &ldquo;ATHLOS ne zdravi poškodb. Poskrbi, da trening med okrevanjem ne poškoduje napredka.&rdquo;
              </p>
              <p className="desc">
                Verificira celotno bazo <strong style={{ color: "var(--accent)" }}>294+ vaj</strong>. Avtor rehab in prehab protokolov.
                Strokovni nadzor nad AI sistemom — vsako priporočilo, ki ga AI naredi, je preverjeno proti njegovim protokolom.
              </p>
              <Link href="/tim" className="btn-xl ghost" style={{ marginTop: 16, fontSize: 13 }}>
                Spoznaj Tima
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M5 12h14m-6-6l6 6-6 6" /></svg>
              </Link>
            </div>
          </div>

          <div className="disclaimer">
            <div className="icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 9v4M12 17h.01" /><path d="M10.3 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
            </div>
            <p>
              <strong>Pomemben disclaimer.</strong> ATHLOS ne nadomešča fizioterapevtske ali zdravniške obravnave. Program je orientacijski in temelji na vprašalniku ter fizičnem testu — za diagnozo in zdravljenje poškodb obišči strokovnjaka.
            </p>
          </div>
        </div>
      </section>

      <section className="section" data-screen-label="04 Funkcionalnosti">
        <div className="land">
          <div className="section-eyebrow">Produkt</div>
          <h2 className="section-title">Vse, kar profesionalec<br /><span className="accent">potrebuje.</span> Na enem mestu.</h2>

          <div className="features">
            <div className="feature">
              <div className="feature-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" /></svg>
              </div>
              <div className="feature-num">01 · CORE</div>
              <h4>AI Personalizacija</h4>
              <p>Program ekskluzivno za tvoj šport, telo in sezono. Generiran iz vprašalnika in <strong>fizičnega testa</strong>. Ne template, ne kopija.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" /></svg>
              </div>
              <div className="feature-num">02 · CORE</div>
              <h4>Zasebni sezonski koledar</h4>
              <p>Vneseš tekme — AI prilagodi intenzivnost za vsak dan. -3D deload, -1D mobilnost, +1D recovery. Avtomatsko.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
              </div>
              <div className="feature-num">03 · CORE</div>
              <h4>AI asistent 24/7</h4>
              <p>Javiš bolečino — AI ne izloči vaje, ampak zamenja z varianto, ki <strong>aktivno podpira okrevanje</strong>. VMO Squat, Glute Bridge, Face Pull.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M7 2v8a2 2 0 002 2v10M7 2v6m10-6v6a3 3 0 11-6 0V2" /></svg>
              </div>
              <div className="feature-num">04 · CORE</div>
              <h4>Nutricistični plan</h4>
              <p>Jedilnik, makri, suplementi. Prilagojeno fazi treninga in telesni teži. Carb loading pred tekmo, anti-inflammatory v rehabu.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg>
              </div>
              <div className="feature-num">05 · PRO</div>
              <h4>Video analiza — Gemini AI</h4>
              <p>Posnameš vajo s telefonom (30s), Gemini 1.5 Pro analizira hrbtenico, kolena, globino. Pove kaj delaš narobe — v slovenščini.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
              </div>
              <div className="feature-num">06 · PRO</div>
              <h4>Daily Performance Report</h4>
              <p>Po vsakem treningu: primerjava, grafi, AI analiza. Biometrija iz Apple Health — HRV, spanje, recovery score. Izgine v 24h.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="cene" data-screen-label="05 Cene">
        <div className="land">
          <div className="section-eyebrow">Cenik</div>
          <h2 className="section-title">
            Plačaš sistem,<br />
            <span className="accent">ne ure trenerja.</span>
          </h2>
          <p className="section-sub">Prvih 100 strank dobi early bird ceno za vedno. Grandfather clause — cena ne raste, dokler si naročnik.</p>

          <div className="pricing">
            <div className="price-card">
              <div>
                <div className="name">BASIC</div>
                <div className="desc">Sistem dela zate.</div>
              </div>
              <div>
                <div className="price-amount">
                  <span className="num faded">€29</span>
                  <span className="per">/MES</span>
                </div>
                <div className="price-strike">redno €49/mes</div>
              </div>
              <div className="price-early">EARLY BIRD · PRVIH 100</div>
              <ul className="price-feats">
                <li><svg className="ck" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>AI program + jedilnik</li>
                <li><svg className="ck" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>Zasebni sezonski koledar</li>
                <li><svg className="ck" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>AI asistent 24/7</li>
                <li><svg className="ck" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>Dnevni log + history view</li>
                <li><svg className="ck" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>Community (opcijsko)</li>
                <li className="off"><svg className="ck" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>Daily Performance Report</li>
                <li className="off"><svg className="ck" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>Video analiza</li>
                <li className="off"><svg className="ck" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>Biometrija</li>
              </ul>
              <Link href="/onboarding?plan=basic" className="price-cta ghost">Izberi Basic</Link>
            </div>

            <div className="price-card featured">
              <div className="price-tag">MOST POPULAR</div>
              <div>
                <div className="name">PRO</div>
                <div className="desc">Sistem te analizira.</div>
              </div>
              <div>
                <div className="price-amount">
                  <span className="num">€59</span>
                  <span className="per">/MES</span>
                </div>
                <div className="price-strike">redno €99/mes</div>
              </div>
              <div className="price-early">EARLY BIRD · PRVIH 100</div>
              <ul className="price-feats">
                <li><svg className="ck" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>Vse iz Basic</li>
                <li><svg className="ck" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg><strong style={{ color: "var(--text)" }}>Daily Performance Report</strong></li>
                <li><svg className="ck" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>Biometrija (Apple Health)</li>
                <li><svg className="ck" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>Video analiza — 10/mes</li>
                <li><svg className="ck" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>Post-match recovery protokol</li>
                <li className="off"><svg className="ck" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>Tedenska AI analiza</li>
                <li className="off"><svg className="ck" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>Ekskluzivni Tim content</li>
              </ul>
              <Link href="/onboarding?plan=pro" className="price-cta primary">Izberi Pro</Link>
            </div>

            <div className="price-card">
              <div className="price-tag" style={{ background: "var(--surface-3)", color: "var(--muted)" }}>OPCIJSKO</div>
              <div>
                <div className="name">ELITE</div>
                <div className="desc">Sistem te pozna.</div>
              </div>
              <div>
                <div className="price-amount">
                  <span className="num faded">€89</span>
                  <span className="per">/MES</span>
                </div>
                <div className="price-strike">redno €149/mes</div>
              </div>
              <div className="price-early">V RAZVOJU · WAITLIST</div>
              <ul className="price-feats">
                <li><svg className="ck" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>Vse iz Pro</li>
                <li><svg className="ck" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>Video analiza — neomejeno</li>
                <li><svg className="ck" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>Tedenska AI analiza napredka</li>
                <li><svg className="ck" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>Ekskluzivni Tim Drenovc content</li>
                <li><svg className="ck" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>Early access nove funkcije</li>
              </ul>
              <Link href="/onboarding?plan=elite" className="price-cta ghost">Pridruži se waitlistu</Link>
            </div>
          </div>

          {/* WAITLIST BANNER */}
          <div className="waitlist-banner">
            <div className="waitlist-banner-text">
              <div className="waitlist-banner-eyebrow">Še nisi pripravljen?</div>
              <h3>Dobi early bird ceno preden je prepozno.</h3>
              <p>
                ATHLOS lansira jeseni 2026. Prvih 100 strank na waitlistu dobi €29/mes za vedno — €240 prihranka na leto.
                Brez kreditne kartice. Redni nasveti za pripravo + povabilo ob lansiranju. Odjava kadarkoli.
              </p>
            </div>
            <div className="waitlist-banner-form">
              <WaitlistForm variant="banner" source="landing-pricing" />
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="klubi" data-screen-label="06 Klubi">
        <div className="land">
          <div className="section-eyebrow">Team paket</div>
          <h2 className="section-title">En sistem<br />za <span className="accent">cel roster.</span></h2>
          <p className="section-sub">Trener vidi celoten program vsakega igralca, vse AI spremembe in lahko ročno popravi karkoli. Brez skupinskih ali 1:1 klicev — ATHLOS je orodje, ne coaching storitev.</p>

          <div className="team-table">
            <div className="team-row head">
              <div className="col-1">Velikost ekipe</div>
              <div className="col-2">Mesečno</div>
              <div className="col-3">Letno (–2 mes)</div>
              <div className="col-4">Cena / športnik</div>
            </div>
            <div className="team-row">
              <div className="col-1">Do 10 športnikov</div>
              <div className="col-2 price">€399/mes</div>
              <div className="col-3 price">€3.990</div>
              <div className="col-4 per-sp">€39 / sp.</div>
            </div>
            <div className="team-row">
              <div className="col-1">Do 20 športnikov</div>
              <div className="col-2 price">€699/mes</div>
              <div className="col-3 price">€6.990</div>
              <div className="col-4 per-sp">€34 / sp.</div>
            </div>
            <div className="team-row">
              <div className="col-1">Do 30 športnikov</div>
              <div className="col-2 price">€999/mes</div>
              <div className="col-3 price">€9.990</div>
              <div className="col-4 per-sp">€33 / sp.</div>
            </div>
            <div className="team-row">
              <div className="col-1">Do 50 športnikov</div>
              <div className="col-2 price">€1.499/mes</div>
              <div className="col-3 price">€14.990</div>
              <div className="col-4 per-sp">€30 / sp.</div>
            </div>
            <div className="team-row">
              <div className="col-1">50+ športnikov</div>
              <div className="col-2 price" style={{ color: "var(--accent)" }}>Po dogovoru</div>
              <div className="col-3 price">—</div>
              <div className="col-4 per-sp">—</div>
            </div>
          </div>

          <div style={{ marginTop: 28, textAlign: "center" }}>
            <Link href="/klubi" className="btn-xl ghost" style={{ fontSize: 13 }}>
              Več o team paketu
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M5 12h14m-6-6l6 6-6 6" /></svg>
            </Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="land">
          <div className="cta-final">
            <div className="section-eyebrow" style={{ position: "relative" }}>Pod 30 minut do prvega treninga</div>
            <h2>NEHAJ UGIBATI.<br /><span className="accent">ZAČNI MERITI.</span></h2>
            <p>Registracija → plan → plačilo → vprašalnik → fizični test → tvoj program.</p>
            <Link href="/onboarding" className="btn-xl primary">
              Začni 30-min onboarding
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M5 12h14m-6-6l6 6-6 6" /></svg>
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
