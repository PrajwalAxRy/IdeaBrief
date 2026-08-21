import { DomainConcentration } from '@/components/figures/domain-concentration';
import { FIG_H, Figure } from '@/components/figures/figure';
import { RunFunnel } from '@/components/figures/run-funnel';
import { domainConcentration } from '@/lib/analytics/evidence-stats';
import { runFunnel } from '@/lib/analytics/report-figures';
import { SOURCES } from '@/lib/content/app';
import { formatDomain } from '@/lib/format';
import type { RunSummary } from '@/lib/run-summary';
import {
  DISCARD_REASON_LABEL,
  type DiscardReason,
  type Discarded,
  type Evidence,
} from '@/lib/schemas/evidence';

/** Every domain with at least two verified findings gets a bar; the rest is a tail. */
const MIN_BARS = 2;

/**
 * `01 THE RUN` — how the evidence was gathered, in three marks.
 *
 * **Server component, and deliberately so.** Nothing in this band is
 * interactive: filtering lives on `[aria-pressed]` controls in the rail, never
 * on a figure fill (C8). A domain bar that toggled would need a pressed
 * treatment inside the one layer the plan keeps free of accent, and would drag
 * `components/figures/*` — server components, all of them — into the client
 * island for one click target. The figure's `source` link moves focus to the
 * `DOMAIN` group instead, where the toggling actually is.
 *
 * **Nothing here animates.** No figure animates a value, and D17's count-ups
 * live on the run header. The only motion on `/sources` is the row stagger.
 *
 * Every reserved height comes from `FIG_H` — **a typed number is how the
 * zero-shift contract breaks**, which A3 is explicit about.
 */
export function RunBand({
  evidence,
  discarded,
  summary,
}: {
  evidence: Evidence;
  discarded: Discarded;
  summary: RunSummary;
}) {
  const rows = domainConcentration(evidence);
  const bars = rows.filter((row) => row.count >= MIN_BARS);
  const tailCount = rows.length - bars.length;
  const urls = new Set(evidence.map((f) => f.source_url)).size;

  /* 7 · 5 · 3 · 3, read from the fixture. Ordered by count so the breakout
     reads as a decomposition of the 18 DISCARDED bar above it. */
  const reasonCounts = new Map<DiscardReason, number>();
  for (const record of discarded) {
    reasonCounts.set(record.discard_reason, (reasonCounts.get(record.discard_reason) ?? 0) + 1);
  }
  const reasons = [...reasonCounts.entries()].sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
  );

  return (
    <div className="ob-run-band">
      <div className="ob-run-col">
        <RunFunnel
          rows={runFunnel(summary)}
          variant="expanded"
          caption={SOURCES.run.funnelCaption}
          source={{ label: SOURCES.run.funnelSource, href: '#everything-we-checked' }}
        />
        <p className="ob-run-note">{SOURCES.run.funnelNote}</p>

        {/* Not a new mark — A3's kit is closed and A13 invents nothing in it.
            Four sentences with counts is the clearest possible read of eighteen
            records, and a bar chart of 7/5/3/3 beside a funnel that
            deliberately doesn't sum to a whole would teach the wrong ruler. */}
        <Figure
          caption={SOURCES.run.reasonsCaption}
          height={FIG_H.reasonBreakout}
          source={{ label: SOURCES.run.reasonsSource, href: '?status=discarded' }}
        >
          <dl className="ob-discard-reasons">
            {reasons.map(([reason, count]) => (
              <div key={reason} className="ob-discard-reason-row">
                <dt className="ob-discard-reason-label">{DISCARD_REASON_LABEL[reason]}</dt>
                <dd className="ob-discard-reason-count">{count}</dd>
              </div>
            ))}
          </dl>
        </Figure>
      </div>

      <DomainConcentration
        rows={bars}
        tailCount={tailCount}
        tailLabel={SOURCES.run.domainsTail(tailCount)}
        caption={SOURCES.run.domainsCaption}
        note={SOURCES.run.domainsSub(evidence.length, urls, rows.length, rows[0]?.count ?? 0)}
        source={{ label: SOURCES.run.domainsSource, href: '#facet-domain' }}
      />
    </div>
  );
}
