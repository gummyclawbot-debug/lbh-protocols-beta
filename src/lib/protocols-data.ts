export type RenalDrug = {
  name: string;
  notes: string;
  rows: { crcl: string; dose: string }[];
};

export const RENAL_DOSING: RenalDrug[] = [
  {
    name: "Enoxaparin (treatment)",
    notes: "Anti-Xa monitoring if CrCl <30 or extremes of weight.",
    rows: [
      { crcl: "≥30 mL/min", dose: "1 mg/kg SC q12h or 1.5 mg/kg SC q24h" },
      { crcl: "<30 mL/min", dose: "1 mg/kg SC q24h" },
    ],
  },
  {
    name: "Apixaban (AF)",
    notes: "Dose reduce if ≥2 of: age ≥80, wt ≤60 kg, SCr ≥1.5.",
    rows: [
      { crcl: "Standard", dose: "5 mg PO BID" },
      { crcl: "Dose-reduction criteria", dose: "2.5 mg PO BID" },
      { crcl: "ESRD on HD (AF)", dose: "5 mg BID; 2.5 mg BID if age ≥80 or wt ≤60 kg" },
    ],
  },
  {
    name: "Gabapentin",
    notes: "Titrate to effect; adjust for CrCl.",
    rows: [
      { crcl: "≥60", dose: "300–1200 mg TID" },
      { crcl: "30–59", dose: "200–700 mg BID" },
      { crcl: "15–29", dose: "200–700 mg daily" },
      { crcl: "<15", dose: "100–300 mg daily" },
    ],
  },
  {
    name: "Metformin",
    notes: "Avoid if unstable HF, lactic acidosis risk, contrast (hold).",
    rows: [
      { crcl: "≥45", dose: "No adjustment; max per label" },
      { crcl: "30–44", dose: "Do not initiate; reassess ongoing therapy" },
      { crcl: "<30", dose: "Contraindicated" },
    ],
  },
  {
    name: "Piperacillin-Tazobactam",
    notes: "Extended infusion preferred per local protocol when used.",
    rows: [
      { crcl: ">40", dose: "3.375–4.5 g IV q6–8h (indication-based)" },
      { crcl: "20–40", dose: "2.25 g IV q6h (typical)" },
      { crcl: "<20", dose: "2.25 g IV q8h (typical)" },
    ],
  },
  {
    name: "Vancomycin",
    notes: "Use AUC-guided dosing when available; load by actual BW.",
    rows: [
      { crcl: "Normal", dose: "15–20 mg/kg (ABW) q8–12h; load 20–35 mg/kg" },
      { crcl: "Reduced CrCl", dose: "Same mg/kg; extend interval; monitor levels" },
      { crcl: "HD", dose: "Load then post-HD dosing per levels" },
    ],
  },
];

export const THERAPEUTIC_SUBS = [
  { from: "Rosuvastatin", to: "Atorvastatin", note: "Convert roughly 5→10, 10→20, 20→40 mg (clinical judgment)." },
  { from: "Esomeprazole IV/PO", to: "Pantoprazole", note: "PPI class interchange per formulary; IV pantoprazole preferred." },
  { from: "Levetiracetam brand", to: "Levetiracetam generic", note: "1:1 interchange unless DNS." },
  { from: "Insulin aspart (NovoLog)", to: "Insulin lispro / formulary rapid", note: "1:1 unit interchange for mealtime insulin per protocol." },
  { from: "Albuterol HFA brand", to: "Formulary albuterol HFA", note: "Therapeutic interchange 1:1." },
  { from: "Ondansetron ODT brand", to: "Ondansetron tab/ODT generic", note: "1:1 mg interchange." },
];

export const CRRT_DRUGS = [
  { name: "Vancomycin", dose: "Load 20–25 mg/kg ABW; maintenance per levels (often q12–24h).", note: "Levels essential on CRRT." },
  { name: "Piperacillin-Tazobactam", dose: "3.375–4.5 g IV q6–8h (high-flux CRRT often needs aggressive dosing).", note: "Consider extended infusion." },
  { name: "Meropenem", dose: "1 g IV q8–12h depending on effluent rate / indication.", note: "CNS infections may need higher end." },
  { name: "Cefepime", dose: "1–2 g IV q8–12h on CRRT.", note: "Neurotoxicity risk—monitor." },
  { name: "Levofloxacin", dose: "500–750 mg IV q24h (minimal CRRT clearance variability).", note: "Still adjust for residual function." },
  { name: "Fluconazole", dose: "200–400 mg q24h; load 800 mg when indicated.", note: "Highly dialyzable—dose after sessions if IHD." },
];

export const IV_PO = [
  { iv: "Levofloxacin IV", po: "Levofloxacin PO", ratio: "1:1", criteria: "Tolerating PO, hemodynamically stable" },
  { iv: "Ciprofloxacin IV", po: "Ciprofloxacin PO", ratio: "1:1.25 (400 IV ≈ 500 PO)", criteria: "No severe sepsis/malabsorption" },
  { iv: "Metronidazole IV", po: "Metronidazole PO", ratio: "1:1", criteria: "GI tract functional" },
  { iv: "Fluconazole IV", po: "Fluconazole PO", ratio: "1:1", criteria: "Excellent bioavailability" },
  { iv: "Linezolid IV", po: "Linezolid PO", ratio: "1:1", criteria: "Bioavailability ~100%" },
  { iv: "Pantoprazole IV", po: "Pantoprazole PO", ratio: "1:1", criteria: "Not NPO / not continuous infusion indication" },
  { iv: "Famotidine IV", po: "Famotidine PO", ratio: "1:1", criteria: "Tolerating oral meds" },
  { iv: "Acetaminophen IV", po: "Acetaminophen PO/PR", ratio: "1:1", criteria: "Can take enteral therapy" },
  { iv: "Levetiracetam IV", po: "Levetiracetam PO", ratio: "1:1", criteria: "Seizures controlled, taking PO" },
  { iv: "Ondansetron IV", po: "Ondansetron PO/ODT", ratio: "1:1", criteria: "Not actively vomiting" },
];

export const RESTRICTIONS = [
  { drug: "Meropenem", restriction: "ID / stewardship approval preferred outside septic shock / ESBL protocols.", alt: "Cefepime, pip-tazo per culture" },
  { drug: "Linezolid", restriction: "Reserve for VRE / MRSA pneumonia or intolerance to vancomycin.", alt: "Vancomycin, daptomycin (non-pneumonia)" },
  { drug: "Daptomycin", restriction: "Not for pneumonia; stewardship review for prolonged use.", alt: "Vancomycin, linezolid" },
  { drug: "Ceftazidime-avibactam", restriction: "ID approval — CRE / difficult gram-negatives.", alt: "Per susceptibility" },
  { drug: "Isavuconazole", restriction: "Antifungal stewardship; invasive mold per ID.", alt: "Voriconazole, liposomal ampho" },
  { drug: "IV acetaminophen", restriction: "Restrict to NPO or failed enteral; automatic IV→PO when eligible.", alt: "PO/PR acetaminophen" },
  { drug: "Albumin 25%", restriction: "Indication-restricted (LVP, SBP, hepatorenal protocols).", alt: "Crystalloid when appropriate" },
  { drug: "Levoleucovorin", restriction: "Use leucovorin unless specific restriction exception.", alt: "Leucovorin" },
];

export const INSULIN_SWITCH = [
  { from: "Insulin glargine (Lantus/Basaglar)", to: "Insulin glargine formulary / Toujeo note", factor: "1:1 for U-100 glargine products; Toujeo often ~80% when converting TO Toujeo (see label).", tips: "Give basal at consistent time; overlap prandial carefully." },
  { from: "Insulin detemir", to: "Insulin glargine U-100", factor: "Often 1:1; if detemir BID, consider 80% of total daily detemir as glargine daily.", tips: "Monitor closely 3–5 days." },
  { from: "NPH BID", to: "Glargine daily", factor: "Start ~80% of total daily NPH as glargine once daily.", tips: "Reduce if elderly / hypoglycemia risk." },
  { from: "Insulin aspart", to: "Insulin lispro / formulary rapid", factor: "1:1", tips: "Match carb ratio / correction factor." },
  { from: "Regular insulin sliding scale", to: "Rapid-acting correction", factor: "1:1 unit starting point", tips: "Prefer analog for mealtime." },
  { from: "U-500 regular", to: "U-500 or basal-bolus specialist plan", factor: "Do not convert casually — endocrine/pharmacy consult.", tips: "High-alert medication." },
];

export const HE_PROTOCOL = {
  title: "Hepatic Encephalopathy – Supportive Protocol",
  steps: [
    "Identify/treat precipitants: infection, GI bleed, electrolytes, constipation, sedatives, alkalosis.",
    "Lactulose: titrate to 2–3 soft stools/day (typical 20–30 g PO q1–2h until stool, then TID–QID).",
    "If NPO/unreliable PO: lactulose enema per protocol.",
    "Rifaximin 550 mg PO BID as add-on for recurrent HE or lactulose intolerance (formulary).",
    "Nutrition: avoid protein restriction long-term; prefer adequate protein + calories.",
    "Correct hyponatremia carefully; hold offending meds (benzos, opioids when possible).",
    "Severe HE / airway risk: ICU, consider reverse precipitant urgently.",
  ],
  meds: [
    { name: "Lactulose", dose: "20–30 g (30–45 mL) PO frequently then maintenance TID–QID", note: "Goal 2–3 soft stools/day" },
    { name: "Rifaximin", dose: "550 mg PO BID", note: "Adjunct for overt/recurrent HE" },
    { name: "Zinc (if deficient)", dose: "Per level / nutrition", note: "Supportive only" },
  ],
};

export const HIV_FORMULARY = [
  { regimen: "Biktarvy (BIC/FTC/TAF)", use: "STR preferred for many treatment-naïve / switch", notes: "Single tablet; check interactions (cations, rifamycins)." },
  { regimen: "Descovy (FTC/TAF) + dolutegravir", use: "Alternative multi-tablet preferred backbone", notes: "DTG separate; avoid in early pregnancy without counseling." },
  { regimen: "Dovato (DTG/3TC)", use: "Eligible 2-drug regimen", notes: "Not for HBV co-infection or high VL caveats per label." },
  { regimen: "Symtuza (DRV/c/FTC/TAF)", use: "PI-based STR when resistance / considerations", notes: "Many interactions (boosted PI)." },
  { regimen: "Prezcobix + Descovy", use: "Boosted DRV multi-tablet", notes: "Food requirement; interactions." },
  { regimen: "Isentress HD / Tivicay", use: "INSTI components", notes: "Use with backbone per ID." },
  { regimen: "Opportunistic infection ppx", use: "CD4-guided (TMP-SMX, azithro, etc.)", notes: "Follow ID / OI guidelines; formulary agents preferred." },
];

export const DO_NOT_TUBE = [
  "Finasteride",
  "Dutasteride",
  "Chemotherapy agents (hazardous)",
  "Hormones (e.g., estradiol, testosterone products)",
  "Mycophenolate",
  "Tacrolimus (check product — many hazardous)",
  "Azathioprine",
  "Methotrexate",
  "Warfarin (prefer hand delivery / double-check)",
  "Controlled substances per policy",
  "Thick suspensions that clog tubes",
  "Oils / sticky compounds (e.g., some softgels)",
  "Live vaccines",
  'Packaging marked "Do not tube"',
];

export const DO_NOT_CRUSH = [
  { drug: "Extended-release (ER/XR/SR/CR) tabs", reason: "Dose dumping / toxicity risk" },
  { drug: "Enteric-coated (EC) tabs", reason: "Destroys coating; gastric irritation / inactivation" },
  { drug: "Dabigatran", reason: "Increases bioavailability — bleeding risk" },
  { drug: "Potassium chloride XR", reason: "GI ulceration risk" },
  { drug: "Bupropion XL/SR", reason: "Seizure risk if crushed" },
  { drug: "Mesalamine EC/DR", reason: "Site-specific delivery lost" },
  { drug: "Pantoprazole EC", reason: "Acid-labile — use suspension/packet if needed" },
  { drug: "Rivaroxaban (some strengths)", reason: "Follow label — some may mix with applesauce, not crush all" },
  { drug: "Sublingual / ODT specialty forms", reason: "Wrong route/absorption" },
  { drug: "Hazardous meds", reason: "Occupational exposure — use closed system" },
  { drug: "Softgel special oils (e.g., dronabinol)", reason: "Content loss / exposure" },
  { drug: "Combination hormones", reason: "Exposure + altered release" },
];

export const NAV = [
  { id: "home" as const, label: "Home", shortLabel: "Home", emoji: "🏠", description: "All calculators and patient profile" },
  { id: "crcl-bmi" as const, label: "CrCl / BMI", shortLabel: "CrCl / BMI", emoji: "📊", description: "Cockcroft-Gault, BMI, IBW, AdjBW" },
  { id: "dose-rounding" as const, label: "Dose Rounding", shortLabel: "Dose Rounding", emoji: "💊", description: "LBH rounding protocols — 16 medications" },
  { id: "renal-dosing" as const, label: "Renal Dosing", shortLabel: "Renal Dosing", emoji: "🫘", description: "CrCl-based dose adjustments" },
  { id: "therapeutic-sub" as const, label: "Therapeutic Sub", shortLabel: "Therapeutic Sub", emoji: "🔄", description: "Formulary therapeutic interchange" },
  { id: "crrt-dosing" as const, label: "CRRT Dosing", shortLabel: "CRRT Dosing", emoji: "🩺", description: "Dosing considerations on CRRT" },
  { id: "iv-po" as const, label: "IV → PO Conversion", shortLabel: "IV→PO", emoji: "💊", description: "IV to oral conversion guide" },
  { id: "restrictions" as const, label: "Formulary Restrictions", shortLabel: "Restrictions", emoji: "⚠️", description: "Restricted antimicrobials & high-cost meds" },
  { id: "insulin-switch" as const, label: "Insulin Switch", shortLabel: "Insulin Switch", emoji: "💉", description: "Insulin product conversions" },
  { id: "he" as const, label: "Hepatic Encephalopathy", shortLabel: "HE", emoji: "🧠", description: "HE supportive treatment pathway" },
  { id: "hiv" as const, label: "HIV Formulary", shortLabel: "HIV", emoji: "💊", description: "Preferred HIV regimens" },
  { id: "dnt" as const, label: "Do Not Tube", shortLabel: "DNT", emoji: "🚫", description: "Medications not for pneumatic tube" },
  { id: "dnc" as const, label: "Do Not Crush", shortLabel: "DNC", emoji: "🚫", description: "Medications that must not be crushed" },
];
