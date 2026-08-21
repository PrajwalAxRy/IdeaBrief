import { CapabilityMatrix } from '@/components/figures/capability-matrix';
import { DimensionStrip } from '@/components/figures/dimension-strip';
import { FIG_H, Figure, type FigureSource } from '@/components/figures/figure';
import { GapBar } from '@/components/figures/gap-bar';
import { NumberCallout } from '@/components/figures/number-callout';
import { RecencyStrip } from '@/components/figures/recency-strip';
import { RunFunnel } from '@/components/figures/run-funnel';
import { StanceBar } from '@/components/figures/stance-bar';
import { ValueLadder } from '@/components/figures/value-ladder';
import { Reveal } from '@/components/ui/reveal';
import {
  citationCoverage,
  recencyTicks,
  stanceByDimension,
  stanceOverall,
} from '@/lib/analytics/evidence-stats';
import {
  type CalloutModel,
  capabilityMatrix,
  numberCallouts,
  priceLadder,
  roiGap,
  runFunnel,
} from '@/lib/analytics/report-figures';
import { REPORT } from '@/lib/content/app';
import type { RunSummary } from '@/lib/run-summary';
import { DIMENSIONS, type Dimension, type Evidence } from '@/lib/schemas/evidence';
import type { Report } from '@/lib/schemas/report';
import type { ReactNode } from 'react';

/**
 * **The one place that maps a section or dimension to its aside stack.**
 *
 * Server component. It imports the frozen analytics API (C10) at those exact
 * spellings and introduces no `build*` variant of any of them; every number
 * below is derived and none is typed into a component.
 *
 * **A9 ships the frames; A10 draws the marks.** Each slot here is already the
 * real `Figure` — real caption, real citations or source, real footer — with
 * the mark area at its exact final height, filled with the figure's own raw
 * numbers as a plain mono list. A10 replaces `FigureNumbers` with the drawn
 * mark at the same height, so the swap is provably zero-shift: A9 records the
 * measured height array and A10 replays it.
 *
 * That also satisfies rule 14 and rule 12 at once — the report is genuinely
 * finished at the end of A9, with no blank div anywhere on it.
 */

/* ------------------------------------------------------------- formatting --- */

function num(value: number): string {
  return value.toLocaleString('en-US');
}

/**
 * The display strings, derived from the facts. **No figure formats a number**,
 * so the formatting happens once, here, at the point the model becomes a
 * component prop.
 */
export function calloutDisplay(model: CalloutModel): {
  value: string;
  unit?: string;
  secondary?: string;
} {
  const facts = model.facts;
  const [first, second] = facts;

  switch (model.form) {
    case 'transition':
      return { value: `${num(first.value)}% → ${num(second.value)}%` };
    case 'of':
      return { value: `${num(first.value)} of ${num(second.value)}` };
    case 'band':
      return { value: `${num(first.value)}–${num(second.value)}`, unit: first.unit };
    case 'compound':
      return {
        value: num(first.value),
        secondary: `${num(second.value)}% ${second.label}`,
      };
    default:
      if (first.unit === '%') return { value: `${num(first.value)}%` };
      if (first.unit === 'events/min') return { value: `${num(first.value)}/min` };
      if (first.unit === 's') return { value: num(first.value), unit: first.unit };
      return { value: num(first.value) };
  }
}

/* ------------------------------------------------------------ the stack --- */

/**
 * One aside stack, staggered 90ms apart and capped at six.
 *
 * `Reveal` is reused rather than a second client component: it already carries
 * `data-shown` and `--ob-reveal-delay`, and §11 neutralises `.ob-reveal`'s own
 * hide so **nothing on this page is invisible without JavaScript** — the only
 * thing `data-shown` drives here is the bars' `scaleX`.
 */
const STAGGER_MS = 90;
const STAGGER_CAP = 6;

function Stack({ children }: { children: ReactNode[] }) {
  return (
    <div className="ob-rfig-stack">
      {children.map((child, index) => (
        <Reveal
          // biome-ignore lint/suspicious/noArrayIndexKey: a fixed, never-reordered aside stack
          key={index}
          className="ob-rfig-slot"
          delayMs={Math.min(index, STAGGER_CAP) * STAGGER_MS}
        >
          {child}
        </Reveal>
      ))}
    </div>
  );
}

/* --------------------------------------------------------------- the build --- */

export interface ReportFigures {
  strip: ReactNode;
  overallStance: ReactNode;
  summaryAside: ReactNode;
  dimensionAsides: Record<Dimension, ReactNode>;
  capabilityMatrix: ReactNode;
}

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
function monthLabel(iso: string): string {
  const [year, month] = iso.split('-');
  return `${MONTHS[Number(month) - 1]} ${year}`;
}

/** The five strips share one Jan–Dec axis; they are only comparable if it is shared. */
const AXIS_FROM = '2025-01-01';
const AXIS_TO = '2025-12-31';

export function buildReportFigures({
  slug,
  report,
  evidence,
  summary,
}: {
  slug: string;
  report: Report;
  evidence: Evidence;
  summary: RunSummary;
}): ReportFigures {
  const corpusSource: FigureSource = {
    label: `ALL ${evidence.length} FINDINGS`,
    href: `/r/${slug}/sources`,
  };
  const overall = stanceOverall(evidence);
  const byDimension = stanceByDimension(evidence);

  /* Each cell is an in-page link, which is what stops the five `#dimension-*`
     ids being orphans — the section index only links `<h2>`-bearing sections. */
  const stripMax = Math.max(...DIMENSIONS.map((d) => report.dimensions[d].meta.count));
  const strip = (
    <DimensionStrip
      source={corpusSource}
      cells={DIMENSIONS.map((dimension) => {
        const stance = byDimension[dimension];
        const data = report.dimensions[dimension];
        return {
          key: dimension,
          count: data.meta.count,
          max: stripMax,
          supports: stance.supports,
          neutral: stance.neutral,
          contests: stance.contests,
          confidence: data.confidence,
          href: `#dimension-${dimension}`,
        };
      })}
    />
  );

  const overallStance = (
    <StanceBar
      caption={`STANCE ACROSS ALL ${evidence.length} FINDINGS`}
      supports={overall.supports}
      neutral={overall.neutral}
      contests={overall.contests}
      source={corpusSource}
    />
  );

  /* One component, two densities (C8). The report renders `compact`;
     `/sources` §01 owns the expanded version with the reason breakout, and A13
     does not delete this one. The bars are shares of the largest segment, 47 —
     never of a total. Nothing here sums to anything, because `47 / 65` looks
     like a pass rate and this product does not publish pass rates. */
  const summaryAside = (
    <Stack>
      {[
        <RunFunnel
          key="funnel"
          rows={runFunnel(summary)}
          variant="compact"
          source={{ label: 'THE FULL RUN →', href: `/r/${slug}/sources#the-run` }}
        />,
      ]}
    </Stack>
  );

  function calloutFigure(
    model: CalloutModel,
    options: { lead?: boolean; contests?: boolean; note?: string } = {},
  ) {
    const display = calloutDisplay(model);
    /* The `transition` form is two numbers with a `→` between them, so it gets
       the bars that show the drop — and a smaller value size, because at 56px
       the string wraps to a second line and overflows a 96px mark. */
    const compare =
      model.form === 'transition'
        ? { from: model.facts[0].value, to: model.facts[1].value }
        : undefined;
    return (
      <Figure
        key={model.findingId}
        caption={model.label}
        height={options.lead ? FIG_H.calloutLead : FIG_H.callout}
        citations={[model.citation]}
        stance={options.contests ? 'challenges' : undefined}
        note={options.note}
        className={[
          options.lead ? 'ob-rfig-lead' : '',
          options.contests ? 'ob-rfig-contest' : '',
          compare ? 'ob-rfig-transition' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <NumberCallout
          value={display.value}
          unit={display.unit}
          secondary={display.secondary}
          compare={compare}
          citations={[model.citation]}
          emphasis={options.lead ? 'lead' : undefined}
        />
      </Figure>
    );
  }

  /* All five share one Jan–Dec axis: the strips are only comparable if the
     scale is. PRACTICAL's two ticks in Sep–Oct against eleven empty months is
     the most informative thing on that strip. */
  function recencyFigure(dimension: Dimension) {
    const ticks = recencyTicks(evidence, report, dimension);
    return (
      <RecencyStrip
        key={`recency-${dimension}`}
        caption="WHEN THIS WAS PUBLISHED"
        ticks={ticks}
        from={AXIS_FROM}
        to={AXIS_TO}
        source={{
          label: `${ticks.length} FINDINGS · ${monthLabel(AXIS_FROM)} – ${monthLabel(AXIS_TO)}`,
          href: `/r/${slug}/sources?dim=${dimension}`,
        }}
      />
    );
  }

  /* PROBLEM: the three quantities the paragraph cites, in citation order, then
     the strip. `18%` is the report's one quantified counter-signal and takes
     the contests treatment — the same size as the two above it, neither
     demoted nor amplified. */
  const problemCallouts = numberCallouts(evidence, 'PROBLEM');
  const problemAside = (
    <Stack>
      {[
        ...problemCallouts.map((model) =>
          calloutFigure(model, {
            contests: model.citation === 9,
            note: model.citation === 9 ? REPORT.figures.counterSignalNote : undefined,
          }),
        ),
        recencyFigure('PROBLEM'),
      ]}
    </Stack>
  );

  /* WHAT_EXISTS: `0 of 9` is the wedge the whole idea rests on and is the only
     callout in the report that gets lead emphasis. `30 s` belongs to
     PRACTICAL's constraints group, not here. */
  const existsCallouts = numberCallouts(evidence, 'WHAT_EXISTS').filter(
    (model) => model.citation !== 20,
  );
  const existsAside = (
    <Stack>
      {[
        ...existsCallouts.map((model) => calloutFigure(model, { lead: model.citation === 19 })),
        recencyFigure('WHAT_EXISTS'),
      ]}
    </Stack>
  );

  const demandAside = (
    <Stack>
      {[
        ...numberCallouts(evidence, 'DEMAND_SIGNALS').map((model) => calloutFigure(model)),
        recencyFigure('DEMAND_SIGNALS'),
      ]}
    </Stack>
  );

  const ladder = priceLadder(evidence);
  const gap = roiGap(evidence);
  const money = byDimension.MONEY;
  const moneyAside = (
    <Stack>
      {[
        /* The report's most decision-critical comparison, and it was invisible
           — spread across three paragraphs and two ellipsised meta lines. */
        <ValueLadder
          key="ladder"
          rungs={ladder}
          axisMax={320}
          ticks={[0, 100, 200, 300]}
          citations={[...new Set(ladder.flatMap((rung) => rung.citations))].sort((a, b) => a - b)}
          note={REPORT.figures.ladderNote}
        />,
        /* **Bar B is nearly invisible and that is the finding.** No broken
           axis, no log scale, no inset. EV_26 is a *stated willingness to pay*
           and is never used as the tool cost here — the cost side reads only
           the ladder's published `point` rungs. */
        <GapBar
          key="gap"
          caption="WHAT’S LOST VS WHAT IT COSTS"
          a={{
            label: 'Lost production',
            display: `$${num(gap.lostLow)}–${num(gap.lostHigh)}/mo`,
            low: gap.lostLow,
            high: gap.lostHigh,
            citations: [41],
          }}
          b={{
            label: 'What a tool like this costs',
            display: `$${num(gap.costLow)}–${num(gap.costHigh)}/mo`,
            low: gap.costLow,
            high: gap.costHigh,
            citations: [33, 34],
          }}
          ratio={`${Math.round(gap.ratioLow)}–${Math.round(gap.ratioHigh)}×`}
          citations={[33, 34, 41]}
        />,
        <StanceBar
          key="money-stance"
          caption="STANCE IN MONEY"
          supports={money.supports}
          neutral={money.neutral}
          contests={money.contests}
          source={corpusSource}
        />,
        recencyFigure('MONEY'),
      ]}
    </Stack>
  );

  /* PRACTICAL: three hard numbers currently written as one 40-word sentence.
     One of them is a WHAT_EXISTS finding, and pulling it in is correct — a
     constraints figure restricted to PRACTICAL's own two findings would
     understate what is actually known. */
  const constraintModels = [
    ...numberCallouts(evidence, 'PRACTICAL'),
    ...numberCallouts(evidence, 'WHAT_EXISTS').filter((model) => model.citation === 20),
  ].sort((a, b) => a.citation - b.citation);

  const practicalAside = (
    <Stack>
      {[
        <Figure
          key="constraints"
          caption="HARD CONSTRAINTS"
          height={FIG_H.constraints}
          citations={constraintModels.map((model) => model.citation).sort((a, b) => a - b)}
          note={REPORT.figures.practicalNote}
        >
          <div className="ob-rfig-rows">
            {constraintModels.map((model) => {
              const display = calloutDisplay(model);
              return (
                <NumberCallout
                  key={model.findingId}
                  size="compact"
                  value={display.value}
                  unit={display.unit}
                  label={model.label}
                  citations={[model.citation]}
                />
              );
            })}
          </div>
        </Figure>,
        recencyFigure('PRACTICAL'),
      ]}
    </Stack>
  );

  const matrix = capabilityMatrix(report);
  const capabilityMatrixFigure = <CapabilityMatrix model={matrix} citations={matrix.citations} />;

  return {
    strip,
    overallStance,
    summaryAside,
    dimensionAsides: {
      PROBLEM: problemAside,
      WHAT_EXISTS: existsAside,
      DEMAND_SIGNALS: demandAside,
      MONEY: moneyAside,
      PRACTICAL: practicalAside,
    },
    capabilityMatrix: capabilityMatrixFigure,
  };
}

/** The uncited findings per dimension — `EvidenceRail`'s whole reason to exist. */
export function uncitedByDimension(
  report: Report,
  evidence: Evidence,
): Record<Dimension, Evidence> {
  const { uncited } = citationCoverage(report, evidence);
  return Object.fromEntries(
    DIMENSIONS.map((dimension) => [
      dimension,
      evidence.filter(
        (finding) =>
          finding.dimension === dimension && uncited.has(Number(finding.id.replace('EV_', ''))),
      ),
    ]),
  ) as Record<Dimension, Evidence>;
}
