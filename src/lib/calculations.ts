import type { PatientDerived, PatientProfile, Sex } from "@/types/patient";

export const DEFAULT_PATIENT: PatientProfile = {
  sex: "M",
  age: null,
  heightCm: null,
  weightKg: null,
  scr: null,
};

export type PatientNumericParameter = "age" | "heightCm" | "weightKg" | "scr";

export const PATIENT_PARAMETER_RANGES = {
  age: { min: 18, max: 120, message: "Enter an age from 18 to 120 years." },
  heightCm: { min: 120, max: 220, message: "Enter a height from 120 to 220 cm." },
  weightKg: { min: 30, max: 300, message: "Enter a weight from 30 to 300 kg." },
  scr: { min: 0.3, max: 15, message: "Enter an SCr from 0.3 to 15 mg/dL." },
} as const satisfies Record<PatientNumericParameter, { min: number; max: number; message: string }>;

export function patientParameterError(
  parameter: PatientNumericParameter,
  value: number | null,
): string | null {
  if (value == null) return null;
  const range = PATIENT_PARAMETER_RANGES[parameter];
  return Number.isFinite(value) && value >= range.min && value <= range.max
    ? null
    : range.message;
}

function unavailablePatientDerived(): PatientDerived {
  return {
    bmi: Number.NaN,
    ibwKg: Number.NaN,
    adjBwKg: Number.NaN,
    dosingWtKg: Number.NaN,
    crclAbw: Number.NaN,
    crclIbw: Number.NaN,
    heightIn: Number.NaN,
  };
}

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
  if (
    p.age == null ||
    p.heightCm == null ||
    p.weightKg == null ||
    p.scr == null
  ) {
    return unavailablePatientDerived();
  }
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
  return s.replace(/\.0+$/, "").replace(/(\.[0-9]*?)0+$/, "$1");
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
