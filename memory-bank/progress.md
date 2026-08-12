# Progress

## Working
- Next.js 16 / React 19 beta application with responsive dark/light UI.
- Shared patient profile, 13 clinical calculator/reference areas, and a source-document References area.
- Public beta is live at `lbh-protocols-beta.vercel.app`.
- Protected legacy remains separately live and intentionally outside the beta development path.
- GitHub source is available and canonical local clone is under `Developer/jarvis/active`.

## Completed baseline
- Cline-inspired, Hermes-compatible project Memory Bank and selective-loading index.
- Beta-only deployment and clinical-validation runbooks.
- Next.js 16.3.0 dependency hardening with zero audit findings.
- Clean lint, TypeScript, production build, and browser smoke test.
- Twenty-three clinical calculation, protocol-data, approved-source fidelity, completeness, and integrity tests.
- Independent pre-commit review; documentation freshness findings resolved.

## Current phase
- Do Not Tube, January 2026 Therapeutic Substitution, January 2026 Do Not Crush, and April 2024 IV-to-Enteral Appendix A are released and production-verified on beta.

## Remaining
- Reconcile the remaining clinical tabs with authoritative source/protocol provenance one document at a time.
- Add version/review metadata for clinical content.
- Expand boundary and invalid-input tests before changing behavior.
- Define human review and approval workflow.
- Define explicit beta acceptance, cutover, and rollback criteria.
- Identify/preserve authoritative legacy source if it becomes available.

## Milestones
- 2026-08-03: full modern beta rebuild (`1e7b7fb`).
- 2026-08-03: Vercel Next.js framework pin (`6a516ba`).
- 2026-08-09: canonical clone reconciled; duplicate preserved non-destructively.
- 2026-08-11: resumed active development; local Vercel pointer corrected to beta and hardening branch opened.
- 2026-08-11: hardening baseline committed as `a2cf97f`; 16 tests, lint, TypeScript, build, audit, independent review, and browser smoke checks passed.
- 2026-08-11: beta deployment `dpl_AqwWengiSirqrAZMLGGfFJAaroFT` reached Ready and canonical beta returned HTTP 200; protected legacy remained unchanged.
- 2026-08-11: ingested the current approved `Appendix A: Do Not Tube List` pilot. Preserved the public source PDF byte-for-byte, replaced the unsupported legacy beta list with all 14 approved categories and medication subgroups, added tab-level and References links, and established source-to-UI/test traceability.
- 2026-08-11: corrected the verified beta Vercel project framework preset from `Other` to `Next.js`; protected legacy was not targeted.
- 2026-08-11: independent review passed, verified commit `45fa6fa` shipped to beta deployment `DsSetWgDviAFEbVDwnaRwCtyyw4H`, canonical beta/PDF returned HTTP 200, live PDF hash matched, production UI/console checks passed, and protected legacy remained unchanged.
- 2026-08-11: Jarvis accepted the pilot with the approved `clevidipine` correction and compact-layout request. Verified commit `4de82ff` shipped only to beta deployment `6Mv7zEJ9EuuMYwAP22GjdaHYrgwf`; live TPN card measured 46 px, all 14 categories remained intact, the source PDF hash/size stayed unchanged, and protected legacy remained untouched.
- 2026-08-11: received the authoritative 20-page January 2026 Therapeutic Substitution source with public hosting/no-redaction clearance; preserved and visually reviewed every page, reconciled all 31 sections and 296 complete rows, replaced six unsupported placeholders, added compact all-source search/tables plus source-page and References traceability, and passed initial local engineering/browser/source-integrity checks. Independent review and beta-only release remain pending.
- 2026-08-11: initial independent Therapeutic Substitution review correctly blocked release because the ACE alert trigger was incomplete and note-only search inflated unrelated rows. Restored the exact `>40mg during T.sub.` trigger, separated direct row results from section context, added exact regression tests and a mobile table-scroll cue, and passed the corrected 32-test/full build/browser gate. Fresh re-review remains pending; nothing has shipped.
- 2026-08-11: fresh independent re-review passed with no blockers. Verified commit `6836249` deployed only to beta as `dpl_5TUrU1KKS6Qeewfxxycn9w41STSs`; canonical UI/search/References and exact hosted PDF integrity passed production verification, while protected legacy remained unchanged.
- 2026-08-12: received the authoritative five-page January 2026 Do Not Crush appendix and explicit unchanged-public-hosting clearance. Preserved/hash-verified the source, visually reviewed every page, reconciled four tables and 100 logical rows plus two governing notes/four references, replaced the unsupported 12-row placeholder, and passed the 40-test/full build/security/desktop/mobile/source-integrity gate. Independent review and beta-only release remain pending.
- 2026-08-12: independent UX review blocked the Do Not Crush release because literal search failed the natural `25ml water` query. Replaced literal phrase matching with all-token matching, pinned both `25ml water` and `25ml of water` to the single Cenobamate/Xcopri row, preserved note-context semantics, and passed the corrected full gate/browser matrix. Fresh re-review returned PASS with no release blockers; nothing has shipped yet.
- 2026-08-12: fresh independent clinical/citation, engineering/security/isolation, and corrected desktop/mobile UX re-reviews all returned PASS with no release blockers. The exact staged candidate is approved for beta-only commit/deployment; nothing has shipped yet.
- 2026-08-12: verified commit `ee0b802` deployed only to beta as `dpl_D1VQciJovN43UfWmDWURvoXT8tUb`. Canonical search/UI/citation/References checks and exact hosted-PDF integrity passed; protected legacy remained unchanged on `dpl_9B425JWD4PwPnxKM3sUQDPvfuXMa`.
- 2026-08-12: ingested the authoritative one-page April 2024 IV-to-Enteral Appendix A after explicit unchanged-public-hosting authorization and approval to render the source Folic Acid typo `1mg PO 24H` as `1mg PO Q24H`. Preserved the immutable PDF, replaced ten unsupported placeholders with all 17 source rows, retained five-site scope and all governing notes, added search/References/expiry/correction disclosure, passed 45 tests and full engineering/browser/integrity gates plus two independent PASS reviews, and deployed verified commit `3cac604` only to beta as `8R76Yi53AYQLiESwqs2sBJW2jaJ2`. Canonical UI and exact hosted PDF passed production verification; protected legacy remained unchanged.
