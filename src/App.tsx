import { Routes, Route } from "react-router-dom"
import Landing from "@/pages/Landing"
import Quiz from "@/pages/Quiz"
import Result from "@/pages/Result"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/result" element={<Result />} />
      <Route path="*" element={<Landing />} />
    </Routes>
  )
}
