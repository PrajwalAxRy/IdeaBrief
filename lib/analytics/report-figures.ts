import type { RunSummary } from '../run-summary';
import type { Dimension, Evidence, Fact, Finding } from '../schemas/evidence';
import {
  CAPABILITY_KEYS,
  type CapabilityKey,
  type CapabilityLevel,
  type Report,
} from '../schemas/report';

/**
 * The report's figure models. Pure, derived from validated data, and frozen at
 * C10 — every mark in `components/figures/` reads a function here and none of
 * them types a number.
 *
 * `factsFor` and `factsInSeries` are module-private on purpose: they are how
 * these models are built, not part of the contract.
 */

/* --------------------------------------------------------------- private --- */

function citationOf(finding: Finding): number {
  return Number(finding.id.replace('EV_', ''));
}

function factsFor(evidence: Evidence, predicate: (f: Finding) => boolean): Finding[] {
  return evidence.filter((finding) => predicate(finding) && finding.facts !== undefined);
}

function factsInSeries(evidence: Evidence, series: string): Finding[] {
  return factsFor(evidence, (f) => (f.facts ?? []).some((fact) => fact.series === series));
}

/** The shared stem of a grouped callout's fact labels, where there is one. */
function sharedLabel(facts: Fact[]): string {
  if (facts.length === 1) return facts[0].label;
  const [first, ...rest] = facts.map((f) => f.label);
  let stem = first;
  for (const label of rest) {
    let i = 0;
    while (i < stem.length && i < label.length && stem[i] === label[i]) i += 1;
    stem = stem.slice(0, i);
  }
  const trimmed = stem.replace(/[\s,–-]+$/, '');
  return trimmed.length >= 4 ? trimmed : first;
}

/* ---------------------------------------------------------- price ladder --- */

export type LadderRung =
  | { form: 'band'; low: number; high: number; unit: string; label: string; citations: number[] }
  | { form: 'point'; value: number; unit: string; label: string; citations: number[] }
  | { form: 'threshold'; value: number; unit: string; label: string; citations: number[] };

/**
 * The strongest single figure in the report: the stated willingness-to-pay
 * band straddles both competitors and stops one dollar under the
 * owner-approval ceiling.
 *
 * The three forms are derived, not typed. A finding contributing two facts to
 * the series is one claim with two ends and draws as a **band** — drawing it
 * as two points would put a willingness-to-pay figure on the same footing as a
 * published price. A single fact whose label names a threshold draws as a
 * dashed **threshold**; everything else is a **point**.
 */
const LADDER_THRESHOLD_MARKER = /threshold/i;

export function priceLadder(evidence: Evidence): LadderRung[] {
  const rungs: LadderRung[] = [];

  for (const finding of factsInSeries(evidence, 'price_ladder')) {
    const facts = (finding.facts ?? []).filter((f) => f.series === 'price_ladder');
    const citations = [citationOf(finding)];

    if (facts.length > 1) {
      const values = facts.map((f) => f.value).sort((a, b) => a - b);
      rungs.push({
        form: 'band',
        low: values[0],
        high: values[values.length - 1],
        unit: facts[0].unit,
        label: sharedLabel(facts),
        citations,
      });
      continue;
    }

    const [fact] = facts;
    rungs.push({
      form: LADDER_THRESHOLD_MARKER.test(fact.label) ? 'threshold' : 'point',
      value: fact.value,
      unit: fact.unit,
      label: fact.label,
      citations,
    });
  }

  return rungs.sort(
    (a, b) => (a.form === 'band' ? a.low : a.value) - (b.form === 'band' ? b.low : b.value),
  );
}

/* --------------------------------------------------------------- ROI gap --- */

export interface RoiGap {
  lostLow: number;
  lostHigh: number;
  costLow: number;
  costHigh: number;
  ratioLow: number;
  ratioHigh: number;
}

/**
 * Lost production against what a tool like this costs.
 *
 * **EV_26 is a willingness to pay and is never used as a tool price.** That
 * substitution is what produced the `$3,000 vs $200, 15×` figure an audit
 * found, and there is no finding anywhere in the corpus containing either
 * number. It cannot recur here: the cost side reads only the ladder's `point`
 * rungs — published competitor prices — and EV_26 is a `band` while EV_42 is a
 * `threshold`.
 *
 * **Both ratios divide by the same denominator, `costLow`**, because a band
 * divided by a band produces four ratios and only one of them is a sentence.
 * The bar prints both ranges in full with every citation, so a reader can do
 * the other three divisions themselves.
 */
export function roiGap(evidence: Evidence): RoiGap {
  const lostFacts = factsInSeries(evidence, 'roi_gap').flatMap((f) =>
    (f.facts ?? []).filter((fact) => fact.series === 'roi_gap'),
  );
  const lost = lostFacts.map((f) => f.value).sort((a, b) => a - b);

  const prices = priceLadder(evidence)
    .filter((rung): rung is Extract<LadderRung, { form: 'point' }> => rung.form === 'point')
    .map((rung) => rung.value)
    .sort((a, b) => a - b);

  const [lostLow, lostHigh] = [lost[0], lost[lost.length - 1]];
  const [costLow, costHigh] = [prices[0], prices[prices.length - 1]];

  return {
    lostLow,
    lostHigh,
    costLow,
    costHigh,
    ratioLow: lostLow / costLow,
    ratioHigh: lostHigh / costLow,
  };
}

/* ---------------------------------------------------- capability matrix --- */

export interface MatrixModel {
  capabilities: CapabilityKey[];
  competitors: Array<{
    name: string;
    cells: Array<{ key: CapabilityKey; level: CapabilityLevel; citations: number[] }>;
  }>;
  /** No `level`, deliberately — C7. There is nothing to draw a mark from. */
  idea: Array<{ key: CapabilityKey; claimed: boolean }>;
  /** The footer set, ascending. */
  citations: number[];
}

export function capabilityMatrix(report: Report): MatrixModel {
  const citations = new Set<number>();

  const competitors = report.competitors.map((competitor) => ({
    name: competitor.name,
    cells: CAPABILITY_KEYS.map((key) => {
      const cell = competitor.capabilities.find((c) => c.key === key);
      if (!cell) throw new Error(`${competitor.name} is missing capability ${key}`);
      for (const n of cell.citations) citations.add(n);
      return { key, level: cell.level, citations: cell.citations };
    }),
  }));

  return {
    capabilities: [...CAPABILITY_KEYS],
    competitors,
    idea: CAPABILITY_KEYS.map((key) => ({
      key,
      claimed: report.idea_capabilities.includes(key),
    })),
    citations: [...citations].sort((a, b) => a - b),
  };
}

/* ------------------------------------------------------------ run funnel --- */

/**
 * **The segments are proportional to the largest, not percentages of a whole.
 * Nothing here sums to anything.** `47 / 65` looks like a pass rate, and this
 * product does not publish pass rates — someone will try to normalise this,
 * and two drafts already did.
 */
export function runFunnel(summary: RunSummary): { label: string; value: number; share: number }[] {
  const rows = [
    { label: 'QUERIES', value: summary.query_count },
    { label: 'PAGES', value: summary.pages_fetched },
    { label: 'VERIFIED', value: summary.verified_count },
    { label: 'DISCARDED', value: summary.discarded_count },
  ];
  const max = Math.max(...rows.map((r) => r.value));
  return rows.map((row) => ({ ...row, share: row.value / max }));
}

/* -------------------------------------------------------- number callouts --- */

export type CalloutForm = 'single' | 'band' | 'transition' | 'of' | 'compound';

export interface CalloutModel {
  findingId: string;
  citation: number;
  form: CalloutForm;
  facts: Fact[];
  label: string;
}

/**
 * The form comes from this table keyed by series, not from inspecting values.
 * `price_ladder` and `roi_gap` are excluded outright — they belong to their
 * own marks.
 *
 * **`emphasis` is not a field on this model.** It is a `NumberCallout` prop,
 * spent exactly once in the whole report, on `0 of 9` [19]. Spending it twice
 * spends it.
 */
const CALLOUT_FORM_BY_SERIES: Record<string, CalloutForm> = {
  no_show: 'transition',
  coverage: 'of',
  market: 'compound',
  partner: 'band',
};

const SERIES_WITH_THEIR_OWN_MARK = new Set(['price_ladder', 'roi_gap']);

export function numberCallouts(evidence: Evidence, dimension: Dimension): CalloutModel[] {
  const callouts: CalloutModel[] = [];

  for (const finding of evidence) {
    if (finding.dimension !== dimension) continue;

    const facts = (finding.facts ?? []).filter(
      (fact) =>
        fact.callout === true && !(fact.series && SERIES_WITH_THEIR_OWN_MARK.has(fact.series)),
    );
    if (facts.length === 0) continue;

    const series = facts[0].series;
    callouts.push({
      findingId: finding.id,
      citation: citationOf(finding),
      form: series ? (CALLOUT_FORM_BY_SERIES[series] ?? 'single') : 'single',
      facts,
      label: sharedLabel(facts),
    });
  }

  return callouts;
}
