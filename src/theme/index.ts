import { light, dark, type ColorScheme } from "./colors"

export type ThemeMode = "light" | "dark"

const THEME_KEY = "dave-theme"

/** `primaryForeground` → `--primary-foreground`. */
function kebab(key: string): string {
  return key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)
}

/**
 * Paint the active palette onto `<html>` as inline CSS custom properties.
 * Every Tailwind utility in the `@theme inline` block resolves `var(--…)`
 * at use-time, so this one call re-skins the whole app.
 *
 * Inline styles always beat stylesheet rules; the `.dark` class we toggle is
 * only a selector hook for `dark:` utilities, not a second source of values.
 */
export function applyTheme(mode: ThemeMode): void {
  const scheme: ColorScheme = mode === "dark" ? dark : light
  const root = document.documentElement
  root.classList.toggle("dark", mode === "dark")
  for (const [key, value] of Object.entries(scheme)) {
    root.style.setProperty(`--${kebab(key)}`, value)
  }
}

/**
 * Boot theme: a stored override wins; otherwise light (the palette is
 * designed light-first — an IG user on a dark phone should see the same
 * page as the ad creative, not a surprise dark render).
 */
export function getInitialTheme(): ThemeMode {
  try {
    const stored = localStorage.getItem(THEME_KEY)
    if (stored === "light" || stored === "dark") return stored
  } catch {
    // storage unavailable — fall through to light
  }
  return "light"
}
