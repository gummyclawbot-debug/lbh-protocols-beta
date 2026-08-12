# Runbook — beta deployment

## Absolute boundary
- Allowed target: `lbh-protocols-beta`
- Protected target: `lbh-protocols` — never link, deploy, alias, or promote from this repository

## Preflight
1. Confirm clean/intended Git diff and branch.
2. `git remote -v` must reference `gummyclawbot-debug/lbh-protocols-beta`.
3. Read `.vercel/project.json`; `projectName` must equal `lbh-protocols-beta`.
4. `vercel project inspect lbh-protocols-beta --scope gummys-projects-8bf81988` must resolve the beta project.
5. Confirm legacy currently responds, but perform no mutation against it.
6. Run lint, typecheck, tests, build, audit, secret scan, and independent review.

## Ship
1. Commit and push the feature branch.
2. Deploy from the canonical clone with explicit team scope: `vercel --prod --yes --scope gummys-projects-8bf81988`.
3. Inspect the returned deployment; require target `production`, status `Ready`, project name `lbh-protocols-beta`.
4. Probe `https://lbh-protocols-beta.vercel.app` and verify expected UI/version evidence.
5. Re-probe legacy and confirm it remains available and unchanged.

## Stop conditions
Stop immediately if local metadata, team, project name, alias, or deployment content does not match beta. Never "fix forward" by touching legacy.
