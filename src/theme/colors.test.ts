import { describe, expect, it } from "vitest"
import { light, dark, type ColorScheme } from "./colors"

/** WCAG relative luminance of an `#RRGGBB` or `rgba(…)` color (alpha ignored). */
function luminance(color: string): number {
  const hex = color.match(/#([0-9a-f]{6})/i)?.[1]
  if (!hex) return 0
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

describe("theme palettes", () => {
  it("light and dark expose the same set of tokens", () => {
    expect(Object.keys(light).sort()).toEqual(Object.keys(dark).sort())
  })

  it.each([
    ["light", light],
    ["dark", dark],
  ] as const)("%s text-on-surface pairs meet WCAG AA (≥4.5)", (_mode, scheme: ColorScheme) => {
    const pairs: [string, string][] = [
      [scheme.foreground, scheme.background],
      [scheme.cardForeground, scheme.card],
      [scheme.popoverForeground, scheme.popover],
      [scheme.primaryForeground, scheme.primary],
      [scheme.secondaryForeground, scheme.secondary],
      [scheme.mutedForeground, scheme.background],
      [scheme.mutedForeground, scheme.muted],
      [scheme.accentForeground, scheme.accent],
      [scheme.sidebarForeground, scheme.sidebar],
      // brand gradient text sits directly on the page background
      [scheme.brandFrom, scheme.background],
      [scheme.brandTo, scheme.background],
    ]
    for (const [fg, bg] of pairs) {
      expect(
        contrast(fg, bg),
        `${fg} on ${bg}`,
      ).toBeGreaterThanOrEqual(4.5)
    }
  })
})
