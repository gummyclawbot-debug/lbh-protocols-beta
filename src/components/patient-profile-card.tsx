"use client";

import { usePatient } from "@/components/patient-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  formatNum,
  patientParameterError,
  type PatientNumericParameter,
} from "@/lib/calculations";
import { UserRound, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

function Stat({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="rounded-lg bg-muted/60 px-3 py-2 transition-colors hover:bg-muted">
      <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-0.5 text-sm font-semibold tabular-nums">
        {value}
        {unit ? (
          <span className="ml-1 text-xs font-normal text-muted-foreground">
            {unit}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function NumericParameterField({
  parameter,
  id,
  label,
  unit,
  value,
  onChange,
  step,
  className,
}: {
  parameter: PatientNumericParameter;
  id: string;
  label: string;
  unit: string;
  value: number | null;
  onChange: (value: number | null) => void;
  step?: number;
  className?: string;
}) {
  const error = patientParameterError(parameter, value);
  const errorId = `${id}-error`;

  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id}>{label}</Label>
      <div className="flex w-full max-w-xs">
        <Input
          id={id}
          type="number"
          step={step}
          value={value ?? ""}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className="rounded-r-none focus-visible:z-10"
          onChange={(event) => onChange(event.target.value === "" ? null : Number(event.target.value))}
        />
        <span
          data-slot="input-unit"
          aria-hidden="true"
          className={cn(
            "inline-flex h-8 shrink-0 items-center rounded-r-lg border border-l-0 bg-muted/50 px-2.5 text-xs font-medium text-muted-foreground",
            error && "border-destructive bg-destructive/10 text-destructive dark:border-destructive/50",
          )}
        >
          {unit}
        </span>
      </div>
      {error ? (
        <p id={errorId} role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function PatientProfileCard({ className }: { className?: string }) {
  const {
    patient,
    derived,
    setSex,
    setAge,
    setHeightCm,
    setWeightKg,
    setScr,
    clearAll,
  } = usePatient();

  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 border-b [.border-b]:pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <UserRound className="size-4 text-primary" />
          Patient Profile
        </CardTitle>
        <Button variant="outline" size="sm" onClick={clearAll}>
          <RotateCcw className="size-3.5" />
          Clear All
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4 pt-1">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Sex</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={patient.sex === "M" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setSex("M")}
              >
                Male
              </Button>
              <Button
                type="button"
                variant={patient.sex === "F" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setSex("F")}
              >
                Female
              </Button>
            </div>
          </div>

          <NumericParameterField
            parameter="age"
            id="age"
            label="Age"
            unit="yrs"
            value={patient.age}
            onChange={setAge}
          />

          <NumericParameterField
            parameter="heightCm"
            id="height"
            label="Height"
            unit="cm"
            value={patient.heightCm}
            onChange={setHeightCm}
          />

          <NumericParameterField
            parameter="weightKg"
            id="weight"
            label="Weight"
            unit="kg"
            value={patient.weightKg}
            onChange={setWeightKg}
          />

          <NumericParameterField
            parameter="scr"
            id="scr"
            label="SCr"
            unit="mg/dL"
            value={patient.scr}
            onChange={setScr}
            step={0.1}
            className="sm:col-span-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <Stat label="BMI" value={formatNum(derived.bmi, 1)} />
          <Stat label="IBW" value={formatNum(derived.ibwKg, 1)} unit="kg" />
          <Stat label="AdjBW" value={formatNum(derived.adjBwKg, 1)} unit="kg" />
          <Stat label="Dosing Wt" value={formatNum(derived.dosingWtKg, 1)} unit="kg" />
          <Stat label="CrCl (ABW)" value={formatNum(derived.crclAbw, 0)} unit="mL/min" />
          <Stat label="CrCl (IBW)" value={formatNum(derived.crclIbw, 0)} unit="mL/min" />
        </div>
      </CardContent>
    </Card>
  );
}
