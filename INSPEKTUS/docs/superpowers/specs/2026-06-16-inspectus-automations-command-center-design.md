# INSPECTUS Center — Avtomatizacije command center (Design)

**Date:** 2026-06-16
**App:** `INSPEKTUS/inspectus-os/` (the deployed INSPECTUS Center — for inspectors)
**Goal:** Add an extensible "Avtomatizacije" command-center section: a menu of automation tiles (built to hold 10+), where clicking a tile opens it full-screen. Seed with two automations — VLDR (the existing pipeline) and a new VIN photo-sorter demo.

---

## Guiding principles

1. **For inspectors, in the INSPECTUS app.** This lives in `inspectus-os`, in Slovene, matching the app's existing style (slate-navy, Open Sans, the existing brand CSS). Not in any personal/agentic dashboard.
2. **Framework first, automations plug in.** Adding automation #3…#10 later must be one registry entry (+ a detail page if interactive). The menu renders from the registry.
3. **Structure now, polish later.** Ship the working command center + a working VIN demo. Visual refinement is a follow-up.

---

## Scope

**In scope (today):**
- New nav item **"Avtomatizacije"** in the sidebar.
- Menu page `/avtomatizacije` — grid of automation tiles from a registry (active + "Kmalu" placeholders + "Dodaj avtomatizacijo" affordance).
- **VLDR tile** → links to the existing `/obdelava` flow (no rebuild; reframed as automation #1).
- **VIN sortirnik** tile → opens `/avtomatizacije/vin`, a working demo: upload damage photos → Claude vision reads each VIN → photos grouped into one gallery per VIN; un-VIN-able photos land in an "Nerazvrščeno" tray and can be dragged into a car group; each group's VIN is editable.
- A registry (`lib/automations.ts`) driving the menu + routing.
- A server vision route (`api/claude/vin`) using `claude-opus-4-8`.

**Out of scope (later):** "Send to INSPECTUS / make a VLDR" from a VIN group, persistence of VIN-sort sessions, real run-history for VLDR inside the tile, the visual polish pass, more automations.

---

## Architecture & components

### New files
```
src/lib/automations.ts                         # registry: AUTOMATIONS[] + types
src/app/(app)/avtomatizacije/page.tsx          # the menu (server component, renders tiles)
src/app/(app)/avtomatizacije/vin/page.tsx      # VIN tool page (thin; renders <VinSorter/>)
src/components/avtomatizacije/AutomationTile.tsx  # one tile (client — Link/handler)
src/components/avtomatizacije/VinSorter.tsx     # the VIN demo (client: dropzone, analyze, groups, tray, drag)
src/app/api/claude/vin/route.ts                # POST images → per-image VIN (nodejs runtime)
```

### Modified files
```
src/components/Sidebar.tsx                      # add { href: "/avtomatizacije", label: "Avtomatizacije" }
src/lib/claude-server.ts                        # add callClaudeVision() + runVinExtract()
```
Untouched: the VLDR pipeline (`useVldrPipeline`, `transform.ts`, result components, `obdelava`), auth, Domov, Zgodovina, Nastavitve.

### The registry (`lib/automations.ts`)
```ts
export type AutomationStatus = "active" | "demo" | "soon";
export type Automation = {
  id: string; slug: string; name: string; description: string;
  icon: string;            // emoji or short glyph used in the tile
  status: AutomationStatus;
  href?: string;           // where clicking goes (existing flow or the tool route)
};
export const AUTOMATIONS: Automation[] = [
  { id: "vldr", slug: "vldr", name: "VLDR obdelava",
    description: "Survey Report → VIN-FILAJ → VLDR kartice → AI povzetek.",
    icon: "🚗", status: "active", href: "/obdelava" },
  { id: "vin", slug: "vin", name: "VIN sortirnik fotografij",
    description: "Prebere VIN iz vsake fotografije in razvrsti poškodbe po vozilih.",
    icon: "📷", status: "demo", href: "/avtomatizacije/vin" },
];
export const SOON: { name: string; description: string; icon: string }[] = [
  { name: "Samodejno poročilo", description: "Dnevni pregled obdelav.", icon: "📊" },
  { name: "E-pošta strankam", description: "Osnutki sporočil ob zaključku.", icon: "✉️" },
];
```
The menu maps over `AUTOMATIONS` (clickable tiles) + `SOON` (greyed) + a final "Dodaj avtomatizacijo" tile.

### VIN data flow
```
VinSorter (client)
  drop photos → downscale to ≤1600px (canvas) → base64
  POST /api/claude/vin  { images: [{ id, name, media_type, data }] }
        └─ route → runVinExtract() → per image: claude-opus-4-8 vision
              "Preberi VIN (17 znakov) iz fotografije" → structured output { found, vin }
        ← { results: [{ id, vin }] }   (vin "" if none)
  group client-side by vin → gallery card per VIN (editable header, thumb grid, count)
  vin "" → "Nerazvrščeno" tray → drag thumbnail into a car group (HTML5 DnD)
```

### Vision call (`claude-server.ts`)
Raw `fetch` to `https://api.anthropic.com/v1/messages` (matches the existing helper), but with image content blocks and **`claude-opus-4-8`** (best VIN-reading accuracy; per the Claude API guidance). One call per image, run with a small concurrency cap. Structured output (`output_config.format` json_schema `{ found: boolean, vin: string }`) so the response is clean JSON — no thinking/preamble. No `temperature`/`budget_tokens` (removed on Opus 4.8). `ANTHROPIC_API_KEY` server-only (already set in `.env.local` + Vercel).

---

## Error handling

| Condition | Behavior |
|---|---|
| No `ANTHROPIC_API_KEY` | Route returns `{error}`; VinSorter shows a Slovene notice, photos still display as "Nerazvrščeno". |
| A single image fails vision | That image → `vin: ""` (Nerazvrščeno), others still group. Never throws the batch. |
| Non-image file dropped | Skipped with a small "preskočeno" note. |
| Claude returns no/!valid JSON | Treated as no VIN found (Nerazvrščeno). |
| Large photo | Downscaled client-side before upload (payload + token control). |

## Testing & verification
- `tsc --noEmit` clean (test files excluded already).
- `bun test` stays green (no existing tests touched).
- Local routes: `/avtomatizacije` → 200 (renders tiles), `/avtomatizacije/vin` → 200 (renders dropzone), VLDR tile links to `/obdelava`. Sidebar shows "Avtomatizacije".
- VIN demo manual check: drop the bundled sample images (or any car photo with a visible VIN) → Analiziraj → groups appear; a no-VIN photo lands in Nerazvrščeno and can be dragged into a group; editing a group VIN renames it.
- Adversarial review pass (auth/route safety, the Opus 4.8 vision request shape, DnD correctness, seed-mode safety) before done.

## Rollout
Build + verify locally, then `vercel --prod` (same as the rest of the app). The VIN route needs `ANTHROPIC_API_KEY` in Vercel Production (already set).
