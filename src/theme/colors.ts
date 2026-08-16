/**
 * Single source of truth for the whole visual theme.
 *
 * Every element in the app styles itself via semantic Tailwind tokens
 * (`bg-primary`, `text-muted-foreground`, …) which map to CSS custom
 * properties (see the `@theme inline` block in index.css). This file is
 * where those properties get their *values*. To re-skin the site, edit the
 * palettes here — nothing else needs to change.
 *
 * Keys are camelCase; `applyTheme()` converts them to `--kebab-case` CSS vars.
 */
export type ColorScheme = {
  // core semantic tokens
  background: string
  foreground: string
  card: string
  cardForeground: string
  popover: string
  popoverForeground: string
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  muted: string
  mutedForeground: string
  accent: string
  accentForeground: string
  destructive: string
  border: string
  input: string
  ring: string
  // brand — the Landing hero gradient + glow (was hardcoded indigo)
  brandFrom: string
  brandTo: string
  brandGlow: string
  // structural
  radius: string
  // completeness (unused by pages today, but part of the standard shadcn set)
  chart1: string
  chart2: string
  chart3: string
  chart4: string
  chart5: string
  sidebar: string
  sidebarForeground: string
  sidebarPrimary: string
  sidebarPrimaryForeground: string
  sidebarAccent: string
  sidebarAccentForeground: string
  sidebarBorder: string
  sidebarRing: string
}

/**
 * Navy & teal — finance-trust feel. Deep navy primary, teal accent/ring,
 * near-white background. Every text-on-surface pair keeps ≥4.5:1 contrast.
 */
export const light: ColorScheme = {
  background: "#F4F7FA",
  foreground: "#0D2233",
  card: "#FFFFFF",
  cardForeground: "#0D2233",
  popover: "#FFFFFF",
  popoverForeground: "#0D2233",
  primary: "#1F3A5F",
  primaryForeground: "#FFFFFF",
  secondary: "#E6EEF4",
  secondaryForeground: "#1F3A5F",
  muted: "#EDF2F7",
  mutedForeground: "#4E6475",
  accent: "#D9EEEC",
  accentForeground: "#0C5B57",
  destructive: "#C62828",
  border: "#D7E1EA",
  input: "#C3D1DC",
  ring: "#2AA6A6",
  brandFrom: "#1F3A5F",
  brandTo: "#0F766E",
  brandGlow: "rgba(42, 166, 166, 0.14)",
  radius: "0.625rem",
  chart1: "#DCE3EA",
  chart2: "#8E969E",
  chart3: "#707A84",
  chart4: "#5F6971",
  chart5: "#454B50",
  sidebar: "#FBFDFF",
  sidebarForeground: "#0D2233",
  sidebarPrimary: "#1F3A5F",
  sidebarPrimaryForeground: "#FFFFFF",
  sidebarAccent: "#E6EEF4",
  sidebarAccentForeground: "#0D2233",
  sidebarBorder: "#D7E1EA",
  sidebarRing: "#2AA6A6",
}

/** Dark variant — teal primary (with a dark foreground for contrast), deep navy ground. */
export const dark: ColorScheme = {
  background: "#0B1521",
  foreground: "#E9F0F6",
  card: "#12202F",
  cardForeground: "#E9F0F6",
  popover: "#12202F",
  popoverForeground: "#E9F0F6",
  primary: "#2AA6A6",
  primaryForeground: "#04272A",
  secondary: "#1B2B3C",
  secondaryForeground: "#E9F0F6",
  muted: "#182737",
  mutedForeground: "#9BB0C0",
  accent: "#1B3738",
  accentForeground: "#9FE0DB",
  destructive: "#FF7070",
  border: "#22364A",
  input: "#2A4054",
  ring: "#2AA6A6",
  brandFrom: "#A6C9E8",
  brandTo: "#4FD1C5",
  brandGlow: "rgba(42, 166, 166, 0.16)",
  radius: "0.625rem",
  chart1: "#2A3A4C",
  chart2: "#5B6E80",
  chart3: "#73879A",
  chart4: "#8CA1B4",
  chart5: "#A8BDCF",
  sidebar: "#0D1926",
  sidebarForeground: "#E9F0F6",
  sidebarPrimary: "#2AA6A6",
  sidebarPrimaryForeground: "#04272A",
  sidebarAccent: "#182737",
  sidebarAccentForeground: "#E9F0F6",
  sidebarBorder: "#22364A",
  sidebarRing: "#2AA6A6",
}
