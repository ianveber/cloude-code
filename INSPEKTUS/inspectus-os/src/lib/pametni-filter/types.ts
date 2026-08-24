export type FilterMode = "exif-stream" | "explicit-boundary";

export type PhotoKind = "vin" | "damage" | "unknown";

export type IngestedPhoto = {
  id: string;
  name: string;
  capturedAt: number;
  inspectorId?: string;
  inspectorName?: string;
  /** When the inspector explicitly tagged the shot (field app). */
  kind?: PhotoKind;
  dataUrl?: string;
};

export type VinRead = {
  photoId: string;
  /** Well-formed 17-char VIN, or null — never a guess. */
  vin: string | null;
  raw?: string;
  source: "tesseract" | "cloud" | "manual" | "none";
  looksLikePlate?: boolean;
};

export type VehicleGroup = {
  id: string;
  vin: string;
  vinPhotoId: string;
  photoIds: string[];
  inspectorId?: string;
  inspectorName?: string;
  /** Original OCR VIN if a unique 1-char ship-list correction was applied. */
  correctedFrom?: string;
  onShipList: boolean;
  vinReadable: boolean;
};

export type UnsortedPhoto = {
  photoId: string;
  reason: "unreadable_vin" | "no_open_vehicle" | "closed_by_failed_read" | "manual";
};

export type FilterAlert = {
  type: "unexpected_vin" | "missing_on_ship" | "duplicate_vin" | "corrected";
  vin: string;
  message: string;
};

export type FilterResult = {
  vehicles: VehicleGroup[];
  unsorted: UnsortedPhoto[];
  alerts: FilterAlert[];
  closedByFailedRead: number;
};

export type RunFilterInput = {
  photos: IngestedPhoto[];
  reads: Record<string, VinRead>;
  shipList: string[];
  mode?: FilterMode;
};
