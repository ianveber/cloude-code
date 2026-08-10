# Tier 1 — Go-Live Checklist (Ian only)

The bundle is **built and legally clean**: `dist/ai-native-protocol-toolkit-v1.0.0.zip` (1.8 MB) + the self-serve sales page. Rebuild any time with `bash build-bundle.sh`. These are the only steps left, all yours:

## 1. Name it
Pick the product name/brand (share "AI-Native in 90" with a tier suffix, e.g. "AI-Native in 90 — Toolkit"?). Fill `[PRODUCT-NAME]` in `sales/index.html` (eyebrow line).

## 2. Price it
Set the tier-1 price. It sits *below* the done-for-you ladder (€1.500 Scan → €7.500 Build). Fill `[PRICE]` in `sales/index.html`.

## 3. Storefront (recommended: Lemonsqueezy)
- Create a Lemonsqueezy account (merchant-of-record → handles EU VAT for you) + connect payout.
- New product → upload `dist/ai-native-protocol-toolkit-v1.0.0.zip` as the digital download.
- Turn on **license keys** (single-company terms match `LICENSE.md`).
- Copy the checkout URL → fill `[BUY-URL]` in `sales/index.html`.
- (Alt: Gumroad — simpler, weaker EU-VAT/licensing.)

## 4. Finalize the sales page
Fill `[PRODUCT-NAME]` / `[PRICE]` / `[BUY-URL]`, then tell me — I re-render + can host it (Vercel) or you paste it into the storefront's product description.

## 5. Your Slovene skills (optional include)
Confirm whether you authored `enotna-ekonomika`, `pozicioniranje`, `distribucijski-kanali`, `vrednostno-cenovanje`. If yes, I add each to `OWN_SKILLS` in `build-bundle.sh` and rebuild — they ship in the bundle. If no, they stay in the companion list.

## 6. Decisions already handled (no action)
- **Pillar 4 ships as honest draft** — labeled in `COURSE.md` + `LICENSE.md` (free update finalizes it once your investor docs land).
- **Language:** sales page + bundle are English (global reach). Say the word for a Slovene edition.
- **License buyer/date:** `LICENSE.md` has `[BUYER]`/`[DATE]` fields — the storefront fills these per sale, or leave generic.

---
**When 1–4 are done, Tier 1 is live.** Then we start Tier 2 (Hosted edition).
