import { describe, expect, it } from "vitest"
import {
  MONEY_QUESTIONS,
  normalizeScore,
  pilotBand,
  scoreMoney,
  determineArchetype,
  determineMoneyMeaning,
  determineCareerOrientation,
  pickTensionInsight,
  type NormalizedScores,
} from "./money"
import { reverseScore } from "./attachment"

function baseScores(overrides: Partial<NormalizedScores> = {}): NormalizedScores {
  return {
    moneyAnxiety: 50,
    moneyAvoidance: 50,
    emotionalSpending: 50,
    financialConsistency: 50,
    security: 50,
    freedom: 50,
    achievement: 50,
    lifestyle: 50,
    stabilityDrive: 50,
    achievementDrive: 50,
    autonomyDrive: 50,
    sacrificeTolerance: 50,
    ...overrides,
  }
}

/** Raw 1–7 answers targeting the given normalized score for every construct. */
function answersForScore(target0to100: number): Record<string, number> {
  const avg = 1 + (target0to100 / 100) * 6
  const out: Record<string, number> = {}
  for (const item of MONEY_QUESTIONS) {
    out[item.id] = item.reversed ? reverseScore(avg) : avg
  }
  return out
}

describe("money question bank", () => {
  it("has 40 items: 16 behaviour + 12 meaning + 12 career", () => {
    expect(MONEY_QUESTIONS).toHaveLength(40)
    expect(MONEY_QUESTIONS.filter((q) => q.section === "behaviour")).toHaveLength(16)
    expect(MONEY_QUESTIONS.filter((q) => q.section === "meaning")).toHaveLength(12)
    expect(MONEY_QUESTIONS.filter((q) => q.section === "career")).toHaveLength(12)
  })

  it("marks b08, b12, b16 and d12 as reverse-scored", () => {
    const reversed = new Set(MONEY_QUESTIONS.filter((q) => q.reversed).map((q) => q.id))
    expect(reversed).toEqual(new Set(["b08", "b12", "b16", "d12"]))
  })
})

describe("normalizeScore / pilotBand", () => {
  it("maps 1→0, 4→50, 7→100", () => {
    expect(normalizeScore(1)).toBeCloseTo(0, 5)
    expect(normalizeScore(4)).toBeCloseTo(50, 5)
    expect(normalizeScore(7)).toBeCloseTo(100, 5)
  })

  it("labels 0–39 Lower, 40–59 Moderate, 60–100 Higher", () => {
    expect(pilotBand(39.9)).toBe("Lower")
    expect(pilotBand(40)).toBe("Moderate")
    expect(pilotBand(59.9)).toBe("Moderate")
    expect(pilotBand(60)).toBe("Higher")
  })
})

describe("scoreMoney", () => {
  it("reverse-scores before averaging (all-7s → avoidance high via b08 mirror)", () => {
    const answers: Record<string, number> = {}
    for (const q of MONEY_QUESTIONS) answers[q.id] = 7
    const p = scoreMoney(answers)
    // b08 reversed: 7 → 1, so avoidance avg = (7+7+7+1)/4 = 5.5 → ~75
    expect(p.scores.moneyAvoidance).toBeCloseTo(75, 5)
    expect(p.scores.moneyAnxiety).toBeCloseTo(100, 5)
  })

  it("round-trips a uniform target score", () => {
    const p = scoreMoney(answersForScore(80))
    for (const v of Object.values(p.scores)) {
      expect(v).toBeCloseTo(80, 5)
    }
  })

  it("tolerates missing answers without NaN", () => {
    const answers = answersForScore(60)
    delete answers["b01"]
    delete answers["d12"]
    const p = scoreMoney(answers)
    for (const v of Object.values(p.scores)) {
      expect(Number.isNaN(v)).toBe(false)
    }
  })
})

describe("determineArchetype (priority order)", () => {
  it("1. Financial Rollercoaster beats lower-priority matches", () => {
    const { archetype, mixedProfile } = determineArchetype(
      baseScores({ moneyAnxiety: 80, financialConsistency: 30, emotionalSpending: 80 }),
    )
    expect(archetype).toBe("Financial Rollercoaster")
    expect(mixedProfile).toBe(false)
  })

  it("2. Money Avoider", () => {
    const { archetype } = determineArchetype(
      baseScores({ moneyAvoidance: 80, financialConsistency: 40, moneyAnxiety: 40 }),
    )
    expect(archetype).toBe("Money Avoider")
  })

  it("3. Comfort Spender", () => {
    const { archetype } = determineArchetype(
      baseScores({ emotionalSpending: 80, financialConsistency: 50, moneyAnxiety: 40, moneyAvoidance: 40 }),
    )
    expect(archetype).toBe("Comfort Spender")
  })

  it("4. Safety Seeker needs anxiety + security + consistency", () => {
    const { archetype } = determineArchetype(
      baseScores({ moneyAnxiety: 80, security: 80, financialConsistency: 70 }),
    )
    expect(archetype).toBe("Safety Seeker")
  })

  it("5. Financial Lone Wolf", () => {
    const { archetype } = determineArchetype(
      baseScores({ freedom: 80, autonomyDrive: 80, moneyAvoidance: 70, financialConsistency: 40, moneyAnxiety: 40 }),
    )
    // Avoider rule (priority 2) also matches here (avoidance 70 + consistency 40)
    // so it must win — use lower avoidance that still meets Lone Wolf:
    void archetype
    const lone = determineArchetype(
      baseScores({ freedom: 80, autonomyDrive: 80, moneyAvoidance: 58, financialConsistency: 60, moneyAnxiety: 40, emotionalSpending: 40 }),
    )
    expect(lone.archetype).toBe("Financial Lone Wolf")
  })

  it("6. Independent Builder", () => {
    const { archetype } = determineArchetype(
      baseScores({ freedom: 80, autonomyDrive: 80, financialConsistency: 70, moneyAvoidance: 40, moneyAnxiety: 40, emotionalSpending: 40 }),
    )
    expect(archetype).toBe("Independent Builder")
  })

  it("7. Growth Chaser", () => {
    const { archetype } = determineArchetype(
      baseScores({ achievement: 80, achievementDrive: 80, moneyAvoidance: 40, moneyAnxiety: 40, emotionalSpending: 40, financialConsistency: 60 }),
    )
    expect(archetype).toBe("Growth Chaser")
  })

  it("8. Steady Builder", () => {
    const { archetype } = determineArchetype(
      baseScores({ financialConsistency: 80, moneyAvoidance: 30, moneyAnxiety: 40, emotionalSpending: 40 }),
    )
    expect(archetype).toBe("Steady Builder")
  })

  it("falls back to the closest archetype and flags mixedProfile", () => {
    const { archetype, mixedProfile } = determineArchetype(baseScores())
    expect(mixedProfile).toBe(true)
    expect(archetype).toBeTruthy()
  })
})

describe("determineMoneyMeaning", () => {
  it("ranks primary highest and shows secondary only when >= 55", () => {
    const r1 = determineMoneyMeaning(baseScores({ security: 80, freedom: 70 }))
    expect(r1.primary).toBe("Security")
    expect(r1.secondary).toBe("Freedom")

    const r2 = determineMoneyMeaning(baseScores({ security: 80, freedom: 54 }))
    expect(r2.primary).toBe("Security")
    expect(r2.secondary).toBeNull()
  })
})

describe("determineCareerOrientation", () => {
  it("Stability Seeker needs >= 65 and strictly highest", () => {
    expect(determineCareerOrientation(baseScores({ stabilityDrive: 80, achievementDrive: 70, autonomyDrive: 70 }))).toBe("Stability Seeker")
    expect(determineCareerOrientation(baseScores({ stabilityDrive: 80, achievementDrive: 80, autonomyDrive: 50 }))).not.toBe("Stability Seeker")
  })

  it("Ambitious Climber needs achievement drive + sacrifice tolerance", () => {
    expect(determineCareerOrientation(baseScores({ achievementDrive: 80, sacrificeTolerance: 70 }))).toBe("Ambitious Climber")
  })

  it("Freedom Builder needs autonomy >= 65 and above stability", () => {
    expect(determineCareerOrientation(baseScores({ autonomyDrive: 80, stabilityDrive: 60 }))).toBe("Freedom Builder")
  })

  it("falls back to Balanced Achiever", () => {
    expect(determineCareerOrientation(baseScores())).toBe("Balanced Achiever")
  })
})

describe("pickTensionInsight", () => {
  it("only fires when scores support it", () => {
    expect(
      pickTensionInsight(baseScores({ security: 80, moneyAnxiety: 80, financialConsistency: 80 })),
    ).toContain("disciplined")
    expect(pickTensionInsight(baseScores())).toBeNull()
  })
})
