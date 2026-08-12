# Technical context

## Stack
- Next.js 16.3.0 App Router / Turbopack
- React 19.2.x / TypeScript 5
- Tailwind CSS 4 / shadcn-style components
- next-themes / Framer Motion
- Vercel project: `lbh-protocols-beta` under gummy's team

## Setup
```bash
npm ci
npm run dev
```

## Verification
```bash
npm run lint
npm run typecheck
npm test
npm run build
npm audit
```

## Deployment constraint
The canonical clone's ignored `.vercel/project.json` must report `projectName: lbh-protocols-beta` before any Vercel mutation. Use the beta deployment runbook. Never target legacy.

## Repository layout
- `src/lib/calculations.ts` — numeric formulas and dose rounding data
- `src/lib/protocols-data.ts` — reference tables and navigation
- `src/components/calculator-views.tsx` — tool rendering
- `src/components/patient-provider.tsx` — shared patient state
- `src/types/patient.ts` — patient/view types
- `memory-bank/` — engineering continuity

## Constraints
- `.env*` and `.vercel/` are ignored and must remain untracked.
- No PHI or credentials.
- Clinical data changes require provenance and characterization tests.
