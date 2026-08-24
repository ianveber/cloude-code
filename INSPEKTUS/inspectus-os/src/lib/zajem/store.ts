"use client";

import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export type ShipStatus = "open" | "complete";
export type PhotoKind = "vin" | "damage";

export type ShipSession = {
  id: string;
  name: string;
  status: ShipStatus;
  createdAt: string;
  createdBy?: string;
};

export type FieldVehicle = {
  id: string;
  shipId: string;
  sequence: number;
  vin: string;
  vinReadable: boolean;
  inspectorId: string;
  inspectorName: string;
  openedAt: string;
  closedAt: string | null;
};

export type FieldPhoto = {
  id: string;
  shipId: string;
  vehicleId: string;
  kind: PhotoKind;
  dataUrl: string;
  capturedAt: string;
  inspectorId: string;
  inspectorName: string;
};

export type InspectorIdentity = {
  id: string;
  name: string;
};

const LS_INSPECTOR = "inspectus-zajem-inspector";
const LS_SHIPS = "inspectus-zajem-ships";
const LS_VEHICLES = "inspectus-zajem-vehicles";
const LS_PHOTOS = "inspectus-zajem-photos";

function nid(prefix: string) {
  return `${prefix}_${crypto.randomUUID?.() ?? `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`}`;
}

function readLs<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
}

function writeLs(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadInspector(): InspectorIdentity | null {
  return readLs<InspectorIdentity | null>(LS_INSPECTOR, null);
}

export function saveInspector(identity: InspectorIdentity) {
  writeLs(LS_INSPECTOR, identity);
}

export function makeInspector(name: string): InspectorIdentity {
  const existing = loadInspector();
  const trimmed = name.trim();
  if (existing && existing.name === trimmed) return existing;
  return { id: existing?.id && existing.name === trimmed ? existing.id : nid("ins"), name: trimmed };
}

async function supabaseOrNull() {
  if (!isSupabaseConfigured()) return null;
  try {
    return createClient();
  } catch {
    return null;
  }
}

export async function listShips(): Promise<ShipSession[]> {
  const sb = await supabaseOrNull();
  if (sb) {
    const { data, error } = await sb.from("ships").select("*").order("created_at", { ascending: false });
    if (!error && data) {
      return data.map(row => ({
        id: row.id,
        name: row.name,
        status: row.status as ShipStatus,
        createdAt: row.created_at,
        createdBy: row.created_by ?? undefined,
      }));
    }
  }
  return readLs<ShipSession[]>(LS_SHIPS, []);
}

export async function createShip(name: string, createdBy?: string): Promise<ShipSession> {
  const ship: ShipSession = {
    id: nid("ship"),
    name: name.trim(),
    status: "open",
    createdAt: new Date().toISOString(),
    createdBy,
  };
  const sb = await supabaseOrNull();
  if (sb) {
    const { data, error } = await sb.from("ships").insert({
      name: ship.name,
      status: "open",
      created_by: createdBy ?? null,
    }).select("*").single();
    if (!error && data) {
      return {
        id: data.id,
        name: data.name,
        status: data.status,
        createdAt: data.created_at,
        createdBy: data.created_by ?? undefined,
      };
    }
  }
  const all = readLs<ShipSession[]>(LS_SHIPS, []);
  writeLs(LS_SHIPS, [ship, ...all]);
  return ship;
}

export async function completeShip(id: string): Promise<void> {
  const sb = await supabaseOrNull();
  if (sb) {
    const { error } = await sb.from("ships").update({ status: "complete" }).eq("id", id);
    if (!error) return;
  }
  const all = readLs<ShipSession[]>(LS_SHIPS, []);
  writeLs(LS_SHIPS, all.map(s => s.id === id ? { ...s, status: "complete" as const } : s));
}

export async function listVehicles(shipId: string): Promise<FieldVehicle[]> {
  const sb = await supabaseOrNull();
  if (sb) {
    const { data, error } = await sb.from("field_vehicles").select("*").eq("ship_id", shipId).order("sequence");
    if (!error && data) {
      return data.map(row => ({
        id: row.id,
        shipId: row.ship_id,
        sequence: row.sequence,
        vin: row.vin ?? "",
        vinReadable: row.vin_readable,
        inspectorId: row.inspector_id,
        inspectorName: row.inspector_name,
        openedAt: row.opened_at,
        closedAt: row.closed_at,
      }));
    }
  }
  return readLs<FieldVehicle[]>(LS_VEHICLES, []).filter(v => v.shipId === shipId);
}

export async function listPhotos(shipId: string): Promise<FieldPhoto[]> {
  const sb = await supabaseOrNull();
  if (sb) {
    const { data, error } = await sb.from("field_photos").select("*").eq("ship_id", shipId).order("captured_at");
    if (!error && data) {
      return data.map(row => ({
        id: row.id,
        shipId: row.ship_id,
        vehicleId: row.vehicle_id,
        kind: row.kind,
        dataUrl: row.data_url ?? "",
        capturedAt: row.captured_at,
        inspectorId: row.inspector_id,
        inspectorName: row.inspector_name,
      }));
    }
  }
  return readLs<FieldPhoto[]>(LS_PHOTOS, []).filter(p => p.shipId === shipId);
}

export async function openVehicle(input: {
  shipId: string;
  inspector: InspectorIdentity;
  sequence: number;
}): Promise<FieldVehicle> {
  const vehicle: FieldVehicle = {
    id: nid("veh"),
    shipId: input.shipId,
    sequence: input.sequence,
    vin: "",
    vinReadable: false,
    inspectorId: input.inspector.id,
    inspectorName: input.inspector.name,
    openedAt: new Date().toISOString(),
    closedAt: null,
  };
  const sb = await supabaseOrNull();
  if (sb) {
    const { data, error } = await sb.from("field_vehicles").insert({
      ship_id: vehicle.shipId,
      sequence: vehicle.sequence,
      vin: "",
      vin_readable: false,
      inspector_id: vehicle.inspectorId,
      inspector_name: vehicle.inspectorName,
    }).select("*").single();
    if (!error && data) {
      return {
        id: data.id,
        shipId: data.ship_id,
        sequence: data.sequence,
        vin: data.vin ?? "",
        vinReadable: data.vin_readable,
        inspectorId: data.inspector_id,
        inspectorName: data.inspector_name,
        openedAt: data.opened_at,
        closedAt: data.closed_at,
      };
    }
  }
  const all = readLs<FieldVehicle[]>(LS_VEHICLES, []);
  writeLs(LS_VEHICLES, [...all, vehicle]);
  return vehicle;
}

export async function closeVehicle(id: string, patch?: { vin?: string; vinReadable?: boolean }): Promise<void> {
  const closedAt = new Date().toISOString();
  const sb = await supabaseOrNull();
  if (sb) {
    const { error } = await sb.from("field_vehicles").update({
      closed_at: closedAt,
      ...(patch?.vin !== undefined ? { vin: patch.vin } : {}),
      ...(patch?.vinReadable !== undefined ? { vin_readable: patch.vinReadable } : {}),
    }).eq("id", id);
    if (!error) return;
  }
  const all = readLs<FieldVehicle[]>(LS_VEHICLES, []);
  writeLs(LS_VEHICLES, all.map(v => v.id === id ? {
    ...v,
    closedAt,
    vin: patch?.vin ?? v.vin,
    vinReadable: patch?.vinReadable ?? v.vinReadable,
  } : v));
}

export async function updateVehicleVin(id: string, vin: string, vinReadable: boolean): Promise<void> {
  const sb = await supabaseOrNull();
  if (sb) {
    const { error } = await sb.from("field_vehicles").update({ vin, vin_readable: vinReadable }).eq("id", id);
    if (!error) return;
  }
  const all = readLs<FieldVehicle[]>(LS_VEHICLES, []);
  writeLs(LS_VEHICLES, all.map(v => v.id === id ? { ...v, vin, vinReadable } : v));
}

export async function addPhoto(photo: Omit<FieldPhoto, "id" | "capturedAt"> & { capturedAt?: string }): Promise<FieldPhoto> {
  const row: FieldPhoto = {
    ...photo,
    id: nid("ph"),
    capturedAt: photo.capturedAt ?? new Date().toISOString(),
  };
  const sb = await supabaseOrNull();
  if (sb) {
    const { data, error } = await sb.from("field_photos").insert({
      ship_id: row.shipId,
      vehicle_id: row.vehicleId,
      kind: row.kind,
      data_url: row.dataUrl,
      inspector_id: row.inspectorId,
      inspector_name: row.inspectorName,
    }).select("*").single();
    if (!error && data) {
      return {
        id: data.id,
        shipId: data.ship_id,
        vehicleId: data.vehicle_id,
        kind: data.kind,
        dataUrl: data.data_url ?? row.dataUrl,
        capturedAt: data.captured_at,
        inspectorId: data.inspector_id,
        inspectorName: data.inspector_name,
      };
    }
  }
  const all = readLs<FieldPhoto[]>(LS_PHOTOS, []);
  writeLs(LS_PHOTOS, [...all, row]);
  return row;
}

export type FilterRunRecord = {
  id: string;
  createdAt: string;
  shipName: string;
  shipList: string[];
  result: unknown;
  sourceCount: number;
};

export async function saveFilterRun(input: {
  shipName: string;
  shipList: string[];
  result: unknown;
  sourceCount: number;
  createdBy?: string;
}): Promise<FilterRunRecord | null> {
  const local: FilterRunRecord = {
    id: nid("fr"),
    createdAt: new Date().toISOString(),
    shipName: input.shipName,
    shipList: input.shipList,
    result: input.result,
    sourceCount: input.sourceCount,
  };
  const sb = await supabaseOrNull();
  if (sb) {
    const { data, error } = await sb.from("filter_runs").insert({
      ship_name: input.shipName,
      ship_list: input.shipList,
      result: input.result,
      source_count: input.sourceCount,
      created_by: input.createdBy ?? null,
    }).select("*").single();
    if (!error && data) {
      return {
        id: data.id,
        createdAt: data.created_at,
        shipName: data.ship_name,
        shipList: data.ship_list ?? [],
        result: data.result,
        sourceCount: data.source_count,
      };
    }
  }
  if (typeof window !== "undefined") {
    const key = "inspectus-filter-runs";
    const all = readLs<FilterRunRecord[]>(key, []);
    writeLs(key, [local, ...all].slice(0, 20));
  }
  return local;
}
