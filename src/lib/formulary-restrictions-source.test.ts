import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  FORMULARY_RESTRICTIONS_PROTOCOL,
  PROTOCOL_REFERENCES,
  searchFormularyRestrictions,
} from "./protocols-data";

const sourceSha256 = "09eaebabb1e7f86af3e63da949547513471252225fb17b7bfa5a64ce602b8950";
const governingNote = "Document will be updated as soon as possible after addition of new medications to formulary or based on changes to existing restrictions. Please note that delays may occur. Refer to the CPOE order alerts when available. Restriction date = date approved by LFRC.";
const sectionsSha256 = "0f3a1a1c8623b8ec41bf7148fb23d0a0ba69f3651235ae935edf2b461f46ffd7";

const expectedCorrections = [
  ["Budensonide respules", "Budesonide respules"],
  ["with parasite density is >1%", "if parasite density is >1%"],
  ["PD-L1) inhibitory", "PD-L1) inhibitor"],
  ["Anticipated blood loos", "Anticipated blood loss"],
  ["Genitourinary urinary syndrome", "Genitourinary syndrome"],
  ["failure to morphine", "failure of morphine"],
  ["Acinetobacter baumi", "Acinetobacter baumannii"],
  ["Adults patients", "Adult patients"],
  ["achieving minimal of 4 bowel movements", "achieving a minimum of 4 bowel movements"],
  ["Adult and Pediatrics", "Adults and pediatric patients"],
  ["updated -07/2021", "updated 07/2021"],
  ["crcl < 30ml/min⁷", "CrCl < 30 mL/min"],
  ["criteria is met", "criteria are met"],
] as const;

const expectedAlerts = [
  "Cefdinir visibly lists ‘Restriction date: ?’; no date was inferred.",
  "Fosaprepitant IV (Cinvanti) may contain a source drug/brand mismatch; preserved pending institutional clarification.",
  "Olaratumab remains present in the January 2026 institutional source; preserved and flagged for institutional review.",
  "Ustekinumab’s IBD induction restriction visibly specifies the oncology outpatient infusion center; that operational scope is preserved.",
  "Epoprostenol’s heading scope lists SH, NW, and CH while its restriction text names Sinai Hospital and NWH; both source statements are preserved without reconciling the conflict.",
  "Caplacizumab provides ADAMTS13 instructions for < 10 U/dL and > 10 U/dL but not exactly 10 U/dL; no equality rule was inferred.",
  "Nirsevimab’s infant and maternal criteria do not explicitly state whether they are joined by AND or OR; the source hierarchy is preserved without inference.",
  "Ravulizumab’s ordering and outpatient-maintenance instruction is visually nested under the aHUS criterion, leaving its applicability to PNH ambiguous; the source hierarchy is preserved.",
  "Some entries refer to CPOE alerts, the Restricted Antibiotic Policy, COVID-19 algorithm, or other intranet criteria not reproduced in this PDF.",
] as const;

function allEntries() {
  return FORMULARY_RESTRICTIONS_PROTOCOL.sections.flatMap((section) => section.entries);
}

function entry(name: string) {
  return allEntries().find((item) => item.medication === name);
}

function protocolText() {
  return JSON.stringify(FORMULARY_RESTRICTIONS_PROTOCOL).replace(/\\n/g, " ").replace(/\s+/g, " ");
}

describe("approved January 2026 Formulary Medications with Restrictions source", () => {
  it("pins the unchanged approved PDF bytes", () => {
    const file = readFileSync(join(process.cwd(), "public/references/lbh-formulary-medications-with-restrictions-2026-01.pdf"));
    expect(file.byteLength).toBe(389334);
    expect(createHash("sha256").update(file).digest("hex")).toBe(sourceSha256);
  });

  it("publishes complete metadata and central References linkage", () => {
    expect(FORMULARY_RESTRICTIONS_PROTOCOL.source).toEqual({
      id: "formulary-restrictions-2026-01",
      title: "LifeBridge Health: Formulary Medications with Restrictions",
      updated: "January 2026",
      pageCount: 19,
      href: "/references/lbh-formulary-medications-with-restrictions-2026-01.pdf",
      sha256: sourceSha256,
      authority: "LBH institutional protocol; medical-board and P&T reviewed/approved",
      affectedViews: ["restrictions"],
    });
    expect(PROTOCOL_REFERENCES).toContainEqual(FORMULARY_RESTRICTIONS_PROTOCOL.source);
  });

  it("preserves all alphabetic sections and 109 complete medication entries", () => {
    expect(FORMULARY_RESTRICTIONS_PROTOCOL.sections.map((section) => section.letter)).toEqual([
      "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U-Z",
    ]);
    expect(FORMULARY_RESTRICTIONS_PROTOCOL.sections.map((section) => section.entries.length)).toEqual([
      10, 4, 15, 6, 7, 8, 1, 1, 3, 0, 0, 4, 11, 4, 3, 6, 0, 7, 5, 9, 5,
    ]);
    expect(allEntries()).toHaveLength(109);
    expect(createHash("sha256").update(JSON.stringify(FORMULARY_RESTRICTIONS_PROTOCOL.sections)).digest("hex")).toBe(sectionsSha256);
    for (const item of allEntries()) {
      expect(item.medication.trim()).not.toBe("");
      expect(item.restriction.trim()).not.toBe("");
      expect(item.page).toBeGreaterThanOrEqual(2);
      expect(item.page).toBeLessThanOrEqual(19);
    }
  });

  it("joins every page-spanning entry without dropping continuation criteria", () => {
    expect(entry("Budesonide respules")?.pageEnd).toBe(4);
    expect(entry("Budesonide respules")?.restriction).toContain("continuous BiPAP");
    expect(entry("Cangrelor")?.pageEnd).toBe(5);
    expect(entry("Cangrelor")?.restriction).toContain("Flow diverters: pipeline embolization device");
    expect(entry("Denosumab")?.pageEnd).toBe(7);
    expect(entry("Denosumab")?.restriction).toContain("NOT in hypercalcemia power plan");
    expect(entry("Epoetin")?.pageEnd).toBe(8);
    expect(entry("Epoetin")?.restriction).toContain("Hgb 8.5-9.5 g/dL (day 3 and beyond ONLY)");
    expect(entry("Fentanyl patch")?.pageEnd).toBe(9);
    expect(entry("Fentanyl patch")?.restriction).toContain("ONE WEEK OR LONGER");
    expect(entry("Hydromorphone IV")?.pageEnd).toBe(10);
    expect(entry("Hydromorphone IV")?.restriction).toContain("Patient with CrCl <30 ml/min");
    expect(entry("Levothyroxine IV")?.pageEnd).toBe(11);
    expect(entry("Levothyroxine IV")?.restriction).toContain("Not received oral levothyroxine dose for ≥5 days");
    expect(entry("Mepolizumab")?.pageEnd).toBe(12);
    expect(entry("Mepolizumab")?.restriction).toContain("outpatient clinic setting only");
    expect(entry("Rituximab-abbs (Truxima biosimilar)")?.pageEnd).toBe(16);
  });

  it("pins the complete governing note", () => {
    expect(FORMULARY_RESTRICTIONS_PROTOCOL.governingNote).toBe(governingNote);
  });

  it("retains source-critical restrictions, thresholds, policy referrals, and unresolved scope", () => {
    const text = protocolText();
    for (const expected of [
      "MAXIMUM of 7 doses",
      "ADAMTS13 level < 10 U/dL",
      "Not for empiric use",
      "ONE WEEK OR LONGER",
      "pain score ≥ 7/10",
      "Refer to Restricted Antibiotic Policy",
      "Avoid in patients with CrCl < 30 mL/min",
      "oncology outpatient infusion center",
      "Olaratumab",
      "Restriction date: ?",
    ]) expect(text).toContain(expected);
  });

  it("records only approved editorial corrections while flagging substantive ambiguities", () => {
    const corrections = FORMULARY_RESTRICTIONS_PROTOCOL.approvedCorrections;
    expect(corrections.map(({ sourceText, renderedText }) => [sourceText, renderedText])).toEqual(expectedCorrections);
    expect(FORMULARY_RESTRICTIONS_PROTOCOL.sourceAlerts).toEqual(expectedAlerts);

    const renderedEntries = allEntries()
      .map((item) => [item.medication, item.scope, item.restriction].join(" "))
      .join(" ")
      .replace(/\s+/g, " ");
    for (const correction of corrections) {
      expect(renderedEntries).toContain(correction.renderedText);
      expect(renderedEntries).not.toContain(correction.sourceText);
      expect(correction.approver).toBe("Jarvis");
      expect(correction.approvedOn).toBe("2026-08-12");
    }
  });

  it("searches medication, scope, dates, restrictions, and alerts without fabricating row matches", () => {
    expect(searchFormularyRestrictions("MRSA")).toEqual([]);
    expect(searchFormularyRestrictions("CrCl 30").flatMap((section) => section.entries).map((item) => item.medication)).toContain("Sugammadex");
    expect(searchFormularyRestrictions("pediatric only").flatMap((section) => section.entries).map((item) => item.medication)).toContain("Cefdinir");
    expect(searchFormularyRestrictions("definitely-not-a-source-term")).toEqual([]);
  });
});
