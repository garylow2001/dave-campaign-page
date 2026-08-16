import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AnimatePresence, motion } from "motion/react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useQuiz } from "@/context/quiz"
import { ResultAnalyzer } from "@/components/motion/ResultAnalyzer"
import { HoverLift } from "@/components/motion/HoverLift"
import { fadeUp, staggerContainer } from "@/components/motion/variants"
import {
  STYLE_COPY,
  MIXED_NOTE,
  DISCLAIMER,
  SECONDARY_LABEL,
  INCENTIVE_BANNER,
} from "@/lib/copy"

const CALENDLY_URL = import.meta.env.VITE_CALENDLY_URL ?? ""
const SHOW_INCENTIVE = import.meta.env.VITE_SHOW_INCENTIVE === "true"

function ScoreRow({ label, value }: { label: string; value: number }) {
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

export default function Result() {
  const { result, submitState, retrySubmit, resetQuiz, justCompleted, markResultSeen } = useQuiz()
  const navigate = useNavigate()

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

  const style = STYLE_COPY[result.primary]
  const showSecondary = result.secondary !== null && (result.mixed || result.confidence < 2)

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
              className="flex flex-col gap-6"
            >
              <motion.div variants={fadeUp} className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">Thanks for taking the survey</h1>
                <p className="text-muted-foreground">
                  Here's how your attachment style shows up in your relationship with money.
                </p>
              </motion.div>

              <motion.div variants={fadeUp}>
                <Card>
                  <CardHeader className="pb-2">
                    <Badge className="w-fit text-sm">{result.primary}</Badge>
                    <CardTitle className="text-2xl">{style.heading}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <motion.div
                      variants={staggerContainer(0.06)}
                      initial="hidden"
                      animate="show"
                      className="space-y-4"
                    >
                      <motion.p variants={fadeUp} className="text-muted-foreground">
                        {style.blurb}
                      </motion.p>
                      <motion.div variants={fadeUp}>
                        <Separator />
                      </motion.div>
                      <motion.div variants={fadeUp} className="space-y-3">
                        <ScoreRow label="Attachment anxiety" value={result.anxiety} />
                        <ScoreRow label="Attachment avoidance" value={result.avoidance} />
                      </motion.div>
                      {result.mixed && (
                        <motion.p
                          variants={fadeUp}
                          className="rounded-lg bg-muted p-3 text-sm text-muted-foreground"
                        >
                          {MIXED_NOTE}
                        </motion.p>
                      )}
                      {showSecondary && result.secondary && (
                        <motion.p variants={fadeUp} className="text-sm text-muted-foreground">
                          {SECONDARY_LABEL}: {result.secondary}
                        </motion.p>
                      )}
                      <motion.p variants={fadeUp} className="text-xs text-muted-foreground">
                        {DISCLAIMER}
                      </motion.p>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>

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

              <motion.div variants={fadeUp}>
                <Card>
                  <CardContent className="space-y-4 p-6">
                    <div>
                      <h2 className="text-xl font-semibold">Want a detailed report?</h2>
                      <p className="mt-1 text-muted-foreground">
                        Schedule a time to meet and we'll go through your full report together.
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
                        title="Schedule a meeting"
                      />
                    ) : (
                      <p className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
                        [Calendly embed will appear here — set{" "}
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
