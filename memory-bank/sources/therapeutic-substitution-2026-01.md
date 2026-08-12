# Therapeutic Substitution List — January 2026

## Authority and handling
- User-designated authoritative institutional source for the Therapeutic Substitution tab.
- User confirmed on 2026-08-11 that nothing requires redaction and directed public beta hosting plus central References linkage.
- Authority metadata supplied by the clinical owner: current LBH institutional protocol with medical-board and Pharmacy & Therapeutics Committee review/approval.
- Original upload preserved unchanged; application data is generated separately.

## Source identity
- Visible title: `LifeBridge Health Inpatient Pharmacy: Therapeutic Substitution List. Appendix A`
- Visible update metadata: `Last Updated 01/2026`
- Original upload: `/Users/gummyserver/.hermes/cache/documents/doc_73d63631d1ed_LBH Therapeutic Substitution List 1.2026 inhaler go live.pdf`
- Public immutable copy: `public/references/lbh-therapeutic-substitution-list-2026-01-inhaler-go-live.pdf`
- MIME: `application/pdf`
- Pages: `20`
- Bytes: `469423`
- SHA-256: `51472c2ac457a625c3cac30684157376f48978b0fa8a6b13b911c60a70156360`
- Public route: `/references/lbh-therapeutic-substitution-list-2026-01-inhaler-go-live.pdf`

## Extraction and visual review
- Every page was rendered at high resolution and visually inspected.
- Every page was text-extracted with PyMuPDF.
- Every tabular page was extracted with PyMuPDF table detection and reconciled to the rendered page.
- Three independent page-range reviews covered pages 1–7, 8–14, and 15–20.
- Page 1 is the 31-section contents page. Pages 2–20 contain substitution tables and governing notes.
- No visible page numbers, running footer, signatures, committee names, or additional revision metadata were invented.

## Complete section-to-page mapping
| # | Source section | Source pages | Logical rows |
|---:|---|---:|---:|
| 1 | Calcium Channel Blockers | 2 | 6 |
| 2 | Angiotensin Converting Enzyme Inhibitors | 2 | 8 |
| 3 | Angiotensin Receptor Blockers | 2–3 | 21 |
| 4 | Statins | 3–4 | 18 |
| 5 | Miscellaneous Hyperlipidemia agents | 4 | 3 |
| 6 | Anti-epileptics | 5 | 6 |
| 7 | Miscellaneous neurology agents | 5–6 | 7 |
| 8 | Sleep Agents | 6 | 10 |
| 9 | Selective Serotonin Reuptake Inhibitors | 6 | 3 |
| 10 | Antibiotics | 7 | 2 |
| 11 | Vaginal Antifungals | 7 | 10 |
| 12 | H2 Receptor Antagonist | 7–8 | 17 |
| 13 | Proton Pump Inhibitors | 8–9 | 19 |
| 14 | Miscellaneous GI agents | 9–10 | 27 |
| 15 | Insulin | 10–11 | 3 |
| 16 | Oral anti-diabetic agents | 11 | 5 |
| 17 | Erythropoiesis Stimulating Agents | 11–12 | 10 |
| 18 | Colony Stimulating Factors | 12 | 1 |
| 19 | Overactive bladder/ Bladder Dysfunction agents | 12 | 7 |
| 20 | Alpha-1 Blockers | 12–13 | 2 |
| 21 | Anti-histamines | 13 | 9 |
| 22 | Non-Steroidal Anti-Inflammatory Drugs | 13 | 4 |
| 23 | Vitamins & Supplements | 13–14 | 8 |
| 24 | Inhaled short acting beta agonists and inhaled steroids | 14–15 | 18 |
| 25 | Nasal Sprays | 15 | 6 |
| 26 | Topical Steroids | 16–17 | 17 |
| 27 | Otic drops | 17 | 4 |
| 28 | Ophthalmic Agents | 17–18 | 19 |
| 29 | HIV (Antiretroviral) Agents | 18–19 | 6 |
| 30 | Other Miscellaneous Agents | 19–20 | 12 |
| 31 | Substitutions Reserved for Drug Shortages | 20 | 8 |

## Row accounting and structural interpretation
- Table extraction yielded 302 row-like fragments after column headers were removed.
- Three fragments were continuations of clinical rows across page boundaries and were merged back into the preceding row:
  - Insulin U-500 instruction, pages 10–11.
  - Brinzolamide/brimonidine (Simbrinza®), pages 17–18.
  - Zubsolv dose mapping, pages 19–20.
- Three fragments were visual subgroup headings rather than medication rows: Low, Medium, and High Potency Agents in Topical Steroids.
- Final model: 296 complete clinical rows across 31 sections.
- The vaginal-antifungal table visually uses one merged Tioconazole substitute cell for all ten ordered rows. Extraction populated the cell only once; the structured model explicitly applies the same source substitute to each of the ten rows.

## Governing notes represented as first-class section warnings
- ACE-inhibitor source alert if equivalent lisinopril doses exceed 40mg during T.sub., including the home-medication tolerance review and MP decision language.
- LSH rivastigmine transdermal-patch home-medication exception.
- Pancrelipase frequency remains the same; Viokase 10 is not substituted.
- Apidra® in an insulin pump is not substituted.
- Insulin U-500 conversion is not automatic and requires discussion with MP; the source Facility cell is intentionally blank.
- ESA conversion applies to qualifying inpatients and must not be substituted for oncology patients.
- Prazosin for PTSD-associated nightmares may use the non-formulary template and home medication.
- Drug-shortage substitutions are explicitly scoped to shortages.

## Source-visible wording and anomalies
The application preserves source wording rather than silently correcting clinical or typographic anomalies. Examples include:
- `Desloratidine` as printed.
- `Ranitidine 50mg IV q \\8h` extraction/source mark retained pending clinical-owner correction.
- Apraclonidine `1\`%` source-visible mark retained.
- `Levobunonolol` / `Levobunolol` source variants retained.
- `sing-dose container` as visibly printed in otic rows retained.
- Calcium substitution’s unmatched `)` retained.
- Inconsistent `u-500`/`U-500`, `NovoLog®`/`Novolog®`, dose spacing, brands, arrow leaders, and schedule capitalization retained.
- Any future clinical-owner correction must be documented as an application correction while leaving the PDF unchanged.

## Previous tab reconciliation
- Previous tab contained six generic placeholder rows with no authoritative source traceability.
- The placeholder content was not merged with this document because unsupported rows could be mistaken for current LBH policy.
- It was replaced by the complete January 2026 source model.
- No other clinical tab was changed by this ingestion.

## Source-to-application mapping
- Structured source model: `src/lib/therapeutic-substitution-data.json`
- Typed model and search: `src/lib/protocols-data.ts`
- Tab UI and References rendering: `src/components/calculator-views.tsx`
- Source contract/integrity/search tests: `src/lib/therapeutic-substitution-source.test.ts`
- Dataset characterization: `src/lib/protocols-data.test.ts`
- Original source: `public/references/lbh-therapeutic-substitution-list-2026-01-inhaler-go-live.pdf`

## UI representation
- Search covers ordered medication, substitute, facility, section, governing notes, and topical potency subgroup while distinguishing direct row matches from section-title/note context.
- A compact 31-section index prevents a 296-row initial scroll wall.
- All sections are collapsed by default; matching sections open during search.
- Tables retain Medication Ordered, Substitute To, Facility, and source-page traceability.
- Multi-line dose mappings and ordered alternatives remain in their original source row.
- Every row and section remains reachable without search.
- Approved source is linked from the correlating tab and central References page.

## Independent-review correction history
- Initial review blocked release because the ACE-inhibitor note had been shortened to `MP alert:` and omitted the source's explicit trigger: `if equivalent lisinopril doses exceed 40mg during T.sub.`
- The complete source alert was restored verbatim and pinned by an exact test.
- Initial search logic concatenated section notes into every row, causing `U-500` to display/count all three Insulin rows. Search now filters rows only on row fields and reports section-title/note matches separately as context.
- Regression tests pin U-500 to one direct row and pin PTSD as a note-only section-context match.

## Completeness and intentional non-representation
- All 31 contents-page sections are represented.
- All 296 complete clinical rows are represented.
- All governing notes identified during extraction/visual review are represented.
- Facility scope is preserved, including the one intentionally blank source Facility cell.
- Source page location is represented per row.
- No clinically meaningful source content is intentionally omitted.
- Decorative table borders, whitespace, font choices, and pagination are not reproduced because they are non-clinical formatting; the unchanged PDF remains available for source appearance.

## Verified beta release
- Independent corrected re-review: PASS, no blockers.
- Commit: `6836249` (`[verified] feat: ingest January 2026 Therapeutic Substitution source`).
- Vercel deployment: `dpl_5TUrU1KKS6Qeewfxxycn9w41STSs`, Ready, project `lbh-protocols-beta`.
- Canonical beta: `https://lbh-protocols-beta.vercel.app`.
- Team-scoped immutable URL: `https://lbh-protocols-beta-lsjguhk7e-gummys-projects-8bf81988.vercel.app` (Vercel SSO protected; canonical alias is the public verification surface).
- Production source verification: HTTP 200, `application/pdf`, 469,423 bytes, 20 pages, SHA-256 `51472c2ac457a625c3cac30684157376f48978b0fa8a6b13b911c60a70156360`.
- Production UI verification: corrected U-500/PTSD/ACE context semantics, Trelegy direct match, both References cards, zero document-level horizontal overflow, and zero console errors.
- Protected `lbh-protocols` deployment list remained unchanged; no legacy deployment occurred.
