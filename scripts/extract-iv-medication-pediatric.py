#!/usr/bin/env python3
"""Extract Appendix A from the approved Pediatric IV Medication policy.

Run with:
  uv run --with pymupdf python scripts/extract-iv-medication-pediatric.py \
    public/references/lbh-intravenous-medication-pediatric-2026-04.pdf \
    src/lib/iv-medication-pediatric-data.json

The PDF remains authoritative. This extractor reads the fixed source grid,
joins only the four visually verified cross-page continuations, and preserves
source-visible wording without clinical normalization.
"""

from __future__ import annotations

import hashlib
import json
import re
import sys
from pathlib import Path

import pymupdf

SOURCE_SHA256 = "be9b5065dfe2d18a5d1a3c32ee6d0dfc772eaff8eeb70a8ae549282f55805351"
CONTINUATION_PAGES = [7, 10, 12, 28]
COLUMN_BOUNDS = [(55, 180), (180, 212), (213, 248), (249, 270), (271, 393), (394, 765)]

# Closed, source-reviewed normalization for rows whose Areas of Use cell is not
# a plain shared G/M/CC/P/E token list. Plain rows are normalized by
# ``simple_shared_scopes`` below; no free-form parsing occurs in the app.
COMPLEX_ROUTE_SCOPES: dict[str, dict[str, dict]] = {
    "Adenosine (Adenocard, Adenoscan)": {"ivp": {"scopes": ["G", "CC", "P", "E"], "conditional": True}},
    "Alteplase (Activase, Cathflo)": {
        "ivp": {"scopes": ["E", "CC"], "unresolved": True},
        "ci": {"scopes": ["CC"], "unresolved": True},
    },
    "Aminophylline": {"ivpb": {"scopes": ["M"]}, "ci": {"scopes": ["CC"]}},
    "Amiodarone (Cordarone)": {
        "ivp": {"scopes": ["E"]}, "ivpb": {"scopes": ["CC", "P"]}, "ci": {"scopes": ["CC", "P"]}
    },
    "Calcium chloride": {
        "ivp": {"scopes": ["E"], "conditional": True},
        "ivpb": {"scopes": ["M", "CC", "P"]},
        "ci": {"scopes": ["CC"]},
    },
    "Calcium gluconate": {
        "ivp": {"scopes": ["E"], "conditional": True},
        "ivpb": {"scopes": ["M", "CC", "P"]},
        "ci": {"scopes": ["CC"]},
    },
    "Chlorpromazine (Thorazine)": {
        "ivp": {"scopes": ["G"], "conditional": True},
        "ivpb": {"scopes": ["G"], "conditional": True},
    },
    "Crizanlizumab": {"ivpb": {"scopes": ["G"], "conditional": True}},
    "Dalbavancin": {"ivpb": {"scopes": ["ED"], "conditional": True}},
    "Deferoxamine mesylate (Desferal)": {
        "ivpb": {"scopes": ["G", "M", "CC"], "conditional": True},
        "ci": {"scopes": ["G", "M", "CC"], "conditional": True},
    },
    "Droperidol": {"ivp": {"scopes": ["OR"], "conditional": True}},
    "Ephedrine sulfate": {"ivp": {"scopes": ["CC", "P"], "conditional": True}},
    "Epinephrine (Adrenalin 0.1 mg/mL)": {"ivp": {"scopes": ["E"]}, "ci": {"scopes": ["CC", "P"]}},
    "Fentanyl (Sublimaze)": {
        "ivp": {"scopes": ["M", "CC", "P"]},
        "ci": {"scopes": ["M", "CC"], "conditional": True},
    },
    "Ferumoxytol (Feraheme)": {"ivpb": {"scopes": ["G"], "conditional": True}},
    "Fosphenytoin (Cerebyx)": {"ivpb": {"scopes": ["G"], "conditional": True}},
    "Glucagon": {
        "ivp": {"scopes": ["G"], "conditional": True},
        "ci": {"scopes": ["CC"], "conditional": True},
    },
    "Haloperidol (Haldol) lactate": {"ivp": {"scopes": ["M", "CC"], "conditional": True}},
    "Heparin sodium": {
        "ivp": {"scopes": ["G"], "conditional": True},
        "ci": {"scopes": ["G", "CC", "P"], "conditional": True},
    },
    "Hydromor-phone (Dilaudid)": {
        "ivp": {"scopes": ["G"]},
        "ci": {"scopes": ["M", "CC"], "conditional": True},
    },
    "Indomethacin": {"ivpb": {"scopes": ["NICU"], "conditional": True}},
    "Insulin, regular": {
        "ivp": {"scopes": ["E"]},
        "ivpb": {"scopes": ["NICU"], "conditional": True},
        "ci": {"scopes": ["CC", "P"]},
    },
    "Etomidate": {"ivp": {"scopes": ["CC", "P", "E"], "conditional": True}},
    "Ketamine": {
        "ivp": {"scopes": ["CC", "P", "E"], "conditional": True},
        "ci": {"scopes": ["CC", "M"], "conditional": True},
    },
    "Lidocaine (Xylocaine)": {"ivp": {"scopes": ["E", "CC", "P"]}, "ci": {"scopes": ["CC", "P"]}},
    "Lorazepam (Ativan)": {"ivp": {"scopes": ["G"]}, "ci": {"scopes": [], "unresolved": True}},
    "Magnesium sulfate": {
        "ivp": {"scopes": ["CC", "E"], "conditional": True},
        "ivpb": {"scopes": ["G"]},
        "ci": {"scopes": ["CC"]},
    },
    "Mannitol": {"ivp": {"scopes": ["CC", "E"]}, "ivpb": {"scopes": ["G"]}},
    "Meperidine (Demerol)": {
        "ivp": {"scopes": ["OR"], "conditional": True},
        "ivpb": {"scopes": ["G"]},
    },
    "Metoprolol (Lopressor)": {
        "ivp": {"scopes": ["P"], "conditional": True},
        "ivpb": {"scopes": ["M", "CC", "P"]},
    },
    "Midazolam (Versed)": {
        "ivp": {"scopes": ["G", "CC", "P", "E"], "conditional": True},
        "ci": {"scopes": ["CC"]},
    },
    "Morphine sulfate": {
        "ivp": {"scopes": ["G"]},
        "ci": {"scopes": ["M", "CC"], "conditional": True},
    },
    "Naloxone (Narcan)": {
        "ivp": {"scopes": ["G"]},
        "ci": {"scopes": ["G", "CC"], "conditional": True},
    },
    "Potassium acetate": {"ci": {"scopes": ["G"], "conditional": True}},
    "Potassium chloride": {
        "ivpb": {"scopes": ["G"], "conditional": True},
        "ci": {"scopes": ["G"], "conditional": True},
    },
    "Potassium phosphate": {
        "ivpb": {"scopes": ["G"], "conditional": True},
        "ci": {"scopes": ["G"], "conditional": True},
    },
    "Propofol (Diprivan)": {
        "ivp": {"scopes": ["CC", "P"], "conditional": True},
        "ci": {"scopes": ["CC", "P"]},
    },
    "Prochlorperazine (Compazine)": {
        "ivp": {"scopes": ["G"], "conditional": True},
        "ivpb": {"scopes": ["G"], "conditional": True},
    },
    "Sodium chloride 23.4%": {"ivpb": {"scopes": ["E"], "unresolved": True}},
    "Sugammadex": {"ivp": {"scopes": ["CC", "P"], "conditional": True}},
    "Ustekinumab (Stelara)": {"ivpb": {"scopes": ["G"], "conditional": True}},
    "Vedolizumab (Entyvio)": {"ivpb": {"scopes": ["G"], "conditional": True}},
}


def clean(value: str | None) -> str:
    return re.sub(r"\s+", " ", value or "").strip()


def horizontal_row_lines(page: pymupdf.Page) -> list[float]:
    """Recover the source table's full-width medication-row boundaries."""
    values: list[float] = []
    for drawing in page.get_drawings():
        for item in drawing["items"]:
            if item[0] != "re":
                continue
            rect = item[1]
            if 54 <= rect.x0 <= 56 and 120 < rect.width < 127 and rect.height < 2:
                values.extend([round(rect.y0, 2), round(rect.y1, 2)])

    merged: list[float] = []
    for value in sorted(set(values)):
        if not merged or abs(value - merged[-1]) > 1.5:
            merged.append(value)
    return merged


def extract_central_line_text(considerations: str) -> str:
    match = re.search(
        r"(?i)(?:^|(?<=\.))\s*([^.]*(?:central line|central venous catheter)[^.]*\.)",
        considerations,
    )
    if match and re.search(r"(?i)required|recommended", match.group(1)):
        return clean(match.group(1))
    return ""


def simple_shared_scopes(areas: str) -> list[str] | None:
    cleaned = re.sub(r"\*+$", "", areas).strip()
    tokens = [token for token in re.split(r"\s*[/,]\s*", cleaned) if token]
    return tokens if tokens and all(token in {"G", "M", "CC", "P", "E"} for token in tokens) else None


def normalize_route_scopes(medications: list[dict]) -> None:
    gaps: list[str] = []
    for medication in medications:
        simple = simple_shared_scopes(medication["areasOfUse"])
        reviewed = COMPLEX_ROUTE_SCOPES.get(medication["displayName"], {})
        route_scopes: dict[str, dict] = {}
        for route in ("ivp", "ivpb", "ci"):
            if not medication["routes"][route]:
                continue
            if route in reviewed:
                route_scopes[route] = reviewed[route]
            elif simple is not None:
                route_scopes[route] = {
                    "scopes": simple,
                    "conditional": "*" in medication["areasOfUse"] or "*" in medication["routes"][route],
                }
            else:
                gaps.append(f'{medication["displayName"]}:{route}:{medication["areasOfUse"]}')
        medication["routeScopes"] = route_scopes
    if gaps:
        raise RuntimeError("Unreviewed pediatric route scopes:\n" + "\n".join(gaps))


def extract_medications(pdf_path: Path) -> tuple[list[dict], int]:
    doc = pymupdf.open(pdf_path)
    medications: list[dict] = []
    source_rows = 0

    for page_number in range(6, 32):
        page = doc[page_number - 1]
        lines = horizontal_row_lines(page)
        page_had_continuation = False

        for y0, y1 in zip(lines, lines[1:]):
            if y1 - y0 < 8:
                continue
            cells = [
                clean(
                    page.get_text(
                        "text",
                        clip=pymupdf.Rect(x0 + 1, y0 + 1, x1 - 1, y1 - 1),
                        sort=True,
                    )
                )
                for x0, x1 in COLUMN_BOUNDS
            ]
            name, ivp, ivpb, ci, areas, considerations = cells
            if name.startswith("GENERIC MEDICATION"):
                continue

            if not name:
                if any(cells[1:]):
                    if not medications:
                        raise RuntimeError(f"Orphan continuation on page {page_number}")
                    prior = medications[-1]
                    for route, value in (("ivp", ivp), ("ivpb", ivpb), ("ci", ci)):
                        if value:
                            prior["routes"][route] = clean(f'{prior["routes"][route]} {value}')
                    if areas:
                        prior["areasOfUse"] = clean(f'{prior["areasOfUse"]} {areas}')
                    if considerations:
                        prior["considerations"] = clean(f'{prior["considerations"]} {considerations}')
                        prior["centralLineRequired"] = extract_central_line_text(prior["considerations"])
                    prior["pageEnd"] = page_number
                    page_had_continuation = True
                continue

            source_rows += 1
            medications.append(
                {
                    "id": f"iv-ped-{source_rows:03d}",
                    "displayName": name,
                    "aliases": [],
                    "graceAvailable": False,
                    "routes": {"ivp": ivp, "ivpb": ivpb, "ci": ci},
                    "centralLineRequired": extract_central_line_text(considerations),
                    "areasOfUse": areas,
                    "considerations": considerations,
                    "page": page_number,
                }
            )

        if page_number in CONTINUATION_PAGES and not page_had_continuation:
            raise RuntimeError(f"Missing visually verified continuation on page {page_number}")

    normalize_route_scopes(medications)
    return medications, source_rows


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit("usage: extract-iv-medication-pediatric.py SOURCE.pdf OUTPUT.json")
    source = Path(sys.argv[1])
    output = Path(sys.argv[2])
    if hashlib.sha256(source.read_bytes()).hexdigest() != SOURCE_SHA256:
        raise RuntimeError("Pediatric IV source hash does not match the approved artifact")

    medications, source_rows = extract_medications(source)
    if source_rows != 197 or len(medications) != 197:
        raise RuntimeError(
            f"Expected 197 source-visible/logical medications, found {source_rows}/{len(medications)}"
        )

    model = {
        "source": {
            "id": "intravenous-medication-pediatric-2026-04",
            "title": "Intravenous Medication: Pediatric",
            "updated": "April 22, 2026",
            "pageCount": 32,
            "href": "/references/lbh-intravenous-medication-pediatric-2026-04.pdf",
            "sha256": SOURCE_SHA256,
            "authority": "LBH institutional protocol; medical-board and P&T reviewed/approved",
            "affectedViews": ["iv-medication"],
        },
        "referenceNumber": "18234",
        "nextReviewDate": "April 30, 2029",
        "sites": ["Sinai Hospital of Baltimore"],
        "approvers": [
            "AMANDA SHROUT (VP PATIENT CARE SVCS AND CNO-SINAI AND GRACE)",
            "AZIZA TAHIR SHAD (Chair-Peds and Div Head-Hemoc)",
            "CHARLES ALBRECHT (VP - Chief Medical Officer)",
            "LISA POLINSKY (VP - Pharmacy and Respiratory)",
        ],
        "scope": (
            "Medical Center Complex, Pediatric Inpatient and Pediatric Emergency Department population, "
            "including the source-listed pediatric inpatient, critical-care, emergency, procedural, "
            "diagnostic, and hematology/oncology areas; patients seventeen (17) years of age or younger."
        ),
        "purpose": (
            "To provide guidance for administering intravenous (IV) medications to patients seventeen "
            "(17) years of age or younger, with allowance for adaptation in extenuating circumstances."
        ),
        "defaultContext": {
            "population": "pediatric",
            "site": "sinai-pediatric",
            "unit": "general-pediatrics",
        },
        "sourceRowCount": source_rows,
        "continuationPages": CONTINUATION_PAGES,
        "medications": medications,
        "sourceAlerts": [
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
        ],
    }
    output.write_text(json.dumps(model, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {output}: {source_rows} source rows, {len(medications)} logical medications")


if __name__ == "__main__":
    main()
