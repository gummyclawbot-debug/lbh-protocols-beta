export type Sex = "M" | "F";

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
