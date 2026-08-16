import type { ReactNode } from "react"
import { motion } from "motion/react"
import { pageEnter } from "./variants"

/**
 * Entrance-only page wrapper — each route fades/slides in on navigation.
 * No exit animation at the router level: exit choreography is fragile under
 * StrictMode and adds latency for a funnel that just needs a quick fade-in.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div variants={pageEnter} initial="initial" animate="enter">
      {children}
    </motion.div>
  )
}
