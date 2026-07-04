// @ts-nocheck
// Ported verbatim from inspectus-vldr/app.js lines ~135-157

export interface FilterRule {
  field: string;
  op: "eq" | "gt" | "gte" | "lt" | "lte" | "contains";
  value: string | number;
}

export function testField(obj: Record<string, any>, { field, op, value }: FilterRule): boolean {
  const actual = obj[field];
  switch (op) {
    case "eq":       return String(actual).toLowerCase() == String(value).toLowerCase();
    case "gt":       return Number(actual) >  Number(value);
    case "gte":      return Number(actual) >= Number(value);
    case "lt":       return Number(actual) <  Number(value);
    case "lte":      return Number(actual) <= Number(value);
    case "contains": return String(actual).toLowerCase().includes(String(value).toLowerCase());
    default:         return true;
  }
}

export function applyFilter(vehicles: any[], filterList: FilterRule[]): any[] {
  if (!filterList.length) return vehicles;
  return vehicles
    .map(v => {
      const filteredDamages = v.damages.filter((d: any) => filterList.every(f => testField({ ...v, ...d }, f)));
      if (!filteredDamages.length) return null;
      return { ...v, damages: filteredDamages };
    })
    .filter(Boolean);
}
