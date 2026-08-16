import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Loader2 } from "lucide-react"

const STATUS_LINES = [
  "Scoring your attachment dimensions…",
  "Mapping anxiety vs. avoidance…",
  "Preparing your report…",
]

/**
 * The ~2s "Analyzing your answers…" UI shown before the result reveal:
 * a spinning loader, an animated progress bar, and staged status lines.
 * The parent owns the 2s timer — this just renders.
 */
export function ResultAnalyzer() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => {
      setStep((s) => Math.min(s + 1, STATUS_LINES.length - 1))
    }, 650)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
      <Loader2 className="size-10 animate-spin text-primary" aria-hidden />
      <div className="w-full max-w-xs space-y-3">
        <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
          />
        </div>
        <div className="h-5">
          <AnimatePresence mode="wait">
            <motion.p
              key={step}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="text-sm text-muted-foreground"
            >
              {STATUS_LINES[step]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
