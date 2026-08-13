# Active context

Last verified: 2026-08-12 EDT
Evidence: Git/GitHub, Vercel CLI, live HTTP probes, local lint/build/audit

## Current objective
Keep the verified April 2024 IV-to-Enteral beta release stable and continue reconciling remaining clinical tabs one authoritative source at a time.

## Verified state
- Canonical clone: `/Users/gummyserver/Developer/jarvis/active/lbh-protocols-beta`
- Branch: `hardening/memory-bank-clinical-baseline`
- Baseline Git commit: `6a516ba`; local `main` matched `origin/main` before branching.
- Live beta and protected legacy both returned HTTP 200 before work began.
- Local Vercel metadata points to team project `lbh-protocols-beta`, not legacy.
- Compact Memory Bank, clinical-validation runbook, beta-only deployment runbook, and root resume protocol are installed.
- Next.js and `eslint-config-next` are upgraded to 16.3.0; Vitest 4.1.10 is installed.
- The theme hydration lint issue and unused import are repaired without changing clinical behavior.
- Sixteen characterization/invariant tests pass. They capture current software behavior and do not certify clinical correctness.
- Lint, TypeScript, production build, `npm audit`, diff checks, secret/PHI scans, and browser smoke tests pass.
- Independent review found no code, security, clinical-rule, deployment-isolation, or dependency blocker; its documentation findings were corrected before commit.
- No formula constant, cutoff, medication row, recommendation, or other clinical content changed.
- Baseline commit `a2cf97f` is pushed on `hardening/memory-bank-clinical-baseline`.
- Vercel deployment `dpl_AqwWengiSirqrAZMLGGfFJAaroFT` is Ready and aliased to `https://lbh-protocols-beta.vercel.app`.
- Canonical beta returned HTTP 200 and passed a production browser smoke test with no console errors.
- Protected legacy returned HTTP 200 and its deployment list shows no new deployment from this work.
- Jarvis stated that the hospital protocols he will upload are individually reviewed and approved by the hospital medical board and Pharmacy & Therapeutics Committee. Treat each supplied protocol as the authoritative institutional source for its stated scope/version.
- Jarvis wants original source documents hosted under a References area and linked from affected tabs so users can validate application content.
- Pilot source `Do Not Tube List 2024_Sinai.pdf` is preserved byte-for-byte at `/references/do-not-tube-list-2024-sinai.pdf` (SHA-256 `09cdb4b11a0d80e7ca326ed7901592750cd18632613a55d11a2b6660a7f85226`).
- One-page image-based appendix was visually reviewed at high resolution. All 14 numbered categories, seven medication subgroups, named examples, limits, blood exceptions, downtime exception, hand-delivery direction, policy pointer, and November 2024 update label are mapped to UI and tests.
- Previous beta list was not source-faithful; it was replaced rather than blended. Unsupported prior entries are documented in `sources/do-not-tube-2024-sinai.md` without implying they are safe.
- New References view and affected-tab source link expose the original approved PDF. Local HTTP retrieval is 200 and byte-identical.
- Twenty-three tests, lint, TypeScript, build, audit, browser search/UI smoke tests, and console checks pass before independent review.
- Vercel remote project preset was corrected from `Other` to `Next.js` on the verified `lbh-protocols-beta` project; `.vercel/project.json` still identifies only `lbh-protocols-beta`.
- Independent source-fidelity and engineering review passed with no pre-commit blockers.
- Verified commit `45fa6fa` was pushed and deployed only to `lbh-protocols-beta` as deployment `DsSetWgDviAFEbVDwnaRwCtyyw4H`; immutable URL is `https://lbh-protocols-beta-b096qt14o-gummys-projects-8bf81988.vercel.app`.
- Canonical beta and hosted PDF return HTTP 200. The live PDF is 153,387 bytes and SHA-256-identical to the approved source. Production browser review shows all 14 categories and zero console errors.
- Protected legacy remains HTTP 200 and its newest deployment is still eight days old; it received no deployment from this work.
- Jarvis reviewed the pilot, said it looks good, corrected `cevidipine` to `clevidipine`, and flagged excessive scrolling/blank space around TPN. Treat this as beta acceptance plus an explicit rendered-content correction.
- The immutable PDF remains unchanged. Structured data/tests now render `clevidipine (Cleviprex®)` and the source record documents the source-to-render correction.
- Do Not Tube medication groups now use non-stretching responsive columns; TPN no longer inherits a tall neighboring card. Categories 2–14 use a compact responsive grid to reduce scrolling.
- Verified correction commit `4de82ff` was pushed and deployed only to `lbh-protocols-beta` as deployment `6Mv7zEJ9EuuMYwAP22GjdaHYrgwf`; immutable URL is `https://lbh-protocols-beta-bkckengnn-gummys-projects-8bf81988.vercel.app`.
- Production verification confirms `clevidipine (Cleviprex®)` is present, `cevidipine (Cleviprex®)` is absent, TPN is a compact 46 px card, all 14 categories remain rendered, the console has zero errors, and the hosted PDF still matches the approved SHA-256/size.
- Protected legacy remains HTTP 200 with no deployment newer than eight days.
- The January 2026 Therapeutic Substitution PDF is user-designated authoritative, cleared for public hosting/no redaction, and preserved unchanged at `/references/lbh-therapeutic-substitution-list-2026-01-inhaler-go-live.pdf` (469,423 bytes; SHA-256 `51472c2ac457a625c3cac30684157376f48978b0fa8a6b13b911c60a70156360`).
- Every one of 20 pages was extracted, rendered, and visually reviewed; three independent page-range inventories covered pages 1–7, 8–14, and 15–20.
- Reconciliation yields 31 sections and 296 complete clinical rows after merging three page-continuation fragments and treating three potency labels as subgroup headings; visually merged vaginal-antifungal substitution applies to all ten orders.
- All identified governing notes, facility scopes, source-page locations, and source-visible anomalies are represented. No silent clinical correction was made.
- The prior six unsupported placeholder substitutions were replaced rather than merged.
- Local Therapeutic Substitution UI now provides all-source search, compact 31-section index, collapsed sections, dense tables, governing warnings, facility and page traceability, direct source link, and central References linkage.
- Initial independent review failed release on two blockers: the ACE-inhibitor warning omitted the explicit `if equivalent lisinopril doses exceed 40mg during T.sub.` trigger, and note matches were incorrectly counted/displayed as matches for every row in a section.
- Both blockers are corrected source-first. The ACE warning is restored verbatim and exact-tested. Search now distinguishes direct row matches from section-title/note context; browser verification reports U-500 as one direct row plus one context match, and PTSD/ACE note queries as zero direct rows plus one context match.
- A mobile horizontal-table swipe cue was added. The temporary normalized generator now reproduces the corrected 31-section/296-row JSON byte-for-byte.
- Corrected validation passes 32 tests, lint, TypeScript, production build, audit, diff checks, staged PDF/model integrity, browser search checks, and zero console errors.
- Fresh independent re-review returned PASS with no blockers and explicitly verified both prior blockers resolved, source/PDF integrity, References, search/UI behavior, security, and beta isolation.
- Verified commit `6836249` was pushed and deployed only to `lbh-protocols-beta` as `dpl_5TUrU1KKS6Qeewfxxycn9w41STSs`; canonical beta is `https://lbh-protocols-beta.vercel.app` and the team-scoped immutable URL is `https://lbh-protocols-beta-lsjguhk7e-gummys-projects-8bf81988.vercel.app` (Vercel SSO protected).
- Canonical production verification passes: app and public source return HTTP 200; PDF is `application/pdf`, 469,423 bytes, 20 pages, and exact SHA-256; U-500/PTSD/ACE/Trelegy searches match reviewed semantics; References shows both approved sources; no page overflow or console errors.
- Protected legacy deployment list is unchanged; its newest deployment remains eight days old.
- The January 2026 Do Not Crush PDF is user-designated authoritative and explicitly cleared for unchanged public hosting after disclosure of hidden author metadata. It is preserved at `/references/lbh-do-not-crush-list-2026-01.pdf` (208,396 bytes; SHA-256 `402c62b6c53ee91bb83cbee19716fe88728291d1841a7574e20570767bf6a92e`).
- Every one of five pages was extracted, rendered, and visually reviewed. The source contains four tables and 100 logical rows: 70 cannot-be-crushed/opened, 4 handling-precaution, 4 taste-limited, and 22 special-instruction rows.
- The lenalidomide row is correctly joined across pages 1–2; both complete page-5 governing notes and four references are modeled. Source-visible anomalies are preserved.
- The visible source says January 2026; hidden PDF title metadata still says May 2025. Visible version governs the UI and the immutable PDF remains unchanged.
- The generic 12-row placeholder was removed rather than merged. Local UI now provides all-field search, direct-row versus context semantics, compact collapsed source tables, complete administration comments, page traceability, governing notes, references, mobile swipe guidance, and direct source linkage.
- A clean extraction rebuild is byte-identical to the structured JSON. Full local gate passes 40 tests, lint, TypeScript, production build, zero-vulnerability audit, PDF/model integrity, security scans, desktop/mobile browser checks, References checks, and zero console errors.
- Initial independent UX review blocked shipment because `25ml water` did not match source text `25ml of water`. Token-aware all-field matching now returns exactly Cenobamate/Xcopri for both queries while retaining direct-row/context separation; the corrected full gate and real 390px browser matrix pass. Fresh independent UX re-review returned PASS with no release blockers.
- Verified application commit `ee0b802` was pushed and deployed only to `lbh-protocols-beta` as `dpl_D1VQciJovN43UfWmDWURvoXT8tUb`; immutable URL is `https://lbh-protocols-beta-mjh7bvb0r-gummys-projects-8bf81988.vercel.app` and canonical alias is `https://lbh-protocols-beta.vercel.app`.
- Canonical production verification passes the full DNC browser contract: both `25ml water` forms return one Cenobamate row, small-bore query remains context-only, Revlimid remains one pp. 1–2 row, citation labels are `1(a), 1(b), 2, 3`, all four tables default collapsed, References has three approved cards, document overflow is zero, and console errors are zero.
- The production PDF returns HTTP 200 `application/pdf`, 208,396 bytes, SHA-256 `402c62b6c53ee91bb83cbee19716fe88728291d1841a7574e20570767bf6a92e`, and is byte-identical to the approved upload.
- Protected legacy remained unchanged on deployment `dpl_9B425JWD4PwPnxKM3sUQDPvfuXMa` before and after the beta release.
- The April 2024 `Appendix A: Medications Approved for Pharmacist IV to Enteral Conversion` is user-designated current authoritative despite its visible 01/31/2025 expiration date and is explicitly cleared for unchanged public hosting after hidden author metadata disclosure.
- Its immutable source is preserved at `/references/lbh-iv-to-enteral-conversion-appendix-a-2024-04.pdf` (98,239 bytes; SHA-256 `e4396eb39eb1bbcfd935bdcb35b6b4f00b68dfd9520f843bce5a7429f0ca5932`). The one page was extracted, rendered at high resolution, and visually reviewed.
- All 17 source rows, five checked facilities, three governing notes, merged instructions, route-specific options, and qualifiers are modeled. Ten unsupported placeholder rows were replaced rather than merged.
- Jarvis approved rendering the source-visible Folic Acid text `1mg PO 24H` as `1mg PO Q24H`; the immutable PDF remains unchanged and provenance/tests disclose and pin the correction.
- Full validation passes 45 tests, lint, TypeScript, production build, zero-vulnerability audit, PDF/model integrity, local/production browser search/UI checks, and zero console errors.
- Two independent reviews returned PASS with no blockers against frozen index tree `e36a27851c7d30c6ad47f26a963e724970ad78e1`.
- Verified commit `3cac604` was pushed and deployed only to `lbh-protocols-beta` as deployment `8R76Yi53AYQLiESwqs2sBJW2jaJ2`; immutable URL is `https://lbh-protocols-beta-c4tmrw81a-gummys-projects-8bf81988.vercel.app` and canonical alias is `https://lbh-protocols-beta.vercel.app`.
- Canonical app/source return HTTP 200; the live PDF is `%PDF-`, `application/pdf`, 98,239 bytes, and exact SHA-256. Production confirms all 17 rows, corrected Folic Acid, MRSA→Clindamycin search, complete notes, visible expiration disclosure, and zero console errors.
- Protected legacy remains HTTP 200 with no new deployment; its newest deployment remains nine days old.
- The January 2026 `LifeBridge Health: Formulary Medications with Restrictions` source is user-designated current/authoritative and cleared for unchanged public hosting after hidden Author metadata disclosure.
- Its immutable source is preserved at `/references/lbh-formulary-medications-with-restrictions-2026-01.pdf` (19 pages, 389,334 bytes, SHA-256 `09eaebabb1e7f86af3e63da949547513471252225fb17b7bfa5a64ce602b8950`). All pages were extracted, rendered, and independently visually inventoried.
- The governed model contains 21 source-visible alphabetic sections and 109 entries. All nine cross-page entries are joined; empty J/K/Q sections, facility scopes, page traceability, governing note, thresholds, and policy referrals are preserved.
- Thirteen explicitly approved editorial corrections render only in the derived UI while the PDF remains unchanged. Nine substantive source alerts are disclosed, including Cefdinir’s unknown date and unresolved Epoprostenol, Caplacizumab, Nirsevimab, and Ravulizumab ambiguities.
- The prior eight unsupported Restrictions placeholders were replaced rather than blended. The beta UX provides token-based direct-row search, compact collapsed alphabetic sections, direct source linkage, correction provenance, and ambiguity disclosure.
- The initial frozen-candidate source review correctly blocked release because four ambiguities were absent from the alert UI and tests did not pin all joins/ledgers. The corrected candidate pins all nine joins, exact governing note, exact ordered 13-correction and nine-alert arrays, and the complete ordered dataset fingerprint.
- Fresh source-fidelity and engineering re-reviews returned PASS on exact tree `99ed76477e6ae7416a3826b5de5672af04fb0cb8`. Full validation passes 53 tests, lint, TypeScript, build, zero-vulnerability audit, browser checks, and PDF/model integrity.
- Verified application commit `edcd6d3` was pushed and deployed only to `lbh-protocols-beta` as `dpl_9axMbg4xgM14HvA9TeURUtaJmmtZ`; immutable URL is `https://lbh-protocols-beta-klfg5spe0-gummys-projects-8bf81988.vercel.app` and canonical alias is `https://lbh-protocols-beta.vercel.app`.
- Canonical production verification passes: app/PDF return HTTP 200; PDF is `%PDF-`, `application/pdf`, 389,334 bytes, and exact SHA-256; Cefdinir and `CrCl 30` searches match reviewed semantics; nine alerts/13 corrections render; no page overflow or console errors.
- Protected legacy remained HTTP 200 and its response bytes were identical before/after the beta deployment; it received no mutation from this release.
- Restrictions search now uses section navigation rather than row-only filtering for medication-like queries. Prefixes and exact medication names expand each complete matching alphabetic section; genuine medication-name tokens are visibly highlighted.
- The interaction truthfully distinguishes absent medication-like text from source matches: `pra` and absent `prazosin` open the complete six-entry P section without false highlights, while `pert` highlights both governed Pertuzumab names.
- Clinical criteria search remains available: single-word `pediatric` returns 14 direct restriction matches across nine complete sections, while multi-word criteria such as `CrCl 30` retain truthful counts and complete-section expansion. Exact punctuated names such as `Ceftazidime-Avibactam` match correctly.
- Blank input restores all 21 sections/109 entries; punctuation-only input renders an explicit zero-result state. Filtered disclosures reliably reopen when the query changes, and result status uses `aria-live="polite"`.
- The final interaction candidate passed 54 tests, lint, TypeScript, production build, zero-vulnerability audit, browser/mobile accessibility probes, and two independent PASS reviews on tree `9b72ecaf78eae3460f6681725e0693d5d090365e`.
- Verified commit `9c344f9` was pushed and deployed only to `lbh-protocols-beta` as `dpl_2LJev8cWmbn8ZkfPmcFhpXe9W9rg`; canonical production search behavior, exact source PDF integrity, zero overflow, and zero console errors all passed. Protected legacy remained HTTP 200 and byte-identical before/after.
- Restrictions tab source context was reordered at user request: search remains first, followed by the complete alphabetic medication list/search results and provenance disclosures; the title/January 2026 description and complete governing source note now appear exactly once at the bottom.
- Exact wording and all nine alerts/13 corrections remain unchanged. The layout passed 55 tests, full engineering gates, desktop/mobile browser checks, and two independent PASS reviews on tree `9de1a3514f346906c1e203d2a30431d2e1e38a41`.
- Verified commit `7d6663a` deployed only to beta as `dpl_7ATU9rYpuw8xV7c2Evmcxpj6n3c9`; canonical order and `pert` full-section highlighting passed with no overflow or console errors. Protected legacy remained byte-identical.
- Global `Clear All` now resets the shared patient profile to established defaults and remounts the active calculator parameter boundary, clearing all user-entered active-view state: Restrictions/Therapeutic Substitution/IV-to-Enteral/Do Not Tube/Do Not Crush searches, Dose Rounding medication+dose, and Insulin TDD. Derived results, highlights, filters, and disclosure state reset with their inputs; navigation remains selected.
- The exact reset tree `833ed9ee312b64ae3c3a88ff2f0d502835d5957d` passed 57 tests, full engineering gates, zero-vulnerability audit, browser matrices, and two independent PASS reviews. No clinical formulas, protocol data, governed source rows, alerts/corrections, or PDFs changed.
- Verified commit `d55ecbc` deployed only to beta as `dpl_14YLQrX43KfjWcQSBbVb1YJsxQut`; canonical Clear All interactions passed across patient fields, Restrictions, Dose Rounding, and Insulin with no overflow or console errors. Protected legacy remained byte-identical.
- User corrected the patient reset contract: age, height, weight, and SCr must be blank—not restored to demo defaults—both on first landing and after `Clear All`. This supersedes the prior numeric-default behavior.
- Patient numeric fields are now nullable; incomplete profiles produce unavailable (`—`) derived values, while complete valid profiles preserve the established formulas/results exactly. Active-view searches/calculator parameters continue to reset through the central reset generation.
- Exact corrected tree `09779efa282fcf71437af29c1d534b1f463a416a` passed 58 tests, full gates, canonical blank→entered→blank browser verification, and two independent PASS reviews. Verified commit `60718e4` deployed only to beta as `dpl_HwhjVjk3LG1DuEsd52hk6pm5QMaY`; protected legacy remained byte-identical.

## Exact next actions
1. Commit and push this evidence-only Memory Bank handoff.
2. Await the next authoritative clinical source and ingest only one protocol at a time.

## Hazards
- Never link, deploy, alias, or promote against `lbh-protocols` legacy.
- Do not infer clinical correctness from current source code; tests initially capture behavior, not approval.
- Do not alter formula constants, cutoffs, medication rows, or recommendation text without source review and focused tests.
- Never store OIDC tokens, credentials, patient data, or PHI in Git or the Memory Bank.
- Code, Git, provider state, tests, and live probes outrank this summary.
