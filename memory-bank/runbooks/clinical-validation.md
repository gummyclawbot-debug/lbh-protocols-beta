# Runbook — clinical validation

## Scope
Use for any formula, unit, cutoff, medication row, conversion, restriction, pathway, or clinical recommendation change.

## Required sequence
1. Identify authoritative source document and version/effective date.
2. Record existing behavior with characterization tests.
3. Define intended behavior with a failing focused test, including units and boundaries.
4. Obtain/record qualified human clinical review for the proposed rule.
5. Implement the smallest change.
6. Run focused tests, full suite, TypeScript, lint, build, and UI smoke checks.
7. Update source/review metadata and Memory Bank.

## Minimum formula test matrix
- Typical male and female examples
- Exact cutoff boundaries
- Below/above cutoff values
- Invalid or zero inputs
- Weight-selection behavior (ABW/IBW/adjusted weight)
- Rounding midpoint and min/max caps
- Unit-label invariants

## Content-table invariants
- Stable unique medication/navigation identifiers where applicable
- No empty medication names, doses, thresholds, or reasons
- Expected category counts are characterization only; update deliberately with provenance
- High-alert or contraindication language must not be weakened without review

## Evidence labels
- `characterized`: current software behavior captured
- `source-reconciled`: checked against named authoritative material
- `clinically-reviewed`: approved by identified qualified reviewer
- `released-beta`: deployed to beta after technical gates
- `legacy-equivalent`: forbidden unless independently demonstrated and explicitly approved
