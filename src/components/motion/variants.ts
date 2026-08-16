import type { Variants } from "motion/react"

/** Standard fade + rise entrance. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
}

/** Container that reveals its `fadeUp` children in sequence. */
export function staggerContainer(stagger = 0.07, delayChildren = 0): Variants {
  return {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren } },
  }
}

/** Route-level entrance (used by PageTransition). */
export const pageEnter: Variants = {
  initial: { opacity: 0, y: 10 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
}
