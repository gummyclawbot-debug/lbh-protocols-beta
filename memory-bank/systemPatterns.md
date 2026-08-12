# System patterns

## Current architecture
- Single-page Next.js App Router application.
- `PatientProvider` owns a shared patient profile and derived calculations.
- Navigation selects one of the calculator/reference views without separate routes.
- Pure calculation helpers are centralized in `src/lib/calculations.ts`.
- Clinical/reference datasets are currently static TypeScript exports in `src/lib/protocols-data.ts`.

## Safety patterns
- Keep pure formulas independently testable.
- Treat static protocol rows as versioned clinical content, not decorative UI copy.
- Characterization tests document current behavior but do not certify clinical correctness.
- New clinical content should eventually carry source, effective date, reviewer, and review status.
- Deployment identity is verified from Vercel provider state and local metadata before mutation.

## Change discipline
1. Write a failing focused test before production behavior changes.
2. Preserve unit names and threshold semantics explicitly.
3. Verify responsive UI separately from calculation correctness.
4. Deploy beta only; legacy cutover is a separate controlled project.
