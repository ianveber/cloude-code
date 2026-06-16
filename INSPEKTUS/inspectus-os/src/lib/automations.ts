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
    id: "vin",
    name: "VIN sortirnik fotografij",
    description: "Prebere VIN iz vsake fotografije in razvrsti poškodbe po vozilih.",
    icon: "📷",
    status: "demo",
    href: "/avtomatizacije/vin",
  },
];

export function statusLabel(s: AutomationStatus): string {
  return s === "active" ? "Aktivno" : s === "demo" ? "Demo" : "Kmalu";
}
