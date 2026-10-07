import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"
import { scoreQuiz, type QuizResult } from "@/lib/attachment"
import { scoreMoney, type MoneyProfile } from "@/lib/money"
import { submitResponse, type SubmitState } from "@/lib/submit"

const STORAGE_KEY = "dave-quiz-state"

interface PersistedState {
  answers: Record<string, number>
  result: QuizResult | null
  moneyResult: MoneyProfile | null
}

function loadState(): PersistedState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PersistedState>
      return {
        answers: parsed.answers ?? {},
        result: parsed.result ?? null,
        moneyResult: parsed.moneyResult ?? null,
      }
    }
  } catch {
    // corrupt / unavailable storage — start fresh
  }
  return { answers: {}, result: null, moneyResult: null }
}

interface QuizContextValue {
  answers: Record<string, number>
  result: QuizResult | null
  moneyResult: MoneyProfile | null
  submitState: SubmitState
  /** True only right after a fresh completion — drives the Result-page reveal. In-memory, never persisted. */
  justCompleted: boolean
  setAnswer: (id: string, value: number) => void
  /** Score the answers, stash the results, and fire the (non-blocking) save. */
  completeQuiz: () => void
  /** Consume the fresh-completion flag once the Result page has handled it. */
  markResultSeen: () => void
  retrySubmit: () => void
  resetQuiz: () => void
}

const QuizContext = createContext<QuizContextValue | null>(null)

export function QuizProvider({ children }: { children: ReactNode }) {
  const initial = loadState()
  const [answers, setAnswers] = useState<Record<string, number>>(initial.answers)
  const [result, setResult] = useState<QuizResult | null>(initial.result)
  const [moneyResult, setMoneyResult] = useState<MoneyProfile | null>(initial.moneyResult)
  const [submitState, setSubmitState] = useState<SubmitState>(initial.result ? "sent" : "idle")
  const [justCompleted, setJustCompleted] = useState(false)

  // Persist across refreshes (also survives accidental navigation away).
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, result, moneyResult }))
  }, [answers, result, moneyResult])

  const setAnswer = useCallback((id: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }, [])

  const runSubmit = useCallback(
    (
      answersArg: Record<string, number>,
      resultArg: QuizResult,
      moneyArg: MoneyProfile | null,
    ) => {
      setSubmitState("sending")
      submitResponse({
        answers: answersArg,
        result: resultArg,
        moneyResult: moneyArg,
        submittedAt: new Date().toISOString(),
      })
        .then(() => setSubmitState("sent"))
        .catch((err: unknown) => {
          console.error("Failed to save response:", err)
          setSubmitState("error")
        })
    },
    [],
  )

  const completeQuiz = useCallback(() => {
    const res = scoreQuiz(answers)
    const money = scoreMoney(answers)
    setResult(res)
    setMoneyResult(money)
    setJustCompleted(true)
    runSubmit(answers, res, money)
  }, [answers, runSubmit])

  const markResultSeen = useCallback(() => setJustCompleted(false), [])

  const retrySubmit = useCallback(() => {
    if (result) runSubmit(answers, result, moneyResult)
  }, [answers, result, moneyResult, runSubmit])

  const resetQuiz = useCallback(() => {
    setAnswers({})
    setResult(null)
    setMoneyResult(null)
    setSubmitState("idle")
    setJustCompleted(false)
    sessionStorage.removeItem(STORAGE_KEY)
  }, [])

  const value: QuizContextValue = {
    answers,
    result,
    moneyResult,
    submitState,
    justCompleted,
    setAnswer,
    completeQuiz,
    markResultSeen,
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
