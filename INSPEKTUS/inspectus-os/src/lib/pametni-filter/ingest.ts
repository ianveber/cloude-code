/**
 * Folder ingest: order photos by EXIF DateTimeOriginal, then filename.
 * Field-app capture must NOT use this — vehicle boundaries are explicit there.
 */

export type TimedFile = {
  file: File;
  capturedAt: number;
};

const EXIF_DATETIME = /(?:DateTimeOriginal|DateTime)\x00{0,8}(\d{4}:\d{2}:\d{2} \d{2}:\d{2}:\d{2})/;

function parseExifAsciiDate(s: string): number | null {
  // "YYYY:MM:DD HH:MM:SS"
  const m = /^(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})$/.exec(s);
  if (!m) return null;
  const iso = `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}`;
  const t = Date.parse(iso);
  return Number.isFinite(t) ? t : null;
}

function findExifDate(bytes: Uint8Array): number | null {
  // Search a prefix — EXIF lives in APP1 near the start.
  const head = bytes.subarray(0, Math.min(bytes.length, 128 * 1024));
  const ascii = new TextDecoder("latin1").decode(head);
  const m = EXIF_DATETIME.exec(ascii);
  if (m) return parseExifAsciiDate(m[1]);

  // TIFF-style DateTimeOriginal tag payload is often stored as ASCII nearby.
  const loose = ascii.match(/(\d{4}:\d{2}:\d{2} \d{2}:\d{2}:\d{2})/);
  return loose ? parseExifAsciiDate(loose[1]) : null;
}

export async function readCapturedAt(file: File): Promise<number> {
  try {
    const buf = await file.slice(0, 128 * 1024).arrayBuffer();
    const fromExif = findExifDate(new Uint8Array(buf));
    if (fromExif) return fromExif;
  } catch {
    /* fall through */
  }
  return file.lastModified;
}

export async function orderByExif(files: File[]): Promise<TimedFile[]> {
  const timed = await Promise.all(
    files.map(async file => ({ file, capturedAt: await readCapturedAt(file) })),
  );
  timed.sort((a, b) => {
    if (a.capturedAt !== b.capturedAt) return a.capturedAt - b.capturedAt;
    return a.file.name.localeCompare(b.file.name, "en", { numeric: true });
  });
  return timed;
}

export function compareIngestOrder(
  a: { capturedAt: number; name: string; inspectorId?: string },
  b: { capturedAt: number; name: string; inspectorId?: string },
): number {
  const ia = a.inspectorId ?? "";
  const ib = b.inspectorId ?? "";
  if (ia !== ib) return ia.localeCompare(ib);
  if (a.capturedAt !== b.capturedAt) return a.capturedAt - b.capturedAt;
  return a.name.localeCompare(b.name, "en", { numeric: true });
}
