import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const componentSource = readFileSync(new URL("./calculator-views.tsx", import.meta.url), "utf8");
const ivView = componentSource.slice(
  componentSource.indexOf("export function IvMedicationView"),
  componentSource.indexOf("function ReferencesView"),
);

describe("Pediatric IV Medication view wiring", () => {
  it("selects the protocol, units, lookup population, source, and metadata from the active toggle", () => {
    expect(ivView).toContain('const protocol = population === "pediatric" ? IV_MEDICATION_PEDIATRIC_PROTOCOL : IV_MEDICATION_ADULT_PROTOCOL');
    expect(ivView).toContain('const units = population === "pediatric" ? IV_MEDICATION_PEDIATRIC_UNITS : IV_MEDICATION_UNITS');
    expect(ivView).toContain("resolveIvMedicationLookup(query, unitId, population)");
    expect(ivView).toContain("href={protocol.source.href}");
    expect(ivView).toContain("{protocol.sourceRowCount} Appendix A source rows");
    expect(ivView).toContain("Search one of {protocol.medications.length} logical medications");
    expect(ivView).toContain("{protocol.sourceAlerts.length}");
    expect(ivView).toContain("protocol.sourceAlerts.map");
  });

  it("resets stale unit and query state when switching populations", () => {
    expect(ivView).toContain("function selectPopulation(nextPopulation: IvMedicationPopulation)");
    expect(ivView).toContain("setPopulation(nextPopulation)");
    expect(ivView).toContain("setUnitId(nextProtocol.defaultContext.unit)");
    expect(ivView).toContain('setQuery("")');
    expect(ivView).toContain("onClick={() => selectPopulation(option)}");
  });

  it("removes the pediatric placeholder while keeping Adult Appendix B isolated", () => {
    expect(ivView).not.toContain("Pediatric protocol coming later");
    expect(ivView).not.toContain("Awaiting separate pediatric source");
    expect(ivView).not.toContain("Pediatric rules are intentionally blank");
    expect(ivView).toContain('{population === "adult" ? (');
    expect(ivView).toContain("Adult procedural sedation reference (Appendix B)");
  });

  it("prioritizes the IV Meds protocol before the shared Patient Profile on narrow screens", () => {
    expect(componentSource).toContain('view === "iv-medication" && "order-2 lg:order-1"');
    expect(componentSource).toContain('view === "iv-medication" && "order-1 lg:order-2"');
  });
});
