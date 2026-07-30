/**
 * extract.js — ponudba -> the 14 KLP fields.
 *
 * Imported by BOTH the demo UI and scripts/verify.mjs. The accuracy number the client is
 * shown must come from the code that actually ships, or it is marketing.
 *
 * Division of labour:
 *   MODEL  pairs labels to values (judgment — the grid shifts per product, one product
 *          even inverts label/value stacking, so no fixed rule works)
 *   CODE   normalises (deterministic and testable — every rule below is pinned by a
 *          real sample in truth.json)
 */

export const KLP_FIELDS = [
  "zavarovalec.ime_priimek", "zavarovalec.naslov_posta_kraj",
  "zavarovalec.telefon", "zavarovalec.email",
  "zavarovanec.ime_priimek", "zavarovanec.naslov_posta_kraj",
  "zavarovanec.telefon", "zavarovanec.email",
  "zavarovalnica", "st_ponudbe",
  "zastopnik_1.ime_priimek", "zastopnik_1.stevilka",
  "zastopnik_2.ime_priimek", "zastopnik_2.stevilka",
];

export const ZAVAROVALNICA = "Merkur zavarovalnica d.d.";

/* ── prompt ─────────────────────────────────────────────────────────────── */

export const SYSTEM = `Si natančen luščilnik podatkov iz slovenskih zavarovalnih ponudb (Merkur zavarovalnica).

VHOD: obnovljena postavitev strani. Vsaka vrstica je en vizualni red celic, zapisan kot
x<pozicija>⟨besedilo⟩. Pozicija x pove stolpec. V ENI vrstici je lahko VEČ parov
oznaka/vrednost — nikoli ne predpostavi, da je leva celica oznaka in desna vrednost.
Oznake se končajo z dvopičjem. Vrednost je celica DESNO od oznake v isti vrstici.

PRAVILA:
1. Nikoli si ne izmišljuj vrednosti. Če polja ni, vrni null.
2. Ne jemlji vrednosti iz drugega razdelka. Podatki zavarovalca so samo iz razdelka
   ZAVAROVALEC, podatki zavarovanca samo iz ZAVAROVANEC oz. ZAVAROVANI OTROCI.
3. Razdelek, ki ima oznake a NOBENE vrednosti, obravnavaj kot da ga NI (null), ne kot prazno osebo.
4. Če razdelek združuje vlogi ("Zavarovalec / zavarovanec"), velja ista oseba za obe.
5. Otroci: zavarovanci so v ZAVAROVANI OTROCI (Otrok 1, Otrok 2 ...). Vsak je svoj zavarovanec.
   Če otrok nima naslova/telefona/e-pošte, pusti null — NE prepiši od zavarovalca.
6. Številka ponudbe: SAMO iz označenega polja ("Številka ponudbe" ali "Številka pogodbe").
   Nikoli ne vzemi prvega dolgega niza številk — glava dokumenta vsebuje matično številko
   in davčno številko zavarovalnice.
7. Zastopnik: iz glave "Zastopnik oz. posrednik in št. licence", zapisan kot "Ime Priimek, licenca".
   Če te glave ni, vrni null za oboje.
8. Tip zavarovalca: "pravna" če ima Pravna oblika / Matična št. in NIMA rojstnega datuma;
   sicer "fizicna". NE sklepaj po oznaki "Naziv" — ta se uporablja za oboje.

Vrni SAMO JSON, brez razlage.`;

export const SCHEMA_HINT = `{
  "vrsta_dokumenta": "ponudba|polica|drugo",
  "tip_zavarovalca": "fizicna|pravna",
  "zavarovalec": {"ime":null,"naslov":null,"telefon":null,"email":null},
  "zavarovanec": {"ime":null,"naslov":null,"telefon":null,"email":null},
  "zavarovani_otroci": [{"ime":null,"naslov":null,"telefon":null,"email":null}],
  "st_ponudbe": {"vrednost":null,"oznaka":null},
  "zastopnik": {"ime":null,"licenca":null}
}`;

export function buildUserPrompt(layoutText) {
  return `Obnovljena postavitev strani:\n\n${layoutText}\n\nVrni JSON v tej obliki:\n${SCHEMA_HINT}`;
}

/* ── normalisation (deterministic; each rule pinned by a sample) ─────────── */

const COUNTRIES = /,?\s*(SLOVENIJA|SLOVENIA|ITALIJA|ITALIA|AVSTRIJA|HRVAŠKA)\s*$/i;

/** '…, 4000 KRANJ, SLOVENIJA' -> '…, 4000 KRANJ'  (the golden KLP carries no country) */
export function stripCountry(s) {
  if (!s) return null;
  return s.replace(/\s+/g, " ").trim().replace(COUNTRIES, "").replace(/,\s*$/, "").trim() || null;
}

/** 'IME PRIIMEK' -> 'Ime Priimek'. Legal-entity Naziv passes through untouched. */
export function titleCasePerson(s) {
  if (!s) return null;
  return s.trim().toLowerCase()
    .replace(/(^|[\s\-'])([\p{L}])/gu, (_, p, c) => p + c.toLocaleUpperCase("sl"));
}

/**
 * THE TRAP. Ponudba writes 'Ime Priimek'; the KLP writes 'Priimek Ime'.
 * Produces a plausible wrong value if missed, so it is code and it is tested.
 */
export function invertAgentName(s) {
  if (!s) return null;
  const parts = s.replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  if (parts.length < 2) return s.trim();
  const last = parts.pop();
  return [last, ...parts].join(" ");
}

export const lowerEmail = (s) => (s ? s.trim().toLowerCase() : null);
export const digitsOnly = (s) => (s ? (String(s).match(/\d+/g) || []).join("") || null : null);

/** Harvest's internal agent number is NNN-NNNN. AZN licences (40110-403/07-4) are NOT it. */
export const HARVEST_AGENT_RE = /^\d{3}-\d{4}$/;
export function agentNumberFrom(licence) {
  return licence && HARVEST_AGENT_RE.test(licence.trim()) ? licence.trim() : null;
}

/* ── raw model output -> KLP cells with provenance ──────────────────────── */

const cell = (value, source, extra = {}) => ({ value: value ?? null, source: value == null ? null : source, ...extra });

/**
 * Shared builder behind toKlp() and holderCells(). Holds everything that does not depend on
 * WHO the insured is, then hands back a `build(insured)` for the parts that do.
 */
function klpBuilder(raw, opts = {}) {
  const register = opts.register || null;
  const isLegal = raw?.tip_zavarovalca === "pravna";

  const holderName = isLegal
    ? (raw?.zavarovalec?.ime?.trim() || null)          // Naziv verbatim, never split
    : titleCasePerson(raw?.zavarovalec?.ime);
  const holder = {
    ime: holderName,
    naslov: stripCountry(raw?.zavarovalec?.naslov),
    telefon: raw?.zavarovalec?.telefon?.trim() || null,
    email: lowerEmail(raw?.zavarovalec?.email),
  };

  const agentName = invertAgentName(raw?.zastopnik?.ime);
  const licence = raw?.zastopnik?.licenca?.trim() || null;
  let agentNo = agentNumberFrom(licence), agentNoSource = "ponudba";
  if (!agentNo && register && agentName && register[agentName]) {
    agentNo = register[agentName]; agentNoSource = "register";
  }
  const agentNoCell = agentNo
    ? cell(agentNo, agentNoSource)
    : (agentName
        ? { value: null, source: "register", state: "UNMAPPED", licenca_iz_ponudbe: licence,
            razlog: "Te številke ni v ponudbi. Ponudba nosi licenco AZN, KLP pa vašo interno številko." }
        : cell(null, null));

  // who are the insured? children fan out; a blank band is absent, not a null person
  const kids = (raw?.zavarovani_otroci || []).filter((k) => k && k.ime);
  const named = raw?.zavarovanec?.ime ? [raw.zavarovanec] : [];
  const insureds = kids.length ? kids : named;

  const build = (ins) => {
    const inherited = (v, key) =>
      v ? cell(key === "email" ? lowerEmail(v) : key === "naslov" ? stripCountry(v) : v.trim(), "ponudba")
        : cell(holder[key], "pravilo", { razlog: "ni na vrstici zavarovanca — podedovano od zavarovalca" });
    const insName = ins
      ? (isLegal ? ins.ime?.trim() || null : titleCasePerson(ins.ime))
      : null;
    return {
      "zavarovalec.ime_priimek": cell(holder.ime, "ponudba"),
      "zavarovalec.naslov_posta_kraj": cell(holder.naslov, "ponudba"),
      "zavarovalec.telefon": cell(holder.telefon, "ponudba"),
      "zavarovalec.email": cell(holder.email, "ponudba"),
      "zavarovanec.ime_priimek": ins ? cell(insName, "ponudba") : cell(null, null),
      "zavarovanec.naslov_posta_kraj": ins ? inherited(ins.naslov, "naslov") : cell(null, null),
      "zavarovanec.telefon": ins ? inherited(ins.telefon, "telefon") : cell(null, null),
      "zavarovanec.email": ins ? inherited(ins.email, "email") : cell(null, null),
      "zavarovalnica": cell(ZAVAROVALNICA, "ponudba"),
      "st_ponudbe": cell(digitsOnly(raw?.st_ponudbe?.vrednost),
                         raw?.st_ponudbe?.oznaka === "Številka pogodbe" ? "pravilo" : "ponudba",
                         raw?.st_ponudbe?.oznaka ? { oznaka: raw.st_ponudbe.oznaka } : {}),
      "zastopnik_1.ime_priimek": cell(agentName, "ponudba"),
      "zastopnik_1.stevilka": agentNoCell,
      "zastopnik_2.ime_priimek": cell(null, null),
      "zastopnik_2.stevilka": cell(null, null),
    };
  };

  return { build, insureds };
}

/**
 * @param raw   parsed model JSON
 * @param opts  { register } optional ime->številka map; when supplied the agent number
 *              resolves and its cell turns green instead of amber.
 * @returns     array of KLP outputs — one per named insured, more than one when children fan
 *              out, and EMPTY when the ponudba names nobody.
 *
 * An empty array is a real answer, not a failure to produce one. The collective legal-entity
 * policy names no insured at all, so there is no kontrolni list to fill: emitting a half-filled
 * one would have the counter card and the packet list claim a document that the card itself
 * refuses to complete. See holderCells() for what is still known about such a ponudba.
 */
export function toKlp(raw, opts = {}) {
  const { build, insureds } = klpBuilder(raw, opts);
  return insureds.map(build);
}

/**
 * The holder-side cells of a ponudba that names nobody as insured — everything read except the
 * ZAVAROVANEC column, which stays null.
 *
 * This is explicitly NOT a kontrolni list and must never be counted as one. It exists so the
 * screen can show what WAS read from such a document (and the harness can still score it)
 * without pretending a form was filled.
 */
export function holderCells(raw, opts = {}) {
  return klpBuilder(raw, opts).build(null);
}
