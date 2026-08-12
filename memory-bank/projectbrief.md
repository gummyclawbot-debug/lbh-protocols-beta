# LBH Protocols Beta — project brief

## Purpose
Modernize the LBH pharmacy protocol toolkit while preserving clinical behavior, formulas, units, validation rules, source provenance, and edge cases.

## Product boundary
- **Beta / development:** https://lbh-protocols-beta.vercel.app
- **Protected legacy:** https://lbh-protocols.vercel.app
- Beta is a testing and modernization surface. It is not clinically equivalent to legacy merely because it looks similar.
- Never promote beta over legacy without explicit user approval, independent clinical verification, a known-good backup, and a tested rollback path.

## Users and use
Hospital pharmacy staff use the toolkit as institutional reference and calculation support. It is not a substitute for authoritative LBH policy, clinical judgment, or independent verification.

## Source authority
- Hospital protocol documents supplied by Jarvis are the authoritative institutional source for the clinical content they govern because they have completed the hospital's medical-board and Pharmacy & Therapeutics review/approval process.
- Preserve the original approved document without semantic alteration and expose it through the application's References area so users can validate rendered content against the source.
- The application is a faithful presentation/implementation layer. If code, prior beta content, secondary literature, or memory conflicts with an uploaded approved protocol, stop and reconcile to the approved protocol rather than silently combining sources.
- Record the document title, protocol identifier, revision/effective date, approval/review metadata shown in the file, superseded version if known, file hash, and exact tab/section/rule mappings.
- This authority applies only to the scope and version of the supplied document. Never infer approval for content absent from it.

## Current scope
- Shared patient profile: sex, age, height, weight, serum creatinine
- CrCl/BMI/IBW/adjusted weight
- Dose rounding
- Renal dosing
- Therapeutic substitution
- CRRT dosing
- IV-to-PO conversion
- Formulary restrictions
- Insulin switching
- Hepatic encephalopathy pathway
- HIV formulary
- Do Not Tube / Do Not Crush references

## Success criteria
1. Existing behavior is protected by characterization tests before modification.
2. Every clinical rule has traceable source/protocol provenance and review status.
3. Formula, threshold, unit, and data changes receive focused tests and human clinical review.
4. Beta deployment remains isolated from protected legacy.
5. A fresh agent can resume from the compact Memory Bank without relying on recalled chat context.
6. Every implemented protocol section is traceable to the exact source page/section and users can open the preserved original from References.
7. No source content is omitted silently: exclusions, duplicates, ambiguities, illegible text, and non-applicable administrative material are documented explicitly for user review.
