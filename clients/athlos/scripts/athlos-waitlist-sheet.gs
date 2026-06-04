/**
 * ATHLOS waitlist → Google Sheet
 * ================================
 * Appends one row per signup, and flips status to "confirmed" when Beehiiv
 * fires the double opt-in webhook.
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
  'consent', 'utm_source', 'utm_medium', 'utm_campaign', 'confirmed_at',
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

    var action = body.action || 'append';
    if (action === 'update_status') {
      return jsonOut(updateStatus(sheet, body));
    }

    // Default: append a new signup row.
    var row = HEADERS.map(function (h) {
      if (h === 'timestamp') return body.timestamp || new Date().toISOString();
      return (body[h] !== undefined && body[h] !== null) ? body[h] : '';
    });
    sheet.appendRow(row);
    return jsonOut({ ok: true, action: 'append' });
  } catch (err) {
    return jsonOut({ ok: false, error: String(err) });
  }
}

// Flip an existing row's status by email (double opt-in confirmed).
function updateStatus(sheet, body) {
  var email = (body.email || '').toString().toLowerCase();
  if (!email) return { ok: false, error: 'no_email' };

  var values = sheet.getDataRange().getValues();
  var header = values[0];
  var emailCol = header.indexOf('email');
  var statusCol = header.indexOf('status');
  var confirmedCol = header.indexOf('confirmed_at');

  for (var i = 1; i < values.length; i++) {
    if (String(values[i][emailCol]).toLowerCase() === email) {
      if (statusCol >= 0) sheet.getRange(i + 1, statusCol + 1).setValue(body.status || 'confirmed');
      if (confirmedCol >= 0) sheet.getRange(i + 1, confirmedCol + 1).setValue(body.confirmed_at || new Date().toISOString());
      return { ok: true, action: 'update_status', matched: true };
    }
  }

  // Not in the sheet yet → append a minimal confirmed record so nothing is lost.
  var newRow = HEADERS.map(function (h) {
    if (h === 'email') return body.email;
    if (h === 'status') return body.status || 'confirmed';
    if (h === 'confirmed_at') return body.confirmed_at || new Date().toISOString();
    if (h === 'timestamp') return new Date().toISOString();
    return '';
  });
  sheet.appendRow(newRow);
  return { ok: true, action: 'update_status', matched: false, appended: true };
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
