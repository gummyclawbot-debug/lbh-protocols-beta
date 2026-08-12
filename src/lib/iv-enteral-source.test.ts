import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  IV_ENTERAL_PROTOCOL,
  PROTOCOL_REFERENCES,
  searchIvEnteral,
} from "./protocols-data";

const sourceSha256 = "e4396eb39eb1bbcfd935bdcb35b6b4f00b68dfd9520f843bce5a7429f0ca5932";

const expectedRows = [
  ["Azithromycin", "250 – 500 mg IV Q24H", "250 – 500 mg PO Q24H"],
  ["Ciprofloxacin", "400 mg IV Q12H\n400 mg IV Q8H", "500 mg PO Q12H\n750 mg PO Q12H"],
  ["Clindamycin", "600 mg IV Q8H", "300 to 450 mg PO Q6-8H\n600 mg PO Q8H*\n(*dosing conversion for following indications: anthrax, barbesiosis, pneumonia due to MRSA, septic arthritis)"],
  ["Dexamethasone", "Total daily dose and frequency are the same (1:1 conversion)", "Total daily dose and frequency are the same (1:1 conversion)"],
  ["Doxycycline", "100 mg IV Q12H", "100 mg PO Q12H"],
  ["Famotidine", "20 mg IV Q12H\n40 mg IV Q24H", "20 mg PO Q12H\n40 mg PO Q24H"],
  ["Fluconazole", "200 – 400 mg IV Q24H", "200 – 400 mg PO Q24H"],
  ["Folic Acid", "1mg IV Q24H", "1mg PO Q24H"],
  ["Lacosamide", "Total daily dose and frequency are the same (1:1 conversion)", "Total daily dose and frequency are the same (1:1 conversion)"],
  ["Levetiracetam", "Total daily dose and frequency are the same (1:1 conversion)", "Total daily dose and frequency are the same (1:1 conversion)"],
  ["Levofloxacin", "250 – 750 mg IV, frequency", "250 – 750 mg PO, same frequency"],
  ["Levothyroxine", "IV Q24H", "PO Q24H\n*IV dose is half the enteral dose\nE.g.: 0.1 mg PO equals 0.05 mg IV"],
  ["Linezolid", "600 mg IV Q12H", "600 mg PO Q12H"],
  ["Metronidazole", "500 mg IV Q8H", "500 mg PO Q8H"],
  ["Pantoprazole\n(*Sinai/Northwest/Carroll/Levindale)", "40 mg IV Q24H", "40 mg PO Q24H\nEsomeprazole 40 mg capsule NG/G(PEG)-tube Q24H\n*Lansoprazole SoluTab 30 mg J-tube Q24H"],
  ["Thiamine", "100mg IV", "100mg PO"],
  ["Valproic Acid", "Total daily dose conversion for oral and IV is 1:1. Oral doses are generally given twice daily.^", "Total daily dose conversion for oral and IV is 1:1. Oral doses are generally given twice daily.^"],
];

describe("approved April 2024 IV to enteral institutional source", () => {
  it("pins the unchanged approved PDF bytes", () => {
    const file = readFileSync(join(process.cwd(), "public/references/lbh-iv-to-enteral-conversion-appendix-a-2024-04.pdf"));
    expect(file.byteLength).toBe(98239);
    expect(createHash("sha256").update(file).digest("hex")).toBe(sourceSha256);
  });

  it("publishes complete source metadata and scope", () => {
    expect(IV_ENTERAL_PROTOCOL.source).toEqual({
      id: "iv-to-enteral-2024-04",
      title: "Appendix A: Medications Approved for Pharmacist IV to Enteral Conversion",
      updated: "April 2, 2024",
      pageCount: 1,
      href: "/references/lbh-iv-to-enteral-conversion-appendix-a-2024-04.pdf",
      sha256: sourceSha256,
      authority: "LBH institutional protocol; medical-board and P&T reviewed/approved",
      affectedViews: ["iv-po"],
    });
    expect(PROTOCOL_REFERENCES).toContainEqual(IV_ENTERAL_PROTOCOL.source);
    expect(IV_ENTERAL_PROTOCOL.expirationDate).toBe("January 31, 2025");
    expect(IV_ENTERAL_PROTOCOL.sites).toEqual([
      "Sinai Hospital of Baltimore",
      "Northwest Hospital Center",
      "Carroll Hospital Center",
      "Levindale Hebrew Geriatric Center and Hospital",
      "Grace Medical Center",
    ]);
  });

  it("preserves all seventeen source rows in exact order with the approved folic-acid correction", () => {
    expect(IV_ENTERAL_PROTOCOL.rows.map((row) => [row.medication, row.iv, row.enteral])).toEqual(expectedRows);
    expect(IV_ENTERAL_PROTOCOL.rows).toHaveLength(17);
    expect(JSON.stringify(IV_ENTERAL_PROTOCOL.rows)).not.toContain("1mg PO 24H");
    expect(IV_ENTERAL_PROTOCOL.approvedCorrections).toEqual([
      {
        sourceText: "1mg PO 24H",
        renderedText: "1mg PO Q24H",
        approver: "Jarvis, clinical owner",
        approvedOn: "2026-08-12",
        scope: "Folic Acid enteral dose in the IV-to-enteral beta presentation only",
      },
    ]);
  });

  it("preserves route, policy, and valproic-acid governing notes", () => {
    expect(IV_ENTERAL_PROTOCOL.notes).toEqual([
      "+ medication may be given through oral or enteral tube route.",
      "* see procedure 3a and 3b in the policy for inclusion and exclusion criteria",
      "^ Valproic acid: If converting from oral to IV dosing, total IV daily dose should be divided for Q 6-8hr administration. Review home medication history and Micromedex for dosing interval consideration.",
    ]);
  });

  it("replaces unsupported placeholder rows and supports row-precise search", () => {
    const text = JSON.stringify(IV_ENTERAL_PROTOCOL);
    expect(text).not.toContain("Acetaminophen IV");
    expect(text).not.toContain("Ondansetron IV");
    expect(searchIvEnteral("MRSA").map((row) => row.medication)).toEqual(["Clindamycin"]);
    expect(searchIvEnteral("J-tube").map((row) => row.medication)).toEqual(["Pantoprazole\n(*Sinai/Northwest/Carroll/Levindale)"]);
    expect(searchIvEnteral("1mg Q24H").map((row) => row.medication)).toEqual(["Folic Acid"]);
    expect(searchIvEnteral("definitely-not-source-text")).toEqual([]);
  });
});
