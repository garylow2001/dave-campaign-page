import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Landing() {
  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-4 py-16">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.14),transparent_60%)]" />

      <div className="w-full max-w-2xl space-y-8 text-center">
        <span className="inline-flex items-center rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          Free · 2-minute quiz
        </span>

        <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
          Find out how your{" "}
          <span className="bg-gradient-to-r from-indigo-500 to-sky-500 bg-clip-text text-transparent">
            attachment style
          </span>{" "}
          affects your relationship with money
        </h1>

        <p className="mx-auto max-w-xl text-lg text-muted-foreground">
          A short quiz that reveals how you hold closeness and trust — and what that means for how you
          earn, save, and spend.
        </p>

        <div>
          <Link to="/quiz">
            <Button size="lg" className="gap-2 text-base">
              Start the quiz <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>

        <Card className="mt-10 text-left">
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
      </div>
    </main>
  )
}
