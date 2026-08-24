/** Compress a capture to a long-edge ≤ 1600px JPEG for field/filter use. */

export async function fileToJpegDataUrl(file: File, maxEdge = 1600, quality = 0.85): Promise<string> {
  const dataUrl = await readAsDataUrl(file);
  return compressDataUrl(dataUrl, maxEdge, quality);
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read"));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

export function compressDataUrl(dataUrl: string, maxEdge = 1600, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onerror = () => reject(new Error("decode"));
    img.onload = () => {
      const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("ctx"));
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.src = dataUrl;
  });
}

export function dataUrlToPayload(dataUrl: string): { media_type: string; data: string } {
  const media_type = dataUrl.startsWith("data:image/png") ? "image/png" : "image/jpeg";
  return { media_type, data: dataUrl.split(",")[1] ?? "" };
}
