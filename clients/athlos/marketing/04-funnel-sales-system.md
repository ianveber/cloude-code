# ATHLOS — Funnel & Sales System (organic, waitlist → MVP launch)

> Strategy in English. Every asset (opt-in copy, emails, DMs, CTAs) in native Slovenian.
> Lens: Iman Gadzhi's **No-Leak Backend**, **Flywheel VSL**, **value ladder / price anchoring**, **disqualification positioning**, **retention engineering** — each adapted to Ian's real constraints: near-zero audience, solo/tiny team, ~a dozen Beehiiv subs, small Slovenian market, 100% organic, 30 days to MVP.

---

## 0. The blind-spot check up front (read this before anything else)

Iman's funnel math assumes he pours **millions of monthly views** into the top. His "record one VSL, it makes $20M" story only works because 250M+ short-form views/month and 30+ feeder accounts sit above it. **Ian has none of that yet.** So the honest reframing of this whole document:

- **The funnel is real, but the top is a trickle, not a firehose.** With ~12 subs and a cold audience, the launch does **not** live or die on new cold traffic in 30 days. It lives on **(a) waking up the warm list, (b) converting the founder's own network + DMs by hand, and (c) whatever organic content adds on top.** Cold content is the *seed for month 2–6*, not the engine for launch day.
- **Iman automates because he has volume to justify automation. Ian does the opposite for launch: he goes MANUAL where it converts.** At a dozen leads, a personal DM outconverts any automated email. Iman himself says "WhatsApp controls behavior" — at Ian's scale, *every* lead is worth a personal message. Automate the plumbing (Beehiiv sequence, Stripe, abandonment), but do the closing by hand.
- **Numbers to be sober about.** If the warm list is ~12 and Ian grows it to, realistically, **80–200 leads in 30 days** with hard organic work (see §2.4), a *good* warm-launch converts **5–12%** to a paid MVP tier. That's **~5–20 paying founding members in month 1.** That is a *success* for a solo organic cold-start — not a failure. Ian should set his own expectation there and not measure himself against Iman's launch screenshots.

Everything below is engineered so that **not one of those 5–20 leaks** — because at this volume, every single lead is worth catching.

---

## 1. The full funnel map (No-Leak Backend, adapted)

Iman's principle: at every stage a qualified lead can leak out, and a backend system must catch it. Below is the ATHLOS funnel with the **mechanism** at each step, the **leak**, and the **catch**.

```
                          ┌─────────────────────────────────────────────┐
   STAGE 0 — COLD VIEWER  │  IG Reel / YT Short / YT long-form           │
   (stranger, no relation)│  Mechanism: hook → value → 1 CTA ("link v    │
                          │  biju: brezplačen načrt")                    │
                          └───────────────┬─────────────────────────────┘
        LEAK: watches, feels good, scrolls on, never clicks.
        CATCH: (Intentional Brand) every piece is reverse-engineered from ONE CTA
               → the free lead magnet. No "just vibes" posts. Pinned comment +
               link-in-bio both point to the SAME opt-in page. (Micro-Channel)
                                          │
                                          ▼
                          ┌─────────────────────────────────────────────┐
   STAGE 1 — FOLLOWER     │  Follows IG (personal + @athlos) / subs YT   │
   (warm-ish, in orbit)   │  Mechanism: 3:1 growth-to-nurture content    │
                          │  keeps them in the feed until they opt in    │
                          └───────────────┬─────────────────────────────┘
        LEAK: follows but never joins the list — you don't own the relationship,
              the algorithm does. One shadow-ban and they're gone.
        CATCH: (No-Leak) convert followers → owned email ASAP. Every 4th–5th post
               and every Story block ends in the lead-magnet CTA. Story "link
               sticker" + "Zbriši, ko ne rabiš več" DM-keyword trigger.
                                          │
                                          ▼
                          ┌─────────────────────────────────────────────┐
   STAGE 2 — LEAD         │  Joins Beehiiv waitlist via opt-in page      │
   (owned email — the     │  Mechanism: free value drop (Tim's mini-     │
    core conversion)      │  protokol) delivered on double opt-in        │
                          └───────────────┬─────────────────────────────┘
        LEAK #1: signs up, never confirms double opt-in → stuck "pending", never
                 gets a single email. THIS IS THE #1 SILENT LEAK on your current
                 setup (Beehiiv double_opt_override is ON).
        CATCH: confirmation-nudge. If not confirmed in 24h → automated "Potrdi
               svoj e-mail, da dobiš načrt" resend. Google Sheet already logs
               pending vs confirmed — watch that column daily and DM stragglers
               you know personally.
        LEAK #2: confirms, downloads guide, goes cold before launch.
        CATCH: the 30-day nurture/story sequence (§4b) — keep them warm.
                                          │
                                          ▼
                          ┌─────────────────────────────────────────────┐
   STAGE 3 — NURTURED     │  Reads emails, watches the VSL, replies,      │
   (trusts Ian + Tim,     │  is in the "early-bird 100" mental frame      │
    knows the offer)      │  Mechanism: story sequence + YouTube VSL      │
                          └───────────────┬─────────────────────────────┘
        LEAK: warm but undecided when cart opens — "maybe later."
        CATCH: (Price Anchoring + Disqualification + Scarcity) first-100 early-bird
               lock-for-life, hard cap, launch-window close. Manual DM to every
               engaged lead who opened but didn't buy.
                                          │
                                          ▼
                          ┌─────────────────────────────────────────────┐
   STAGE 4 — MVP BUYER    │  Buys a tier (€29 / €59 / €89) via Stripe     │
   (paying founding member)│ Mechanism: launch email → sales page →       │
                          │  Stripe Checkout → app onboarding             │
                          └───────────────┬─────────────────────────────┘
        LEAK #1: clicks "kupi", opens Stripe, doesn't finish.
        CATCH: abandonment follow-up (§5) — Stripe Checkout abandonment email +
               personal DM within a few hours ("videl sem, da si skoraj notri…").
        LEAK #2: buys, never activates in-app → churns fast.
        CATCH: onboarding within minutes → first AI plan generated same session
               (activation = first workout plan in hand).
                                          │
                                          ▼
                          ┌─────────────────────────────────────────────┐
   STAGE 5 — RETAINED     │  Stays subscribed month 2+ / upgrades / annual│
   (recurring revenue —   │  Mechanism: retention engineering + failed-  │
    where the profit is)  │  payment recovery                             │
                          └─────────────────────────────────────────────┘
        LEAK #1: card fails / renews and bounces → silent involuntary churn.
        CATCH: Stripe Smart Retries + dunning emails (§6). Iman: 50% recovery vs
               5% industry — this is pure found money.
        LEAK #2: voluntary churn — "nisem ga uporabljal."
        CATCH: week-1 activation + a founding-member ritual (§6).
```

**The one-sentence version of the whole machine:** content points at ONE free guide → the guide converts a follower into an owned email → 30 days of Slovenian story-nurture + a YouTube VSL build trust → a hard-capped first-100 early-bird cart opens → Stripe checkout with manual DM backup → retention + dunning keeps the subscription alive. No step relies on volume Ian doesn't have; every step relies on Ian *personally catching leaks* at a scale one human can still handle.

---

## 2. Lead capture — the waitlist as the core lead magnet

### 2.1 The reframe (Optimize for leads, not views)
Right now the "waitlist" is a bare email field with no reason to join beyond "get notified at launch." That's a weak magnet — "get notified" is not a benefit, it's a chore. **The waitlist must give something valuable the instant you join.** (Iman: free leads behave like free — so make the free thing *feel* like a real product.)

### 2.2 The opt-in offer — a genuine free value drop from Tim
Recommended magnet (pick ONE, don't dilute):

> **"7-dnevni ATHLOS Starter — brezplačen mikro-protokol za tvoj šport"**
> A real, usable 7-day training micro-protocol authored by Tim Drenovc, delivered as a clean PDF, PLUS a 60-second self-assessment ("Kje si zdaj?") that tells them which of Tim's phases they're in.

Why this specific magnet:
- **It's a slice of the actual product**, not a generic freebie. It proves the app's core value (personalized, Tim-verified training) before anyone pays. This is the honest version of Iman's "documentation before education" — you're giving away one real workout week.
- **It's cheap to produce** — you already have Tim's periodization + exercise database in the Coach brain. Generate 3–4 sport-specific variants (nogomet, košarka, atletika/moč, borilne) so the magnet feels personalized to the biggest Slovenian sports. The Coach chatbot can literally generate the base of each.
- **The assessment creates a segmentation tag** you can use in the nurture sequence (per-sport, per-level emails later).

**Adjusted for Ian's reality:** Iman would build a whole free 5-day livestream challenge with a $250K prize pool. Ian can't and shouldn't. The PDF + assessment is the right-sized equivalent — high perceived value, ~zero marginal cost, deliverable by one person.

### 2.3 Freshening the existing Beehiiv list (~12 subs)
The current dozen are the most valuable people you have — they raised their hand earliest. Don't treat them as dead. Steps:

1. **Clean the pending pile first.** Because double opt-in is ON, some of the 12 may be stuck "pending" and have never received anything. Check the Google Sheet `status` column. Anyone pending → send the confirmation-nudge (§4a email 0) or, if Ian knows them personally, a manual DM/text: *"Ej, prijavil si se na ATHLOS listo — potrdi mail (klikni link), da ti pošljem Timov 7-dnevni načrt."*
2. **Re-permission + re-engage the confirmed.** They signed up for "notify me," not for a weekly newsletter — so re-open the relationship honestly with the re-engagement sequence (§4a). Lead with the new free guide as a gift ("hvala, ker si bil zraven od začetka — tu je tvoj načrt").
3. **Ask the 12 for one thing each: a reply.** A reply is the strongest possible signal to Beehiiv deliverability AND gives Ian a warm 1:1 thread to close later. The re-engagement email ends with a genuine question, not a link.
4. **Turn them into the first micro-referral loop.** These 12, if they each bring one training partner, doubles the warm list at zero cost (see §2.4).

### 2.4 Growing the list fast, organically, in 30 days (the honest engine)
This is where the blind-spot check bites hardest. Ian will not get thousands of leads from cold Reels in 30 days. Realistic organic list-growth levers, in priority order:

1. **Founder's own network, mined by hand (biggest lever week 1).** Ian personally DMs/texts every athlete, coach, gym contact, and training partner he knows: *"Gradim ATHLOS — Timov trening kot app. Dam ti brezplačen 7-dnevni načrt, samo pošlji mi šport."* This is not scalable and that's fine — at launch scale you don't need scalable, you need 50–100 real humans. Target: 40–80 leads from Ian's warm graph alone.
2. **Tim's audience.** Tim is the expert face and presumably has athletes/clients/followers. One post/story from Tim ("delam na tem, dobi zgodnji dostop + brezplačen načrt") is worth more than 20 of Ian's cold Reels. Negotiate this explicitly — it's the single highest-ROI growth move available.
3. **The referral loop on the magnet itself.** Beehiiv has a native referral/recommendation feature. Wire it: "Deli s soigralcem → oba dobita bonus protokol." A team sport audience shares within a locker room naturally.
4. **Organic content → link-in-bio, every single post.** IG Reels + YT Shorts with a hard CTA to the guide. Expect this to add a *slow* trickle (single digits to low tens over 30 days from a cold start) — it's real but it's the *smallest* of the four levers this month. Its job is to seed month 2+, not carry launch.
5. **Slovenian sport communities.** Post the free guide (as value, not spam) in relevant FB groups / Discord / team chats where Ian is a legitimate member. One well-placed value drop in a Slovenian nogomet/fitness group can outperform a week of cold Reels.

**Target for launch day: ~80–200 confirmed leads.** If Ian hits the low end, launch is still viable (5–15 buyers). Do NOT delay launch waiting for a bigger list — a warm 80 converts better than a cold 800.

### 2.5 Opt-in page copy (Slovenian)

> **Nadnaslov (mono/label):** BREZPLAČNO · TIM DRENOVC PROTOKOL
>
> # Dobi svoj 7-dnevni načrt. Brezplačno.
>
> Ne generičen program s spleta — pravi 7-dnevni mikro-protokol, ki ga je napisal Tim Drenovc za tvoj šport. Isti sistem, ki poganja ATHLOS.
>
> **V 60 sekundah izveš:**
> - v kateri fazi priprave si zdaj (kratek test)
> - kaj natančno trenirati naslednjih 7 dni — serije, ponovitve, cueji
> - kje delaš največjo napako, ki te ustavlja
>
> Vpiši svoj šport in e-mail. Načrt dobiš takoj po potrditvi.
>
> **[ Šport ▾ ]  [ Tvoj e-mail ]  [ POŠLJI MI NAČRT → ]**
>
> ☐ Strinjam se, da mi ATHLOS pošlje načrt in občasne nasvete za pripravo. Odjava kadarkoli. [Zasebnost]
>
> *Redni nasveti za pripravo + prvi vstop, ko odpremo. Brez spama. Odjava z enim klikom.*
>
> ---
> *Med prvih 100, ki vstopijo, zaklene ceno za vedno.* ← (early-bird tease, seeds §3)

**Note on the consent line:** it already matches the GDPR-corrected copy in the ATHLOS memory (`Redni nasveti … Odjava kadarkoli`) — keep it consistent so it doesn't contradict the weekly sends.

---

## 3. The value ladder (Price Anchoring + Disqualification)

Iman's ascension ladder is $37/mo front-end → $2K → high-ticket. Ian's is a **subscription-only B2C ladder** — simpler, and that's correct for the market. The ladder:

```
   RUNG 0 — FREE          7-dnevni Starter protokol + assessment (the lead magnet)
                          Job: prove value, capture email, segment by sport.
        │
        ▼
   RUNG 1 — WAITLIST      Free membership on the list. Founding-member frame.
                          Job: own the relationship, nurture, promise early-bird.
        │
        ▼
   RUNG 2 — EARLY-BIRD    First 100 lock lifetime early-bird pricing:
   MVP (the launch)         • BASIC  €29/mes  (reg €49)
                            • PRO    €59/mes  (reg €99)
                            • ELITE  €89/mes  (reg €149)   [waitlist-only tier]
                          Job: convert nurtured leads into paying founders.
        │
        ▼
   RUNG 3 — RETENTION /   Stay subscribed / upgrade tier / go annual (2 meseca gratis)
   ANNUAL                 Job: recurring profit — where subscription money actually is.
```

### 3.1 Anchoring the €29–89 (Price Anchoring)
Every price is shown **against its crossed-out regular price** — never bare:

> ~~€49~~ **€29/mes** · zaklenjeno za vedno
> ~~€99~~ **€59/mes** · zaklenjeno za vedno
> ~~€149~~ **€89/mes** · samo za listo

The strike-through does the anchoring work Iman uses ($1,499 vs "$4,500"). The *real* anchor, though, is the **human alternative**: put ATHLOS next to what a live strokovna ekipa costs.

> **Kaj to nadomesti:**
> Osebni trener + kineziolog + fizioterapevt = **€200–500+ / mesec** v Sloveniji.
> ATHLOS: cel sistem, 24/7, od **€29 / mesec.**

That contrast makes €29 feel almost free — it reframes the price against the €200–500 real-world stack, exactly the ATHLOS thesis ("every athlete deserves the strokovna ekipa … as an AI system"). **This is a stronger anchor than the strike-through** and should be the hero of the pricing section.

### 3.2 The first-100 early-bird (Scarcity + Disqualification)
- **Hard cap at 100, and mean it.** A visible counter ("ostane še 63 mest") that actually decrements. Iman's scarcity is often fake; Ian's should be *real* — it's more credible AND it protects margins/support load at MVP stage where over-selling a fragile v1 is a risk.
- **Lock-for-life = the reason to act NOW.** "Prvih 100 zaklene ceno za vedno" turns the launch window into a genuine now-or-never. This is the honest version of Iman's countdown timers.
- **Disqualification positioning** (adapted): don't disqualify by income like Iman — disqualify by *seriousness*. It raises perceived value and pre-qualifies:
  > **ATHLOS ni za vsakogar.** Ni čarobna tabletka in ni za tiste, ki iščejo "30-dnevni izziv za trebušnjake". Je za športnike in resne rekreativce, ki hočejo trenirati kot profesionalci — sistematično, merljivo, brez ugibanja. Če to nisi ti, ta lista ni zate.

  This single paragraph makes the people who *do* fit feel chosen, and filters out low-fit, high-churn buyers before they cost you support time.

### 3.3 Tier steering
Don't let people default to the cheapest by accident. On the sales page, **make PRO (€59) the visually "priporočeno" middle** (classic decoy/center-stage) — BASIC anchors low, ELITE (€89, waitlist-only) anchors high and flatters PRO into looking like the sane choice. ELITE being *waitlist-exclusive* is itself a reward for being on the list early.

---

## 4. The email / nurture sequence (Beehiiv, Slovenian)

Three sequences, **13 emails total**. All in Beehiiv. Keep them short, personal, founder-voice — not corporate newsletter. Ian writes as himself, "od Iana."

Sending identity: **from Ian, personal** ("Ian iz ATHLOS-a"), reply-to a real inbox Ian reads. Replies are the goal — they're the warmest close signal at this scale.

---

### 4a. RE-ENGAGEMENT sequence — wake the existing ~12 (send FIRST, week 1)
Goal: reactivate the dormant list, deliver the new free guide as a gift, get replies, re-permission.

**Email R0 — (only to `pending`) "Potrdi in dobi Timov načrt"**
Subject: `Manjka samo en klik (in načrt je tvoj)`
Body: You signed up but never confirmed. Click to confirm → your free 7-day plan lands immediately. One button. (Fixes the #1 silent leak.)

**Email R1 — "Hvala, ker si bil zraven od začetka"**
Subject: `Bil si med prvimi. Tu je darilo.`
Body: Warm, honest. "Prijavil si se na ATHLOS zgodaj — hvala. Nisem ti pošiljal nič, ker sem gradil. Zdaj je skoraj tu. Za začetek: tvoj brezplačen 7-dnevni Timov načrt →." One CTA to the guide. Sets the founding-member frame.

**Email R2 — "Za kaj se sploh gre" + a question**
Subject: `Zakaj sem sploh začel graditi ATHLOS`
Body: 4–5 sentences of the origin/why (the "THE JOURNEY" spine). End with a direct question that begs a reply: *"Kateri šport treniraš in kaj te zdaj najbolj ustavlja? Odgovori mi — berem vsak mail."* Reply = deliverability + warm thread.

---

### 4b. PRE-LAUNCH nurture / story sequence — the 30 days (to whole list)
Goal: build trust in Ian + Tim, seed the offer, so the cart open lands on warm, primed leads. Roughly 1 email every 4–5 days. Content spine = "THE JOURNEY."

**Email N1 — Welcome / deliver the magnet (instant on confirm)**
Subject: `Tvoj 7-dnevni načrt (odpri) 🏛️`
Body: Deliver the PDF + assessment link. Set expectations: "Naslednjih par tednov ti pošljem, kako to nadgradiš v cel sistem. Če ne bereš, se odjavi — brez zamere." (Honest, filters.)

**Email N2 — The problem, named (Problem Farming)**
Subject: `Zakaj večina športnikov trenira narobe`
Body: The core pain — generic programs, no periodization, guessing. Position Tim's system as the fix. No pitch yet. Teach one real thing (a periodization insight from the brain) so it's pure value.

**Email N3 — The expert (trust transfer to Tim)**
Subject: `Kdo je Tim in zakaj mu zaupam svoje treninge`
Body: Tim's credibility — fiziolog, protokoli, 294+ vaj baza, dela z realnimi športniki. Trust flows from Tim to the app. Maybe a short Tim quote/clip.

**Email N4 — Build-in-public / the app is real**
Subject: `Poglej, kaj sem zgradil (kratek posnetek)`
Body: Show the actual app — Coach generating a plan, the report, biometrija. Documentation-before-education. Link the YouTube VSL here for the first time ("cela zgodba v enem videu →").

**Email N5 — Proof / the alternative it replaces (Anchoring seed)**
Subject: `Kaj bi te to stalo v resnici`
Body: The €200–500 strokovna-ekipa contrast (from §3.1). Plant the value anchor BEFORE the price is ever named. "Kmalu odpremo — in prvih 100 dobi ceno, ki je ne bo nikoli več."

**Email N6 — Founding-100 heads-up (Scarcity seed)**
Subject: `Čez nekaj dni odpremo. Samo 100 mest.`
Body: Announce the date + the first-100 lock-for-life. Disqualification paragraph (§3.2) here — "ni za vsakogar." Tell them exactly when the cart opens so nobody misses it. Ask them to reply "JAZ" if they want a heads-up DM (builds the manual-close list).

---

### 4c. LAUNCH sequence — open cart → reminders → scarcity close
Goal: convert. Compress into a tight launch window (recommend **5–7 days**, not open-ended). Manual DM runs in parallel to every email.

**Email L1 — CART OPEN**
Subject: `Odprto: ATHLOS je živ (prvih 100)`
Body: It's live. The offer, the 3 tiers with crossed-out anchors, PRO as priporočeno, the value contrast, the counter ("ostane 100 mest"). One button → sales page → Stripe. Short. Punchy.

**Email L2 — Handle the #1 objection**
Subject: `"Ali to deluje za MOJ šport?"`
Body: Address the biggest hesitation for a Slovenian athlete audience — sport-specificity. Show a sport-specific plan example (nogomet/košarka). Re-link checkout. Counter update ("že 30+ vpisanih").

**Email L3 — Founder story / why now (nurture spike)**
Subject: `Zakaj sem to naredil (in zakaj zdaj)`
Body: The most personal email of the whole run — the "makes you money" nurture piece (3:1 ratio). Ian's real why. Soft CTA. This is the trust close for fence-sitters.

**Email L4 — Scarcity, real number**
Subject: `Ostane še {X} mest`
Body: Real remaining count. What they lose if they wait (price never this low again — lock-for-life gone). Testimonial/quote if one exists yet (even a beta tester or Tim vouching). Checkout link.

**Email L5 — FINAL CALL / cart closes**
Subject: `Zadnjih 24 ur (potem se cena vrne na polno)`
Body: Hard close. Countdown to close. Restate the lock-for-life delta (€29 vs €49 forever). Last button. After this, early-bird price is gone — and mean it.

> **13 emails total:** R0, R1, R2 (re-engagement) · N1–N6 (nurture) · L1–L5 (launch).
> **Adjusted for scale:** Iman's team sends 10+ launch emails with heavy automation. At ~100–200 leads, 5 launch emails + personal DMs will do more than 12 automated ones. Depth of the personal touch > breadth of the sequence.

---

## 5. The "core converting" flow — VSL + launch event → Stripe checkout

### 5.1 The YouTube VSL (Flywheel VSL, right-sized)
Iman records ONE 38-min evergreen VSL that becomes a 24/7 salesman. **Ian's adjusted version:** record ONE **core converting video** (aim 8–15 min, not 38 — Slovenian audience, cold channel, MVP offer) that:
- tells the ATHLOS story (why generic training fails → the strokovna-ekipa idea → Tim's system → the app),
- demos the product live (Coach generating a real plan),
- names the offer + first-100 early-bird,
- ends with ONE CTA: **"Povezava spodaj — vpiši se na listo / vstopi."**

**Blind-spot honesty:** Iman's VSL works because millions of views feed it. Ian's won't get millions of views cold. So the VSL's job at launch is **not** to be found by strangers — it's to be **the trust-and-convert asset Ian links in every email (N4, L1), every bio, every DM.** It converts the traffic Ian *already* routes to it. Post-launch, as the channel grows, it becomes the evergreen gravity center Iman describes. Build it once now; it compounds later. (Prerequisite Iman names — "make 15–30 videos first to find the topic" — Ian can shortcut because the topic is already known: it's the launch pitch itself.)

### 5.2 The launch "event" (adapted)
Ian can't run Iman's 5-day livestream challenge. The right-sized event:
- **A single live launch moment** — an IG Live / YouTube Live (or even a launch-day Story series) where Ian opens the cart in real time, walks through the app, answers questions, shows the counter. Live = urgency + trust + the personal presence that converts at small scale. Warm list + Tim's audience invited by email (L1) and DM.
- Everyone who attends gets a direct checkout link in the description/pinned comment. Live viewers → highest-intent buyers.

### 5.3 On-page → Stripe checkout flow
Per the ATHLOS memory, `/api/checkout` + `src/lib/stripe.ts` are built and launch-gated (503 until `LAUNCH_MODE=live`). Flow:

```
Sales page (tiers, anchors, disqualification, counter, testimonials)
   │  click "Vstopi — €29/59/89"
   ▼
Stripe Checkout (EU VAT, EUR, subscription mode, early-bird price IDs)
   │  success
   ▼
Onboarding (existing 5-step funnel) → FIRST AI PLAN GENERATED same session
   │
   ▼
Welcome-to-founders email + "you're in the first 100" confirmation
```

**No-leak details on the checkout itself:**
- **One page, one decision.** Don't make them navigate — tiers and checkout on the same flow. Every extra click is a leak.
- **Trust signals on the page:** Tim's face + credentials, GDPR/zasebnost link, "prekliči kadarkoli," the real counter.
- **Stripe Checkout, not a custom form** — fewer failure modes, Apple/Google Pay built in, less friction, and it's already the chosen stack.
- Use **launch-specific early-bird Stripe Price IDs** so the €29/59/89 are locked to those first-100 subscriptions for life (the grandfather clause is a Stripe pricing/coupon setup, not a promise on a page).

### 5.4 Abandonment follow-up (the biggest small-scale leak)
- **Stripe:** enable Checkout **abandonment recovery** — Stripe emails anyone who entered checkout and didn't finish, with a link back to the same session.
- **Manual, and this is the killer move at Ian's scale:** the launch list is small enough that Ian can **personally DM/email anyone who clicked-but-didn't-buy** within a few hours: *"Videl sem, da si skoraj vstopil — te kaj ustavlja? Vprašaj karkoli."* At a dozen-to-few-hundred leads, a human "je vse ok?" recovers more carts than any automated flow. This is Ian's unfair advantage over a big-scale operator: he can *talk to every single lead.*

---

## 6. Retention — where the subscription profit actually is (Iman: retention > acquisition)

MVP is a subscription, so **month 1 retention decides whether the business is real.** A €29 buyer who churns after 30 days = a loss after Stripe fees. The moves that matter most for month 1:

### 6.1 Activation is retention (the first 10 minutes)
- **Get the buyer to their first AI plan the moment they pay.** The single strongest churn-prevention lever is: *did they use it in week 1?* Onboarding must end in a generated plan in hand, not an empty dashboard.
- **Day-2 check-in email:** `Kako gre s prvim tednom?` — a real question, reply invited. Catches confusion before it becomes a cancel.

### 6.2 Founding-member ritual (adapted retention engineering)
Iman uses time-gated unlocks (coaching calls unlock month 2, etc.) to build churn-prevention into the product. Ian's right-sized version:
- **Founding-100 identity + perks over time:** early-bird price locked for life (already the core hook), + "founding member" badge, + a promise that the next feature ships *for you first*. Give them a reason to still be here in month 2.
- **A weekly Tim value email to paying members** (separate from marketing list) — keeps perceived value high between app sessions. Cheap, compounding.
- **Ask founders for feedback and USE it visibly.** "Predlagal si X → naredil sem X" is the most powerful retention move a founder-led MVP has. It converts buyers into evangelists (and referrers → feeds §2.4).

### 6.3 Failed-payment recovery / dunning (pure found money)
Iman's most quotable stat: **50% failed-payment recovery vs 5% industry.** Involuntary churn (expired/declined cards) is silent and huge. Set this up on day 1 of billing:
- **Stripe Smart Retries** — automatically retries failed charges on an optimized schedule.
- **Dunning emails** (Stripe Billing or Beehiiv-triggered), Slovenian:
  - Fail day 0: `Plačilo ni šlo skozi — preveri kartico (2 klika)`
  - Retry day 3: `Še vedno ne gre — tvoj dostop se čez X dni zapre`
  - Final: `Zadnji poskus — obnovi, da ne izgubiš founding cene`
- **The lock-for-life price is the retention weapon here too:** "če odideš, izgubiš €29 za vedno — nova cena je €49." That makes staying rational, not emotional.
- **Card-updater / expiry reminders** before renewal to pre-empt the failure.

---

## 7. Metrics — the few numbers Ian actually watches (leads, not views)

Iman's core rule: **optimize for leads, not views.** Ian's dashboard is short on purpose — vanity metrics are banned. Watch:

| Metric | Why it matters | Healthy signal (cold-start, 30 days) |
|---|---|---|
| **Confirmed leads** (double-opt-in) | The only top-of-funnel number that pays. NOT followers, NOT views. | 12 → 80–200 by launch |
| **Pending→confirmed rate** | Catches the #1 silent leak (unconfirmed opt-ins) | > 60% confirming |
| **Opt-in page conversion** (visitor→lead) | Tells you if the magnet/copy works | 20–40% of visitors |
| **Email open + reply rate** | Reply rate is the real warmth signal at this scale | Opens > 40%, replies > 3–5% |
| **VSL / core-video watch-through** | Whether the convert asset actually converts | Watched fully by a real % of clickers |
| **Lead → buyer conversion** (launch) | The number that defines success | 5–12% of confirmed leads |
| **Founding members / 100** | The launch scoreboard | 5–20 = a win for a solo organic launch |
| **Week-1 activation** (bought → used) | Predicts month-2 retention | > 70% generate a plan in week 1 |
| **Month-1 retention + dunning recovery** | Where the profit lives | Watch churn; recover > 30–50% of failed payments |

**What Ian should deliberately IGNORE:** IG follower count, Reel view count, YouTube subs. They feel like progress and correlate with nothing that pays. The moment Ian catches himself checking view counts instead of the confirmed-leads number, he's off-mission (Iman's core discipline).

---

## 8. The 30-day execution spine (so this isn't just theory)

| Days | Focus | Key actions |
|---|---|---|
| **1–5** | Fix the leaks + build the magnet | Clean pending list; build Tim's 4 sport-variant PDFs + assessment; rewrite opt-in page; send R0/R1/R2 re-engagement. |
| **6–15** | Grow the list by hand | Ian's network DMs (lever 1); Tim posts (lever 2); Beehiiv referral live (lever 3); daily Reel/Short → guide (lever 4); nurture N1–N3. |
| **16–25** | Prime + build convert assets | Record + publish the core VSL; nurture N4–N6 (incl. VSL + value anchor + first-100 heads-up); collect "JAZ" reply list; wire Stripe early-bird price IDs + abandonment + dunning. |
| **26–30** | LAUNCH | `LAUNCH_MODE=live`; live launch moment (IG/YT Live); L1–L5 over a 5–7 day window; manual DM every clicker + every "JAZ"; watch the counter, not the view count. |

---

### Frameworks used (named, per the lens)
Intentional Brand (§1, §2.5) · Optimize-for-leads-not-views (§2.1, §7) · Micro-Channel / deliberately small (§1, §5.1) · 3:1 Growth-to-Nurture (§4b N-emails, L3) · Flywheel VSL (§5.1) · No-Leak Backend (§1, §5.4, §6.3) · Price Anchoring (§3.1) · Disqualification Positioning (§3.2) · Retention Engineering + Failed-Payment Recovery (§6) · Problem Farming (§4b N2) · Documentation-before-education (§2.2, §4b N4).

**Every one adapted for the cold-start reality:** trickle-top not firehose; manual close over automation; warm-list + founder-network + Tim's audience as the real launch engine; a right-sized VSL and a right-sized "event"; and a success bar (5–20 founding members) set to Ian's scale, not Iman's screenshots.
