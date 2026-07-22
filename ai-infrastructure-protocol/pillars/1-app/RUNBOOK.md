# Pillar ① App — RUNBOOK

The operational companion to `README.md` and `SKILL.md`. This turns every manual
moment of an app build into a numbered do-this-exactly procedure, so the AIS
operator never guesses and the client always knows precisely what to do.

Scope: building the client's apps / dashboards / portals via the four-gate app
engine (`../../../3day-protocol/`). The engine automates synthesis, code, RLS,
security scan, and deploy-verify. The MANUAL moments — the ones a human must do —
are: **provisioning accounts + credentials** (Supabase, Vercel, domain/DNS,
third-party API keys), **collecting brand/content assets**, **scope + design
sign-off**, **deploy/go-live approval**, and **custom-domain DNS records**. Each
gets an exact procedure below.

> Two gate numberings. This pillar's app runs use the **app engine's** own
> `gate-0..3` inside `~/builds/<artifactId>/.protocol/`. The **protocol's** G0–G4
> live in the engagement-root `.protocol/`. When this file says "gate-2" it means
> the app engine's security gate; "G2/G3" means the protocol's BUILD/SECURE gates.

---

## 1. Hands-free vs not

| Fully automated (engine) | AIS operator (in Claude Code) | Client (human, one-time) |
|---|---|---|
| Scaffold Next.js + Supabase + Vercel from ais-os skeleton | Compile spec.json from discovery answers | Create Supabase project + paste keys |
| RLS policy + pgTAP negative-case generation | Drive the four gates (`gate-check 0..3`) | Create/authorize Vercel account + team |
| Secret scan (gitleaks / regex fallback) | Produce 2–3 design variants | Approve ONE design variant (sign-off) |
| Input-validation heuristics on API routes | Run design lint + present variant | Supply brand assets + real content |
| Local shadow-DB security pass (gate-2) | Wire third-party API keys into Vercel env | Provide third-party API keys (Stripe, etc.) |
| Deployed anon RLS probe on protected routes | Deploy to Vercel, run live verify | Approve go-live |
| SHIP-REPORT.md render | Register artifact in engagement `.protocol/` | Add DNS records to point domain at Vercel |
| Deploy hard-block below gate-2 green | Configure custom domain in Vercel | Confirm domain resolves + smoke-checks OK |

Rule of thumb: **anything requiring a login the operator does not own, an asset
only the client has, or a real-world go-live decision is CLIENT.** Everything
else the engine or operator does.

---

## 2. Operator runbook

All operator work happens in a Claude Code session **started inside the run
directory** `~/builds/<artifactId>/` (off iCloud — the engine's hooks only fire
for a session rooted there, and iCloud breaks `next dev` + `node_modules`).

**O1 — Receive the backlog item.** Pull the app-kind item from `blueprint.json`
(actors, core actions, data-to-remember, access rules, launch checklist). If any
field is thin, do not invent it — it goes back through discovery, not into code.
-> invoke `spec`

**O2 — Scaffold the run.**
```bash
mkdir -p ~/builds/<artifactId> && cd ~/builds/<artifactId>   # START SESSION HERE
"/Users/ianveber/Desktop/Cloude CODE/3day-protocol/bin/gate-check" init ~/builds/<artifactId>
gate-check doctor    # node, supabase CLI, Docker RUNNING, vercel CLI, Playwright, gitleaks
```
Doctor failures are gate-0 failures — resolve before proceeding. Docker must be
actually running (gate-2 needs a local shadow DB).
-> invoke `3day-app-protocol`

**O3 — Turn discovery answers into spec.json (P1).** Run the intake question set
against the client's answers, compile into `.protocol/spec.json` (single source
of truth). Capture actors, core actions, data, plain-language access rules ("a
coach sees only their own athletes"), `protectedRoutes` (≥1 required), and the
launch checklist. Verify the provisioning checklist items from §3 are done, then
`gate-check 0`.
-> invoke `web-intake`

**O4 — Design variants (P2).** Produce 2–3 variants for the core screens. Client
tools/dashboards/portals = Apple-style light minimalism, technical jargon hidden
behind plain language; marketing-facing screens must clear the photoreal quality
bar (never ship code-only Three.js as a hero).
-> invoke `ian-design-standards`

**O5 — Lint the chosen variant, then take sign-off.**
```bash
gate-check 1                      # axe contrast, type-scale, asset res, hero heuristic
gate-check 1 --approve "<Client Name>"   # REFUSED until lint is green
```
Present the variant + lint report to the client before recording approval.
-> invoke `plan-design-review`

**O6 — Build (P3).** Scaffold from ais-os: schema.sql, RLS (deny-by-default on
every table), SSR auth helpers, useStore. Drive every schema/policy/auth decision
from spec.json. Every API route validates input (zod). No secrets in code;
service-role keys never touch `NEXT_PUBLIC_*`. Commit early and often (gates
record HEAD).
-> invoke `supabase`

**O7 — Security pass (P4 → gate-2).**
```bash
gate-check 2      # pgTAP RLS (local shadow DB) + secret scan + input-validation heuristics
```
A zero-test pgTAP suite or a missing supabase CLI is RED, never a skip. Fix reds
and re-run. Break-glass `gate-check 2 --attest "<name>: <reason>"` only if tooling
is genuinely down — it red-banners the SHIP-REPORT and counts as an intervention.
-> invoke `security-review`

**O8 — Wire third-party keys into Vercel env (operator, from client-supplied
keys).** For each key the client provided (§3 step C6), set it as a Vercel
environment variable — never commit it:
```bash
vercel env add STRIPE_SECRET_KEY production      # paste value when prompted
vercel env add ANTHROPIC_API_KEY production
# public-safe values only:
vercel env add NEXT_PUBLIC_SUPABASE_URL production
```
Service-role / secret keys go to `production` (and `preview` if needed) scope,
NOT `NEXT_PUBLIC_*`. Re-deploy after adding envs.
-> invoke `deploy-to-vercel`

**O9 — Deploy + live verify (P5 → gate-3).** The deploy-guard hook lets deploys
through only on a fresh green gate-2.
```bash
vercel deploy --prod        # writes prod URL into spec.deployUrl
gate-check 3 --url <prod-url>   # 200 check + anon RLS probe on protectedRoutes + smoke
```
Anon probe MUST return 401/403/redirect on every protected route (a 200 is RED).
Green renders `SHIP-REPORT.md`.
-> invoke `land-and-deploy`

**O10 — Custom domain (operator side).** In the Vercel project → Settings →
Domains, add the client's domain. Vercel shows the exact records to create; hand
those to the client (§3 step C8). After the client adds them, verify:
```bash
vercel domains inspect <domain>      # confirms verification + cert issuance
dig <domain> +short                  # confirms it resolves to Vercel
```
-> invoke `setup-deploy`

**O11 — Register the artifact + close the pillar's contribution.** Record the run
in the engagement-root `.protocol/artifacts.json` (id, kind:app, run path,
SHIP-REPORT path, gate-2 + gate-3 evidence links). Confirm the SHIP-REPORT is
green before the artifact is offered to the protocol's G3 SECURE gate.
-> invoke `verification-before-completion`

**O12 — Final QA sweep against the live deployment.** Drive the deployed app as a
real user (signup → core action → persist → access-boundary check) before calling
it done.
-> invoke `qa`

---

## 3. Client actions

Plain-language steps a non-technical owner can follow. Do these in order; each
takes 5–15 minutes. Wherever it says "paste to us", paste into the shared secure
note / password manager entry we sent you — never into email or chat.

**C1 — Create a Supabase project (the app's database).**
1. Go to https://supabase.com → **Start your project** → sign in with Google/GitHub.
2. Click **New project**. Name it (e.g. `acme-portal`), pick region **Europe
   (Frankfurt / eu-central-1)** for EU data residency, set a strong database
   password (save it in your password manager).
3. Wait ~2 min for it to provision.
4. Open **Project Settings → API**. Copy and paste to us: **Project URL**, the
   **anon public** key, and the **service_role** key (this last one is secret —
   treat it like a master password).
5. Open **Project Settings → General** and paste us the **Reference ID**.

**C2 — Create / authorize a Vercel account (where the app lives online).**
1. Go to https://vercel.com → **Sign Up** (use "Continue with GitHub" if you have
   GitHub; otherwise email).
2. If we're deploying under your account, add us as a member: **Settings → Members
   → Invite** the email we give you, role **Member**. (Or you can create the
   project and give us the deploy token we request — we'll tell you which.)
3. That's it — we handle the deployment itself.

**C3 — Turn OFF Vercel git auto-deploy for this project (we deploy manually so
security gates stay the single choke point).** If we ask you to do this step:
Project → **Settings → Git → Ignored Build Step / Deployments** and disable
automatic production deploys. (We'll usually do this for you.)

**C4 — Send us your brand assets.** Drop into the shared Drive folder we created:
logo (SVG or high-res PNG, transparent background), brand colors (hex codes or a
brand guide), fonts (files or Google Fonts names), and any product photos. If you
don't have these, tell us — we'll generate placeholders and flag them.

**C5 — Send us the real content.** The actual words and data the app shows: page
copy, category/product names, example records, user roles and who-sees-what in
plain language ("a coach sees only their own athletes; an admin sees everyone").
This becomes the app's access rules — be precise.

**C6 — Provide third-party API keys (only the ones your app needs).** For each
service we listed (e.g. Stripe for payments, an email provider, a maps or AI key):
1. Log into that service's dashboard.
2. Find **Developers → API keys** (Stripe), or **Settings → API** (most others).
3. Copy the key(s) and paste to us in the shared secure note. For Stripe, send
   both the **Publishable key** (`pk_...`) and the **Secret key** (`sk_...`), and
   tell us if it's test or live mode.
We paste these into the server environment for you — they never live in the code.

**C7 — Approve the design.** We'll send you 2–3 versions of the main screens plus
an automated quality report. Reply with the ONE you want (by name/number). We
cannot start building the visible app until you pick one — this is your sign-off.

**C8 — Point your domain at the app (DNS records).** After we add your domain in
Vercel, we'll send you the exact records. In your domain registrar (GoDaddy,
Namecheap, Cloudflare, etc.) → **DNS / Manage DNS**, add:
- For a root domain `acme.com`: an **A record** — Host `@`, Value `76.76.21.21`.
- For `www` or a subdomain `app.acme.com`: a **CNAME record** — Host `www` (or
  `app`), Value `cname.vercel-dns.com`.
Save. DNS can take from a few minutes up to a few hours to take effect. Tell us
when it's saved and we'll confirm it went live and issue the HTTPS certificate.
(If your DNS is on Cloudflare, set the record to **DNS only / grey cloud**, not
proxied, until we confirm the certificate.)

**C9 — Approve go-live.** Once the app is verified on the live URL, we ask for
your explicit "go" before we announce or connect it to your real customers.
Nothing goes live to your users without this.

---

## 4. What we need from you (send-to-client checklist)

Copy-paste this to the client for the App pillar:

- [ ] **Supabase:** Project URL + anon key + service_role key + Reference ID
      (create at supabase.com, EU region) → paste to shared secure note
- [ ] **Vercel:** account created + us invited as a Member (or a deploy token)
- [ ] **Brand assets:** logo (SVG/PNG), colors (hex), fonts, product photos → Drive folder
- [ ] **Real content:** page copy, records/examples, user roles + who-sees-what in plain words
- [ ] **Third-party API keys** (only if your app uses them): Stripe / email / AI / maps
      keys → shared secure note, note test vs live
- [ ] **Design sign-off:** pick ONE of the variants we send
- [ ] **Domain:** registrar login access OR willingness to add the 2 DNS records we send
- [ ] **Go-live approval:** your explicit "go" after live verification

We handle: all coding, the database security, deployment, environment secrets,
and the certificate. You handle: the accounts above, the assets, and the two
approvals (design + go-live).

---

## 5. Gate evidence

What an app run contributes to the protocol so the relevant gates turn green.

**Into the app engine's own `~/builds/<artifactId>/.protocol/`** (produced by the
four gates — this is the app's internal proof):
- `gates/gate-0.json` — spec valid + provisioning checklist (Supabase, Vercel, git)
- `gates/gate-1.json` — design lint green + named human approver
- `gates/gate-2.json` — security pass green, records git HEAD; evidence in
  `evidence/gate2-rls.txt` (pgTAP TAP summary) + secret-scan + input-validation findings
- `gates/gate-3.json` — live 200 + `evidence/gate3-probe.txt` (anon RLS probe on
  every protectedRoute) + smoke result
- `SHIP-REPORT.md` — the rendered handover artifact (gates table, security
  results, overrides/attestations, credentials handling)

**Into the engagement-root `.protocol/`** (what makes the PROTOCOL's gates green):
- `artifacts.json` — one entry per built app: `{ id, kind:"app", runPath,
  shipReport: "<path>/SHIP-REPORT.md", gate2Evidence, gate3Evidence, deployUrl,
  status }`. This registration is what **protocol G2 BUILD** checks: every
  "this-sprint" app item is built, registered, and green on its own SHIP-REPORT.
- The app's green gate-2 (RLS proven + secret scan + input validation) is the
  evidence **protocol G3 SECURE** reuses for app-kind artifacts — Pillar ⑤ reads
  it rather than re-running the app's security pass. A stale or `--attest` gate-2
  is NOT green for G3 purposes.
- `gates/gate-2.json` (protocol root) turns green for the app portion only when
  every registered app artifact's SHIP-REPORT is green and drift-free.

An app artifact counts as "shipped" for the protocol only when its SHIP-REPORT is
green AND it is registered in the engagement `artifacts.json`. A missing
SHIP-REPORT = the run is not finished, regardless of what is deployed.
