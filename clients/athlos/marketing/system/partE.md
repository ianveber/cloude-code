# 5 · The Funnels & The Backend Machine

This chapter turns everything upstream — Ian's face, the content, Tim's science — into money. Content is the top of the funnel; **the funnel is where the business actually lives.** Iman's word for this is the **No-Leak Backend**: at every stage a qualified lead can slip out, and a system must be there to catch it. His whole philosophy is that follower count doesn't pay — *leads that convert and stay subscribed* do. So this is the least glamorous chapter in the manual and the most load-bearing one.

Read it with the cold-start lens on the whole time. Iman pours millions of monthly views into the top of his funnel, so he automates everything and lets the volume do the work. **We do the opposite.** Our top is a trickle, not a firehose. That's not a weakness here — it's the unfair advantage: at 80–200 leads, Ian can personally touch *every single one*. The rule for this whole chapter is: **automate the plumbing, close by hand.**

> This chapter maps and connects. It does **not** rewrite the assets. The finished Slovenian opt-in copy, the 13 emails, the pricing copy, the dunning emails all already exist in `04-funnel-sales-system.md`, `07-lead-magnet-tim-7day.md`, and `08-launch-email-sequence.md`. Here we show how the pieces lock together and in what order to build them.

---

## 5.1 The full funnel map — where every lead leaks, and what catches it

Seven stages. A stranger becomes a viewer, a viewer becomes a follower, a follower becomes an owned lead, a lead gets nurtured, a nurtured lead buys, a buyer is retained, and a retained member refers. **At every arrow, someone leaks.** The job of the backend is one thing: make sure that at our tiny volume, *not one of the 5–20 buyers we can realistically get* falls through a gap nobody was watching.

```
  STAGE 0 · COLD VIEWER  ── IG Reel / YT Short / long-form. Stranger, no relation.
  (stranger)                MECHANISM: hook → value → ONE CTA ("link v biju: brezplačen načrt")
        │
        │   LEAK: watches, feels good, scrolls on, never clicks.
        │   CATCH: Intentional Brand — every post is reverse-engineered from ONE CTA
        │          (the free 7-day plan). No "just vibes" posts. Pinned comment + link-in-bio
        │          point to the SAME opt-in page. (§5.2)
        ▼
  STAGE 1 · FOLLOWER     ── Follows Ian (personal) + @athlos, or subs YT. Warm-ish, in orbit.
  (in orbit)                MECHANISM: 3:1 growth-to-nurture content keeps them in the feed.
        │
        │   LEAK: follows but never joins the list. You don't own the relationship —
        │         the algorithm does. One shadow-ban and they're gone forever.
        │   CATCH: No-Leak — convert follower → OWNED email fast. Every 4th–5th post +
        │          every Story block ends in the lead-magnet CTA. Story link sticker +
        │          a DM-keyword trigger ("napiši NAČRT").
        ▼
  STAGE 2 · LEAD         ── Joins the Beehiiv waitlist via the opt-in page. THE CORE CONVERSION.
  (owned email)             MECHANISM: free value (Tim's 7-day plan) delivered on double opt-in.
        │
        │   LEAK #1: signs up, never CONFIRMS the double opt-in → stuck "pending",
        │            gets zero emails. ← THE #1 SILENT LEAK on the current setup.
        │   CATCH: confirmation-nudge (email R0). Not confirmed in 24h → auto-resend
        │          "Potrdi svoj e-mail, da dobiš načrt." Watch the pending column daily;
        │          DM anyone Ian knows personally. (§5.2)
        │   LEAK #2: confirms, downloads the plan, goes cold before launch.
        │   CATCH: the 30-day nurture sequence (N1–N6) keeps them warm. (§5.4)
        ▼
  STAGE 3 · NURTURED     ── Reads emails, watches the VSL, replies, is in the "first-100" frame.
  (trusts Ian + Tim)        MECHANISM: story/nurture sequence + the YouTube VSL.
        │
        │   LEAK: warm but undecided when the cart opens — "mogoče kasneje."
        │   CATCH: Price Anchoring + Disqualification + real Scarcity (first-100 lock-for-life,
        │          hard cap, launch-window close) + a MANUAL DM to every engaged lead
        │          who opened but didn't buy. (§5.3, §5.5)
        ▼
  STAGE 4 · MVP MEMBER   ── Buys a tier (€29 / €59 / €89) via Stripe. Paying founding member.
  (paying)                  MECHANISM: launch email → sales page → Stripe Checkout → onboarding.
        │
        │   LEAK #1: clicks "kupi", opens Stripe, doesn't finish.
        │   CATCH: Stripe Checkout abandonment recovery + a personal DM within hours
        │          ("videl sem, da si skoraj notri — te kaj ustavlja?"). (§5.5)
        │   LEAK #2: buys, never activates in-app → churns in weeks.
        │   CATCH: onboarding ends in the FIRST AI plan in hand, same session. (§5.6)
        ▼
  STAGE 5 · RETAINED     ── Stays subscribed month 2+, upgrades, or goes annual. WHERE PROFIT IS.
  (recurring revenue)       MECHANISM: retention engineering + failed-payment recovery.
        │
        │   LEAK #1: card fails / renews and bounces → silent INVOLUNTARY churn.
        │   CATCH: Stripe Smart Retries + dunning sequence. (Iman: 50% recovery vs 5% industry —
        │          pure found money.) (§5.6)
        │   LEAK #2: voluntary churn — "nisem ga uporabljal."
        │   CATCH: week-1 activation + the founding-member ritual + used feedback. (§5.6)
        ▼
  STAGE 6 · REFERRER     ── Brings a training partner. The loop closes and the top refills.
  (evangelist)              MECHANISM: locker-room word-of-mouth + Beehiiv referral + "founding" pride.
        │
        │   LEAK: loves it, never tells anyone — the loop stays open.
        │   CATCH: make referral a DEFAULT, not a favour — Beehiiv referral bonus on the magnet,
        │          a founding-member "bring your soigralec" ask, "predlagal si X → naredil sem X"
        │          proof that turns members into promoters. (§5.6) ──┐
        │                                                            │ feeds back into STAGE 0/2
        └────────────────────────────────────────────────────────────┘
```

**The whole machine in one sentence:** content points at ONE free plan → the plan converts a follower into an owned email → 30 days of Slovenian nurture + a founder VSL build trust → a hard-capped first-100 early-bird cart opens → Stripe checkout with manual DM backup → activation + dunning keep the subscription alive → happy founders refer their locker room and refill the top. **No step relies on volume Ian doesn't have. Every step relies on a leak-catcher one human can still run by hand.**

---

## 5.2 Lead capture — the magnet, the opt-in page, and where the CTA lives

### The lead magnet is a slice of the product, not a freebie

A "waitlist" that only promises "get notified at launch" is a dead magnet — "get notified" is a chore, not a benefit. The opt-in must hand over something valuable the instant someone joins. Ours is already built (see `07-lead-magnet-tim-7day.md`):

> **"7-dnevni ATHLOS Starter"** — a real, usable 7-day speed/explosiveness micro-protocol authored by Tim Drenovc, delivered as a clean PDF, plus a 60-second self-assessment ("Kje si zdaj?") that tells the athlete which phase they're in.

Why this specific magnet works (Iman's **documentation-before-education** applied honestly): it's *one real week of the actual product*, not a generic PDF. It proves ATHLOS's core value — personalized, Tim-verified training — before anyone pays a cent. It's near-zero marginal cost (the Coach brain generates the sport-specific base). And the assessment writes a **segmentation tag** (per-sport, per-level) we reuse in nurture. Iman would build a 5-day livestream with a $250K prize pool here; the right-sized cold-start equivalent is one PDF one person can ship.

### The opt-in page + waitlist mechanics (Beehiiv double opt-in)

The finished Slovenian opt-in copy lives in `04 §2.5` — do not rewrite it. Mechanically, the page does exactly three jobs:
1. **Names the free thing as a product**, not a notification ("Dobi svoj 7-dnevni načrt. Brezplačno.").
2. **Captures sport + email** — the sport dropdown is what makes segmentation possible.
3. **Teases the first-100** at the bottom ("Med prvih 100, ki vstopijo, zaklene ceno za vedno.") — this seeds §5.3 before the price is ever named.

The one thing everyone building this must understand about Beehiiv: **double opt-in is ON, which means the biggest silent leak in the entire funnel lives right here.** A sign-up that never clicks the confirmation email is stuck "pending" and receives *nothing* — not the plan, not the nurture, not the launch. That person raised their hand and we lost them to a checkbox. So:
- **Email R0** (`04 §4a`) auto-resends the confirmation if not confirmed in 24h ("Manjka samo en klik").
- The Google Sheet logs `pending` vs `confirmed` — **someone watches that column daily** and manually DMs anyone Ian knows personally. At this scale, one recovered pending lead can be one buyer.

### Where the CTA lives (one destination, everywhere)

The Intentional-Brand rule: every surface points to the **same** opt-in page. No competing links.

| Surface | The CTA |
|---|---|
| IG / YT bio (Ian + @athlos) | Link-in-bio → opt-in page |
| Every Reel / Short | Spoken + on-screen "link v biju: brezplačen 7-dnevni načrt" |
| Pinned comment (every post) | Same opt-in link |
| IG Stories | Link sticker + DM-keyword trigger ("napiši NAČRT") |
| The VSL description | Same opt-in link |
| Tim's post / story | Same opt-in link (his audience is the highest-ROI source) |
| Every DM Ian sends by hand | "pošlji mi šport, dam ti načrt" → opt-in link |

---

## 5.3 The value ladder & the offer

Iman's ladder ascends from a low-ticket front-end to high-ticket. Ours is a **subscription-only B2C ladder** — simpler, and correct for this market. Four rungs, locked (from `00-START-HERE.md` and `04 §3`):

```
  RUNG 0 · FREE        7-dnevni Starter + assessment (the magnet).
                       Job: prove value, capture email, segment by sport.
        ▼
  RUNG 1 · WAITLIST    Free membership. "Founding member" frame.
                       Job: own the relationship, nurture, promise the early-bird.
        ▼
  RUNG 2 · EARLY-BIRD  First 100 lock lifetime pricing:
   MVP (the launch)      BASIC  ~€49~ €29/mes  ·  PRO ⭐ ~€99~ €59/mes  ·  ELITE ~€149~ €89/mes
                       Job: convert nurtured leads into paying founders.
        ▼
  RUNG 3 · RETENTION   Stay subscribed / upgrade tier / go annual (2 meseca gratis).
   / ANNUAL            Job: recurring profit — where subscription money actually is.
```

**Price anchoring — two anchors, never a bare price.** Every tier shows against its crossed-out regular price (`~€49~ €29/mes`). But the *stronger* anchor is the human-alternative one, and it should be the hero of the pricing section:

> **Kaj to nadomesti:** Osebni trener + kineziolog + fizioterapevt = **€200–500+ / mesec** v Sloveniji. ATHLOS: cel sistem, 24/7, od **€29 / mesec.**

That reframes €29 against a €200–500 real-world stack — it makes the price feel almost free, and it *is* the ATHLOS thesis ("every athlete deserves the strokovna ekipa, as an AI system").

**Disqualification (Iman's positioning move, adapted).** We don't disqualify by income like Iman — we disqualify by *seriousness*. The copy ("ATHLOS ni za tiste, ki iščejo bližnjico…", `00`/`04 §3.2`) makes the athletes who *do* fit feel chosen and filters out low-fit, high-churn buyers before they cost support time. **Tier steering:** PRO (€59) is the visual "priporočeno" middle — BASIC anchors low, ELITE (€89, waitlist-only) anchors high and flatters PRO into the sane choice.

**Real scarcity, never fake.** Hard cap at 100. A counter that actually decrements. In a market this small, one faked count is permanent trust death — round milestones ("že 34 od 100") are fine, invented urgency is not. The lock-for-life is the honest reason to act *now*.

---

## 5.4 The email / nurture engine

Three sequences, **13 emails**, all in Beehiiv, all from "Ian iz ATHLOS-a" with reply-to a real inbox Ian reads — **replies are the goal**, they're the warmest close signal at this scale. The full Slovenian copy already exists (re-engagement + nurture in `04 §4a/§4b`; the 5 launch emails as drop-in broadcasts in `08`). This section is the **send logic**, not the copy.

```
  SEQUENCE A · RE-ENGAGEMENT (wake the existing ~12) ── Beehiiv AUTOMATION, week 1
     R0 → only to `pending`: confirm → get the plan          [fixes the #1 silent leak]
     R1 → "Hvala, ker si bil zraven od začetka" + the gift
     R2 → "Zakaj sem začel graditi ATHLOS" + a question that begs a reply

  SEQUENCE B · NURTURE / 30-DAY STORY (whole list) ── Beehiiv AUTOMATION, ~1 email / 4–5 days
     N1 → welcome, deliver the magnet (instant on confirm)
     N2 → the problem, named (Problem Farming) — pure value, no pitch
     N3 → the expert: who is Tim, why Ian trusts him (trust transfer)
     N4 → build-in-public: the app is real + FIRST LINK TO THE VSL
     N5 → the €200–500 alternative it replaces (plants the price anchor before price exists)
     N6 → first-100 heads-up + disqualification + "odgovori JAZ za opomnik" (builds the DM list)

  SEQUENCE C · LAUNCH (cart open → close) ── Beehiiv manual BROADCASTS, 5–7 day window
     L1 → CART OPEN (warm list first, first-access checkout)
     L2 → handle the #1 objection ("ali deluje za MOJ šport?")
     L3 → founder story / why now (the nurture spike, 3:1)
     L4 → scarcity, real remaining count
     L5 → FINAL CALL / cart closes (lock-for-life delta, hard close)
```

**The send logic that matters:**

- **A and B are automations; C is manual broadcasts.** Re-engagement and nurture fire on triggers (confirm, time-delay) and run themselves. The launch is 5 manual broadcasts because a launch needs *live control* — a real counter, a real close time you announce and honour.
- **The trigger boundary:** R0 is segmented to `pending` only. N1 fires the instant someone confirms. C is sent to the confirmed warm list first (they got first-access framing in N6), then public.
- **Never duplicate across sequences.** A confirmed early sub gets R1/R2 (welcome-back), *then* rejoins the N-flow — don't send them the "here's your first plan" welcome twice. Segment by `confirmed_date` so old subs and new subs don't collide.
- **Manual DMs run in parallel to every launch email** (§5.5). The email is the announcement; the DM is the close. At ~100–200 leads, 5 launch emails + personal DMs beat 12 automated emails. **Depth of touch > breadth of sequence** — this is the deliberate cold-start inversion of Iman's heavily-automated 10-email launches.
- **A/B in Beehiiv:** use the built-in subject-line test on each launch broadcast (Subject = A, alternate = B, keep preview text identical), send the winner by open rate.

---

## 5.5 The core converting flow — everything routes to one Stripe checkout

### VSL + content + emails → one checkout

The VSL (one honest 8–15 min founder-to-camera video: *why generic training fails → the strokovna-ekipa idea → Tim's system → the app working live → the offer*) is the **gravity center** every other asset links to. Its job at launch is **not** to be found by strangers — it's to be the trust-and-convert asset Ian links in **N4, L1, every bio, every DM.** It converts the traffic Ian already routes to it; post-launch, as the channel grows, it becomes the evergreen Flywheel VSL Iman describes. (We can shortcut Iman's "make 15–30 videos first to find the topic" — the topic is already known: it's the launch pitch itself.)

```
  Content (Reels/Shorts/bio)  ─┐
  Nurture email N4            ─┤
  Launch emails L1–L5         ─┼──►  SALES PAGE  ──►  STRIPE CHECKOUT  ──►  ONBOARDING
  The VSL description         ─┤     (tiers, anchors,     (EUR, VAT,          (first AI plan
  Every manual DM             ─┘      disqualification,    subscription mode,   in hand, same
                                      real counter,        early-bird           session)
                                      Tim's face + trust)  Price IDs)
```

### The checkout UX (no-leak = minimal friction)

`/api/checkout` + `src/lib/stripe.ts` are built and launch-gated (503 until `LAUNCH_MODE=live`). The rules:

- **One page, one decision.** Tiers and checkout in the same flow. Every extra click is a leak.
- **Stripe Checkout, not a custom form.** Fewer failure modes, Apple/Google Pay built in, mobile-first by default, minimal fields (email + card — nothing we don't need). This is a **Slovenian phone-first audience**; the checkout has to feel like two taps.
- **The first-100 counter stays visible and honest** through the flow.
- **Trust signals on the page:** Tim's face + credentials, "prekliči kadarkoli," GDPR/zasebnost link, the real counter.
- **Early-bird Price IDs.** The €29/59/89 are locked to dedicated launch Price IDs so the first-100 price grandfathers for life at the Stripe level — a pricing setup, not a promise on a page.

### Cart-abandonment + failed-payment recovery

- **Stripe Checkout abandonment recovery** — auto-emails anyone who entered checkout and didn't finish, with a link back to the same session. Turn it on before launch.
- **The manual killer move (Ian's unfair advantage):** the launch list is small enough that Ian **personally DMs anyone who clicked-but-didn't-buy within a few hours** — *"Videl sem, da si skoraj vstopil — te kaj ustavlja? Vprašaj karkoli."* At this volume a human "je vse ok?" recovers more carts than any automation. A big operator literally cannot do this; Ian can talk to every lead.
- **Failed-payment dunning** (Smart Retries + the Slovenian dunning emails) is set up here but *runs* in §5.6, because for a subscription the first failed charge is a retention event, not a checkout event.

---

## 5.6 Retention & referral — where a subscription actually makes money

MVP is a subscription, so **month-1 retention decides whether the business is real.** A €29 buyer who churns after 30 days is a loss after Stripe fees. Iman's own framing: retention beats acquisition, and failed-payment recovery is the most under-worked profit lever there is.

### Activation is retention (the first 10 minutes)

The single strongest churn-prevention lever is: *did they use it in week 1?* So **onboarding must end in a generated AI plan in hand, not an empty dashboard** — activation = first workout plan, same session they paid. Then a **Day-2 check-in email** (`Kako gre s prvim tednom?`, reply invited) catches confusion before it becomes a cancel.

### The founding-member ritual (retention engineering, right-sized)

Iman time-gates unlocks (coaching calls unlock month 2, etc.) to build churn-prevention into the product. Ian's cold-start version:
- **Founding-100 identity + perks over time:** price locked for life (the core hook) + a "founding member" badge + "the next feature ships *for you first*." A reason to still be here in month 2.
- **A weekly Tim value email to paying members** (separate from the marketing list) — keeps perceived value high between app sessions. Cheap, compounding.
- **Ask founders for feedback and USE it visibly.** "Predlagal si X → naredil sem X" is the most powerful retention move a founder-led MVP has — and it's the exact mechanism that converts a member into a **referrer**.

### Failed-payment dunning (pure found money)

Involuntary churn (expired/declined cards) is silent and large. Iman's most quotable stat: **50% recovery vs 5% industry.** Set up on day 1 of billing:
- **Stripe Smart Retries** — auto-retries failed charges on an optimized schedule.
- **Dunning emails** (Slovenian, from `04 §6.3`): fail day 0 → `Plačilo ni šlo skozi (2 klika)` · retry day 3 → `Še vedno ne gre — dostop se čez X dni zapre` · final → `Zadnji poskus — obnovi, da ne izgubiš founding cene`.
- **The lock-for-life price is the retention weapon:** "če odideš, izgubiš €29 za vedno — nova cena je €49." Staying becomes rational, not emotional.
- **Card-updater / expiry reminders** before renewal to pre-empt the failure entirely.

### Turning the first members into a referral loop (Stage 6 → refills the top)

Team-sport athletes share inside a locker room by default — we just have to make referral the path of least resistance, not a favour to ask:
- **Beehiiv native referral on the magnet:** "Deli s soigralcem → oba dobita bonus protokol." The free tier spreads inside a team chat on its own.
- **The founding-member "bring your soigralec" ask:** once a member is activated and happy (post Day-2 check-in), the moment to ask for one referral — a founder who feels chosen brings a teammate.
- **Visible used-feedback as social proof:** "predlagal si X → naredil sem X" posted publicly turns one happy founder into evangelism the whole warm graph sees. This is the loop closing: a referrer sends a stranger back to Stage 0/2, and the funnel refills without new cold reach.

---

## 5.7 The build order — stand the funnel up in the right sequence

Build inside-out: **plug the leaks before you pour anything in.** A lead captured before the plumbing is watertight is a lead lost.

```
  PHASE 1 · PLUMBING (days 1–5) — before any list-growth push
  [ ] Confirm the lead magnet (Tim's 7-day PDF + assessment) is finished & downloadable   (07)
  [ ] Rewrite/verify the opt-in page copy + sport dropdown                                 (04 §2.5)
  [ ] Build Beehiiv Sequence A (re-engagement, incl. R0 pending-nudge) as an AUTOMATION    (04 §4a)
  [ ] Build Beehiiv Sequence B (nurture N1–N6) as an AUTOMATION with the confirm trigger   (04 §4b)
  [ ] Clean the pending pile — check the Google Sheet `status` column, fire R0             (§5.2)
  [ ] Set up segmentation tags (sport, confirmed_date) so sequences don't collide

  PHASE 2 · CHECKOUT & MONEY PLUMBING (days 5–15, in parallel with list growth)
  [ ] Create the early-bird Stripe Price IDs (BASIC/PRO/ELITE) so first-100 grandfathers   (§5.3, §5.5)
  [ ] Wire the sales page: tiers, both anchors, disqualification, real counter, trust      (§5.3)
  [ ] Enable Stripe Checkout abandonment recovery                                          (§5.5)
  [ ] Set up dunning: Smart Retries + the 3 Slovenian dunning emails                       (§5.6)
  [ ] Confirm onboarding ends in a generated AI plan (activation)                          (§5.6)
  [ ] Keep /api/checkout gated at 503 until LAUNCH_MODE=live

  PHASE 3 · CONVERT ASSETS (days 15–25)
  [ ] Record + publish the VSL (8–15 min); link it in N4, every bio, the sales page        (§5.5)
  [ ] Load Sequence C (L1–L5) as manual broadcasts, ready to send                          (08)
  [ ] Build the "JAZ" reply list from N6 → the manual-DM close list                        (§5.4)

  PHASE 4 · LAUNCH (days 26–30)
  [ ] Flip LAUNCH_MODE=live; open the cart to the warm list first                          (§5.5)
  [ ] Send L1–L5 over a 5–7 day window; keep the counter honest
  [ ] Run manual DMs in parallel — close every engaged lead + every clicker by hand        (§5.5)
  [ ] Watch confirmed leads / counter / conversion — NOT view counts                       (04 §7)

  PHASE 5 · POST-LAUNCH (day 31+)
  [ ] Day-2 check-in email to every buyer; verify week-1 activation                        (§5.6)
  [ ] Start the weekly Tim member email; ship one used-feedback item visibly               (§5.6)
  [ ] Turn on Beehiiv referral on the magnet; make the "bring your soigralec" ask          (§5.6)
```

**Sequencing rule:** never open the cart (Phase 4) before the dunning and abandonment plumbing (Phase 2) exists — the first failed payment will happen in week 1, and a subscription that can't recover a bounced card leaks profit from day one.

---

## Blind-spot check

- **This funnel is real, but the top is a trickle.** With ~12 warm subs and a cold audience, the launch does **not** live or die on new cold traffic in 30 days. It lives on (a) waking the warm list, (b) converting Ian's own network + DMs by hand, and (c) whatever content adds on top. If you build the beautiful funnel and forget to *manually message every human*, you built the wrong thing. Cold content seeds month 2–6; it does not carry launch day.
- **Automation is a trap at this scale — except for the plumbing.** Iman automates because volume justifies it. At a dozen-to-few-hundred leads, a personal DM outconverts any automated email. Automate the Beehiiv sequences, Stripe, and dunning; **close by hand.** The day this funnel gets big enough to *need* full automation is a good day — we are not there, and pretending we are would cost buyers.
- **Sober numbers.** Grow the warm list to a realistic 80–200 leads and a good warm launch converts 5–12% → **~5–20 paying founding members in month 1.** That is a *success* for a solo organic cold-start, not a failure. The real asset built here is a warm, segmented Slovenian athlete list + a watertight checkout/retention machine + the first 5–10 testimonials. Do not measure any of this against Iman's launch screenshots — his one public financial data point showed insolvency. Measure it against the counter and the confirmed-leads number.
- **The #1 silent leak is the double opt-in, and it's invisible.** A pending sub looks like nothing on a dashboard — no bounce, no complaint, just silence. If nobody watches the `pending` column daily, the funnel will quietly lose its best-intent leads and no one will know why the numbers are soft. This is the leak most likely to go unnoticed, so it gets the most explicit human check.
- **Retention beats acquisition, and it's the part a founder in launch-adrenaline forgets.** The temptation is to pour all energy into the cart open and none into Day-2 activation and dunning. But for a subscription, a churned €29 buyer is a *loss*. The founding-member ritual, the week-1 check-in, and the dunning emails are not "later" — they are Phase 2 and Phase 5 on purpose.
