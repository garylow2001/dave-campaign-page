# Google Apps Script — response collector

Receives each quiz submission from the static site and appends a row to a
Google Sheet. ~10 minute setup, free.

## 1. Create the Sheet

1. Go to sheets.new and create a sheet (e.g. "Campaign Responses").
2. Copy its **ID** — the long string in the URL between `/d/` and `/edit`.

## 2. Create the script

1. In the sheet: **Extensions → Apps Script**.
2. Replace the default `Code.gs` content with the code from [`Code.gs`](Code.gs).
3. In `Code.gs`, fill in:
   - `SPREADSHEET_ID = "<the id from step 1>"`
   - `SHARED_TOKEN = "<random string>"` — this must match `VITE_SHEETS_TOKEN` in the site.

## 3. Deploy as a web app

1. **Deploy → New deployment**.
2. Type: **Web app**.
3. **Execute as:** Me.
4. **Who has access:** Anyone.
5. **Deploy**, then copy the **Web app URL** (ends in `/exec`).

> Choosing "Anyone" is what lets the public site POST rows. The `SHARED_TOKEN`
> check is the only thing stopping randoms from spamming the sheet, so use a
> long random value.

## 4. Wire the site

In `.env.local` (or as GitHub Actions secrets for production builds):

```
VITE_SHEETS_ENDPOINT=https://script.google.com/macros/s/<...>/exec
VITE_SHEETS_TOKEN=<the same random string>
```

## 5. Test

```bash
curl -X POST 'https://script.google.com/macros/s/<...>/exec' \
  -H 'Content-Type: text/plain' \
  -d '{"token":"<token>","submittedAt":"2026-08-15T00:00:00Z","result":{"primary":"Secure","secondary":null,"anxiety":2,"avoidance":2,"confidence":4,"mixed":false,"anxietyLevel":"low","avoidanceLevel":"low"},"answers":{"q01":2},"moneyViews":"test","moneyAssociation":"test"}'
```

You should get `{"ok":true}` and a row (with headers) in the sheet.
A wrong token returns `{"ok":false,"error":"bad token"}`.

## Notes

- The client sends `Content-Type: text/plain` so the request is a CORS
  "simple request" — no preflight, which is what makes this work from a
  static GitHub Pages site.
- Every submission appends a row. Export the sheet anytime
  (File → Download → CSV) for the offline report / charts.
- The `answers` column is one cell: `q01=2 | q02=5 | …`. Parse it when you
  do analysis (or switch to 15 separate columns if you prefer — just edit
  `appendRow` and `HEADERS`).
