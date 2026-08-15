import { describe, it, expect } from "vitest"
import { QUESTIONS } from "./questions"
import {
  reverseScore,
  scoreQuiz,
  scoreLevel,
  determineAttachmentStyle,
  confidence,
  CUTOFF,
} from "./attachment"

/**
 * Build raw 1–7 answers that land the respondent on the given subscale targets.
 * Reversed items get the mirrored response so the *adjusted* score equals target.
 */
function answersFor(targets: { anxiety: number; avoidance: number }): Record<string, number> {
  const out: Record<string, number> = {}
  for (const item of QUESTIONS) {
    const target = item.subscale === "anxiety" ? targets.anxiety : targets.avoidance
    out[item.id] = item.reversed ? reverseScore(target) : target
  }
  return out
}

describe("reverseScore", () => {
  it("mirrors a 7-point Likert: 7→1, 6→2, 4→4, 1→7", () => {
    expect(reverseScore(7)).toBe(1)
    expect(reverseScore(6)).toBe(2)
    expect(reverseScore(4)).toBe(4)
    expect(reverseScore(1)).toBe(7)
  })
})

describe("determineAttachmentStyle (quadrant rule)", () => {
  it("maps all four quadrants correctly", () => {
    expect(determineAttachmentStyle(2, 2)).toBe("Secure")
    expect(determineAttachmentStyle(5, 2)).toBe("Anxious-Preoccupied")
    expect(determineAttachmentStyle(2, 5)).toBe("Dismissive-Avoidant")
    expect(determineAttachmentStyle(5, 5)).toBe("Fearful-Avoidant")
  })

  it("uses >= cutoff for high, < for low", () => {
    expect(determineAttachmentStyle(CUTOFF - 0.1, 2)).toBe("Secure")
    expect(determineAttachmentStyle(CUTOFF, 2)).toBe("Anxious-Preoccupied")
  })
})

describe("scoreLevel (borderline band)", () => {
  it("marks 3.7–4.3 as moderate, outside as low/high", () => {
    expect(scoreLevel(3.69)).toBe("low")
    expect(scoreLevel(3.7)).toBe("moderate")
    expect(scoreLevel(4.3)).toBe("moderate")
    expect(scoreLevel(4.31)).toBe("high")
  })
})

describe("scoreQuiz", () => {
  it("computes Secure for a low/low profile", () => {
    const r = scoreQuiz(answersFor({ anxiety: 1, avoidance: 1 }))
    expect(r.primary).toBe("Secure")
    expect(r.anxiety).toBeCloseTo(1, 5)
    expect(r.avoidance).toBeCloseTo(1, 5)
    expect(r.mixed).toBe(false)
    expect(r.confidence).toBeCloseTo(6, 5)
  })

  it("computes Anxious-Preoccupied with Secure as secondary", () => {
    const r = scoreQuiz(answersFor({ anxiety: 6, avoidance: 1.5 }))
    expect(r.primary).toBe("Anxious-Preoccupied")
    expect(r.secondary).toBe("Secure")
    expect(r.anxietyLevel).toBe("high")
    expect(r.avoidanceLevel).toBe("low")
  })

  it("computes Dismissive-Avoidant with Secure as secondary", () => {
    const r = scoreQuiz(answersFor({ anxiety: 2, avoidance: 5 }))
    expect(r.primary).toBe("Dismissive-Avoidant")
    expect(r.secondary).toBe("Secure")
  })

  it("computes Fearful-Avoidant (secondary resolves deterministically on ties)", () => {
    const r = scoreQuiz(answersFor({ anxiety: 5, avoidance: 5 }))
    expect(r.primary).toBe("Fearful-Avoidant")
    expect(r.secondary).toBe("Anxious-Preoccupied")
  })

  it("flags a mixed/borderline pattern when a score lands in 3.7–4.3", () => {
    const r = scoreQuiz(answersFor({ anxiety: 4, avoidance: 2 }))
    expect(r.mixed).toBe(true)
    expect(r.anxietyLevel).toBe("moderate")
    expect(r.primary).toBe("Anxious-Preoccupied")
  })

  it("tolerates a missing answer without producing NaN", () => {
    const answers = answersFor({ anxiety: 3, avoidance: 3 })
    delete answers["q07"]
    const r = scoreQuiz(answers)
    expect(Number.isNaN(r.anxiety)).toBe(false)
    expect(Number.isNaN(r.avoidance)).toBe(false)
    expect(r.primary).toBeTruthy()
  })

  it("produces a clear Fearful-Avoidant with high confidence at 7/7", () => {
    const r = scoreQuiz(answersFor({ anxiety: 7, avoidance: 7 }))
    expect(r.primary).toBe("Fearful-Avoidant")
    expect(r.confidence).toBeCloseTo(6, 5)
  })
})

describe("confidence", () => {
  it("is larger the further the profile is from the midpoint", () => {
    expect(confidence(6, 2)).toBeCloseTo(4, 5)
    expect(confidence(4.1, 3.9)).toBeCloseTo(0.2, 5)
  })
})
