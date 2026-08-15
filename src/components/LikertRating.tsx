import { cn } from "@/lib/utils"
import { LIKERT_LABELS, LIKERT_MIN, LIKERT_MAX } from "@/lib/questions"

interface LikertRatingProps {
  value: number | undefined
  onChange: (value: number) => void
}

/** Row of 1–7 selectable buttons with anchor labels at each end. */
export function LikertRating({ value, onChange }: LikertRatingProps) {
  const options = Array.from({ length: LIKERT_MAX - LIKERT_MIN + 1 }, (_, i) => LIKERT_MIN + i)

  return (
    <div>
      <div className="flex gap-1.5" role="radiogroup" aria-label="Choose a rating from 1 to 7">
        {options.map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} — ${LIKERT_LABELS[n]}`}
            onClick={() => onChange(n)}
            className={cn(
              "h-12 flex-1 rounded-lg border text-base font-semibold transition-all",
              "focus-visible:outline-2 focus-visible:outline-ring",
              value === n
                ? "scale-105 border-primary bg-primary text-primary-foreground shadow-md"
                : "border-border bg-card text-foreground hover:border-ring",
            )}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>1 · {LIKERT_LABELS[LIKERT_MIN]}</span>
        <span>{LIKERT_LABELS[LIKERT_MAX]} · 7</span>
      </div>
    </div>
  )
}
