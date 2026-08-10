# INSPECTUS Center — poveljniški center

The logged-in command center for **INSPECTUS d.o.o.** (AIS Slovenia's first paying client). Its home module is the VLDR automation; future phases add saved run history, team auth, and carrier-intelligence analytics.

> The standalone public demo remains `../inspectus-vldr/` (no login). **This** is the logged-in product.

## Status — Phase 1 (shell + tool, seed mode) ✅

- INSPECTUS-branded Next.js shell (slate-navy, Open Sans) cloned from the `ais-os` skeleton.
- **Domov** — KPI cards + recent-runs table (seed data).
- **Nova obdelava** — the full VLDR tool ported to React at parity: drop `SURVEY REPORT.xlsx` → Urejanje → VIN-FILAJ + Združen Survey Report + VLDR cards (JPG) → live AI summary + validation + conversational filter.
- Verified end-to-end on the real **PRIMER 1** dataset (314 vozil → 314 VIN-FILAJ rows + 314 VLDR cards + live Claude summary & validation, 0 console errors).
- ETL core (`src/lib/vldr/transform.ts`) is the original tested logic — **18/18 unit tests green** (`bun test`).

## Run

```bash
cd inspectus-os
bun install
bun run dev          # → http://localhost:3020
```

## Environment

Create `inspectus-os/.env.local` (gitignored):

```
ANTHROPIC_API_KEY=sk-ant-...      # required for the AI tabs (Povzetek, AI Validacija, chat filter)
# Phase 2 (auth + persistence):
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

**Seed mode:** when `NEXT_PUBLIC_SUPABASE_URL` is unset, the app boots with sample data and **no login** — this is the Phase-1 demo state. Supabase auth + saved runs arrive in Phase 2.

## Structure

```
src/
├── app/
│   ├── (app)/{layout,page}.tsx       # shell + Domov
│   ├── (app)/obdelava/page.tsx       # Nova obdelava (the VLDR tool)
│   ├── api/claude/{validate,summarize,filter}/route.ts
│   └── globals.css                   # INSPECTUS brand
├── components/{Sidebar,TopBar}.tsx
├── components/vldr/...               # tool UI (DropZone, Urejanje, results, ChatFilter)
├── config/column-map.json            # real INSPECTUS schema
├── hooks/useVldrPipeline.ts          # pipeline orchestration
└── lib/vldr/{transform,card,claude-client}.ts · lib/{claude-server,knowledge,seed}.ts
```

## Roadmap

- **Phase 2 — Auth + persistence:** Supabase project (profiles + `runs` + RLS, signup gated to `@inspectus.si` + AIS admins); save runs; Zgodovina list + run detail (reopen / re-download).
- **Phase 3 — Polish + deploy:** real Domov KPIs, Nastavitve (team/invite), Vercel + subdomain, handover.
- **Phase 4 — Analitika (upsell):** carrier intelligence over accumulated runs.

Spec: `../docs/superpowers/specs/2026-06-07-inspectus-dashboard-design.md` · Plan: `../docs/superpowers/plans/2026-06-07-inspectus-center-phase1.md`

---
*Zgrajeno z AIS Slovenija · Poganja Claude*
