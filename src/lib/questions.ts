export type Subscale = "anxiety" | "avoidance"

export interface QuizItem {
  /** stable id used as the answer key */
  id: string
  /** display text (1–7 Likert) */
  text: string
  subscale: Subscale
  /** high agreement = LOW on the subscale */
  reversed: boolean
}

/**
 * Final 15 items — from the ChatGPT share (7 anxiety incl. 1 reversed,
 * 8 avoidance incl. 2 reversed). Presented in a fixed interleaved order so
 * respondents can't guess the subscales.
 */
export const QUESTIONS: QuizItem[] = [
  { id: "q01", text: "I worry that people I care about may leave me.", subscale: "anxiety", reversed: false },
  { id: "q02", text: "I feel uncomfortable depending on other people.", subscale: "avoidance", reversed: false },
  { id: "q03", text: "I need frequent reassurance that my partner still cares about me.", subscale: "anxiety", reversed: false },
  { id: "q04", text: "I prefer to deal with emotional problems by myself.", subscale: "avoidance", reversed: false },
  { id: "q05", text: "I become anxious when someone takes longer than usual to reply.", subscale: "anxiety", reversed: false },
  { id: "q06", text: "I find it difficult to fully open up to someone.", subscale: "avoidance", reversed: false },
  { id: "q07", text: "I often wonder whether I am as important to others as they are to me.", subscale: "anxiety", reversed: false },
  { id: "q08", text: "Too much emotional closeness can make me feel trapped.", subscale: "avoidance", reversed: false },
  { id: "q09", text: "When someone feels distant, I find it difficult to focus on other things.", subscale: "anxiety", reversed: false },
  { id: "q10", text: "I tend to pull away when another person becomes very dependent on me.", subscale: "avoidance", reversed: false },
  { id: "q11", text: "I am afraid that I will be rejected after becoming emotionally invested.", subscale: "anxiety", reversed: false },
  { id: "q12", text: "I avoid showing others how much I need them.", subscale: "avoidance", reversed: false },
  { id: "q13", text: "I generally trust that people I care about will be there for me.", subscale: "anxiety", reversed: true },
  { id: "q14", text: "I feel comfortable asking someone close to me for support.", subscale: "avoidance", reversed: true },
  { id: "q15", text: "Emotional closeness usually feels safe to me.", subscale: "avoidance", reversed: true },
]

export const LIKERT_MIN = 1
export const LIKERT_MAX = 7

/** Quiz sections in presentation order (V2 brief §2). Section A is the existing relationship-attachment block; B–D are new. */
export interface QuizSectionMeta {
  key: string
  eyebrow: string
  title: string
  intro: string
}

export const QUIZ_SECTIONS: QuizSectionMeta[] = [
  {
    key: "attachment",
    eyebrow: "Section A · Relationship attachment",
    title: "How do you feel in close relationships?",
    intro:
      "Rate each statement 1 (strongly disagree) to 7 (strongly agree). Your answers jump to the next question automatically — you can scroll back to change any.",
  },
  {
    key: "behaviour",
    eyebrow: "Section B · Money behaviour",
    title: "How do you behave and feel around money?",
    intro: "Same 1–7 scale. There are no right answers — go with what is most true for you.",
  },
  {
    key: "meaning",
    eyebrow: "Section C · What money means",
    title: "What does money represent to you?",
    intro:
      "This section explores why money matters to you — not how competent you are with it. Same 1–7 scale.",
  },
  {
    key: "career",
    eyebrow: "Section D · Career & money drive",
    title: "How do money and career mix for you?",
    intro: "Final scored section — how money, security and autonomy influence your career choices.",
  },
]

/** "1 = Strongly disagree … 7 = Strongly agree" labels shown per value */
export const LIKERT_LABELS: Record<number, string> = {
  1: "Strongly disagree",
  2: "Disagree",
  3: "Slightly disagree",
  4: "Neutral",
  5: "Slightly agree",
  6: "Agree",
  7: "Strongly agree",
}

/**
 * Indices of questions the respondent "passed over": an earlier question left
 * unanswered while a later one has been answered (e.g. answering q6 with q4
 * and q5 blank flags those two). Questions after the last answered one are
 * simply "not reached yet" and never flagged.
 */
export function findSkippedIndices(
  answers: Record<string, number>,
  questions: readonly { id: string }[] = QUESTIONS,
): number[] {
  let lastAnswered = -1
  for (let i = 0; i < questions.length; i++) {
    if (answers[questions[i].id] !== undefined) lastAnswered = i
  }

  const skipped: number[] = []
  for (let i = 0; i < lastAnswered; i++) {
    if (answers[questions[i].id] === undefined) skipped.push(i)
  }
  return skipped
}

