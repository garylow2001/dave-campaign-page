# Campaign Account Setup — Handoff Guide

Who this is for: **Dave** (owns the Google + Calendly accounts) and **Gary** (the developer wiring the app).

Every step is tagged:
- 👤 **Dave** — only Dave can do this (account owner)
- 🔧 **Gary** — the developer can do this once Dave provides access/links
- 🤝 **Both** — needs coordination

> The app is built and deployed. These are the last two integrations before it
> collects real data. **Goal:** Gary ends up with (1) a Calendly URL and (2) a
> Sheets write-endpoint URL + shared token, then drops them into the app.

---

## 0. The division of labour (30-second version)

| Thing | Owner | Gary receives |
|-------|-------|---------------|
| Calendly account + event type + booking questions | 👤 Dave | The event link (`https://calendly.com/<dave>/<event>`) |
| Google Sheet ("Campaign Responses") | 👤 Dave | Edit access to the Sheet |
| Apps Script (writes quiz rows to the Sheet) | 🔧 Gary (or Dave — see §3) | The `/exec` URL + shared token (Gary makes it) |

Everything Gary receives goes into the app's config. Nothing else is needed.

---

## 1. Calendly (booking + personal info capture)

Personal info (name, contact no., DOB) is deliberately **not** collected on the
site — it's captured here, at the booking step. So this event type *is* your
lead-capture form.

### 👤 Dave — create the event

1. **Create a Calendly account** (`calendly.com` → Sign up). Dave's own Google
   email works for sign-in. (Free plan is fine to start.)
2. **Create the event type**: **Events** → **+ New event type** → choose
   **"One-on-one"** → name it e.g. **"Money & Attachment Debrief"** → set
   duration (e.g. **15 min**) → **Continue** → save.
3. **Add the booking questions** (this is where contact no. + DOB get captured):
   - Open the event type → **⋯** menu → **Edit**.
   - Scroll to **More options** → expand **Invitee form**.
   - Under **Invitee details**: decide name format (one field is enough) — email
     is always collected automatically.
   - Click **+ Add new question** and add, as **Required**:
     - **Contact number** → answer type **Phone number**
     - **Date of birth** → answer type **One line**
     - *(Optional)* a consent checkbox (answer type **Checkboxes**, single option)
       if Dave wants an explicit PDPA opt-in at booking.
   - **Save changes.**
   - *Up to 10 custom questions allowed per event type.*
4. **Send Gary the event link**: on the event type, **Share** → copy the link
   (format: `https://calendly.com/<dave-username>/<event-name>`).

> 💡 **If Dave wants to skip DOB**: it's the most sensitive field. "Age band"
> (a dropdown) is a lighter alternative, or drop it entirely. Decision is Dave's.

### 🔧 Gary — wire it in

5. Put the event link into the app:
   ```
   VITE_CALENDLY_URL=https://calendly.com/<dave-username>/<event-name>
   ```
   (Any Calendly scheduling link works directly as the iframe `src` — the Result
   page already renders it.) For the deployed site, set the same value as a
   GitHub Actions **variable** `VITE_CALENDLY_URL`.
6. **Verify**: book a test slot through the deployed Result page; check the
   answers show under Dave's **Meetings → Scheduled Events**.

---

## 2. Google Sheets (response storage)

### 👤 Dave — create the Sheet and share it

1. Use an existing Google account (or create one).
2. Go to **sheets.new**, name the sheet e.g. **"Campaign Responses"**.
3. **Share** it with Gary's Google email as **Editor**:
   **Share** button → add email → role **Editor** → Send.
   *(Gary needs edit access because the Apps Script writes rows to it.)*
4. Copy the **Sheet ID** — the long string in the URL between `/d/` and `/edit`
   (e.g. `1AbC...xyz`). Keep it to hand; the script needs it.

### 🔧 Gary — deploy the Apps Script (recommended path)

The script code already lives in the repo: `apps-script/Code.gs`.

5. Open the shared Sheet → **Extensions → Apps Script** → replace the default
   `Code.gs` with the file from the repo.
6. Fill in the two constants at the top:
   - `SPREADSHEET_ID = "<the id from step 4>"`
   - `SHARED_TOKEN = "<long random string>"` — this must match the site's
     `VITE_SHEETS_TOKEN`.
7. **Deploy → New deployment → Web app**:
   - **Execute as:** Me (Gary)
   - **Who has access:** Anyone
   - **Deploy** → copy the **Web app URL** (ends in `/exec`).
   - Authorize the script when prompted (grant access to the Sheet).
8. Wire the app (local + production):
   ```
   VITE_SHEETS_ENDPOINT=https://script.google.com/macros/s/<...>/exec
   VITE_SHEETS_TOKEN=<the same random string>
   ```
   Production → set these as GitHub Actions **secrets** `VITE_SHEETS_ENDPOINT`
   and `VITE_SHEETS_TOKEN`.
9. **Verify** with the curl test in `apps-script/README.md` → expect `{"ok":true}`
   and a row (with headers) in the Sheet.

---

## 3. Alternative: Dave deploys the Apps Script himself

Use this only if Gary doesn't have (or doesn't want) a Google account that Dave
will share the Sheet with.

| Step | Who | Action |
|------|-----|--------|
| 1 | 🔧 Gary | Send Dave the `apps-script/Code.gs` file + `apps-script/README.md`. |
| 2 | 👤 Dave | Create the Sheet (skip sharing with Gary). |
| 3 | 👤 Dave | **Extensions → Apps Script** → paste `Code.gs` → fill `SPREADSHEET_ID` + `SHARED_TOKEN`. |
| 4 | 👤 Dave | **Deploy → New deployment → Web app** → Execute as **Me**, access **Anyone** → copy the `/exec` URL. |
| 5 | 👤 Dave | Send Gary the **`/exec` URL** and the **`SHARED_TOKEN`** value. |
| 6 | 🔧 Gary | Put them into `VITE_SHEETS_ENDPOINT` / `VITE_SHEETS_TOKEN`. |

> **Why option A (Gary deploys) is usually better:** the developer can test the
> curl, read the errors, and re-deploy without two rounds of copy-paste. Either
> works; pick what Dave is comfortable with.

---

## 4. What gets sent between you

### 👤 Dave → 🔧 Gary
- [ ] Calendly event link (`https://calendly.com/<dave>/<event>`)
- [ ] Google Sheet shared with Gary's email (Editor)
- [ ] Sheet ID (or Gary copies it from the shared URL)
- *(If option B)* the Apps Script `/exec` URL + `SHARED_TOKEN`

### 🔧 Gary → 👤 Dave
- [ ] *(If option B)* `apps-script/Code.gs` + setup instructions
- [ ] Test URL to click through: `https://<user>.github.io/dave-campaign-page/`
- [ ] Ask Dave to approve the first script authorization (only in option B) / no action needed in option A

---

## 5. Final end-to-end test checklist (Gary)

1. [ ] `npm run dev` → take the quiz → no "couldn't be saved" banner.
2. [ ] Row appears in the Google Sheet with all 15 answers + scores + free-form text.
3. [ ] Wrong-token POST is rejected (curl in `apps-script/README.md`).
4. [ ] Deployed site: book a Calendly slot → booking lands on Dave's calendar +
      the contact no. / DOB answers are visible in Dave's **Meetings → Scheduled Events**.
5. [ ] Quiz answers and Calendly booking can be matched (same timestamp, or by
      adding an optional email capture to the quiz if per-person linking matters).

---

## 6. Decisions still open (flag to Dave)

- **DOB**: full date, age band, or drop?
- **Incentive**: what is it, and on/off at launch? (Env `VITE_SHOW_INCENTIVE`)
- **Free-form questions**: keep as optional, or make required?
- **Custom domain**: `dave.example.com` vs `…github.io/dave-campaign-page`?

---

## Sources

Calendly setup details verified from:
- [How to add or remove invitee questions — Calendly Help](https://help.calendly.com/hc/en-us/articles/14076808543511-How-to-add-or-remove-invitee-questions)
- [Advanced booking form features — Calendly Help](https://calendly.com/help/advanced-booking-form-features)
- [How to embed Calendly with an iframe — Calendly Help](https://help.calendly.com/hc/en-us/articles/31645309248791-How-to-embed-Calendly-with-an-iframe)
- [How to display the scheduling page for users of your app — Calendly Dev](https://developer.calendly.com/how-to-display-the-scheduling-page-for-users-of-your-app)
