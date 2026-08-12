# Source record — LBH Do Not Crush List, January 2026

## Authority and publication
- Jarvis supplied this five-page hospital protocol as the next authoritative institutional source for the Do Not Crush tab.
- Per project authority rules, supplied LBH protocols are medical-board and Pharmacy & Therapeutics reviewed/approved for their stated scope/version.
- On 2026-08-12, Jarvis explicitly authorized public hosting of the unchanged PDF after being informed that the visible pages contain no PHI, signatures, staff contact details, or printed author identity, but the hidden PDF metadata contains an author name.
- The original is preserved byte-for-byte at `/references/lbh-do-not-crush-list-2026-01.pdf`. Future revisions must use a new versioned path rather than overwrite this artifact.

## Source identity
- Visible title/update line: `LBH DO NOT CRUSH LIST- Updated 01/2026`
- Visible appendix heading: `APPENDIX A: *Note- Tables contain formulary medications only*`
- Page count: 5
- Byte size: 208,396
- SHA-256: `402c62b6c53ee91bb83cbee19716fe88728291d1841a7574e20570767bf6a92e`
- PDF format: 1.7; letter-size pages; selectable text; no OCR required.
- Creation/modification timestamp in PDF metadata: 2026-01-29 11:36:36 -05:00.
- Hidden metadata discrepancy: PDF metadata title says `LBH DO NOT CRUSH LIST- Updated 05/2025`, while every visible page says `Updated 01/2026`. The visible document version governs the UI; the immutable source remains unchanged and the discrepancy is not silently normalized in the PDF.
- Hidden author metadata is preserved unchanged under Jarvis's explicit public-hosting authorization; the author name is not copied into application metadata because it is not a visible clinical document field.
- Two embedded page-5 links point to the source's HIV medication references.

## Inspection and extraction
- Every page was rendered at 2.5× resolution and visually reviewed, including headings, table boundaries, page continuations, notes, references, links, margins, and page furniture.
- PyMuPDF text, word geometry, and table extraction were compared with high-resolution page renders.
- Independent page-range inventories were requested for pages 1–2, page 3, and pages 4–5.
- Generated structured data is reproducible from saved page-table artifacts. A clean rebuild was byte-identical to `src/lib/do-not-crush-data.json` (SHA-256 `7410af0f509ea824b762a00da200771510ef06f7cd49b7cfecdab6f357905579`).

## Clinical structure and completeness
The approved source contains four tables and 100 logical medication rows:

1. `Medications that cannot be crushed/opened.` — 70 rows
2. `Can be crushed, but handling precaution required.` — 4 rows
3. `Can be Crushed, but taste may limit tolerability.` — 4 rows
4. `Can be Administered with Special Instructions` — 22 rows

- Table 1 spans pages 1–3.
- The lenalidomide/Revlimid administration comment begins at the bottom of page 1 and continues at the top of page 2. It is represented as one logical row with source traceability `pp. 1–2` and the complete warning: health care workers should avoid contact with capsule contents.
- No other medication row is split across pages.
- Table 4 begins on page 3 and continues through page 5.
- Source wording, capitalization, punctuation, spacing, units, apparent grammatical errors, and incomplete parenthesis in the Entresto comment are preserved rather than clinically normalized.
- Every row retains generic name, brand name, complete administration comment, and source page.

## Governing notes
Both page-5 source notes are preserved completely and rendered outside the medication tables:

- Diltiazem IR: the source records the ISMP/tertiary-source conflict, Teva labeling that the product can be crushed or chewed, removal from this list as of 2022, and the prohibition on splitting 30mg IR tablets in half.
- Tamsulosin: the source records pediatric acidic-food experience, lack of tube-administration studies, conditional G-tube administration if no therapeutic alternative exists, prohibition on small-bore tubes, and monitoring for postural hypotension, dizziness, and vertigo.

A note-only search returns one clearly labeled Table 1 source-context result with zero direct medication rows; governing text is never counted as a direct row match or duplicated across all four tables.

## High-risk qualifiers retained
Focused tests and browser checks pin representative high-risk language, including:
- morphine and oxycodone rapid-release/potentially fatal-dose warnings;
- dabigatran increased-exposure warning;
- teratogenic/contact warnings for lenalidomide, mycophenolate, finasteride, divalproex, raloxifene, temozolomide, and valganciclovir;
- closed-system/PPE, double-glove, and protective-gown requirements;
- pharmacy-compounded tacrolimus suspension instruction;
- tube-size restriction and monitoring for tamsulosin;
- scored-tablet/splitting exceptions and alternative formulations;
- exact water/food/liquid quantities and NG/G-tube instructions.

## References
The source has three numbered reference groups; group 1 contains two sub-citations. All four logical citations are preserved in the UI and labeled as citations rather than renumbered source references:
1(a). Immunodeficiency Clinic liquid-drug-formulations reference.
1(b). Zamora HIV medication crushing/opening-capsules reference (2017).
2. Institute for Safe Medication Practices, `Oral Dosage Forms That Should Not Be Crushed` (2020).
3. Uttaro, Zhao, and Schweighardt immediate-release-products article (2021; 25(5):364-71).

## Reconciliation with prior beta content
- Prior beta content was a generic 12-row placeholder with broad categories and unsupported summary reasons rather than a representation of this approved formulary list.
- The placeholder was removed rather than merged.
- Placeholder-only phrases such as `Dose dumping / toxicity risk`, `Follow label — some may mix with applesauce, not crush all`, and `Softgel special oils` are absent from the approved model.
- The source is formulary-limited; the UI preserves the exact qualifier and does not imply it is a universal or exhaustive non-formulary list.

## Source-to-UI/test mapping
- `src/lib/do-not-crush-data.json` — four tables, 100 rows, two governing notes, four references, source metadata.
- `src/lib/protocols-data.ts` — typed protocol export, row-precise search, note/table context separation, References registration.
- `src/components/calculator-views.tsx` — compact four-table index, collapsed tables, all-field search, source-page column, governing notes, references, mobile horizontal-scroll cue, direct approved-source link.
- `src/lib/do-not-crush-source.test.ts` — immutable PDF hash/size, metadata, table counts, row completeness, continuation join, high-risk language, notes, references, placeholder removal, search semantics.
- `src/lib/protocols-data.test.ts` — approved table/row counts, required fields, fatal-dose invariant.

## Local verification
- 40/40 full tests pass.
- Lint, TypeScript, production build, and `npm audit --omit=dev` pass; audit reports zero vulnerabilities.
- Secret/PHI heuristics and unsupported-placeholder scans return zero matches.
- Local hosted source returns HTTP 200, `application/pdf`, 208,396 bytes, and exact approved SHA-256.
- Desktop: four tables collapsed by default, source/search controls and notes readable, References has all three approved cards, zero document-level horizontal overflow, zero JavaScript console errors.
- Search checks: Revlimid returns one joined row with `pp. 1–2`; `small bore tubes` returns zero direct rows plus one source-context result; table-title search returns the correct table; `potentially fatal dose` returns morphine; no-result behavior is explicit.
- Initial independent UX review blocked release because literal substring matching made the natural abbreviated query `25ml water` miss the source phrase `25ml of water`. Search now requires every normalized query token while allowing intervening source words; both queries return exactly the Cenobamate/Xcopri row. Focused tests and narrow-browser checks pin this behavior without changing direct-row versus governing-context semantics.
- Mobile 390×844: zero document overflow; source link visible; swipe cue visible; 760px table contained within a 324px horizontal scroll region.

## Release state
- Released and production-verified on beta only.
- Public-hosting authorization confirmed.
- Fresh independent re-review after the search correction and citation-hierarchy correction returned PASS with no release blockers.
- Application commit: `ee0b802`.
- Vercel deployment: `dpl_D1VQciJovN43UfWmDWURvoXT8tUb` (`https://lbh-protocols-beta-mjh7bvb0r-gummys-projects-8bf81988.vercel.app`).
- Canonical beta browser/source-byte verification passed; protected legacy remained unchanged on `dpl_9B425JWD4PwPnxKM3sUQDPvfuXMa`.
