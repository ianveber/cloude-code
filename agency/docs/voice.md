# Voice — AIS Slovenia

How AIS sounds, in writing and on calls. Read after `principles.md`.

This file governs internal docs, client-facing copy, sales material, and content the Acquirer Agent ships under the AIS name. It does not govern client deployments — those use the client's voice (locked via the 16-sample protocol in Phase 3).

---

## What we sound like

**Sharp.** Short sentences. Specific nouns. Active voice. The verb does the work.

**Specific.** Numbers, named people, concrete outcomes. "€25K build fee" beats "competitive pricing." "Specialty legal firms with €1M+ annual revenue" beats "boutique professional services." "Voice locking requires 16+ samples" beats "we use best-practice prompt engineering."

**Practitioner-level.** We've shipped the thing we're describing. We know the failure modes. We don't pretend the work is cleaner than it is. We use words like "voice locking," "onboarding ladder," "contribution margin per engagement" because those are the words we use internally — and the buyer recognizes that we actually do the work.

**Honest about uncertainty.** When something is a stub, we say it's a stub. When a number is a model, we say it's a model. When a vertical hasn't been proven, we say so. The opposite of this — false confidence — is the standard agency mode. We don't perform it.

**Sequential.** Claims build on prior claims. Each paragraph earns the next. We don't open with conclusions, we don't summarize what we're about to say, we don't recap what we said. We move forward.

---

## What we never sound like

Each item below is a phrase, pattern, or vocabulary choice that triggers an immediate rewrite. If any appears in AIS-authored prose, replace before shipping.

### Banned phrases (corporate filler)

- "leverage", "leverage synergies", "synergies"
- "we are excited to announce", "we are thrilled to", "we are proud to"
- "delve into", "in the realm of", "in today's fast-paced world"
- "unlock the power of", "supercharge", "revolutionize", "game-changer"
- "robust solution", "cutting-edge", "world-class"
- "navigate the complexities of"
- "best-in-class", "industry-leading", "next-generation"
- "transform your business", "drive results", "actionable insights"
- "at the end of the day", "moving the needle", "circle back"
- "deep dive", "double-click", "level-set"
- "pivotal", "seamless" (overused to meaninglessness)
- "empowers" (when describing software — software does not empower)

### Banned patterns

- **Opening with self-praise.** "AIS is a leading provider of vertical agent systems..." Cut. Open with the buyer's situation or the structural shift.
- **Three-adjective stacking.** "Comprehensive, scalable, and reliable..." Cut to one specific noun.
- **Vague verbs.** "Helps," "enables," "supports," "drives," "facilitates" — replace with the actual verb. "Helps you grow" → "ships 4 articles per week, locked to your voice, into Perplexity's citation pool."
- **Conclusion-as-summary.** "In conclusion, AIS provides..." Cut entirely. The reader knows when they've finished reading.
- **Filler transitions.** "Furthermore," "Additionally," "It is important to note that..." Cut. Let the next sentence stand.
- **AI-talk hedging.** "Our AI-powered solution leverages cutting-edge..." Cut every word. Describe what the system does, not its provenance.

### Banned framings

- "We are a team of passionate experts..." — we are three cofounders with specific roles. Name them.
- "Our mission is to..." — mission statements are theatre. Show what we do, don't proclaim what we believe.
- "Trusted by industry leaders" — meaningless until we have specific named clients to cite.
- "Schedule a free consultation to learn more!" — we don't offer free consultations as a CTA. Replace with the specific next step (scoping call, intake form, etc.).
- Anything that ends in "!" in a B2B context, with rare exceptions.

---

## What we always do

- **Lead with the specific.** First sentence names the thing the reader cares about. Not the company, not the mission, not the team.
- **Earn the next paragraph.** If a section can be cut without losing the argument, cut it. Length is not value.
- **Use real numbers.** Build fee ranges, contribution margins, sample counts, week-by-week schedules. Round numbers are suspect — they signal we made them up.
- **Name named things.** Cofounders, verticals, agents, tools, dollar amounts. The opposite of "industry-leading consultants" is "Anej Vučič, Nejc Feigel Boh, and Ian Veber."
- **Show the work.** When we describe a process, describe the actual steps with their actual constraints — not a sanitized version designed to sell.

---

## Language usage

### Default: English

Internal docs, repo content, sales material for international prospects, content shipped to international audiences. English is the working language between cofounders and with Claude.

### Slovenian client-facing copy

When the client is Slovenian and the end-audience is Slovenian. Outbound to Slovenian firms. Content for the Slovenian SMB vertical. Sales material for Slovenian prospects.

Slovenian copy follows the same voice rules as English — sharp, specific, practitioner-level — adapted for Slovenian register. Avoid the Slovenian-English calque (literal translations that read awkward in Slovenian). Use Slovenian business terminology, not transliterated English ("podjetnik" not "entrepreneur-ji").

When in doubt, draft in English first, then translate into Slovenian, then have a native-Slovenian cofounder (Anej or Nejc) review before shipping. This is the only thing Claude shouldn't ship on autopilot.

### Other languages

Confirm with founder before writing. We don't currently service German, Italian, Croatian, or other markets as a primary motion. If a prospect from those markets comes in, we may translate on a per-engagement basis — but the canonical version is English.

---

## Long-form content (Acquirer Agent output)

For articles, case studies, and long-form sales material, we use the GEAF format (Generate → Evidence → Apply → Format), which optimizes for AI-driven search:

1. **Define** — name the concept being discussed in the first paragraph
2. **Mechanism** — explain how it works, including specific technical detail
3. **Evidence** — cite the underlying source (paper, case study, observed outcome)
4. **Limitations** — name what the concept doesn't address
5. **Application** — describe how a practitioner uses it

This format isn't aesthetic preference. It's structural: AI search engines (Perplexity, Claude, ChatGPT-with-search) cite content that follows this shape because it answers the implicit question completely. Content that doesn't follow it doesn't get cited, even if it's well-written.

(Full GEAF spec ships in `sales/geo-aeo-strategy.md` in Phase 5.)

---

## Sales calls and proposals

Same voice rules apply. Sales conversations are not the place to switch to corporate-speak — buyers can tell, and the switch breaks credibility.

In proposals:

- Open with the buyer's specific situation (not our company background)
- State the function being owned and the named owner on both sides
- Itemize what's in scope and what's out of scope (specific verbs, specific deliverables)
- Quote the actual price (no "starting from," no "pricing on request")
- Include the off-ramp terms

In calls:

- Skip the "tell me about your business" warmup unless we genuinely don't know yet
- Move to specific function questions inside 5 minutes
- Push back when buyer descriptions are vague — "By 'better leads,' do you mean more, higher-converting, or in a new ICP?"
- End with a specific next step, not "I'll send you something"

---

## Editing self-check

Before any AIS-authored content ships externally, run it past this checklist:

- [ ] Could a competitor's marketing page say the same thing? If yes, rewrite.
- [ ] Are there at least three specific numbers, named people, or named tools in the piece?
- [ ] Does it contain any banned phrase from the list above?
- [ ] Does it open with the buyer's situation, not our company?
- [ ] If the first paragraph were the entire piece, would the reader know the main argument?
- [ ] Is the closing a specific next step or a non-CTA throwaway line?

If any answer is wrong, rewrite before shipping. The Acquirer Agent runs this checklist automatically on outputs — but humans should run it on anything they author too.
