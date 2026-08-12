import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  DO_NOT_CRUSH_PROTOCOL,
  PROTOCOL_REFERENCES,
  searchDoNotCrush,
} from "./protocols-data";

const sourceSha256 = "402c62b6c53ee91bb83cbee19716fe88728291d1841a7574e20570767bf6a92e";

function allRows() {
  return DO_NOT_CRUSH_PROTOCOL.tables.flatMap((table) => table.rows);
}

function sourceText() {
  return JSON.stringify(DO_NOT_CRUSH_PROTOCOL).replaceAll("\\n", " ").replace(/\s+/g, " ");
}

describe("approved January 2026 Do Not Crush institutional source", () => {
  it("pins the unchanged approved PDF bytes", () => {
    const file = readFileSync(
      join(process.cwd(), "public/references/lbh-do-not-crush-list-2026-01.pdf"),
    );
    expect(file.byteLength).toBe(208396);
    expect(createHash("sha256").update(file).digest("hex")).toBe(sourceSha256);
  });

  it("publishes complete source metadata and References linkage", () => {
    expect(DO_NOT_CRUSH_PROTOCOL.source).toEqual({
      id: "do-not-crush-2026-01",
      title: "LBH DO NOT CRUSH LIST — APPENDIX A",
      updated: "January 2026",
      pageCount: 5,
      href: "/references/lbh-do-not-crush-list-2026-01.pdf",
      sha256: sourceSha256,
      authority: "LBH institutional protocol; medical-board and P&T reviewed/approved",
      affectedViews: ["dnc"],
    });
    expect(PROTOCOL_REFERENCES).toContainEqual(DO_NOT_CRUSH_PROTOCOL.source);
    expect(DO_NOT_CRUSH_PROTOCOL.formularyQualifier).toBe(
      "*Note- Tables contain formulary medications only*",
    );
  });

  it("preserves all four source tables and all 100 logical medication rows", () => {
    expect(DO_NOT_CRUSH_PROTOCOL.tables.map((table) => table.title)).toEqual([
      "Medications that cannot be crushed/opened.",
      "Can be crushed, but handling precaution required.",
      "Can be Crushed, but taste may limit tolerability.",
      "Can be Administered with Special Instructions",
    ]);
    expect(DO_NOT_CRUSH_PROTOCOL.tables.map((table) => table.rows.length)).toEqual([
      70, 4, 4, 22,
    ]);
    expect(allRows()).toHaveLength(100);
    for (const row of allRows()) {
      expect(row.generic.trim()).not.toBe("");
      expect(row.brand.trim()).not.toBe("");
      expect(row.comments.trim()).not.toBe("");
      expect(row.page).toBeGreaterThanOrEqual(1);
      expect(row.page).toBeLessThanOrEqual(5);
    }
  });

  it("joins the lenalidomide cross-page continuation without losing its exposure warning", () => {
    const row = allRows().find((item) => item.generic === "lenalidomide");
    expect(row).toEqual({
      generic: "lenalidomide",
      brand: "Revlimid",
      comments:
        "Do not chew or crush\nNote: Teratogenic potential; health care workers should avoid contact with capsule contents.",
      page: 1,
      pageEnd: 2,
    });
  });

  it("retains fatal-dose, teratogenic, PPE, tube, and alternative-formulation qualifiers", () => {
    const text = sourceText();
    for (const expected of [
      "rapid release and absorption of a potentially fatal dose",
      "Crush/disperse only using a closed system using PPE",
      "should wear double gloves and a protective gown",
      "Do not use with small bore tubes",
      "Monitor patient for postural hypotension, dizziness, vertigo",
      "Pharmacy to compound suspension using oral capsules",
      "chewable tablets are an alternative",
      "Liquid formulation available for abacavir",
      "49/51mg tablets (see Micromedex.",
    ]) expect(text).toContain(expected);
  });

  it("preserves both complete governing notes and all source references", () => {
    expect(DO_NOT_CRUSH_PROTOCOL.notes).toEqual([
      "Diltiazem IR: ISMP states not to split, chew or crush. Conflicting information exists when reviewing Micromedex and other tertiary sites. Teva pharmaceutical labeling specifically states their product CAN be crushed or chewed and therefore, diltiazem IR has been removed from this list as of 2022. Note that diltiazem IR 30mg tabs can’t be split in half.",
      "Tamsulosin: Studies in pediatrics allowed opening capsules and mixing with acidic food (apple sauce, juice) without chewing or crushing the contents. Lack of studies exist for opening capsules for administration via tubes. If no therapeutic alternative available for patient with G tube, may consider administration by opening capsule and mixing with juice. Do not use with small bore tubes. Monitor patient for postural hypotension, dizziness, vertigo.",
    ]);
    expect(DO_NOT_CRUSH_PROTOCOL.references).toHaveLength(4);
    expect(DO_NOT_CRUSH_PROTOCOL.references.map((reference) => reference.label)).toEqual([
      "1(a)", "1(b)", "2", "3",
    ]);
    const references = DO_NOT_CRUSH_PROTOCOL.references.map((reference) => reference.text).join(" ");
    expect(references).toContain(
      "Institute for Safe Medication Practices. Oral Dosage Forms That Should Not Be Crushed. 2020.",
    );
    expect(references).toContain(
      "International Journal of Pharmaceutical Compounding. 2021; 25(5):364-71.",
    );
  });

  it("replaces the unsupported generic 12-row placeholder", () => {
    const text = sourceText();
    expect(allRows()).toHaveLength(100);
    expect(text).not.toContain("Dose dumping / toxicity risk");
    expect(text).not.toContain("Follow label — some may mix with applesauce, not crush all");
    expect(text).not.toContain("Softgel special oils");
  });

  it("searches generic names, brands, comments, table titles, and governing notes", () => {
    expect(searchDoNotCrush("Revlimid")[0]?.rows.map((row) => row.generic)).toEqual([
      "lenalidomide",
    ]);
    const noteOnly = searchDoNotCrush("small bore tubes");
    expect(noteOnly).toHaveLength(1);
    expect(noteOnly[0]?.number).toBe(1);
    expect(noteOnly[0]?.rows).toEqual([]);
    expect(noteOnly[0]?.noteMatch).toBe(true);
    expect(searchDoNotCrush("handling precaution")[0]?.number).toBe(2);
    expect(searchDoNotCrush("25ml of water")[0]?.rows.map((row) => row.generic)).toEqual([
      "Cenobamate",
    ]);
    expect(searchDoNotCrush("25ml water")[0]?.rows.map((row) => row.generic)).toEqual([
      "Cenobamate",
    ]);
    expect(searchDoNotCrush("definitely-not-a-source-term")).toEqual([]);
  });
});
