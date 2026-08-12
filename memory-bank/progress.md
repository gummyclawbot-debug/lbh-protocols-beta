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
- Do Not Tube pilot is accepted/released; January 2026 Therapeutic Substitution is implemented locally and in pre-release validation.

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
