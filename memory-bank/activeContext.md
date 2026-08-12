# Active context

Last verified: 2026-08-11 EDT
Evidence: Git/GitHub, Vercel CLI, live HTTP probes, local lint/build/audit

## Current objective
Ship and verify the completed continuation baseline to beta without changing clinical rules or touching protected legacy.

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

## Exact next actions
1. Commit and push `hardening/memory-bank-clinical-baseline`.
2. Deploy explicitly to `lbh-protocols-beta` and verify the deployment URL plus canonical beta alias.
3. Confirm protected legacy still returns HTTP 200 and was not redeployed.
4. Record commit/deployment evidence here and in `progress.md`.
5. Next clinical work must begin by mapping authoritative protocol sources and review ownership; characterization tests alone are not approval.

## Hazards
- Never link, deploy, alias, or promote against `lbh-protocols` legacy.
- Do not infer clinical correctness from current source code; tests initially capture behavior, not approval.
- Do not alter formula constants, cutoffs, medication rows, or recommendation text without source review and focused tests.
- Never store OIDC tokens, credentials, patient data, or PHI in Git or the Memory Bank.
- Code, Git, provider state, tests, and live probes outrank this summary.
