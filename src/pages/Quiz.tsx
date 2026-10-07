import { useMemo, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowRight, ArrowUp } from "lucide-react"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { LikertRating } from "@/components/LikertRating"
import { HoverLift } from "@/components/motion/HoverLift"
import { cn } from "@/lib/utils"
import { QUESTIONS, QUIZ_SECTIONS, findSkippedIndices } from "@/lib/questions"
import { MONEY_BEHAVIOUR_QUESTIONS, MONEY_MEANING_QUESTIONS, CAREER_QUESTIONS } from "@/lib/money"
import { useQuiz } from "@/context/quiz"

const cardReveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.35, ease: "easeOut" as const },
}

interface SectionBlock {
  meta: (typeof QUIZ_SECTIONS)[number]
  items: { id: string; text: string }[]
  offset: number
}

export default function Quiz() {
  const { answers, setAnswer, completeQuiz } = useQuiz()
  const navigate = useNavigate()

  const questionRefs = useRef<(HTMLDivElement | null)[]>([])

  const sections: SectionBlock[] = useMemo(() => {
    const blocks = [
      { meta: QUIZ_SECTIONS[0], items: QUESTIONS },
      { meta: QUIZ_SECTIONS[1], items: MONEY_BEHAVIOUR_QUESTIONS },
      { meta: QUIZ_SECTIONS[2], items: MONEY_MEANING_QUESTIONS },
      { meta: QUIZ_SECTIONS[3], items: CAREER_QUESTIONS },
    ]
    let offset = 0
    return blocks.map((b) => {
      const withOffset = { ...b, offset }
      offset += b.items.length
      return withOffset
    })
  }, [])

  const allItems = useMemo(() => sections.flatMap((s) => s.items), [sections])
  const totalCount = allItems.length

  // Questions passed over: an earlier question left unanswered while a later
  // one was answered (e.g. answering q6 with q4+q5 blank flags those two).
  // Section A keeps its stable `q01…` ids, so reuse its skipped-index helper
  // on the combined id list for the sticky chip.
  const allIds = useMemo(() => allItems.map((q) => q.id), [allItems])
  const skippedIndices = useMemo(() => findSkippedIndices(answers, allItems), [answers, allItems])
  const skippedSet = useMemo(() => new Set(skippedIndices), [skippedIndices])

  const answeredCount = allItems.filter((q) => answers[q.id] !== undefined).length
  const progress = Math.round((answeredCount / totalCount) * 100)

  // The submit button stays disabled until every question is answered.
  const allAnswered = answeredCount === totalCount

  // Aggregate label shown on every skipped card + the sticky chip.
  const skippedLabel =
    skippedIndices.length === 1
      ? "1 question skipped — answer it"
      : `${skippedIndices.length} questions skipped — answer them`

  const scrollToQuestion = (index: number) => {
    questionRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  /** On a fresh answer, snap to the next unanswered question. */
  const handleAnswer = (id: string, value: number, index: number) => {
    const isNewAnswer = answers[id] === undefined
    setAnswer(id, value)
    if (!isNewAnswer) return

    const nextIndex = allIds.findIndex((qid, i) => i > index && answers[qid] === undefined)
    if (nextIndex !== -1) {
      scrollToQuestion(nextIndex)
    }
  }

  const handleSubmit = () => {
    completeQuiz()
    navigate("/result")
  }

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-2xl flex-col gap-6 px-4 py-8">
      {/* Sticky progress */}
      <div className="sticky top-0 z-10 -mx-4 border-b bg-background/90 px-4 py-3 backdrop-blur">
        <div className="flex items-baseline justify-between text-sm text-muted-foreground">
          <span>Your progress</span>
          <span>
            {answeredCount} of {totalCount} answered
          </span>
        </div>
        <Progress value={progress} className="mt-2" aria-label="Quiz progress" />
        {skippedIndices.length > 0 && (
          <button
            type="button"
            onClick={() => scrollToQuestion(skippedIndices[0])}
            className="mt-2 inline-flex items-center gap-1 rounded-full border border-warning/40 bg-warning/10 px-2 py-0.5 text-xs font-medium text-warningForeground"
          >
            <ArrowUp className="size-3" /> {skippedLabel}
          </button>
        )}
      </div>

      <motion.div
        className="space-y-5"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {sections.map((section) => (
          <div key={section.meta.key} className="space-y-5">
            <div className="space-y-1 pt-2">
              <p className="text-xs font-semibold tracking-widest text-primary uppercase">
                {section.meta.eyebrow}
              </p>
              <h1 className="text-2xl font-bold tracking-tight">{section.meta.title}</h1>
              <p className="text-sm text-muted-foreground">{section.meta.intro}</p>
            </div>

            {section.items.map((q, i) => {
              const globalIndex = section.offset + i
              const skipped = skippedSet.has(globalIndex)
              return (
                <motion.div
                  key={q.id}
                  ref={(el) => {
                    questionRefs.current[globalIndex] = el
                  }}
                  {...cardReveal}
                >
                  <Card className={skipped ? "ring-2 ring-warning/50" : undefined}>
                    <CardContent className="space-y-5 p-5 sm:p-6">
                      <div className="flex items-baseline gap-3">
                        <span
                          className={cn(
                            "shrink-0 rounded-md px-2 py-0.5 text-xs font-medium",
                            skipped
                              ? "bg-warning/15 text-warningForeground"
                              : "bg-muted text-muted-foreground",
                          )}
                        >
                          {globalIndex + 1}
                        </span>
                        <h2 className="text-lg font-semibold leading-snug">{q.text}</h2>
                      </div>
                      {skipped && (
                        <motion.button
                          type="button"
                          onClick={() => scrollToQuestion(globalIndex)}
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25 }}
                          className="flex w-fit items-center gap-1 rounded-full bg-warning/15 px-2 py-0.5 text-xs font-medium text-warningForeground hover:bg-warning/25"
                        >
                          <ArrowUp className="size-3.5" /> {skippedLabel}
                        </motion.button>
                      )}
                      <LikertRating
                        value={answers[q.id]}
                        onChange={(v) => handleAnswer(q.id, v, globalIndex)}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        ))}

        <div className="pb-10 text-center">
          <HoverLift disabled={!allAnswered}>
            <Button
              size="lg"
              className="gap-2 text-base"
              disabled={!allAnswered}
              onClick={handleSubmit}
            >
              Get my result{" "}
              <ArrowRight className="size-4 transition-transform group-hover/button:translate-x-0.5" />
            </Button>
          </HoverLift>
          {!allAnswered && (
            <p className="mt-2 text-sm text-muted-foreground">
              Answer all {totalCount} questions to get your result.
            </p>
          )}
        </div>
      </motion.div>
    </main>
  )
}
