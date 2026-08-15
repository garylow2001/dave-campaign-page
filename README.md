# Dave Campaign Page

IG-ad funnel: a 3-page attachment-style quiz that collects answers + scores,
shows the result, and drives a Calendly booking. Static build → GitHub Pages;
responses are saved to a Google Sheet via Apps Script.

Full planning doc: [`campaign-plan.md`](campaign-plan.md)

## Pages

| Route | Page |
|-------|------|
| `/` | Landing — "who we are" + hook |
| `/quiz` | 15 attachment items (1–7 Likert) + 2 free-form money questions |
| `/result` | Style + anxiety/avoidance scores + Calendly booking |

Personal info is **not** collected on the site — it's captured by the Calendly
booking form.

## Scoring

Standard two-dimensional attachment model. Reverse-scored items use `8 − response`,
means per subscale, quadrant split at `4.0` with a `3.7–4.3` borderline band.
See `src/lib/attachment.ts` (unit-tested in `attachment.test.ts`).

## Setup

```bash
npm install
cp .env.example .env.local   # fill in the values
npm run dev                  # local dev at /dave-campaign-page/
```

Required env vars (Vite):

| Var | Purpose |
|-----|---------|
| `VITE_SHEETS_ENDPOINT` | Apps Script `/exec` URL that stores responses |
| `VITE_SHEETS_TOKEN` | Shared secret matching the Apps Script's token |
| `VITE_CALENDLY_URL` | Calendly embed URL shown on `/result` |
| `VITE_SHOW_INCENTIVE` | `"true"` toggles the incentive banner |

## Tests

```bash
npm test        # vitest — scoring algorithm
npm run lint    # oxlint
npm run build   # tsc + vite build
```

## Deploy (GitHub Pages)

Pushing to `main` runs `.github/workflows/deploy.yml`: it builds and publishes
to Pages. One-time repo setup:

1. **Settings → Pages** → Source: **GitHub Actions**.
2. Add the production env values as repo **Actions secrets** (`VITE_SHEETS_ENDPOINT`,
   `VITE_SHEETS_TOKEN`) and **variables** (`VITE_CALENDLY_URL`,
   `VITE_SHOW_INCENTIVE`) — the workflow injects them at build time.
3. Site lives at `https://<user>.github.io/dave-campaign-page/`.
   (Optional custom domain: Settings → Pages → Custom domain + DNS.)

Deep links (`/quiz`, `/result`) work on Pages via `public/404.html` + the
redirect script in `index.html` (sessionStorage-based SPA fallback).

## Data flow

```
Quiz submit → submitResponse() → POST (text/plain, no CORS preflight)
   → Apps Script web app → appends a row to the Google Sheet
```

The Apps Script lives in [`apps-script/`](apps-script/README.md) — deploy it
once, then export the Sheet as CSV for the offline report and charts.

## Contents

```
src/
  pages/        Landing, Quiz, Result
  components/   LikertRating + shadcn/ui components
  context/      QuizProvider (state, scoring, save)
  lib/          questions.ts, attachment.ts (scoring), submit.ts, copy.ts
apps-script/    Code.gs + deploy guide (Google Sheet sink)
campaign-plan.md  full plan: funnel, data model, scoring, analysis
```
