import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  IV_MEDICATION_ADULT_PROTOCOL,
  IV_MEDICATION_UNITS,
  IV_MEDICATION_UNREVIEWED_ROUTE_SCOPES,
  IV_QUERY_ROUTE_OVERRIDES,
  IV_ROUTE_OVERRIDES,
  PROTOCOL_REFERENCES,
  resolveIvMedicationLookup,
} from "./protocols-data";

const sourceSha256 = "5ac503951edeb244cb4461721b6213a1642cb79fa1803558cb1d61c90b50e44c";

function entry(name: string) {
  return IV_MEDICATION_ADULT_PROTOCOL.medications.find((item) => item.displayName === name);
}

describe("approved April 2026 Intravenous Medication: Adult institutional source", () => {
  it("pins the unchanged public PDF bytes", () => {
    const file = readFileSync(
      join(process.cwd(), "public/references/lbh-intravenous-medication-adult-2026-04.pdf"),
    );
    expect(file.byteLength).toBe(467957);
    expect(createHash("sha256").update(file).digest("hex")).toBe(sourceSha256);
  });

  it("publishes exact identity, scope, approval metadata, and References linkage", () => {
    expect(IV_MEDICATION_ADULT_PROTOCOL.source).toEqual({
      id: "intravenous-medication-adult-2026-04",
      title: "Intravenous Medication: Adult",
      updated: "April 20, 2026",
      pageCount: 37,
      href: "/references/lbh-intravenous-medication-adult-2026-04.pdf",
      sha256: sourceSha256,
      authority: "LBH institutional protocol; medical-board and P&T reviewed/approved",
      affectedViews: ["iv-medication"],
    });
    expect(IV_MEDICATION_ADULT_PROTOCOL.referenceNumber).toBe("15967");
    expect(IV_MEDICATION_ADULT_PROTOCOL.nextReviewDate).toBe("April 30, 2029");
    expect(IV_MEDICATION_ADULT_PROTOCOL.sites).toEqual([
      "Grace Medical Center A Sinai Hospital Facility",
      "Sinai Hospital of Baltimore",
    ]);
    expect(PROTOCOL_REFERENCES).toContainEqual(IV_MEDICATION_ADULT_PROTOCOL.source);
  });

  it("preserves every Appendix A source row and all visually joined continuations", () => {
    expect(IV_MEDICATION_ADULT_PROTOCOL.sourceRowCount).toBe(230);
    expect(IV_MEDICATION_ADULT_PROTOCOL.medications).toHaveLength(229);
    expect(
      createHash("sha256")
        .update(JSON.stringify(IV_MEDICATION_ADULT_PROTOCOL.medications))
        .digest("hex"),
    ).toBe("00b9f8e1495792d53d7e885d8ac875e7c790e138465a1519055fb8d35fe82d77");
    expect(IV_MEDICATION_ADULT_PROTOCOL.continuationPages).toEqual([
      10, 11, 15, 16, 17, 19, 20, 21, 23, 25, 26, 27, 28, 31, 33, 34,
    ]);
    for (const item of IV_MEDICATION_ADULT_PROTOCOL.medications) {
      expect(item.displayName.trim()).not.toBe("");
      expect(item.page).toBeGreaterThanOrEqual(7);
      expect(item.page).toBeLessThanOrEqual(35);
      expect([item.routes.ivp, item.routes.ivpb, item.routes.ci].some(Boolean)).toBe(true);
    }
    expect(entry("Factor II,VII,IX,X (Prothrombin Complex Concentrate – PCC)")?.aliases).toContain(
      "Kcentra (4 Factor PCC)",
    );
    expect(entry("Factor II,VII,IX,X (Prothrombin Complex Concentrate – PCC)")?.pageEnd).toBe(18);
    expect(entry("Dobutamine + (Dobutrex)")?.considerations).toContain(
      "Monitor for infiltration if delivered peripherally every 8 hours.",
    );
    expect(entry("Levetiracetam +")?.pageEnd).toBe(23);
    expect(entry("Magnesium sulfate +")?.pageEnd).toBe(25);
  });

  it("models the exact page-three unit hierarchy with Sinai inpatient as default", () => {
    expect(IV_MEDICATION_ADULT_PROTOCOL.defaultContext).toEqual({
      population: "adult",
      site: "sinai-inpatient",
      unit: "general-inpatient",
    });
    expect(IV_MEDICATION_UNITS.find((unit) => unit.id === "general-inpatient")?.permissions).toEqual(["G"]);
    expect(IV_MEDICATION_UNITS.find((unit) => unit.id === "pcu")?.permissions).toEqual(["G", "M"]);
    expect(IV_MEDICATION_UNITS.find((unit) => unit.id === "icu")?.permissions).toEqual(["G", "M", "CC"]);
    expect(IV_MEDICATION_UNITS.find((unit) => unit.id === "gidc")?.permissions).toEqual(["G", "P"]);
    expect(IV_MEDICATION_UNITS.find((unit) => unit.id === "cath-lab")?.permissions).toEqual([
      "G", "M", "CC", "P",
    ]);
  });

  it("searches generic names, brands, aliases, and caveats without fabricating rows", () => {
    expect(resolveIvMedicationLookup("Adenocard", "general-inpatient").matches.map((match) => match.medication.displayName)).toEqual([
      "Adenosine + (Adenocard, Adenoscan)",
    ]);
    expect(resolveIvMedicationLookup("Kcentra", "icu").matches.map((match) => match.medication.displayName)).toEqual([
      "Factor II,VII,IX,X (Prothrombin Complex Concentrate – PCC)",
    ]);
    expect(resolveIvMedicationLookup("mechanically ventilated", "icu").matches.map((match) => match.medication.displayName)).toContain(
      "Vecuronium + (Norcuron)",
    );
    expect(resolveIvMedicationLookup("definitely-not-source-text", "icu").matches).toEqual([]);
  });

  it("resolves route permissions conservatively by unit and preserves emergency/conditional states", () => {
    const vancomycin = resolveIvMedicationLookup("Vancomycin", "general-inpatient").matches[0];
    expect(vancomycin.routes.ivpb.state).toBe("allowed");
    expect(vancomycin.routes.ivp.state).toBe("not-listed");

    const amiodaroneGeneral = resolveIvMedicationLookup("Amiodarone", "general-inpatient").matches[0];
    expect(amiodaroneGeneral.routes.ivp.state).toBe("emergency-only");
    expect(amiodaroneGeneral.routes.ivpb.state).toBe("not-permitted");
    expect(amiodaroneGeneral.routes.ci.state).toBe("not-permitted");

    const amiodaroneIcu = resolveIvMedicationLookup("Amiodarone", "icu").matches[0];
    expect(amiodaroneIcu.routes.ivpb.state).toBe("allowed");
    expect(amiodaroneIcu.routes.ci.state).toBe("allowed");

    const chlorpromazine = resolveIvMedicationLookup("Chlorpromazinee", "general-inpatient").matches[0];
    expect(chlorpromazine.routes.ivp.state).toBe("conditional");
    expect(chlorpromazine.routes.ivpb.state).toBe("conditional");
  });

  it("separates route-scoped areas and refuses to overclaim mixed-brand rows", () => {
    const mannitol = resolveIvMedicationLookup("Mannitol", "general-inpatient").matches[0];
    expect(mannitol.routes.ivp.state).toBe("emergency-only");
    expect(mannitol.routes.ivpb.state).toBe("allowed");

    const alteplase = resolveIvMedicationLookup("Alteplase", "general-inpatient").matches[0];
    expect(alteplase.routes.ivp.state).toBe("conditional");
    expect(alteplase.routes.ci.state).toBe("conditional");

    const cathflo = resolveIvMedicationLookup("Cathflo", "general-inpatient").matches[0];
    expect(cathflo.routes.ivp.state).toBe("not-listed");
    expect(cathflo.routes.ci.state).toBe("not-listed");
    const activaseGeneral = resolveIvMedicationLookup("Activase", "general-inpatient").matches[0];
    expect(activaseGeneral.routes.ivp.state).toBe("emergency-only");
    expect(activaseGeneral.routes.ci.state).toBe("not-permitted");
    const mixedProductQuery = resolveIvMedicationLookup("Alteplase+ (Activase, Cathflo)", "general-inpatient").matches[0];
    expect(mixedProductQuery.routes.ivp.state).toBe("conditional");
    expect(mixedProductQuery.routes.ci.state).toBe("conditional");

    const cosyntropinGeneral = resolveIvMedicationLookup("Cosyntropin", "general-inpatient").matches[0];
    expect(cosyntropinGeneral.routes.ivp.state).toBe("allowed");
    expect(cosyntropinGeneral.routes.ivpb.state).toBe("allowed");
    expect(cosyntropinGeneral.routes.ci.state).toBe("not-permitted");
    expect(resolveIvMedicationLookup("Cosyntropin", "or").matches[0].routes.ci.state).toBe("allowed");

    const methyleneGeneral = resolveIvMedicationLookup("Methylene Blue", "general-inpatient").matches[0];
    expect(methyleneGeneral.routes.ivp.state).toBe("allowed");
    expect(methyleneGeneral.routes.ivpb.state).toBe("not-permitted");
    expect(resolveIvMedicationLookup("Methylene Blue", "icu").matches[0].routes.ivpb.state).toBe("allowed");

    const metoprololGeneral = resolveIvMedicationLookup("Metoprolol", "general-inpatient").matches[0];
    expect(metoprololGeneral.routes.ivp.state).toBe("not-permitted");
    expect(metoprololGeneral.routes.ivpb.state).toBe("conditional");
    expect(resolveIvMedicationLookup("Metoprolol", "pcu").matches[0].routes.ivp.state).toBe("conditional");

    for (const unit of IV_MEDICATION_UNITS) {
      const propofol = resolveIvMedicationLookup("Propofol", unit.id).matches[0];
      expect(propofol.routes.ivp.state, `Propofol IVP must remain provider-conditional for ${unit.label}`).toBe("conditional");
      expect(propofol.routes.ivp.reason).toContain("provider/indication restriction");
    }
    const propofolIcu = resolveIvMedicationLookup("Propofol", "icu").matches[0];
    expect(propofolIcu.routes.ci.state).toBe("allowed");
    expect(resolveIvMedicationLookup("Propofol", "general-inpatient").matches[0].routes.ci.state).toBe("not-permitted");

    expect(resolveIvMedicationLookup("Argatroban", "general-inpatient").matches[0].routes.ci.state).toBe("allowed");
    expect(resolveIvMedicationLookup("Argatroban", "b5").matches[0].routes.ci.state).toBe("not-permitted");
    const heparinB5 = resolveIvMedicationLookup("Heparin sodium", "b5").matches[0];
    expect(heparinB5.routes.ivp.state).toBe("allowed");
    expect(heparinB5.routes.ci.state).toBe("not-permitted");
    expect(resolveIvMedicationLookup("Haloperidol", "general-inpatient").matches[0].routes.ivp.state).toBe("not-permitted");
    expect(resolveIvMedicationLookup("Haloperidol", "icu").matches[0].routes.ivp.state).toBe("allowed");
    expect(resolveIvMedicationLookup("Terlipressin", "general-inpatient").matches[0].routes.ivpb.state).toBe("not-permitted");
    expect(resolveIvMedicationLookup("Terlipressin", "6-st").matches[0].routes.ivpb.state).toBe("conditional");
  });

  it("has no unreviewed route-specific scope grammar", () => {
    expect(IV_MEDICATION_UNREVIEWED_ROUTE_SCOPES).toEqual([]);
  });

  it("pins every Appendix A continuation page to its joined medication", () => {
    const continuations = Object.fromEntries(
      IV_MEDICATION_ADULT_PROTOCOL.continuationPages.map((page) => [
        page,
        IV_MEDICATION_ADULT_PROTOCOL.medications
          .filter((medication) => medication.pageEnd === page)
          .map((medication) => medication.displayName),
      ]),
    );
    expect(continuations).toEqual({
      10: ["Azithromycin +"],
      11: ["Calcium chloride +"],
      15: ["Dobutamine + (Dobutrex)"],
      16: ["Dopamine +"],
      17: ["Epinephrine + (Adrenalin 1:10,000)"],
      19: ["Foscarnet (Foscavir)"],
      20: ["Hemin"],
      21: ["Ibutilide"],
      23: ["Levetiracetam +"],
      25: ["Magnesium sulfate +"],
      26: ["Methylene Blue"],
      27: ["Midazolam + (Versed)"],
      28: ["Neostigmine + (Prostigmin)"],
      31: ["Phenytoin+"],
      33: ["Rituximab-Monoclonal Antibody (Rituxan, Truxima)"],
      34: ["Sugammadex"],
    });
  });

  it("preserves a closed ambiguity inventory and does not assign ambiguous pediatric-adjacent Naloxone text to adults", () => {
    expect(IV_MEDICATION_ADULT_PROTOCOL.sourceAlerts).toEqual([
      "Page 9: Amphotericin B (non-liposomal) states ‘> concentration through central line’ without defining the higher concentration.",
      "Pages 10–11: Calcium chloride text spans the page break and does not cleanly delimit every CRRT, push-rate, and replacement-form clause.",
      "Page 12: Chlorpromazinee has IVPB marked while the note also discusses IV push; both routes are shown as conditional without resolving the conflict.",
      "Page 18: Kcentra (4 Factor PCC) appears as an otherwise blank alias row immediately after the Factor II,VII,IX,X PCC entry.",
      "Page 23: Levofloxacin is marked IVPB while its consideration text says ‘IV Push’; both routes are shown as conditional.",
      "Page 27: Naloxone timing wording is preserved exactly and requires institutional review before reinterpretation.",
      "Page 28: Source-visible rate units include an anomalous value; no unit was corrected silently.",
      "Page 31: Potassium instructions contain source contradictions and stray punctuation; exact wording is retained.",
      "Pages 32–33: Source-visible ‘IVI’ wording is preserved rather than interpreted.",
      "Page 34: Terlipressin route marking conflicts with administration wording; both implicated routes are conditional.",
      "Pages 36–37 include pediatric content inside an adult policy; pediatric rules are intentionally excluded pending a separate approved pediatric protocol.",
      "Pages 36–37: Fentanyl’s adult maximum is printed as ‘1.5 mcg/Kg/hr’ in bolus-dose context and is preserved without correction.",
      "Page 37: Naloxone ‘Maximum dose: 2 mg’ and ‘May repeat every 2-3 minutes’ appear after the Pediatric subsection without a new Adult/shared label; they are not assigned to the adult dose.",
    ]);
    expect(IV_MEDICATION_ADULT_PROTOCOL.proceduralSedationAdult.find((row) => row.drug === "Naloxone")?.dose).toBe(
      "Adult: 0.2 mg IV every 2-3 minutes until respiratory rate greater than 8 returns.",
    );
  });

  it("fails closed for unknown or stale unit identifiers", () => {
    const result = resolveIvMedicationLookup("Cosyntropin", "retired-unit-id");
    expect(result.unit).toBeNull();
    expect(result.matches).toEqual([]);
    expect(result.error).toContain("Unknown IV medication unit");
  });

  it("pins the source-reviewed override definitions and complete medication-route-unit outcome oracle", () => {
    expect(createHash("sha256").update(JSON.stringify(IV_ROUTE_OVERRIDES)).digest("hex")).toBe(
      "e9a51600c77367e0d1553f2e1533978158e46d5e721c01d479b6dd7ba35ad4fb",
    );
    expect(createHash("sha256").update(JSON.stringify(IV_QUERY_ROUTE_OVERRIDES)).digest("hex")).toBe(
      "63221779e21178d4fee4bafcf27a2685a0c2e3d24bdfaba4d144bcd258ec5852",
    );

    const states = new Set(["allowed", "conditional", "emergency-only", "not-permitted", "not-listed"]);
    const matrix = IV_MEDICATION_ADULT_PROTOCOL.medications.flatMap((medication) =>
      IV_MEDICATION_UNITS.map((unit) => {
        const result = resolveIvMedicationLookup(medication.displayName, unit.id).matches.find(
          (match) => match.medication.id === medication.id,
        );
        expect(result, `${medication.displayName} must resolve for ${unit.label}`).toBeDefined();
        const routes = (["ivp", "ivpb", "ci"] as const).map((route) => {
          const resolution = result!.routes[route];
          expect(states.has(resolution.state)).toBe(true);
          if (resolution.state !== "not-listed") expect(resolution.sourceMarker.trim()).not.toBe("");
          return [route, resolution.state, resolution.sourceMarker, resolution.reason];
        });
        return [medication.id, unit.id, routes];
      }),
    );

    expect(matrix).toHaveLength(6412);
    expect(createHash("sha256").update(JSON.stringify(matrix)).digest("hex")).toBe(
      "beedc22342a14227246a395115a0ce0a7e3b1a1f82fec828158a2a5f9070f7e0",
    );
  });

  it("keeps pediatric mode blank until its separate authoritative protocol arrives", () => {
    expect(IV_MEDICATION_ADULT_PROTOCOL.pediatric).toEqual({
      status: "awaiting-authoritative-source",
      message: "Pediatric rules are intentionally blank pending a separate approved pediatric protocol.",
      excludedSourcePages: [36, 37],
    });
    expect(JSON.stringify(IV_MEDICATION_ADULT_PROTOCOL.proceduralSedationAdult)).not.toContain("Pediatric");
    expect(IV_MEDICATION_ADULT_PROTOCOL.proceduralSedationAdult.map((row) => row.drug)).toEqual([
      "Midazolam",
      "Fentanyl",
      "Naloxone",
      "Flumazenil",
    ]);
    expect(
      createHash("sha256")
        .update(JSON.stringify(IV_MEDICATION_ADULT_PROTOCOL.proceduralSedationAdult))
        .digest("hex"),
    ).toBe("00ebec66b341736f1ab48697bc5597ab1a30938f715ed0f34023502913eef2a6");
  });
});
