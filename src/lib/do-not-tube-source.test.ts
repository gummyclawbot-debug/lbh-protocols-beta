import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  DO_NOT_TUBE_PROTOCOL,
  PROTOCOL_REFERENCES,
} from "./protocols-data";

const sourceSha256 =
  "09cdb4b11a0d80e7ca326ed7901592750cd18632613a55d11a2b6660a7f85226";

describe("approved Do Not Tube institutional source", () => {
  it("preserves the exact approved PDF bytes", () => {
    const file = readFileSync(
      join(process.cwd(), "public/references/do-not-tube-list-2024-sinai.pdf"),
    );
    expect(createHash("sha256").update(file).digest("hex")).toBe(sourceSha256);
  });

  it("records immutable source metadata and scope", () => {
    expect(DO_NOT_TUBE_PROTOCOL.source).toMatchObject({
      id: "do-not-tube-2024-sinai",
      title: "Appendix A: Do Not Tube List",
      updated: "November 2024",
      pageCount: 1,
      href: "/references/do-not-tube-list-2024-sinai.pdf",
      sha256: sourceSha256,
      authority: "LBH institutional protocol; medical-board and P&T reviewed/approved",
      affectedViews: ["dnt"],
    });
    expect(DO_NOT_TUBE_PROTOCOL.policyReference).toBe(
      'Refer to Policy Tech “Pneumatic Tube” Policy',
    );
  });

  it("preserves the non-comprehensive-list and Pharmacy escalation qualifier", () => {
    expect(DO_NOT_TUBE_PROTOCOL.introduction).toContain(
      "several items which cannot be sent via the pneumatic tubing system",
    );
    expect(DO_NOT_TUBE_PROTOCOL.medicationQualifier).toBe(
      "Not a comprehensive list. Contact Pharmacy to determine if the medication is appropriate to send through the pneumatic tube system if unsure.",
    );
  });

  it("contains all fourteen numbered approved categories in source order", () => {
    expect(DO_NOT_TUBE_PROTOCOL.categories).toHaveLength(14);
    expect(DO_NOT_TUBE_PROTOCOL.categories.map((item) => item.number)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
    ]);
    expect(DO_NOT_TUBE_PROTOCOL.categories.map((item) => item.title)).toEqual([
      "Medications",
      "Heavy items",
      "Glass bottles and ampules",
      "Personal and non-authorized items",
      "Oversized or overweight materials",
      "Urgent or emergent blood",
      "Unused contaminated blood",
      "Spiked or transfused blood products",
      "Tissues",
      "Original medical records",
      "Contaminated or broken carriers",
      "Medication order sheets",
      "CSF / sterile fluids",
      "COVID-19 specimens",
    ]);
  });

  it("preserves every medication subgroup and named example", () => {
    const medications = DO_NOT_TUBE_PROTOCOL.categories[0];
    expect(medications.groups?.map((group) => group.title)).toEqual([
      "Protein based medications (altered by shaking)",
      "Controlled substances / narcotics",
      "High-cost medications, including but not limited to",
      "TPN",
      "Patients own/personal medications",
      "Anticoagulation reversal agents",
      "Chemicals",
    ]);

    expect(medications.groups?.[0]?.items).toEqual([
      "Albumin",
      "filgrastim (Neupogen®)",
      "IVIG",
      "insulin",
      "vaccines",
      "lipids",
      "propofol",
      "cevidipine (Cleviprex®)",
      "epoprostenol",
      'monoclonal antibodies (“-mabs”)',
      "epoetin products ex.: Retacrit, Epogen, Procrit",
      "darbepoetin",
    ]);
    expect(medications.groups?.[1]?.items).toEqual([
      "Fentanyl",
      "morphine",
      "PCA",
      "epidurals",
      "lacosamide",
      "etc.",
    ]);
    expect(medications.groups?.[2]?.items).toEqual([
      "Amphotericin",
      "daptomycin",
      "denosumab",
      "zoledronic acid",
      "paliperidone palmitate (Invega Sustenna®)",
      "aripiprazole monohydrate (Abilify Maintena®)",
      "leuprolide (Lupron®)",
      "rituximab",
      "remdesivir",
      "study drugs (investigational drugs)",
      "intrauterine devices",
      "blood factor products",
    ]);
    expect(medications.groups?.[5]?.items).toEqual([
      "Kcentra",
      "Andexxa",
      "Novoseven",
      "etc.",
    ]);
    expect(medications.groups?.[6]?.items).toEqual(["Lugols", "Dakins"]);
  });

  it("preserves exact limits, exceptions, and hand-delivery language", () => {
    const byNumber = new Map(
      DO_NOT_TUBE_PROTOCOL.categories.map((item) => [item.number, item]),
    );
    expect(byNumber.get(2)?.detail).toContain("greater than one (1) liter");
    expect(byNumber.get(3)?.detail).toContain("greater than 100 mL");
    expect(byNumber.get(5)?.detail).toContain("2.5 lbs or 1 L of fluid max capacity");
    expect(byNumber.get(6)?.detail).toContain("except Emergency Department and Operating Room");
    expect(byNumber.get(6)?.detail).toContain("discretion of the Transfusion Service");
    expect(byNumber.get(8)?.detail).toContain("returned to the Transfusion Service");
    expect(byNumber.get(12)?.detail).toContain("Exception: downtime");
    expect(byNumber.get(14)?.detail).toBe(
      "COVID-19 specimens are to be hand delivered to the laboratory.",
    );
  });

  it("publishes the source in the References registry", () => {
    expect(PROTOCOL_REFERENCES).toContainEqual(DO_NOT_TUBE_PROTOCOL.source);
  });
});
