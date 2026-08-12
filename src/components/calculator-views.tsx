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
  HE_PROTOCOL,
  HIV_FORMULARY,
  INSULIN_SWITCH,
  IV_PO,
  NAV,
  RENAL_DOSING,
  RESTRICTIONS,
  PROTOCOL_REFERENCES,
  searchDoNotCrush,
  searchTherapeuticSubstitutions,
  THERAPEUTIC_SUBSTITUTION_PROTOCOL,
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
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div {...fade}>
      <Card className="shadow-sm">
        <CardHeader className="border-b [.border-b]:pb-3">
          <CardTitle className="text-lg">{title}</CardTitle>
          {description ? (
            <CardDescription className="text-sm leading-relaxed">
              {description}
            </CardDescription>
          ) : null}
        </CardHeader>
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
  return (
    <Panel
      title="💊 IV → PO Conversion"
      description="Convert when clinically stable, functioning GI tract, and no NPO restriction."
    >
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-2">IV</th>
              <th className="px-3 py-2">PO</th>
              <th className="px-3 py-2">Ratio</th>
              <th className="px-3 py-2">Criteria</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {IV_PO.map((r) => (
              <tr key={r.iv} className="hover:bg-muted/30">
                <td className="px-3 py-2 font-medium">{r.iv}</td>
                <td className="px-3 py-2">{r.po}</td>
                <td className="px-3 py-2">{r.ratio}</td>
                <td className="px-3 py-2 text-muted-foreground">{r.criteria}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function RestrictionsView() {
  return (
    <Panel
      title="⚠️ Formulary Restrictions"
      description="Stewardship and high-cost agents. Follow LBH approval pathways."
    >
      <div className="space-y-3">
        {RESTRICTIONS.map((r) => (
          <div key={r.drug} className="rounded-xl border p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold">{r.drug}</span>
              <Badge variant="outline">Restricted</Badge>
            </div>
            <p className="mt-2 text-sm">{r.restriction}</p>
            <p className="mt-1 text-xs text-muted-foreground">Alternatives: {r.alt}</p>
          </div>
        ))}
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

function ReferencesView() {
  return (
    <Panel
      title="📚 References"
      description="Original approved institutional protocols used by LBH Protocols Beta. Open the source to validate the rendered workflow."
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
  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[320px_1fr]">
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <PatientProfileCard />
      </aside>
      <section className="min-w-0">
        {view === "home" && <HomeView onNavigate={onNavigate} />}
        {view === "crcl-bmi" && <CrClBmiView />}
        {view === "dose-rounding" && <DoseRoundingView />}
        {view === "renal-dosing" && <RenalView />}
        {view === "therapeutic-sub" && <TherapeuticSubView />}
        {view === "crrt-dosing" && <CrrtView />}
        {view === "iv-po" && <IvPoView />}
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
