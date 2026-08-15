# Dave — Attachment & Money Campaign: Plan

> Goal: Run IG ads → a 3-page respondent funnel (attachment-style quiz + Calendly booking), with a **Dave-only** summary generated afterwards from the collected data.
>
> Scope for v1 (per 15 Aug tweaks + final algorithm content):
> - Pages 1–3 are respondent-facing; Page 4 is **internal to Dave**, generated offline from the Sheet — not a live app route.
> - Personal info (name/contact/DOB) is **not** collected on Page 2 — parked at the **Calendly** booking step (Calendly custom questions).
> - Questionnaire = **standard attachment-style items** (final 15 confirmed, §4.2). Money angle lives in marketing/result copy only.
> - **Free-form money questions: KEPT** on Page 2.
> - No drop-off/analytics collection in v1; no in-app charts.
> - Build: **React + TypeScript + Vite + Tailwind + shadcn/ui** (base) with optional **Magic UI** accents → static deploy to **GitHub Pages**.
> - Data sink: **Google Apps Script → Google Sheet** (GitHub Pages can't store data).
> - Repo: `https://github.com/garylow2001/dave-campaign-page` ⚠️ *not reachable anonymously at time of writing — private or not created yet; confirm before build.*

---

## 1. Overview & Funnel

```
IG Ad (UTM tags optional in v1)
   │  click
   ▼
PAGE 1 — Campaign page            "Who we are" + hook
   │  CTA: "Find out how your attachment style
   │       affects your relationship with money"
   ▼
PAGE 2 — Attachment-style quiz (15 items, 1–7) + 2 free-form money questions
   │  NO personal info here
   │  → scored in browser: anxiety / avoidance → style + confidence
   ▼
PAGE 3 — Result + booking
   ├─ Primary style + anxiety & avoidance scores (+ secondary tendency)
   ├─ Calendly embed  ← name / contact / DOB collected HERE
   └─ Togglable incentive
   │
   ▼
[Store] Answers + scores silently → Google Sheet (Google Apps Script)
   │
   ▼
PAGE 4 — Summary (Dave only, offline later)
   └─ Charts from the Sheet data: style breakdown, score distributions, free-form answers
```

**Two audiences**
- **Respondents** — Pages 1–3.
- **Dave** — the Google Sheet (all answers + scores) and a Page-4 report generated from it (Sheets charts or a notebook). No separate app route in v1.

---

## 2. Page-by-page spec

| # | Page | Purpose | Key elements | Notes |
|---|------|---------|--------------|-------|
| 1 | Campaign / Landing | Introduce who you are, sell the hook | "Who we are" blurb, hero CTA, trust cues | No form. Magic UI flair can live here (aurora/beams) |
| 2 | Questionnaire | Collect 15 attachment answers + free-form | **One item per screen** (Card + Progress + Likert 1–7 buttons — shadcn), then 2 free-form boxes | No name/contact/DOB. Scoring runs in-browser on submit |
| 3 | Result + booking | Show result + convert to a meeting | Primary style, anxiety/avoidance scores, secondary tendency, mixed-pattern note if borderline, disclaimer; **Calendly embed**; togglable incentive | Result computed client-side |
| 4 | Summary (Dave only) | Report with charts | Generated **afterwards** from the Sheet | Not a live page in v1 |

**Incentive (togglable)** — config flag (e.g. `VITE_SHOW_INCENTIVE`). When ON, Page 3 shows e.g. *"Book now to get your detailed money-attachment report."*

---

## 3. Data model

### 3.1 What's stored, and where

| Data | Collected at | Stored in | Sensitivity |
|------|-------------|-----------|-------------|
| 15 item responses (1–7) | P2 | Google Sheet (via Apps Script) | low–moderate |
| Anxiety score | computed (browser) | Google Sheet | low |
| Avoidance score | computed (browser) | Google Sheet | low |
| Attachment style (primary) | computed (browser) | Google Sheet | low |
| Secondary tendency | computed (browser) | Google Sheet | low |
| Confidence distance | computed (browser) | Google Sheet | low |
| "How do you see money?" | P2 (free-form) | Google Sheet | low–moderate |
| "What do you associate money with?" | P2 (free-form) | Google Sheet | low–moderate |
| Name, contact no., DOB | **P3 Calendly booking** | **Calendly** (separate from Sheet) | **personal data** |
| Timestamp | system | Google Sheet | — |

### 3.2 What's NOT built in v1 (parked)
- Drop-off / funnel analytics — later, only if wanted.
- In-app charts (Recharts) — replaced by offline charts from the Sheet.
- Per-person locked summary route — replaced by Calendly + a Dave-only report.

### 3.3 Joining the two silos (Sheet answers ↔ Calendly contact)
Answers live in the Sheet; contact info lives in Calendly. To tie a score to a person later:
- **Match on timestamp** (booking ≈ submit), or
- **Optional**: capture email on P3 alongside the result → join Sheet↔Calendly by email. Only add if per-person linking matters.

---

## 4. Questionnaire & scoring algorithm (final — from ChatGPT share)

### 4.1 Structure
- **15 items**, Likert **1 (Strongly disagree) → 7 (Strongly agree)**.
- Two subscales: **Anxiety** (7 items incl. 1 reversed) and **Avoidance** (8 items incl. 2 reversed).
- Standard **relationship-attachment** wording — **not** money-adapted.
- The share recommends 16–24 items split evenly; the example set it gives totals **exactly 15** (7 anxiety / 8 avoidance), which matches your original 15-qn brief. If you want even subscales, add 1 anxiety item.

### 4.2 Item bank (final — from the ChatGPT content)

**Anxiety subscale (7)**

| # | Item | Reversed? |
|---|------|-----------|
| A1 | I worry that people I care about may leave me. | no |
| A2 | I need frequent reassurance that my partner still cares about me. | no |
| A3 | I become anxious when someone takes longer than usual to reply. | no |
| A4 | I often wonder whether I am as important to others as they are to me. | no |
| A5 | When someone feels distant, I find it difficult to focus on other things. | no |
| A6 | I am afraid that I will be rejected after becoming emotionally invested. | no |
| A7 | I generally trust that people I care about will be there for me. | **yes** |

**Avoidance subscale (8)**

| # | Item | Reversed? |
|---|------|-----------|
| B1 | I feel uncomfortable depending on other people. | no |
| B2 | I prefer to deal with emotional problems by myself. | no |
| B3 | I find it difficult to fully open up to someone. | no |
| B4 | Too much emotional closeness can make me feel trapped. | no |
| B5 | I tend to pull away when another person becomes very dependent on me. | no |
| B6 | I avoid showing others how much I need them. | no |
| B7 | I feel comfortable asking someone close to me for support. | **yes** |
| B8 | Emotional closeness usually feels safe to me. | **yes** |

*(Mix A/B items in a shuffled order for presentation so respondents can't guess the subscales.)*

### 4.3 Reverse scoring + result (runs in browser)

**Reversal (7-point scale):** `reversedScore = 8 − response` (7→1, 6→2, …).

```
anxiety   = mean( all anxiety-item responses,  reversed ones adjusted )   # 1–7
avoidance = mean( all avoidance-item responses, reversed ones adjusted )  # 1–7
```

**Primary style** (cutoff 4.0):

```
function determineAttachmentStyle(anxiety, avoidance) {
  const cutoff = 4;
  if (anxiety < cutoff && avoidance < cutoff) return "Secure";
  if (anxiety >= cutoff && avoidance < cutoff) return "Anxious-Preoccupied";
  if (anxiety < cutoff && avoidance >= cutoff) return "Dismissive-Avoidant";
  return "Fearful-Avoidant";
}
```

**Borderline / mixed-pattern handling** (avoids calling 3.9 vs 4.1 a hard difference):

```
function scoreLevel(score) {
  if (score < 3.7) return "low";
  if (score <= 4.3) return "moderate";
  return "high";
}
// if either score is "moderate" → show:
// "Your answers don't fall neatly into one category. You appear to have a mixed
//  pattern that may change depending on the relationship or situation."
```

**Confidence distance** (how clearly they sit in the quadrant):

```
confidence = |anxiety − 4| + |avoidance − 4|
// e.g. anxiety 6.0, avoidance 2.0 → 4.0 (clear result)
//      anxiety 4.1, avoidance 3.9 → 0.2 (weak/mixed)
```

**Secondary tendency** (next-closest pattern) — distance from (anxiety, avoidance) to each quadrant center:

```
centers = { Secure:[2.5,2.5], Anxious-Preoccupied:[5.5,2.5],
            Dismissive-Avoidant:[2.5,5.5], Fearful-Avoidant:[5.5,5.5] }
distance = |anxiety − cx| + |avoidance − cy|
// primary  = closest center
// secondary = 2nd closest (show only when reasonably close, to avoid noise)
```

### 4.4 Result page contents (P3) — per the share's recommended structure

1. **Primary attachment pattern** (Secure / Anxious-Preoccupied / Dismissive-Avoidant / Fearful-Avoidant)
2. **Anxiety score** — e.g. `5.4/7`
3. **Avoidance score** — e.g. `3.1/7`
4. **Secondary tendency** — the next-closest pattern
5. **Mixed-pattern note** if a score is moderate (3.7–4.3)
6. **Context disclaimer** — *"Attachment can vary across romantic, family, and friendship relationships. This quiz is educational and is not a clinical diagnosis."*

### 4.5 Result copy (draft — write in your voice; money angle lives here, not in the items)

| Style | Anxiety | Avoidance | One-liner (draft) |
|-------|---------|-----------|-------------------|
| Secure | low | low | You feel secure in close relationships — and it likely shows in how you handle money. |
| Anxious-Preoccupied | high | low | You crave closeness and worry — this can make money feel more stressful than it is. |
| Dismissive-Avoidant | low | high | You handle things independently and avoid leaning on others — including financially. |
| Fearful-Avoidant | high | high | You want closeness but struggle to trust — a pattern that tends to repeat around money. |

> Future: once you have real respondent data, replace the 4.0 midpoint with **percentile-based cutoffs** for more defensible categories (noted in the share). Fine for the prototype.

---

## 5. Hosting, UI & data storage

### 5.1 Recommended stack (v1)

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **React + TypeScript + Vite** | Fast static build; outputs plain files for GitHub Pages |
| UI kit | **Tailwind + shadcn/ui** (base) + a few **Magic UI** accents | "Fun and interactive" questionnaire (Card/Progress/Buttons/Likert), animated landing & result flair |
| Scoring | Pure TS module (`attachment.ts`) | Testable, shared by quiz + result pages |
| Scheduling | **Calendly** embed | Captures name/contact/DOB via booking questions |
| Hosting | **GitHub Pages** | Free static hosting, custom domain, SSL |
| Data sink | **Google Apps Script → Google Sheet** | Free; Sheet doubles as chart source |
| Charts (Page 4) | Sheets charts or Python/pandas on exported CSV | Offline, after data accumulates |

**GitHub Pages gotcha (read):** project sites are served from `/dave-campaign-page/` (repo name), so set Vite `base: '/dave-campaign-page/'` (or use a custom domain → `base: '/'`). Without this, asset paths 404.

**Magic UI note:** its components are Framer Motion-heavy — use them sparingly (landing hero, result reveal) so the bundle stays light; shadcn covers the actual form interaction.

### 5.2 The GitHub Pages → storage gap
GitHub Pages can serve pages but **cannot store data**. The Apps Script web app is the bridge:

```
Quiz submit (browser)
   → fetch(POST JSON: answers, scores, style, confidence, free-form, timestamp)
     to your Apps Script URL
   → Apps Script appends a row to your Google Sheet
```

- Apps Script returns CORS headers for simple requests → the static page can POST directly.
- Add a **shared secret/token** in the POST body so random traffic can't spam the Sheet.
- Free-tier quotas are plenty for a campaign.

### 5.3 CSV / chart generation
- The Sheet *is* the CSV — export anytime (File → Download → CSV).
- Charts: Sheets built-ins, or `pandas`/`matplotlib` on the exported CSV.

### 5.4 Privacy (PDPA — assuming Singapore)
- Personal data now lives **only in Calendly** (name/contact/DOB at booking); the site only holds low-sensitivity quiz answers.
- Add a one-line note on P2/P3: quiz answers are used to generate your report; contact details are used for scheduling and follow-up.
- Calendly is a separate processor — its ToS covers booking data.

---

## 6. Setup steps (ordered checklist)

**Phase 0 — Content (mostly done)**
- [x] Final 15 items + reversed flags → §4.2 (from ChatGPT share)
- [ ] Shuffle item order for presentation (don't expose subscales)
- [ ] Write Page 1 copy: "Who we are" + CTA
- [ ] Write the 4-style result copy + mixed-pattern note + disclaimer → §4.4/4.5
- [ ] Write the 2 free-form questions + prompts
- [ ] Decide incentive wording + whether it's ON at launch

**Phase 1 — Accounts & infra (1 hr)**
- [ ] Confirm/create the GitHub repo `dave-campaign-page` (⚠️ not reachable at time of writing) and enable **GitHub Pages** (Actions workflow → gh-pages)
- [ ] Create the **Calendly** event; add **custom booking questions** for contact no. + DOB
- [ ] Create a Google Sheet; write + deploy the **Apps Script web app** (POST → append row); add a shared token

**Phase 2 — Build the app**
- [ ] Scaffold: `npm create vite@latest` (React+TS) → Tailwind → `npx shadcn@init` → add Card/Progress/Button/Textarea (+ chosen Magic UI components)
- [ ] Set Vite `base: '/dave-campaign-page/'`
- [ ] `attachment.ts`: scoring module (§4.3) with unit tests (fake answer set; verify reverse scoring + each quadrant + confidence)
- [ ] **P1** landing: hero + CTA
- [ ] **P2** quiz: one item per screen, Likert 1–7 buttons, progress bar, then 2 free-form textareas
- [ ] **P3** result: style + scores + secondary + mixed note + disclaimer, Calendly embed, incentive flag
- [ ] On submit → `fetch` POST to Apps Script URL (silent, non-blocking, with token)

**Phase 3 — Deploy & test**
- [ ] Push to GitHub → Actions builds + deploys to Pages
- [ ] End-to-end test: full quiz → result → Calendly booking → row appears in the Sheet
- [ ] Test token rejection (garbage POSTs don't land in the Sheet)
- [ ] Custom domain (optional)

**Phase 4 — After data accumulates**
- [ ] Export Sheet → generate the Dave-only Page-4 report (charts + style breakdown)
- [ ] Review/iterate: incentive toggle, copy, free-form questions, percentile cutoffs

---

## 7. Analysis — key decisions

1. **Personal info parked at Calendly simplifies the build.** The site handles no sensitive data → static hosting + Sheet sink is defensible and cheap.
2. **GitHub Pages + React/shadcn is a good fit for v1** because analytics, charts, and per-person routes are out of the pipeline. If you later want in-app analytics or a live summary route, that's the signal to move to Vercel + Supabase.
3. **The score data is still the core product.** Skip the Sheet sink and you get bookings but zero attachment data — which kills the Page-4 report. Don't skip it.
4. **React reintroduces a build step** (the earlier "plain HTML" plan didn't have one) — fine, it's just `npm run build` → Pages, and it buys you shadcn/Magic UI interactivity.
5. **Base path gotcha** (`/dave-campaign-page/`) is the classic reason a GitHub Pages React app looks broken on first deploy — handled in §5.1/§6.
6. **Soft edges, not hard labels** — the borderline range + confidence + secondary tendency (all from your share) is the right call for a public quiz; it reads as honest rather than "computer says you're anxious."
7. **Free-form questions kept** — they add qualitative signal for Page 4. Trade-off: they slow the form slightly. The result page is the payoff, so acceptable.

---

## 8. Open questions (need your input)

1. **Repo access** — `github.com/garylow2001/dave-campaign-page` wasn't reachable anonymously. Is it private (fine — I'll need auth to clone) or not created yet?
2. **Question count** — keep 15 (7/8 split, matches the share's examples) or add 1 anxiety item for an even 8/8?
3. **Calendly booking questions** — confirm which personal fields to require (contact no., DOB?) and whether full DOB is actually needed.
4. **Incentive** — what is it, and ON or OFF at launch?
5. **Sheet ownership** — which Google account should hold the Sheet (yours / business)?
6. **Email capture on P3?** — only if you want to reliably tie scores to Calendly bookings.
7. **Language** — English only, or EN + Chinese?
8. **Page-4 report format** — Google Sheets charts, or a Python notebook/PDF?

---

### Quick-reference TODO

- [x] Attachment style questions + ranking algo (reversed scoring) → §4; **items + algo finalised from ChatGPT share**
- [x] Keep free-form money questions → §2/§3
- [ ] Calendly link + booking questions (personal info parked here) → §5.1, §8.3
- [ ] Component library (shadcn/ui + Magic UI) → §5.1, §6 Phase 2
- [ ] Data storage → §5.1–5.2 (Google Apps Script → Google Sheet)
- [ ] CSV / chart generation (offline) → §5.3
- [ ] Hosting → §5.1 (GitHub Pages + Actions deploy; repo URL to confirm)
