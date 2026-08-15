import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"
import { scoreQuiz, type QuizResult } from "@/lib/attachment"
import { submitResponse, type SubmitState } from "@/lib/submit"

export interface FreeForm {
  moneyViews: string
  moneyAssociation: string
}

const EMPTY_FREEFORM: FreeForm = { moneyViews: "", moneyAssociation: "" }
const STORAGE_KEY = "dave-quiz-state"

interface PersistedState {
  answers: Record<string, number>
  freeForm: FreeForm
  result: QuizResult | null
}

function loadState(): PersistedState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PersistedState>
      return {
        answers: parsed.answers ?? {},
        freeForm: { ...EMPTY_FREEFORM, ...parsed.freeForm },
        result: parsed.result ?? null,
      }
    }
  } catch {
    // corrupt / unavailable storage — start fresh
  }
  return { answers: {}, freeForm: EMPTY_FREEFORM, result: null }
}

interface QuizContextValue {
  answers: Record<string, number>
  freeForm: FreeForm
  result: QuizResult | null
  submitState: SubmitState
  setAnswer: (id: string, value: number) => void
  setFreeForm: (id: keyof FreeForm, value: string) => void
  /** Score the answers, stash the result, and fire the (non-blocking) save. */
  completeQuiz: () => void
  retrySubmit: () => void
  resetQuiz: () => void
}

const QuizContext = createContext<QuizContextValue | null>(null)

export function QuizProvider({ children }: { children: ReactNode }) {
  const initial = loadState()
  const [answers, setAnswers] = useState<Record<string, number>>(initial.answers)
  const [freeForm, setFreeFormState] = useState<FreeForm>(initial.freeForm)
  const [result, setResult] = useState<QuizResult | null>(initial.result)
  const [submitState, setSubmitState] = useState<SubmitState>(initial.result ? "sent" : "idle")

  // Persist across refreshes (also survives accidental navigation away).
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, freeForm, result }))
  }, [answers, freeForm, result])

  const setAnswer = useCallback((id: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }, [])

  const setFreeForm = useCallback((id: keyof FreeForm, value: string) => {
    setFreeFormState((prev) => ({ ...prev, [id]: value }))
  }, [])

  const runSubmit = useCallback((answersArg: Record<string, number>, freeFormArg: FreeForm, resultArg: QuizResult) => {
    setSubmitState("sending")
    submitResponse({
      answers: answersArg,
      result: resultArg,
      moneyViews: freeFormArg.moneyViews,
      moneyAssociation: freeFormArg.moneyAssociation,
      submittedAt: new Date().toISOString(),
    })
      .then(() => setSubmitState("sent"))
      .catch((err: unknown) => {
        console.error("Failed to save response:", err)
        setSubmitState("error")
      })
  }, [])

  const completeQuiz = useCallback(() => {
    const res = scoreQuiz(answers)
    setResult(res)
    runSubmit(answers, freeForm, res)
  }, [answers, freeForm, runSubmit])

  const retrySubmit = useCallback(() => {
    if (result) runSubmit(answers, freeForm, result)
  }, [answers, freeForm, result, runSubmit])

  const resetQuiz = useCallback(() => {
    setAnswers({})
    setFreeFormState(EMPTY_FREEFORM)
    setResult(null)
    setSubmitState("idle")
    sessionStorage.removeItem(STORAGE_KEY)
  }, [])

  const value: QuizContextValue = {
    answers,
    freeForm,
    result,
    submitState,
    setAnswer,
    setFreeForm,
    completeQuiz,
    retrySubmit,
    resetQuiz,
  }

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>
}

export function useQuiz(): QuizContextValue {
  const ctx = useContext(QuizContext)
  if (!ctx) throw new Error("useQuiz must be used within a QuizProvider")
  return ctx
}
