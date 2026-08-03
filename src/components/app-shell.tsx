"use client";

import * as React from "react";
import { Header } from "@/components/header";
import { CalculatorViews } from "@/components/calculator-views";
import { PatientProvider } from "@/components/patient-provider";
import type { ViewId } from "@/types/patient";

export function AppShell() {
  const [view, setView] = React.useState<ViewId>("home");

  return (
    <PatientProvider>
      <div className="flex min-h-dvh flex-col bg-background">
        <Header view={view} onNavigate={setView} />
        <main className="flex-1">
          <CalculatorViews view={view} onNavigate={setView} />
        </main>
        <footer className="border-t bg-muted/30">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-4 text-center text-xs text-muted-foreground">
            <p>
              <strong className="text-foreground">
                LBH Protocols Beta
              </strong>{" "}
              · MedCalc Streamline clinical tools
            </p>
            <p>
              For educational / institutional reference only. Follow LBH policy.
              Verify all doses. Consult the prescriber when needed.
            </p>
          </div>
        </footer>
      </div>
    </PatientProvider>
  );
}
