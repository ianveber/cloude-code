import { createClient } from "@/lib/supabase/server";
import { maxDamageCount } from "@/lib/vldr/transform";

export function deriveCounts(vehicles: any[]): {
  vehicle_count: number; total_damages: number; max_damages: number;
} {
  let total = 0, max = 0;
  for (const v of vehicles) {
    const n = v?.damages?.length ?? 0;
    total += n;
    if (n > max) max = n;
  }
  return { vehicle_count: vehicles.length, total_damages: total, max_damages: max };
}

export type RunInput = {
  sourceFilename: string;
  header: { date: string; transport_id: string; delivering_party: string; receiving_party: string; location: string };
  stats: any;
  summary: any;       // { text } | { error }
  validation: any;
  vehicles: any[];
  rawRows: any[];
};

export type RunRecord = {
  id: string;
  created_at: string;
  created_by: string | null;
  source_filename: string | null;
  report_date: string | null;
  transport_id: string | null;
  delivering_party: string | null;
  receiving_party: string | null;
  location: string | null;
  vehicle_count: number;
  total_damages: number;
  max_damages: number;
  stats: any;
  summary: string | null;
  validation: any;
  vehicles: any[] | null;
  raw_rows: any[] | null;
};

function configured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function saveRun(input: RunInput): Promise<{ ok: boolean; id?: string; error?: string }> {
  if (!configured()) return { ok: false, error: "seed-mode" };
  try {
    const supabase = await createClient();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return { ok: false, error: "no-session" };
    const counts = deriveCounts(input.vehicles);
    const { data, error } = await supabase.from("runs").insert({
      created_by: auth.user.id,
      source_filename: input.sourceFilename || null,
      report_date: input.header.date || null,
      transport_id: input.header.transport_id || null,
      delivering_party: input.header.delivering_party || null,
      receiving_party: input.header.receiving_party || null,
      location: input.header.location || null,
      vehicle_count: counts.vehicle_count,
      total_damages: counts.total_damages,
      max_damages: counts.max_damages,
      stats: input.stats ?? null,
      summary: input.summary?.text ?? null,
      validation: input.validation ?? null,
      vehicles: input.vehicles ?? null,
      raw_rows: input.rawRows ?? null,
    }).select("id").single();
    if (error) return { ok: false, error: error.message };
    return { ok: true, id: data.id };
  } catch (e: any) {
    return { ok: false, error: e?.message ?? "unknown" };
  }
}

export async function listRuns(): Promise<RunRecord[]> {
  if (!configured()) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("runs")
      .select("id,created_at,created_by,source_filename,report_date,transport_id,delivering_party,receiving_party,location,vehicle_count,total_damages,max_damages")
      .order("created_at", { ascending: false });
    if (error) return [];
    return (data ?? []) as RunRecord[];
  } catch { return []; }
}

export async function getRun(id: string): Promise<RunRecord | null> {
  if (!configured()) return null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("runs").select("*").eq("id", id).single();
    if (error || !data) return null;
    return data as RunRecord;
  } catch { return null; }
}

export function maxDamages(vehicles: any[]): number {
  return maxDamageCount(vehicles);
}
