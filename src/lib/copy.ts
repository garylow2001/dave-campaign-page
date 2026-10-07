import type { AttachmentStyle } from "./attachment"
import { buildReportInsights, type CareerOrientation, type MoneyArchetype, type MoneyMeaning, type MoneyProfile } from "./money"

/**
 * Result copy per style. Money framing lives here (per the brief), NOT in the
 * questionnaire items. DRAFT — rewrite in Dave's voice before launch.
 *
 * NOTE (V2 brief §3.4): attachment must not determine money interpretation.
 * These blurbs describe the relationship layer only; money interpretation
 * comes from the measured money scores (see ARCHETYPE_COPY etc. below).
 */
export const STYLE_COPY: Record<AttachmentStyle, { heading: string; blurb: string }> = {
  "Secure": {
    heading: "You feel secure in close relationships",
    blurb:
      "That security tends to show up as steadier expectations of others — a useful backdrop when looking at how you handle money too.",
  },
  "Anxious-Preoccupied": {
    heading: "You crave closeness — and can worry about it",
    blurb:
      "You may look for reassurance and notice distance quickly. How this interacts with money is personal — your money scores below tell the fuller story.",
  },
  "Dismissive-Avoidant": {
    heading: "You handle things independently",
    blurb:
      "You tend to rely on yourself and keep some emotional distance. Whether that extends to money is what your money scores below reveal.",
  },
  "Fearful-Avoidant": {
    heading: "You want security but can struggle to trust it",
    blurb:
      "Closeness can feel both wanted and uneasy. Your money pattern is measured separately below — it doesn't automatically follow from this style.",
  },
}

export const MIXED_NOTE =
  "Your answers don't fall neatly into one category. You appear to have a mixed pattern that may change depending on the relationship or situation."

export const DISCLAIMER =
  "Attachment can vary across romantic, family, and friendship relationships. This quiz is educational and is not a clinical diagnosis."

export const PILOT_DISCLAIMER =
  "AttachedToMoney.sg is in its early pilot stage. These bands (Lower / Moderate / Higher) are working thresholds, not validated clinical or psychometric cut-offs."

export const SECONDARY_LABEL = "Secondary tendency"

export const INCENTIVE_BANNER =
  "Help us test your profile — book a short Profile Review and tell us what felt accurate."

export const ARCHETYPE_COPY: Record<MoneyArchetype, { theme: string }> = {
  "Financial Rollercoaster": { theme: "Security + relief" },
  "Money Avoider": { theme: "Responsibility / stress" },
  "Comfort Spender": { theme: "Comfort + enjoyment" },
  "Safety Seeker": { theme: "Safety + reassurance" },
  "Financial Lone Wolf": { theme: "Independence + control" },
  "Independent Builder": { theme: "Freedom" },
  "Growth Chaser": { theme: "Achievement + progress" },
  "Steady Builder": { theme: "Progress / stability / options" },
}

export const MONEY_MEANING_COPY: Record<MoneyMeaning, { blurb: string }> = {
  Security: { blurb: "Money means safety — knowing unexpected events won't destabilise your life." },
  Freedom: { blurb: "Money means choice — the ability to decide how you live and spend your time." },
  Achievement: { blurb: "Money means progress — a visible measure of how well you are doing." },
  "Lifestyle / Validation": { blurb: "Money means enjoyment and standing — the experiences and standard of living it makes possible." },
}

export const CAREER_COPY: Record<CareerOrientation, { blurb: string }> = {
  "Stability Seeker": { blurb: "You prioritise predictable income and career security." },
  "Ambitious Climber": { blurb: "You are prepared to invest substantial effort now for greater future progress." },
  "Freedom Builder": { blurb: "You value flexibility and control over your time as a major reason for financial success." },
  "Balanced Achiever": { blurb: "You value progress without one career-money motive dominating your profile." },
}

export const PILOT_INVITATION = {
  heading: "Your result is only the beginning",
  intro:
    "AttachedToMoney.sg is currently in its early pilot stage. We are developing this assessment to better understand how attachment patterns, money attitudes and career motivations may interact — and we want to make sure the results reflect how people actually experience money in real life.",
  invite:
    "If you are open to it, we would love to arrange a short Profile Review session with you. During the session, we will walk through your results in more detail, understand which parts feel accurate — and which do not — explore how these patterns may show up in your real-life relationship with money, and use your feedback to improve the assessment.",
  noPrep: "There is no need to prepare anything beforehand.",
  secondSession:
    "If the conversation brings up financial goals or strategies you would like to explore further, we can always arrange a separate financial-planning discussion afterwards.",
  cta: "Help us test your profile",
} as const

/**
 * Plain-language building blocks for the result narrative. Written as one
 * flowing read — attachment, money meaning and how they show up — instead of
 * labelled cards per layer.
 */
export const ATTACHMENT_NARRATIVE: Record<AttachmentStyle, string> = {
  Secure:
    "In close relationships you tend to feel steady — comfortable with closeness without clinging to it.",
  "Anxious-Preoccupied":
    "In close relationships you tend to want reassurance — noticing distance quickly and turning things over in your mind.",
  "Dismissive-Avoidant":
    "In close relationships you tend to stay self-reliant — comfortable on your own and slower to lean on others.",
  "Fearful-Avoidant":
    "In close relationships you can feel pulled both ways — wanting closeness while finding it hard to fully trust it.",
}

export const MEANING_NARRATIVE: Record<MoneyMeaning, string> = {
  Security:
    "When it comes to money, safety comes first — knowing that unexpected events won't knock your life off course.",
  Freedom:
    "When it comes to money, freedom comes first — having choices, and never feeling trapped.",
  Achievement:
    "When it comes to money, progress comes first — it's one of the ways you tell yourself you're moving forward.",
  "Lifestyle / Validation":
    "When it comes to money, enjoyment comes first — the experiences and standard of living it makes possible.",
}

const SECONDARY_NOUN: Record<MoneyMeaning, string> = {
  Security: "safety",
  Freedom: "freedom",
  Achievement: "progress",
  "Lifestyle / Validation": "enjoyment",
}

export const CAREER_NARRATIVE: Record<CareerOrientation, string> = {
  "Stability Seeker": "At work, a predictable income and security come first.",
  "Ambitious Climber": "At work, you're prepared to put in the hard work now for greater progress later.",
  "Freedom Builder": "At work, flexibility and control over your time matter more than climbing the fastest.",
  "Balanced Achiever": "At work, no single money motive runs the show — you want progress without selling your life for it.",
}

/** Two short paragraphs: who you are with people + what money means, then how it shows up day to day. */
export function buildProfileNarrative(style: AttachmentStyle, money: MoneyProfile): string[] {
  const { description } = buildReportInsights(money)
  const first =
    `${ATTACHMENT_NARRATIVE[style]} ${MEANING_NARRATIVE[money.primaryMeaning]}` +
    (money.secondaryMeaning ? ` And ${SECONDARY_NOUN[money.secondaryMeaning]} runs a close second.` : "")
  return [first, `${description} ${CAREER_NARRATIVE[money.careerOrientation]}`]
}
