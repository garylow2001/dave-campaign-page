import { describe, expect, it } from "vitest"
import { QUESTIONS, findSkippedIndices } from "./questions"

/** Turn `["q01", "q03"]` into an `answers` record keyed by question id. */
function answersFor(ids: string[]): Record<string, number> {
  return Object.fromEntries(ids.map((id) => [id, 4]))
}

describe("findSkippedIndices", () => {
  it("returns nothing when no questions are answered", () => {
    expect(findSkippedIndices({})).toEqual([])
  })

  it("returns nothing for a fully sequential run", () => {
    expect(findSkippedIndices(answersFor(QUESTIONS.map((q) => q.id)))).toEqual([])
  })

  it("returns nothing when every question before the last is answered", () => {
    expect(findSkippedIndices(answersFor(["q01", "q02", "q03"]))).toEqual([])
  })

  it("flags a middle gap (answer q01–q03 then jump to q06)", () => {
    const skipped = findSkippedIndices(answersFor(["q01", "q02", "q03", "q06"]))
    // 0-indexed: q04 → 3, q05 → 4
    expect(skipped).toEqual([3, 4])
  })

  it("flags every earlier question when only a late one is answered", () => {
    expect(findSkippedIndices(answersFor(["q15"]))).toEqual(
      QUESTIONS.slice(0, 14).map((_, i) => i),
    )
  })

  it("leaves questions after the last answered unflagged", () => {
    // q01 answered, q15 answered → q02…q14 (indices 1–13) are the middle gap.
    expect(findSkippedIndices(answersFor(["q01", "q15"]))).toEqual(
      QUESTIONS.slice(1, 14).map((_, i) => i + 1),
    )
  })

  it("is unaffected by free-form keys (not part of the quiz items)", () => {
    const withFreeForm = answersFor(["q01"])
    ;(withFreeForm as Record<string, unknown>).moneyViews = "freedom"
    expect(findSkippedIndices(withFreeForm)).toEqual([])
  })
})
