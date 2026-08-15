import { LIKERT_MIN, LIKERT_MAX, QUESTIONS, type Subscale } from "./questions"

export type AttachmentStyle =
  | "Secure"
  | "Anxious-Preoccupied"
  | "Dismissive-Avoidant"
  | "Fearful-Avoidant"

export type Level = "low" | "moderate" | "high"

/** Quadrant midpoint on the 1–7 scale (from the ChatGPT share). */
export const CUTOFF = 4
/** Scores inside this band are treated as "moderate" / mixed. */
export const BORDER_LOW = 3.7
export const BORDER_HIGH = 4.3

/** Centres of each quadrant in (anxiety, avoidance) space, for the secondary tendency. */
const CENTERS: Record<AttachmentStyle, readonly [number, number]> = {
  "Secure": [2.5, 2.5],
  "Anxious-Preoccupied": [5.5, 2.5],
  "Dismissive-Avoidant": [2.5, 5.5],
  "Fearful-Avoidant": [5.5, 5.5],
}

/** For a 7-point Likert, the mirror score is (min + max) − response, i.e. 8 − x. */
export function reverseScore(response: number): number {
  return LIKERT_MIN + LIKERT_MAX - response
}

export function determineAttachmentStyle(anxiety: number, avoidance: number): AttachmentStyle {
  if (anxiety < CUTOFF && avoidance < CUTOFF) return "Secure"
  if (anxiety >= CUTOFF && avoidance < CUTOFF) return "Anxious-Preoccupied"
  if (anxiety < CUTOFF && avoidance >= CUTOFF) return "Dismissive-Avoidant"
  return "Fearful-Avoidant"
}

export function scoreLevel(score: number): Level {
  if (score < BORDER_LOW) return "low"
  if (score <= BORDER_HIGH) return "moderate"
  return "high"
}

/** How clearly the scores sit in a quadrant: |anxiety−4| + |avoidance−4|. */
export function confidence(anxiety: number, avoidance: number): number {
  return Math.abs(anxiety - CUTOFF) + Math.abs(avoidance - CUTOFF)
}

/** The next-closest pattern (2nd smallest distance to a quadrant centre). */
export function secondaryTendency(
  anxiety: number,
  avoidance: number,
  primary: AttachmentStyle,
): AttachmentStyle | null {
  const ranked = (Object.entries(CENTERS) as [AttachmentStyle, readonly [number, number]][])
    .filter(([style]) => style !== primary)
    .map(([style, [cx, cy]]) => ({
      style,
      dist: Math.abs(anxiety - cx) + Math.abs(avoidance - cy),
    }))
    .sort((a, b) => a.dist - b.dist)

  return ranked[0]?.style ?? null
}

export interface QuizResult {
  anxiety: number
  avoidance: number
  primary: AttachmentStyle
  secondary: AttachmentStyle | null
  confidence: number
  anxietyLevel: Level
  avoidanceLevel: Level
  /** True when either score sits in the borderline band 3.7–4.3. */
  mixed: boolean
}

/**
 * Compute the attachment profile from raw 1–7 answers keyed by question id.
 * Missing items are skipped (the UI enforces all-required, so this is defensive).
 */
export function scoreQuiz(answers: Record<string, number>): QuizResult {
  const buckets: Record<Subscale, number[]> = { anxiety: [], avoidance: [] }

  for (const item of QUESTIONS) {
    const raw = answers[item.id]
    if (raw === undefined || Number.isNaN(raw)) continue
    buckets[item.subscale].push(item.reversed ? reverseScore(raw) : raw)
  }

  const mean = (xs: number[]): number =>
    xs.length === 0 ? 0 : xs.reduce((a, b) => a + b, 0) / xs.length

  const anxiety = mean(buckets.anxiety)
  const avoidance = mean(buckets.avoidance)
  const primary = determineAttachmentStyle(anxiety, avoidance)

  return {
    anxiety,
    avoidance,
    primary,
    secondary: secondaryTendency(anxiety, avoidance, primary),
    confidence: confidence(anxiety, avoidance),
    anxietyLevel: scoreLevel(anxiety),
    avoidanceLevel: scoreLevel(avoidance),
    mixed: scoreLevel(anxiety) === "moderate" || scoreLevel(avoidance) === "moderate",
  }
}
