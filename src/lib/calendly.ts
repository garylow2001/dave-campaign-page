/**
 * Calendly popup widget (https://help.calendly.com/hc/en-us/articles/223147027).
 * Loads Calendly's external widget.js on first use, then opens the scheduling
 * popup. No React wrapper needed — the widget renders its own overlay.
 */

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void
    }
  }
}

const WIDGET_JS = "https://assets.calendly.com/assets/external/widget.js"
const WIDGET_CSS = "https://assets.calendly.com/assets/external/widget.css"

function ensureWidgetLoaded(onReady: () => void): void {
  if (window.Calendly) {
    onReady()
    return
  }

  if (!document.querySelector(`link[href="${WIDGET_CSS}"]`)) {
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = WIDGET_CSS
    document.head.appendChild(link)
  }

  const existing = document.querySelector(`script[src="${WIDGET_JS}"]`)
  if (existing) {
    existing.addEventListener("load", onReady, { once: true })
    return
  }

  const script = document.createElement("script")
  script.src = WIDGET_JS
  script.async = true
  script.onload = onReady
  document.body.appendChild(script)
}

/** Open the Calendly scheduling popup for the given event URL. */
export function openCalendlyPopup(url: string): void {
  ensureWidgetLoaded(() => window.Calendly?.initPopupWidget({ url }))
}
