# 6 · How The Team Runs It — The Operating System

> This chapter is the team's **operating system**: how a small, founder-led team actually runs the ATHLOS marketing machine, week to week, from zero. Not a RACI lecture — a working manual. If you're on this team, this is the chapter you re-read every Monday.
>
> **The one line that governs everything below:** Ian is the face; the team is the machine around the face. The whole system is engineered so Ian's only non-delegable jobs are (1) being on camera and (2) the handful of calls only a founder can make. Everything else, the team absorbs.
>
> **Cold-start honesty (read once, remember always):** we are a solo-ish team also shipping the app, with a tiny warm list, organic-only, in a ~30-day window. This is *not* Iman's 30-person content factory. Every role below is a hat, not a headcount — the same person often wears two. We design the OS to survive that reality, not to pretend it away.

---

## 6.1 The founder-as-face principle (for the team)

Iman's core structural move — **"effortless front, best-in-class backend"** — is the spine of how we operate. The public sees Ian: relaxed, on camera, building ATHLOS in the open. What the public never sees is the team running the unglamorous machine that turns Ian's face into leads, leads into founding members, and members into retained revenue. The gap between how effortless it looks and how systematic it actually is — *that gap is the moat.*

For that to work, we protect Ian's time like it's the scarcest resource in the company. Because it is. Ian is simultaneously the on-camera talent **and** one of the two engineers shipping the app. If the team leaks work onto Ian that the team could have absorbed, the app slips or the content dies — and both are fatal.

### What only Ian can do (never delegate these)

1. **Be on camera.** Ian is THE FACE. He films THE JOURNEY, he presents the science with Tim, he trains himself on the product on camera, he records the VSL, he goes live on launch day. Nobody else can be the founder-athlete. This is his #1 job and the one input the whole machine depends on.
2. **Own the network + the DMs.** The launch lives on Ian's warm graph (his athletes, coaches, training partners) and on personal replies. At this scale a founder's DM outconverts any automation. Ian personally messages the people he knows and personally replies to every lead who raises a hand. The team can *tee up* DMs (draft, list, remind) but the send comes from Ian, in his voice.
3. **Hold the vision + the taste calls.** Positioning, the offer, what ATHLOS stands for and against, whether a piece of content is "us" or not, the disqualification line, the honesty of the scarcity counter. These are founder judgment calls. The team executes them; Ian sets them.
4. **The few founder-only decisions:** launch date, price, whether to go live, what promise we can honestly make ("za vedno"), and any call that touches trust in a small market where one wrong move is permanent.

### What the team absorbs (so Ian never touches it)

Everything else. Editing, packaging (titles/thumbnails/captions), scheduling, posting, the @athlos account, Beehiiv setup and sends, the Stripe plumbing, the dashboard, abandonment and dunning, the lead-magnet generator, checkout and onboarding, launch ops, the numbers. Ian should walk into a Content Day, film, walk out — and the finished, packaged, scheduled content, plus every backend system it feeds, appears without him lifting another finger.

**The test for every task:** *"Does this require Ian's face, Ian's network, or Ian's founder judgment?"* If **no**, the team owns it end-to-end and does not put it back on Ian. If **yes**, get Ian the minimum viable input (film this, approve this, send this) and absorb everything around it.

> **Blind-spot check:** the failure mode here is the team quietly becoming a "please approve this" queue that turns Ian into a bottleneck. If Ian is approving more than a short daily batch, the team has under-absorbed. Default to shipping within the locked brand rules and showing Ian the result, not asking permission for every piece. Approval is for the few founder-only calls, not for a caption.

---

## 6.2 The roles (practical, not seat-theater)

Five people, plus Tim. These are **hats**, sized to a cold-start team — one person may hold two, and that's expected. What matters is that every job below has exactly one owner, so nothing falls in the gap between "someone should" and "nobody did."

### Ian — Face / Network / Vision
- On camera for all content (THE JOURNEY, science-with-Tim, training-himself, VSL, launch live).
- Owns his personal account's voice and his network DMs + personal lead replies.
- Sets positioning, offer, taste, and makes the founder-only calls.
- **Also** wears an engineer hat on the app — which is exactly why his marketing surface is kept this tight.

### The 2 engineers — Ship the app + build the marketing-critical plumbing
The app shipping on time is **the #1 marketing dependency**, full stop. No product on launch day = no launch, regardless of how good the content was. So the engineers' first and non-negotiable job is the MVP ship date. Their marketing-facing jobs, in priority order after that:
1. **The lead-magnet generator** — the tooling that turns Tim's brain into the sport-specific 7-day PDFs + the 60-second assessment (the Coach brain generates the base). This is what makes the free opt-in real.
2. **Checkout + onboarding** — Stripe early-bird price IDs, the launch gate (`LAUNCH_MODE`), and onboarding that ends in a *generated plan in hand the same session* (activation = retention).
3. **Product-proof capture** — the ability to screen-record the Coach generating a real plan, the report, biometrija — the raw material Ian's content and the VSL are built from.

> One of the two engineers is Ian. Plan the engineering roadmap knowing Ian is also the face — protect the ship date by keeping his content load to Content Day + DMs, nothing more.

### The 2 marketers — split into two clean lanes
This is the heart of the team. Splitting them by lane (not by "we both do marketing") is what makes the pipeline actually run.

**(a) Creative / Content lead** — owns the pipeline *after Ian films.*
- Editing, cutting Content Day footage into Reels/Shorts + the occasional long-form.
- **Packaging** — titles, thumbnails, captions, hooks in idiomatic Slovenian. (Iman: *packaging is 80%* — this lane carries most of the reach outcome.)
- Scheduling and posting on cadence.
- Runs the **@athlos account** as a lean proof-and-offer repository (~2×/week), and cross-posts the shared short-form.
- KPI they live by: content shipped on cadence + the one content-health number (6.5).

**(b) Funnel / Ops / Data lead** — owns the backend *where the money is caught.*
- **Beehiiv** — the list, segments, the re-engagement + nurture + launch sequences, the confirm-nudge (the #1 silent leak), deliverability.
- **Stripe** — early-bird price IDs, abandonment recovery, dunning/failed-payment recovery.
- **The dashboard** — owns the ~6 numbers, updates them, brings them to Monday.
- **Launch ops** — the go-live checklist, sequencing L1–L5, wiring the counter, coordinating the live moment.
- KPI they live by: no lead leaks, and the launch scoreboard.

### Tim — Science content, locked in writing
Tim is **the proof, not the promoter.** His job is narrow and scarce on purpose (scarcity = authority): appear in Pillar-2 science content and product-proof cut-ins, co-sign the lead magnet, and ideally post/story once to his own athletes ("delam na tem — zgodnji dostop + brezplačen načrt," the single highest-ROI growth move we have).

> **Lock this before Day 1:** Tim's minimum commitment in **minutes/week**, in writing. ~40% of the content strategy and 100% of the authority strategy structurally depend on him appearing. If he can't commit, the Content lead builds the fallback where Ian carries the science co-signed *"kar sem se naučil od Tima"* — but we decide that up front, not mid-launch. An unsigned dependency under the whole plan is a top-two launch-killer.

---

## 6.3 THE CONTENT PIPELINE — the core of the team OS

This is the literal flow of **one piece of content** from idea to measured result, and exactly who touches it at each stage. Learn this flow; it's what the team *is.* The design principle: **Ian appears at exactly one stage (filming). Everything before and after is the team.**

```
  ┌──────────────────────────────────────────────────────────────────────┐
  │ STAGE 1 — IDEA / PACKAGING FIRST        OWNER: Creative lead          │
  │ Decide the big idea + Slovenian title + thumbnail/hook BEFORE filming │
  │ (Iman: packaging is 80%, decide it first). Pull from the pillar plan  │
  │ + problem-farming backlog. Ian signs off the batch in one pass.       │
  └───────────────────────────────┬──────────────────────────────────────┘
                                  ▼
  ┌──────────────────────────────────────────────────────────────────────┐
  │ STAGE 2 — CONTENT DAY (FILM)            OWNER: Ian (+ Tim when needed) │
  │ One batch day/week. Ian films 3–5 pieces against the pre-approved     │
  │ packaging list. Good audio + clean background beats fancy gear.       │
  │ Tim films his science cut-ins in his locked minutes. THE ONLY STAGE   │
  │ THAT NEEDS IAN'S FACE.                                                 │
  └───────────────────────────────┬──────────────────────────────────────┘
                                  ▼
  ┌──────────────────────────────────────────────────────────────────────┐
  │ STAGE 3 — EDIT                          OWNER: Creative lead          │
  │ Cut Content Day raw into finished Reels/Shorts (+ long-form/VSL when  │
  │ scheduled). Ian does NOT edit. Product-proof screen-recordings (from  │
  │ the engineers) are dropped in here as B-roll.                         │
  └───────────────────────────────┬──────────────────────────────────────┘
                                  ▼
  ┌──────────────────────────────────────────────────────────────────────┐
  │ STAGE 4 — PACKAGE / FINALIZE            OWNER: Creative lead          │
  │ Lock title, thumbnail, caption, on-screen text — all idiomatic        │
  │ Slovenian. EVERY piece carries ONE CTA to the lead magnet / offer     │
  │ (Intentional Brand — no "vibes-only" posts). Pinned comment + bio     │
  │ point to the SAME opt-in.                                             │
  └───────────────────────────────┬──────────────────────────────────────┘
                                  ▼
  ┌──────────────────────────────────────────────────────────────────────┐
  │ STAGE 5 — SCHEDULE + POST               OWNER: Creative lead          │
  │ Personal account = priority (~80%). Same short-form cross-posted to   │
  │ @athlos + YT Shorts. Daily "dan X/30" cadence. No firehose — one      │
  │ good piece/day beats three rushed ones.                               │
  └───────────────────────────────┬──────────────────────────────────────┘
                                  ▼
  ┌──────────────────────────────────────────────────────────────────────┐
  │ STAGE 6 — ENGAGE                        OWNER: Ian (network/DMs) +    │
  │                                         Creative lead (public replies)│
  │ Ian personally answers DMs + high-intent comments (this IS funnel     │
  │ work). Creative lead handles routine public comments + routes hot     │
  │ leads to Ian. Every raised hand → the lead magnet / list.            │
  └───────────────────────────────┬──────────────────────────────────────┘
                                  ▼
  ┌──────────────────────────────────────────────────────────────────────┐
  │ STAGE 7 — MEASURE                       OWNER: Funnel/Data lead       │
  │ Not views. Did the piece drive CONFIRMED LEADS? Feed the winner back  │
  │ into Stage 1 (double down on what drove opt-ins). Log to dashboard.   │
  └──────────────────────────────────────────────────────────────────────┘
```

**Read the pipeline as a promise to Ian:** *"You show up on Content Day, film against a list we already packaged, answer your own DMs — and a week of finished, scheduled, measured content appears. You never edit, never write a caption, never touch a scheduler."* If any stage other than 2 and (part of) 6 lands on Ian, the pipeline is broken and the Creative lead fixes it.

> **Blind-spot check:** with a real back-catalog, Iman's team would also run a rehashing loop (repackage old winners, new thumbnail/title only) as Stage 8. **We have no catalog yet — skip it for launch.** Note it as the Creative lead's #1 anti-burnout lever for month 2+, don't build it now.

---

## 6.4 The weekly rhythm (keep meetings minimal)

The whole point of a tight OS is that the team spends its hours *building the machine*, not *sitting in meetings about the machine.* Four rhythms, that's it.

### 1. Content Day — the one tentpole (½–1 day, weekly)
The single batch-film day. Creative lead arrives with the pre-approved packaging list (Stage 1 already done). Ian films 3–5 pieces; Tim films his cut-ins if it's a science week. This is the only recurring block that needs Ian's face and the whole team's coordination. **Protect it** — a missed Content Day = an empty content week = the funnel starves.

### 2. Monday numbers review — LEADS not views (15 min, weekly)
Short and disciplined. The Funnel/Data lead presents the ~6 numbers (6.5). One question drives it: **"Did we grow confirmed leads, and did nothing leak?"** Not "how did the Reel do." If the team ever spends this meeting celebrating view counts, it's off-mission — that's Iman's core discipline made into a standing rule. Decide the week's one focus, end the meeting.

### 3. Async daily check-in (2 min, text, no meeting)
A single message in the team channel: what shipped yesterday, what ships today, any blocker. No standup call. At this team size a live daily meeting is pure overhead. The only thing that must surface fast: **anything blocking the app ship date or a lead leaking** — those get escalated the moment they appear, not saved for Monday.

### 4. The Week-4 launch push (the exception to "minimal")
Launch week breaks the calm rhythm on purpose. During the 5–7 day launch window: a short daily sync (go-live checklist, counter, which email drops today, who's DMing whom), the live launch moment, and the Funnel lead watching the scoreboard in near-real-time. This is the one week the team runs hot. Everyone knows it's coming and clears the decks for it.

> **Blind-spot check:** the temptation is to add more meetings as launch nerves rise. Resist. More syncs ≠ more members. The launch is won by the manual DMs and the emails going out on time, not by talking about them. Keep even launch week to *one* short daily sync plus async.

---

## 6.5 The metrics & dashboard (the ~6 numbers)

Vanity metrics are **banned** from this team. Follower count, Reel views, YouTube subs — they feel like progress and correlate with nothing that pays. The dashboard is short on purpose (Iman: *optimize for leads, not views*). The Funnel/Data lead owns it, updates it, and brings it to the Monday review.

| # | Metric | Why it's on the board | Healthy signal (cold-start, 30d) |
|---|---|---|---|
| 1 | **Confirmed leads** (double-opt-in) | The only top-of-funnel number that pays | 12 → 80–200 by launch |
| 2 | **List growth rate** (net new confirmed/week) | Is the machine actually filling the top? | Steady weekly climb, no flat weeks |
| 3 | **Checkout completion** (started → paid) | Catches the biggest launch-day leak | > 50% finish; the rest get DM'd |
| 4 | **Founding members / 100** | The launch scoreboard | 5–20 = a win for solo organic |
| 5 | **MRR** (recurring, after Stripe fees) | Proof-of-model — is this real revenue? | Any positive, growing number |
| 6 | **Content-health number** — *leads driven per week by content* (not views) | Does the pipeline actually feed the funnel? | Content adds real opt-ins, however few |

**Who updates it, and when.** The Funnel/Data lead updates the dashboard continuously (it's their standing job) and presents it every Monday in the 15-minute review. During launch week, numbers 3, 4, and 5 are watched daily. Ian sees the dashboard but does not maintain it — his relationship to the numbers is "am I on plan?", not "let me update the sheet."

> **Blind-spot check:** #6 (content-health) is the one people will try to replace with "views" because views are bigger and feel better. Hold the line — a Reel with 4,000 views that drove zero opt-ins is a *failure*; a Short with 300 views that drove 6 confirmed leads is a *win*. That's the whole team's north star in one comparison.

---

## 6.6 THE GROUND-UP BUILD ROADMAP (from zero → launch in ~30 days)

Here's how the team builds the entire system from nothing, phased, mapped to the 30-day window. Each phase has a clear "done" bar. **The floor is sacred:** wake the list + hand out the free plan + plug the leaks + one honest VSL + five emails + DM every human. Everything above the floor is upside.

### Phase 0 — SETUP (roughly Days 1–3)
*Stand up the stack and the brand kit so the machine has rails.*
- **Accounts:** both bios live (Ian personal = priority, @athlos = proof/offer repo), Beehiiv workspace, Stripe account, the shared team channel + dashboard skeleton.
- **Stack wiring (engineers):** Stripe early-bird price IDs stubbed, `LAUNCH_MODE` gate in place, Beehiiv double-opt-in confirm-nudge configured (this fixes the #1 silent leak on Day 1).
- **Brand kit (Creative lead):** the Slovenian voice, the Hellenic visual look (kept as free differentiation), thumbnail/caption templates, the pillar plan + a starter problem-farming backlog.
- **Locks (Ian):** confirm the beachhead niche against the list's real sport mix; get Tim's minutes/week in writing.
- ✅ **Done when:** a piece of content could be posted and a lead could opt in and land in a working (if empty) sequence — the rails exist end-to-end.

### Phase 1 — FIRST CONTENT DAY + LEAD MAGNET LIVE (roughly Days 4–10)
*Turn on the two engines: content and the free offer.*
- **Lead magnet (engineers + Tim):** the sport-specific 7-day PDFs + 60-second assessment generated and live behind the opt-in.
- **First Content Day (Ian + Creative lead):** the pipeline runs its first full loop (idea→film→edit→package→schedule→post). Daily "dan X/30" documentation begins.
- **Wake the list (Funnel lead + Ian):** re-engagement sequence R0/R1/R2 sent; Ian starts mining his network by hand (the biggest week-1 lever); Tim's one post/story goes out.
- ✅ **Done when:** the lead magnet is live and converting, THE JOURNEY is publicly running, the warm list is awake and getting the free plan, and net-new confirmed leads are climbing.

### Phase 2 — AUDIENCE + LIST GROWTH + THE VSL (roughly Days 11–24)
*Grow the warm list and build the one convert asset.*
- **List growth (whole team):** network DMs continue, Beehiiv referral loop live, daily content → link-in-bio, Slovenian sport-community value drops. Target trajectory toward 80–200 leads.
- **Nurture (Funnel lead):** N1–N6 running so leads arrive at cart-open warm and primed.
- **The VSL (Ian + Creative lead):** record ONE honest 8–15 min founder-to-camera core video (why generic training fails → the system → the app working → the offer). Ship it rough; it becomes the gravity center every email and DM links to.
- **Launch prep (Funnel lead):** Stripe early-bird IDs finalized, abandonment recovery + dunning wired, the "JAZ" heads-up reply list built.
- ✅ **Done when:** the list is meaningfully bigger and warm, the VSL exists and is linkable, and every backend leak (confirm, checkout, abandonment, dunning) is plugged and tested.

### Phase 3 — LAUNCH (roughly Days 25–30)
*Open the cart to the warm list first and catch every lead by hand.*
- Flip `LAUNCH_MODE=live`; open to the warm Beehiiv list first (first crack at the 100).
- Run L1–L5 over a tight 5–7 day window; the live launch moment (IG/YT Live or launch-day Story series).
- **Manual close:** Ian personally DMs every clicker-who-didn't-buy and every "JAZ." This is the unfair advantage — at this scale a human "je vse ok?" recovers more carts than any automation.
- Funnel lead watches the scoreboard (checkout completion, members/100, MRR) daily.
- ✅ **Done when:** cart has opened and closed on schedule, every lead was personally caught, and the team has its first founding members + first testimonials. → **Day 31+:** onboarding, retention, dunning, and turning the flywheel for month 2 (where the compounding actually lives).

> **Blind-spot check:** the roadmap will feel like too much for a solo-ish team also shipping the app — because it is, if you try to do all of it perfectly. So the rule is: **if a week slips, protect the floor and cut from the top.** Skip the second content operation, skip the remix math, skip the mythology posts, skip a polished VSL. Never skip: the app ship date, waking the list, the free plan, one rough VSL, five emails, and DMing every human.

---

## 6.7 The 3 rules the team never breaks (+ the honest expectation)

**Rule 1 — Protect the app ship date above all.** The app shipping is the #1 marketing dependency; no product = no launch. Content and marketing serve the ship date, never the reverse. If marketing work is threatening the ship date, marketing yields — cut from the top of the roadmap (6.6), never from engineering.

**Rule 2 — Leads, not views. Always.** Every decision, every Monday review, every content call is judged by *confirmed leads and members*, not impressions. The moment anyone on the team is optimizing for a view count or celebrating a viral Reel that drove zero opt-ins, they're off-mission. This is the discipline the whole OS is built to enforce.

**Rule 3 — Never fake it, never leak it.** In a small market where everyone knows everyone, one whiff of a fake scarcity counter or a dishonest claim is permanent trust death. The "prvih 100 / za vedno" scarcity is real or it isn't used. And every lead is worth catching by hand — no confirmed lead leaks out of the funnel unnoticed, because at this volume every single one is a countable buyer.

### The honest expectation (the team internalizes this, or morale dies)
Plan emotionally for **~5 founding members** in month 1; be thrilled at 15. Confirmed leads of 40–150 by launch, ~8% converting, month-1 recurring revenue that is a **proof-of-model, not a salary.** The real asset the team builds is not the member count — it's the *warm, segmented list of right-fit Slovenian athletes + a working, leak-free checkout/retention machine + the first 5–10 testimonials.* 

The failure mode is **not** "only got 8 members." The failure mode is the team *feeling* like 8 is a flop and losing momentum before month 2, where the compounding lives. Do not measure this team against Iman's highlight reel — those numbers are marketing, and his one public financial data point showed insolvency. Measure against the floor: *did the machine get built, did the list get warm, did nothing leak, and can it run again next month without Ian burning out?* If yes, the team won.
