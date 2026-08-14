import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { DEFAULT_PATIENT, derivePatient } from "../lib/calculations";

const readSource = (path: string) => readFileSync(join(process.cwd(), path), "utf8");

describe("global Clear All", () => {
  it("starts and clears with blank patient numeric parameters", () => {
    expect(DEFAULT_PATIENT).toEqual({
      sex: "M",
      age: null,
      heightCm: null,
      weightKg: null,
      scr: null,
    });
    expect(Object.values(derivePatient(DEFAULT_PATIENT)).every(Number.isNaN)).toBe(true);
  });

  it("resets the shared patient and remounts every active-view parameter owner", () => {
    const provider = readSource("src/components/patient-provider.tsx");
    const views = readSource("src/components/calculator-views.tsx");

    expect(provider).toContain("resetVersion: number");
    expect(provider).toMatch(/clearAll:\s*\(\)\s*=>\s*\{[\s\S]*setPatient\(DEFAULT_PATIENT\)[\s\S]*setResetVersion\(\(version\)\s*=>\s*version\s*\+\s*1\)/);
    expect(views).toContain("const { resetVersion } = usePatient()");
    expect(views).toContain('key={`${view}-${resetVersion}`}');
  });

  it("keeps every user-editable calculator parameter inside the remounted active view", () => {
    const views = readSource("src/components/calculator-views.tsx");
    const localParameterStates = [
      'React.useState(DOSE_ROUND_MEDS[0].id)',
      "React.useState(5)",
      'React.useState(\"\")',
      "React.useState(40)",
    ];

    for (const stateOwner of localParameterStates) {
      expect(views).toContain(stateOwner);
    }
    expect(views.indexOf('key={`${view}-${resetVersion}`}')).toBeLessThan(
      views.indexOf('{view === "home"'),
    );
  });

  it("renders units outside native number inputs and exposes range alerts", () => {
    const profile = readSource("src/components/patient-profile-card.tsx");

    expect(profile).toContain('data-slot="input-unit"');
    expect(profile).not.toContain("pointer-events-none absolute top-1/2 right-3");
    expect(profile).toContain("aria-invalid={Boolean(error)}");
    expect(profile).toContain('role="alert"');
    expect(profile).not.toContain("min={range.min}");
    expect(profile).not.toContain("max={range.max}");
    expect(profile).toContain('label="Age"');
    expect(profile).toContain('label="Height"');
    expect(profile).toContain('label="Weight"');
    expect(profile).toContain('label="SCr"');
  });
});
