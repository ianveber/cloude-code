/**
 * confidence.mjs — a per-field reliability signal that can be argued with.
 *
 * The offer sells two things the build did not have: *"Vsak podatek dobi oceno zanesljivosti"*
 * (OBSEG) and Jamstvo 2, *"Podatek pod dogovorjenim pragom zanesljivosti se v vaša sistema ne
 * zapiše"*. What the build actually produced was **provenance** — where a value came from — which
 * is a different claim: a value read straight off the ponudba is green no matter how illegible the
 * source was.
 *
 * WHAT THIS IS NOT: a number the model asserts about itself. Self-reported confidence from a
 * language model is not calibrated and cannot be audited — a broker asking "why 0.83?" would get
 * no answer. Every input here is observable and reconstructible from the document.
 *
 * THE THREE SIGNALS
 *
 *   1. AGREEMENT — the page is read twice, by two independent models, and the normalised results
 *      are compared field by field. Disagreement is direct evidence of ambiguity in the source.
 *      This is the strongest signal and the only one that costs anything.
 *   2. VERBATIM — does the value's text actually occur in the restored page? A value the model
 *      invented will not be there. Robust to our own normalisation (title-casing, country
 *      stripping, the agent name inversion) because it matches on tokens, not on the whole string.
 *   3. PROVENANCE — read from the document, derived by a rule, or fetched from the register.
 *      Already computed; folded in here rather than replacing it.
 *
 * TIERS, NOT A SCORE. A 0–1 number invites a threshold nobody can justify ("why 0.7?"). Four tiers
 * map onto a decision the client actually makes: write it, or put it in front of a person.
 *
 *   visoka  — both reads agree AND the text is in the document      -> written automatically
 *   srednja — reads agree, text not literally present (normalised)   -> written automatically
 *   nizka   — the reads disagree, or the value came from a rule      -> review
 *   brez    — no value, or it needs the register                     -> review
 *
 * The write threshold is a parameter, not a constant, because it is a commercial decision that
 * belongs in Faza 0 — see PISNI_PRAG.
 */

/** The tier at or above which a value may be written without a human. Faza 0 confirms it. */
export const PISNI_PRAG = "srednja";

export const TIERS = ["brez", "nizka", "srednja", "visoka"];
const rank = (t) => TIERS.indexOf(t);

/** Does every token of `value` occur in the page text? Case- and spacing-insensitive. */
export function appearsInSource(value, layout) {
  if (!value || !layout) return false;
  const hay = String(layout).toLowerCase().replace(/\s+/g, " ");
  const tokens = String(value).toLowerCase().split(/[\s,]+/).filter((t) => t.length > 1);
  if (!tokens.length) return false;
  return tokens.every((t) => hay.includes(t));
}

const norm = (v) => (v == null ? null : String(v).replace(/\s+/g, " ").trim().toLowerCase() || null);

/**
 * @param {object} o
 * @param {*} o.value      the value from the primary read (already normalised by toKlp)
 * @param {*} o.second     the same field from the independent second read, or undefined if none
 * @param {string} o.source provenance: "ponudba" | "pravilo" | "register" | null
 * @param {string} o.state  "UNMAPPED" when the value needs the register
 * @param {string} o.layout the restored page text the read was made from
 * @returns {{tier:string, agreement:string, verbatim:boolean, razlog:string}}
 */
export function fieldConfidence({ value, second, source, state, layout }) {
  // Two very different things share the "brez" tier and must not share a denominator. A field
  // needing the register is WORK — somebody must supply a number. A field that is simply empty is
  // not work: the ponudba has no second agent, so there is nothing for anyone to review. Counting
  // both as "routed to review" overstates the human burden badly — on this sample it turns 21%
  // into 33% — so the reason is machine-readable and the flag rate is computed on data-bearing
  // fields only.
  if (state === "UNMAPPED") {
    return { tier: "brez", razlogKode: "potrebuje_register", agreement: "n/a", verbatim: false,
      razlog: "vrednosti ni v dokumentu — potrebuje register" };
  }
  if (value == null || value === "") {
    return { tier: "brez", razlogKode: "prazno", agreement: "n/a", verbatim: false,
      razlog: "polje je prazno" };
  }

  const verbatim = appearsInSource(value, layout);

  // A rule-derived value was never read from this document, so agreement and verbatim say nothing
  // about it. Inheriting the holder's phone onto the insured is a *decision*, not a reading, and a
  // person has to own it. This is the one case where provenance alone sets the tier.
  if (source === "pravilo") {
    return { tier: "nizka", agreement: "n/a", verbatim,
      razlog: "vrednost je izpeljana po pravilu, ne prebrana z dokumenta" };
  }
  if (source === "register") {
    return { tier: "srednja", agreement: "n/a", verbatim: false,
      razlog: "vrednost je iz vašega registra, ne z dokumenta" };
  }

  // No second read available — the signal degrades honestly rather than pretending.
  if (second === undefined) {
    return { tier: verbatim ? "srednja" : "nizka", agreement: "enojno branje", verbatim,
      razlog: verbatim
        ? "prebrano enkrat; besedilo je v dokumentu"
        : "prebrano enkrat; besedila ni mogoče najti v dokumentu" };
  }

  const agree = norm(value) === norm(second);
  if (!agree) {
    return { tier: "nizka", agreement: "razhajanje", verbatim,
      razlog: "dve neodvisni branji sta dali različni vrednosti" };
  }
  return {
    tier: verbatim ? "visoka" : "srednja", agreement: "ujemanje", verbatim,
    razlog: verbatim
      ? "dve neodvisni branji se ujemata in besedilo je v dokumentu"
      : "dve neodvisni branji se ujemata; vrednost je normalizirana, zato ni dobesedno v dokumentu",
  };
}

/** True when a tier is at or above the write threshold. */
export const jeZaPisanje = (tier, prag = PISNI_PRAG) => rank(tier) >= rank(prag);

/** An empty field is not work. Everything else that cannot be written is. */
export const zahtevaPregled = (c, prag = PISNI_PRAG) =>
  c.razlogKode !== "prazno" && !jeZaPisanje(c.tier, prag);

/**
 * Confidence for a whole KLP.
 * @returns {{fields:object, flagged:string[], writable:number, total:number, flagRate:number}}
 */
export function klpConfidence({ cells, secondCells, layout, fields, prag = PISNI_PRAG }) {
  const out = {};
  const flagged = [];   // needs a person
  const empty = [];     // nothing there — not work
  for (const f of fields) {
    const c = cells[f] || {};
    out[f] = fieldConfidence({
      value: c.value, second: secondCells ? secondCells[f]?.value : undefined,
      source: c.source, state: c.state, layout,
    });
    if (out[f].razlogKode === "prazno") empty.push(f);
    else if (!jeZaPisanje(out[f].tier, prag)) flagged.push(f);
  }
  const total = fields.length;
  // The denominator is fields that carry data or need it — empty fields are excluded, because
  // "the ponudba has no second agent" is not a review task.
  const bearing = total - empty.length;
  return { fields: out, flagged, empty,
    writable: bearing - flagged.length, bearing, total,
    flagRate: bearing ? flagged.length / bearing : 0 };
}
