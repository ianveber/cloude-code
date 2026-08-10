// Readiness engine edge: I/O orchestrator + Coach system-prompt block.
import { readReadiness, writeReadiness } from "../profiles.mjs";
import { scoreDaily } from "./score.mjs";

export function computeDaily(athleteId, input) {
  const state = readReadiness(athleteId);
  const { record, baselines } = scoreDaily({ ...input, athleteId }, state);
  writeReadiness(athleteId, { record, baselines });
  const after = readReadiness(athleteId);
  return { record, history: after.records.slice(-30) };
}

const pct = (d) => (d == null ? "" : ` (${d > 0 ? "+" : ""}${d}%)`);

export function readinessBlock(athleteId, athleteName = "") {
  const { records } = readReadiness(athleteId);
  if (!records.length) return "";
  const r = records[records.length - 1];
  const s = r.scores || {};
  const lines = [];
  lines.push(`## Današnja pripravljenost (Readiness) — ${athleteName}`);

  if (s.readiness == null) {
    const n = r.calibration?.nights ?? 0;
    lines.push(`Readiness: KALIBRACIJA — ${n} od 14 noči. Load in spanje sta že na voljo.`);
  } else {
    lines.push(`Readiness ${Math.round(s.readiness)} (${r.band.toUpperCase()}).`);
    const drv = (r.drivers || []).map((d) => {
      if (d.metric === "HRV") return `HRV ${d.value}ms${pct(d.deltaPct)}`;
      if (d.metric === "RestingHR") return `mirovni SU ${d.value}${pct(d.deltaPct)}`;
      if (d.metric === "Sleep") return `spanje ${Math.round((s.sleepPerf ?? 0) * 100)}%`;
      return `${d.metric} ${d.value}`;
    });
    if (drv.length) lines.push(drv.join(", ") + ".");
  }
  if (s.load != null) lines.push(`Današnji Load: ${s.load}/100.`);
  if (s.forecast != null) lines.push(`Napoved za jutri: ~${s.forecast}.`);
  if (r.inputs?.soreness != null || r.inputs?.mood != null) {
    lines.push(`Subjektivno: bolečina/utrujenost ${r.inputs.soreness ?? "?"}, razpoloženje ${r.inputs.mood ?? "?"} (upoštevaj kot kontekst — lahko premosti oceno).`);
  }
  lines.push(
    "Guidance: RED → predlagaj deload / tehniko / mobilnost, NE dovoli preobremenitve; " +
    "YELLOW → zmeren volumen, drži intenziteto; " +
    "GREEN + nizek nedavni load → prižgi ključni trening; " +
    "GREEN + visok nedavni load → vzdržuj, pazi na kopičenje utrujenosti."
  );
  lines.push("Opomba: Readiness je približek, ne medicinski nasvet.");
  return lines.join("\n");
}
