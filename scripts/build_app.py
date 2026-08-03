#!/usr/bin/env python3
"""One-shot generator for LBH Protocols Beta app source files."""
from pathlib import Path

base = Path(__file__).resolve().parents[1] / "src"


def w(rel: str, content: str) -> None:
    path = base / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content)
    print(f"wrote {path.relative_to(base.parent)}")


w(
    "app/globals.css",
    r"""@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

:root {
  --radius: 0.75rem;
  --background: oklch(0.99 0.005 220);
  --foreground: oklch(0.2 0.03 240);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.2 0.03 240);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.2 0.03 240);
  --primary: oklch(0.55 0.12 220);
  --primary-foreground: oklch(0.99 0 0);
  --secondary: oklch(0.55 0.12 160);
  --secondary-foreground: oklch(0.99 0 0);
  --muted: oklch(0.96 0.01 220);
  --muted-foreground: oklch(0.5 0.03 240);
  --accent: oklch(0.94 0.03 200);
  --accent-foreground: oklch(0.3 0.05 220);
  --destructive: oklch(0.55 0.2 25);
  --border: oklch(0.9 0.015 220);
  --input: oklch(0.9 0.015 220);
  --ring: oklch(0.55 0.12 220);
}

.dark {
  --background: oklch(0.16 0.025 240);
  --foreground: oklch(0.96 0.01 220);
  --card: oklch(0.22 0.03 240);
  --card-foreground: oklch(0.96 0.01 220);
  --popover: oklch(0.22 0.03 240);
  --popover-foreground: oklch(0.96 0.01 220);
  --primary: oklch(0.75 0.12 200);
  --primary-foreground: oklch(0.18 0.03 240);
  --secondary: oklch(0.7 0.12 160);
  --secondary-foreground: oklch(0.18 0.03 240);
  --muted: oklch(0.28 0.03 240);
  --muted-foreground: oklch(0.7 0.02 220);
  --accent: oklch(0.3 0.04 220);
  --accent-foreground: oklch(0.95 0.01 200);
  --destructive: oklch(0.65 0.18 25);
  --border: oklch(0.32 0.03 240);
  --input: oklch(0.32 0.03 240);
  --ring: oklch(0.75 0.12 200);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground font-sans antialiased;
  }
}
""",
)

w(
    "types/patient.ts",
    """export type Sex = "M" | "F";

export interface PatientProfile {
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  scr: number;
}

export interface PatientDerived {
  bmi: number;
  ibwKg: number;
  adjBwKg: number;
  dosingWtKg: number;
  crclAbw: number;
  crclIbw: number;
  heightIn: number;
}

export type ViewId =
  | "home"
  | "crcl-bmi"
  | "dose-rounding"
  | "renal-dosing"
  | "therapeutic-sub"
  | "crrt-dosing"
  | "iv-po"
  | "restrictions"
  | "insulin-switch"
  | "he"
  | "hiv"
  | "dnt"
  | "dnc";
""",
)

w(
    "lib/calculations.ts",
    """import type { PatientDerived, PatientProfile, Sex } from "@/types/patient";

export const DEFAULT_PATIENT: PatientProfile = {
  sex: "M",
  age: 65,
  heightCm: 175,
  weightKg: 85,
  scr: 1.2,
};

export function cmToInches(cm: number): number {
  return cm / 2.54;
}

/** Devine IBW (kg). Height in inches. */
export function idealBodyWeight(sex: Sex, heightIn: number): number {
  const base = sex === "M" ? 50 : 45.5;
  return base + 2.3 * Math.max(0, heightIn - 60);
}

export function bodyMassIndex(weightKg: number, heightCm: number): number {
  const m = heightCm / 100;
  if (m <= 0) return 0;
  return weightKg / (m * m);
}

/** Adjusted BW when ABW > 120% IBW: IBW + 0.4*(ABW-IBW) */
export function adjustedBodyWeight(abw: number, ibw: number): number {
  if (ibw <= 0) return abw;
  if (abw > ibw * 1.2) return ibw + 0.4 * (abw - ibw);
  return abw;
}

/** Cockcroft-Gault CrCl (mL/min) */
export function cockcroftGault(
  age: number,
  weightKg: number,
  scr: number,
  sex: Sex
): number {
  if (scr <= 0 || age <= 0 || weightKg <= 0) return 0;
  const sexFactor = sex === "F" ? 0.85 : 1;
  return ((140 - age) * weightKg * sexFactor) / (72 * scr);
}

export function derivePatient(p: PatientProfile): PatientDerived {
  const heightIn = cmToInches(p.heightCm);
  const bmi = bodyMassIndex(p.weightKg, p.heightCm);
  const ibwKg = idealBodyWeight(p.sex, heightIn);
  const adjBwKg = adjustedBodyWeight(p.weightKg, ibwKg);
  const dosingWtKg = p.weightKg > ibwKg * 1.2 ? adjBwKg : p.weightKg;
  const crclAbw = cockcroftGault(p.age, p.weightKg, p.scr, p.sex);
  const crclIbw = cockcroftGault(p.age, ibwKg, p.scr, p.sex);
  return {
    bmi,
    ibwKg,
    adjBwKg,
    dosingWtKg,
    crclAbw,
    crclIbw,
    heightIn,
  };
}

export function roundTo(value: number, step: number): number {
  if (step <= 0) return value;
  return Math.round(value / step) * step;
}

export function formatNum(n: number, digits = 1): string {
  if (!Number.isFinite(n)) return "—";
  const s = n.toFixed(digits);
  return s.replace(/\\.0+$/, "").replace(/(\\.[0-9]*?)0+$/, "$1");
}

export type DoseRoundRule = {
  id: string;
  name: string;
  note: string;
  stepMg: number;
  unit: string;
  minMg?: number;
  maxMg?: number;
};

export const DOSE_ROUND_MEDS: DoseRoundRule[] = [
  { id: "acyclovir", name: "Acyclovir (5–10 mg/kg)", note: "Round to nearest 25 mg (or vial increment).", stepMg: 25, unit: "mg" },
  { id: "gent_tobra", name: "Gentamicin / Tobramycin (1–7 mg/kg)", note: "Round to nearest 10 mg.", stepMg: 10, unit: "mg" },
  { id: "amikacin", name: "Amikacin (10–20 mg/kg)", note: "Round to nearest 25 mg.", stepMg: 25, unit: "mg" },
  { id: "ampho", name: "Amphotericin B Liposomal (3–5 mg/kg)", note: "Round to nearest 25 mg.", stepMg: 25, unit: "mg" },
  { id: "daptomycin", name: "Daptomycin (4–12 mg/kg)", note: "Round to nearest 50 mg.", stepMg: 50, unit: "mg" },
  { id: "enoxaparin", name: "Enoxaparin (1–1.5 mg/kg)", note: "Round to nearest 10 mg syringe strength when possible.", stepMg: 10, unit: "mg" },
  { id: "heparin", name: "Heparin Drip (Bolus & Initial Rate)", note: "Bolus nearest 100 units; rate nearest 100 units/hr.", stepMg: 100, unit: "units" },
  { id: "ivig", name: "IVIG (weight-based)", note: "Round to nearest vial size (typically 2.5–5 g).", stepMg: 2500, unit: "mg" },
  { id: "kcentra", name: "Kcentra / 4-Factor PCC (50 units/kg)", note: "Round to nearest vial (≈500 units).", stepMg: 500, unit: "units" },
  { id: "rig", name: "Rabies Immune Globulin (20 IU/kg)", note: "Round to nearest 150 IU.", stepMg: 150, unit: "IU" },
  { id: "rbf", name: "Recombinant Blood Factors", note: "Round to nearest available vial strength.", stepMg: 250, unit: "units" },
  { id: "urena", name: "Ure-Na", note: "Round to whole packet increments.", stepMg: 1, unit: "packet(s)" },
  { id: "fospheny", name: "Fosphenytoin / Phenytoin", note: "Round PE dose to nearest 50 mg PE.", stepMg: 50, unit: "mg PE" },
  { id: "bactrim", name: "Bactrim (SMX/TMP)", note: "Round TMP component to nearest 40–80 mg tablet/vial increment.", stepMg: 40, unit: "mg TMP" },
  { id: "vpa", name: "Valproic Acid", note: "Round to nearest 50–100 mg.", stepMg: 50, unit: "mg" },
  { id: "vori", name: "Voriconazole", note: "Round IV dose to nearest 50 mg.", stepMg: 50, unit: "mg" },
];

export function applyDoseRounding(calcMg: number, rule: DoseRoundRule): number {
  let r = roundTo(calcMg, rule.stepMg);
  if (rule.minMg != null) r = Math.max(rule.minMg, r);
  if (rule.maxMg != null) r = Math.min(rule.maxMg, r);
  return r;
}
""",
)

print("batch1 ok")
