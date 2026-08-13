export type Sex = "M" | "F";

export interface PatientProfile {
  sex: Sex;
  age: number | null;
  heightCm: number | null;
  weightKg: number | null;
  scr: number | null;
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
  | "dnc"
  | "references";
