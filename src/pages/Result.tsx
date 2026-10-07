import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AnimatePresence, motion } from "motion/react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useQuiz } from "@/context/quiz"
import { ResultAnalyzer } from "@/components/motion/ResultAnalyzer"
import { HoverLift } from "@/components/motion/HoverLift"
import { fadeUp, staggerContainer } from "@/components/motion/variants"
import type { MoneyConstruct } from "@/lib/money"
import {
  STYLE_COPY,
  MIXED_NOTE,
  DISCLAIMER,
  INCENTIVE_BANNER,
  PILOT_INVITATION,
  buildProfileNarrative,
} from "@/lib/copy"

const CALENDLY_URL = import.meta.env.VITE_CALENDLY_URL ?? ""
const SHOW_INCENTIVE = import.meta.env.VITE_SHOW_INCENTIVE === "true"

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

function ScoreRow100({
  label,
  value,
  band,
}: {
  label: string
  value: number
  band: string
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm text-muted-foreground">
          {Math.round(value)} · {band}
        </span>
      </div>
      <Progress value={value} />
    </div>
  )
}

export default function Result() {
  const { result, moneyResult, submitState, retrySubmit, resetQuiz, justCompleted, markResultSeen } =
    useQuiz()
  const navigate = useNavigate()
  const bookingRef = useRef<HTMLDivElement | null>(null)

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

  const scrollToBooking = () => {
    bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-2xl flex-col gap-6 px-4 py-10">
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
              <motion.div variants={fadeUp} className="space-y-2 text-center">
                <p className="text-xs font-semibold tracking-widest text-primary uppercase">
                  Your AttachedToMoney profile
                </p>
                <h1 className="text-3xl font-bold">What your answers suggest</h1>
              </motion.div>

              {/* One flowing read: attachment, money meaning, how it shows up. */}
              {narrative ? (
                <motion.div variants={fadeUp} className="space-y-4 leading-relaxed">
                  <p className="text-lg">{narrative[0]}</p>
                  <p className="text-muted-foreground">{narrative[1]}</p>
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

              {/* Locked score preview — the full breakdown is for the session. */}
              {moneyResult && (
                <motion.div variants={fadeUp}>
                  <Card className="relative overflow-hidden">
                    <CardContent className="p-6">
                      <div aria-hidden="true" className="space-y-3 blur-[6px] select-none">
                        <ScoreRow7 label="Attachment anxiety" value={result.anxiety} />
                        <ScoreRow7 label="Attachment avoidance" value={result.avoidance} />
                        {MONEY_BEHAVIOUR_ROWS.map((row) => (
                          <ScoreRow100
                            key={row.construct}
                            label={row.label}
                            value={moneyResult.scores[row.construct]}
                            band={moneyResult.bands[row.construct]}
                          />
                        ))}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center bg-background/60">
                        <div className="space-y-3 px-6 text-center">
                          <p className="text-lg font-semibold">Your full breakdown is ready</p>
                          <p className="mx-auto max-w-sm text-sm text-muted-foreground">
                            Every score, line by line — we go through it together and check
                            what actually rings true for you.
                          </p>
                          <Button size="lg" onClick={scrollToBooking}>
                            Find out more
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {submitState === "error" && (
                <motion.div
                  variants={fadeUp}
                  className="flex items-center justify-between gap-3 rounded-lg border border-destructive/50 p-3 text-sm"
                >
                  <span className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="size-4" /> Your results couldn't be saved to our sheet.
                  </span>
                  <Button variant="outline" size="sm" onClick={retrySubmit}>
                    <RefreshCw className="size-4" /> Retry
                  </Button>
                </motion.div>
              )}

              {/* Pilot-stage conversion: Profile Review invitation */}
              <motion.div ref={bookingRef} variants={fadeUp} className="scroll-mt-6">
                <Card>
                  <CardContent className="space-y-4 p-6">
                    <div>
                      <h2 className="text-xl font-semibold">{PILOT_INVITATION.heading}</h2>
                      <p className="mt-2 text-muted-foreground">{PILOT_INVITATION.intro}</p>
                      <p className="mt-2 text-muted-foreground">{PILOT_INVITATION.invite}</p>
                      <p className="mt-2 text-muted-foreground">{PILOT_INVITATION.noPrep}</p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {PILOT_INVITATION.secondSession}
                      </p>
                    </div>
                    {SHOW_INCENTIVE && (
                      <p className="rounded-lg bg-primary/5 p-3 text-sm font-medium text-primary">
                        {INCENTIVE_BANNER}
                      </p>
                    )}
                    {CALENDLY_URL ? (
                      <iframe
                        src={CALENDLY_URL}
                        className="h-[700px] w-full rounded-lg border"
                        frameBorder="0"
                        title="Book your Profile Review session"
                      />
                    ) : (
                      <p className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
                        [{PILOT_INVITATION.cta} — Calendly embed will appear here; set{" "}
                        <code>VITE_CALENDLY_URL</code> in .env]
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeUp} className="text-center">
                <HoverLift>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      resetQuiz()
                      navigate("/quiz")
                    }}
                  >
                    Retake the quiz
                  </Button>
                </HoverLift>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
