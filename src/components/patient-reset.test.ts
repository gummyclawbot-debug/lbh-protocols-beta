import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const readSource = (path: string) => readFileSync(join(process.cwd(), path), "utf8");

describe("global Clear All", () => {
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
});
