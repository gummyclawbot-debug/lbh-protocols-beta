import therapeuticSubstitutionData from "./therapeutic-substitution-data.json";
import doNotCrushData from "./do-not-crush-data.json";
import ivEnteralData from "./iv-enteral-data.json";
import formularyRestrictionsData from "./formulary-restrictions-data.json";
import ivMedicationAdultData from "./iv-medication-adult-data.json";
import ivMedicationPediatricData from "./iv-medication-pediatric-data.json";

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

export type IvMedicationArea = "G" | "M" | "CC" | "P";
export type IvMedicationRoute = "ivp" | "ivpb" | "ci";
export type IvMedicationRouteState =
  | "allowed"
  | "conditional"
  | "emergency-only"
  | "not-permitted"
  | "not-listed";

export type IvMedicationRouteScope = {
  scopes: (IvMedicationArea | "E" | string)[];
  conditional?: boolean;
  providerRestricted?: boolean;
  unresolved?: boolean;
  sourceMarker?: string;
  excludedUnitIds?: string[];
  forceNotListed?: boolean;
};

export type IvMedicationEntry = {
  id: string;
  displayName: string;
  aliases: string[];
  graceAvailable: boolean;
  routes: Record<IvMedicationRoute, string>;
  centralLineRequired: string;
  areasOfUse: string;
  considerations: string;
  page: number;
  pageEnd?: number;
  routeScopes?: Partial<Record<IvMedicationRoute, IvMedicationRouteScope>>;
};

export type IvMedicationUnit = {
  id: string;
  label: string;
  group: "General" | "Monitored" | "Critical Care" | "Procedural";
  permissions: IvMedicationArea[];
  sourceLabel: string;
  matchTokens: string[];
};

export type IvMedicationRouteResolution = {
  state: IvMedicationRouteState;
  sourceMarker: string;
  reason: string;
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

export type FormularyRestrictionLookup = {
  sections: FormularyRestrictionSection[];
  matchingMedicationNames: string[];
  directEntryMatchCount: number;
  mode: "all" | "medication" | "criteria" | "alphabetic" | "none";
};

export function resolveFormularyRestrictionLookup(query: string): FormularyRestrictionLookup {
  const normalizedQuery = query.trim().toLowerCase();
  const tokens = normalizedQuery.split(/[^a-z0-9]+/).filter(Boolean);
  if (!normalizedQuery) {
    return {
      sections: FORMULARY_RESTRICTIONS_PROTOCOL.sections,
      matchingMedicationNames: [],
      directEntryMatchCount: 0,
      mode: "all",
    };
  }
  if (!tokens.length) {
    return { sections: [], matchingMedicationNames: [], directEntryMatchCount: 0, mode: "none" };
  }

  const medicationMatches = FORMULARY_RESTRICTIONS_PROTOCOL.sections.flatMap((section) =>
    section.entries
      .filter((entry) => {
        const medicationWords = entry.medication.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
        return tokens.every((token) => medicationWords.some((word) => word.startsWith(token)));
      })
      .map((entry) => ({ letter: section.letter, medication: entry.medication })),
  );
  if (medicationMatches.length) {
    const matchingLetters = new Set(medicationMatches.map((match) => match.letter));
    return {
      sections: FORMULARY_RESTRICTIONS_PROTOCOL.sections.filter((section) => matchingLetters.has(section.letter)),
      matchingMedicationNames: medicationMatches.map((match) => match.medication),
      directEntryMatchCount: medicationMatches.length,
      mode: "medication",
    };
  }

  // Multi-word input retains token-based criteria lookup. A single token is a
  // criterion only when it occurs as a complete word; otherwise drug-like text
  // falls back to its alphabetic section without substring collisions.
  const directMatches = tokens.length > 1
    ? searchFormularyRestrictions(tokens.join(" "))
    : FORMULARY_RESTRICTIONS_PROTOCOL.sections
        .map((section) => ({
          ...section,
          entries: section.entries.filter((entry) => {
            const criteriaWords = [entry.scope, entry.restriction]
              .join(" ")
              .toLowerCase()
              .split(/[^a-z0-9]+/)
              .filter(Boolean);
            return criteriaWords.includes(tokens[0]);
          }),
        }))
        .filter((section) => section.entries.length > 0);
  if (directMatches.length) {
    const matchingLetters = new Set(directMatches.map((section) => section.letter));
    return {
      sections: FORMULARY_RESTRICTIONS_PROTOCOL.sections.filter((section) => matchingLetters.has(section.letter)),
      matchingMedicationNames: [],
      directEntryMatchCount: directMatches.reduce((total, section) => total + section.entries.length, 0),
      mode: "criteria",
    };
  }

  const initial = normalizedQuery.match(/[a-z]/)?.[0]?.toUpperCase();
  const alphabeticSection = initial
    ? FORMULARY_RESTRICTIONS_PROTOCOL.sections.find((section) =>
        section.letter === initial || (section.letter === "U-Z" && /^[U-Z]$/.test(initial)),
      )
    : undefined;
  if (alphabeticSection) {
    return {
      sections: [alphabeticSection],
      matchingMedicationNames: [],
      directEntryMatchCount: 0,
      mode: "alphabetic",
    };
  }

  return { sections: [], matchingMedicationNames: [], directEntryMatchCount: 0, mode: "none" };
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

export const IV_MEDICATION_ADULT_PROTOCOL = ivMedicationAdultData as {
  source: ProtocolReference;
  referenceNumber: string;
  nextReviewDate: string;
  sites: string[];
  approvers: string[];
  scope: string;
  purpose: string;
  defaultContext: { population: "adult"; site: "sinai-inpatient"; unit: "general-inpatient" };
  sourceRowCount: number;
  continuationPages: number[];
  medications: IvMedicationEntry[];
  sourceAlerts: string[];
  proceduralSedationAdult: {
    drug: string;
    dose: string;
    onsetPeak: string;
    duration: string;
    reversal: string;
    sideEffects: string;
    page: number;
    pageEnd?: number;
  }[];
  pediatric: {
    status: "awaiting-authoritative-source";
    message: string;
    excludedSourcePages: number[];
  };
};

export const IV_MEDICATION_PEDIATRIC_PROTOCOL = ivMedicationPediatricData as {
  source: ProtocolReference;
  referenceNumber: string;
  nextReviewDate: string;
  sites: string[];
  approvers: string[];
  scope: string;
  purpose: string;
  defaultContext: { population: "pediatric"; site: "sinai-pediatric"; unit: "general-pediatrics" };
  sourceRowCount: number;
  continuationPages: number[];
  medications: IvMedicationEntry[];
  sourceAlerts: string[];
};

export const IV_MEDICATION_UNITS: IvMedicationUnit[] = [
  { id: "general-inpatient", label: "Other Sinai inpatient unit", group: "General", permissions: ["G"], sourceLabel: "All nursing units", matchTokens: [] },
  { id: "gigu-5w", label: "GIGU (5W)", group: "General", permissions: ["G"], sourceLabel: "GIGU (5W)", matchTokens: ["GIGU", "5W"] },
  { id: "pulm-id-6e", label: "Pulm ID (6E)", group: "General", permissions: ["G"], sourceLabel: "Pulm ID (6E)", matchTokens: ["PULM/ID", "PULM ID", "6E"] },
  { id: "pulm-id-6w", label: "Pulm ID (6W)", group: "General", permissions: ["G"], sourceLabel: "Pulm ID (6W)", matchTokens: ["PULM/ID", "PULM ID", "6W"] },
  { id: "b6", label: "B6", group: "General", permissions: ["G"], sourceLabel: "B6", matchTokens: ["B6"] },
  { id: "postpartum-b1", label: "Post Partum Unit (B1)", group: "General", permissions: ["G"], sourceLabel: "Post Partum Unit (B1)", matchTokens: ["POST PARTUM", "B1"] },
  { id: "3-north", label: "3 North", group: "General", permissions: ["G"], sourceLabel: "3 North", matchTokens: ["3 NORTH"] },
  { id: "5-south-tbi", label: "5 South TBI", group: "General", permissions: ["G"], sourceLabel: "5 South TBI", matchTokens: ["5 SOUTH", "TBI"] },
  { id: "b5", label: "B5", group: "General", permissions: ["G"], sourceLabel: "B5", matchTokens: ["B5"] },
  { id: "b2", label: "B2", group: "General", permissions: ["G"], sourceLabel: "B2", matchTokens: ["B2"] },
  { id: "6-st", label: "ICU Step Down (6 ST)", group: "Monitored", permissions: ["G", "M"], sourceLabel: "ICU Step Down (6 ST)", matchTokens: ["6 ST", "6ST"] },
  { id: "pcu", label: "PCU", group: "Monitored", permissions: ["G", "M"], sourceLabel: "PCU", matchTokens: ["PCU"] },
  { id: "3-south", label: "3 South", group: "Monitored", permissions: ["G", "M"], sourceLabel: "3 South", matchTokens: ["3 SOUTH", "3ST"] },
  { id: "npcu", label: "3 South Neurology Progressive Care Unit (NPCU)", group: "Monitored", permissions: ["G", "M"], sourceLabel: "3 South Neurology Progressive Care Unit (NPCU)", matchTokens: ["NPCU"] },
  { id: "ohsd", label: "Open Heart Step Down (OHSD)", group: "Monitored", permissions: ["G", "M"], sourceLabel: "Open Heart Step Down (OHSD)", matchTokens: ["OHSD"] },
  { id: "ortho-trauma", label: "Ortho/Trauma", group: "Monitored", permissions: ["G", "M"], sourceLabel: "Ortho/Trauma", matchTokens: ["ORTHO/TRAUMA"] },
  { id: "oroc-3w", label: "Outpatient Rapid Observation Center (OROC, 3W)", group: "Monitored", permissions: ["G", "M"], sourceLabel: "Outpatient Rapid Obseration Center (OROC, 3W)", matchTokens: ["OROC", "3W"] },
  { id: "icu", label: "Intensive Care Unit (ICU)", group: "Critical Care", permissions: ["G", "M", "CC"], sourceLabel: "Intensive Care Unit (ICU)", matchTokens: ["ICU"] },
  { id: "ed", label: "Emergency Department (ED)", group: "Critical Care", permissions: ["G", "M", "CC"], sourceLabel: "Emergency Department (ED)", matchTokens: ["ED"] },
  { id: "pacu", label: "Post Anesthesia Care Unit (PACU)", group: "Critical Care", permissions: ["G", "M", "CC"], sourceLabel: "Post Anesthesia Care Unit (PACU)", matchTokens: ["PACU"] },
  { id: "be-pacu", label: "Blaustein PACU (BE-PACU)", group: "Critical Care", permissions: ["G", "M", "CC"], sourceLabel: "Blaustein (BE)-PACU (BE-PACU)", matchTokens: ["BE-PACU", "BE PACU"] },
  { id: "cath-lab", label: "Cath Lab", group: "Critical Care", permissions: ["G", "M", "CC", "P"], sourceLabel: "Cath Lab (listed under CC and P)", matchTokens: ["CATH LAB"] },
  { id: "gidc", label: "GIDC", group: "Procedural", permissions: ["G", "P"], sourceLabel: "GIDC", matchTokens: ["GIDC"] },
  { id: "ir", label: "Interventional Radiology (IR)", group: "Procedural", permissions: ["G", "P"], sourceLabel: "IR", matchTokens: ["IR"] },
  { id: "cdcr", label: "Cardiac Diagnostic Cardiac Recovery (CDCR)", group: "Procedural", permissions: ["G", "P"], sourceLabel: "Cardiac Diagnostic Cardiac Recovery (CDCR)", matchTokens: ["CDCR"] },
  { id: "or", label: "Operating Room (OR)", group: "Procedural", permissions: ["G", "P"], sourceLabel: "OR", matchTokens: ["OR"] },
  { id: "radiology", label: "Radiology", group: "Procedural", permissions: ["G", "P"], sourceLabel: "Radiology", matchTokens: ["RADIOLOGY"] },
  { id: "labor-delivery", label: "Labor and Delivery (L&D) — all BE areas", group: "Procedural", permissions: ["G", "P"], sourceLabel: "Labor and Delivery (L&D)- all BE areas", matchTokens: ["L&D", "OB/L&D"] },
];

export const IV_MEDICATION_PEDIATRIC_UNITS: IvMedicationUnit[] = [
  { id: "general-pediatrics", label: "Other pediatric nursing unit", group: "General", permissions: ["G"], sourceLabel: "All nursing units servicing pediatric patients", matchTokens: [] },
  { id: "scn", label: "Special Care Nursery (SCN)", group: "General", permissions: ["G"], sourceLabel: "Special Care Nursery (SCN)", matchTokens: ["SCN"] },
  { id: "pediatric-heme-onc", label: "Pediatric Hematology/Oncology Clinic", group: "General", permissions: ["G"], sourceLabel: "Pediatric Hematology/Oncology Clinic", matchTokens: ["HEMATOLOGY/ONCOLOGY", "HEM/ONC"] },
  { id: "3chs", label: "General Pediatrics (3CHS)", group: "Monitored", permissions: ["G", "M"], sourceLabel: "General pediatrics (3CHS)", matchTokens: ["3CHS"] },
  { id: "picu", label: "Pediatric Intensive Care Unit (PICU)", group: "Critical Care", permissions: ["G", "M", "CC"], sourceLabel: "Pediatric Intensive Care Unit (PICU)", matchTokens: ["PICU"] },
  { id: "nicu", label: "Neonatal Intensive Care Unit (NICU)", group: "Critical Care", permissions: ["G", "M", "CC"], sourceLabel: "Neonatal Intensive Care Unit (NICU)", matchTokens: ["NICU"] },
  { id: "pediatric-ed", label: "Pediatric Emergency Department (ED)", group: "Critical Care", permissions: ["G", "M", "CC"], sourceLabel: "Pediatric Emergency Department (ED)", matchTokens: ["ED"] },
  { id: "pediatric-preop", label: "Pediatric Pre-Op", group: "Critical Care", permissions: ["G", "M", "CC"], sourceLabel: "Pediatric patients in Pre-Op", matchTokens: ["PRE-OP", "PREOP"] },
  { id: "pediatric-pacu", label: "Pediatric PACU", group: "Critical Care", permissions: ["G", "M", "CC"], sourceLabel: "Pediatric patients in PACU", matchTokens: ["PACU"] },
  { id: "cdc", label: "Children’s Diagnostic Center (CDC)", group: "Procedural", permissions: ["G", "P"], sourceLabel: "Children’s Diagnostic Center (CDC)", matchTokens: ["CDC"] },
  { id: "or-pediatric", label: "Pediatric Operating Room (OR)", group: "Procedural", permissions: ["G", "P"], sourceLabel: "Pediatric patients in the Operating Room", matchTokens: ["OR"] },
  { id: "gidc-pediatric", label: "Pediatric GIDC", group: "Procedural", permissions: ["G", "P"], sourceLabel: "Pediatric patients in GIDC", matchTokens: ["GIDC"] },
  { id: "ir-pediatric", label: "Pediatric Interventional Radiology (IR)", group: "Procedural", permissions: ["G", "P"], sourceLabel: "Pediatric patients in IR", matchTokens: ["IR"] },
];

type IvRouteOverride = IvMedicationRouteScope;

export const IV_ROUTE_OVERRIDES: Record<string, Partial<Record<IvMedicationRoute, IvRouteOverride>>> = {
  "Argatroban +": {
    ci: { scopes: ["G"], excludedUnitIds: ["b5", "5-south-tbi"] },
  },
  "Alteplase+ (Activase, Cathflo)": {
    ivp: { scopes: ["G", "CC", "P", "E"], conditional: true },
    ci: { scopes: ["G", "CC", "P"], conditional: true },
  },
  "Amiodarone + (Cordarone)": {
    ivp: { scopes: ["E"] },
    ivpb: { scopes: ["CC", "M", "CDCR"] },
    ci: { scopes: ["CC", "M", "CDCR"] },
  },
  "Bumetanide + (Bumex)": {
    ivp: { scopes: ["G"] },
    ci: { scopes: ["M", "CC"], conditional: true },
  },
  "Bivalirudin (Angiomax)": {
    ci: { scopes: ["G"], excludedUnitIds: ["b5", "5-south-tbi"] },
  },
  "Calcium chloride +": {
    ivp: { scopes: ["E", "CC"] },
    ivpb: { scopes: ["G"] },
    ci: { scopes: ["CC"] },
  },
  "Calcium gluconate +": {
    ivp: { scopes: ["E", "CC"] },
    ivpb: { scopes: ["G"] },
    ci: { scopes: ["CC"] },
  },
  "Cisatracurium + (Nimbex)": {
    ivp: { scopes: ["E"] },
    ci: { scopes: ["CC", "P"] },
  },
  "Chlorpromazinee+ (Thorazine)": {
    ivp: { scopes: ["G"], conditional: true, sourceMarker: "prose-only" },
    ivpb: { scopes: ["G"], conditional: true },
  },
  "Cosyntropin + (Cortrosyn)": {
    ivp: { scopes: ["G"] },
    ivpb: { scopes: ["G"] },
    ci: { scopes: ["P"] },
  },
  "Diltiazem + (Cardizem)": {
    ivp: { scopes: ["E", "CC", "P"] },
    ci: { scopes: ["CC", "P", "6 ST", "OHSD", "PCU", "NPCU"], conditional: true },
  },
  "Epinephrine + (Adrenalin 1:10,000)": {
    ivp: { scopes: ["E"] },
    ci: { scopes: ["CC", "OR"] },
  },
  "Fentanyl + (Sublimaze)": {
    ivp: { scopes: ["CC", "P"] },
    ci: { scopes: ["CC", "P"] },
  },
  "Fosphenytoin + (Cerebyx)": {
    ivp: { scopes: ["G"], conditional: true },
    ivpb: { scopes: ["G"], conditional: true },
  },
  "Furosemide + (Lasix)": {
    ivp: { scopes: ["G"] },
    ivpb: { scopes: ["G"], conditional: true },
    ci: { scopes: ["M", "CC"], conditional: true },
  },
  "Glucagon +": {
    ivp: { scopes: ["G"], conditional: true },
    ci: { scopes: ["CC"], conditional: true },
  },
  "Haloperidol + (Haldol)": {
    ivp: { scopes: ["CC"] },
  },
  "Heparin sodium+": {
    ivp: { scopes: ["G"] },
    ci: { scopes: ["G"], excludedUnitIds: ["b5", "5-south-tbi"] },
  },
  "Hydromorphone + (Dilaudid)": {
    ivp: { scopes: ["G"] },
    ci: { scopes: ["ICU", "INPATIENT HOSPICE"], conditional: true },
  },
  "Insulin, regular +": {
    ivp: { scopes: ["G"] },
    ci: { scopes: ["CC", "6 ST", "P"] },
  },
  "Ketamine +": {
    ivp: { scopes: ["E", "CC", "P"] },
    ivpb: { scopes: ["ED", "ICU"] },
    ci: { scopes: ["CC"] },
  },
  Lacosamide: {
    ivp: { scopes: ["ED", "ICU", "PACU", "6 ST", "3ST", "PCU", "OHSD", "OROC"] },
    ivpb: { scopes: ["G"] },
  },
  "Levofloxacin + (Levaquin)": {
    ivp: { scopes: ["G"], conditional: true, sourceMarker: "prose-only" },
    ivpb: { scopes: ["G"], conditional: true },
  },
  "Lidocaine + (Xylocaine)**": {
    ivp: { scopes: ["E", "CC"] },
    ivpb: { scopes: ["ED"] },
    ci: { scopes: ["CC", "OHSD", "6 ST", "PCU"] },
  },
  "Lorazepam + (Ativan)": {
    ivp: { scopes: ["G"] },
    ci: { scopes: ["CC", "OR", "PULM/ID"], conditional: true },
  },
  "Magnesium sulfate +": {
    ivp: { scopes: ["E", "CC"] },
    ivpb: { scopes: ["G"] },
    ci: { scopes: ["OB/L&D", "CC", "B1", "ED"], conditional: true },
  },
  "Mannitol +": {
    ivp: { scopes: ["E", "CC"] },
    ivpb: { scopes: ["G"] },
  },
  "Methylene Blue": {
    ivp: { scopes: ["G"] },
    ivpb: { scopes: ["CC"] },
  },
  "Metoprolol + (Lopressor)": {
    ivp: { scopes: ["M", "CC"], conditional: true },
    ivpb: { scopes: ["G"], conditional: true },
  },
  "Morphine sulfate": {
    ivp: { scopes: ["G"] },
    ivpb: { scopes: ["G"], conditional: true },
    ci: { scopes: ["CC"], conditional: true },
  },
  "Nalbuphine (Nubain)": {
    ivp: { scopes: ["G"] },
    ivpb: { scopes: ["G"] },
    ci: { scopes: ["L&D", "BE-PACU", "B1"] },
  },
  "Phenytoin+": {
    ivp: { scopes: ["G"], conditional: true },
    ivpb: { scopes: ["G"], conditional: true },
  },
  "Phentolamine + (Regitine)": {
    ivp: { scopes: ["G", "CC"], conditional: true },
  },
  "Potassium chloride +": {
    ivpb: { scopes: ["G"] },
    ci: { scopes: ["M", "CC"], conditional: true },
  },
  "Propofol (Diprivan)": {
    ivp: { scopes: [], conditional: true, providerRestricted: true },
    ci: { scopes: ["CC"] },
  },
  "Pyridostigmine (Mestinon)": {
    ivp: { scopes: ["E", "M", "CC", "P"] },
    ci: { scopes: ["CC"], conditional: true },
  },
  "Sodium bicarbonate +": {
    ivp: { scopes: ["E", "M", "CC", "P"] },
    ci: { scopes: ["G"], conditional: true },
  },
  "Terlipressin (Terlivaz)": {
    ivp: { scopes: ["6 ST"], conditional: true, sourceMarker: "prose-only" },
    ivpb: { scopes: ["6 ST"], conditional: true },
  },
};

export const IV_PEDIATRIC_ROUTE_SCOPE_REVIEW_FIXTURE: Record<string, Partial<Record<IvMedicationRoute, IvRouteOverride>>> = {
  "Adenosine (Adenocard, Adenoscan)": {
    ivp: { scopes: ["G", "CC", "P", "E"], conditional: true },
  },
  "Alteplase (Activase, Cathflo)": {
    ivp: { scopes: ["E", "CC"], unresolved: true },
    ci: { scopes: ["CC"], unresolved: true },
  },
  Aminophylline: {
    ivpb: { scopes: ["M"] },
    ci: { scopes: ["CC"] },
  },
  "Amiodarone (Cordarone)": {
    ivp: { scopes: ["E"] },
    ivpb: { scopes: ["CC", "P"] },
    ci: { scopes: ["CC", "P"] },
  },
  "Calcium chloride": {
    ivp: { scopes: ["E"], conditional: true },
    ivpb: { scopes: ["M", "CC", "P"] },
    ci: { scopes: ["CC"] },
  },
  "Calcium gluconate": {
    ivp: { scopes: ["E"], conditional: true },
    ivpb: { scopes: ["M", "CC", "P"] },
    ci: { scopes: ["CC"] },
  },
  "Chlorpromazine (Thorazine)": {
    ivp: { scopes: ["G"], conditional: true },
    ivpb: { scopes: ["G"], conditional: true },
  },
  Crizanlizumab: { ivpb: { scopes: ["G"], conditional: true } },
  Dalbavancin: { ivpb: { scopes: ["ED"], conditional: true } },
  "Deferoxamine mesylate (Desferal)": {
    ivpb: { scopes: ["G", "M", "CC"], conditional: true },
    ci: { scopes: ["G", "M", "CC"], conditional: true },
  },
  Droperidol: { ivp: { scopes: ["OR"], conditional: true } },
  "Ephedrine sulfate": { ivp: { scopes: ["CC", "P"], conditional: true } },
  "Epinephrine (Adrenalin 0.1 mg/mL)": {
    ivp: { scopes: ["E"] },
    ci: { scopes: ["CC", "P"] },
  },
  "Fentanyl (Sublimaze)": {
    ivp: { scopes: ["M", "CC", "P"] },
    ci: { scopes: ["M", "CC"], conditional: true },
  },
  "Ferumoxytol (Feraheme)": { ivpb: { scopes: ["G"], conditional: true } },
  "Fosphenytoin (Cerebyx)": { ivpb: { scopes: ["G"], conditional: true } },
  Glucagon: {
    ivp: { scopes: ["G"], conditional: true },
    ci: { scopes: ["CC"], conditional: true },
  },
  "Haloperidol (Haldol) lactate": { ivp: { scopes: ["M", "CC"], conditional: true } },
  "Heparin sodium": {
    ivp: { scopes: ["G"], conditional: true },
    ci: { scopes: ["G", "CC", "P"], conditional: true },
  },
  "Hydromor-phone (Dilaudid)": {
    ivp: { scopes: ["G"] },
    ci: { scopes: ["M", "CC"], conditional: true },
  },
  Indomethacin: { ivpb: { scopes: ["NICU"], conditional: true } },
  "Insulin, regular": {
    ivp: { scopes: ["E"] },
    ivpb: { scopes: ["NICU"], conditional: true },
    ci: { scopes: ["CC", "P"] },
  },
  Etomidate: { ivp: { scopes: ["CC", "P", "E"], conditional: true } },
  Ketamine: {
    ivp: { scopes: ["CC", "P", "E"], conditional: true },
    ci: { scopes: ["CC", "M"], conditional: true },
  },
  "Lidocaine (Xylocaine)": {
    ivp: { scopes: ["E", "CC", "P"] },
    ci: { scopes: ["CC", "P"] },
  },
  "Lorazepam (Ativan)": {
    ivp: { scopes: ["G"] },
    ci: { scopes: [], unresolved: true },
  },
  "Magnesium sulfate": {
    ivp: { scopes: ["CC", "E"], conditional: true },
    ivpb: { scopes: ["G"] },
    ci: { scopes: ["CC"] },
  },
  Mannitol: {
    ivp: { scopes: ["CC", "E"] },
    ivpb: { scopes: ["G"] },
  },
  "Meperidine (Demerol)": {
    ivp: { scopes: ["OR"], conditional: true },
    ivpb: { scopes: ["G"] },
  },
  "Metoprolol (Lopressor)": {
    ivp: { scopes: ["P"], conditional: true },
    ivpb: { scopes: ["M", "CC", "P"] },
  },
  "Midazolam (Versed)": {
    ivp: { scopes: ["G", "CC", "P", "E"], conditional: true },
    ci: { scopes: ["CC"] },
  },
  "Morphine sulfate": {
    ivp: { scopes: ["G"] },
    ci: { scopes: ["M", "CC"], conditional: true },
  },
  "Naloxone (Narcan)": {
    ivp: { scopes: ["G"] },
    ci: { scopes: ["G", "CC"], conditional: true },
  },
  "Potassium acetate": { ci: { scopes: ["G"], conditional: true } },
  "Potassium chloride": {
    ivpb: { scopes: ["G"], conditional: true },
    ci: { scopes: ["G"], conditional: true },
  },
  "Potassium phosphate": {
    ivpb: { scopes: ["G"], conditional: true },
    ci: { scopes: ["G"], conditional: true },
  },
  "Propofol (Diprivan)": {
    ivp: { scopes: ["CC", "P"], conditional: true },
    ci: { scopes: ["CC", "P"] },
  },
  "Prochlorperazine (Compazine)": {
    ivp: { scopes: ["G"], conditional: true },
    ivpb: { scopes: ["G"], conditional: true },
  },
  "Sodium chloride 23.4%": { ivpb: { scopes: ["E"], unresolved: true } },
  Sugammadex: { ivp: { scopes: ["CC", "P"], conditional: true } },
  "Ustekinumab (Stelara)": { ivpb: { scopes: ["G"], conditional: true } },
  "Vedolizumab (Entyvio)": { ivpb: { scopes: ["G"], conditional: true } },
};

export const IV_PEDIATRIC_ROUTE_OVERRIDES: Record<
  string,
  Partial<Record<IvMedicationRoute, IvRouteOverride>>
> = Object.fromEntries(
  IV_MEDICATION_PEDIATRIC_PROTOCOL.medications.map((medication) => [
    medication.displayName,
    medication.routeScopes ?? {},
  ]),
);

export const IV_QUERY_ROUTE_OVERRIDES: Record<
  string,
  Record<string, Partial<Record<IvMedicationRoute, IvRouteOverride>>>
> = {
  "Alteplase+ (Activase, Cathflo)": {
    activase: {
      ivp: { scopes: ["E", "CC", "P"] },
      ci: { scopes: ["CC", "P"] },
    },
    cathflo: {
      ivp: { scopes: [], forceNotListed: true },
      ci: { scopes: [], forceNotListed: true },
    },
  },
};

export const IV_PEDIATRIC_QUERY_ROUTE_OVERRIDES: Record<
  string,
  Record<string, Partial<Record<IvMedicationRoute, IvRouteOverride>>>
> = {
  "Alteplase (Activase, Cathflo)": {
    activase: {
      ivp: { scopes: ["E", "CC"] },
      ci: { scopes: ["CC"] },
    },
    cathflo: {
      ivp: { scopes: [], forceNotListed: true },
      ci: { scopes: [], forceNotListed: true },
    },
  },
};

function hasDelimitedToken(text: string, token: string) {
  const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^A-Z0-9])${escaped}($|[^A-Z0-9])`, "i").test(text);
}

function queryRouteOverride(
  entry: IvMedicationEntry,
  route: IvMedicationRoute,
  query: string,
  queryOverrides: Record<string, Record<string, Partial<Record<IvMedicationRoute, IvRouteOverride>>>>,
) {
  const variants = queryOverrides[entry.displayName];
  if (!variants) return undefined;
  const matchedVariants = Object.entries(variants).filter(([token]) => hasDelimitedToken(query, token));
  return matchedVariants.length === 1 ? matchedVariants[0][1][route] : undefined;
}

const ROUTE_SCOPE_CLAUSE = /\b(?:IVP(?:\s+AND\s+IVPB)?|IVPB|CI)\s*[:=-]/i;
const REVIEWED_SCOPE_TOKEN = /^(?:G|M|CC|P|E)$/i;

function simpleSharedScopes(raw: string) {
  const cleaned = raw.replace(/\*+$/g, "").trim();
  const tokens = cleaned.split(/\s*[/,]\s*/).filter(Boolean);
  return tokens.length > 0 && tokens.every((token) => REVIEWED_SCOPE_TOKEN.test(token)) ? tokens : null;
}

export const IV_MEDICATION_UNREVIEWED_ROUTE_SCOPES = IV_MEDICATION_ADULT_PROTOCOL.medications.flatMap((entry) => {
  if (!ROUTE_SCOPE_CLAUSE.test(entry.areasOfUse)) return [];
  return (["ivp", "ivpb", "ci"] as const)
    .filter((route) => entry.routes[route] && !IV_ROUTE_OVERRIDES[entry.displayName]?.[route])
    .map((route) => `${entry.displayName}:${route}:${entry.areasOfUse}`);
});

export const IV_MEDICATION_PEDIATRIC_UNREVIEWED_ROUTE_SCOPES =
  IV_MEDICATION_PEDIATRIC_PROTOCOL.medications.flatMap((entry) => {
    if (!ROUTE_SCOPE_CLAUSE.test(entry.areasOfUse)) return [];
    return (["ivp", "ivpb", "ci"] as const)
      .filter((route) => entry.routes[route] && !IV_PEDIATRIC_ROUTE_OVERRIDES[entry.displayName]?.[route])
      .map((route) => `${entry.displayName}:${route}:${entry.areasOfUse}`);
  });

function sourceScopes(
  entry: IvMedicationEntry,
  route: IvMedicationRoute,
  effectiveOverride?: IvRouteOverride,
) {
  if (effectiveOverride) return { ...effectiveOverride, reviewed: true };
  const scopes = simpleSharedScopes(entry.areasOfUse);
  if (scopes) return { scopes, conditional: entry.areasOfUse.includes("*"), reviewed: true };
  return { scopes: [], conditional: true, reviewed: false };
}

function scopeMatchesUnit(scopes: string[], unit: IvMedicationUnit) {
  const joined = scopes.join(" / ").toUpperCase();
  if (hasDelimitedToken(joined, "G")) return true;
  if (unit.permissions.some((permission) => hasDelimitedToken(joined, permission))) return true;
  return unit.matchTokens.some((token) => hasDelimitedToken(joined, token));
}

function resolveIvRoute(
  entry: IvMedicationEntry,
  route: IvMedicationRoute,
  unit: IvMedicationUnit,
  query: string,
  routeOverrides: Record<string, Partial<Record<IvMedicationRoute, IvRouteOverride>>>,
  queryOverrides: Record<string, Record<string, Partial<Record<IvMedicationRoute, IvRouteOverride>>>>,
): IvMedicationRouteResolution {
  const override = queryRouteOverride(entry, route, query, queryOverrides) ?? routeOverrides[entry.displayName]?.[route];
  if (override?.forceNotListed) {
    return {
      state: "not-listed",
      sourceMarker: "",
      reason: "The source lists Cathflo as a General-area variant but does not separately assign its IV route markers; Activase route markers are not reused.",
    };
  }
  const sourceMarker = override?.sourceMarker ?? entry.routes[route];
  if (!sourceMarker) {
    return { state: "not-listed", sourceMarker: "", reason: "This route is not marked in the source table." };
  }
  if (override?.providerRestricted) {
    return {
      state: "conditional",
      sourceMarker,
      reason: "The source marks this route with a provider/indication restriction rather than a unit permission; read the exact caveat.",
    };
  }
  if (override?.unresolved) {
    return {
      state: "conditional",
      sourceMarker,
      reason: "The source marks this route but does not assign a route-specific area; read the exact Areas of Use text.",
    };
  }
  if (override?.excludedUnitIds?.includes(unit.id)) {
    return {
      state: "not-permitted",
      sourceMarker,
      reason: `The source explicitly excludes ${unit.label} for this route.`,
    };
  }
  const scope = sourceScopes(entry, route, override);
  if (!scope.reviewed) {
    return {
      state: "conditional",
      sourceMarker,
      reason: "The source uses a complex area restriction that is not converted into a unit permission; read the exact Areas of Use text.",
    };
  }
  const joined = scope.scopes.join(" / ");
  const matches = scopeMatchesUnit(scope.scopes, unit);
  const emergencyOnly = route === "ivp" && hasDelimitedToken(joined, "E") && !matches;
  if (emergencyOnly) {
    return {
      state: "emergency-only",
      sourceMarker,
      reason: "Source permits IV push only for emergent use with its stated safeguards.",
    };
  }
  if (!matches) {
    return {
      state: "not-permitted",
      sourceMarker,
      reason: `The source does not list ${unit.label} for this route.`,
    };
  }
  const conditional = Boolean(scope.conditional || sourceMarker.includes("*"));
  return {
    state: conditional ? "conditional" : "allowed",
    sourceMarker,
    reason: conditional
      ? "The source contains a route-specific qualifier or unresolved source conflict; read the exact caveat."
      : `Allowed by the source hierarchy for ${unit.label}.`,
  };
}

export type IvMedicationPopulation = "adult" | "pediatric";

export function resolveIvMedicationLookup(
  query: string,
  unitId: string,
  population: IvMedicationPopulation = "adult",
) {
  const normalized = query.trim().toLowerCase();
  const pediatric = population === "pediatric";
  const units = pediatric ? IV_MEDICATION_PEDIATRIC_UNITS : IV_MEDICATION_UNITS;
  const protocol = pediatric ? IV_MEDICATION_PEDIATRIC_PROTOCOL : IV_MEDICATION_ADULT_PROTOCOL;
  const routeOverrides = pediatric ? IV_PEDIATRIC_ROUTE_OVERRIDES : IV_ROUTE_OVERRIDES;
  const queryOverrides = pediatric ? IV_PEDIATRIC_QUERY_ROUTE_OVERRIDES : IV_QUERY_ROUTE_OVERRIDES;
  const unit = units.find((item) => item.id === unitId);
  if (!unit) {
    return {
      query: normalized,
      unit: null,
      matches: [],
      error: `Unknown ${pediatric ? "pediatric " : ""}IV medication unit: ${unitId}`,
    };
  }
  const medications = normalized
    ? protocol.medications.filter((medication) =>
        [medication.displayName, ...medication.aliases, medication.areasOfUse, medication.considerations]
          .join(" ")
          .toLowerCase()
          .includes(normalized),
      )
    : [];
  return {
    query: normalized,
    unit,
    matches: medications.map((medication) => ({
      medication,
      routes: {
        ivp: resolveIvRoute(medication, "ivp", unit, normalized, routeOverrides, queryOverrides),
        ivpb: resolveIvRoute(medication, "ivpb", unit, normalized, routeOverrides, queryOverrides),
        ci: resolveIvRoute(medication, "ci", unit, normalized, routeOverrides, queryOverrides),
      },
    })),
  };
}

export const PROTOCOL_REFERENCES: ProtocolReference[] = [
  DO_NOT_TUBE_PROTOCOL.source,
  THERAPEUTIC_SUBSTITUTION_PROTOCOL.source,
  DO_NOT_CRUSH_PROTOCOL.source,
  IV_ENTERAL_PROTOCOL.source,
  FORMULARY_RESTRICTIONS_PROTOCOL.source,
  IV_MEDICATION_ADULT_PROTOCOL.source,
  IV_MEDICATION_PEDIATRIC_PROTOCOL.source,
];

export const NAV = [
  { id: "home" as const, label: "Home", shortLabel: "Home", emoji: "🏠", description: "All calculators and patient profile" },
  { id: "crcl-bmi" as const, label: "CrCl / BMI", shortLabel: "CrCl / BMI", emoji: "📊", description: "Cockcroft-Gault, BMI, IBW, AdjBW" },
  { id: "dose-rounding" as const, label: "Dose Rounding", shortLabel: "Dose Rounding", emoji: "💊", description: "LBH rounding protocols — 16 medications" },
  { id: "renal-dosing" as const, label: "Renal Dosing", shortLabel: "Renal Dosing", emoji: "🫘", description: "CrCl-based dose adjustments" },
  { id: "therapeutic-sub" as const, label: "Therapeutic Sub", shortLabel: "Therapeutic Sub", emoji: "🔄", description: "Formulary therapeutic interchange" },
  { id: "crrt-dosing" as const, label: "CRRT Dosing", shortLabel: "CRRT Dosing", emoji: "🩺", description: "Dosing considerations on CRRT" },
  { id: "iv-po" as const, label: "IV → Enteral Conversion", shortLabel: "IV→Enteral", emoji: "💊", description: "Approved pharmacist IV-to-enteral conversion appendix" },
  { id: "iv-medication" as const, label: "IV Medication", shortLabel: "IV Meds", emoji: "💉", description: "Adult and pediatric IV route and unit permissions from approved April 2026 policies" },
  { id: "restrictions" as const, label: "Formulary Restrictions", shortLabel: "Restrictions", emoji: "⚠️", description: "January 2026 LBH formulary medications with restrictions" },
  { id: "insulin-switch" as const, label: "Insulin Switch", shortLabel: "Insulin Switch", emoji: "💉", description: "Insulin product conversions" },
  { id: "he" as const, label: "Hepatic Encephalopathy", shortLabel: "HE", emoji: "🧠", description: "HE supportive treatment pathway" },
  { id: "hiv" as const, label: "HIV Formulary", shortLabel: "HIV", emoji: "💊", description: "Preferred HIV regimens" },
  { id: "dnt" as const, label: "Do Not Tube", shortLabel: "DNT", emoji: "🚫", description: "Items not for pneumatic tube" },
  { id: "dnc" as const, label: "Do Not Crush", shortLabel: "DNC", emoji: "🚫", description: "Medications that must not be crushed" },
  { id: "references" as const, label: "References", shortLabel: "References", emoji: "📚", description: "Original approved institutional protocols" },
];
