import type { ReactNode } from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

/**
 * Lifts on hover / presses on tap. Wraps CTA buttons because the Base UI
 * `Button` can't take motion props directly.
 */
export function HoverLift({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: "0 12px 24px -12px rgba(31, 58, 95, 0.35)" }}
      whileTap={{ y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={cn("inline-block", className)}
    >
      {children}
    </motion.div>
  )
}
