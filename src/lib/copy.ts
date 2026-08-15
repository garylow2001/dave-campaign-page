import type { AttachmentStyle } from "./attachment"

/**
 * Result copy per style. Money framing lives here (per the brief), NOT in the
 * questionnaire items. DRAFT — rewrite in Dave's voice before launch.
 */
export const STYLE_COPY: Record<AttachmentStyle, { heading: string; blurb: string }> = {
  "Secure": {
    heading: "You feel secure in close relationships",
    blurb:
      "That security tends to show up in how you handle money too — calmer planning, fewer panicked decisions, and a real willingness to take good advice.",
  },
  "Anxious-Preoccupied": {
    heading: "You crave closeness — and it can bring money stress",
    blurb:
      "Your worry shows up in how you hold money as well: checking balances often, seeking reassurance, and feeling like 'enough' is never quite enough.",
  },
  "Dismissive-Avoidant": {
    heading: "You handle things independently",
    blurb:
      "You'd rather manage money alone than ask for help — capable, but it can mean avoiding advice exactly when it would help.",
  },
  "Fearful-Avoidant": {
    heading: "You want security but struggle to trust it",
    blurb:
      "Around money this often looks like craving control while avoiding the topic — a pattern worth unpacking together.",
  },
}

export const MIXED_NOTE =
  "Your answers don't fall neatly into one category. You appear to have a mixed pattern that may change depending on the relationship or situation."

export const DISCLAIMER =
  "Attachment can vary across romantic, family, and friendship relationships. This quiz is educational and is not a clinical diagnosis."

export const SECONDARY_LABEL = "Secondary tendency"

export const INCENTIVE_BANNER =
  "Book now to get your detailed money-attachment report — and we'll break down what your scores mean together."
