import therapeuticSubstitutionData from "./therapeutic-substitution-data.json";
import doNotCrushData from "./do-not-crush-data.json";
import ivEnteralData from "./iv-enteral-data.json";
import formularyRestrictionsData from "./formulary-restrictions-data.json";

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

export const CRRT_DRUGS = [
  { name: "Vancomycin", dose: "Load 20–25 mg/kg ABW; maintenance per levels (often q12–24h).", note: "Levels essential on CRRT." },
  { name: "Piperacillin-Tazobactam", dose: "3.375–4.5 g IV q6–8h (high-flux CRRT often needs aggressive dosing).", note: "Consider extended infusion." },
  { name: "Meropenem", dose: "1 g IV q8–12h depending on effluent rate / indication.", note: "CNS infections may need higher end." },
  { name: "Cefepime", dose: "1–2 g IV q8–12h on CRRT.", note: "Neurotoxicity risk—monitor." },
  { name: "Levofloxacin", dose: "500–750 mg IV q24h (minimal CRRT clearance variability).", note: "Still adjust for residual function." },
  { name: "Fluconazole", dose: "200–400 mg q24h; load 800 mg when indicated.", note: "Highly dialyzable—dose after sessions if IHD." },
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

export type ProtocolReference = {
  id: string;
  title: string;
  updated: string;
  pageCount: number;
  href: string;
  sha256: string;
  authority: string;
  affectedViews: string[];
};

export type TherapeuticSubstitutionRow = {
  ordered: string;
  substitute: string;
  facility: string;
  page: number;
  pageEnd?: number;
  subgroup?: string | null;
};

export type TherapeuticSubstitutionSection = {
  number: number;
  title: string;
  notes: string[];
  rows: TherapeuticSubstitutionRow[];
};

export type DoNotCrushRow = {
  generic: string;
  brand: string;
  comments: string;
  page: number;
  pageEnd?: number;
};

export type DoNotCrushTable = {
  number: number;
  title: string;
  rows: DoNotCrushRow[];
};

export type DoNotCrushCitation = {
  label: string;
  text: string;
};

export type IvEnteralRow = {
  medication: string;
  iv: string;
  enteral: string;
};

export type ApprovedSourceCorrection = {
  sourceText: string;
  renderedText: string;
  approver: string;
  approvedOn: string;
  scope: string;
};

export type FormularyRestrictionEntry = {
  medication: string;
  scope: string;
  restriction: string;
  page: number;
  pageEnd?: number;
};

export type FormularyRestrictionSection = {
  letter: string;
  entries: FormularyRestrictionEntry[];
};

export const THERAPEUTIC_SUBSTITUTION_PROTOCOL = therapeuticSubstitutionData as {
  source: ProtocolReference;
  sections: TherapeuticSubstitutionSection[];
};

export function searchTherapeuticSubstitutions(query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  return THERAPEUTIC_SUBSTITUTION_PROTOCOL.sections
    .map((section) => {
      const sectionMatch = normalizedQuery
        ? section.title.toLowerCase().includes(normalizedQuery)
        : false;
      const noteMatch = normalizedQuery
        ? section.notes.some((note) => note.toLowerCase().includes(normalizedQuery))
        : false;
      const rows = normalizedQuery
        ? section.rows.filter((row) =>
            [row.ordered, row.substitute, row.facility, row.subgroup ?? ""]
              .join(" ")
              .toLowerCase()
              .includes(normalizedQuery),
          )
        : section.rows;
      return { ...section, rows, sectionMatch, noteMatch };
    })
    .filter((section) => !normalizedQuery || section.rows.length > 0 || section.sectionMatch || section.noteMatch);
}

export const DO_NOT_CRUSH_PROTOCOL = doNotCrushData as {
  source: ProtocolReference;
  formularyQualifier: string;
  tables: DoNotCrushTable[];
  notes: string[];
  references: DoNotCrushCitation[];
};

export const IV_ENTERAL_PROTOCOL = ivEnteralData as {
  source: ProtocolReference;
  documentTitle: string;
  department: string;
  approver: string;
  originalDate: string;
  expirationDate: string;
  sites: string[];
  rows: IvEnteralRow[];
  notes: string[];
  approvedCorrections: ApprovedSourceCorrection[];
};

export const FORMULARY_RESTRICTIONS_PROTOCOL = formularyRestrictionsData as {
  source: ProtocolReference;
  governingNote: string;
  sections: FormularyRestrictionSection[];
  approvedCorrections: ApprovedSourceCorrection[];
  sourceAlerts: string[];
};

export function searchFormularyRestrictions(query: string) {
  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!tokens.length) return FORMULARY_RESTRICTIONS_PROTOCOL.sections;
  return FORMULARY_RESTRICTIONS_PROTOCOL.sections
    .map((section) => ({
      ...section,
      entries: section.entries.filter((entry) => {
        const searchable = [entry.medication, entry.scope, entry.restriction]
          .join(" ")
          .toLowerCase();
        return tokens.every((token) => searchable.includes(token));
      }),
    }))
    .filter((section) => section.entries.length > 0);
}

export function searchIvEnteral(query: string) {
  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!tokens.length) return IV_ENTERAL_PROTOCOL.rows;
  return IV_ENTERAL_PROTOCOL.rows.filter((row) => {
    const searchable = [row.medication, row.iv, row.enteral].join(" ").toLowerCase();
    return tokens.every((token) => searchable.includes(token));
  });
}

export function searchDoNotCrush(query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);
  const matchesQuery = (value: string) => {
    const normalizedValue = value.toLowerCase();
    return queryTokens.every((token) => normalizedValue.includes(token));
  };
  return DO_NOT_CRUSH_PROTOCOL.tables
    .map((table) => {
      const tableMatch = normalizedQuery
        ? matchesQuery(table.title)
        : false;
      const noteMatch = normalizedQuery && table.number === 1
        ? DO_NOT_CRUSH_PROTOCOL.notes.some((note) =>
            matchesQuery(note),
          )
        : false;
      const rows = normalizedQuery
        ? table.rows.filter((row) =>
            matchesQuery([row.generic, row.brand, row.comments].join(" ")),
          )
        : table.rows;
      return { ...table, rows, tableMatch, noteMatch };
    })
    .filter(
      (table) =>
        !normalizedQuery || table.rows.length > 0 || table.tableMatch || table.noteMatch,
    );
}

export type DoNotTubeGroup = {
  title: string;
  items?: string[];
};

export type DoNotTubeCategory = {
  number: number;
  title: string;
  detail: string;
  groups?: DoNotTubeGroup[];
};

export const DO_NOT_TUBE_PROTOCOL = {
  source: {
    id: "do-not-tube-2024-sinai",
    title: "Appendix A: Do Not Tube List",
    updated: "November 2024",
    pageCount: 1,
    href: "/references/do-not-tube-list-2024-sinai.pdf",
    sha256: "09cdb4b11a0d80e7ca326ed7901592750cd18632613a55d11a2b6660a7f85226",
    authority: "LBH institutional protocol; medical-board and P&T reviewed/approved",
    affectedViews: ["dnt"],
  } satisfies ProtocolReference,
  policyReference: 'Refer to Policy Tech “Pneumatic Tube” Policy',
  introduction:
    "Before tubing, please be aware that there are several items which cannot be sent via the pneumatic tubing system, including:",
  medicationQualifier:
    "Not a comprehensive list. Contact Pharmacy to determine if the medication is appropriate to send through the pneumatic tube system if unsure.",
  categories: [
    {
      number: 1,
      title: "Medications",
      detail: "Medications that must not be sent through the pneumatic tube system.",
      groups: [
        {
          title: "Protein based medications (altered by shaking)",
          items: [
            "Albumin",
            "filgrastim (Neupogen®)",
            "IVIG",
            "insulin",
            "vaccines",
            "lipids",
            "propofol",
            "clevidipine (Cleviprex®)",
            "epoprostenol",
            'monoclonal antibodies (“-mabs”)',
            "epoetin products ex.: Retacrit, Epogen, Procrit",
            "darbepoetin",
          ],
        },
        {
          title: "Controlled substances / narcotics",
          items: ["Fentanyl", "morphine", "PCA", "epidurals", "lacosamide", "etc."],
        },
        {
          title: "High-cost medications, including but not limited to",
          items: [
            "Amphotericin",
            "daptomycin",
            "denosumab",
            "zoledronic acid",
            "paliperidone palmitate (Invega Sustenna®)",
            "aripiprazole monohydrate (Abilify Maintena®)",
            "leuprolide (Lupron®)",
            "rituximab",
            "remdesivir",
            "study drugs (investigational drugs)",
            "intrauterine devices",
            "blood factor products",
          ],
        },
        { title: "TPN" },
        { title: "Patients own/personal medications" },
        {
          title: "Anticoagulation reversal agents",
          items: ["Kcentra", "Andexxa", "Novoseven", "etc."],
        },
        { title: "Chemicals", items: ["Lugols", "Dakins"] },
      ],
    },
    {
      number: 2,
      title: "Heavy items",
      detail: "Heavy items (e.g., IV bags greater than one (1) liter).",
    },
    {
      number: 3,
      title: "Glass bottles and ampules",
      detail: "Glass bottles greater than 100 mL and glass ampules.",
    },
    {
      number: 4,
      title: "Personal and non-authorized items",
      detail: "Personal items, food, and any other non-authorized item.",
    },
    {
      number: 5,
      title: "Oversized or overweight materials",
      detail:
        "Materials which are too large or too heavy to be secured and contained (2.5 lbs or 1 L of fluid max capacity).",
    },
    {
      number: 6,
      title: "Urgent or emergent blood",
      detail:
        "Blood to any area of the hospital when transfusion is URGENT or EMERGENT, except Emergency Department and Operating Room. The tubing of blood products to other areas in emergent situations should be at the discretion of the Transfusion Service.",
    },
    {
      number: 7,
      title: "Unused contaminated blood",
      detail: "Unused contaminated blood.",
    },
    {
      number: 8,
      title: "Spiked or transfused blood products",
      detail:
        "Blood products that have been spiked or transfused need to be returned to the Transfusion Service for any reason.",
    },
    { number: 9, title: "Tissues", detail: "Tissues." },
    {
      number: 10,
      title: "Original medical records",
      detail: "Original medical records.",
    },
    {
      number: 11,
      title: "Contaminated or broken carriers",
      detail: "Contaminated or broken carriers.",
    },
    {
      number: 12,
      title: "Medication order sheets",
      detail: "Medication order sheets. Exception: downtime.",
    },
    {
      number: 13,
      title: "CSF / sterile fluids",
      detail: "CSF / sterile fluids.",
    },
    {
      number: 14,
      title: "COVID-19 specimens",
      detail: "COVID-19 specimens are to be hand delivered to the laboratory.",
    },
  ] satisfies DoNotTubeCategory[],
};

export const PROTOCOL_REFERENCES: ProtocolReference[] = [
  DO_NOT_TUBE_PROTOCOL.source,
  THERAPEUTIC_SUBSTITUTION_PROTOCOL.source,
  DO_NOT_CRUSH_PROTOCOL.source,
  IV_ENTERAL_PROTOCOL.source,
  FORMULARY_RESTRICTIONS_PROTOCOL.source,
];

export const NAV = [
  { id: "home" as const, label: "Home", shortLabel: "Home", emoji: "🏠", description: "All calculators and patient profile" },
  { id: "crcl-bmi" as const, label: "CrCl / BMI", shortLabel: "CrCl / BMI", emoji: "📊", description: "Cockcroft-Gault, BMI, IBW, AdjBW" },
  { id: "dose-rounding" as const, label: "Dose Rounding", shortLabel: "Dose Rounding", emoji: "💊", description: "LBH rounding protocols — 16 medications" },
  { id: "renal-dosing" as const, label: "Renal Dosing", shortLabel: "Renal Dosing", emoji: "🫘", description: "CrCl-based dose adjustments" },
  { id: "therapeutic-sub" as const, label: "Therapeutic Sub", shortLabel: "Therapeutic Sub", emoji: "🔄", description: "Formulary therapeutic interchange" },
  { id: "crrt-dosing" as const, label: "CRRT Dosing", shortLabel: "CRRT Dosing", emoji: "🩺", description: "Dosing considerations on CRRT" },
  { id: "iv-po" as const, label: "IV → Enteral Conversion", shortLabel: "IV→Enteral", emoji: "💊", description: "Approved pharmacist IV-to-enteral conversion appendix" },
  { id: "restrictions" as const, label: "Formulary Restrictions", shortLabel: "Restrictions", emoji: "⚠️", description: "January 2026 LBH formulary medications with restrictions" },
  { id: "insulin-switch" as const, label: "Insulin Switch", shortLabel: "Insulin Switch", emoji: "💉", description: "Insulin product conversions" },
  { id: "he" as const, label: "Hepatic Encephalopathy", shortLabel: "HE", emoji: "🧠", description: "HE supportive treatment pathway" },
  { id: "hiv" as const, label: "HIV Formulary", shortLabel: "HIV", emoji: "💊", description: "Preferred HIV regimens" },
  { id: "dnt" as const, label: "Do Not Tube", shortLabel: "DNT", emoji: "🚫", description: "Items not for pneumatic tube" },
  { id: "dnc" as const, label: "Do Not Crush", shortLabel: "DNC", emoji: "🚫", description: "Medications that must not be crushed" },
  { id: "references" as const, label: "References", shortLabel: "References", emoji: "📚", description: "Original approved institutional protocols" },
];
