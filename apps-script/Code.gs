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
 *
 * V2: Section A (q01–q15) plus Sections B–D (b01–b16, c01–c12, d01–d12) and
 * the derived money profile (archetype, meanings, career orientation).
 * Re-deploy as a NEW version after pasting (Deploy → Manage deployments →
 * edit → New version) so the live /exec URL picks up the change. Existing
 * sheets keep old rows; the new HEADERS columns append empty for them.
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
  // Deprecated: free-form questions were removed from the site. Columns kept
  // so existing rows stay aligned; new submissions store empty strings.
  "moneyViews",
  "moneyAssociation",
  // V2 money profile
  "moneyArchetype",
  "mixedProfile",
  "primaryMeaning",
  "secondaryMeaning",
  "careerOrientation",
  "moneyScores",
  "moneyAnswers",
];
const ANSWER_IDS = [
  "q01", "q02", "q03", "q04", "q05", "q06", "q07", "q08", "q09", "q10",
  "q11", "q12", "q13", "q14", "q15",
];
const MONEY_ANSWER_IDS = [
  "b01", "b02", "b03", "b04", "b05", "b06", "b07", "b08",
  "b09", "b10", "b11", "b12", "b13", "b14", "b15", "b16",
  "c01", "c02", "c03", "c04", "c05", "c06",
  "c07", "c08", "c09", "c10", "c11", "c12",
  "d01", "d02", "d03", "d04", "d05", "d06",
  "d07", "d08", "d09", "d10", "d11", "d12",
];

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);

    if (payload.token !== SHARED_TOKEN) {
      return jsonResponse({ ok: false, error: "bad token" });
    }

    const money = payload.moneyResult || null;
    const sheet = ensureSheet();
    ensureHeaders(sheet);
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
      answersSummary(payload.answers, ANSWER_IDS),
      payload.moneyViews || "",
      payload.moneyAssociation || "",
      money ? money.archetype : "",
      money && money.mixedProfile ? "mixed profile" : "",
      money ? money.primaryMeaning : "",
      money && money.secondaryMeaning ? money.secondaryMeaning : "",
      money ? money.careerOrientation : "",
      money ? JSON.stringify(money.scores) : "",
      answersSummary(payload.answers, MONEY_ANSWER_IDS),
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

/**
 * Backfill any missing V2 header columns on an existing sheet (old rows keep
 * empty values for the new columns). Compares the stored header row so
 * re-running is safe.
 */
function ensureHeaders(sheet) {
  const headerRange = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), HEADERS.length));
  const current = headerRange.getValues()[0];
  for (let i = 0; i < HEADERS.length; i++) {
    if (current[i] !== HEADERS[i]) {
      sheet.getRange(1, i + 1).setValue(HEADERS[i]);
    }
  }
}

/** One JSON-ish column keeps answers readable (and CSV-export friendly). */
function answersSummary(answers, ids) {
  answers = answers || {};
  return ids
    .map(function (id) { return id + "=" + (answers[id] === undefined ? "" : answers[id]); })
    .join(" | ");
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
