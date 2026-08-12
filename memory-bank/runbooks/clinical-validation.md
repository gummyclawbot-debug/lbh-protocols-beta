# Runbook — clinical validation

## Scope
Use for any formula, unit, cutoff, medication row, conversion, restriction, pathway, or clinical recommendation change.

## Required sequence
1. Ingest one protocol at a time for the pilot. Preserve the original file and compute a cryptographic hash.
2. Inspect every page, including headers/footers, tables, appendices, footnotes, algorithms, approval blocks, revision history, definitions, exclusions, and references. Use OCR only when needed and visually verify OCR against the original.
3. Record the authoritative document title, protocol ID, revision/effective date, approval/review metadata visible in the file, superseded version if known, page count, and source hash. Do not invent missing metadata.
4. Create a page/section inventory and a source-to-UI traceability matrix mapping every formula, cutoff, table row, conversion, restriction, recommendation, warning, exception, and reference to its destination tab/component/test.
5. Compare the approved source against current beta content. Produce an explicit reconciliation report: exact matches, changes required, missing content, beta-only content unsupported by the source, ambiguities, duplicates, and illegible material.
6. Ask Jarvis to resolve substantive ambiguity or conflict before implementation. Never silently merge conflicting instructions.
7. Record existing behavior with characterization tests, then define approved intended behavior with failing focused tests including units and boundaries.
8. Implement the complete source-governed content in the correlating tab without silent omission. Administrative content that does not belong in the workflow still remains accessible in the preserved source and is listed in the reconciliation report.
9. Add the original approved document to the References area with title, version/effective date, approval status, affected tabs, and source link/download. Confirm Jarvis has authority to publish the file and that it contains no PHI, credentials, signatures/contact details that should not be public, or other restricted information.
10. Run focused tests, full suite, TypeScript, lint, build, source-link checks, reference-file integrity/hash checks, and UI/browser smoke checks.
11. Present a completeness checklist and source-to-UI traceability report to Jarvis for acceptance before beta release.
12. Deploy only to beta, verify every affected tab/reference link, and update source/review metadata plus Memory Bank.

## Completeness standard
- “No omission” means every clinically meaningful item is either implemented in the correlating workflow, preserved verbatim in an appropriate expandable/reference presentation, or explicitly listed as intentionally non-UI with a reason and source location.
- Never compress away warnings, exceptions, contraindications, qualifying language, footnotes, monitoring instructions, or escalation criteria.
- Preserve source terminology and units unless a transformed presentation is explicitly approved; document any normalization.
- Original source files are immutable versioned evidence. A new revision is added as a new version rather than overwriting history.
- Do not claim board/P&T approval beyond what Jarvis states and/or the document itself records; label provenance accurately.

## Minimum formula test matrix
- Typical male and female examples
- Exact cutoff boundaries
- Below/above cutoff values
- Invalid or zero inputs
- Weight-selection behavior (ABW/IBW/adjusted weight)
- Rounding midpoint and min/max caps
- Unit-label invariants

## Content-table invariants
- Stable unique medication/navigation identifiers where applicable
- No empty medication names, doses, thresholds, or reasons
- Expected category counts are characterization only; update deliberately with provenance
- High-alert or contraindication language must not be weakened without review

## Evidence labels
- `characterized`: current software behavior captured
- `source-reconciled`: checked against named authoritative material
- `clinically-reviewed`: approved by identified qualified reviewer
- `released-beta`: deployed to beta after technical gates
- `legacy-equivalent`: forbidden unless independently demonstrated and explicitly approved
- `institutional-source`: uploaded approved LBH protocol designated by Jarvis as authoritative for its stated scope/version
- `traceability-complete`: every source item is mapped to UI/test/reference or an explicit reviewed exclusion
- `accepted-beta`: Jarvis has reviewed the reconciliation/completeness report and approved the beta implementation
