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
- First authoritative-source pilot for the November 2024 Do Not Tube appendix is released on beta and awaiting Jarvis acceptance.

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
