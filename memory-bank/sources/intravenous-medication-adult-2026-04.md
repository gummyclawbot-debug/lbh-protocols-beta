# Intravenous Medication: Adult — April 2026

## Source authority

- **Status:** Approved for clinical ingestion and unchanged public hosting by Jarvis on 2026-08-14.
- **Authority statement:** LBH institutional protocol; medical-board and Pharmacy & Therapeutics reviewed/approved.
- **Reference number:** 15967
- **Updated:** April 20, 2026
- **Next review:** April 30, 2029
- **Sites printed in source:** Grace Medical Center A Sinai Hospital Facility; Sinai Hospital of Baltimore
- **Population/scope:** Adult inpatient and adult Emergency Department; patients 18 years or older.
- **Pages:** 37

## Immutable originals

- Cache upload used for ingestion: `/Users/gummyserver/.hermes/cache/documents/doc_934e6ebaf792_(40204_3) Intravenous Medication_ Adult.pdf`
- Duplicate uploads were byte-identical and are not separate protocol parts.
- Public unchanged source: `public/references/lbh-intravenous-medication-adult-2026-04.pdf`
- Bytes: `467957`
- SHA-256: `5ac503951edeb244cb4461721b6213a1642cb79fa1803558cb1d61c90b50e44c`
- Public hosting is explicitly approved without redacting printed approver names.

## Extraction inventory

- Appendix A: pages 7–35.
- Source-visible Appendix A medication rows: **230**.
- Logical searchable medications: **229** after joining the otherwise blank `Kcentra (4 Factor PCC) +` source row as an alias of the immediately preceding Factor II,VII,IX,X PCC row. The source row is still counted and page-traced.
- Visually verified cross-page continuation pages: `10, 11, 15, 16, 17, 19, 20, 21, 23, 25, 26, 27, 28, 31, 33, 34`.
- Appendix B adult procedural-sedation rows retained in a separate source-faithful section: Midazolam, Fentanyl, Naloxone, Flumazenil.
- Pediatric rules are intentionally not implemented. The Pediatric mode is visibly blank until a separate authoritative pediatric protocol is supplied, per Jarvis's direction.

## Reproducible extraction

```bash
uv run --with pymupdf python scripts/extract-iv-medication-adult.py \
  public/references/lbh-intravenous-medication-adult-2026-04.pdf \
  src/lib/iv-medication-adult-data.json
```

- Checked-in structured model: `src/lib/iv-medication-adult-data.json`
- Full model file SHA-256: `8cb4f6c5108831a887f3a439530e6c173be02caab953d37f6eff69c7bdc233ee`
- Canonical `medications` array SHA-256: `00b9f8e1495792d53d7e885d8ac875e7c790e138465a1519055fb8d35fe82d77`
- Canonical `proceduralSedationAdult` array SHA-256: `00ebec66b341736f1ab48697bc5597ab1a30938f715ed0f34023502913eef2a6`
- A clean rerun of the extractor must produce a byte-identical JSON file.

## Unit model and inheritance

The UI defaults to **Adult → Sinai Inpatient → Other Sinai inpatient unit (General)**.

Source page 3 defines these permissions:

- **General (G):** available to all nursing units.
- **Monitored (M):** may administer General and Monitored medications.
- **Critical Care (CC):** may administer General, Monitored, and Critical Care medications.
- **Procedural (P):** may administer General and Procedural medications.
- **Cath Lab:** printed under both CC and P; the implementation preserves the union `G + M + CC + P` and visibly labels the dual listing.
- **Emergency (E):** emergent administration only with MP present, crash cart available, and bedside monitor used.

The selector preserves every named page-3 unit/location. The `+` symbol is displayed as Grace availability information, not as a permission category.

## UX interpretation approved by Jarvis

- Simple, drug-first search by generic or brand/alias.
- Adult is the default population.
- Pediatric is a visible toggle with no rules until a separate approved pediatric source is provided.
- Sinai Inpatient is the default site context.
- Results show IV Push, IV Piggyback, and Continuous Infusion separately.
- Each route uses a source-backed status: Allowed, Conditional, Emergency only, Not permitted for selected unit, or Not listed.
- Only simple shared `G/M/CC/P/E` scopes or explicit source-reviewed route mappings may produce an Allowed/Not permitted result. Complex free-form area prose fails closed to Conditional rather than being inferred.
- Provider/indication restrictions remain independent from unit permission. Propofol IV push is Conditional for every unit because its source qualifier limits the administering provider rather than naming a permitted unit scope.
- Product-specific wording remains product-specific: Activase route markers are never reused for a Cathflo search. A query containing both product names does not select either product-specific override and remains Conditional against the combined source row.
- Central-line requirement, exact Areas of Use, exact Monitoring and Other Considerations, source page, and Grace availability remain visible.
- Conditional/conflicting source wording is displayed rather than clinically repaired.

## Preserved source alerts

The app carries a governed source-alert list for:

1. Amphotericin B undefined higher concentration.
2. Calcium chloride cross-page clause boundaries.
3. Chlorpromazinee route-marker/prose mismatch.
4. Kcentra alias row with otherwise blank cells.
5. Levofloxacin IVPB marker versus IV Push prose.
6. Naloxone timing wording.
7. Page-28 anomalous rate units.
8. Potassium contradictions and stray punctuation.
9. `IVI` wording spanning pages 32–33.
10. Terlipressin route-marker/administration mismatch.
11. Pediatric content printed inside the adult policy but excluded from pediatric implementation.
12. Fentanyl adult maximum printed as `1.5 mcg/Kg/hr` in bolus-dose context.
13. Naloxone maximum/repeat lines printed after the Pediatric subsection without a new Adult/shared label; these lines are not assigned to the adult dose.

No source typo, route conflict, unit, concentration, dose, symbol, caveat, or punctuation was silently corrected.

## Traceability

| Source | Data/UI | Test |
|---|---|---|
| PDF bytes and 37-page metadata | Public unchanged PDF + protocol metadata | `src/lib/iv-medication-adult-source.test.ts` PDF hash/page/source assertions |
| Appendix A pages 7–35 | `iv-medication-adult-data.json.medications` | Exact row counts, exact 16-page continuation→medication map, canonical medication-array digest |
| Page-3 units and hierarchy | `IV_MEDICATION_UNITS` and route resolver | Unit inheritance assertions for G, M, CC, P, Cath Lab |
| Route markers / areas / caveats | IVP, IVPB, CI cards and source fields | Closed route-scope audit; exact source-reviewed override digest `e9a51600…`; exact query-override digest `63221779…`; exact 6,412-row medication×unit outcome oracle digest `beedc223…`; Cathflo/Activase, Propofol-provider, and focused restriction tests |
| Appendix B adult rows | Adult procedural-sedation details section | Exact Adult row names, exact Naloxone Adult dose boundary, canonical full-array digest, and closed ambiguity inventory |
| Pediatric exclusion decision | Blank Pediatric mode without Adult metadata | Source-model assertion plus rendered Adult/Pediatric isolation test |
| Public approved source | IV Medication tab + References entry | UI source-contract test and browser link verification |

## Governed files

- `public/references/lbh-intravenous-medication-adult-2026-04.pdf`
- `scripts/extract-iv-medication-adult.py`
- `src/lib/iv-medication-adult-data.json`
- `src/lib/protocols-data.ts`
- `src/lib/iv-medication-adult-source.test.ts`
- `src/components/calculator-views.tsx`
- `src/components/iv-medication-view.test.ts`
- `src/types/patient.ts`
