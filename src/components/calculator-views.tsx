"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ExternalLink, FileText } from "lucide-react";
import { PatientProfileCard } from "@/components/patient-profile-card";
import { usePatient } from "@/components/patient-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  applyDoseRounding,
  DOSE_ROUND_MEDS,
  formatNum,
} from "@/lib/calculations";
import {
  CRRT_DRUGS,
  DO_NOT_CRUSH_PROTOCOL,
  DO_NOT_TUBE_PROTOCOL,
  FORMULARY_RESTRICTIONS_PROTOCOL,
  HE_PROTOCOL,
  HIV_FORMULARY,
  INSULIN_SWITCH,
  IV_ENTERAL_PROTOCOL,
  IV_MEDICATION_ADULT_PROTOCOL,
  IV_MEDICATION_PEDIATRIC_PROTOCOL,
  IV_MEDICATION_PEDIATRIC_UNITS,
  IV_MEDICATION_UNITS,
  NAV,
  RENAL_DOSING,
  PROTOCOL_REFERENCES,
  resolveFormularyRestrictionLookup,
  resolveIvMedicationLookup,
  searchDoNotCrush,
  searchIvEnteral,
  searchTherapeuticSubstitutions,
  THERAPEUTIC_SUBSTITUTION_PROTOCOL,
  type IvMedicationPopulation,
} from "@/lib/protocols-data";
import type { ViewId } from "@/types/patient";
import { cn } from "@/lib/utils";

const fade = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25 },
};

function Panel({
  title,
  description,
  children,
}: {
  title?: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div {...fade}>
      <Card className="shadow-sm">
        {title || description ? (
          <CardHeader className="border-b [.border-b]:pb-3">
            {title ? <CardTitle role="heading" aria-level={2} className="text-lg">{title}</CardTitle> : null}
            {description ? (
              <CardDescription className="text-sm leading-relaxed">
                {description}
              </CardDescription>
            ) : null}
          </CardHeader>
        ) : null}
        <CardContent className="pt-1">{children}</CardContent>
      </Card>
    </motion.div>
  );
}

function HomeView({ onNavigate }: { onNavigate: (id: ViewId) => void }) {
  const tools = NAV.filter((n) => n.id !== "home");
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">All Calculators</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Select a protocol tool. Patient profile stays shared across views.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {tools.map((item, i) => (
          <motion.button
            key={item.id}
            type="button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03, duration: 0.25 }}
            onClick={() => onNavigate(item.id)}
            className={cn(
              "group rounded-xl border border-border/80 bg-card p-5 text-left shadow-sm",
              "transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            )}
          >
            <div className="text-2xl">{item.emoji}</div>
            <h3 className="mt-2 font-semibold group-hover:text-primary">
              {item.label}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {item.description}
            </p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function CrClBmiView() {
  const { patient, derived } = usePatient();
  return (
    <Panel
      title="📊 CrCl / BMI"
      description="Cockcroft-Gault creatinine clearance, BMI, ideal and adjusted body weight using the shared patient profile."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border p-4">
          <div className="text-xs font-medium text-muted-foreground">Inputs</div>
          <ul className="mt-2 space-y-1 text-sm">
            <li>Sex: {patient.sex === "M" ? "Male" : "Female"}</li>
            <li>Age: {patient.age} yrs</li>
            <li>Height: {patient.heightCm} cm ({formatNum(derived.heightIn, 1)} in)</li>
            <li>Weight: {patient.weightKg} kg</li>
            <li>SCr: {patient.scr} mg/dL</li>
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            ["BMI", formatNum(derived.bmi, 1), ""],
            ["IBW", formatNum(derived.ibwKg, 1), "kg"],
            ["AdjBW", formatNum(derived.adjBwKg, 1), "kg"],
            ["Dosing Wt", formatNum(derived.dosingWtKg, 1), "kg"],
            ["CrCl (ABW)", formatNum(derived.crclAbw, 0), "mL/min"],
            ["CrCl (IBW)", formatNum(derived.crclIbw, 0), "mL/min"],
          ].map(([label, value, unit]) => (
            <div key={label} className="rounded-lg bg-primary/10 px-3 py-3">
              <div className="text-[11px] font-medium uppercase tracking-wide text-primary">
                {label}
              </div>
              <div className="mt-1 text-xl font-semibold tabular-nums">
                {value}
                {unit ? (
                  <span className="ml-1 text-xs font-normal text-muted-foreground">
                    {unit}
                  </span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        IBW (Devine). AdjBW = IBW + 0.4×(ABW−IBW) when ABW &gt; 120% IBW. CrCl via Cockcroft-Gault.
      </p>
    </Panel>
  );
}

function DoseRoundingView() {
  const { derived } = usePatient();
  const [medId, setMedId] = React.useState(DOSE_ROUND_MEDS[0].id);
  const [mgPerKg, setMgPerKg] = React.useState(5);
  const rule = DOSE_ROUND_MEDS.find((m) => m.id === medId) ?? DOSE_ROUND_MEDS[0];
  const calc = derived.dosingWtKg * mgPerKg;
  const rounded = applyDoseRounding(calc, rule);

  return (
    <Panel
      title="💊 LBH Dose Rounding Protocol (12.2025)"
      description='Rounded dose dispensed unless provider documents "DO NOT SUBSTITUTE." Verifying pharmacist includes "Dose rounded per protocol" in order comments.'
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="med">Select Medication</Label>
            <select
              id="med"
              className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
              value={medId}
              onChange={(e) => setMedId(e.target.value)}
            >
              {DOSE_ROUND_MEDS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="mpk">Dose (mg/kg or units/kg)</Label>
            <Input
              id="mpk"
              type="number"
              step={0.1}
              value={mgPerKg}
              onChange={(e) => setMgPerKg(Number(e.target.value))}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Using dosing weight {formatNum(derived.dosingWtKg, 1)} kg from patient profile.
          </p>
        </div>
        <div className="space-y-3 rounded-xl border bg-muted/40 p-4">
          <div>
            <div className="text-xs text-muted-foreground">Calculated</div>
            <div className="text-2xl font-semibold tabular-nums">
              {formatNum(calc, 1)} {rule.unit}
            </div>
          </div>
          <Separator />
          <div>
            <div className="text-xs text-muted-foreground">Rounded (protocol)</div>
            <div className="text-3xl font-bold text-primary tabular-nums">
              {formatNum(rounded, 0)} {rule.unit}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{rule.note}</p>
          <Badge variant="secondary">Step: {rule.stepMg} {rule.unit}</Badge>
        </div>
      </div>
    </Panel>
  );
}

function RenalView() {
  const { derived } = usePatient();
  return (
    <Panel
      title="🫘 Renal Dosing"
      description={`Patient CrCl (ABW) ≈ ${formatNum(derived.crclAbw, 0)} mL/min · CrCl (IBW) ≈ ${formatNum(derived.crclIbw, 0)} mL/min. Match row to estimated clearance and indication.`}
    >
      <div className="space-y-4">
        {RENAL_DOSING.map((drug) => (
          <div key={drug.name} className="overflow-hidden rounded-xl border">
            <div className="bg-muted/50 px-4 py-2 font-medium">{drug.name}</div>
            <div className="divide-y">
              {drug.rows.map((row) => (
                <div
                  key={row.crcl}
                  className="grid gap-1 px-4 py-2 text-sm sm:grid-cols-[140px_1fr]"
                >
                  <div className="font-medium text-primary">{row.crcl}</div>
                  <div>{row.dose}</div>
                </div>
              ))}
            </div>
            <p className="border-t px-4 py-2 text-xs text-muted-foreground">
              {drug.notes}
            </p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function TherapeuticSubView() {
  const [query, setQuery] = React.useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const sections = searchTherapeuticSubstitutions(query);
  const resultCount = sections.reduce((total, section) => total + section.rows.length, 0);
  const contextCount = sections.filter((section) => section.noteMatch || section.sectionMatch).length;

  return (
    <Panel
      title="🔄 Therapeutic Substitution"
      description="January 2026 LBH inpatient therapeutic substitution list. Search the medication ordered, substitute, facility, section, or source note."
    >
      <div className="space-y-4">
        <div className="rounded-xl border bg-muted/25 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="w-full max-w-xl space-y-1.5">
              <Label htmlFor="therapeutic-sub-search">Search all 296 substitutions</Label>
              <Input
                id="therapeutic-sub-search"
                type="search"
                placeholder="e.g. Trelegy, insulin U-500, SH, dispense as written…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <a
              href={THERAPEUTIC_SUBSTITUTION_PROTOCOL.source.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              <FileText className="size-4" /> Open approved source <ExternalLink className="size-3.5" />
            </a>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {normalizedQuery
              ? `${resultCount} direct ${resultCount === 1 ? "row match" : "row matches"}${contextCount ? ` · ${contextCount} section-context ${contextCount === 1 ? "match" : "matches"}` : ""} across ${sections.length} ${sections.length === 1 ? "section" : "sections"}.`
              : "31 source sections · 296 complete substitution rows · facility scope and source-page traceability preserved."}
          </p>
        </div>

        {!normalizedQuery ? (
          <nav aria-label="Therapeutic substitution section index" className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {THERAPEUTIC_SUBSTITUTION_PROTOCOL.sections.map((section) => (
              <a
                key={section.number}
                href={`#therapeutic-sub-section-${section.number}`}
                className="rounded-lg border px-3 py-2 text-sm hover:border-primary/50 hover:bg-muted/40"
              >
                <span className="mr-2 font-mono text-xs text-muted-foreground">{section.number}.</span>
                {section.title}
                <span className="ml-2 text-xs text-muted-foreground">({section.rows.length})</span>
              </a>
            ))}
          </nav>
        ) : null}

        {sections.length ? (
          <div className="space-y-3">
            {sections.map((section) => (
              <details
                id={`therapeutic-sub-section-${section.number}`}
                key={section.number}
                open={normalizedQuery ? true : undefined}
                className="group scroll-mt-32 overflow-hidden rounded-xl border"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 bg-muted/25 px-4 py-3 hover:bg-muted/50 [&::-webkit-details-marker]:hidden">
                  <span className="font-semibold">
                    <span className="mr-2 font-mono text-xs text-muted-foreground">{section.number}.</span>
                    {section.title}
                  </span>
                  <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                    {section.rows.length} {section.rows.length === 1 ? "row" : "rows"}
                    <span aria-hidden="true" className="transition-transform group-open:rotate-180">⌄</span>
                  </span>
                </summary>
                <div className="border-t">
                  {section.notes.length ? (
                    <div className="space-y-2 border-b bg-amber-500/10 px-4 py-3 text-sm leading-relaxed">
                      {section.notes.map((note) => <p key={note}>{note}</p>)}
                    </div>
                  ) : null}
                  {section.rows.length ? (
                    <p className="border-b px-4 py-2 text-xs text-muted-foreground sm:hidden">Swipe horizontally to view all table columns.</p>
                  ) : null}
                  {section.rows.length ? <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left text-sm">
                      <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                        <tr>
                          <th className="w-[38%] px-3 py-2">Medication ordered</th>
                          <th className="w-[38%] px-3 py-2">Substitute to</th>
                          <th className="px-3 py-2">Facility</th>
                          <th className="px-3 py-2">Source</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {section.rows.map((row, rowIndex) => {
                          const showSubgroup = row.subgroup && row.subgroup !== section.rows[rowIndex - 1]?.subgroup;
                          return (
                            <React.Fragment key={`${row.page}-${rowIndex}-${row.ordered}`}>
                              {showSubgroup ? (
                                <tr className="bg-primary/5">
                                  <th colSpan={4} className="px-3 py-2 text-xs uppercase tracking-wide text-primary">{row.subgroup}</th>
                                </tr>
                              ) : null}
                              <tr className="align-top hover:bg-muted/20">
                                <td className="whitespace-pre-line px-3 py-2.5 font-medium leading-relaxed">{row.ordered}</td>
                                <td className="whitespace-pre-line px-3 py-2.5 leading-relaxed">{row.substitute}</td>
                                <td className="whitespace-pre-line px-3 py-2.5 text-muted-foreground">{row.facility}</td>
                                <td className="whitespace-nowrap px-3 py-2.5 text-xs text-muted-foreground">
                                  {row.pageEnd ? `pp. ${row.page}–${row.pageEnd}` : `p. ${row.page}`}
                                </td>
                              </tr>
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div> : (
                    <p className="px-4 py-3 text-sm text-muted-foreground">Section context matches; no individual substitution row contains this search term.</p>
                  )}
                </div>
              </details>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            No source rows match “{query}”.
          </div>
        )}
      </div>
    </Panel>
  );
}

function CrrtView() {
  return (
    <Panel
      title="🩺 CRRT Dosing"
      description="Typical starting points on continuous RRT. Confirm effluent rate, filter type, and residual function. Levels when available."
    >
      <div className="grid gap-3 md:grid-cols-2">
        {CRRT_DRUGS.map((d) => (
          <div key={d.name} className="rounded-xl border p-4">
            <div className="font-semibold">{d.name}</div>
            <p className="mt-2 text-sm">{d.dose}</p>
            <p className="mt-2 text-xs text-muted-foreground">{d.note}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function IvPoView() {
  const [query, setQuery] = React.useState("");
  const rows = searchIvEnteral(query);

  return (
    <Panel
      title="💊 IV → Enteral Conversion"
      description="Approved pharmacist IV-to-enteral conversion appendix for the listed LBH facilities. Apply the parent policy’s inclusion and exclusion criteria."
    >
      <div className="space-y-4">
        <div className="rounded-xl border bg-muted/25 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="w-full max-w-xl space-y-1.5">
              <Label htmlFor="iv-enteral-search">Search all 17 approved medication rows</Label>
              <Input
                id="iv-enteral-search"
                type="search"
                placeholder="e.g. ciprofloxacin, MRSA, J-tube, Q24H…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <a
              href={IV_ENTERAL_PROTOCOL.source.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              <FileText className="size-4" /> Open approved source <ExternalLink className="size-3.5" />
            </a>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {query.trim() ? `${rows.length} direct ${rows.length === 1 ? "row match" : "row matches"}.` : "17 source rows · five approved facilities · complete footnotes preserved."}
          </p>
          <p className="mt-2 text-xs font-medium text-amber-950 dark:text-amber-100">
            Source updated {IV_ENTERAL_PROTOCOL.source.updated}; visible expiration date {IV_ENTERAL_PROTOCOL.expirationDate}. Jarvis designated this version as the current authoritative source for beta implementation.
          </p>
        </div>

        {rows.length ? (
          <div className="overflow-hidden rounded-xl border">
            <p className="border-b px-4 py-2 text-xs text-muted-foreground sm:hidden">Swipe horizontally to view all table columns.</p>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="w-[23%] px-3 py-2">Medication</th>
                    <th className="w-[35%] px-3 py-2">IV medication</th>
                    <th className="px-3 py-2">Enteral medication+</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {rows.map((row) => (
                    <tr key={row.medication} className="align-top hover:bg-muted/30">
                      <td className="whitespace-pre-line px-3 py-2.5 font-medium leading-relaxed">{row.medication}</td>
                      <td className="whitespace-pre-line px-3 py-2.5 leading-relaxed">{row.iv}</td>
                      <td className="whitespace-pre-line px-3 py-2.5 leading-relaxed">{row.enteral}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            No approved source row matches “{query}”.
          </div>
        )}

        <section className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
          <h3 className="font-semibold text-amber-950 dark:text-amber-100">Governing source notes</h3>
          <div className="mt-2 space-y-2 text-sm leading-relaxed">
            {IV_ENTERAL_PROTOCOL.notes.map((note) => <p key={note}>{note}</p>)}
          </div>
        </section>

        <details className="rounded-xl border">
          <summary className="cursor-pointer px-4 py-3 font-semibold">Source scope and approved rendered correction</summary>
          <div className="space-y-3 border-t px-4 py-4 text-sm leading-relaxed">
            <p><strong>Sites:</strong> {IV_ENTERAL_PROTOCOL.sites.join("; ")}.</p>
            <p><strong>Approver visible in source:</strong> {IV_ENTERAL_PROTOCOL.approver}.</p>
            <p><strong>Correction:</strong> The immutable PDF says “1mg PO 24H” for Folic Acid. Jarvis approved rendering “1mg PO Q24H” in the beta presentation on August 12, 2026.</p>
          </div>
        </details>
      </div>
    </Panel>
  );
}

function RestrictionsView() {
  const [query, setQuery] = React.useState("");
  const normalizedQuery = query.trim();
  const lookup = resolveFormularyRestrictionLookup(query);
  const sections = lookup.sections;
  const matchingMedicationNames = new Set(lookup.matchingMedicationNames);

  const lookupSummary = (() => {
    if (lookup.mode === "all") {
      return "21 alphabetic source sections · 109 complete medication entries · facility scope and source-page traceability preserved.";
    }
    if (lookup.mode === "medication") {
      return `${lookup.directEntryMatchCount} matching ${lookup.directEntryMatchCount === 1 ? "medication" : "medications"}; showing ${sections.length === 1 ? `the complete ${sections[0]?.letter} section` : `${sections.length} complete sections`}.`;
    }
    if (lookup.mode === "criteria") {
      return `${lookup.directEntryMatchCount} matching ${lookup.directEntryMatchCount === 1 ? "restriction entry" : "restriction entries"}; complete matching sections are expanded.`;
    }
    if (lookup.mode === "alphabetic") {
      return `Showing the complete ${sections[0]?.letter} section. No medication name in the approved source matches “${normalizedQuery}”.`;
    }
    return `No approved source section or entry matches “${normalizedQuery}”.`;
  })();

  const highlightMedication = (medication: string) => {
    if (!matchingMedicationNames.has(medication)) return medication;
    const tokens = [...new Set(normalizedQuery.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean))]
      .sort((a, b) => b.length - a.length)
      .map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const pattern = new RegExp(`(${tokens.join("|")})`, "gi");
    return medication.split(pattern).map((part, index) =>
      tokens.some((token) => new RegExp(`^${token}$`, "i").test(part))
        ? <mark key={`${part}-${index}`} className="rounded bg-yellow-300 px-0.5 text-black dark:bg-yellow-300 dark:text-black">{part}</mark>
        : <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>,
    );
  };

  return (
    <Panel>
      <div className="space-y-4">
        <div className="rounded-xl border bg-muted/25 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="w-full max-w-xl space-y-1.5">
              <Label htmlFor="formulary-restrictions-search">Search all 109 restricted medication entries</Label>
              <Input
                id="formulary-restrictions-search"
                type="search"
                placeholder="e.g. Sugammadex, pediatric only, CrCl 30, Restricted Antibiotic Policy…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <a
              href={FORMULARY_RESTRICTIONS_PROTOCOL.source.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              <FileText className="size-4" /> Open approved source <ExternalLink className="size-3.5" />
            </a>
          </div>
          <p aria-live="polite" className="mt-2 text-xs text-muted-foreground">
            {lookupSummary}
          </p>
        </div>

        {!normalizedQuery ? (
          <nav aria-label="Formulary restriction alphabetic index" className="flex flex-wrap gap-2">
            {FORMULARY_RESTRICTIONS_PROTOCOL.sections.map((section) => (
              <a
                key={section.letter}
                href={`#restriction-section-${section.letter.replace(/[^a-z0-9]/gi, "-")}`}
                className="rounded-lg border px-3 py-1.5 text-sm hover:border-primary/50 hover:bg-muted/40"
              >
                {section.letter} <span className="text-xs text-muted-foreground">({section.entries.length})</span>
              </a>
            ))}
          </nav>
        ) : null}

        {sections.length ? (
          <div className="space-y-3">
            {sections.map((section) => (
              <details
                id={`restriction-section-${section.letter.replace(/[^a-z0-9]/gi, "-")}`}
                key={`${section.letter}-${normalizedQuery.toLowerCase()}`}
                open={normalizedQuery ? true : undefined}
                className="group scroll-mt-32 overflow-hidden rounded-xl border"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 bg-muted/25 px-4 py-3 hover:bg-muted/50 [&::-webkit-details-marker]:hidden">
                  <span className="font-semibold">Section {section.letter}</span>
                  <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                    {section.entries.length} {section.entries.length === 1 ? "entry" : "entries"}
                    <span aria-hidden="true" className="transition-transform group-open:rotate-180">⌄</span>
                  </span>
                </summary>
                <div className="divide-y border-t">
                  {section.entries.length ? section.entries.map((entry) => (
                    <article key={`${entry.page}-${entry.medication}`} className="p-4 hover:bg-muted/20">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                        <div>
                          <h3 className="font-semibold">{highlightMedication(entry.medication)}</h3>
                          {entry.scope ? <p className="mt-0.5 text-xs font-medium text-primary">{entry.scope}</p> : null}
                        </div>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {entry.pageEnd ? `pp. ${entry.page}–${entry.pageEnd}` : `p. ${entry.page}`}
                        </span>
                      </div>
                      <p className="mt-3 whitespace-pre-line text-sm leading-relaxed">{entry.restriction}</p>
                    </article>
                  )) : (
                    <p className="p-4 text-sm text-muted-foreground">The source contains this alphabetic heading but no medication entries.</p>
                  )}
                </div>
              </details>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            No approved source section or entry matches “{query}”.
          </div>
        )}

        <details className="rounded-xl border">
          <summary className="cursor-pointer px-4 py-3 font-semibold">Source alerts requiring institutional awareness ({FORMULARY_RESTRICTIONS_PROTOCOL.sourceAlerts.length})</summary>
          <ul className="list-disc space-y-2 border-t px-8 py-4 text-sm leading-relaxed">
            {FORMULARY_RESTRICTIONS_PROTOCOL.sourceAlerts.map((alert) => <li key={alert}>{alert}</li>)}
          </ul>
        </details>

        <details className="rounded-xl border">
          <summary className="cursor-pointer px-4 py-3 font-semibold">Approved editorial correction ledger ({FORMULARY_RESTRICTIONS_PROTOCOL.approvedCorrections.length})</summary>
          <div className="space-y-2 border-t px-4 py-4 text-sm leading-relaxed">
            <p className="text-muted-foreground">The original PDF remains unchanged. Jarvis approved obvious editorial repairs for this rendered beta presentation on August 12, 2026.</p>
            <ul className="space-y-2">
              {FORMULARY_RESTRICTIONS_PROTOCOL.approvedCorrections.map((correction) => (
                <li key={correction.sourceText} className="rounded-lg bg-muted/35 px-3 py-2">
                  <span className="line-through text-muted-foreground">{correction.sourceText}</span>
                  <span aria-hidden="true"> → </span>
                  <strong>{correction.renderedText}</strong>
                </li>
              ))}
            </ul>
          </div>
        </details>

        <section className="rounded-xl border bg-muted/25 p-4">
          <h2 className="text-lg font-semibold">⚠️ Formulary Medications with Restrictions</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            January 2026 LifeBridge Health formulary restrictions. Search medication names, facility scope, dates, indications, criteria, and policy referrals.
          </p>
        </section>

        <section className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm leading-relaxed">
          <h3 className="font-semibold text-amber-950 dark:text-amber-100">Governing source note</h3>
          <p className="mt-2">{FORMULARY_RESTRICTIONS_PROTOCOL.governingNote}</p>
        </section>
      </div>
    </Panel>
  );
}

function InsulinView() {
  const [tdd, setTdd] = React.useState(40);
  return (
    <Panel
      title="💉 Insulin Switch"
      description="Product conversion starting points. High-alert — double-check concentrations (U-100 vs U-200/U-500)."
    >
      <div className="mb-4 flex flex-wrap items-end gap-3 rounded-xl border bg-muted/30 p-4">
        <div className="space-y-1.5">
          <Label htmlFor="tdd">Current total daily dose (units)</Label>
          <Input
            id="tdd"
            type="number"
            className="w-40"
            value={tdd}
            onChange={(e) => setTdd(Number(e.target.value))}
          />
        </div>
        <div className="text-sm text-muted-foreground">
          80% safety start ≈ <strong className="text-foreground">{formatNum(tdd * 0.8, 0)}</strong> units/day
        </div>
      </div>
      <div className="space-y-3">
        {INSULIN_SWITCH.map((row) => (
          <div key={row.from} className="rounded-xl border p-4">
            <div className="font-medium">
              {row.from} <span className="text-muted-foreground">→</span> {row.to}
            </div>
            <p className="mt-1 text-sm">{row.factor}</p>
            <p className="mt-1 text-xs text-muted-foreground">{row.tips}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function HeView() {
  return (
    <Panel title={`🧠 ${HE_PROTOCOL.title}`} description="Supportive pathway — not a substitute for specialist judgment.">
      <ol className="list-decimal space-y-2 pl-5 text-sm">
        {HE_PROTOCOL.steps.map((s) => (
          <li key={s} className="leading-relaxed">
            {s}
          </li>
        ))}
      </ol>
      <Separator className="my-4" />
      <div className="grid gap-3 md:grid-cols-3">
        {HE_PROTOCOL.meds.map((m) => (
          <div key={m.name} className="rounded-xl border p-3">
            <div className="font-semibold">{m.name}</div>
            <p className="mt-1 text-sm">{m.dose}</p>
            <p className="mt-1 text-xs text-muted-foreground">{m.note}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function HivView() {
  return (
    <Panel
      title="💊 HIV Formulary"
      description="Preferred agents for reference. Confirm resistance, HBV status, interactions, and ID plan."
    >
      <div className="space-y-3">
        {HIV_FORMULARY.map((r) => (
          <div key={r.regimen} className="rounded-xl border p-4">
            <div className="font-semibold">{r.regimen}</div>
            <p className="mt-1 text-sm text-primary">{r.use}</p>
            <p className="mt-1 text-xs text-muted-foreground">{r.notes}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function DntView() {
  const [q, setQ] = React.useState("");
  const query = q.trim().toLowerCase();
  const categories = DO_NOT_TUBE_PROTOCOL.categories.filter((category) => {
    const searchable = [
      category.title,
      category.detail,
      ...(category.groups ?? []).flatMap((group) => [
        group.title,
        ...(group.items ?? []),
      ]),
    ].join(" ").toLowerCase();
    return searchable.includes(query);
  });
  return (
    <Panel
      title="🚫 Appendix A: Do Not Tube List"
      description={DO_NOT_TUBE_PROTOCOL.introduction}
    >
      <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
        <p className="font-semibold text-amber-950 dark:text-amber-100">
          {DO_NOT_TUBE_PROTOCOL.medicationQualifier}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {DO_NOT_TUBE_PROTOCOL.policyReference}
        </p>
        <a
          href={DO_NOT_TUBE_PROTOCOL.source.href}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          <FileText className="size-4" />
          Open approved source · Updated {DO_NOT_TUBE_PROTOCOL.source.updated}
          <ExternalLink className="size-3.5" />
        </a>
      </div>
      <Input
        placeholder="Search medications, items, limits, or exceptions…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="mb-4 max-w-xl"
      />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <section
            key={category.number}
            className={`rounded-xl border border-destructive/20 bg-destructive/5 p-3 ${category.number === 1 ? "md:col-span-2 xl:col-span-3" : ""}`}
          >
            <div className="flex gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
                {category.number}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold">{category.title}</h3>
                {category.number !== 1 ? (
                  <p className="mt-1 text-sm leading-relaxed">{category.detail}</p>
                ) : null}
                {category.groups ? (
                  <div className="mt-3 columns-1 gap-3 lg:columns-2 2xl:columns-3">
                    {category.groups.map((group) => (
                      <div key={group.title} className="mb-3 break-inside-avoid rounded-lg border bg-background/80 p-3">
                        <h4 className="text-sm font-semibold">{group.title}</h4>
                        {group.items ? (
                          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                            {group.items.map((item) => <li key={item}>{item}</li>)}
                          </ul>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        ))}
        {categories.length === 0 ? (
          <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
            No approved Do Not Tube items match “{q}”. If unsure, contact Pharmacy.
          </p>
        ) : null}
      </div>
    </Panel>
  );
}

export function IvMedicationView({
  initialPopulation = "adult",
}: {
  initialPopulation?: "adult" | "pediatric";
}) {
  const [population, setPopulation] = React.useState<IvMedicationPopulation>(initialPopulation);
  const [unitId, setUnitId] = React.useState<string>(() =>
    initialPopulation === "pediatric"
      ? IV_MEDICATION_PEDIATRIC_PROTOCOL.defaultContext.unit
      : IV_MEDICATION_ADULT_PROTOCOL.defaultContext.unit,
  );
  const [query, setQuery] = React.useState("");
  const protocol = population === "pediatric" ? IV_MEDICATION_PEDIATRIC_PROTOCOL : IV_MEDICATION_ADULT_PROTOCOL;
  const units = population === "pediatric" ? IV_MEDICATION_PEDIATRIC_UNITS : IV_MEDICATION_UNITS;
  const lookup = resolveIvMedicationLookup(query, unitId, population);

  function selectPopulation(nextPopulation: IvMedicationPopulation) {
    const nextProtocol = nextPopulation === "pediatric"
      ? IV_MEDICATION_PEDIATRIC_PROTOCOL
      : IV_MEDICATION_ADULT_PROTOCOL;
    setPopulation(nextPopulation);
    setUnitId(nextProtocol.defaultContext.unit);
    setQuery("");
  }
  const routeCards = [
    { key: "ivp" as const, label: "IV Push", abbreviation: "IVP" },
    { key: "ivpb" as const, label: "IV Piggyback", abbreviation: "IVPB" },
    { key: "ci" as const, label: "Continuous Infusion", abbreviation: "CI" },
  ];
  const statusStyle = {
    allowed: "border-emerald-500/40 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100",
    conditional: "border-amber-500/40 bg-amber-500/10 text-amber-950 dark:text-amber-100",
    "emergency-only": "border-orange-500/40 bg-orange-500/10 text-orange-950 dark:text-orange-100",
    "not-permitted": "border-red-500/40 bg-red-500/10 text-red-950 dark:text-red-100",
    "not-listed": "border-border bg-muted/35 text-muted-foreground",
  } as const;
  const statusLabel = {
    allowed: "Allowed",
    conditional: "Conditional",
    "emergency-only": "Emergency only",
    "not-permitted": "Not permitted for unit",
    "not-listed": "Not listed",
  } as const;
  const unitGroups = ["General", "Monitored", "Critical Care", "Procedural"] as const;

  return (
    <Panel
      title={`💉 Intravenous Medication: ${population === "adult" ? "Adult" : "Pediatric"}`}
      description={`Search the approved April 2026 ${population === "adult" ? "Adult" : "Pediatric"} source by medication or brand, then verify IV route permission for the selected ${population === "adult" ? "Sinai inpatient" : "pediatric"} unit.`}
    >
      <div className="space-y-5">
        <div className="rounded-xl border bg-muted/20 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <fieldset className="inline-flex rounded-lg border bg-background p-1">
              <legend className="sr-only">Population protocol</legend>
              {(["adult", "pediatric"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={population === option}
                  onClick={() => selectPopulation(option)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    population === option ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {option === "adult" ? "Adult" : "Pediatric"}
                </button>
              ))}
            </fieldset>
            <a
              href={protocol.source.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              <FileText className="size-4" /> Open approved source PDF <ExternalLink className="size-3.5" />
            </a>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
            <Badge variant="secondary">{population === "adult" ? "Sinai Inpatient" : "Sinai Pediatric"}</Badge>
            <span>Effective {protocol.source.updated}</span>
            <span>·</span>
            <span>Reference #{protocol.referenceNumber}</span>
            <span>·</span>
            <span>{protocol.sourceRowCount} Appendix A source rows</span>
          </div>
        </div>

        <>
            <div className="grid gap-4 rounded-xl border p-4 lg:grid-cols-[minmax(220px,0.8fr)_minmax(280px,1.2fr)]">
              <div className="space-y-1.5">
                <Label htmlFor="iv-medication-unit">Select unit</Label>
                <select
                  id="iv-medication-unit"
                  value={unitId}
                  onChange={(event) => setUnitId(event.target.value)}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                >
                  {unitGroups.map((group) => (
                    <optgroup key={group} label={group}>
                      {units.filter((unit) => unit.group === group).map((unit) => (
                        <option key={unit.id} value={unit.id}>{unit.label}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground">
                  {lookup.unit
                    ? `${lookup.unit.sourceLabel} · inherited permissions: ${lookup.unit.permissions.join(" + ")}`
                    : <span className="text-destructive">{lookup.error}</span>}
                </p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="iv-medication-search">Search generic or brand name</Label>
                <Input
                  id="iv-medication-search"
                  type="search"
                  autoComplete="off"
                  placeholder="e.g. amiodarone, Cordarone, Kcentra, vancomycin…"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
                <p aria-live="polite" className="text-xs text-muted-foreground">
                  {query.trim()
                    ? lookup.unit
                      ? `${lookup.matches.length} ${lookup.matches.length === 1 ? "source match" : "source matches"} for ${lookup.unit.label}.`
                      : lookup.error
                    : "Choose the patient’s current unit, then search a medication or brand name."}
                </p>
              </div>
            </div>

            {query.trim() ? (
              lookup.matches.length ? (
                <div className="space-y-4">
                  {lookup.matches.map((result) => (
                    <article key={result.medication.id} className="overflow-hidden rounded-xl border">
                      <header className="flex flex-col gap-2 border-b bg-muted/25 px-4 py-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="font-semibold leading-snug">{result.medication.displayName}</h3>
                          {result.medication.aliases.length ? (
                            <p className="mt-1 text-xs text-muted-foreground">Also shown as: {result.medication.aliases.join(", ")}</p>
                          ) : null}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {result.medication.graceAvailable ? <Badge variant="secondary">+ Available at Grace</Badge> : null}
                          <Badge variant="outline">
                            {result.medication.pageEnd
                              ? `pp. ${result.medication.page}–${result.medication.pageEnd}`
                              : `p. ${result.medication.page}`}
                          </Badge>
                        </div>
                      </header>

                      <div className="grid gap-3 p-4 md:grid-cols-3">
                        {routeCards.map((route) => {
                          const resolution = result.routes[route.key];
                          return (
                            <section key={route.key} className={cn("rounded-xl border p-3", statusStyle[resolution.state])}>
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="text-xs font-semibold uppercase tracking-wide">{route.abbreviation}</div>
                                  <h4 className="font-semibold">{route.label}</h4>
                                </div>
                                <span className="rounded-full border border-current/20 px-2 py-0.5 text-[11px] font-semibold">
                                  {statusLabel[resolution.state]}
                                </span>
                              </div>
                              <p className="mt-3 text-xs leading-relaxed opacity-90">{resolution.reason}</p>
                              {resolution.sourceMarker ? (
                                <p className="mt-2 font-mono text-[11px]">Source marker: {resolution.sourceMarker}</p>
                              ) : null}
                            </section>
                          );
                        })}
                      </div>

                      <div className="grid gap-3 border-t px-4 py-4 md:grid-cols-2">
                        <section className="rounded-lg bg-muted/35 p-3">
                          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Central line</h4>
                          <p className="mt-1 text-sm">{result.medication.centralLineRequired || "Not marked as required"}</p>
                        </section>
                        <section className="rounded-lg bg-muted/35 p-3">
                          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Areas of Use</h4>
                          <p className="mt-1 text-sm whitespace-pre-line">{result.medication.areasOfUse || "No area text printed"}</p>
                        </section>
                        <section className="rounded-lg border border-primary/20 bg-primary/5 p-3 md:col-span-2">
                          <h4 className="text-xs font-semibold uppercase tracking-wide text-primary">Monitoring and Other Considerations</h4>
                          <p className="mt-1 text-sm leading-relaxed whitespace-pre-line">
                            {result.medication.considerations || "No additional consideration text printed in the source row."}
                          </p>
                        </section>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                  No approved Appendix A medication row matches “{query}”.
                </div>
              )
            ) : (
              <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                Search one of {protocol.medications.length} logical medications to see IVP, IVPB, CI, central-line, unit, and caveat details.
              </div>
            )}

            <details className="rounded-xl border border-amber-500/30 bg-amber-500/5">
              <summary className="cursor-pointer px-4 py-3 font-semibold text-amber-950 dark:text-amber-100">
                Preserved source ambiguities and conflicts ({protocol.sourceAlerts.length})
              </summary>
              <ul className="space-y-2 border-t border-amber-500/20 px-5 py-4 text-sm leading-relaxed">
                {protocol.sourceAlerts.map((alert) => <li key={alert}>• {alert}</li>)}
              </ul>
            </details>

            {population === "adult" ? (
              <details className="rounded-xl border">
                <summary className="cursor-pointer px-4 py-3 font-semibold">Adult procedural sedation reference (Appendix B)</summary>
              <div className="space-y-3 border-t p-4">
                {IV_MEDICATION_ADULT_PROTOCOL.proceduralSedationAdult.map((row) => (
                  <article key={row.drug} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="font-semibold">{row.drug}</h4>
                      <span className="text-xs text-muted-foreground">{row.pageEnd ? `pp. ${row.page}–${row.pageEnd}` : `p. ${row.page}`}</span>
                    </div>
                    <dl className="mt-2 grid gap-2 text-sm md:grid-cols-2">
                      <div><dt className="font-medium">Dose</dt><dd className="mt-0.5 text-muted-foreground">{row.dose}</dd></div>
                      <div><dt className="font-medium">Onset / peak</dt><dd className="mt-0.5 text-muted-foreground">{row.onsetPeak || "Not printed"}</dd></div>
                      <div><dt className="font-medium">Duration / reversal</dt><dd className="mt-0.5 text-muted-foreground">{[row.duration, row.reversal].filter(Boolean).join(" · ") || "Not printed"}</dd></div>
                      <div><dt className="font-medium">Side effects</dt><dd className="mt-0.5 text-muted-foreground">{row.sideEffects}</dd></div>
                    </dl>
                  </article>
                ))}
              </div>
              </details>
            ) : null}
          </>
      </div>
    </Panel>
  );
}

function ReferencesView() {
  return (
    <Panel
      title="📚 References"
      description="Original approved institutional protocols used by LBH protocol. Open the source to validate the rendered workflow."
    >
      <div className="space-y-3">
        {PROTOCOL_REFERENCES.map((reference) => (
          <article key={reference.id} className="rounded-xl border p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{reference.title}</h3>
                  <Badge variant="secondary">Institutional source</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{reference.authority}</p>
                <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
                  <div><dt className="inline font-medium">Updated: </dt><dd className="inline">{reference.updated}</dd></div>
                  <div><dt className="inline font-medium">Pages: </dt><dd className="inline">{reference.pageCount}</dd></div>
                  <div><dt className="inline font-medium">Applies to: </dt><dd className="inline">{reference.affectedViews.map((view) => NAV.find((item) => item.id === view)?.label ?? view).join(", ")}</dd></div>
                  <div><dt className="inline font-medium">Integrity: </dt><dd className="inline font-mono text-xs">{reference.sha256.slice(0, 12)}…</dd></div>
                </dl>
              </div>
              <a
                href={reference.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
              >
                <FileText className="size-4" /> Open source PDF <ExternalLink className="size-3.5" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </Panel>
  );
}

function DncView() {
  const [query, setQuery] = React.useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const tables = searchDoNotCrush(query);
  const rowCount = tables.reduce((total, table) => total + table.rows.length, 0);
  const contextCount = tables.filter((table) => table.tableMatch || table.noteMatch).length;

  return (
    <Panel
      title="🚫 LBH Do Not Crush List — Appendix A"
      description="January 2026 LBH formulary guidance for medications that cannot be crushed/opened, require handling precautions, have taste limitations, or need special administration instructions."
    >
      <div className="space-y-4">
        <div className="rounded-xl border bg-muted/25 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="w-full max-w-xl space-y-1.5">
              <Label htmlFor="do-not-crush-search">Search all 100 source rows</Label>
              <Input
                id="do-not-crush-search"
                type="search"
                placeholder="e.g. Revlimid, small bore tubes, PPE, 25ml of water…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <a
              href={DO_NOT_CRUSH_PROTOCOL.source.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              <FileText className="size-4" /> Open approved source <ExternalLink className="size-3.5" />
            </a>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {normalizedQuery
              ? `${rowCount} direct ${rowCount === 1 ? "row match" : "row matches"}${contextCount ? ` · ${contextCount} source-context ${contextCount === 1 ? "match" : "matches"}` : ""} across ${tables.length} ${tables.length === 1 ? "table" : "tables"}.`
              : "4 source tables · 100 complete medication rows · administration comments and source-page traceability preserved."}
          </p>
          <p className="mt-2 text-sm font-medium text-amber-950 dark:text-amber-100">
            {DO_NOT_CRUSH_PROTOCOL.formularyQualifier}
          </p>
        </div>

        {!normalizedQuery ? (
          <nav aria-label="Do Not Crush table index" className="grid gap-2 sm:grid-cols-2">
            {DO_NOT_CRUSH_PROTOCOL.tables.map((table) => (
              <a
                key={table.number}
                href={`#do-not-crush-table-${table.number}`}
                className="rounded-lg border px-3 py-2 text-sm hover:border-primary/50 hover:bg-muted/40"
              >
                <span className="mr-2 font-mono text-xs text-muted-foreground">Table {table.number}</span>
                {table.title}
                <span className="ml-2 text-xs text-muted-foreground">({table.rows.length})</span>
              </a>
            ))}
          </nav>
        ) : null}

        {tables.length ? (
          <div className="space-y-3">
            {tables.map((table) => (
              <details
                id={`do-not-crush-table-${table.number}`}
                key={table.number}
                open={normalizedQuery ? true : undefined}
                className="group scroll-mt-32 overflow-hidden rounded-xl border"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 bg-muted/25 px-4 py-3 hover:bg-muted/50 [&::-webkit-details-marker]:hidden">
                  <span className="font-semibold">
                    <span className="mr-2 font-mono text-xs text-muted-foreground">Table {table.number}</span>
                    {table.title}
                  </span>
                  <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                    {table.rows.length} {table.rows.length === 1 ? "row" : "rows"}
                    <span aria-hidden="true" className="transition-transform group-open:rotate-180">⌄</span>
                  </span>
                </summary>
                <div className="border-t">
                  {table.rows.length ? (
                    <p className="border-b px-4 py-2 text-xs text-muted-foreground sm:hidden">
                      Swipe horizontally to view all table columns.
                    </p>
                  ) : null}
                  {table.rows.length ? (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[760px] text-left text-sm">
                        <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                          <tr>
                            <th className="w-[28%] px-3 py-2">Generic (active ingredient)</th>
                            <th className="w-[22%] px-3 py-2">Drug brand name</th>
                            <th className="w-[42%] px-3 py-2">Administration comments</th>
                            <th className="px-3 py-2">Source</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {table.rows.map((row, rowIndex) => (
                            <tr key={`${row.page}-${rowIndex}-${row.generic}`} className="align-top hover:bg-muted/20">
                              <td className="whitespace-pre-line px-3 py-2.5 font-medium leading-relaxed">{row.generic}</td>
                              <td className="whitespace-pre-line px-3 py-2.5 leading-relaxed">{row.brand}</td>
                              <td className="whitespace-pre-line px-3 py-2.5 leading-relaxed">{row.comments}</td>
                              <td className="whitespace-nowrap px-3 py-2.5 text-xs text-muted-foreground">
                                {row.pageEnd ? `pp. ${row.page}–${row.pageEnd}` : `p. ${row.page}`}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="px-4 py-3 text-sm text-muted-foreground">
                      Source context matches; no individual medication row contains this search term.
                    </p>
                  )}
                </div>
              </details>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            No source rows or governing notes match “{query}”.
          </div>
        )}

        <section className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
          <h3 className="font-semibold text-amber-950 dark:text-amber-100">Source notes</h3>
          <div className="mt-2 space-y-3 text-sm leading-relaxed">
            {DO_NOT_CRUSH_PROTOCOL.notes.map((note) => <p key={note}>{note}</p>)}
          </div>
        </section>

        <details className="rounded-xl border">
          <summary className="cursor-pointer px-4 py-3 font-semibold">Source citations ({DO_NOT_CRUSH_PROTOCOL.references.length})</summary>
          <ul className="space-y-2 border-t px-4 py-4 text-sm leading-relaxed text-muted-foreground">
            {DO_NOT_CRUSH_PROTOCOL.references.map((reference) => (
              <li key={reference.label} className="grid grid-cols-[2.5rem_1fr] gap-2">
                <span className="font-mono text-xs text-foreground">
                  {reference.label}
                </span>
                <span>{reference.text}</span>
              </li>
            ))}
          </ul>
        </details>
      </div>
    </Panel>
  );
}

export function CalculatorViews({
  view,
  onNavigate,
}: {
  view: ViewId;
  onNavigate: (id: ViewId) => void;
}) {
  const { resetVersion } = usePatient();

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[320px_1fr]">
      <aside className={cn("lg:sticky lg:top-28 lg:self-start", view === "iv-medication" && "order-2 lg:order-1")}>
        <PatientProfileCard />
      </aside>
      <section
        key={`${view}-${resetVersion}`}
        className={cn("min-w-0", view === "iv-medication" && "order-1 lg:order-2")}
      >
        {view === "home" && <HomeView onNavigate={onNavigate} />}
        {view === "crcl-bmi" && <CrClBmiView />}
        {view === "dose-rounding" && <DoseRoundingView />}
        {view === "renal-dosing" && <RenalView />}
        {view === "therapeutic-sub" && <TherapeuticSubView />}
        {view === "crrt-dosing" && <CrrtView />}
        {view === "iv-po" && <IvPoView />}
        {view === "iv-medication" && <IvMedicationView />}
        {view === "restrictions" && <RestrictionsView />}
        {view === "insulin-switch" && <InsulinView />}
        {view === "he" && <HeView />}
        {view === "hiv" && <HivView />}
        {view === "dnt" && <DntView />}
        {view === "dnc" && <DncView />}
        {view === "references" && <ReferencesView />}
      </section>
    </div>
  );
}
