# INSPEKTUS OS — Phase 2: Auth + Saved Runs — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the seed-mode INSPECTUS OS into a real multi-user product: login, automatic saving of every VLDR run, a Zgodovina history page, live Domov KPIs, and a Nastavitve team page — all server-side, RLS-protected, with effortless Slovene UX.

**Architecture:** Next 16 App Router + `@supabase/ssr`. Auth handshake on the client only at `/prijava`; all run/profile data access through server components + server actions using `lib/supabase/server.ts`. Root `middleware.ts` gates every `(app)` route. The DB schema, RLS, and signup gate already exist in `supabase/schema.sql`. Seed mode (no Supabase env) is preserved so nothing breaks before keys are pasted.

**Tech Stack:** Next.js 16, React 19, `@supabase/ssr`, TypeScript, the existing `lib/vldr/transform.ts` ETL.

**Working dir for all commands:** `INSPEKTUS/inspectus-os/`. Tests run with `bun test`. Dev server: `bun run dev` → http://localhost:3020.

---

## File Structure

**Create**
- `src/lib/runs.ts` — `RunRecord` type, `deriveCounts()` (pure), `saveRun()`, `listRuns()`, `getRun()`.
- `src/lib/runs.deriveCounts.test.ts` — unit test for `deriveCounts`.
- `src/lib/auth.ts` — `getSessionUser()` + `signOut()` server helpers.
- `middleware.ts` (project root) — session refresh + `(app)` route guard.
- `src/app/prijava/page.tsx` — login UI (client).
- `src/app/prijava/actions.ts` — `signInPassword`, `sendMagicLink` server actions.
- `src/app/auth/callback/route.ts` — code → session exchange.
- `src/app/(app)/zgodovina/page.tsx` — history list (server).
- `src/app/(app)/zgodovina/[id]/page.tsx` — run detail (server) + rehydrate.
- `src/components/RunDetailView.tsx` — client tabbed view reusing result panels.
- `src/components/SaveStatus.tsx` — client auto-save indicator + caller.
- `src/app/(app)/nastavitve/page.tsx` — team roster (server).
- `src/app/(app)/nastavitve/actions.ts` — `setRole` admin action.
- `src/components/SignOutButton.tsx` — client button calling `signOut`.

**Modify**
- `src/components/TopBar.tsx` — show signed-in email + sign-out (server component).
- `src/app/(app)/obdelava/page.tsx` — mount `SaveStatus` when `ready`.
- `src/app/(app)/page.tsx` — Domov KPIs from `listRuns()` with seed fallback.

**Untouched:** `useVldrPipeline`, `transform.ts`, all `vldr/` result components, AI routes, `schema.sql`.

---

### Task 1: `deriveCounts` — the one pure, tested unit

**Files:**
- Create: `src/lib/runs.ts`
- Test: `src/lib/runs.deriveCounts.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/runs.deriveCounts.test.ts
import { expect, test } from "bun:test";
import { deriveCounts } from "./runs";

test("deriveCounts sums vehicles, damages, and finds the max", () => {
  const vehicles = [
    { vin: "A", damages: [{}, {}] },          // 2
    { vin: "B", damages: [{}, {}, {}, {}] },  // 4
    { vin: "C", damages: [] },                // 0
  ];
  expect(deriveCounts(vehicles)).toEqual({
    vehicle_count: 3,
    total_damages: 6,
    max_damages: 4,
  });
});

test("deriveCounts handles an empty run", () => {
  expect(deriveCounts([])).toEqual({ vehicle_count: 0, total_damages: 0, max_damages: 0 });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test src/lib/runs.deriveCounts.test.ts`
Expected: FAIL — `deriveCounts` not exported from `./runs`.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/lib/runs.ts
export function deriveCounts(vehicles: any[]): {
  vehicle_count: number; total_damages: number; max_damages: number;
} {
  let total = 0, max = 0;
  for (const v of vehicles) {
    const n = v?.damages?.length ?? 0;
    total += n;
    if (n > max) max = n;
  }
  return { vehicle_count: vehicles.length, total_damages: total, max_damages: max };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test src/lib/runs.deriveCounts.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/runs.ts src/lib/runs.deriveCounts.test.ts
git commit -m "feat(inspectus-os): deriveCounts for run persistence"
```

---

### Task 2: `runs.ts` data layer — save / list / get

**Files:**
- Modify: `src/lib/runs.ts`

- [ ] **Step 1: Append the type + server functions to `src/lib/runs.ts`**

Add at the top of the file: `"use server";` is NOT used here (this module also exports the pure `deriveCounts` used in a unit test). Mark only the async DB functions; keep them server-only by importing the server client. Add:

```ts
import { createClient } from "@/lib/supabase/server";
import { maxDamageCount } from "@/lib/vldr/transform";

export type RunInput = {
  sourceFilename: string;
  header: { date: string; transport_id: string; delivering_party: string; receiving_party: string; location: string };
  stats: any;
  summary: any;       // { text } | { error }
  validation: any;
  vehicles: any[];
  rawRows: any[];
};

export type RunRecord = {
  id: string;
  created_at: string;
  created_by: string | null;
  source_filename: string | null;
  report_date: string | null;
  transport_id: string | null;
  delivering_party: string | null;
  receiving_party: string | null;
  location: string | null;
  vehicle_count: number;
  total_damages: number;
  max_damages: number;
  stats: any;
  summary: string | null;
  validation: any;
  vehicles: any[] | null;
  raw_rows: any[] | null;
};

function configured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function saveRun(input: RunInput): Promise<{ ok: boolean; id?: string; error?: string }> {
  if (!configured()) return { ok: false, error: "seed-mode" };
  try {
    const supabase = await createClient();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return { ok: false, error: "no-session" };
    const counts = deriveCounts(input.vehicles);
    const { data, error } = await supabase.from("runs").insert({
      created_by: auth.user.id,
      source_filename: input.sourceFilename || null,
      report_date: input.header.date || null,
      transport_id: input.header.transport_id || null,
      delivering_party: input.header.delivering_party || null,
      receiving_party: input.header.receiving_party || null,
      location: input.header.location || null,
      vehicle_count: counts.vehicle_count,
      total_damages: counts.total_damages,
      max_damages: counts.max_damages,
      stats: input.stats ?? null,
      summary: input.summary?.text ?? null,
      validation: input.validation ?? null,
      vehicles: input.vehicles ?? null,
      raw_rows: input.rawRows ?? null,
    }).select("id").single();
    if (error) return { ok: false, error: error.message };
    return { ok: true, id: data.id };
  } catch (e: any) {
    return { ok: false, error: e?.message ?? "unknown" };
  }
}

export async function listRuns(): Promise<RunRecord[]> {
  if (!configured()) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("runs")
      .select("id,created_at,created_by,source_filename,report_date,transport_id,delivering_party,receiving_party,location,vehicle_count,total_damages,max_damages")
      .order("created_at", { ascending: false });
    if (error) return [];
    return (data ?? []) as RunRecord[];
  } catch { return []; }
}

export async function getRun(id: string): Promise<RunRecord | null> {
  if (!configured()) return null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("runs").select("*").eq("id", id).single();
    if (error || !data) return null;
    return data as RunRecord;
  } catch { return null; }
}

export function maxDamages(vehicles: any[]): number {
  return maxDamageCount(vehicles);
}
```

- [ ] **Step 2: Typecheck**

Run: `bunx tsc --noEmit`
Expected: no errors from `src/lib/runs.ts`. (Pre-existing `// @ts-nocheck` files are unaffected.)

- [ ] **Step 3: Re-run the unit test (regression)**

Run: `bun test src/lib/runs.deriveCounts.test.ts`
Expected: PASS — adding the DB functions must not break `deriveCounts`.

- [ ] **Step 4: Commit**

```bash
git add src/lib/runs.ts
git commit -m "feat(inspectus-os): runs data layer — saveRun/listRuns/getRun"
```

---

### Task 3: Auth helpers + root middleware guard

**Files:**
- Create: `src/lib/auth.ts`
- Create: `middleware.ts` (project root)

- [ ] **Step 1: Create `src/lib/auth.ts`**

```ts
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export async function getSessionUser() {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    return data.user ?? null;
  } catch { return null; }
}

export async function signOut() {
  if (!isSupabaseConfigured()) return;
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch { /* ignore */ }
}
```

- [ ] **Step 2: Create root `middleware.ts`**

```ts
import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Seed mode: no auth wired — let everything render.
  if (!url || !key) return NextResponse.next({ request });

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() { return request.cookies.getAll(); },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;
  const isAuthRoute = path.startsWith("/prijava") || path.startsWith("/auth");

  if (!user && !isAuthRoute) {
    const to = request.nextUrl.clone();
    to.pathname = "/prijava";
    return NextResponse.redirect(to);
  }
  if (user && path.startsWith("/prijava")) {
    const to = request.nextUrl.clone();
    to.pathname = "/";
    return NextResponse.redirect(to);
  }
  return response;
}

export const config = {
  // Run on everything except static assets and the favicon/logo.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|inspectus-logo.png|sample-survey-report.xlsx).*)"],
};
```

- [ ] **Step 3: Typecheck**

Run: `bunx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 4: Verify seed mode still boots (no env)**

Run: `bun run dev` then visit http://localhost:3020 — Domov renders with seed data, no redirect (because env is unset). Stop the server.

- [ ] **Step 5: Commit**

```bash
git add src/lib/auth.ts middleware.ts
git commit -m "feat(inspectus-os): auth helpers + route-guard middleware (seed-safe)"
```

---

### Task 4: Login page `/prijava` + actions + callback

**Files:**
- Create: `src/app/prijava/actions.ts`
- Create: `src/app/prijava/page.tsx`
- Create: `src/app/auth/callback/route.ts`

- [ ] **Step 1: Create `src/app/prijava/actions.ts`**

```ts
"use server";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function signInPassword(_prev: any, formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  if (!email || !password) return { error: "Vnesi email in geslo." };
  const supabase = await createClient();
  // Sign in; if the account doesn't exist yet, create it (gate enforced by DB trigger).
  let { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    const signUp = await supabase.auth.signUp({ email, password });
    if (signUp.error) return { error: maps(signUp.error.message) };
  }
  redirect("/");
}

export async function sendMagicLink(_prev: any, formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  if (!email) return { error: "Vnesi email." };
  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? "";
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${origin}/auth/callback` },
  });
  if (error) return { error: maps(error.message) };
  return { sent: true };
}

function maps(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("ni dovoljen") || m.includes("not allowed")) return "Ta email ni dovoljen za INSPECTUS Center.";
  if (m.includes("invalid login")) return "Napačen email ali geslo.";
  if (m.includes("already registered")) return "Napačen email ali geslo.";
  return "Prijava ni uspela. Poskusi znova.";
}
```

- [ ] **Step 2: Create `src/app/prijava/page.tsx`**

```tsx
"use client";
import { useActionState, useState } from "react";
import Image from "next/image";
import { signInPassword, sendMagicLink } from "./actions";

export default function Prijava() {
  const [pwState, pwAction, pwPending] = useActionState(signInPassword, {} as any);
  const [mlState, mlAction, mlPending] = useActionState(sendMagicLink, {} as any);
  const [showMagic, setShowMagic] = useState(false);

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f5f7f9" }}>
      <div style={{ width: 360, background: "#fff", borderRadius: 14, padding: 32, boxShadow: "0 6px 30px rgba(16,42,67,.08)" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <Image src="/inspectus-logo.png" alt="INSPECTUS" width={160} height={42} priority />
        </div>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: "var(--navy-deep)", textAlign: "center", marginBottom: 4 }}>Prijava v Center</h1>
        <p style={{ fontSize: 13, color: "#6b7280", textAlign: "center", marginBottom: 22 }}>Dostop za ekipo INSPECTUS.</p>

        {!showMagic ? (
          <form action={pwAction}>
            <label style={lbl}>Email</label>
            <input name="email" type="email" required autoComplete="email" style={inp} placeholder="ime@inspectus.si" />
            <label style={lbl}>Geslo</label>
            <input name="password" type="password" required autoComplete="current-password" style={inp} />
            {pwState?.error && <div style={err}>{pwState.error}</div>}
            <button type="submit" disabled={pwPending} style={btn}>{pwPending ? "Prijavljam…" : "Prijava"}</button>
            <button type="button" onClick={() => setShowMagic(true)} style={linkBtn}>Pošlji magično povezavo namesto gesla</button>
          </form>
        ) : (
          <form action={mlAction}>
            <label style={lbl}>Email</label>
            <input name="email" type="email" required autoComplete="email" style={inp} placeholder="ime@inspectus.si" />
            {mlState?.error && <div style={err}>{mlState.error}</div>}
            {mlState?.sent
              ? <div style={{ ...ok }}>Povezava poslana — preveri svoj email. ✉️</div>
              : <button type="submit" disabled={mlPending} style={btn}>{mlPending ? "Pošiljam…" : "Pošlji povezavo"}</button>}
            <button type="button" onClick={() => setShowMagic(false)} style={linkBtn}>Nazaj na geslo</button>
          </form>
        )}
      </div>
    </div>
  );
}

const lbl: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 600, color: "#374151", margin: "10px 0 4px" };
const inp: React.CSSProperties = { width: "100%", padding: "10px 12px", border: "1px solid #d7dee4", borderRadius: 8, fontSize: 14, outline: "none" };
const btn: React.CSSProperties = { width: "100%", marginTop: 18, padding: "11px", background: "var(--navy, #16324f)", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer" };
const linkBtn: React.CSSProperties = { width: "100%", marginTop: 12, background: "none", border: "none", color: "#6b7280", fontSize: 12.5, cursor: "pointer", textDecoration: "underline" };
const err: React.CSSProperties = { marginTop: 12, color: "#a01f0a", fontSize: 13 };
const ok: React.CSSProperties = { marginTop: 16, color: "var(--success, #1a7f37)", fontSize: 13, fontWeight: 600, textAlign: "center" };
```

- [ ] **Step 3: Create `src/app/auth/callback/route.ts`**

```ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}/`);
  }
  return NextResponse.redirect(`${origin}/prijava?napaka=povezava`);
}
```

- [ ] **Step 4: Typecheck**

Run: `bunx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 5: Commit**

```bash
git add src/app/prijava src/app/auth
git commit -m "feat(inspectus-os): /prijava login (password + magic link) + auth callback"
```

---

### Task 5: TopBar identity + sign-out

**Files:**
- Create: `src/components/SignOutButton.tsx`
- Modify: `src/components/TopBar.tsx`

- [ ] **Step 1: Create `src/components/SignOutButton.tsx`**

```tsx
"use client";
import { signOut } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function SignOutButton() {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <button
      onClick={() => start(async () => { await signOut(); router.replace("/prijava"); router.refresh(); })}
      disabled={pending}
      style={{ fontSize: 12, color: "#6b7280", background: "none", border: "1px solid #e1e7ec", borderRadius: 7, padding: "5px 10px", cursor: "pointer" }}
    >
      {pending ? "Odjavljam…" : "Odjava"}
    </button>
  );
}
```

Note: `signOut` is an async function in `src/lib/auth.ts`. To call it from a client component it must be a server action. Add `"use server";` at the very top of a **new** wrapper instead: create `src/lib/auth-actions.ts`:

```ts
"use server";
export { signOut } from "@/lib/auth";
```

Then import `signOut` in `SignOutButton.tsx` from `@/lib/auth-actions` (not `@/lib/auth`).

- [ ] **Step 2: Modify `src/components/TopBar.tsx`** (becomes an async server component)

```tsx
import { getSessionUser } from "@/lib/auth";
import SignOutButton from "@/components/SignOutButton";

export default async function TopBar() {
  const user = await getSessionUser();
  return (
    <header className="topbar">
      <div style={{ fontWeight: 700, color: "var(--navy-deep)" }}>INSPECTUS Center</div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ fontSize: 12, color: "#6b7280", textTransform: "uppercase", letterSpacing: ".1em" }}>
          AI · VLDR poveljniški center
        </div>
        {user && (
          <>
            <span style={{ fontSize: 12.5, color: "#374151" }}>{user.email}</span>
            <SignOutButton />
          </>
        )}
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Fix the import in `SignOutButton.tsx`**

Change line 2 to: `import { signOut } from "@/lib/auth-actions";`

- [ ] **Step 4: Typecheck**

Run: `bunx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/TopBar.tsx src/components/SignOutButton.tsx src/lib/auth-actions.ts
git commit -m "feat(inspectus-os): TopBar shows signed-in user + sign-out"
```

---

### Task 6: Auto-save on completed run

**Files:**
- Create: `src/components/SaveStatus.tsx`
- Modify: `src/app/(app)/obdelava/page.tsx`

- [ ] **Step 1: Create `src/components/SaveStatus.tsx`**

```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { saveRun, type RunInput } from "@/lib/runs";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export default function SaveStatus({ ready, payload }: { ready: boolean; payload: () => RunInput }) {
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const savedRef = useRef(false);

  useEffect(() => {
    if (!ready || savedRef.current) return;
    if (!isSupabaseConfigured()) return; // seed mode: nothing to save
    savedRef.current = true;
    setState("saving");
    saveRun(payload())
      .then(r => setState(r.ok ? "saved" : "error"))
      .catch(() => setState("error"));
  }, [ready, payload]);

  if (!isSupabaseConfigured() || state === "idle") return null;
  const map = {
    saving: { t: "Shranjevanje…", c: "#6b7280" },
    saved: { t: "✓ Shranjeno v Zgodovino", c: "var(--success, #1a7f37)" },
    error: { t: "Ni shranjeno — preveri prijavo (izdelki spodaj delujejo).", c: "#a01f0a" },
  } as const;
  const s = map[state];
  return <div style={{ fontSize: 13, fontWeight: 600, color: s.c, margin: "8px 0" }}>{s.t}</div>;
}
```

`saveRun` is a server action (it runs server-side because `runs.ts` imports the server Supabase client). To make it callable from this client component, add `"use server";` to a thin re-export: create `src/lib/runs-actions.ts`:

```ts
"use server";
export { saveRun } from "@/lib/runs";
```

Then import `saveRun` in `SaveStatus.tsx` from `@/lib/runs-actions`, and import only the **type** `RunInput` from `@/lib/runs`:

```ts
import { saveRun } from "@/lib/runs-actions";
import type { RunInput } from "@/lib/runs";
```

- [ ] **Step 2: Wire it into `src/app/(app)/obdelava/page.tsx`**

Add the import near the top:

```tsx
import SaveStatus from "@/components/SaveStatus";
import { computeStats } from "@/hooks/useVldrPipeline";
```

Inside the `{p.ready && ...}` area, immediately after the existing "✅ Gotovo" line (currently line 35), add:

```tsx
<SaveStatus
  ready={p.ready}
  payload={() => ({
    sourceFilename: header.transport_id ? `${header.transport_id}.xlsx` : "obdelava.xlsx",
    header,
    stats: computeStats(p.vehicles),
    summary: p.summary,
    validation: p.validation,
    vehicles: p.vehicles,
    rawRows: p.rawRows,
  })}
/>
```

Note: `computeStats` is already exported from `useVldrPipeline.ts`. `header` is in scope from `useState`.

- [ ] **Step 3: Typecheck**

Run: `bunx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/SaveStatus.tsx src/lib/runs-actions.ts "src/app/(app)/obdelava/page.tsx"
git commit -m "feat(inspectus-os): auto-save each completed run (seed-safe, idempotent)"
```

---

### Task 7: Domov live KPIs

**Files:**
- Modify: `src/app/(app)/page.tsx`

- [ ] **Step 1: Replace seed read with live `listRuns()` + fallback**

Rewrite `src/app/(app)/page.tsx` as an async server component. Keep the exact same markup/classes; only the data source changes:

```tsx
import Link from "next/link";
import { SEED_RUNS } from "@/lib/seed";
import { listRuns } from "@/lib/runs";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export default async function Domov() {
  const live = isSupabaseConfigured() ? await listRuns() : [];
  const useLive = live.length > 0;
  const runs = useLive
    ? live.map(r => ({
        id: r.id,
        created_at: (r.created_at || "").slice(0, 10),
        source_filename: r.source_filename || "—",
        vehicle_count: r.vehicle_count,
        total_damages: r.total_damages,
        transport_id: r.transport_id || "—",
        delivering_party: r.delivering_party || "—",
        location: r.location || "—",
      }))
    : SEED_RUNS;

  const totalVehicles = runs.reduce((s, r) => s + r.vehicle_count, 0);
  const lastRun = runs[0]?.created_at ?? "—";
  const runCount = runs.length;

  return (
    <div className="content">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--navy-deep)", marginBottom: 6 }}>Domov</h1>
        <p style={{ color: "#6b7280", fontSize: 14 }}>Pregled obdelav VLDR — INSPECTUS poveljniški center.</p>
      </div>

      <div className="kpi-row">
        <div className="kpi-card"><span className="kpi-label">Skupno obdelanih vozil</span><span className="kpi-value">{totalVehicles.toLocaleString("sl-SI")}</span></div>
        <div className="kpi-card"><span className="kpi-label">Zadnja obdelava</span><span className="kpi-value">{lastRun}</span></div>
        <div className="kpi-card"><span className="kpi-label">Število obdelav</span><span className="kpi-value">{runCount}</span></div>
      </div>

      <div style={{ marginBottom: 32 }}>
        <Link href="/obdelava" className="kpi-cta">＋ Nova obdelava</Link>
      </div>

      <div>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--navy-deep)", marginBottom: 14 }}>Zadnje obdelave</h2>
        <div className="vinfilaj-scroll">
          <table className="vinfilaj-table">
            <thead><tr><th>Datum</th><th>Datoteka</th><th>Vozil</th><th>Poškodb</th><th>Transport ID</th><th>Prevoznik</th><th>Lokacija</th></tr></thead>
            <tbody>
              {runs.map(run => (
                <tr key={run.id}>
                  <td>{run.created_at}</td>
                  <td>{useLive ? <Link href={`/zgodovina/${run.id}`}>{run.source_filename}</Link> : run.source_filename}</td>
                  <td style={{ textAlign: "right" }}>{run.vehicle_count.toLocaleString("sl-SI")}</td>
                  <td style={{ textAlign: "right" }}>{run.total_damages.toLocaleString("sl-SI")}</td>
                  <td>{run.transport_id}</td>
                  <td>{run.delivering_party}</td>
                  <td>{run.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `bunx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add "src/app/(app)/page.tsx"
git commit -m "feat(inspectus-os): Domov KPIs from live runs (seed fallback)"
```

---

### Task 8: Zgodovina list + detail (rehydrate)

**Files:**
- Create: `src/components/RunDetailView.tsx`
- Create: `src/app/(app)/zgodovina/page.tsx`
- Create: `src/app/(app)/zgodovina/[id]/page.tsx`

- [ ] **Step 1: Create `src/components/RunDetailView.tsx`** (client; reuses result panels)

```tsx
"use client";
import { useState } from "react";
import { maxDamageCount } from "@/lib/vldr/transform";
import type { Header } from "@/hooks/useVldrPipeline";
import VinFilajTable from "@/components/vldr/results/VinFilajTable";
import GroupedTable from "@/components/vldr/results/GroupedTable";
import VldrCards from "@/components/vldr/results/VldrCards";
import SummaryPanel from "@/components/vldr/results/SummaryPanel";
import ValidationPanel from "@/components/vldr/results/ValidationPanel";

const TABS = [
  { id: "vinfilaj", label: "VIN-FILAJ" }, { id: "grouped", label: "Združen Survey Report" },
  { id: "vldr", label: "VLDR Kartice" }, { id: "summary", label: "Povzetek" }, { id: "validate", label: "AI Validacija" },
];

export default function RunDetailView({ vehicles, rawRows, header, summary, validation }: {
  vehicles: any[]; rawRows: any[]; header: Header; summary: any; validation: any;
}) {
  const [tab, setTab] = useState("vinfilaj");
  const maxDamages = maxDamageCount(vehicles);
  return (
    <>
      <nav style={{ display: "flex", gap: 4, borderBottom: "1px solid var(--border)", margin: "16px 0", overflowX: "auto" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "8px 14px", fontWeight: 600, whiteSpace: "nowrap", color: tab === t.id ? "var(--navy)" : "#6b7280", borderBottom: tab === t.id ? "2px solid var(--navy)" : "2px solid transparent", borderTop: "none", borderLeft: "none", borderRight: "none", background: "none", cursor: "pointer" }}>{t.label}</button>
        ))}
      </nav>
      {tab === "vinfilaj" && <VinFilajTable vehicles={vehicles} maxDamages={maxDamages} header={header} />}
      {tab === "grouped" && <GroupedTable rawRows={rawRows} />}
      {tab === "vldr" && <VldrCards vehicles={vehicles} header={header} />}
      {tab === "summary" && <SummaryPanel summary={summary ? { text: summary } : null} />}
      {tab === "validate" && <ValidationPanel validation={validation} />}
    </>
  );
}
```

- [ ] **Step 2: Create `src/app/(app)/zgodovina/page.tsx`**

```tsx
import Link from "next/link";
import { listRuns } from "@/lib/runs";

export default async function Zgodovina() {
  const runs = await listRuns();
  return (
    <div className="content">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--navy-deep)", marginBottom: 6 }}>Zgodovina</h1>
        <p style={{ color: "#6b7280", fontSize: 14 }}>Vse shranjene obdelave VLDR.</p>
      </div>
      {runs.length === 0 ? (
        <div style={{ color: "#6b7280", fontSize: 14, padding: "32px 0" }}>Še ni shranjenih obdelav. Začni z <Link href="/obdelava">novo obdelavo</Link>.</div>
      ) : (
        <div className="vinfilaj-scroll">
          <table className="vinfilaj-table">
            <thead><tr><th>Datum</th><th>Datoteka</th><th>Vozil</th><th>Poškodb</th><th>Transport ID</th><th>Prevoznik</th><th>Lokacija</th></tr></thead>
            <tbody>
              {runs.map(r => (
                <tr key={r.id}>
                  <td>{(r.created_at || "").slice(0, 10)}</td>
                  <td><Link href={`/zgodovina/${r.id}`}>{r.source_filename || "—"}</Link></td>
                  <td style={{ textAlign: "right" }}>{r.vehicle_count.toLocaleString("sl-SI")}</td>
                  <td style={{ textAlign: "right" }}>{r.total_damages.toLocaleString("sl-SI")}</td>
                  <td>{r.transport_id || "—"}</td>
                  <td>{r.delivering_party || "—"}</td>
                  <td>{r.location || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create `src/app/(app)/zgodovina/[id]/page.tsx`**

```tsx
import Link from "next/link";
import { getRun } from "@/lib/runs";
import RunDetailView from "@/components/RunDetailView";

export default async function RunDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const run = await getRun(id);

  if (!run) {
    return (
      <div className="content">
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--navy-deep)" }}>Obdelava ni najdena.</h1>
        <p style={{ marginTop: 8 }}><Link href="/zgodovina">← Nazaj na Zgodovino</Link></p>
      </div>
    );
  }

  const header = {
    date: run.report_date || "", transport_id: run.transport_id || "",
    delivering_party: run.delivering_party || "", receiving_party: run.receiving_party || "",
    location: run.location || "",
  };

  return (
    <div className="content">
      <p style={{ marginBottom: 8 }}><Link href="/zgodovina" style={{ fontSize: 13, color: "#6b7280" }}>← Zgodovina</Link></p>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--navy-deep)" }}>{run.source_filename || "Obdelava"}</h1>
      <p style={{ color: "#6b7280", fontSize: 13, marginTop: 4 }}>
        {(run.created_at || "").slice(0, 10)} · {run.vehicle_count} vozil · {run.total_damages} poškodb
      </p>
      <RunDetailView
        vehicles={run.vehicles ?? []}
        rawRows={run.raw_rows ?? []}
        header={header}
        summary={run.summary}
        validation={run.validation}
      />
    </div>
  );
}
```

- [ ] **Step 4: Typecheck**

Run: `bunx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/RunDetailView.tsx "src/app/(app)/zgodovina"
git commit -m "feat(inspectus-os): Zgodovina list + run detail (rehydrate + re-download)"
```

---

### Task 9: Nastavitve — team roster + role management

**Files:**
- Create: `src/app/(app)/nastavitve/actions.ts`
- Create: `src/app/(app)/nastavitve/page.tsx`

- [ ] **Step 1: Create `src/app/(app)/nastavitve/actions.ts`**

```ts
"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function setRole(formData: FormData) {
  const id = String(formData.get("id") || "");
  const role = String(formData.get("role") || "");
  if (!id || (role !== "admin" && role !== "member")) return;
  const supabase = await createClient();
  // RLS only lets an admin update other profiles; members are blocked at the DB.
  await supabase.from("profiles").update({ role }).eq("id", id);
  revalidatePath("/nastavitve");
}
```

- [ ] **Step 2: Create `src/app/(app)/nastavitve/page.tsx`**

```tsx
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getSessionUser } from "@/lib/auth";
import { setRole } from "./actions";

export default async function Nastavitve() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="content">
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--navy-deep)" }}>Nastavitve</h1>
        <p style={{ color: "#6b7280", marginTop: 8 }}>Ekipa in vloge bodo na voljo, ko bo povezana baza (seed način).</p>
      </div>
    );
  }

  const supabase = await createClient();
  const user = await getSessionUser();
  const { data: me } = await supabase.from("profiles").select("role").eq("id", user?.id ?? "").single();
  const isAdmin = me?.role === "admin";
  const { data: team } = await supabase.from("profiles").select("id,email,full_name,role,created_at").order("created_at", { ascending: true });

  return (
    <div className="content">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--navy-deep)", marginBottom: 6 }}>Nastavitve</h1>
        <p style={{ color: "#6b7280", fontSize: 14 }}>Ekipa INSPECTUS Center.</p>
      </div>

      <div className="vinfilaj-scroll" style={{ marginBottom: 28 }}>
        <table className="vinfilaj-table">
          <thead><tr><th>Email</th><th>Ime</th><th>Vloga</th><th>Pridružen</th>{isAdmin && <th></th>}</tr></thead>
          <tbody>
            {(team ?? []).map(m => (
              <tr key={m.id}>
                <td>{m.email}</td>
                <td>{m.full_name || "—"}</td>
                <td>{m.role === "admin" ? "Skrbnik" : "Član"}</td>
                <td>{(m.created_at || "").slice(0, 10)}</td>
                {isAdmin && (
                  <td>
                    {m.id !== user?.id && (
                      <form action={setRole}>
                        <input type="hidden" name="id" value={m.id} />
                        <input type="hidden" name="role" value={m.role === "admin" ? "member" : "admin"} />
                        <button type="submit" style={{ fontSize: 12, color: "var(--navy)", background: "none", border: "1px solid #e1e7ec", borderRadius: 7, padding: "4px 9px", cursor: "pointer" }}>
                          {m.role === "admin" ? "Nastavi kot Član" : "Nastavi kot Skrbnik"}
                        </button>
                      </form>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ background: "#f5f7f9", borderRadius: 12, padding: 20, maxWidth: 560 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--navy-deep)", marginBottom: 8 }}>Kako dodati člana ekipe</h2>
        <p style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.6 }}>
          Vsak z e-pošto <strong>@inspectus.si</strong> se lahko prijavi sam na strani za prijavo — ob prvi prijavi se ustvari račun.
          Zunanje skrbnike (AIS) doda razvijalec v dovoljeni seznam v bazi.
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Typecheck**

Run: `bunx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add "src/app/(app)/nastavitve"
git commit -m "feat(inspectus-os): Nastavitve — team roster + admin role management"
```

---

### Task 10: Production build gate

**Files:** none (verification only)

- [ ] **Step 1: Full typecheck**

Run: `bunx tsc --noEmit`
Expected: clean.

- [ ] **Step 2: Production build (still in seed mode — env unset)**

Run: `bun run build`
Expected: build succeeds; `/prijava`, `/zgodovina`, `/nastavitve` appear in the route list.

- [ ] **Step 3: Unit tests green**

Run: `bun test`
Expected: existing `transform` suite + `deriveCounts` all pass.

- [ ] **Step 4: Commit any lockfile/build fixups (if needed)**

```bash
git add -A && git commit -m "chore(inspectus-os): Phase 2 build green" || echo "nothing to commit"
```

---

### Task 11: Supabase wiring guide (handoff to Ian) + live acceptance

**Files:**
- Create: `INSPEKTUS/inspectus-os/SETUP-PHASE2.md`

- [ ] **Step 1: Write `SETUP-PHASE2.md`** with the exact click-path:

```markdown
# INSPECTUS Center — Phase 2 setup (5 minutes)

1. Go to https://supabase.com → New project (name: `inspectus-center`, region: EU Frankfurt). Save the database password.
2. SQL Editor → paste the entire `supabase/schema.sql` → Run. (Edit the admin allowlist in the file first if adding Anej/Nejc.)
3. Project Settings → Data API → copy **Project URL** and the **anon / publishable** key.
4. In `inspectus-os/.env.local` add:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
   (Keep the existing `ANTHROPIC_API_KEY` line.)
5. Authentication → Providers → Email: enable. For instant testing, turn **Confirm email** OFF (turn back ON before client handoff).
6. `bun run dev` → http://localhost:3020 → you are redirected to `/prijava`. Sign in with `ian.veber@gmail.com` + a password → you're in as Skrbnik.
```

- [ ] **Step 2: Live acceptance (run after Ian pastes keys)**

Manually verify, on http://localhost:3020:
1. Logged out → any route redirects to `/prijava`.
2. Login works (password); magic-link sends.
3. Process `public/sample-survey-report.xlsx` → `✓ Shranjeno` appears.
4. Run shows in Domov KPIs + Zgodovina list.
5. Open it from Zgodovina → all 5 panels rehydrate; VLDR/VIN-FILAJ re-download works.
6. Nastavitve lists you as Skrbnik; role toggle present.
7. Odjava → back to `/prijava`; protected routes unreachable.

- [ ] **Step 3: Commit**

```bash
git add INSPEKTUS/inspectus-os/SETUP-PHASE2.md
git commit -m "docs(inspectus-os): Phase 2 Supabase setup + acceptance checklist"
```

---

## Notes for the implementer

- **Server-action boundary gotcha:** `lib/runs.ts` and `lib/auth.ts` import the server Supabase client, so they only run server-side. Client components (`SaveStatus`, `SignOutButton`) must import the callable functions through the thin `"use server"` re-export files (`lib/runs-actions.ts`, `lib/auth-actions.ts`) and import only **types** directly from `lib/runs.ts`. This keeps the server client out of the browser bundle.
- **Seed mode is sacred:** every new server function returns empty/no-op when `NEXT_PUBLIC_SUPABASE_URL` is unset, so the app keeps booting and demoing without Supabase.
- **No service-role key anywhere** — confirm during review.
- **Don't touch** `transform.ts`, the `vldr/` result components, or `schema.sql`.
