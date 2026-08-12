# Active context

Last verified: 2026-08-11 EDT
Evidence: Git/GitHub, Vercel CLI, live HTTP probes, local lint/build/audit

## Current objective
Begin the next planning phase from a tested, documented beta baseline. Before clinical-rule work, map authoritative protocol sources and human review ownership.

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

## Exact next actions
1. Inventory authoritative LBH protocol/source documents, versions, effective dates, and clinical owners without changing application rules.
2. Build a source-to-code traceability map for formulas, thresholds, medication tables, conversions, and recommendations.
3. Define human clinical review/approval and beta acceptance criteria.
4. Expand focused boundary/invalid-input tests before the first approved clinical behavior change.
5. Keep all development and deployments isolated to `lbh-protocols-beta` until an explicit independently verified cutover decision.

## Hazards
- Never link, deploy, alias, or promote against `lbh-protocols` legacy.
- Do not infer clinical correctness from current source code; tests initially capture behavior, not approval.
- Do not alter formula constants, cutoffs, medication rows, or recommendation text without source review and focused tests.
- Never store OIDC tokens, credentials, patient data, or PHI in Git or the Memory Bank.
- Code, Git, provider state, tests, and live probes outrank this summary.
