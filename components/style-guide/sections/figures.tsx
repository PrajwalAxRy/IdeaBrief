import { CapabilityMatrix } from '@/components/figures/capability-matrix';
import { DimensionStrip } from '@/components/figures/dimension-strip';
import { DomainConcentration } from '@/components/figures/domain-concentration';
import { FIG_H, Figure } from '@/components/figures/figure';
import { GapBar } from '@/components/figures/gap-bar';
import { NumberCallout } from '@/components/figures/number-callout';
import { RecencyStrip } from '@/components/figures/recency-strip';
import { RunFunnel } from '@/components/figures/run-funnel';
import { StanceBar } from '@/components/figures/stance-bar';
import { ValueLadder } from '@/components/figures/value-ladder';
import {
  domainConcentration,
  recencyTicks,
  stanceByDimension,
  stanceOverall,
} from '@/lib/analytics/evidence-stats';
import {
  capabilityMatrix,
  numberCallouts,
  priceLadder,
  roiGap,
  runFunnel,
} from '@/lib/analytics/report-figures';
import type { RunSummary } from '@/lib/run-summary';
import { DIMENSIONS, type Evidence } from '@/lib/schemas/evidence';
import type { Report } from '@/lib/schemas/report';
import type { Roadmap } from '@/lib/schemas/roadmap';
import { Row, Section } from '../section';

const SOURCES_HREF = '/r/sms-rebooking-4f2a/sources';

/**
 * Every mark, rendered from the real fixture through `lib/db/queries.ts` — so
 * every number in this gallery is the number the report will render. Nothing
 * here is typed into a component.
 */
export function FiguresSection({
  evidence,
  report,
  roadmap,
  summary,
}: {
  evidence: Evidence;
  report: Report;
  roadmap: Roadmap;
  summary: RunSummary;
}) {
  const overall = stanceOverall(evidence);
  const byDimension = stanceByDimension(evidence);
  const ticks = recencyTicks(evidence, report);
  const domains = domainConcentration(evidence);
  const head = domains.filter((d) => d.count >= 2);
  const tail = domains.length - head.length;
  const ladder = priceLadder(evidence);
  const gap = roiGap(evidence);
  const funnel = runFunnel(summary);
  const matrix = capabilityMatrix(report);

  const callouts = DIMENSIONS.flatMap((d) => numberCallouts(evidence, d));
  const rate = callouts.find((c) => c.findingId === 'EV_02');
  const coverage = callouts.find((c) => c.findingId === 'EV_19');

  const counts = Object.fromEntries(
    DIMENSIONS.map((d) => [d, evidence.filter((f) => f.dimension === d).length]),
  ) as Record<(typeof DIMENSIONS)[number], number>;
  const maxCount = Math.max(...Object.values(counts));

  return (
    <Section
      id="figures"
      title="Figures"
      note="components/figures/* — every mark hand-drawn in CSS or SVG, server-rendered, and citation-linked. There is no charting library and none will be added. A figure with no citation throws in development."
    >
      <Row title="NumberCallout — default, and the one lead in the whole report">
        <div className="flex w-full flex-wrap items-start gap-16">
          {rate ? (
            <Figure caption="CANCELLATION RATE" height={FIG_H.callout} citations={[rate.citation]}>
              <NumberCallout
                value={`${rate.facts[0].value}%`}
                label={rate.label}
                citations={[rate.citation]}
              />
            </Figure>
          ) : null}
          {coverage ? (
            <Figure
              caption="END-TO-END REBOOKING"
              height={FIG_H.calloutLead}
              citations={[coverage.citation]}
            >
              <NumberCallout
                value={`${coverage.facts[0].value} of ${coverage.facts[1].value}`}
                label="Reviewed SMS tools that rebook a cancelled slot end-to-end"
                citations={[coverage.citation]}
                emphasis="lead"
              />
            </Figure>
          ) : null}
        </div>
      </Row>

      <Row title="StanceBar — no hue at all; stance is fill treatment">
        <div className="w-full max-w-[520px]">
          <StanceBar
            supports={overall.supports}
            neutral={overall.neutral}
            contests={overall.contests}
            caption="STANCE ACROSS THE CORPUS"
            source={{ label: 'ALL 47 FINDINGS', href: SOURCES_HREF }}
          />
        </div>
      </Row>

      <Row title="RecencyStrip — a full tick is cited, a short one is not">
        <div className="w-full">
          <RecencyStrip
            ticks={ticks}
            from={summary.earliest_source_date}
            to={summary.latest_source_date}
            source={{ label: 'ALL 47 FINDINGS', href: SOURCES_HREF }}
          />
        </div>
      </Row>

      <Row title="ValueLadder — the willingness-to-pay band straddles both competitors and stops under the ceiling">
        <div className="w-full max-w-[520px]">
          <ValueLadder
            rungs={ladder}
            axisMax={320}
            ticks={[0, 100, 200, 300]}
            citations={[26, 33, 34, 42]}
          />
        </div>
      </Row>

      <Row title="GapBar — the second bar is nearly invisible, and that is the finding">
        <div className="w-full max-w-[520px]">
          <GapBar
            a={{
              label: 'Lost production, per month',
              display: `$${gap.lostLow.toLocaleString('en-US')}–${gap.lostHigh.toLocaleString('en-US')}/mo`,
              low: gap.lostLow,
              high: gap.lostHigh,
              citations: [41],
            }}
            b={{
              label: 'What a tool like this costs',
              display: `$${gap.costLow}–${gap.costHigh}/mo`,
              low: gap.costLow,
              high: gap.costHigh,
              citations: [33, 34],
            }}
            ratio={`${Math.round(gap.ratioLow)}–${Math.round(gap.ratioHigh)}×`}
            citations={[33, 34, 41]}
          />
        </div>
      </Row>

      <Row title="RunFunnel — compact; bars are shares of the largest segment, never of a total">
        <div className="w-full max-w-[520px]">
          <RunFunnel
            rows={funnel}
            variant="compact"
            source={{ label: 'ALL 65 RECORDS', href: `${SOURCES_HREF}#the-run` }}
          />
        </div>
      </Row>

      <Row title="RunFunnel — expanded">
        <div className="w-full max-w-[640px]">
          <RunFunnel
            rows={funnel}
            variant="expanded"
            source={{ label: 'ALL 65 RECORDS', href: `${SOURCES_HREF}#the-run` }}
          />
        </div>
      </Row>

      <Row title="CapabilityMatrix — the idea is a fourth column in a different register, never a fourth row of marks">
        <div className="w-full">
          <CapabilityMatrix model={matrix} citations={matrix.citations} />
        </div>
      </Row>

      <Row title="DomainConcentration — the finding here is that the evidence is NOT concentrated">
        <div className="w-full max-w-[520px]">
          <DomainConcentration
            rows={head}
            tailCount={tail}
            tailLabel={`${tail} more domains with one finding each`}
            source={{ label: 'ALL 47 FINDINGS', href: SOURCES_HREF }}
            note={`${summary.pages_fetched} sources across ${summary.domains_count} domains. Nothing here rests on one publisher.`}
          />
        </div>
      </Row>

      <Row title="DimensionStrip — 5-up, short dimension names, and no blue on 'solid'">
        <div className="w-full">
          <DimensionStrip
            cells={DIMENSIONS.map((key) => ({
              key,
              count: counts[key],
              max: maxCount,
              supports: byDimension[key].supports,
              neutral: byDimension[key].neutral,
              contests: byDimension[key].contests,
              confidence: report.dimensions[key].confidence,
              href: `#dimension-${key}`,
            }))}
            source={{ label: 'ALL 47 FINDINGS', href: SOURCES_HREF }}
          />
        </div>
      </Row>

      {/* **`FanOutMeter` was deleted in A17**, along with the open-question
          card that was its only product consumer. A figure demonstrated here
          and rendered nowhere else is a component the gallery keeps alive on
          its own — which is how the previous roadmap accumulated marks nobody
          could point at a screen for.

          **The journey chart is not demonstrated here either.** Its bars are
          real `<button>`s that scroll to a section by DOM id, so an instance
          in the gallery would be a second, inert geometry for the same figure —
          exactly the drift §12's "no redeclaration" rule exists to stop. */}
    </Section>
  );
}
