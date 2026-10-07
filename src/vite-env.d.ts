/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Google Apps Script web-app URL that appends a row to the Sheet. */
  readonly VITE_SHEETS_ENDPOINT?: string
  /** Shared secret the Apps Script checks before writing. */
  readonly VITE_SHEETS_TOKEN?: string
  /** Calendly event URL (opens as a popup), e.g. https://calendly.com/<user>/<event> */
  readonly VITE_CALENDLY_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
