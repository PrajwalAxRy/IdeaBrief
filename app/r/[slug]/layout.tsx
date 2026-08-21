import { RunShell } from '@/components/layout/run-shell';
import { CopyLinkButton } from '@/components/ui/copy-link-button';
import { EvidenceProvider } from '@/components/validate/evidence/evidence-context';
import { citedFindingIds, domainConcentration } from '@/lib/analytics/evidence-stats';
import {
  getDiscarded,
  getEvidence,
  getReport,
  getRoadmap,
  getRun,
  getRunSummary,
  runExists,
} from '@/lib/db/queries';
import { formatClockTime, formatDate } from '@/lib/format';
import { isOnAxis } from '@/lib/run-plan';
import type { RunSegment } from '@/lib/run-stage';
import type { RunSummary } from '@/lib/run-summary';
import type { Roadmap } from '@/lib/schemas/roadmap';
import type { Run } from '@/lib/schemas/run';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

/**
 * **The header meta is the run's static ledger and nothing else.** It does not
 * branch on stream state, does not carry the live brief count, and does not
 * duplicate a number the page directly below already prints — anything the
 * user can change while looking at it belongs on the page, not in the chrome.
 * That is why `18 DISCARDED` appears on the `sources` row and in
 * `EvidenceButton`'s accessible name, but not on `validate`, where the report
 * carries its own MetaLine.
 *
 * Every count is **derived**. `4 BUILD STEPS · 1 TRIPWIRE` comes from
 * `isOnAxis` (C5) — "five build steps" is false, because D13 lifts the
 * tripwire off the axis — and `29 DOMAINS` from `domainConcentration`.
 */
function buildMetaParts(
  run: Run,
  segment: RunSegment,
  summary: RunSummary,
  roadmap: Roadmap,
  domainCount: number,
): string[] {
  const id = `RUN ${run.slug}`;
  const researched = `RESEARCHED ${formatDate(run.updated_at).toUpperCase()}`;

  switch (segment) {
    case 'define':
      return [id, 'DRAFT', `STARTED ${formatClockTime(run.created_at)}`];
    case 'validate':
      return [
        id,
        researched,
        `${summary.verified_count} VERIFIED`,
        `${summary.pages_fetched} SOURCES`,
      ];
    case 'roadmap': {
      const onAxis = roadmap.steps.filter(isOnAxis).length;
      const tripwires = roadmap.steps.length - onAxis;
      return [id, researched, `${onAxis} BUILD STEPS`, `${tripwires} TRIPWIRE`];
    }
    case 'sources':
      return [
        id,
        `${summary.verified_count} VERIFIED`,
        `${summary.discarded_count} DISCARDED`,
        `${domainCount} DOMAINS`,
      ];
  }
}

/**
 * **The slug is the whole access model, so a run indexed by a search engine
 * defeats it entirely.** One line covers all four sub-routes.
 *
 * `follow: false` as well as `index: false`: the run pages link to each other
 * and to `/sources`, and a crawler that indexes none of them but follows all of
 * them still surfaces every one of a stranger's URLs in a referrer log.
 */
export const metadata = {
  robots: { index: false, follow: false },
};

export default async function RunLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  /* **This is what makes the invalid-run page reachable**, and A14 added it
     because nothing in the tree called `notFound()` — every slug rendered the
     fixture run, so `app/r/[slug]/not-found.tsx` had never once been seen.
     The slug is the entire access model, which makes a truncated link the most
     likely real failure in the product; a 404 surface that cannot be reached
     is not a state, it is dead code.

     It runs before the reads on purpose: the not-found page renders *outside*
     this layout, so throwing here is what strips the chrome. Rendering a
     header, stage rail and footer around "there's nothing at this link" would
     claim a run exists. */
  if (!(await runExists(slug))) notFound();

  /* Six fixture reads, all through lib/db/queries.ts, none of them a network
     call. `getDiscarded` is wired here so `EvidenceProvider` can hold the 18
     records — the drawer opens on a discard row (C9). This is one of its two
     required call sites; /sources is the other.

     `getReport` is A13's addition, and only for `citedIds`: the header's
     `EvidenceOverlay` renders the same `EvidenceExplorer` the route does
     (C16), and its `IN THE REPORT` facet cannot exist without the report. */
  const [run, summary, evidence, discarded, roadmap, report] = await Promise.all([
    getRun(slug),
    getRunSummary(slug),
    getEvidence(slug),
    getDiscarded(slug),
    getRoadmap(slug),
    getReport(slug),
  ]);

  const domainCount = domainConcentration(evidence).length;
  const metaBySegment = Object.fromEntries(
    (['define', 'validate', 'roadmap', 'sources'] as RunSegment[]).map((segment) => [
      segment,
      buildMetaParts(run, segment, summary, roadmap, domainCount),
    ]),
  ) as Record<RunSegment, string[]>;

  return (
    <EvidenceProvider evidence={evidence} discarded={discarded}>
      <RunShell
        slug={slug}
        status={run.status}
        oneLiner={run.idea_text}
        metaBySegment={metaBySegment}
        copyLink={<CopyLinkButton slug={slug} />}
        verifiedCount={summary.verified_count}
        discardedCount={summary.discarded_count}
        citedIds={[...citedFindingIds(report)]}
      >
        {children}
      </RunShell>
    </EvidenceProvider>
  );
}
