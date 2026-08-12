# Source record — LBH IV to Enteral Conversion Appendix A, April 2024

## Authority and publication
- Jarvis supplied this one-page appendix and designated it as the current authoritative institutional source for the IV-to-enteral beta workflow, despite the document-visible expiration date.
- Per project authority rules, supplied LBH protocols are medical-board and Pharmacy & Therapeutics reviewed/approved for their stated scope/version.
- On 2026-08-12, after disclosure of the visible expiration date and hidden author metadata, Jarvis explicitly authorized unchanged public hosting and implementation.
- The original is preserved byte-for-byte at `/references/lbh-iv-to-enteral-conversion-appendix-a-2024-04.pdf`. Future revisions must use a new versioned path.

## Source identity
- Parent title: `Pharmacy Dosing Service – Intravenous to Enteral Therapy Conversion Program`
- Appendix title: `Appendix A: Medications Approved for Pharmacist IV to Enteral Conversion`
- Department: Pharmacy
- Visible approver: Lisa Polinsky, AVP Pharmacy Services
- Original: 01/11/2022
- Updated: 04/02/2024
- Visible expiration date: 01/31/2025
- Page count: 1
- Byte size: 98,239
- SHA-256: `e4396eb39eb1bbcfd935bdcb35b6b4f00b68dfd9520f843bce5a7429f0ca5932`
- PDF 1.7, letter size, selectable text; no OCR required.
- Hidden PDF author metadata: `Aditi Hoffman`. It remains in the immutable artifact under Jarvis's explicit public-hosting authorization and is not copied into application source metadata.
- The visible `Document Owner` value is the placeholder `Name`; it is not treated as an identified owner.

## Scope
Checked sites:
1. Sinai Hospital of Baltimore
2. Northwest Hospital Center
3. Carroll Hospital Center
4. Levindale Hebrew Geriatric Center and Hospital
5. Grace Medical Center

Unchecked sites are not represented as approved scope.

## Inspection and completeness
- The page was extracted with PyMuPDF and rendered at 4× resolution.
- The render was visually inspected against the extraction, including the title/metadata block, checked and unchecked sites, table boundaries, merged cells, underline cues, all symbols, all 17 medication rows, three governing footnotes, and page footer.
- Dexamethasone, lacosamide, levetiracetam, and valproic-acid instructions visually span the IV and enteral columns; the structured model intentionally repeats the shared instruction in both fields so neither route column is left semantically blank.
- Pantoprazole retains its facility limitation, oral pantoprazole option, NG/G(PEG)-tube esomeprazole option, and J-tube lansoprazole option.
- Clindamycin retains its four-indication qualifier and source spelling `barbesiosis` without silent correction.
- Levothyroxine retains the half-dose rule and exact example.
- Valproic acid retains the oral-to-IV divided-frequency instruction and home-medication/Micromedex review direction.

## Approved rendered correction
- Immutable source text: `1mg PO 24H`
- Approved rendered text: `1mg PO Q24H`
- Approver/designation: Jarvis, clinical owner
- Approval date: 2026-08-12
- Scope: Folic Acid enteral dose in the IV-to-enteral beta presentation only
- The original PDF remains byte-identical. Tests pin the source SHA-256, require the corrected rendered value, and prohibit the source-visible typo in structured rows.

## Reconciliation with prior beta content
- The prior beta table had ten generic placeholder rows with unsourced ratios and criteria.
- Seven medication names overlapped partially, but the placeholder was not merged because its row structure and qualifiers did not faithfully represent this source.
- Unsupported placeholder-only acetaminophen and ondansetron rows were removed.
- All 17 approved source rows replace the prior table in source order.
- This source governs the medication/conversion appendix only. The parent policy's full inclusion/exclusion criteria were not supplied; the UI preserves the source instruction to consult procedure 3a/3b and does not invent eligibility criteria.

## Source-to-UI/test mapping
- `src/lib/iv-enteral-data.json` — exact ordered 17-row source model, scope, notes, metadata, and approved correction record.
- `src/lib/protocols-data.ts` — typed export, token-aware row-precise search, References registration.
- `src/components/calculator-views.tsx` — compact searchable table, mobile scroll cue, complete notes, site scope, visible expiration disclosure, correction disclosure, and direct source link.
- `src/lib/iv-enteral-source.test.ts` — source hash/size, metadata/scope, exact ordered rows, notes, approved correction, unsupported-placeholder removal, and search behavior.
- `src/lib/protocols-data.test.ts` — 17-row count and non-empty field invariants.

## Release state
- Implementation candidate only; release evidence is recorded after independent review and beta-only deployment verification.
