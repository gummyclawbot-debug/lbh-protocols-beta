# Source record — Do Not Tube List 2024 (Sinai)

## Authority and identity
- **Status:** institutional-source
- **User designation:** current active protocol; hospital medical-board and Pharmacy & Therapeutics Committee reviewed/approved
- **Public hosting:** explicitly cleared by Jarvis; no redaction required
- **Displayed source title:** `Appendix A: Do Not Tube List`
- **Parent policy pointer:** `Refer to Policy Tech “Pneumatic Tube” Policy`
- **Displayed revision:** `Last Updated: Nov. 2024`
- **PDF container author:** Aditi Hoffman
- **PDF container creation/modification:** 2025-04-07 11:07:37 -04:00
- **Interpretation:** container date is technical file metadata, not represented as the clinical effective/revision date
- **Pages:** 1
- **Bytes:** 153,387
- **SHA-256:** `09cdb4b11a0d80e7ca326ed7901592750cd18632613a55d11a2b6660a7f85226`
- **Hosted path:** `/references/do-not-tube-list-2024-sinai.pdf`
- **Affected view:** `dnt`

## Extraction and visual verification
- The PDF is image-based. Ordinary text extraction returned only the added heading `Refer to Policy Tech “Pneumatic Tube” Policy`.
- The embedded appendix was rendered at 3× and medication content at 5× for direct visual transcription.
- Every numbered category, subgroup, example, warning, exception, limit, and footer was checked against the rendered page.
- Source spellings/punctuation preserved include `Novoseven`, `Lugols`, `Dakins`, and `epoetin products ex.:`.
- **Approved rendered correction (2026-08-11):** Jarvis identified the source-visible `cevidipine` as a typo and explicitly approved rendering the medication as `clevidipine (Cleviprex®)`. The immutable original PDF is unchanged, and this source-to-render correction is covered by the exact-array test.

## Source-to-UI/test traceability
| Source location | Approved content | UI destination | Test evidence |
|---|---|---|---|
| Heading | Appendix A: Do Not Tube List | Do Not Tube panel title; References title | metadata test |
| Intro | Items which cannot be sent via pneumatic tubing | Do Not Tube panel description | qualifier test |
| Item 1 qualifier | Not comprehensive; contact Pharmacy if unsure | Prominent warning above search | qualifier test |
| 1a | Protein based medications + 12 examples | Medications → protein-based card | exact-array test |
| 1b | Controlled substances/Narcotics + examples | Medications → controlled card | exact-array test |
| 1c | High-cost medications + 12 examples | Medications → high-cost card | exact-array test |
| 1d | TPN | Medications → TPN card | subgroup-title test |
| 1e | Patients own/personal medications | Medications → personal medications card | subgroup-title test |
| 1f | Reversal agents + examples | Medications → reversal card | exact-array test |
| 1g | Chemicals (Lugols, Dakins) | Medications → chemicals card | exact-array test |
| 2 | IV bags > one liter | Category 2 card | limit test |
| 3 | Glass bottles >100 mL and glass ampules | Category 3 card | limit test |
| 4 | Personal/food/non-authorized items | Category 4 card | category/order test |
| 5 | 2.5 lbs or 1 L max capacity | Category 5 card | limit test |
| 6 | Urgent/emergent blood exception and Transfusion Service discretion | Category 6 card | exception-language test |
| 7 | Unused contaminated blood | Category 7 card | category/order test |
| 8 | Spiked/transfused blood returned to Transfusion Service | Category 8 card | return-language test |
| 9 | Tissues | Category 9 card | category/order test |
| 10 | Original medical records | Category 10 card | category/order test |
| 11 | Contaminated/broken carriers | Category 11 card | category/order test |
| 12 | Medication order sheets; downtime exception | Category 12 card | exception test |
| 13 | CSF/Sterile fluids | Category 13 card | category/order test |
| 14 | COVID-19 specimens hand delivered to laboratory | Category 14 card | exact-language test |
| Footer | Last Updated: Nov. 2024 | Source link + References metadata | metadata test |
| Entire PDF | Approved original | Do Not Tube source link + References download | SHA-256 integrity test + HTTP/hash check |

## Reconciliation against previous beta
### Replaced
The previous 14-string beta list was not sourced from this approved appendix and omitted most approved content. It was replaced rather than blended.

### Previous beta-only items not present in this source
- Finasteride
- Dutasteride
- Chemotherapy agents (hazardous)
- Hormones (e.g., estradiol, testosterone products)
- Mycophenolate
- Tacrolimus
- Azathioprine
- Methotrexate
- Warfarin
- Thick suspensions that clog tubes
- Oils/sticky compounds
- Live vaccines as a standalone category (the source includes vaccines under protein-based medications)
- Packaging marked “Do not tube”

These were removed from the governed tab because this approved source does not support them. This does not assert that they are safe to tube; the source itself says the medication list is not comprehensive and instructs users to contact Pharmacy if unsure.

### Source material not represented as separate interactive rules
None. All clinically/operationally meaningful source content is represented in the Do Not Tube workflow. The full immutable page remains downloadable in References.

## Verification status
- `institutional-source`: yes
- `source-reconciled`: yes
- `traceability-complete`: yes
- `clinically-reviewed`: inherited from Jarvis’s designation of the current hospital-approved protocol; no additional committee metadata invented
- `accepted-beta`: yes — Jarvis reviewed the pilot on 2026-08-11 and said it looks good, with an approved `clevidipine` correction and compact-layout request
- `released-beta`: yes — initial deployment `DsSetWgDviAFEbVDwnaRwCtyyw4H`; accepted correction/layout deployment `6Mv7zEJ9EuuMYwAP22GjdaHYrgwf`, verified 2026-08-11 EDT
