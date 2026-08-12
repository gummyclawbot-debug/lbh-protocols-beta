# Active context

Last verified: 2026-08-11 EDT
Evidence: Git/GitHub, Vercel CLI, live HTTP probes, local lint/build/audit

## Current objective
Pilot the approved-protocol ingestion workflow one document at a time: preserve the original, inventory every page/section, build source-to-UI/test traceability, reconcile current beta content, implement without silent omission, and expose the original in References.

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

## Exact next actions
1. Receive one pilot protocol file from Jarvis, preferably the protocol for one existing tab.
2. Confirm it is cleared for public beta hosting and contains no PHI or restricted material.
3. Preserve/hash/extract and visually review every page, then produce the inventory, reconciliation report, and traceability matrix before coding.
4. Resolve ambiguities with Jarvis; then add failing boundary/content tests and implement the full approved content plus References entry.
5. Present completeness evidence for Jarvis acceptance, deploy only to beta, and verify all affected UI/source links.

## Hazards
- Never link, deploy, alias, or promote against `lbh-protocols` legacy.
- Do not infer clinical correctness from current source code; tests initially capture behavior, not approval.
- Do not alter formula constants, cutoffs, medication rows, or recommendation text without source review and focused tests.
- Never store OIDC tokens, credentials, patient data, or PHI in Git or the Memory Bank.
- Code, Git, provider state, tests, and live probes outrank this summary.
