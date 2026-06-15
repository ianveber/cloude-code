# INSPECTUS Center — Phase 2 setup (≈5 minutes)

Auth + saved runs run on Supabase. Until you paste the two keys below, the app stays in **seed mode** (no login, sample data) — fully usable, nothing breaks. Once the keys are in, login + history + KPIs + team go live.

## Steps

1. **Create the project** — https://supabase.com → **New project**
   - Name: `inspectus-center`
   - Region: **EU (Frankfurt)**
   - Save the database password somewhere safe.

2. **Run the schema** — Supabase → **SQL Editor** → paste the *entire* contents of `supabase/schema.sql` → **Run**.
   - Before running, edit the admin allowlist near the top of that file if you want Anej/Nejc to be admins (uncomment + add their emails). `ian.veber@gmail.com` is already in.

3. **Copy the keys** — Project Settings → **Data API** → copy:
   - **Project URL**
   - **anon / publishable** key (this one is safe to expose — it's gated by RLS).

4. **Paste into `inspectus-os/.env.local`** (keep the existing `ANTHROPIC_API_KEY` line):
   ```
   ANTHROPIC_API_KEY=sk-ant-...        # already there
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```

5. **Email auth** — Authentication → Providers → **Email**: enable.
   - For fast testing, turn **Confirm email** OFF. Turn it back **ON** before handing the app to the client.

6. **Run it** — `bun run dev` → http://localhost:3020
   - You'll be redirected to `/prijava`.
   - Sign in with `ian.veber@gmail.com` + any password (the account is created on first sign-in). You're in as **Skrbnik** (admin).

## Acceptance checklist (after keys are in)

- [ ] Logged out → every route redirects to `/prijava`.
- [ ] Password login works; "Pošlji magično povezavo" sends an email.
- [ ] Process `public/sample-survey-report.xlsx` → `✓ Shranjeno v Zgodovino` appears.
- [ ] The run shows in **Domov** KPIs and in the **Zgodovina** list.
- [ ] Open it from Zgodovina → all 5 panels rehydrate; VLDR / VIN-FILAJ re-download works.
- [ ] **Nastavitve** lists you as Skrbnik; role toggle is present (admin only).
- [ ] **Odjava** → back to `/prijava`; protected routes unreachable.

## Security notes (for the record)

- The **anon key is publishable by design** — it grants nothing beyond what Row-Level Security allows.
- The signup gate (`@inspectus.si` + admin allowlist) is enforced **in the database** (`handle_new_user` trigger) — it cannot be bypassed from the browser.
- **No service-role key** is used anywhere in this app.
- All run/profile reads and writes happen **server-side**; the browser only does the auth handshake on `/prijava`.

## Deploy (separate step, when ready)

Verify the checklist locally first. Then `vercel --prod` from `inspectus-os/`, set the same three env vars in Vercel (Production), and switch **Confirm email** back ON in Supabase.
