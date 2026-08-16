import type { QuizResult } from "./attachment"

export type SubmitState = "idle" | "sending" | "sent" | "error"

export interface SubmissionPayload {
  answers: Record<string, number>
  result: QuizResult
  moneyViews: string
  moneyAssociation: string
  submittedAt: string
}

const ENDPOINT = import.meta.env.VITE_SHEETS_ENDPOINT ?? ""
// Trim: a stray trailing newline in a secret/env value would otherwise make the
// strict token check in Code.gs fail (token + "\n" !== token).
const SHARED_TOKEN = (import.meta.env.VITE_SHEETS_TOKEN ?? "").trim()

/**
 * Fire-and-forget save to the Google Apps Script → Google Sheet sink.
 * Uses Content-Type text/plain so the request is "simple" and skips the CORS
 * preflight that GitHub Pages + Apps Script would otherwise trip on.
 */
export async function submitResponse(payload: SubmissionPayload): Promise<void> {
  if (!ENDPOINT) {
    throw new Error("VITE_SHEETS_ENDPOINT is not set — configure .env")
  }

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ ...payload, token: SHARED_TOKEN }),
  })

  // Apps Script always answers HTTP 200, so the real status is the `ok` flag.
  const body = (await res.json().catch(() => null)) as { ok?: boolean } | null
  if (!res.ok || body?.ok === false) {
    throw new Error(`Submission failed (HTTP ${res.status})`)
  }
}
