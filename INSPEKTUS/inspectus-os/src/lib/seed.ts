export type SeedRun = {
  id: string; created_at: string; source_filename: string;
  vehicle_count: number; total_damages: number;
  transport_id: string; delivering_party: string; location: string;
};
export const SEED_RUNS: SeedRun[] = [
  { id: "seed-1", created_at: "2026-06-06", source_filename: "PRIMER 1.xlsx", vehicle_count: 314, total_damages: 380, transport_id: "NEPTUNE ITHAKI", delivering_party: "NEPTUNE LINES", location: "PORT OF KOPER" },
  { id: "seed-2", created_at: "2026-06-02", source_filename: "Survey-0529.xlsx", vehicle_count: 50, total_damages: 93, transport_id: "—", delivering_party: "FRIKUS", location: "PORT OF KOPER" },
  { id: "seed-3", created_at: "2026-05-28", source_filename: "Koper-discharge-04.xlsx", vehicle_count: 128, total_damages: 171, transport_id: "GRANDE EUROPA", delivering_party: "GRIMALDI", location: "PORT OF KOPER" },
];
export const seedMode = () => !process.env.NEXT_PUBLIC_SUPABASE_URL;
