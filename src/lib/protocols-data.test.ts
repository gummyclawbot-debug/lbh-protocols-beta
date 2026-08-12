import { describe, expect, it } from "vitest";
import {
  CRRT_DRUGS,
  DO_NOT_CRUSH,
  DO_NOT_TUBE,
  HE_PROTOCOL,
  HIV_FORMULARY,
  INSULIN_SWITCH,
  IV_PO,
  NAV,
  RENAL_DOSING,
  RESTRICTIONS,
  THERAPEUTIC_SUBS,
} from "./protocols-data";

function expectNonEmptyRecords(
  records: ReadonlyArray<Record<string, unknown>>,
  requiredFields: string[],
) {
  for (const record of records) {
    for (const field of requiredFields) {
      expect(String(record[field] ?? "").trim(), `${field} must be populated`).not.toBe("");
    }
  }
}

describe("protocol data characterization", () => {
  it("keeps all thirteen navigation destinations unique and populated", () => {
    expect(NAV).toHaveLength(13);
    expect(new Set(NAV.map((entry) => entry.id)).size).toBe(NAV.length);
    expect(NAV[0]?.id).toBe("home");
    expect(NAV.map((entry) => entry.id)).toEqual([
      "home",
      "crcl-bmi",
      "dose-rounding",
      "renal-dosing",
      "therapeutic-sub",
      "crrt-dosing",
      "iv-po",
      "restrictions",
      "insulin-switch",
      "he",
      "hiv",
      "dnt",
      "dnc",
    ]);
    expectNonEmptyRecords(NAV, ["id", "label", "shortLabel", "emoji", "description"]);
  });

  it("keeps renal dosing rows and notes populated", () => {
    expect(RENAL_DOSING).toHaveLength(6);
    expect(new Set(RENAL_DOSING.map((drug) => drug.name)).size).toBe(RENAL_DOSING.length);
    for (const drug of RENAL_DOSING) {
      expect(drug.name.trim()).not.toBe("");
      expect(drug.notes.trim()).not.toBe("");
      expect(drug.rows.length).toBeGreaterThan(0);
      expectNonEmptyRecords(drug.rows, ["crcl", "dose"]);
    }
  });

  it("characterizes the current static clinical table counts", () => {
    expect(THERAPEUTIC_SUBS).toHaveLength(6);
    expect(CRRT_DRUGS).toHaveLength(6);
    expect(IV_PO).toHaveLength(10);
    expect(RESTRICTIONS).toHaveLength(8);
    expect(INSULIN_SWITCH).toHaveLength(6);
    expect(HIV_FORMULARY).toHaveLength(7);
    expect(DO_NOT_TUBE).toHaveLength(14);
    expect(DO_NOT_CRUSH).toHaveLength(12);
  });

  it("keeps current clinical table fields non-empty", () => {
    expectNonEmptyRecords(THERAPEUTIC_SUBS, ["from", "to", "note"]);
    expectNonEmptyRecords(CRRT_DRUGS, ["name", "dose", "note"]);
    expectNonEmptyRecords(IV_PO, ["iv", "po", "ratio", "criteria"]);
    expectNonEmptyRecords(RESTRICTIONS, ["drug", "restriction", "alt"]);
    expectNonEmptyRecords(INSULIN_SWITCH, ["from", "to", "factor", "tips"]);
    expectNonEmptyRecords(HIV_FORMULARY, ["regimen", "use", "notes"]);
    expectNonEmptyRecords(DO_NOT_CRUSH, ["drug", "reason"]);
    for (const item of DO_NOT_TUBE) expect(item.trim()).not.toBe("");
  });

  it("preserves high-alert and contraindication language", () => {
    expect(
      INSULIN_SWITCH.find((row) => row.from === "U-500 regular")?.factor,
    ).toContain("Do not convert casually");
    expect(
      RENAL_DOSING.find((drug) => drug.name === "Metformin")?.rows,
    ).toContainEqual({ crcl: "<30", dose: "Contraindicated" });
    expect(
      RESTRICTIONS.find((row) => row.drug === "Daptomycin")?.restriction,
    ).toContain("Not for pneumonia");
    expect(
      DO_NOT_CRUSH.find((row) => row.drug === "Dabigatran")?.reason,
    ).toContain("bleeding risk");
  });

  it("keeps the current hepatic encephalopathy pathway populated", () => {
    expect(HE_PROTOCOL.title).toContain("Hepatic Encephalopathy");
    expect(HE_PROTOCOL.steps).toHaveLength(7);
    expect(HE_PROTOCOL.meds).toHaveLength(3);
    for (const step of HE_PROTOCOL.steps) expect(step.trim()).not.toBe("");
    expectNonEmptyRecords(HE_PROTOCOL.meds, ["name", "dose", "note"]);
  });
});
