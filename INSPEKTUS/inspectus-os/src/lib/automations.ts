// Registry of inspector automations shown in the Avtomatizacije command center.
// Add a new automation = add one entry here (+ a detail page if it's interactive).
// The menu at /avtomatizacije renders straight from this list.

export type AutomationStatus = "active" | "demo" | "soon";

export type Automation = {
  id: string;
  name: string;
  description: string;
  icon: string;       // short glyph shown on the tile
  status: AutomationStatus;
  href: string;       // where clicking the tile goes
};

export const AUTOMATIONS: Automation[] = [
  {
    id: "vldr",
    name: "VLDR obdelava",
    description: "Survey Report → VIN-FILAJ → VLDR kartice → AI povzetek.",
    icon: "🚗",
    status: "active",
    href: "/obdelava",
  },
  {
    id: "zajem",
    name: "Zajem na terenu",
    description: "Seja ladje na telefonu: VIN, nato poškodbe. Dva inšpektorja, ločeni seji.",
    icon: "📱",
    status: "active",
    href: "/avtomatizacije/zajem",
  },
  {
    id: "pametni-filter",
    name: "Pametni filter",
    description: "Mapa fotografij + seznam razkladanja → vozila, Nerazvrščeno in opozorila.",
    icon: "🗂️",
    status: "active",
    href: "/avtomatizacije/pametni-filter",
  },
  {
    id: "vin",
    name: "VIN sortirnik fotografij",
    description: "Prebere VIN iz vsake fotografije in razvrsti poškodbe po vozilih.",
    icon: "📷",
    status: "active",
    href: "/avtomatizacije/vin",
  },
  {
    id: "constat",
    name: "Constat — Opel / Citroën / Peugeot",
    description: "PSA Joint Survey (RUA V3). Obdelava izvoz → Constat zapisnik.",
    icon: "📋",
    status: "demo",
    href: "/avtomatizacije/constat",
  },
];

export function statusLabel(s: AutomationStatus): string {
  return s === "active" ? "Aktivno" : s === "demo" ? "Demo" : "Kmalu";
}
