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
  setAge: (age: number | null) => void;
  setHeightCm: (cm: number | null) => void;
  setWeightKg: (kg: number | null) => void;
  setScr: (scr: number | null) => void;
  resetVersion: number;
  clearAll: () => void;
};

const PatientContext = React.createContext<PatientContextValue | null>(null);

export function PatientProvider({ children }: { children: React.ReactNode }) {
  const [patient, setPatient] = React.useState<PatientProfile>(DEFAULT_PATIENT);
  const [resetVersion, setResetVersion] = React.useState(0);
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
      resetVersion,
      clearAll: () => {
        setPatient(DEFAULT_PATIENT);
        setResetVersion((version) => version + 1);
      },
    }),
    [patient, derived, resetVersion]
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
