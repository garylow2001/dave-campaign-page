# Dave Campaign Page

IG-ad funnel: a 3-page AttachedToMoney quiz (attachment + money behaviour +
money meaning + career drive) that collects answers + scores, shows a layered
profile, and drives a Profile Review booking. Static build → GitHub Pages;
responses are saved to a Google Sheet via Apps Script.

Full planning doc: [`campaign-plan.md`](campaign-plan.md)

## Pages

| Route | Page |
|-------|------|
| `/` | Landing — "How are you AttachedToMoney?" hook |
| `/quiz` | 55 Likert items (15 attachment + 40 money/career) |
| `/result` | Layered profile (archetype + attachment + money meaning + career) + Profile Review booking |

Personal info is **not** collected on the site — it's captured by the Calendly
booking form.

## Scoring

Standard two-dimensional attachment model (Section A). Reverse-scored items
use `8 − response`, means per subscale, quadrant split at `4.0` with a
`3.7–4.3` borderline band. See `src/lib/attachment.ts` (unit-tested in
`attachment.test.ts`).

V2 money layers (Sections B–D, pilot stage): 12 constructs averaged 1–7,
normalized to 0–100 (`((avg − 1) / 6) × 100`) with Lower / Moderate / Higher
bands, then a priority-ordered 8-archetype rule (+ closest-match fallback
flagged internally as mixed profile), ranked primary/secondary money meaning
(secondary only if ≥ 55), and a 4-way career orientation. See
`src/lib/money.ts` (unit-tested in `money.test.ts`). Attachment never
determines money interpretation — the layers are scored and shown separately.

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

## Deploy (Cloudflare Pages)

The site is configured for Cloudflare Pages: root base path in
`vite.config.ts`, SPA fallback via `public/_redirects` (`/* → /index.html`), and
the router follows `BASE_URL` automatically.

1. Cloudflare Dashboard → **Workers & Pages → Create → Pages → Connect to Git**
   → select this repo.
2. Build settings (Framework preset: **Vite**): build command `npm run build`,
   output directory `dist`. Set `NODE_VERSION = 22` in environment variables.
3. Add the `VITE_*` env vars (same values as `.env.local`):
   `VITE_SHEETS_ENDPOINT`, `VITE_SHEETS_TOKEN`, `VITE_CALENDLY_URL`,
   `VITE_SHOW_INCENTIVE` — for **Production** (repeat for Preview if you want
   preview deploys wired up). They bake in at build time, so redeploy after
   changing them.
4. **Deploy**. Optional: **Custom domains** tab → attach your domain.

> The old GitHub Pages workflow (`.github/workflows/deploy.yml`) and its
> `Settings → Pages → GitHub Actions` source can be retired to avoid two live
> URLs — the `404.html` deep-link hack is already removed.

## Deploy (GitHub Pages — legacy)

Pushing to `main` runs `.github/workflows/deploy.yml`: it builds and publishes
to Pages. One-time repo setup:

1. **Settings → Pages** → Source: **GitHub Actions**.
2. Add the production env values as repo **Actions secrets** (`VITE_SHEETS_ENDPOINT`,
   `VITE_SHEETS_TOKEN`) and **variables** (`VITE_CALENDLY_URL`,
   `VITE_SHOW_INCENTIVE`) — the workflow injects them at build time.
3. Site lives at `https://<user>.github.io/dave-campaign-page/`.
   (Optional custom domain: Settings → Pages → Custom domain + DNS.)

Deep links (`/quiz`, `/result`) on the legacy setup relied on a `404.html`
sessionStorage-based SPA fallback (removed — Cloudflare uses `_redirects`).

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
  lib/          questions.ts, attachment.ts + money.ts (scoring), submit.ts, copy.ts
apps-script/    Code.gs + deploy guide (Google Sheet sink)
campaign-plan.md  full plan: funnel, data model, scoring, analysis
```
