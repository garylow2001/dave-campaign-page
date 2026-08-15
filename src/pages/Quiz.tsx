import { useRef } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { LikertRating } from "@/components/LikertRating"
import { QUESTIONS, FREE_FORM_QUESTIONS } from "@/lib/questions"
import { useQuiz } from "@/context/quiz"

export default function Quiz() {
  const { answers, freeForm, setAnswer, setFreeForm, completeQuiz } = useQuiz()
  const navigate = useNavigate()

  const questionRefs = useRef<(HTMLDivElement | null)[]>([])
  const freeFormRef = useRef<HTMLDivElement | null>(null)

  const answeredCount = QUESTIONS.filter((q) => answers[q.id] !== undefined).length
  const progress = Math.round((answeredCount / QUESTIONS.length) * 100)

  /** On a fresh answer, snap to the next unanswered question (or the free-form section). */
  const handleAnswer = (id: string, value: number, index: number) => {
    const isNewAnswer = answers[id] === undefined
    setAnswer(id, value)
    if (!isNewAnswer) return

    const nextIndex = QUESTIONS.findIndex(
      (q, i) => i > index && answers[q.id] === undefined,
    )
    if (nextIndex !== -1) {
      questionRefs.current[nextIndex]?.scrollIntoView({ behavior: "smooth", block: "center" })
    } else {
      freeFormRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
    }
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
      </div>

      <div className="space-y-5">
        <h1 className="text-2xl font-bold tracking-tight">
          How do you feel in close relationships?
        </h1>
        <p className="-mt-3 text-sm text-muted-foreground">
          Rate each statement 1 (strongly disagree) to 7 (strongly agree). Your answers
          jump to the next question automatically — you can scroll back to change any.
        </p>

        {QUESTIONS.map((q, i) => (
          <Card
            key={q.id}
            ref={(el) => {
              questionRefs.current[i] = el
            }}
          >
            <CardContent className="space-y-5 p-5 sm:p-6">
              <div className="flex items-baseline gap-3">
                <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {i + 1}
                </span>
                <h2 className="text-lg font-semibold leading-snug">{q.text}</h2>
              </div>
              <LikertRating
                value={answers[q.id]}
                onChange={(v) => handleAnswer(q.id, v, i)}
              />
            </CardContent>
          </Card>
        ))}

        {/* Free-form section — the target for the final snap */}
        <Card ref={freeFormRef}>
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

        <div className="pb-10 text-center">
          <Button
            size="lg"
            className="gap-2 text-base"
            onClick={() => {
              completeQuiz()
              navigate("/result")
            }}
          >
            Get my result <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </main>
  )
}
