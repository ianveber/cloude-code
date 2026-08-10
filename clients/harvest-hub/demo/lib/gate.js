/**
 * gate.js — the 545. člen check on an incoming packet.
 *
 * Pure logic: no I/O, no imports, no side effects. The same module runs in the browser and in
 * the node test, so what the client sees on screen is what the test scores.
 *
 * THE RULE (03-uradna-ponudba.md, "Kontrole in preverjanje")
 *   A packet that contains a Ponudba must also contain the 545. člen document. If it does not,
 *   the packet is held — visibly, with a reason a broker can read.
 *
 * THE EXCEPTION (03-uradna-ponudba.md, "Obravnava izjem")
 *   "Kolektivna zavarovanja za pravne osebe (brez 545. člena) gredo po posebni poti."
 *   Collective insurance for a legal entity carries no 545. člen at all, so holding it would be
 *   a false alarm on a perfectly correct packet — the fastest way to lose a broker's trust in
 *   a check. When EVERY ponudba in the packet is collective AND a legal entity, the packet is
 *   marked as an exception instead of being held.
 *
 *   Both signals must be asserted explicitly. A missing `kolektivno` or a missing
 *   `tipZavarovalca` never earns the exception — the default is "needs the 545. člen", because
 *   the cost of wrongly holding a packet is a phone call, and the cost of wrongly letting one
 *   through is a compliance gap.
 *
 * WHAT THIS GATE DOES NOT CLAIM
 *   It checks presence, not correspondence. With several ponudbe and one 545. člen it cannot
 *   tell which belongs to which — nothing in the document classes carries that link. So the
 *   reasons below say only what was actually checked, and never more.
 *
 * ON-SCREEN LANGUAGE
 *   `razlog` is rendered verbatim to the client. It is plain Slovene, it never contains a
 *   document name, a person, or an internal word. Filenames are deliberately not interpolated:
 *   a filename can carry a client's name, and this sentence can end up on a shared screen.
 */

/* Document classes. Same string values as DOC in classify.js — repeated here as local
   constants so the gate stays a standalone, independently testable unit. */
const PONUDBA = "ponudba";
const CLEN545 = "clen545";

/** Same string as DOC_LABEL.clen545 — this one IS shown on screen. */
const CLEN545_LABEL = "545. člen";

/** The one exception this gate recognises. */
const IZJEMA_KOLEKTIVNO = "kolektivno-pravna-oseba";

/**
 * Slovene counts in four forms — singular, dual, 3–4, and plural. Getting this wrong is the
 * single most obvious tell that a sentence was assembled by a machine, and this sentence is
 * shown to the client.
 *   1 -> "je ponudba" · 2 -> "sta 2 ponudbi" · 3 -> "so 3 ponudbe" · 5 -> "je 5 ponudb"
 *
 * The form follows the LAST digit, not the last two — 21 takes the singular, 22 the dual — with
 * the teens (11-19) as the one exception, which is why they are caught first.
 */
function ponudbeFraza(n) {
  const r = n % 100;
  if (r > 10 && r < 20) return `je ${n} ponudb`;
  const u = r % 10;
  if (u === 1) return n === 1 ? "je ponudba" : `je ${n} ponudba`;
  if (u === 2) return `sta ${n} ponudbi`;
  if (u === 3 || u === 4) return `so ${n} ponudbe`;
  return `je ${n} ponudb`;
}

/** The documented exception, and nothing looser than it. */
function jeKolektivnoPravna(doc) {
  return doc.kolektivno === true && doc.tipZavarovalca === "pravna";
}

/**
 * @param {{ docs?: Array<{ klas?: string, ime?: string,
 *                          tipZavarovalca?: 'fizicna'|'pravna'|null,
 *                          kolektivno?: boolean }> }} input
 * @returns {{ status: 'prehod'|'zadrzano'|'izjema',
 *             razlog: string|null,
 *             manjka: string[],
 *             izjema: 'kolektivno-pravna-oseba'|null }}
 */
export function checkPacket({ docs } = {}) {
  const list = Array.isArray(docs) ? docs.filter((d) => d && typeof d === "object") : [];
  const ponudbe = list.filter((d) => d.klas === PONUDBA);
  const n = ponudbe.length;

  // Nothing to gate. An empty folder, or a folder of supporting documents on their own, is not
  // a fault — there is no ponudba whose completeness we could judge.
  if (n === 0) {
    return { status: "prehod", razlog: null, manjka: [], izjema: null };
  }

  // The document is here. Presence is all this check claims, so the sentence claims no more.
  if (list.some((d) => d.klas === CLEN545)) {
    return {
      status: "prehod",
      razlog: `545. člen je v paketu, zato ${n === 1 ? "ponudbe" : "ponudb"} ne zadržim.`,
      manjka: [],
      izjema: null,
    };
  }

  const zahtevajo = ponudbe.filter((d) => !jeKolektivnoPravna(d));

  // Every ponudba is collective insurance for a legal entity: the 545. člen is not expected
  // here, so holding the packet would be wrong. Mark it and move it on.
  if (zahtevajo.length === 0) {
    return {
      status: "izjema",
      razlog: n === 1
        ? "Ponudba je kolektivno zavarovanje pravne osebe, ki 545. člena nima — zato paketa ne zadržim, označim pa ga za posebno obravnavo."
        : "Vse ponudbe v paketu so kolektivna zavarovanja pravnih oseb, ki 545. člena nimajo — zato paketa ne zadržim, označim pa ga za posebno obravnavo.",
      manjka: [],
      izjema: IZJEMA_KOLEKTIVNO,
    };
  }

  // At least one ponudba needs the document and it is not here. Hold, and say why.
  const mesano = zahtevajo.length < n;
  const razlog = mesano
    ? (zahtevajo.length === 1
        ? "Ena od ponudb ni kolektivno zavarovanje pravne osebe in zato potrebuje 545. člen, ki ga v paketu ni. Paket zadržim, dokler dokumenta ne prejmem."
        : "Nekatere ponudbe v paketu niso kolektivna zavarovanja pravnih oseb in zato potrebujejo 545. člen, ki ga v paketu ni. Paket zadržim, dokler dokumenta ne prejmem.")
    : `V paketu ${ponudbeFraza(n)}, manjka pa 545. člen. ${n === 1 ? "Ponudbo" : "Paket"} zadržim, dokler dokumenta ne prejmem.`;

  return { status: "zadrzano", razlog, manjka: [CLEN545_LABEL], izjema: null };
}
