import { callClaude, readBody, guard } from "../_lib.mjs";

export default async function handler(req, res) {
  if (guard(req, res)) return;
  const body = readBody(req);
  const system = `Si revizor kakovosti podatkov za INSPECTUS — pregled poškodb vozil (VLDR, finished-vehicle logistics) v pristanišču Koper. Uporabljaš sistem kod AIAG-ECG: PART CODE = območje poškodbe, TYPE CODE = vrsta poškodbe, SEVERITY = obseg (1=manjši, 2=srednji, 3=večji). NE ugibaj pomena posameznih številčnih kod.
Razredi (CLASS) so natanko trije: 'No Damage Evidence', 'Damage', 'Observation'. Preveri notranjo skladnost vsake poškodbe: ali se CLASS ujema s SEVERITY in z opisom v COMMENTS, ali manjka razred, ali je kombinacija neverjetna (npr. 'No Damage Evidence' ob opisu razpoke/udarnine, ali 'Damage' pri SEVERITY 1 brez utemeljitve). Ne izmišljuj si drugih razredov.
Vrni IZKLJUČNO veljaven JSON v obliki:
{ "issues": [ { "vin": "...", "row_index": 0, "kind": "nekonsistentna_koda"|"prazen_razred"|"neverjetna_kombinacija", "message": "...", "suggestion": "..." } ] }
Sporočila in predlogi naj bodo v slovenščini, v strokovnem registru pregledovalca. Bodi jedrnat. Preskoči vrstice brez težav. Največ 12 težav. Brez proze, brez markdowna — zgolj JSON objekt.`;
  // Compact JSON (no pretty-print indentation) — same data, ~30% fewer input tokens on the payload
  // that dominates cost. Validation stays on Sonnet (default model) for quality.
  const user = "Damages:\n" + JSON.stringify((body.damages || []).slice(0, 200));
  const result = await callClaude({ system, user, expectJson: true, maxTokens: 3000 });
  res.status(200).json(result);
}
