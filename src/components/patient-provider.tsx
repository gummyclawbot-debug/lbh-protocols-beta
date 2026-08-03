"use client";

import * as React from "react";
import {
  DEFAULT_PATIENT,
  derivePatient,
} from "@/lib/calculations";
import type { PatientDerived, PatientProfile, Sex } from "@/types/patient";

type PatientContextValue = {
  patient: PatientProfile;
  derived: PatientDerived;
  setSex: (sex: Sex) => void;
  setAge: (age: number) => void;
  setHeightCm: (cm: number) => void;
  setWeightKg: (kg: number) => void;
  setScr: (scr: number) => void;
  clearAll: () => void;
};

const PatientContext = React.createContext<PatientContextValue | null>(null);

export function PatientProvider({ children }: { children: React.ReactNode }) {
  const [patient, setPatient] = React.useState<PatientProfile>(DEFAULT_PATIENT);
  const derived = React.useMemo(() => derivePatient(patient), [patient]);

  const value = React.useMemo<PatientContextValue>(
    () => ({
      patient,
      derived,
      setSex: (sex) => setPatient((p) => ({ ...p, sex })),
      setAge: (age) => setPatient((p) => ({ ...p, age })),
      setHeightCm: (heightCm) => setPatient((p) => ({ ...p, heightCm })),
      setWeightKg: (weightKg) => setPatient((p) => ({ ...p, weightKg })),
      setScr: (scr) => setPatient((p) => ({ ...p, scr })),
      clearAll: () => setPatient(DEFAULT_PATIENT),
    }),
    [patient, derived]
  );

  return (
    <PatientContext.Provider value={value}>{children}</PatientContext.Provider>
  );
}

export function usePatient() {
  const ctx = React.useContext(PatientContext);
  if (!ctx) throw new Error("usePatient must be used within PatientProvider");
  return ctx;
}
