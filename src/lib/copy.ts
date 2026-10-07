import type { AttachmentStyle } from "./attachment"
import { buildReportInsights, type MoneyMeaning, type MoneyProfile } from "./money"

/**
 * Result copy per style. Money framing lives here (per the brief), NOT in the
 * questionnaire items. DRAFT — rewrite in Dave's voice before launch.
 *
 * NOTE (V2 brief §3.4): attachment must not determine money interpretation.
 * These blurbs describe the relationship layer only; money interpretation
 * comes from the measured money scores via buildReportInsights.
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

/** Two short paragraphs: who you are with people + what money means, then how it shows up day to day. */
export function buildProfileNarrative(style: AttachmentStyle, money: MoneyProfile): string[] {
  const { description } = buildReportInsights(money)
  const first =
    `${ATTACHMENT_NARRATIVE[style]} ${MEANING_NARRATIVE[money.primaryMeaning]}` +
    (money.secondaryMeaning ? ` And ${SECONDARY_NOUN[money.secondaryMeaning]} runs a close second.` : "")
  return [first, description]
}
