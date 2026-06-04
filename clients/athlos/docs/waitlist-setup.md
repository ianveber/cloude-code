# ATHLOS Waitlist — Email Capture, Double Opt-In, Weekly Promos

This is the setup guide for the pre-launch waitlist. The **code is done** — it runs
in demo mode right now. To make emails actually send and signups land in your
Google Sheet, do the 3 setup steps below, then fill `.env.local`.

## What the code does

```
Visitor → ATHLOS form (+ consent checkbox)  [used on /, /faq, /science, /tim, /klubi]
   └─→ POST /api/waitlist
         ├─ Beehiiv: add subscriber as PENDING → Beehiiv sends the double opt-in email
         │     └─ they click confirm → Beehiiv triggers your WEEKLY automation
         ├─ Supabase: insert row + early-bird position (already worked before)
         └─ Google Sheet: append a row so you see every signup live
At launch → POST /api/checkout → Stripe (gated by LAUNCH_MODE, see bottom)
```

Everything degrades gracefully: with no keys set, the form still works (demo mode).
Add Beehiiv → confirmation + weekly emails turn on. Add the Sheet URL → the live
list turns on. No code changes needed.

---

## Step 1 — Beehiiv (the email engine) · ~10 min

1. Create a free account at **beehiiv.com**, create a publication named **ATHLOS**.
2. **Turn on double opt-in:** Settings → *Subscribe flow* (or *Email confirmation*) →
   require email confirmation = ON. (Our API call also forces it per request, but
   set it here too as a backstop.)
3. **Customize the confirmation email** (Slovenian copy below).
4. **Get your keys:** Settings → **API** → create an API key. Note your
   **Publication ID** (looks like `pub_xxxxxxxx`).
5. Put them in `.env.local`:
   ```
   ESP_PROVIDER=beehiiv
   BEEHIIV_API_KEY=your_key
   BEEHIIV_PUBLICATION_ID=pub_xxxxxxxx
   ```
6. **Build the weekly send:** in Beehiiv create an **Automation** triggered on
   "subscription confirmed" (or just send weekly **Broadcasts** manually). First two
   drafts are below.

> Switching to ConvertKit/Kit later? Set `ESP_PROVIDER=convertkit`,
> `CONVERTKIT_API_KEY`, `CONVERTKIT_FORM_ID`. Set the form's opt-in to "double".

---

## Step 2 — Google Sheet (your live list) · ~3 min

1. Create a Google Sheet, e.g. **"ATHLOS Waitlist"**.
2. **Extensions → Apps Script.** Delete the placeholder, paste the whole file
   `scripts/athlos-waitlist-sheet.gs`.
3. (optional) set `SHEET_SECRET` in the script to a random string.
4. **Deploy → New deployment → Web app.** Execute as **Me**, Who has access **Anyone**.
   Deploy, authorize, and **copy the Web app URL** (ends in `/exec`).
5. Put it in `.env.local`:
   ```
   SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/AKfy.../exec
   SHEETS_WEBHOOK_SECRET=the_same_secret_if_you_set_one
   ```
6. Test: open the `/exec` URL in a browser — it should return `{"ok":true,...}`.

Columns written: `timestamp, email, status, position, source, sport, consent, utm_*`.
`status` is `pending` until they confirm — confirmed/unsubscribed status lives in
Beehiiv (the Sheet is the signup log; Beehiiv is the source of truth for confirmation).

---

## Step 3 — Privacy + the emails (content you own)

- **Privacy policy:** GDPR needs a privacy notice. Add a page (e.g. `/zasebnost`) and
  tell me — I'll link it from the consent checkbox. Until then the consent text is clear
  about what they're signing up for, which is the important part.
- **Write/approve the emails.** Drafts below — paste into Beehiiv and edit to taste.

---

## Slovenian email copy (paste into Beehiiv)

### A) Double opt-in confirmation email (Beehiiv → confirmation email)
**Subject:** Potrdi prijavo na ATHLOS waitlist
**Body:**
> Še zadnji korak.
>
> Klikni gumb spodaj in potrdi, da želiš prejemati ATHLOS e-pošto — nasvete za fizično
> pripravo od Tima Drenovca in povabilo z early bird ceno, ko aplikacija izide.
>
> **[ Potrdi prijavo ]**
>
> Če se nisi prijavil ti, sporočilo mirno ignoriraj — brez tvoje potrditve ne pošljemo nič.

### B) Welcome email (automation: trigger = "confirmed")
**Subject:** Notri si. Mesto z early bird ceno je zakleneno 🔒
**Body:**
> Potrjeno — tvoj email je na ATHLOS waitlistu.
>
> Kaj to pomeni: ko jeseni 2026 lansiramo, dobiš povabilo **pred vsemi ostalimi** in
> **€29/mes za vedno** (redna cena €49). Cena ti ne raste, dokler si naročnik.
>
> Do takrat ti vsak teden pošljemo en konkreten nasvet za pripravo — periodizacija,
> okrevanje, prehrana — iz iste baze protokolov, ki poganja aplikacijo.
>
> Do kmalu,
> Ekipa ATHLOS

### C) First weekly promo (template to reuse)
**Subject:** {konkreten hook, npr. "Zakaj te boli koleno pri počepu (in kaj namesto)"}
**Body:**
> **Nasvet tedna.** {1 jasna ideja, 3–5 stavkov — npr. zamenjava vaje pri bolečini,
> deload teden, carb-loading pred tekmo. Avtor: Tim Drenovc.}
>
> To je točno logika, ki jo ATHLOS naredi avtomatsko za tvoj šport in sezono.
>
> **Lansiranje:** jesen 2026 · early bird €29/mes za prvih 100. Ti si že notri.
> Pošlji povezavo prijatelju, ki to potrebuje: athlos.si
>
> _Odjava kadarkoli — link spodaj._

---

## Launch — turning on membership purchases (later)

The Stripe hook is built and gated. When the app drops:
1. Stripe Dashboard → create Products + recurring Prices for Basic/Pro/Elite.
2. Fill `STRIPE_PRICE_BASIC/_PRO/_ELITE` (+ `STRIPE_SECRET_KEY`) in `.env.local`.
3. Set `LAUNCH_MODE=live`.
4. Wire a "Buy" button to `POST /api/checkout` with `{ plan, email }` → redirect to `url`.
5. (recommended) add `/api/stripe/webhook` to write paid subscriptions into the
   `subscriptions` table that already exists in `supabase/schema.sql`.

Until `LAUNCH_MODE=live`, `/api/checkout` returns 503 with a friendly "join the
waitlist" message — safe to leave deployed.

---

## Optional follow-ups (not built yet — ask me)
- **Confirmed-status sync:** a Beehiiv webhook → flip the Sheet row to `confirmed`.
- **Privacy page** + link it into the consent checkbox.
- **Full Stripe checkout** wiring (button → checkout → webhook → Supabase) at launch.
