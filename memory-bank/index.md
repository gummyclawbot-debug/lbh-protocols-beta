# Memory Bank index

## Compact resume set — read every meaningful start/resume
1. `projectbrief.md` — stable purpose and product boundary
2. `activeContext.md` — current verified state and exact next actions
3. `progress.md` — working, remaining, and milestones

## Selective reads
- Product/UX work: `productContext.md`
- Architecture/setup/dependencies: `systemPatterns.md`, `techContext.md`
- Deployment or recovery: `runbooks/beta-deployment.md`
- Formula/protocol changes: `runbooks/clinical-validation.md`
- Approved source records and traceability: `sources/`
- Current source records: `sources/do-not-tube-2024-sinai.md` and `sources/therapeutic-substitution-2026-01.md`
- Consequential decisions: matching file in `decisions/`

## Ownership
- Git/code/tests/live state outrank Memory Bank prose.
- This bank owns engineering continuity, not full chat history.
- Hermes sessions own raw conversation/tool history.
- Obsidian `Projects/LBH Protocols.md` owns portfolio identity and major product truth.
- Do not duplicate transient task chatter or secrets here.

## Update protocol
- Replace `activeContext.md` after meaningful sessions with concise verified truth.
- Update `progress.md` only when status changes.
- Add an ADR for consequential decisions; supersede rather than rewrite accepted ADRs.
- Re-read compact set after compression, model handoff, or long pause.
