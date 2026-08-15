import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  IV_MEDICATION_PEDIATRIC_PROTOCOL,
  IV_PEDIATRIC_ROUTE_SCOPE_REVIEW_FIXTURE,
  IV_MEDICATION_PEDIATRIC_UNREVIEWED_ROUTE_SCOPES,
  IV_MEDICATION_PEDIATRIC_UNITS,
  PROTOCOL_REFERENCES,
  resolveIvMedicationLookup,
} from "./protocols-data";

const sourceSha256 = "be9b5065dfe2d18a5d1a3c32ee6d0dfc772eaff8eeb70a8ae549282f55805351";

function entry(name: string) {
  return IV_MEDICATION_PEDIATRIC_PROTOCOL.medications.find((item) => item.displayName === name);
}

describe("approved April 2026 Intravenous Medication: Pediatric institutional source", () => {
  it("pins the unchanged public PDF bytes", () => {
    const file = readFileSync(
      join(process.cwd(), "public/references/lbh-intravenous-medication-pediatric-2026-04.pdf"),
    );
    expect(file.byteLength).toBe(400287);
    expect(createHash("sha256").update(file).digest("hex")).toBe(sourceSha256);
  });

  it("publishes exact identity, scope, approval metadata, and References linkage", () => {
    expect(IV_MEDICATION_PEDIATRIC_PROTOCOL.source).toEqual({
      id: "intravenous-medication-pediatric-2026-04",
      title: "Intravenous Medication: Pediatric",
      updated: "April 22, 2026",
      pageCount: 32,
      href: "/references/lbh-intravenous-medication-pediatric-2026-04.pdf",
      sha256: sourceSha256,
      authority: "LBH institutional protocol; medical-board and P&T reviewed/approved",
      affectedViews: ["iv-medication"],
    });
    expect(IV_MEDICATION_PEDIATRIC_PROTOCOL.referenceNumber).toBe("18234");
    expect(IV_MEDICATION_PEDIATRIC_PROTOCOL.nextReviewDate).toBe("April 30, 2029");
    expect(IV_MEDICATION_PEDIATRIC_PROTOCOL.sites).toEqual(["Sinai Hospital of Baltimore"]);
    expect(IV_MEDICATION_PEDIATRIC_PROTOCOL.scope).toContain("seventeen (17) years of age or younger");
    expect(PROTOCOL_REFERENCES).toContainEqual(IV_MEDICATION_PEDIATRIC_PROTOCOL.source);
  });

  it("preserves all 197 Appendix A rows and four visually verified page continuations", () => {
    expect(IV_MEDICATION_PEDIATRIC_PROTOCOL.sourceRowCount).toBe(197);
    expect(IV_MEDICATION_PEDIATRIC_PROTOCOL.medications).toHaveLength(197);
    expect(IV_MEDICATION_PEDIATRIC_PROTOCOL.continuationPages).toEqual([7, 10, 12, 28]);
    expect(
      IV_MEDICATION_PEDIATRIC_PROTOCOL.medications
        .filter((medication) => medication.pageEnd)
        .map((medication) => [medication.displayName, medication.page, medication.pageEnd]),
    ).toEqual([
      ["Adenosine (Adenocard, Adenoscan)", 6, 7],
      ["Ceftriaxone (Rocephin)", 9, 10],
      ["Dexmedetomidine (Precedex)", 11, 12],
      ["Rituximab (Rituxan)- Monoclonal Antibody", 27, 28],
    ]);
    expect(
      createHash("sha256")
        .update(JSON.stringify(IV_MEDICATION_PEDIATRIC_PROTOCOL.medications))
        .digest("hex"),
    ).toBe("24bc23d526d87ede0313d783f69c211ed52813ba79f2aac8a32ee928d50fb4db");
    for (const medication of IV_MEDICATION_PEDIATRIC_PROTOCOL.medications) {
      expect(medication.displayName.trim()).not.toBe("");
      expect(medication.page).toBeGreaterThanOrEqual(6);
      expect(medication.page).toBeLessThanOrEqual(31);
      expect([medication.routes.ivp, medication.routes.ivpb, medication.routes.ci].some(Boolean)).toBe(true);
    }
    expect(entry("Adenosine (Adenocard, Adenoscan)")?.areasOfUse).toContain("E: Pushed by CC nurse");
    expect(entry("Ceftriaxone (Rocephin)")?.considerations).toContain("than neonates");
    expect(entry("Dexmedetomidine (Precedex)")?.considerations).toContain("Procedural Sedation Policy");
    expect(entry("Rituximab (Rituxan)- Monoclonal Antibody")?.considerations).toContain("Titration >50kg");
  });

  it("models the pediatric unit hierarchy independently from adult units", () => {
    expect(IV_MEDICATION_PEDIATRIC_PROTOCOL.defaultContext).toEqual({
      population: "pediatric",
      site: "sinai-pediatric",
      unit: "general-pediatrics",
    });
    expect(IV_MEDICATION_PEDIATRIC_UNITS.find((unit) => unit.id === "general-pediatrics")?.permissions).toEqual(["G"]);
    expect(IV_MEDICATION_PEDIATRIC_UNITS.find((unit) => unit.id === "3chs")?.permissions).toEqual(["G", "M"]);
    expect(IV_MEDICATION_PEDIATRIC_UNITS.find((unit) => unit.id === "picu")?.permissions).toEqual(["G", "M", "CC"]);
    expect(IV_MEDICATION_PEDIATRIC_UNITS.find((unit) => unit.id === "nicu")?.permissions).toEqual(["G", "M", "CC"]);
    expect(IV_MEDICATION_PEDIATRIC_UNITS.find((unit) => unit.id === "cdc")?.permissions).toEqual(["G", "P"]);
    expect(IV_MEDICATION_PEDIATRIC_UNITS.find((unit) => unit.id === "or-pediatric")?.permissions).toEqual(["G", "P"]);
  });

  it("pins the complete ambiguity-and-alert inventory as a closed set", () => {
    expect(IV_MEDICATION_PEDIATRIC_PROTOCOL.sourceAlerts).toEqual([
      "Pages 1 and 3: The scope prints Gastrointestinal Diagnostic Center as ‘GILDC’ while the Procedure definition prints ‘GIDC’; the Pediatric unit selector uses the full source name and preserves this abbreviation mismatch as an alert.",
      "Page 2: The Responsibility paragraph prints ‘CRNA)Registered Nurse’ without intervening punctuation; the source wording is preserved.",
      "Page 2: The Mini-bag Plus definition prints ‘admixutre’ rather than ‘admixture’; the source wording is preserved.",
      "Pages 1 and 3: The policy alternates ‘Neonatal’/‘Neonate’ Intensive Care Unit, ‘Post Anesthesia’/‘Post Acute’ Care Unit, and ‘Pediatric IV Medication List’/‘IV Medication Administration Guide’; the app does not silently normalize these governed labels.",
      "Page 3: Monitored (M) is labeled general pediatrics (3CHS) and then described as any nursing unit equipped for continuous ECG monitoring; the selector exposes 3CHS as the governed M context and does not infer additional monitored units.",
      "Page 3: NICU administration requires confirmation against NEOFAX before administration; the lookup does not replace that external verification step.",
      "Page 3: A critical-care-restricted medication may be initiated in another area only after critical-care transfer approval and with an MP directly and continuously monitoring delivery and response; ordinary unit lookup remains fail-closed outside that patient-specific exception.",
      "Page 3: A medication requested in a non-designated area or absent from Appendix A requires unit leadership/Manager of Hospital Operations consultation with Pharmacy plus ordering-MP documentation in the EMR; the lookup does not automate that exception process.",
      "Pages 6–7: Adenosine administration depends on training, MP presence, monitoring, Lifepak availability, area, and emergency context; the route remains conditional rather than being reduced to unit permission alone.",
      "Page 7: The Alteplase row prints product-scoped wording as ‘ACTIVASE: IVP-E/CC’, ‘ACTIVASE: CI-CC’, and ‘CATHFLO ACTIVASE: G’; Activase route markers are not assigned to Cathflo.",
      "Page 8: Conventional Amphotericin B repeats ‘immediately preceding’ in its saline-bolus sentence; the source text is preserved.",
      "Page 10: Chlorpromazine is marked for IVP and IVPB while the prose says IVP is not preferred and requires an MP present; both routes remain conditional.",
      "Page 11: The source-visible medication name is printed as ‘Daptomycin Cubicin)’ without an opening parenthesis; it is not silently corrected.",
      "Page 11: The source-visible medication name is printed ‘Darbopoetin Alfa’ rather than the standard ‘darbepoetin alfa’; it is preserved for exact-source fidelity.",
      "Page 12: Dextrose 25% and 50% includes source-visible duplicate punctuation before the D50 dilution sentence; it is preserved.",
      "Pages 10 and 13: Premarin appears in two source-visible rows as ‘Conjugated estrogen’ and ‘Estrogens, conjugated’; both rows remain separately searchable and are not silently deduplicated.",
      "Page 14: The product list prints ‘Wilate’ while its administration line prints ‘Wilat admin rate’; both source-visible forms are preserved.",
      "Page 15: Hydrocortisone prints ‘IVBP (≥500mg)’ rather than IVPB in the consideration text; the route marker remains the source table’s IVPB column.",
      "Page 16: The source-visible medication name is split as ‘Hydromor-phone’; it is not silently normalized.",
      "Page 18: Ketamine prints ‘CI:CC’ and then an unlabeled ‘M: PCA only (end of life care)’ qualifier; CI is conservatively Conditional for CC/M and the exact source wording remains visible.",
      "Page 19: Lorazepam has a CI marker but only assigns ‘IVP: G’ in Areas of Use; CI remains unresolved/Conditional for every unit rather than inheriting the IVP scope.",
      "Page 21: Naloxone prints ‘priuritis’ in the continuous-infusion indication; it is preserved.",
      "Page 26: Prochlorperazine is marked for IVP and IVPB while the prose says IM is preferred and IV is typically avoided; both IV routes remain Conditional.",
      "Page 25: Potassium chloride visibly instructs labeling the syringe/minibag and line ‘Potassium-Do Not Use’; the unusual wording is preserved and not reinterpreted.",
      "Pages 27–28: Rituximab assigns regimens to <50 kg and >50 kg without explicitly assigning exactly 50 kg; the app shows the source prose and does not infer a regimen.",
      "Pages 27–28: Rituximab administration and monitoring text spans the page break and includes source-visible punctuation omissions; the complete wording is joined without correction.",
      "Page 26: Propofol IV push is restricted to Anesthesia for procedural sedation; it is available only in the source-listed CC/P scopes and remains Conditional there.",
      "Page 29: Sodium chloride 23.4% is marked IVPB with Area E even though the policy defines E as emergent IV Push only; the IVPB route remains unresolved/Conditional rather than being silently rejected or reclassified.",
      "Page 31: Verapamil is marked for IVP and CI in CC/P/E but provides no rate or monitoring consideration in the row; no missing guidance is invented.",
    ]);
  });

  it("searches and resolves pediatric routes without reusing adult rows or units", () => {
    const vancomycin = resolveIvMedicationLookup("Vancomycin", "general-pediatrics", "pediatric");
    expect(vancomycin.matches.map((match) => match.medication.displayName)).toEqual(["Vancomycin"]);
    expect(vancomycin.matches[0].routes.ivpb.state).toBe("allowed");
    expect(vancomycin.matches[0].routes.ivp.state).toBe("not-listed");

    const amiodaroneGeneral = resolveIvMedicationLookup("Amiodarone", "general-pediatrics", "pediatric").matches[0];
    expect(amiodaroneGeneral.routes.ivp.state).toBe("emergency-only");
    expect(amiodaroneGeneral.routes.ivpb.state).toBe("not-permitted");
    expect(amiodaroneGeneral.routes.ci.state).toBe("not-permitted");
    const amiodaronePicu = resolveIvMedicationLookup("Amiodarone", "picu", "pediatric").matches[0];
    expect(amiodaronePicu.routes.ivpb.state).toBe("allowed");
    expect(amiodaronePicu.routes.ci.state).toBe("allowed");

    expect(resolveIvMedicationLookup("definitely-not-source-text", "picu", "pediatric").matches).toEqual([]);
    const stale = resolveIvMedicationLookup("Vancomycin", "icu", "pediatric");
    expect(stale.unit).toBeNull();
    expect(stale.matches).toEqual([]);
    expect(stale.error).toContain("Unknown pediatric IV medication unit");
  });

  it("fails closed for pediatric product, provider, and indication restrictions", () => {
    const cathflo = resolveIvMedicationLookup("Cathflo", "general-pediatrics", "pediatric").matches[0];
    expect(cathflo.routes.ivp.state).toBe("not-listed");
    expect(cathflo.routes.ci.state).toBe("not-listed");
    const activase = resolveIvMedicationLookup("Activase", "general-pediatrics", "pediatric").matches[0];
    expect(activase.routes.ivp.state).toBe("emergency-only");
    expect(activase.routes.ci.state).toBe("not-permitted");
    const mixed = resolveIvMedicationLookup("Alteplase (Activase, Cathflo)", "general-pediatrics", "pediatric").matches[0];
    expect(mixed.routes.ivp.state).toBe("conditional");
    expect(mixed.routes.ci.state).toBe("conditional");

    expect(resolveIvMedicationLookup("Propofol", "general-pediatrics", "pediatric").matches[0].routes.ivp.state).toBe("not-permitted");
    expect(resolveIvMedicationLookup("Propofol", "picu", "pediatric").matches[0].routes.ivp.state).toBe("conditional");
    expect(resolveIvMedicationLookup("Ephedrine", "picu", "pediatric").matches[0].routes.ivp.state).toBe("conditional");
    expect(resolveIvMedicationLookup("Ephedrine", "general-pediatrics", "pediatric").matches[0].routes.ivp.state).toBe("not-permitted");
    expect(resolveIvMedicationLookup("Etomidate", "picu", "pediatric").matches[0].routes.ivp.state).toBe("conditional");
    expect(resolveIvMedicationLookup("Sugammadex", "or-pediatric", "pediatric").matches[0].routes.ivp.state).toBe("conditional");
    expect(resolveIvMedicationLookup("Fosphenytoin", "general-pediatrics", "pediatric").matches[0].routes.ivpb.state).toBe("conditional");
    expect(resolveIvMedicationLookup("Ketamine", "3chs", "pediatric").matches[0].routes.ci.state).toBe("conditional");
    expect(resolveIvMedicationLookup("Lorazepam", "picu", "pediatric").matches[0].routes.ci.state).toBe("conditional");
    expect(resolveIvMedicationLookup("Chlorpromazine", "general-pediatrics", "pediatric").matches[0].routes.ivp.state).toBe("conditional");
    expect(resolveIvMedicationLookup("Chlorpromazine", "general-pediatrics", "pediatric").matches[0].routes.ivpb.state).toBe("conditional");
    expect(resolveIvMedicationLookup("Prochlorperazine", "general-pediatrics", "pediatric").matches[0].routes.ivp.state).toBe("conditional");
    expect(resolveIvMedicationLookup("Prochlorperazine", "general-pediatrics", "pediatric").matches[0].routes.ivpb.state).toBe("conditional");
    expect(resolveIvMedicationLookup("Sodium chloride 23.4%", "general-pediatrics", "pediatric").matches[0].routes.ivpb.state).toBe("conditional");
  });

  it("has no unreviewed route-scoped Areas of Use clauses", () => {
    expect(IV_MEDICATION_PEDIATRIC_UNREVIEWED_ROUTE_SCOPES).toEqual([]);
  });

  it("normalizes every marked pediatric route into a source-reviewed scope matrix", () => {
    const gaps = IV_MEDICATION_PEDIATRIC_PROTOCOL.medications.flatMap((medication) => {
      const routeScopes = (medication as typeof medication & {
        routeScopes?: Partial<Record<"ivp" | "ivpb" | "ci", { scopes: string[] }>>;
      }).routeScopes;
      return (["ivp", "ivpb", "ci"] as const)
        .filter((route) => medication.routes[route] && !routeScopes?.[route])
        .map((route) => `${medication.displayName}:${route}`);
    });
    expect(gaps).toEqual([]);
    for (const [displayName, reviewedRoutes] of Object.entries(IV_PEDIATRIC_ROUTE_SCOPE_REVIEW_FIXTURE)) {
      expect(entry(displayName)?.routeScopes).toMatchObject(reviewedRoutes);
    }
  });

  it("pins every medication-route-unit outcome to the source-reviewed resolver", () => {
    const outcomes: string[] = [];
    const counts: Record<string, number> = {};
    for (const unit of IV_MEDICATION_PEDIATRIC_UNITS) {
      for (const medication of IV_MEDICATION_PEDIATRIC_PROTOCOL.medications) {
        const result = resolveIvMedicationLookup(medication.displayName, unit.id, "pediatric").matches.find(
          (match) => match.medication.id === medication.id,
        );
        expect(result, `${unit.id}:${medication.displayName}`).toBeDefined();
        for (const route of ["ivp", "ivpb", "ci"] as const) {
          const state = result!.routes[route].state;
          outcomes.push(`${unit.id}|${medication.id}|${route}|${state}`);
          counts[state] = (counts[state] ?? 0) + 1;
        }
      }
    }
    expect(outcomes).toHaveLength(7683);
    expect(counts).toEqual({
      "not-listed": 3874,
      allowed: 2635,
      "not-permitted": 540,
      conditional: 463,
      "emergency-only": 171,
    });
    expect(createHash("sha256").update(JSON.stringify(outcomes)).digest("hex")).toBe(
      "d1cad8df490be0ecbc466726392205c74f47f0e87bf26329397cb2763d175e0a",
    );
  });
});
