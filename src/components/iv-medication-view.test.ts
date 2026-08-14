import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { IvMedicationView } from "./calculator-views";
import { NAV } from "../lib/protocols-data";

describe("Intravenous Medication tab shell", () => {
  it("adds the governed tab to navigation and view routing", () => {
    expect(NAV).toContainEqual(
      expect.objectContaining({
        id: "iv-medication",
        label: "IV Medication",
        shortLabel: "IV Meds",
      }),
    );
    const typeSource = readFileSync(join(process.cwd(), "src/types/patient.ts"), "utf8");
    const viewSource = readFileSync(join(process.cwd(), "src/components/calculator-views.tsx"), "utf8");
    expect(typeSource).toContain('| "iv-medication"');
    expect(viewSource).toContain('view === "iv-medication" && <IvMedicationView />');
  });

  it("renders source-first population, site, unit, search, route, caveat, and source controls", () => {
    const source = readFileSync(join(process.cwd(), "src/components/calculator-views.tsx"), "utf8");
    const view = source.slice(
      source.indexOf("export function IvMedicationView("),
      source.indexOf("function ReferencesView()"),
    );
    for (const expected of [
      'population === "adult" ? "Adult" : "Pediatric"',
      "Adult",
      "Pediatric",
      "Sinai Inpatient",
      "Select unit",
      "Search generic or brand name",
      "IV Push",
      "IV Piggyback",
      "Continuous Infusion",
      "Central line",
      "Areas of Use",
      "Monitoring and Other Considerations",
      "Open approved source PDF",
      "Pediatric rules are intentionally blank",
    ]) expect(view).toContain(expected);
  });

  it("renders distinct adult and pediatric states without adult provenance in pediatric mode", () => {
    const adult = renderToStaticMarkup(createElement(IvMedicationView, { initialPopulation: "adult" }));
    expect(adult).toContain("Open approved source PDF");
    expect(adult).toContain("Reference #15967");
    expect(adult).toContain("Search generic or brand name");
    expect(adult).toContain("<fieldset");
    expect(adult).toContain("<legend");
    expect(adult).toContain("Population protocol</legend>");
    expect(adult).not.toContain('aria-label="Population protocol"');
    expect(adult).toContain('role="heading"');
    expect(adult).toContain('aria-level="2"');

    const pediatric = renderToStaticMarkup(createElement(IvMedicationView, { initialPopulation: "pediatric" }));
    expect(pediatric).toContain("Pediatric protocol coming later");
    for (const forbidden of [
      "Open approved source PDF",
      "Reference #15967",
      "Appendix A source rows",
      "Search generic or brand name",
      "approved April 2026 source",
      "selected Sinai inpatient unit",
    ]) expect(pediatric).not.toContain(forbidden);
  });

  it("keeps populated route abbreviations at full foreground opacity for WCAG contrast", () => {
    const source = readFileSync(join(process.cwd(), "src/components/calculator-views.tsx"), "utf8");
    expect(source).not.toMatch(/text-xs font-semibold uppercase tracking-wide opacity-/);
  });

  it("uses the approved visible app name in References copy", () => {
    const source = readFileSync(join(process.cwd(), "src/components/calculator-views.tsx"), "utf8");
    const references = source.slice(source.indexOf("function ReferencesView()"), source.indexOf("function DncView()"));
    expect(references).toContain("used by LBH protocol");
    expect(references).not.toContain("LBH Protocols Beta");
  });
});
