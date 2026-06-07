"use client";
import { useState, useCallback } from "react";
import * as XLSXns from "xlsx";
import { groupByVin, maxDamageCount } from "@/lib/vldr/transform";
import * as claude from "@/lib/vldr/claude-client";
import columnMap from "@/config/column-map.json";

export type Header = { date: string; transport_id: string; delivering_party: string; receiving_party: string; location: string };
export type Step = "parse" | "urejanje" | "group" | "vinfilaj" | "vldr" | "validate" | "summary";

export function useVldrPipeline() {
  const [rawRows, setRawRows] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [maxDamages, setMaxDamages] = useState(0);
  const [validation, setValidation] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [steps, setSteps] = useState<Record<string, "active" | "done" | "">>({});
  const [error, setError] = useState<string>("");
  const [ready, setReady] = useState(false);

  const setStep = (id: Step, s: "active" | "done" | "") => setSteps(p => ({ ...p, [id]: s }));

  const regroup = useCallback((rows: any[]) => {
    const v = groupByVin(rows, columnMap as any);
    setVehicles(v); setMaxDamages(maxDamageCount(v));
    return v;
  }, []);

  const handleFile = useCallback(async (file: File) => {
    setError(""); setReady(false); setValidation(null); setSummary(null);
    try {
      setStep("parse", "active");
      if (!/\.xlsx?$/i.test(file.name)) throw new Error("Pričakujem .xlsx datoteko.");
      const buf = await file.arrayBuffer();
      const XLSX = XLSXns as any;
      const wb = XLSX.read(buf, { type: "array" });
      const want = (columnMap as any).source_sheet;
      const sheetName = wb.SheetNames.includes(want) ? want : wb.SheetNames[0];
      const off = ((columnMap as any).source_header_row || 1) - 1;
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { range: off, defval: "" });
      if (!rows.length) throw new Error("Datoteka ne vsebuje vrstic.");
      setRawRows(rows); setStep("parse", "done"); setStep("urejanje", "done");

      setStep("group", "active");
      const v = regroup(rows);
      setStep("group", "done");

      setStep("vinfilaj", "active"); setStep("vinfilaj", "done");
      setStep("vldr", "active"); setStep("vldr", "done");
      setReady(true); // instant deliverables available now

      // AI enrichment after (non-blocking sequence)
      setStep("validate", "active");
      const payload = v.flatMap((veh: any, vi: number) =>
        veh.damages.map((d: any, di: number) => ({ vin: veh.vin, row_index: vi * 100 + di, part_code: d.part_code, type_code: d.type_code, severity: d.severity, class: d.class, comments: d.comments })));
      setValidation(await claude.validate(payload)); setStep("validate", "done");

      setStep("summary", "active");
      setSummary(await claude.summarize(computeStats(v))); setStep("summary", "done");
    } catch (e: any) {
      setError(e?.message ?? "Nepričakovana napaka.");
    }
  }, [regroup]);

  return { rawRows, setRawRows, vehicles, maxDamages, validation, summary, steps, error, ready, handleFile, regroup };
}

export function computeStats(vehicles: any[]) {
  const classDist: Record<string, number> = {}, codeCounts: Record<string, number> = {}, sevHist: Record<number, number> = { 1: 0, 2: 0, 3: 0 };
  let total = 0;
  for (const v of vehicles) for (const d of v.damages) {
    classDist[d.class || "(blank)"] = (classDist[d.class || "(blank)"] || 0) + 1;
    const code = `${d.part_code}-${d.type_code}`; codeCounts[code] = (codeCounts[code] || 0) + 1;
    if (d.severity in sevHist) sevHist[d.severity]++; total++;
  }
  const topCodes = Object.entries(codeCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  return { vehicle_count: vehicles.length, total_damages: total, damage_class_dist: classDist, severity_histogram: sevHist, top_damage_codes: topCodes };
}
