# Source record — Intravenous Medication: Pediatric (April 2026)

## Authority and publication clearance

- **Displayed title:** Intravenous Medication: Pediatric
- **Reference:** 18234
- **Institutional status supplied by Jarvis:** current approved Pediatric IV policy, provided for implementation on 2026-08-15
- **Displayed effective date:** April 22, 2026
- **Displayed next review date:** April 30, 2029
- **Displayed site:** Sinai Hospital of Baltimore
- **Governing app view:** IV Medication → Pediatric
- **Public-hosting authorization:** Jarvis supplied this artifact and explicitly directed implementation in the existing Adult-format IV Medication workflow, which includes an in-tab source link and centralized References publication. This task-specific direction is recorded as authorization to publish this exact artifact on the LBH beta. No authorization extends to the protected legacy deployment.
- **Redaction:** none requested. Visual and metadata inspection found approver names/roles but no signatures, patient information, credentials, private contact information, or hidden restricted attachments. The original contains the same `/this.print(true)` PDF print action as the approved Adult artifact; it contains no embedded files, forms, encryption, or other JavaScript.
- **Superseded source:** none designated.
- **Lifecycle:** `institutional-source` → `source-reconciled` → `traceability-complete`; clinical ownership/acceptance remains a human decision and is not inferred from tests.

## Immutable artifact

| Property | Value |
|---|---|
| Upload | `/Users/gummyserver/.hermes/cache/documents/doc_ef69e7cff9a4_IV policy pediatric.pdf` |
| Canonical public path | `public/references/lbh-intravenous-medication-pediatric-2026-04.pdf` |
| MIME/signature | PDF (`%PDF-`) |
| Pages | 32 |
| Bytes | 400,287 |
| SHA-256 | `be9b5065dfe2d18a5d1a3c32ee6d0dfc772eaff8eeb70a8ae549282f55805351` |
| PDF title metadata | `Intravenous Medication: Pediatric` |
| PDF author metadata | blank |
| PDF creation metadata | `D:20260326105936-04'00'` (container metadata only; not treated as clinical effective date) |
| PDF modification metadata | `D:20260517163210-04'00'` (container metadata only; not treated as clinical revision date) |

The upload and canonical copy were compared byte-for-byte and hash-identically. The canonical filename is immutable/versioned and does not overwrite the Adult source.

## Governing source inventory

### Pages 1–5 and 32

| Page | Source content | Structured/UI target | Test evidence |
|---|---|---|---|
| 1 | Identity, approvers, dates, reference, site, full scope, purpose | Pediatric protocol metadata, tab title/description, References | exact metadata/source tests |
| 2 | Responsibility; Mini-bag Plus, IVPB, and IVP definitions; policy ¶1–2 | Source disclosure and preserved PDF | source hash + alert inventory |
| 3 | Area hierarchy G/M/CC/P/E; Adult referral; transfer/non-designated-area escalation | Pediatric unit model and normalized route-scope matrix | unit hierarchy, stale-unit fail-closed, complete outcome oracle |
| 4 | Pump recommendation; hazardous-drug policy; documentation; collaboration; cross references | Preserved source PDF and traceability record | source hash/link tests |
| 5 | References, history, Appendix A designation | Preserved source PDF and provenance | source hash/link tests |
| 32 | Repeated identity/approval cover block | Preserved source PDF; no duplicate interactive row | page-count and source hash tests |

### Appendix A pages 6–31

The fixed source grid is extracted by visual column boundaries: medication name, IVP, IVPB, CI, Areas of Use, and Rate/Administration/Monitoring. Every non-empty route marker is normalized during ingestion into an explicit source-reviewed route-scope record; the app does not infer Pediatric Allowed states by searching free-form prose.

| Page | Rows beginning on page | First → last medication | Continuation handling |
|---|---:|---|---|
| 6 | 5 | Acetaminophen → Adenosine | Adenosine continues to p.7 |
| 7 | 7 | Albumin 5% → Aminophylline | joins only Adenosine area text from p.7 |
| 8 | 12 | Amiodarone → Bumetanide | none |
| 9 | 12 | Buprenorphine → Ceftriaxone | Ceftriaxone continues to p.10 |
| 10 | 9 | Ceftaroline → Conjugated estrogen | joins only Ceftriaxone consideration text from p.10 |
| 11 | 10 | Cosyntropin → Dexmedetomidine | Dexmedetomidine continues to p.12 |
| 12 | 9 | Dexrazoxane → Dobutamine | joins only Dexmedetomidine monitoring text from p.12 |
| 13 | 10 | Dopamine → Estrogens, conjugated | none |
| 14 | 11 | Etomidate → Flumazenil | none |
| 15 | 11 | Folic acid → Heparin sodium | none |
| 16 | 5 | Hydralazine → Indomethacin | none |
| 17 | 3 | Infliximab → Iron dextran | none |
| 18 | 8 | Iron sucrose → Levofloxacin | none |
| 19 | 6 | Levothyroxine → Magnesium sulfate | none |
| 20 | 10 | Mannitol → Metronidazole | none |
| 21 | 8 | Micafungin → Naloxone | none |
| 22 | 7 | Neostigmine → Ondansetron | none |
| 23 | 8 | Palonosetron → Phenobarbital | none |
| 24 | 5 | Phenylephrine → Potassium acetate | none |
| 25 | 1 | Potassium chloride | full-page single source row |
| 26 | 5 | Potassium phosphate → Propranolol | none |
| 27 | 8 | Protamine → Rituximab | Rituximab continues to p.28 |
| 28 | 5 | Rocuronium → Sodium bicarbonate | joins only Rituximab titration/monitoring text from p.28 |
| 29 | 7 | Sodium chloride 3% → Terbutaline | none |
| 30 | 10 | Thiamine → Vecuronium | none |
| 31 | 5 | Vedolizumab → Zoledronic Acid | none |

**Reconciled counts:** 197 source-visible rows, 197 logical medications, 293 marked medication-route combinations, four page-spanning entries, and 7,683 medication × route × unit resolver outcomes across 13 Pediatric unit/location choices.

## Source → code → UI → test traceability

| Source element | Data/code target | UI destination | Test evidence | Status |
|---|---|---|---|---|
| Immutable original | `public/references/lbh-intravenous-medication-pediatric-2026-04.pdf` | in-tab source link + References | bytes/hash/path test | implemented |
| Identity/scope/dates/reference/site | `IV_MEDICATION_PEDIATRIC_PROTOCOL` | Pediatric header metadata and References | exact metadata test + SSR isolation test | implemented |
| Appendix A six-column grid | `iv-medication-pediatric-data.json` | medication result cards | 197-row count + complete medication digest | implemented |
| IVP/IVPB/CI markers | `medications[].routes` | three route cards | every marked route required + outcome oracle | implemented |
| G/M/CC/P/E hierarchy | `IV_MEDICATION_PEDIATRIC_UNITS` | Pediatric unit selector | exact permission hierarchy | implemented |
| Route-specific complex areas | generated `medications[].routeScopes` + review fixture | Allowed/Conditional/Emergency/Not permitted states | no gaps + fixture parity + 7,683-outcome digest | implemented/fail-closed |
| Named-unit restrictions (NICU, OR, ED) | explicit normalized scopes | unit-specific route cards | representative restriction tests + full oracle | implemented |
| Activase/Cathflo combined row | product-query overrides + unresolved mixed result | product-specific route states | Activase/Cathflo/mixed-query tests | implemented/fail-closed |
| Provider/indication restrictions | conditional normalized scopes | amber Conditional cards with exact caveat below | provider/indication regression matrix + full oracle | implemented/fail-closed |
| Central-line language | exact source sentence extraction only when “required/recommended” appears | Central line panel | model digest + source phrase probes | implemented without inference |
| Areas and monitoring prose | exact extracted strings with source page/pageEnd | Areas/Monitoring panels | complete model digest + continuation criteria | implemented |
| Source anomalies/conflicts | closed `sourceAlerts` array | amber disclosure | exact-array alert test | implemented |
| Adult Appendix B | Adult model only | Adult mode only | Adult/Pediatric SSR isolation | explicitly excluded from Pediatric |

## Reconciliation against existing Adult implementation

- Pediatric is a separate dataset, source record, source PDF, unit hierarchy, route-scope matrix, default context, source-alert set, and References entry.
- Adult rows, aliases, Grace markers, unit IDs, route overrides, source hash, source link, and Appendix B remain unchanged.
- Switching population clears search text and selects the target population’s governed default unit, preventing stale Adult unit IDs from entering Pediatric lookup (and vice versa).
- Adult Appendix B remains rendered only in Adult mode.
- The Pediatric PDF itself refers patients 18 years and older to the separate Adult policy; no Adult route rule is copied into Pediatric.

## Closed ambiguity and alert inventory

The structured model and rendered disclosure contain this exact closed set:

1. Pages 1/3 print the Gastrointestinal Diagnostic Center abbreviations inconsistently as `GILDC`/`GIDC`.
2. Page 2 missing punctuation between `CRNA)` and `Registered Nurse`.
3. Page 2 prints `admixutre` rather than `admixture`.
4. Pages 1/3 alternate `Neonatal`/`Neonate` ICU, `Post Anesthesia`/`Post Acute` Care Unit, and two Appendix titles; the app does not normalize them silently.
5. Page 3 labels M as 3CHS and then as any ECG-equipped nursing unit; the selector exposes 3CHS and does not infer other units.
6. Page 3 requires NICU confirmation against NEOFAX; the app does not replace that external step.
7. Page 3 allows patient-specific initiation of a CC-restricted medication elsewhere only after transfer approval and direct continuous MP monitoring; normal lookup remains fail-closed.
8. Page 3 requires leadership/operations, Pharmacy, and EMR documentation for non-designated-area or unlisted medication exceptions; the app does not automate it.
9. Adenosine’s training, MP-presence, monitoring, Lifepak, area, and emergency conditions across pp.6–7.
10. Alteplase product wording `ACTIVASE: IVP-E/CC`, `ACTIVASE: CI-CC`, and anomalous `CATHFLO ACTIVASE: G`; Activase routes are not assigned to Cathflo.
11. Conventional Amphotericin B repeats `immediately preceding` on p.8.
12. Chlorpromazine route markers versus “IVP is not preferred”/MP-presence prose on p.10.
13. Source-visible `Daptomycin Cubicin)` missing an opening parenthesis on p.11.
14. Source-visible `Darbopoetin Alfa` spelling on p.11 is preserved.
15. Dextrose 25%/50% duplicate punctuation on p.12.
16. Premarin appears twice as `Conjugated estrogen`/`Estrogens, conjugated` on pp.10/13 and is not silently deduplicated.
17. Page 14 lists `Wilate` but prints `Wilat admin rate`; both source-visible forms are preserved.
18. Hydrocortisone prints `IVBP` in prose while the grid marks IVPB on p.15.
19. Source-visible `Hydromor-phone` split on p.16.
20. Ketamine’s p.18 `M: PCA only (end of life care)` line does not explicitly name a route; CI remains conservatively Conditional for CC/M.
21. Lorazepam has a CI marker on p.19 but only an `IVP: G` area; CI remains unresolved/Conditional rather than inheriting G.
22. Naloxone prints `priuritis` on p.21.
23. Prochlorperazine marks IVP/IVPB while saying IM is preferred and IV is typically avoided on p.26; both IV routes remain Conditional.
24. Page 25 visibly prints the unusual label instruction `Potassium-Do Not Use`; it is preserved without reinterpretation.
25. Rituximab’s `<50 kg`/`>50 kg` regimens do not assign exactly 50 kg; no regimen is inferred.
26. Rituximab spans pp.27–28 and contains source-visible punctuation omissions.
27. Propofol IVP is Anesthesia-only for procedural sedation on p.26; it is Conditional only in source-listed CC/P scopes.
28. Sodium chloride 23.4% marks IVPB with Area E on p.29 while policy-level E is defined only for emergency IV Push; IVPB remains unresolved/Conditional.
29. Verapamil is marked for IVP/CI in CC/P/E on p.31 without row-specific rate or monitoring prose; no guidance is invented.

No source-visible wording is silently corrected.

## Extraction and reproducibility

```bash
uv run --with pymupdf python scripts/extract-iv-medication-pediatric.py \
  public/references/lbh-intravenous-medication-pediatric-2026-04.pdf \
  /tmp/iv-medication-pediatric-data.json
cmp /tmp/iv-medication-pediatric-data.json src/lib/iv-medication-pediatric-data.json
```

The generator is hash-gated to the approved PDF, accepts only the four visually verified continuation pages, requires exactly 197/197 rows, and fails if any marked route lacks a normalized reviewed scope.

## Verification still required before release

- Freeze and stage the intended candidate; record staged tree/hash.
- Independent exact-tree source-vs-data-vs-UI-vs-test review must explicitly PASS.
- Full tests, Python tests, lint, typecheck, build, audit, secret/PHI scan, and responsive browser/console checks must pass.
- Deploy only from the beta-linked project.
- Verify canonical beta alias, hosted PDF MIME/signature/bytes/hash, Pediatric toggle/search/unit behavior, and References.
- Re-verify protected legacy byte/hash invariance and no new legacy deployment/alias movement.
