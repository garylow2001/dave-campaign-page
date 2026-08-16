import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { MotionConfig } from "motion/react"
import App from "./App"
import { QuizProvider } from "@/context/quiz"
import { applyTheme, getInitialTheme } from "@/theme"
import "./index.css"

// Paint the palette before first render so there's no flash of un-themed UI.
applyTheme(getInitialTheme())

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <QuizProvider>
          <App />
        </QuizProvider>
      </BrowserRouter>
    </MotionConfig>
  </StrictMode>,
)
