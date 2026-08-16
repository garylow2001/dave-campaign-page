import { useMemo, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowRight, ArrowUp } from "lucide-react"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { LikertRating } from "@/components/LikertRating"
import { HoverLift } from "@/components/motion/HoverLift"
import { cn } from "@/lib/utils"
import { QUESTIONS, FREE_FORM_QUESTIONS, findSkippedIndices } from "@/lib/questions"
import { useQuiz } from "@/context/quiz"

const cardReveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.35, ease: "easeOut" as const },
}

export default function Quiz() {
  const { answers, freeForm, setAnswer, setFreeForm, completeQuiz } = useQuiz()
  const navigate = useNavigate()

  const questionRefs = useRef<(HTMLDivElement | null)[]>([])
  const freeFormRef = useRef<HTMLDivElement | null>(null)

  // Questions passed over: an earlier question left unanswered while a later
  // one was answered (e.g. answering q6 with q4+q5 blank flags those two).
  const skippedIndices = useMemo(() => findSkippedIndices(answers), [answers])
  const skippedSet = useMemo(() => new Set(skippedIndices), [skippedIndices])

  const answeredCount = QUESTIONS.filter((q) => answers[q.id] !== undefined).length
  const progress = Math.round((answeredCount / QUESTIONS.length) * 100)

  // The submit button stays disabled until every question is answered.
  const allAnswered = answeredCount === QUESTIONS.length

  // Aggregate label shown on every skipped card + the sticky chip.
  const skippedLabel =
    skippedIndices.length === 1
      ? "1 question skipped — answer it"
      : `${skippedIndices.length} questions skipped — answer them`

  const scrollToQuestion = (index: number) => {
    questionRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  /** On a fresh answer, snap to the next unanswered question (or the free-form section). */
  const handleAnswer = (id: string, value: number, index: number) => {
    const isNewAnswer = answers[id] === undefined
    setAnswer(id, value)
    if (!isNewAnswer) return

    const nextIndex = QUESTIONS.findIndex(
      (q, i) => i > index && answers[q.id] === undefined,
    )
    if (nextIndex !== -1) {
      scrollToQuestion(nextIndex)
    } else {
      freeFormRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
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
            {answeredCount} of {QUESTIONS.length} answered
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
        <h1 className="text-2xl font-bold tracking-tight">
          How do you feel in close relationships?
        </h1>
        <p className="-mt-3 text-sm text-muted-foreground">
          Rate each statement 1 (strongly disagree) to 7 (strongly agree). Your answers
          jump to the next question automatically — you can scroll back to change any.
        </p>

        {QUESTIONS.map((q, i) => {
          const skipped = skippedSet.has(i)
          return (
            <motion.div
              key={q.id}
              ref={(el) => {
                questionRefs.current[i] = el
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
                      {i + 1}
                    </span>
                    <h2 className="text-lg font-semibold leading-snug">{q.text}</h2>
                  </div>
                  {skipped && (
                    <motion.button
                      type="button"
                      onClick={() => scrollToQuestion(i)}
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
                    onChange={(v) => handleAnswer(q.id, v, i)}
                  />
                </CardContent>
              </Card>
            </motion.div>
          )
        })}

        {/* Free-form section — the target for the final snap */}
        <motion.div ref={freeFormRef} {...cardReveal}>
          <Card>
            <CardContent className="space-y-6 p-5 sm:p-6">
              <h2 className="text-xl font-semibold">How do you see money?</h2>
              {FREE_FORM_QUESTIONS.map((q) => (
                <div key={q.id} className="space-y-2">
                  <Label htmlFor={q.id}>{q.label}</Label>
                  <Textarea
                    id={q.id}
                    value={freeForm[q.id as keyof typeof freeForm]}
                    onChange={(e) => setFreeForm(q.id as keyof typeof freeForm, e.target.value)}
                    placeholder={q.placeholder}
                    rows={3}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

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
              Answer all {QUESTIONS.length} questions to get your result.
            </p>
          )}
        </div>
      </motion.div>
    </main>
  )
}
