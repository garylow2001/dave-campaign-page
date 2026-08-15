/**
 * Dave campaign — response collector.
 *
 * The static site (GitHub Pages) can't store data, so this tiny Apps Script
 * web app receives each quiz submission and appends a row to a Google Sheet.
 *
 * Deploy:
 *   1. Create a Google Sheet and copy its ID (from the sheet URL).
 *   2. Extensions → Apps Script → paste this file → save.
 *   3. Fill in SPREADSHEET_ID and SHARED_TOKEN below.
 *   4. Deploy → New deployment → Type: Web app →
 *        Execute as: Me, Who has access: Anyone → Deploy.
 *   5. Copy the /exec URL into the site's VITE_SHEETS_ENDPOINT and set
 *      VITE_SHEETS_TOKEN to the same SHARED_TOKEN.
 *
 * The client posts with Content-Type: text/plain, so the request is a CORS
 * "simple request" and Apps Script accepts it without a preflight.
 */

/** Paste the Google Sheet ID here. */
const SPREADSHEET_ID = "";

/** Must match VITE_SHEETS_TOKEN in the site. Random string is fine. */
const SHARED_TOKEN = "";

const SHEET_NAME = "Responses";
const HEADERS = [
  "submittedAt",
  "primaryStyle",
  "secondaryStyle",
  "anxietyScore",
  "avoidanceScore",
  "confidence",
  "mixed",
  "anxietyLevel",
  "avoidanceLevel",
  "answers",
  "moneyViews",
  "moneyAssociation",
];
const ANSWER_IDS = [
  "q01", "q02", "q03", "q04", "q05", "q06", "q07", "q08", "q09", "q10",
  "q11", "q12", "q13", "q14", "q15",
];

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);

    if (payload.token !== SHARED_TOKEN) {
      return jsonResponse({ ok: false, error: "bad token" });
    }

    const sheet = ensureSheet();
    sheet.appendRow([
      payload.submittedAt,
      payload.result.primary,
      payload.result.secondary || "",
      payload.result.anxiety,
      payload.result.avoidance,
      payload.result.confidence,
      payload.result.mixed ? "mixed" : "",
      payload.result.anxietyLevel,
      payload.result.avoidanceLevel,
      answersSummary(payload.answers),
      payload.moneyViews,
      payload.moneyAssociation,
    ]);

    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

function doGet() {
  return jsonResponse({ ok: true, note: "This endpoint accepts POST." });
}

function ensureSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }
  return sheet;
}

/** One JSON-ish column keeps the 15 answers readable (and CSV-export friendly). */
function answersSummary(answers) {
  return ANSWER_IDS
    .map(function (id) { return id + "=" + (answers[id] === undefined ? "" : answers[id]); })
    .join(" | ");
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
