# LBH Protocols Beta

Modern rebuild of **MedCalc Streamline – LBH Pharmacy Protocols**.

## Stack
- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 + shadcn/ui
- next-themes (dark/light)
- framer-motion micro-animations

## Features
- Shared patient profile (sex, age, height, weight, SCr)
- CrCl / BMI, dose rounding, renal dosing, therapeutic sub, CRRT
- IV→PO, formulary restrictions, insulin switch, HE pathway
- HIV formulary, Do Not Tube, Do Not Crush

## Develop
```bash
npm install
npm run dev
```

## Production
```bash
npm run build && npm start
```

Educational / institutional reference only. Follow LBH policy.
