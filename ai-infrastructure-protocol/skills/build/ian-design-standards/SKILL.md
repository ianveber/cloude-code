---
name: ian-design-standards
description: "Ian's visual + UX standards for anything he builds. Use this WHENEVER designing or building UI, dashboards, app screens, landing pages, or marketing sites — even if Ian doesn't explicitly ask for a 'design'. Two contexts: (1) personal tools/dashboards/app UI must be Apple-style light minimalism with all technical jargon hidden behind friendly plain language; (2) marketing/landing sites must clear a photoreal visual quality bar — never ship code-only Three.js as the hero. Trigger on: building a dashboard, command center, app UI, settings screen, status display, hero section, 3D walkthrough, or any client/AIS website. Apply by default so Ian never has to re-explain his taste."
---

# Ian's Design Standards

Ian has a specific, consistent design taste. Apply it by default instead of making him restate it every time. There are two distinct contexts — pick the right one for what you're building.

---

## Context 1 — Personal tools, dashboards & app UI → Apple light minimalism

Anything Ian uses himself (dashboards, command centers, the Agentic OS, internal app screens, status surfaces) must feel like a clean, calm Apple product.

**Visual system:**
- Background: white or `#f5f5f7`. Light, airy, eye-friendly — never a dark "hacker" theme for personal tools.
- Accent / actions: iOS system blue `#0071e3`.
- State colors: green `#34c759` (good), red `#ff3b30` (error/stop), orange `#ff9500` (warning/attention).
- Typography: system font stack (`-apple-system, BlinkMacSystemFont, "SF Pro", ...`).
- Borders: hairline `#e8e8ed`. Radius: `16px`. Shadows: soft and subtle.

**The hard rule — hide every technical detail from the UI.** No job types, process names, attempt counts, state-machine words (queued / claimed / pending), model names, token counts, or bridge/internal jargon on screen. Keep all of that in the data/backend layer only. The interface speaks plain, friendly, human language.

**Translate machine states → human language. Examples:**
- `queued` / `claimed` / `processing` → **"Working…"**
- `succeeded` / `done` → **"Done"**
- `failed` / `error` → **"Didn't work"**
- `idle` / system healthy → **"Everything running"**
- A "Reject" button → **"Not now"**

**Why this matters:** Ian explicitly asked to "move all of the bullshit in the backend and use only the things that are necessary… white… eye friendly… Apple style of minimalism" after seeing an early dark, jargon-heavy command center. The friendly-language layer isn't decoration — it's the product. If a label would only make sense to an engineer, rewrite it for a calm human.

Note: this Apple-light system is for Ian's **personal/internal** tools. It is deliberately different from the darker marketing palette used in `web-specialist` for public sites.

---

## Context 2 — Marketing & landing sites → photoreal visual quality bar

For AIS / client marketing sites, the visual bar is **photoreal-or-close** (Blender / architectural-render quality), not "stylized-cinematic."

**Do NOT** default to building hero visuals from code-only Three.js (primitives + custom shaders + curved geometry). Even at full effort it lands as stylized and misses Ian's bar — this has been tried and rejected.

**Default sequence instead:**
1. Ask Ian for the specific reference he's matching: a website URL, a 3D model file, a Spline/Framer export, or a video showreel.
2. Match that reference.
3. If he wants true 3D-walkthrough quality, the path is **real GLB models** — Sketchfab (paid, ~$20–200/model) or a commissioned Blender artist (€500–2000/model) — not hand-coded geometry.

**Build a small slice first and reality-check it against the bar before building the whole thing.** When Ian picks a path against an honest warning, prove the quality on one screen/room before expanding — don't build the entire experience and discover the gap at the end.

---

## Branding note

Client and marketing deliverables ship under **AIS**, not "Veta." Keep naming, footers, and credits consistent with that.
