/* Order files by EXIF DateTimeOriginal, then filename. */
(function (global) {
  function parseExifAsciiDate(s) {
    const m = /^(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})$/.exec(s);
    if (!m) return null;
    const t = Date.parse(m[1] + "-" + m[2] + "-" + m[3] + "T" + m[4] + ":" + m[5] + ":" + m[6]);
    return isFinite(t) ? t : null;
  }
  async function readCapturedAt(file) {
    try {
      const buf = await file.slice(0, 128 * 1024).arrayBuffer();
      const ascii = new TextDecoder("latin1").decode(new Uint8Array(buf));
      const m = ascii.match(/(\d{4}:\d{2}:\d{2} \d{2}:\d{2}:\d{2})/);
      if (m) {
        const t = parseExifAsciiDate(m[1]);
        if (t) return t;
      }
    } catch (_) { /* lastModified */ }
    return file.lastModified;
  }
  async function orderByExif(files) {
    const timed = await Promise.all(files.map(async file => ({ file, capturedAt: await readCapturedAt(file) })));
    timed.sort((a, b) => a.capturedAt - b.capturedAt || a.file.name.localeCompare(b.file.name, "en", { numeric: true }));
    return timed;
  }
  global.PametniIngest = { readCapturedAt, orderByExif };
})(typeof window !== "undefined" ? window : globalThis);
