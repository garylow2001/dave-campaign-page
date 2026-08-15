import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { LikertRating } from "@/components/LikertRating"
import { QUESTIONS, FREE_FORM_QUESTIONS } from "@/lib/questions"
import { useQuiz } from "@/context/quiz"

const TOTAL_STEPS = QUESTIONS.length + FREE_FORM_QUESTIONS.length

export default function Quiz() {
  const { answers, freeForm, setAnswer, setFreeForm, completeQuiz } = useQuiz()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)

  const isQuestion = step < QUESTIONS.length
  const question = QUESTIONS[step]
  const answered = isQuestion ? answers[question.id] !== undefined : true
  const progress = Math.round((step / TOTAL_STEPS) * 100)

  const goNext = () => {
    if (isQuestion) {
      setStep((s) => s + 1)
    } else {
      completeQuiz()
      navigate("/result")
    }
  }

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-2xl flex-col justify-center gap-6 px-4 py-10">
      <div className="space-y-2">
        <div className="flex items-baseline justify-between text-sm text-muted-foreground">
          <span>
            {isQuestion ? `Question ${step + 1} of ${QUESTIONS.length}` : "Almost done"}
          </span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} aria-label="Quiz progress" />
      </div>

      <Card>
        <CardContent className="space-y-6 p-6 sm:p-8">
          {isQuestion ? (
            <>
              <h1 className="text-2xl font-semibold leading-snug text-balance">{question.text}</h1>
              <LikertRating value={answers[question.id]} onChange={(v) => setAnswer(question.id, v)} />
            </>
          ) : (
            <div className="space-y-6">
              <h1 className="text-2xl font-semibold">How do you see money?</h1>
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
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          <ArrowLeft className="size-4" /> Back
        </Button>
        <Button onClick={goNext} disabled={!answered} className="gap-2">
          {isQuestion ? (
            <>Next <ArrowRight className="size-4" /></>
          ) : (
            "Get my result"
          )}
        </Button>
      </div>
    </main>
  )
}
