/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Google Apps Script web-app URL that appends a row to the Sheet. */
  readonly VITE_SHEETS_ENDPOINT?: string
  /** Shared secret the Apps Script checks before writing. */
  readonly VITE_SHEETS_TOKEN?: string
  /** Calendly embed URL, e.g. https://calendly.com/<user>/<event> */
  readonly VITE_CALENDLY_URL?: string
  /** "true" shows the incentive banner on the result page. */
  readonly VITE_SHOW_INCENTIVE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
