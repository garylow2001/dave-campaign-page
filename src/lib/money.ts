import { reverseScore } from "./attachment"

/** All 12 pilot constructs measured by the new Sections B–D (1–7 scale internally, 0–100 for display). */
export type MoneyConstruct =
  | "moneyAnxiety"
  | "moneyAvoidance"
  | "emotionalSpending"
  | "financialConsistency"
  | "security"
  | "freedom"
  | "achievement"
  | "lifestyle"
  | "stabilityDrive"
  | "achievementDrive"
  | "autonomyDrive"
  | "sacrificeTolerance"

export type MoneySection = "behaviour" | "meaning" | "career"

export interface MoneyItem {
  id: string
  text: string
  construct: MoneyConstruct
  section: MoneySection
  /** high agreement = LOW on the construct — apply `8 − response` before averaging */
  reversed: boolean
}

export const MONEY_BEHAVIOUR_QUESTIONS: MoneyItem[] = [
  { id: "b01", text: "I worry about whether I will have enough money in the future.", construct: "moneyAnxiety", section: "behaviour", reversed: false },
  { id: "b02", text: "I feel uneasy when my savings fall below an amount I consider safe.", construct: "moneyAnxiety", section: "behaviour", reversed: false },
  { id: "b03", text: "Even when my finances are generally okay, I sometimes worry that something could go wrong.", construct: "moneyAnxiety", section: "behaviour", reversed: false },
  { id: "b04", text: "Financial uncertainty is difficult for me to ignore.", construct: "moneyAnxiety", section: "behaviour", reversed: false },
  { id: "b05", text: "I sometimes delay looking at my finances because I would rather not think about them.", construct: "moneyAvoidance", section: "behaviour", reversed: false },
  { id: "b06", text: "When financial decisions become complicated, I tend to put them off.", construct: "moneyAvoidance", section: "behaviour", reversed: false },
  { id: "b07", text: "I have financial tasks that I know I should deal with but have been postponing.", construct: "moneyAvoidance", section: "behaviour", reversed: false },
  { id: "b08", text: "I generally deal with financial issues quickly rather than avoiding them.", construct: "moneyAvoidance", section: "behaviour", reversed: true },
  { id: "b09", text: "I am more likely to spend money when I am stressed or having a bad day.", construct: "emotionalSpending", section: "behaviour", reversed: false },
  { id: "b10", text: "Buying something I want can make me feel better emotionally.", construct: "emotionalSpending", section: "behaviour", reversed: false },
  { id: "b11", text: "I sometimes reward myself by spending after working hard or going through a stressful period.", construct: "emotionalSpending", section: "behaviour", reversed: false },
  { id: "b12", text: "My mood rarely affects how much I spend.", construct: "emotionalSpending", section: "behaviour", reversed: true },
  { id: "b13", text: "I regularly save or invest money regardless of what is happening that month.", construct: "financialConsistency", section: "behaviour", reversed: false },
  { id: "b14", text: "Once I create a financial plan, I generally stick to it.", construct: "financialConsistency", section: "behaviour", reversed: false },
  { id: "b15", text: "My financial habits are quite consistent from month to month.", construct: "financialConsistency", section: "behaviour", reversed: false },
  { id: "b16", text: "I often go through periods of being very disciplined with money followed by periods where I stop following my plan.", construct: "financialConsistency", section: "behaviour", reversed: true },
]

export const MONEY_MEANING_QUESTIONS: MoneyItem[] = [
  { id: "c01", text: "Having enough money makes me feel safe.", construct: "security", section: "meaning", reversed: false },
  { id: "c02", text: "One of my biggest financial goals is knowing that unexpected events will not destabilise my life.", construct: "security", section: "meaning", reversed: false },
  { id: "c03", text: "I would rather have more financial security than a more luxurious lifestyle.", construct: "security", section: "meaning", reversed: false },
  { id: "c04", text: "Money is important to me because it gives me more choices in life.", construct: "freedom", section: "meaning", reversed: false },
  { id: "c05", text: "I want enough money that I do not have to stay in a situation simply because I need the income.", construct: "freedom", section: "meaning", reversed: false },
  { id: "c06", text: "Being financially independent from other people is very important to me.", construct: "freedom", section: "meaning", reversed: false },
  { id: "c07", text: "Increasing my income or net worth makes me feel that I am progressing in life.", construct: "achievement", section: "meaning", reversed: false },
  { id: "c08", text: "Reaching financial milestones gives me a strong sense of accomplishment.", construct: "achievement", section: "meaning", reversed: false },
  { id: "c09", text: "Financial success is one way I measure how well I am doing.", construct: "achievement", section: "meaning", reversed: false },
  { id: "c10", text: "Being able to enjoy experiences and things I want is an important reason for earning money.", construct: "lifestyle", section: "meaning", reversed: false },
  { id: "c11", text: "Part of financial success to me is being able to afford a certain standard of living.", construct: "lifestyle", section: "meaning", reversed: false },
  { id: "c12", text: "Being financially successful affects how successful I feel others perceive me to be.", construct: "lifestyle", section: "meaning", reversed: false },
]

export const CAREER_QUESTIONS: MoneyItem[] = [
  { id: "d01", text: "A stable and predictable income is very important when I choose a career.", construct: "stabilityDrive", section: "career", reversed: false },
  { id: "d02", text: "I would hesitate to leave a secure job even if another opportunity had greater upside.", construct: "stabilityDrive", section: "career", reversed: false },
  { id: "d03", text: "Job security matters more to me than having the highest possible income.", construct: "stabilityDrive", section: "career", reversed: false },
  { id: "d04", text: "I am strongly motivated to progress in my career.", construct: "achievementDrive", section: "career", reversed: false },
  { id: "d05", text: "I regularly think about how I can increase my future earning power.", construct: "achievementDrive", section: "career", reversed: false },
  { id: "d06", text: "I want to reach a level of career or financial success that is significantly above average.", construct: "achievementDrive", section: "career", reversed: false },
  { id: "d07", text: "Having control over how I spend my time is extremely important to me.", construct: "autonomyDrive", section: "career", reversed: false },
  { id: "d08", text: "One reason I want to build wealth is so that I can choose whether or not I continue working.", construct: "autonomyDrive", section: "career", reversed: false },
  { id: "d09", text: "I would prefer greater independence and flexibility even if it meant giving up some stability.", construct: "autonomyDrive", section: "career", reversed: false },
  { id: "d10", text: "I am willing to work very hard now if it significantly improves my financial future.", construct: "sacrificeTolerance", section: "career", reversed: false },
  { id: "d11", text: "I would accept a demanding period in my career if the long-term financial payoff were worthwhile.", construct: "sacrificeTolerance", section: "career", reversed: false },
  { id: "d12", text: "There are limits to how much personal time I am willing to sacrifice for more money.", construct: "sacrificeTolerance", section: "career", reversed: true },
]

/** All 40 new items in presentation order: B (behaviour) → C (meaning) → D (career). */
export const MONEY_QUESTIONS: MoneyItem[] = [
  ...MONEY_BEHAVIOUR_QUESTIONS,
  ...MONEY_MEANING_QUESTIONS,
  ...CAREER_QUESTIONS,
]

export const CONSTRUCTS: readonly MoneyConstruct[] = [
  "moneyAnxiety",
  "moneyAvoidance",
  "emotionalSpending",
  "financialConsistency",
  "security",
  "freedom",
  "achievement",
  "lifestyle",
  "stabilityDrive",
  "achievementDrive",
  "autonomyDrive",
  "sacrificeTolerance",
]

export type PilotBand = "Lower" | "Moderate" | "Higher"

/** Convert a 1–7 average to the 0–100 display score. */
export function normalizeScore(avg: number): number {
  return ((avg - 1) / 6) * 100
}

/** Pilot-stage display band. NOT a validated clinical or psychometric cut-off. */
export function pilotBand(score0to100: number): PilotBand {
  if (score0to100 < 40) return "Lower"
  if (score0to100 < 60) return "Moderate"
  return "Higher"
}

export type NormalizedScores = Record<MoneyConstruct, number>

export interface MoneyProfile {
  /** 1–7 averages per construct (reverse-scored items already mirrored). */
  averages: Record<MoneyConstruct, number>
  /** 0–100 display scores per construct. */
  scores: NormalizedScores
  /** Display band per construct. */
  bands: Record<MoneyConstruct, PilotBand>
  archetype: MoneyArchetype
  /** True when no threshold rule fired and the closest archetype was assigned. Internal flag — never shown to the user. */
  mixedProfile: boolean
  primaryMeaning: MoneyMeaning
  secondaryMeaning: MoneyMeaning | null
  careerOrientation: CareerOrientation
}

/** Score Sections B–D from raw 1–7 answers keyed by item id. Missing items are skipped (the UI enforces all-required, so this is defensive). */
export function scoreMoney(answers: Record<string, number>): MoneyProfile {
  const buckets = {} as Record<MoneyConstruct, number[]>
  for (const c of CONSTRUCTS) buckets[c] = []

  for (const item of MONEY_QUESTIONS) {
    const raw = answers[item.id]
    if (raw === undefined || Number.isNaN(raw)) continue
    buckets[item.construct].push(item.reversed ? reverseScore(raw) : raw)
  }

  const mean = (xs: number[]): number =>
    xs.length === 0 ? 0 : xs.reduce((a, b) => a + b, 0) / xs.length

  const averages = {} as Record<MoneyConstruct, number>
  const scores = {} as NormalizedScores
  const bands = {} as Record<MoneyConstruct, PilotBand>
  for (const c of CONSTRUCTS) {
    averages[c] = mean(buckets[c])
    scores[c] = normalizeScore(averages[c])
    bands[c] = pilotBand(scores[c])
  }

  const { archetype, mixedProfile } = determineArchetype(scores)
  const { primary, secondary } = determineMoneyMeaning(scores)
  const careerOrientation = determineCareerOrientation(scores)

  return {
    averages,
    scores,
    bands,
    archetype,
    mixedProfile,
    primaryMeaning: primary,
    secondaryMeaning: secondary,
    careerOrientation,
  }
}

// ---------------------------------------------------------------------------
// Money archetypes (priority-ordered threshold rules, first match wins)
// ---------------------------------------------------------------------------

export type MoneyArchetype =
  | "Financial Rollercoaster"
  | "Money Avoider"
  | "Comfort Spender"
  | "Safety Seeker"
  | "Financial Lone Wolf"
  | "Independent Builder"
  | "Growth Chaser"
  | "Steady Builder"

export function determineArchetype(s: NormalizedScores): {
  archetype: MoneyArchetype
  mixedProfile: boolean
} {
  if (
    s.moneyAnxiety >= 60 &&
    s.financialConsistency < 50 &&
    (s.emotionalSpending >= 60 || s.moneyAvoidance >= 60)
  )
    return { archetype: "Financial Rollercoaster", mixedProfile: false }
  if (s.moneyAvoidance >= 65 && s.financialConsistency < 55)
    return { archetype: "Money Avoider", mixedProfile: false }
  if (s.emotionalSpending >= 65 && s.financialConsistency < 60)
    return { archetype: "Comfort Spender", mixedProfile: false }
  if (s.moneyAnxiety >= 65 && s.security >= 65 && s.financialConsistency >= 55)
    return { archetype: "Safety Seeker", mixedProfile: false }
  if (s.freedom >= 60 && s.autonomyDrive >= 60 && s.moneyAvoidance >= 55)
    return { archetype: "Financial Lone Wolf", mixedProfile: false }
  if (s.freedom >= 65 && s.autonomyDrive >= 65 && s.financialConsistency >= 60)
    return { archetype: "Independent Builder", mixedProfile: false }
  if (s.achievement >= 65 && s.achievementDrive >= 65 && s.moneyAvoidance < 60)
    return { archetype: "Growth Chaser", mixedProfile: false }
  if (
    s.financialConsistency >= 65 &&
    s.moneyAvoidance < 55 &&
    s.moneyAnxiety < 65 &&
    s.emotionalSpending < 65
  )
    return { archetype: "Steady Builder", mixedProfile: false }

  // Fallback: no rule fired — assign the archetype whose defining dimensions
  // are strongest overall and flag it internally as a mixed profile.
  return { archetype: closestArchetype(s), mixedProfile: true }
}

/** Fallback similarity: average strength of each archetype's defining dimensions (0–100). */
function closestArchetype(s: NormalizedScores): MoneyArchetype {
  const inv = (x: number) => 100 - x
  const candidates: [MoneyArchetype, number][] = [
    ["Financial Rollercoaster", (s.moneyAnxiety + inv(s.financialConsistency) + Math.max(s.emotionalSpending, s.moneyAvoidance)) / 3],
    ["Money Avoider", (s.moneyAvoidance + inv(s.financialConsistency)) / 2],
    ["Comfort Spender", (s.emotionalSpending + inv(s.financialConsistency)) / 2],
    ["Safety Seeker", (s.moneyAnxiety + s.security + s.financialConsistency) / 3],
    ["Financial Lone Wolf", (s.freedom + s.autonomyDrive + s.moneyAvoidance) / 3],
    ["Independent Builder", (s.freedom + s.autonomyDrive + s.financialConsistency) / 3],
    ["Growth Chaser", (s.achievement + s.achievementDrive + inv(s.moneyAvoidance)) / 3],
    ["Steady Builder", (s.financialConsistency + inv(s.moneyAvoidance) + inv(s.moneyAnxiety) + inv(s.emotionalSpending)) / 4],
  ]
  candidates.sort((a, b) => b[1] - a[1])
  return candidates[0][0]
}

// ---------------------------------------------------------------------------
// Money meaning (Section C, ranked directly — never inferred from archetype)
// ---------------------------------------------------------------------------

export type MoneyMeaning = "Security" | "Freedom" | "Achievement" | "Lifestyle / Validation"

const MEANING_CONSTRUCTS: Record<MoneyMeaning, MoneyConstruct> = {
  Security: "security",
  Freedom: "freedom",
  Achievement: "achievement",
  "Lifestyle / Validation": "lifestyle",
}

export function determineMoneyMeaning(s: NormalizedScores): {
  primary: MoneyMeaning
  secondary: MoneyMeaning | null
} {
  const ranked = (Object.keys(MEANING_CONSTRUCTS) as MoneyMeaning[])
    .map((m) => ({ meaning: m, score: s[MEANING_CONSTRUCTS[m]] }))
    .sort((a, b) => b.score - a.score)

  return {
    primary: ranked[0].meaning,
    secondary: ranked[1].score >= 55 ? ranked[1].meaning : null,
  }
}

// ---------------------------------------------------------------------------
// Career orientation (Section D)
// ---------------------------------------------------------------------------

export type CareerOrientation =
  | "Stability Seeker"
  | "Ambitious Climber"
  | "Freedom Builder"
  | "Balanced Achiever"

export function determineCareerOrientation(s: NormalizedScores): CareerOrientation {
  if (
    s.stabilityDrive >= 65 &&
    s.stabilityDrive > s.achievementDrive &&
    s.stabilityDrive > s.autonomyDrive
  )
    return "Stability Seeker"
  if (s.achievementDrive >= 65 && s.sacrificeTolerance >= 60) return "Ambitious Climber"
  if (s.autonomyDrive >= 65 && s.autonomyDrive > s.stabilityDrive) return "Freedom Builder"
  return "Balanced Achiever"
}

// ---------------------------------------------------------------------------
// Report insights — generated from measured scores, never from stereotypes
// ---------------------------------------------------------------------------

export interface ReportInsights {
  description: string
  strength: string
  areaToExplore: string
  tensionInsight: string | null
}

/**
 * Pick the most relevant tension pattern for this profile. Each insight is
 * only returned when the underlying scores actually support it.
 */
export function pickTensionInsight(s: NormalizedScores): string | null {
  if (s.security >= 60 && s.moneyAnxiety >= 60 && s.financialConsistency >= 60)
    return "You are disciplined, but feeling financially secure may require more than simply accumulating more."
  if (s.freedom >= 60 && s.autonomyDrive >= 60 && s.financialConsistency >= 60)
    return "You appear to use money primarily to create choice and independence."
  if (s.achievement >= 65 && s.achievementDrive >= 65)
    return "Progress and financial milestones are especially motivating for you."
  if (s.moneyAnxiety >= 60 && s.financialConsistency < 50)
    return "Security matters to you, but your current financial habits may not consistently provide the certainty you are seeking."
  if (s.emotionalSpending >= 60 && s.financialConsistency >= 60)
    return "You can be financially structured overall while still using spending as a form of reward or emotional release."
  if (s.moneyAvoidance >= 60 && s.security >= 60)
    return "You care strongly about financial security, yet some money decisions may feel uncomfortable enough to postpone."
  return null
}

function pickStrength(s: NormalizedScores): string {
  if (s.financialConsistency >= 60)
    return "You bring real consistency to your financial habits — you can set a plan and stay with it even when the month gets busy."
  if (s.security >= 65 && s.moneyAnxiety >= 60)
    return "You are highly aware of the importance of financial security and can become very motivated to regain control."
  if (s.freedom >= 65 && s.autonomyDrive >= 65)
    return "You use money deliberately and purposefully — as a tool to protect your independence and future choices."
  if (s.achievement >= 65 || s.achievementDrive >= 65)
    return "You set ambitious targets and take real satisfaction in hitting financial milestones."
  if (s.sacrificeTolerance >= 60)
    return "You are willing to put in sustained effort now when the long-term payoff is worthwhile."
  if (s.moneyAvoidance < 55)
    return "You are willing to face financial matters directly rather than putting them off."
  return "You have a clear sense of what money is for in your life, which is a solid starting point for shaping it further."
}

function pickAreaToExplore(s: NormalizedScores, tension: string | null): string {
  if (tension) return tension
  if (s.emotionalSpending >= 60)
    return "Whether spending sometimes functions as reward or relief — and what else might serve that need."
  if (s.moneyAvoidance >= 60)
    return "Which specific money tasks feel most uncomfortable to face — and what would make them easier to start."
  if (s.moneyAnxiety >= 60)
    return "What “enough” would actually look and feel like for you — in concrete numbers, not just a feeling."
  if (s.financialConsistency >= 65)
    return "Whether your current system still fits the life you want — or is running on autopilot."
  return "How your attachment patterns and money habits interact when finances feel stressful."
}

const ARCHETYPE_DESCRIPTIONS: Record<MoneyArchetype, string> = {
  "Financial Rollercoaster":
    "Financial security appears very important to you, but your answers suggest your behaviour may become less consistent when money feels stressful or restrictive. You may have periods of becoming highly focused on saving or getting organised, followed by periods of disengaging, postponing decisions or spending more freely.",
  "Money Avoider":
    "Money clearly matters to you, but your answers suggest financial tasks or decisions are often postponed — not because you don't care, but because they can feel uncomfortable, complicated or overwhelming. The delay itself may then create extra stress.",
  "Comfort Spender":
    "Your answers suggest spending is relatively sensitive to how you feel — it may function as a reward after hard work, a celebration, or relief on a difficult day. This isn't about a lack of awareness; the emotional payoff in the moment can simply outweigh the plan.",
  "Safety Seeker":
    "You appear generally responsible with money — yet your answers suggest it can still be difficult to feel that there is “enough”. The drive for security is a strength, even if reassurance doesn't always arrive with the next milestone.",
  "Financial Lone Wolf":
    "Your answers point to a strong preference for self-reliance and control around money. You likely prefer solving financial matters alone and may be reluctant to depend on others — capable, but potentially carrying the full weight yourself.",
  "Independent Builder":
    "Your answers suggest you use money deliberately to create choice, independence and control over your future time. Financial decisions appear to be guided by what they buy you in freedom, not just what they accumulate.",
  "Growth Chaser":
    "Financial progress, income growth and milestones appear genuinely motivating to you. Your answers suggest you enjoy setting increasingly ambitious targets — the sense of moving forward matters as much as the number itself.",
  "Steady Builder":
    "Your answers suggest you generally manage money consistently, without large emotional swings or repeated avoidance. That steadiness is a real asset — the interesting question is what it is building towards.",
}

export function buildReportInsights(profile: MoneyProfile): ReportInsights {
  const tension = pickTensionInsight(profile.scores)
  return {
    description: ARCHETYPE_DESCRIPTIONS[profile.archetype],
    strength: pickStrength(profile.scores),
    areaToExplore: pickAreaToExplore(profile.scores, tension),
    tensionInsight: tension,
  }
}
