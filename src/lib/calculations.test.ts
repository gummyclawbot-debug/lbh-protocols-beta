import { describe, expect, it } from "vitest";
import {
  adjustedBodyWeight,
  applyDoseRounding,
  bodyMassIndex,
  cockcroftGault,
  cmToInches,
  derivePatient,
  DOSE_ROUND_MEDS,
  formatNum,
  idealBodyWeight,
  roundTo,
  type DoseRoundRule,
} from "./calculations";

describe("calculation characterization", () => {
  it("converts centimeters to inches", () => {
    expect(cmToInches(177.8)).toBeCloseTo(70, 10);
  });

  it("uses the current Devine male and female IBW constants", () => {
    expect(idealBodyWeight("M", 70)).toBeCloseTo(73, 10);
    expect(idealBodyWeight("F", 70)).toBeCloseTo(68.5, 10);
    expect(idealBodyWeight("M", 58)).toBe(50);
  });

  it("calculates BMI and returns zero for a non-positive height", () => {
    expect(bodyMassIndex(85, 175)).toBeCloseTo(27.7551, 4);
    expect(bodyMassIndex(85, 0)).toBe(0);
  });

  it("switches to adjusted body weight only above 120 percent of IBW", () => {
    expect(adjustedBodyWeight(120, 100)).toBe(120);
    expect(adjustedBodyWeight(121, 100)).toBeCloseTo(108.4, 10);
    expect(adjustedBodyWeight(80, 0)).toBe(80);
  });

  it("characterizes Cockcroft-Gault sex factor and invalid inputs", () => {
    const male = cockcroftGault(65, 85, 1.2, "M");
    const female = cockcroftGault(65, 85, 1.2, "F");
    expect(male).toBeCloseTo(73.7847, 4);
    expect(female).toBeCloseTo(male * 0.85, 10);
    expect(cockcroftGault(65, 85, 0, "M")).toBe(0);
    expect(cockcroftGault(0, 85, 1.2, "M")).toBe(0);
    expect(cockcroftGault(65, 0, 1.2, "M")).toBe(0);
  });

  it("derives the current default patient consistently", () => {
    const result = derivePatient({
      sex: "M",
      age: 65,
      heightCm: 175,
      weightKg: 85,
      scr: 1.2,
    });
    expect(result.heightIn).toBeCloseTo(68.8976, 4);
    expect(result.bmi).toBeCloseTo(27.7551, 4);
    expect(result.ibwKg).toBeCloseTo(70.4646, 4);
    expect(result.adjBwKg).toBeCloseTo(76.2787, 4);
    expect(result.dosingWtKg).toBeCloseTo(76.2787, 4);
    expect(result.crclAbw).toBeCloseTo(73.7847, 4);
    expect(result.crclIbw).toBeCloseTo(61.1672, 4);
  });
});

describe("dose rounding characterization", () => {
  it("preserves midpoint and invalid-step behavior", () => {
    expect(roundTo(112.5, 25)).toBe(125);
    expect(roundTo(112, 25)).toBe(100);
    expect(roundTo(112, 0)).toBe(112);
  });

  it("applies current optional minimum and maximum caps", () => {
    const rule: DoseRoundRule = {
      id: "characterization",
      name: "Characterization",
      note: "Test-only rule",
      stepMg: 10,
      unit: "mg",
      minMg: 50,
      maxMg: 100,
    };
    expect(applyDoseRounding(21, rule)).toBe(50);
    expect(applyDoseRounding(79, rule)).toBe(80);
    expect(applyDoseRounding(126, rule)).toBe(100);
  });

  it("keeps dose-rounding rule identifiers unique and fields populated", () => {
    expect(DOSE_ROUND_MEDS).toHaveLength(16);
    expect(new Set(DOSE_ROUND_MEDS.map((rule) => rule.id)).size).toBe(
      DOSE_ROUND_MEDS.length,
    );
    for (const rule of DOSE_ROUND_MEDS) {
      expect(rule.id.trim()).not.toBe("");
      expect(rule.name.trim()).not.toBe("");
      expect(rule.note.trim()).not.toBe("");
      expect(rule.unit.trim()).not.toBe("");
      expect(rule.stepMg).toBeGreaterThan(0);
    }
  });

  it("formats current display numbers without trailing zeros", () => {
    expect(formatNum(12, 2)).toBe("12");
    expect(formatNum(12.5, 2)).toBe("12.5");
    expect(formatNum(Number.POSITIVE_INFINITY)).toBe("—");
  });
});
