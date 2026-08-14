#!/usr/bin/env python3
"""Extract the approved Appendix A table into the checked-in source model.

Run with:
  uv run --with pymupdf python scripts/extract-iv-medication-adult.py \
    public/references/lbh-intravenous-medication-adult-2026-04.pdf \
    src/lib/iv-medication-adult-data.json

The PDF remains authoritative. This script reconstructs layout columns, joins
visually verified page continuations, and records the one source-visible Kcentra
alias row without inventing missing cells.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

import pymupdf

SOURCE_SHA256 = "5ac503951edeb244cb4461721b6213a1642cb79fa1803558cb1d61c90b50e44c"
CONTINUATION_PAGES = [10, 11, 15, 16, 17, 19, 20, 21, 23, 25, 26, 27, 28, 31, 33, 34]


def clean(value: str | None) -> str:
    if not value:
        return ""
    return re.sub(r"\s+", " ", value).strip()


def grace_available(name: str) -> bool:
    return "+" in name


def extract_medications(pdf_path: Path) -> tuple[list[dict], int]:
    doc = pymupdf.open(pdf_path)
    medications: list[dict] = []
    source_rows = 0

    for page_number in range(7, 36):
        page = doc[page_number - 1]
        found = page.find_tables().tables
        if len(found) != 1:
            raise RuntimeError(f"Expected one table on page {page_number}, found {len(found)}")
        rows = found[0].extract()

        continuation = None
        for row in rows[8:]:
            name = clean(row[0])
            if not name and any(clean(cell) for cell in row[1:]):
                continuation = row
                break
            if name:
                break
        if page_number in CONTINUATION_PAGES:
            if continuation is None or not medications:
                raise RuntimeError(f"Missing verified continuation on page {page_number}")
            prior = medications[-1]
            if clean(continuation[7]):
                prior["centralLineRequired"] = " ".join(
                    part for part in [prior["centralLineRequired"], clean(continuation[7])] if part
                )
            if clean(continuation[8]):
                prior["areasOfUse"] = " ".join(
                    part for part in [prior["areasOfUse"], clean(continuation[8])] if part
                )
            if clean(continuation[11]):
                prior["considerations"] = " ".join(
                    part for part in [prior["considerations"], clean(continuation[11])] if part
                )
            prior["pageEnd"] = page_number

        for row in rows[8:]:
            name = clean(row[0])
            if not name:
                continue
            source_rows += 1
            if name == "Kcentra (4 Factor PCC) +":
                if not medications or not medications[-1]["displayName"].startswith("Factor II,VII,IX,X"):
                    raise RuntimeError("Kcentra alias is not adjacent to the PCC source row")
                medications[-1].setdefault("aliases", []).append("Kcentra (4 Factor PCC)")
                medications[-1]["pageEnd"] = page_number
                medications[-1]["graceAvailable"] = True
                continue
            medications.append(
                {
                    "id": f"iv-med-{source_rows:03d}",
                    "displayName": name,
                    "aliases": [],
                    "graceAvailable": grace_available(name),
                    "routes": {
                        "ivp": clean(row[1]),
                        "ivpb": clean(row[3]),
                        "ci": clean(row[4]),
                    },
                    "centralLineRequired": clean(row[7]),
                    "areasOfUse": clean(row[8]),
                    "considerations": clean(row[11]),
                    "page": page_number,
                }
            )

    return medications, source_rows


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit("usage: extract-iv-medication-adult.py SOURCE.pdf OUTPUT.json")
    source = Path(sys.argv[1])
    output = Path(sys.argv[2])
    medications, source_rows = extract_medications(source)
    if source_rows != 230:
        raise RuntimeError(f"Expected 230 source-visible rows, found {source_rows}")
    if len(medications) != 229:
        raise RuntimeError(f"Expected 229 logical medications after Kcentra alias join, found {len(medications)}")

    model = {
        "source": {
            "id": "intravenous-medication-adult-2026-04",
            "title": "Intravenous Medication: Adult",
            "updated": "April 20, 2026",
            "pageCount": 37,
            "href": "/references/lbh-intravenous-medication-adult-2026-04.pdf",
            "sha256": SOURCE_SHA256,
            "authority": "LBH institutional protocol; medical-board and P&T reviewed/approved",
            "affectedViews": ["iv-medication"],
        },
        "referenceNumber": "15967",
        "nextReviewDate": "April 30, 2029",
        "sites": [
            "Grace Medical Center A Sinai Hospital Facility",
            "Sinai Hospital of Baltimore",
        ],
        "approvers": [
            "AMANDA SHROUT (VP PATIENT CARE SVCS AND CNO-SINAI AND GRACE)",
            "CHARLES ALBRECHT (VP - Chief Medical Officer)",
            "LISA POLINSKY (VP - Pharmacy and Respiratory)",
        ],
        "scope": "Medical Center Complex, Adult Inpatient and Adult Emergency Department population.",
        "purpose": "To provide guidance for administering intravenous (IV) medications to patients eighteen (18) years of age or older, with allowance for adaptation in extenuating circumstances.",
        "defaultContext": {"population": "adult", "site": "sinai-inpatient", "unit": "general-inpatient"},
        "sourceRowCount": source_rows,
        "continuationPages": CONTINUATION_PAGES,
        "medications": medications,
        "sourceAlerts": [
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
        ],
        "proceduralSedationAdult": [
            {
                "drug": "Midazolam",
                "dose": "Adult Age 18-60 years: 1 – 5 mg IV over 5 minutes; titrated in 1 mg per minute increments to a maximum total dose not to exceed 0.2 mg/Kg when used without an opioid. Adult Age > 60 years: 0.5 mg – 1.5 mg IV over 3 minutes titrated in 0.5 mg per minute to a maximum total dose of up to 0.1 mg/Kg when used without an opioid.",
                "onsetPeak": "Onset of Action: 30 seconds to 1 minute. Peak Effect: 3-5 minutes.",
                "duration": "15 – 80 minutes",
                "reversal": "Flumazenil",
                "sideEffects": "Produces anxiolytic, sedative, hypnotic, skeletal muscle relaxant and anticonvulsant effects. Capable of producing all levels of CNS depression from mild sedation to respiratory depression and coma. Anterograde amnesia occurs within 1-5 minutes. Respiratory depression in elderly or when combined with opioids. Hypotension when combined with opioids.",
                "page": 36,
            },
            {
                "drug": "Fentanyl",
                "dose": "Adult 18-60 years: 25 mcg IV over 1-2 minutes to a max of 1.5 mcg/Kg/hr. Adult Age > 60 years: 12.5 mcg IV over 1 – 2 minutes to a max of 50 mcg/hr.",
                "onsetPeak": "Onset of action: within 1 minute. Peak Effect: 1-3 minutes.",
                "duration": "30-60 minutes after a single dose of up to 100 mcg.",
                "reversal": "Naloxone",
                "sideEffects": "Respiratory depression increased combined with benzodiazepines. Minimal hypnotic action. Brady/tachy arrhythmias.",
                "page": 36,
                "pageEnd": 37,
            },
            {
                "drug": "Naloxone",
                "dose": "Adult: 0.2 mg IV every 2-3 minutes until respiratory rate greater than 8 returns.",
                "onsetPeak": "",
                "duration": "",
                "reversal": "",
                "sideEffects": "Pulmonary edema. May precipitate acute withdrawal.",
                "page": 37,
            },
            {
                "drug": "Flumazenil",
                "dose": "Adult: 0.2mg IV over 15 sec every minute to maximum dose of 1 mg.",
                "onsetPeak": "",
                "duration": "",
                "reversal": "",
                "sideEffects": "Increased risk of seizures.",
                "page": 37,
            },
        ],
        "pediatric": {
            "status": "awaiting-authoritative-source",
            "message": "Pediatric rules are intentionally blank pending a separate approved pediatric protocol.",
            "excludedSourcePages": [36, 37],
        },
    }
    output.write_text(json.dumps(model, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {output}: {source_rows} source rows, {len(medications)} logical medications")


if __name__ == "__main__":
    main()
