import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { AnimatePresence, motion } from "motion/react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useQuiz } from "@/context/quiz"
import { ResultAnalyzer } from "@/components/motion/ResultAnalyzer"
import { fadeUp, staggerContainer } from "@/components/motion/variants"
import type { MoneyConstruct } from "@/lib/money"
import {
  STYLE_COPY,
  MIXED_NOTE,
  DISCLAIMER,
  buildProfileNarrative,
} from "@/lib/copy"
import { openCalendlyPopup } from "@/lib/calendly"

const CALENDLY_URL = import.meta.env.VITE_CALENDLY_URL ?? ""

const MONEY_BEHAVIOUR_ROWS: { construct: MoneyConstruct; label: string }[] = [
  { construct: "moneyAnxiety", label: "Money Anxiety" },
  { construct: "moneyAvoidance", label: "Money Avoidance" },
  { construct: "emotionalSpending", label: "Emotional Spending" },
  { construct: "financialConsistency", label: "Financial Consistency" },
]

function ScoreRow7({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm text-muted-foreground">{value.toFixed(1)}/7</span>
      </div>
      <Progress value={(value / 7) * 100} />
    </div>
  )
}

function ScoreRow100Tease({ label, band }: { label: string; band: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-sm font-medium">{label}</span>
      <Badge variant="outline" className="shrink-0">
        {band}
      </Badge>
    </div>
  )
}

export default function Result() {
  const { result, moneyResult, submitState, retrySubmit, justCompleted, markResultSeen } =
    useQuiz()

  // Play the analyzer exactly once per fresh completion. Capture the flag on
  // first render so React 19 StrictMode's simulated remount can't replay it,
  // and don't persist it — a reload on /result should show content directly.
  const showAnalyzer = useRef(justCompleted).current
  const [phase, setPhase] = useState<"analyzing" | "reveal">(showAnalyzer ? "analyzing" : "reveal")

  // Consume the flag so a later back/forward to /result skips the replay.
  useEffect(() => {
    if (showAnalyzer) markResultSeen()
  }, [showAnalyzer, markResultSeen])

  // 2s analyzing phase, then reveal.
  useEffect(() => {
    if (phase !== "analyzing") return
    const t = window.setTimeout(() => setPhase("reveal"), 2000)
    return () => window.clearTimeout(t)
  }, [phase])

  if (!result) {
    return (
      <main className="flex min-h-svh items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="space-y-4 p-6 text-center">
            <p className="text-muted-foreground">No results found yet.</p>
            <Link to="/quiz">
              <Button>Take the quiz</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    )
  }

  const narrative = moneyResult ? buildProfileNarrative(result.primary, moneyResult) : null
  // Stored sessions from before the money layers existed have no moneyResult.
  const legacyStyle = STYLE_COPY[result.primary]

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-2xl flex-col gap-6 px-4 py-8 sm:py-10">
      <AnimatePresence mode="wait" initial={false}>
        {phase === "analyzing" ? (
          <motion.div key="analyzer" exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}>
            <ResultAnalyzer />
          </motion.div>
        ) : (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <motion.div
              variants={staggerContainer(0.08)}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-8"
            >
              <motion.div variants={fadeUp} className="flex flex-col items-center gap-4 text-center">
                <img
                  src={`${import.meta.env.BASE_URL}brand.jpg`}
                  alt=""
                  aria-hidden="true"
                  className="size-16 rounded-2xl object-cover sm:size-20"
                />
                <div className="space-y-2">
                  <p className="text-xs font-semibold tracking-widest text-primary uppercase">
                    Your AttachedToMoney profile
                  </p>
                  <h1 className="text-2xl font-bold text-balance sm:text-3xl">
                    What your answers suggest
                  </h1>
                </div>
              </motion.div>

              {/* One flowing read: attachment, money meaning, how it shows up. */}
              {narrative ? (
                <motion.div variants={fadeUp} className="space-y-4">
                  <p className="text-lg leading-relaxed">{narrative[0]}</p>
                  <div className="rounded-2xl bg-muted/60 p-5 sm:p-6">
                    <p className="leading-relaxed text-muted-foreground">{narrative[1]}</p>
                  </div>
                  {result.mixed && (
                    <p className="text-sm text-muted-foreground">{MIXED_NOTE}</p>
                  )}
                  <p className="text-xs text-muted-foreground">{DISCLAIMER}</p>
                </motion.div>
              ) : (
                <motion.div variants={fadeUp} className="space-y-4 leading-relaxed">
                  <p className="text-lg">{legacyStyle.heading}.</p>
                  <p className="text-muted-foreground">{legacyStyle.blurb}</p>
                </motion.div>
              )}

              {/* Score teaser — the shape is visible, the numbers stay locked. */}
              {moneyResult && (
                <motion.div variants={fadeUp}>
                  <Card>
                    <CardContent className="space-y-5 p-5 sm:p-6">
                      <div className="space-y-3">
                        <ScoreRow7 label="Attachment anxiety" value={result.anxiety} />
                        <ScoreRow7 label="Attachment avoidance" value={result.avoidance} />
                        {MONEY_BEHAVIOUR_ROWS.map((row) => (
                          <ScoreRow100Tease
                            key={row.construct}
                            label={row.label}
                            band={moneyResult.bands[row.construct]}
                          />
                        ))}
                      </div>
                      <div aria-hidden="true" className="relative select-none">
                        <div className="space-y-2.5 blur-[5px]">
                          {MONEY_BEHAVIOUR_ROWS.map((row) => (
                            <Progress
                              key={row.construct}
                              value={moneyResult.scores[row.construct]}
                            />
                          ))}
                        </div>
                        <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-card via-card/70 to-transparent" />
                      </div>
                      <div className="space-y-3 text-center">
                        <p className="text-lg font-semibold">Your full breakdown is ready</p>
                        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
                          Every score, line by line — we go through it together and check
                          what actually rings true for you.
                        </p>
                        {CALENDLY_URL ? (
                          <Button
                            size="lg"
                            className="w-full sm:w-auto"
                            onClick={() => openCalendlyPopup(CALENDLY_URL)}
                          >
                            Find out more
                          </Button>
                        ) : (
                          <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                            [Booking opens here — set <code>VITE_CALENDLY_URL</code> in .env]
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {submitState === "error" && (
                <motion.div
                  variants={fadeUp}
                  className="flex flex-col gap-3 rounded-lg border border-destructive/50 p-3 text-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="size-4" /> Your results couldn't be saved to our sheet.
                  </span>
                  <Button variant="outline" size="sm" onClick={retrySubmit}>
                    <RefreshCw className="size-4" /> Retry
                  </Button>
                </motion.div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
