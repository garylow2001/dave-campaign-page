import { cn } from "@/lib/utils"
import { motion } from "motion/react"
import { LIKERT_LABELS, LIKERT_MIN, LIKERT_MAX } from "@/lib/questions"

interface LikertRatingProps {
  value: number | undefined
  onChange: (value: number) => void
}

/**
 * Row of 1–7 selectable buttons with anchor labels at each end.
 * Motion owns `transform` (scale) here, so the CSS transition is scoped to
 * colors only — a broad `transition-all` would fight motion's per-frame writes.
 */
export function LikertRating({ value, onChange }: LikertRatingProps) {
  const options = Array.from({ length: LIKERT_MAX - LIKERT_MIN + 1 }, (_, i) => LIKERT_MIN + i)

  return (
    <div>
      <div className="flex gap-1.5" role="radiogroup" aria-label="Choose a rating from 1 to 7">
        {options.map((n) => (
          <motion.button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} — ${LIKERT_LABELS[n]}`}
            onClick={() => onChange(n)}
            animate={{ scale: value === n ? 1.06 : 1 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={cn(
              "h-12 flex-1 rounded-lg border text-base font-semibold transition-[background-color,border-color,box-shadow]",
              "focus-visible:outline-2 focus-visible:outline-ring",
              value === n
                ? "border-primary bg-primary text-primary-foreground shadow-md"
                : "border-border bg-card text-foreground hover:border-ring",
            )}
          >
            {n}
          </motion.button>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>1 · {LIKERT_LABELS[LIKERT_MIN]}</span>
        <span>{LIKERT_LABELS[LIKERT_MAX]} · 7</span>
      </div>
    </div>
  )
}
