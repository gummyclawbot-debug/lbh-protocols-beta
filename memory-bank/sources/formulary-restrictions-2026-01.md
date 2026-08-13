# Source record — LBH Formulary Medications with Restrictions, January 2026

## Authority and publication
- Jarvis supplied this document and designated it as the current authoritative institutional source for its stated January 2026 scope/version.
- Jarvis stated LBH protocols supplied for this beta have hospital medical-board and Pharmacy & Therapeutics Committee approval.
- On August 12, 2026, Jarvis approved unchanged public hosting after disclosure of hidden Author metadata `Aditi Hoffman`.
- The immutable original is published at `/references/lbh-formulary-medications-with-restrictions-2026-01.pdf`.

## Immutable artifact
- Visible title: `LifeBridge Health: Formulary Medications with Restrictions`
- Visible version: `Document Last Updated: 01/2026`
- Pages: 19
- Bytes: 389,334
- SHA-256: `09eaebabb1e7f86af3e63da949547513471252225fb17b7bfa5a64ce602b8950`
- PDF format: 1.7
- Hidden Author metadata: `Aditi Hoffman`
- Hidden creator/producer: `Microsoft® Word for Microsoft 365`
- Hidden creation/modification timestamp: `2026-01-15 10:37:47 -05:00`

## Review method
- Extracted selectable text from every page.
- Rendered all 19 pages at high resolution.
- Three independent page-range inventories visually inspected pages 1–7, 8–13, and 14–19 against extracted text.
- Reconciled 21 alphabetic sections (`A` through `T`, plus `U-Z`) and 109 logical medication entries.
- Empty J, K, and Q sections are source-visible and intentional in the model.
- Joined page-spanning entries rather than treating continuation fragments as new rows.

## Governing source note
The source states that it will be updated after formulary additions or restriction changes, delays may occur, CPOE order alerts should be consulted when available, and a restriction date is the date approved by LFRC. The application must preserve this warning prominently.

## Approved correction policy
On August 12, 2026, Jarvis authorized the application to fix source-visible issues “as you see fit.” This authorization is implemented conservatively:
- Correct only obvious spelling, grammar, capitalization, unit-spacing, or stray-character defects where meaning is unambiguous.
- Preserve thresholds, dates, medication/brand relationships, facility scope, ordering authority, indications, exclusions, durations, and other clinically substantive wording unless separately approved.
- Keep the original PDF byte-identical.
- Record every source-to-render editorial correction in structured data and disclose the correction ledger in the UI/provenance.
- Flag substantive ambiguities rather than guessing.

### Approved editorial corrections for rendered text
The implementation ledger is authoritative; expected examples include:
- `Budensonide respules` → `Budesonide respules`
- `with parasite density is >1%` → `if parasite density is >1%`
- `PD-L1) inhibitory` → `PD-L1) inhibitor`
- `Anticipated blood loos` → `Anticipated blood loss`
- `Genitourinary urinary syndrome` → `Genitourinary syndrome`
- `failure to morphine` → `failure of morphine`
- `Acinetobacter baumi` → `Acinetobacter baumannii`
- `Adults patients` → `Adult patients`
- `achieving minimal of 4 bowel movements` → `achieving a minimum of 4 bowel movements`
- `Adult and Pediatrics` → `Adults and pediatric patients`
- `updated -07/2021` → `updated 07/2021`
- `crcl < 30ml/min⁷` → `CrCl < 30 mL/min` (remove unresolved superscript 7; no footnote 7 exists in the document)
- `criteria is met` → `criteria are met`

### Visual glyph fidelity
Some PDF text-layer extraction loses equality glyphs. The model follows visual page inspection where the rendered source visibly shows `≥`, including Caplacizumab age, Cariprazine age/prior failures, Levothyroxine NPO duration, and concentrated Morphine volume criteria. These are extraction reconciliations, not changes to the visible source.

## Substantive ambiguities preserved and flagged
- Cefdinir visibly says `Restriction date: ?`; do not invent a date.
- `Fosaprepitant IV (Cinvanti)` may be a drug/brand mismatch; preserve pending institutional clarification.
- Olaratumab remains listed despite external market-withdrawal history; preserve because this app renders the approved institutional source, but flag for institutional review.
- Ustekinumab’s IBD induction restriction says `oncology outpatient infusion center`; preserve that operational wording rather than guessing a different location/service.
- Epoprostenol’s heading scope includes SH/NW/CH while its restriction text names Sinai Hospital and NWH; preserve both.
- Caplacizumab provides `<10` and `>10 U/dL` instructions but not exactly `10 U/dL`; do not infer an equality rule.
- Nirsevimab’s sibling infant/maternal criteria do not explicitly state AND versus OR; preserve the source hierarchy.
- Ravulizumab’s ordering/outpatient-maintenance statement is visually nested under the aHUS criterion; preserve the source hierarchy and page traceability.
- Olaratumab, Remdesivir, Terlipressin, and Restricted Antibiotic Policy referrals depend on external or separately governed material not included in this PDF.

## Placeholder reconciliation
- The prior Restrictions tab contained eight unsupported generic placeholder cards with invented alternatives.
- Replace them entirely rather than blending them with the authoritative list.
- Removed placeholder wording must not be presented as approved LBH restriction guidance.

## Release requirements
- Source-fidelity tests must pin PDF bytes, metadata, section/row counts, cross-page joins, critical restrictions, correction ledger, alerts, search behavior, and References linkage.
- UI must distinguish direct medication-entry matches from source-note/alert context when applicable.
- Each entry must retain source page/page-range traceability.
- Release only to `lbh-protocols-beta`; never deploy, alias, or promote to protected legacy `lbh-protocols`.

## Release evidence
- Lifecycle: `released-beta`; human acceptance remains separate.
- Frozen reviewed tree: `99ed76477e6ae7416a3826b5de5672af04fb0cb8`.
- Application commit: `edcd6d36b90250a8ec0267dbc2fe201b54ddd529`.
- Vercel deployment: `dpl_9axMbg4xgM14HvA9TeURUtaJmmtZ` (`Ready`, target `production`, project `lbh-protocols-beta`).
- Canonical alias: `https://lbh-protocols-beta.vercel.app`.
- Immutable deployment URL: `https://lbh-protocols-beta-klfg5spe0-gummys-projects-8bf81988.vercel.app`.
- Final gates: 53/53 tests, lint, TypeScript, production build, zero-vulnerability audit, two independent corrected-candidate PASS reviews.
- Canonical production app and source PDF return HTTP 200. The source serves as `application/pdf`, begins `%PDF-`, and matches the approved 389,334-byte SHA-256 exactly.
- Production UI verified Cefdinir unknown-date and `CrCl 30` searches, nine source alerts, 13 correction disclosures, zero horizontal overflow, and zero console errors.
- Protected legacy remained HTTP 200 and byte-identical before/after; no legacy deployment, alias, or promotion occurred.

## Search interaction release — 2026-08-13
- Medication-like lookup expands complete alphabetic sections rather than displaying detached matching rows.
- Genuine medication-name word-prefix matches are highlighted; absent source medications are never fabricated or highlighted.
- `pra` and absent `prazosin` open complete P; `pert` highlights both source-backed Pertuzumab entries; exact punctuated `Ceftazidime-Avibactam` opens complete C and highlights the genuine name tokens.
- Single-word and multi-word restriction criteria remain truthful and expand complete containing sections. Punctuation-only input is an explicit no-result; blank input restores the full inventory.
- Reviewed tree: `9b72ecaf78eae3460f6681725e0693d5d090365e`; application commit: `9c344f9450ec667f7d65b6850b4ce5594269fb98`; deployment: `dpl_2LJev8cWmbn8ZkfPmcFhpXe9W9rg`.
- Canonical production and exact hosted PDF verification passed. Protected legacy remained byte-identical and received no mutation.
