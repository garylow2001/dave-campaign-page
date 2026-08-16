import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { HoverLift } from "@/components/motion/HoverLift"
import { fadeUp, staggerContainer } from "@/components/motion/variants"

export default function Landing() {
  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-4 py-16">
      {/* Brand glow — colors come from the theme config (brandGlow token). */}
      <div className="pointer-events-none absolute inset-0 -z-10 animate-glow bg-[radial-gradient(ellipse_at_top,var(--brand-glow),transparent_60%)]" />

      <motion.div
        className="w-full max-w-2xl space-y-8 text-center"
        variants={staggerContainer(0.09)}
        initial="hidden"
        animate="show"
      >
        <motion.span
          variants={fadeUp}
          className="inline-flex items-center rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground"
        >
          Free · 2-minute quiz
        </motion.span>

        <motion.h1
          variants={fadeUp}
          className="text-4xl font-bold tracking-tight text-balance sm:text-5xl"
        >
          Find out how your{" "}
          <span className="bg-gradient-to-r from-brand-from to-brand-to bg-clip-text text-transparent">
            attachment style
          </span>{" "}
          affects your relationship with money
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mx-auto max-w-xl text-lg text-muted-foreground"
        >
          A short quiz that reveals how you hold closeness and trust — and what that means for how you
          earn, save, and spend.
        </motion.p>

        <motion.div variants={fadeUp}>
          <HoverLift>
            <Link to="/quiz">
              <Button size="lg" className="gap-2 text-base">
                Start the quiz{" "}
                <ArrowRight className="size-4 transition-transform group-hover/button:translate-x-0.5" />
              </Button>
            </Link>
          </HoverLift>
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-10 w-full max-w-2xl text-left"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Card>
          <CardContent className="space-y-3 p-6">
            <h2 className="text-lg font-semibold">Who we are</h2>
            <p className="text-muted-foreground">
              [Who we are — Dave's intro: credentials, what you help people with, and one honest line
              about money + psychology.]
            </p>
            <p className="text-xs text-muted-foreground">
              Your quiz answers are used only to generate your report. We don't ask for contact details
              on this page — if you'd like a detailed breakdown, you can book a chat at the end.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  )
}
