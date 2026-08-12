import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  THERAPEUTIC_SUBSTITUTION_PROTOCOL,
  PROTOCOL_REFERENCES,
  searchTherapeuticSubstitutions,
} from "./protocols-data";

const sourceSha256 = "51472c2ac457a625c3cac30684157376f48978b0fa8a6b13b911c60a70156360";

function flatten(value: unknown): string {
  return JSON.stringify(value);
}

describe("approved Therapeutic Substitution institutional source", () => {
  it("pins the unchanged public source artifact", () => {
    const path = join(process.cwd(), "public/references/lbh-therapeutic-substitution-list-2026-01-inhaler-go-live.pdf");
    const file = readFileSync(path);
    expect(file.byteLength).toBe(469423);
    expect(createHash("sha256").update(file).digest("hex")).toBe(sourceSha256);
  });

  it("publishes complete source metadata and References linkage", () => {
    expect(THERAPEUTIC_SUBSTITUTION_PROTOCOL.source).toEqual({
      id: "therapeutic-substitution-2026-01",
      title: "LifeBridge Health Inpatient Pharmacy: Therapeutic Substitution List. Appendix A",
      updated: "January 2026",
      pageCount: 20,
      href: "/references/lbh-therapeutic-substitution-list-2026-01-inhaler-go-live.pdf",
      sha256: sourceSha256,
      authority: "LBH institutional protocol; medical-board and P&T reviewed/approved",
      affectedViews: ["therapeutic-sub"],
    });
    expect(PROTOCOL_REFERENCES).toContainEqual(THERAPEUTIC_SUBSTITUTION_PROTOCOL.source);
  });

  it("preserves all 31 ordered source sections", () => {
    expect(THERAPEUTIC_SUBSTITUTION_PROTOCOL.sections.map((section) => section.title)).toEqual([
      "Calcium Channel Blockers", "Angiotensin Converting Enzyme Inhibitors", "Angiotensin Receptor Blockers",
      "Statins", "Miscellaneous Hyperlipidemia agents", "Anti-epileptics", "Miscellaneous neurology agents",
      "Sleep Agents", "Selective Serotonin Reuptake Inhibitors", "Antibiotics", "Vaginal Antifungals",
      "H2 Receptor Antagonist", "Proton Pump Inhibitors", "Miscellaneous GI agents", "Insulin",
      "Oral anti-diabetic agents", "Erythropoiesis Stimulating Agents", "Colony Stimulating Factors",
      "Overactive bladder/ Bladder Dysfunction agents", "Alpha-1 Blockers", "Anti-histamines",
      "Non-Steroidal Anti-Inflammatory Drugs", "Vitamins & Supplements",
      "Inhaled short acting beta agonists and inhaled steroids", "Nasal Sprays", "Topical Steroids",
      "Otic drops", "Ophthalmic Agents", "HIV (Antiretroviral) Agents", "Other Miscellaneous Agents",
      "Substitutions Reserved for Drug Shortages",
    ]);
    expect(THERAPEUTIC_SUBSTITUTION_PROTOCOL.sections.flatMap((section) => section.rows)).toHaveLength(296);
  });

  it("models visually merged cells and topical subgroup headings correctly", () => {
    const vaginal = THERAPEUTIC_SUBSTITUTION_PROTOCOL.sections.find((section) => section.title === "Vaginal Antifungals")!;
    expect(vaginal.rows).toHaveLength(10);
    expect(new Set(vaginal.rows.map((row) => row.substitute))).toEqual(new Set([
      "Tioconazole (Monistat 1®, Vagistat 1®)\n6.5% cream x 1 dose",
    ]));
    const topical = THERAPEUTIC_SUBSTITUTION_PROTOCOL.sections.find((section) => section.title === "Topical Steroids")!;
    expect(topical.rows).toHaveLength(17);
    expect(new Set(topical.rows.map((row) => row.subgroup))).toEqual(new Set([
      "Low Potency Agents", "Medium Potency Agents", "High Potency Agents",
    ]));
  });

  it("preserves the source-blank facility only for the non-automatic U-500 conversion", () => {
    const blankFacilities = THERAPEUTIC_SUBSTITUTION_PROTOCOL.sections.flatMap((section) =>
      section.rows.filter((row) => row.facility === "").map((row) => ({ section: section.title, ordered: row.ordered })),
    );
    expect(blankFacilities).toEqual([
      { section: "Insulin", ordered: "Insulin u-500\n(Not an automatic T.sub)" },
    ]);
  });

  it("retains representative content and all high-risk qualifiers", () => {
    const content = flatten(THERAPEUTIC_SUBSTITUTION_PROTOCOL);
    const ace = THERAPEUTIC_SUBSTITUTION_PROTOCOL.sections.find((section) => section.title === "Angiotensin Converting Enzyme Inhibitors")!;
    expect(ace.notes).toEqual([
      "*MP will receive the following alert if equivalent lisinopril doses exceed 40mg during T.sub. “Lisinopril doses up to 80 mg have been used for the management of hypertension, but do not appear to provide additional benefit over 40 mg daily. Please review the home medication list to determine if the patient has established previous tolerance to higher ACE inhibitor doses.” MP can decide on continuation of high dose or lowering the dose.",
    ]);
    for (const expected of [
      "N/A – Dispense as Written", "Depakote ER tablet", "Viokase 10 will not be substituted",
      "Apidra® in insulin pump will not be substituted", "Not an automatic T.sub",
      "Do not substitute for oncology patients", "PTSD associated nightmares",
      "Budesonide/Glycopyrrolate/Formoterol Fumarate", "Trelegy Ellipta", "Simbrinza®",
      "Zubsolv", "Substitutions Reserved for Drug Shortages", "Semglee",
    ]) expect(content).toContain(expected);
  });

  it("replaces the unsupported six-row placeholder dataset", () => {
    const content = flatten(THERAPEUTIC_SUBSTITUTION_PROTOCOL);
    expect(content).not.toContain("Convert roughly 5→10");
    expect(content).not.toContain("Levetiracetam brand");
    expect(content).not.toContain("Ondansetron ODT brand");
  });

  it("searches every source section plus facilities, notes, and subgroups", () => {
    for (const section of THERAPEUTIC_SUBSTITUTION_PROTOCOL.sections) {
      const ordered = section.rows[0]!.ordered;
      expect(searchTherapeuticSubstitutions(ordered).map((result) => result.number)).toContain(section.number);
    }
    expect(searchTherapeuticSubstitutions("SH, NW, LSH").length).toBeGreaterThan(0);
    expect(searchTherapeuticSubstitutions("PTSD associated nightmares")[0]?.title).toBe("Alpha-1 Blockers");
    expect(searchTherapeuticSubstitutions("Low Potency Agents")[0]?.title).toBe("Topical Steroids");
    expect(searchTherapeuticSubstitutions("definitely-not-a-source-term")).toEqual([]);
  });

  it("distinguishes direct row matches from section-note context", () => {
    const insulin = searchTherapeuticSubstitutions("U-500");
    expect(insulin).toHaveLength(1);
    expect(insulin[0]?.rows.map((row) => row.ordered)).toEqual([
      "Insulin u-500\n(Not an automatic T.sub)",
    ]);
    expect(insulin[0]?.noteMatch).toBe(true);

    const ptsd = searchTherapeuticSubstitutions("PTSD associated nightmares");
    expect(ptsd).toHaveLength(1);
    expect(ptsd[0]?.rows).toEqual([]);
    expect(ptsd[0]?.noteMatch).toBe(true);
  });
});
