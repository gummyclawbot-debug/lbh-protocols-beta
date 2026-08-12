<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# LBH Protocols Beta project protocol

## Resume / selective context
At every meaningful start, resume, compression, or model handoff:
1. Read `memory-bank/projectbrief.md`, `memory-bank/activeContext.md`, and `memory-bank/progress.md`.
2. Use `memory-bank/index.md` to load only task-relevant files.
3. Verify volatile claims against Git, tests, Vercel, or the live site; code and evidence outrank prose.
4. Before pausing, update `activeContext.md` with concise verified state and exact next actions. Update `progress.md` only if status changed.

## Clinical safety
- Current tests may characterize existing software behavior; they do not certify clinical correctness.
- Before changing any formula, unit, cutoff, medication row, conversion, restriction, or recommendation, follow `memory-bank/runbooks/clinical-validation.md`.
- Preserve source/protocol provenance and require focused tests plus human clinical review for clinical rule changes.
- Never store PHI, patient data, credentials, tokens, or cookies in Git or the Memory Bank.

## Deployment isolation
- This repository may deploy only to `lbh-protocols-beta` under `gummys-projects-8bf81988`.
- `https://lbh-protocols.vercel.app` is protected legacy. Never link, deploy, alias, promote, or replace it from this repository.
- Before any deployment mutation, follow `memory-bank/runbooks/beta-deployment.md` and verify `.vercel/project.json` reports `projectName: lbh-protocols-beta`.

## Engineering discipline
- Use test-driven development for behavior changes: failing focused test first, minimal implementation, full regression gates.
- Run lint, typecheck, tests, build, audit, secret scan, and independent review before shipping.
- Commit Memory Bank updates with the code state they describe.
