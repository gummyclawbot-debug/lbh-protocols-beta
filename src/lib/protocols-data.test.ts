import { describe, expect, it } from "vitest";
import {
  CRRT_DRUGS,
  DO_NOT_CRUSH_PROTOCOL,
  FORMULARY_RESTRICTIONS_PROTOCOL,
  HE_PROTOCOL,
  HIV_FORMULARY,
  INSULIN_SWITCH,
  IV_ENTERAL_PROTOCOL,
  NAV,
  RENAL_DOSING,
  THERAPEUTIC_SUBSTITUTION_PROTOCOL,
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
  it("keeps all navigation destinations unique and populated", () => {
    expect(NAV).toHaveLength(15);
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
      "iv-medication",
      "restrictions",
      "insulin-switch",
      "he",
      "hiv",
      "dnt",
      "dnc",
      "references",
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
    expect(THERAPEUTIC_SUBSTITUTION_PROTOCOL.sections).toHaveLength(31);
    expect(THERAPEUTIC_SUBSTITUTION_PROTOCOL.sections.flatMap((section) => section.rows)).toHaveLength(296);
    expect(CRRT_DRUGS).toHaveLength(6);
    expect(IV_ENTERAL_PROTOCOL.rows).toHaveLength(17);
    expect(FORMULARY_RESTRICTIONS_PROTOCOL.sections.flatMap((section) => section.entries)).toHaveLength(109);
    expect(INSULIN_SWITCH).toHaveLength(6);
    expect(HIV_FORMULARY).toHaveLength(7);
    expect(DO_NOT_CRUSH_PROTOCOL.tables).toHaveLength(4);
    expect(DO_NOT_CRUSH_PROTOCOL.tables.flatMap((table) => table.rows)).toHaveLength(100);
  });

  it("keeps current clinical table fields non-empty", () => {
    expectNonEmptyRecords(
      THERAPEUTIC_SUBSTITUTION_PROTOCOL.sections.flatMap((section) => section.rows),
      ["ordered", "substitute"],
    );
    expectNonEmptyRecords(CRRT_DRUGS, ["name", "dose", "note"]);
    expectNonEmptyRecords(IV_ENTERAL_PROTOCOL.rows, ["medication", "iv", "enteral"]);
    expectNonEmptyRecords(
      FORMULARY_RESTRICTIONS_PROTOCOL.sections.flatMap((section) => section.entries),
      ["medication", "restriction"],
    );
    expectNonEmptyRecords(INSULIN_SWITCH, ["from", "to", "factor", "tips"]);
    expectNonEmptyRecords(HIV_FORMULARY, ["regimen", "use", "notes"]);
    expectNonEmptyRecords(
      DO_NOT_CRUSH_PROTOCOL.tables.flatMap((table) => table.rows),
      ["generic", "brand", "comments"],
    );
  });

  it("preserves high-alert and contraindication language", () => {
    expect(
      INSULIN_SWITCH.find((row) => row.from === "U-500 regular")?.factor,
    ).toContain("Do not convert casually");
    expect(
      RENAL_DOSING.find((drug) => drug.name === "Metformin")?.rows,
    ).toContainEqual({ crcl: "<30", dose: "Contraindicated" });
    expect(
      FORMULARY_RESTRICTIONS_PROTOCOL.sections
        .flatMap((section) => section.entries)
        .find((row) => row.medication === "Daptomycin")?.restriction,
    ).toContain("Refer to Restricted Antibiotic Policy");
    expect(
      DO_NOT_CRUSH_PROTOCOL.tables
        .flatMap((table) => table.rows)
        .find((row) => row.generic === "morphine")?.comments,
    ).toContain("potentially fatal dose");
  });

  it("keeps the current hepatic encephalopathy pathway populated", () => {
    expect(HE_PROTOCOL.title).toContain("Hepatic Encephalopathy");
    expect(HE_PROTOCOL.steps).toHaveLength(7);
    expect(HE_PROTOCOL.meds).toHaveLength(3);
    for (const step of HE_PROTOCOL.steps) expect(step.trim()).not.toBe("");
    expectNonEmptyRecords(HE_PROTOCOL.meds, ["name", "dose", "note"]);
  });
});
