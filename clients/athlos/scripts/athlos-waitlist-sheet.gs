/**
 * ATHLOS waitlist → Google Sheet
 * ================================
 * Appends one row per signup to the active sheet.
 *
 * DEPLOY (one time, ~2 min):
 *   1. Create a Google Sheet (e.g. "ATHLOS Waitlist").
 *   2. Extensions → Apps Script. Delete the placeholder, paste THIS whole file.
 *   3. (optional) set SHEET_SECRET below to a random string and put the SAME
 *      string in .env.local as SHEETS_WEBHOOK_SECRET.
 *   4. Deploy → New deployment → type "Web app".
 *        - Execute as: Me
 *        - Who has access: Anyone
 *      Click Deploy, authorize, and COPY the Web app URL (ends in /exec).
 *   5. Put that URL in .env.local as SHEETS_WEBHOOK_URL.
 *
 * Re-deploy (Deploy → Manage deployments → edit → new version) after any edit.
 */

// Optional shared secret. Leave '' to disable the check.
const SHEET_SECRET = '';

const HEADERS = [
  'timestamp', 'email', 'status', 'position', 'source', 'sport',
  'consent', 'utm_source', 'utm_medium', 'utm_campaign',
];

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);

    if (SHEET_SECRET && body.secret !== SHEET_SECRET) {
      return jsonOut({ ok: false, error: 'unauthorized' });
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
    }

    var row = HEADERS.map(function (h) {
      if (h === 'timestamp') return body.timestamp || new Date().toISOString();
      return (body[h] !== undefined && body[h] !== null) ? body[h] : '';
    });
    sheet.appendRow(row);

    return jsonOut({ ok: true });
  } catch (err) {
    return jsonOut({ ok: false, error: String(err) });
  }
}

// Lets you confirm the deployment is live by opening the /exec URL in a browser.
function doGet() {
  return jsonOut({ ok: true, service: 'athlos-waitlist-sheet' });
}

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
