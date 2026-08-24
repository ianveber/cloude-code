/* Browser Tesseract VIN reader — never guesses; invalid shape → null. */
(function (global) {
  async function readVinTesseract(dataUrl) {
    const PF = global.PametniFilter;
    if (!global.Tesseract) {
      return { vin: null, raw: "", looksLikePlate: false, source: "none" };
    }
    const { data } = await global.Tesseract.recognize(dataUrl, "eng", {
      tessedit_char_whitelist: "ABCDEFGHJKLMNPRSTUVWXYZ0123456789",
    });
    const raw = (data.text || "").replace(/\s+/g, " ").trim();
    const vin = PF.extractValidVin(raw);
    return {
      vin,
      raw,
      looksLikePlate: !!vin || PF.looksLikeFailedVinRead(raw),
      source: "tesseract",
    };
  }
  global.PametniReader = { readVinTesseract };
})(typeof window !== "undefined" ? window : globalThis);
