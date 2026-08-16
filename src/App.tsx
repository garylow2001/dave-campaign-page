import { Routes, Route } from "react-router-dom"
import Landing from "@/pages/Landing"
import Quiz from "@/pages/Quiz"
import Result from "@/pages/Result"
import { PageTransition } from "@/components/motion/PageTransition"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
      <Route path="/quiz" element={<PageTransition><Quiz /></PageTransition>} />
      <Route path="/result" element={<PageTransition><Result /></PageTransition>} />
      <Route path="*" element={<PageTransition><Landing /></PageTransition>} />
    </Routes>
  )
}
