# Active context

Last verified: 2026-08-11 EDT
Evidence: Git/GitHub, Vercel CLI, live HTTP probes, local lint/build/audit

## Current objective
Complete verification and beta-only release of the first approved-protocol pilot: Do Not Tube List, November 2024.

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

## Exact next actions
1. Finish independent review and correct any findings.
2. Commit/push the complete source, implementation, tests, and traceability evidence.
3. Deploy only to `lbh-protocols-beta`; verify Do Not Tube, search, References, PDF hash/link, and zero console errors.
4. Confirm protected legacy receives no deployment.
5. Present the pilot completeness/reconciliation evidence to Jarvis for `accepted-beta` confirmation.

## Hazards
- Never link, deploy, alias, or promote against `lbh-protocols` legacy.
- Do not infer clinical correctness from current source code; tests initially capture behavior, not approval.
- Do not alter formula constants, cutoffs, medication rows, or recommendation text without source review and focused tests.
- Never store OIDC tokens, credentials, patient data, or PHI in Git or the Memory Bank.
- Code, Git, provider state, tests, and live probes outrank this summary.
