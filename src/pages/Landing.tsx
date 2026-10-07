import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
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
        <motion.div variants={fadeUp} className="mx-auto w-44 sm:w-52">
          <img
            src={`${import.meta.env.BASE_URL}brand.jpg`}
            alt="AttachedToMoney"
            className="aspect-square w-full rounded-3xl object-cover"
          />
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="text-4xl font-bold tracking-tight text-balance sm:text-5xl"
        >
          How are you{" "}
          <span className="bg-gradient-to-r from-brand-from to-brand-to bg-clip-text text-transparent">
            AttachedToMoney?
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mx-auto max-w-xl text-lg text-muted-foreground"
        >
          The way you relate to people may influence the way you relate to money too.
          Discover what drives your financial behaviour, what money represents to you,
          and the patterns that may be shaping the decisions you make.
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

        <motion.p
          variants={fadeUp}
          className="mx-auto max-w-xl text-sm text-muted-foreground"
        >
          A 5-minute assessment exploring attachment and money habits.
        </motion.p>
      </motion.div>
    </main>
  )
}
