import { AppBackdrop } from '@/components/layout/app-backdrop';
import { BackLink } from '@/components/layout/back-link';
import { SectionLabel } from '@/components/ui/section-label';
import { EvidenceExplorer } from '@/components/validate/explorer/evidence-explorer';
import { RunBand } from '@/components/validate/explorer/run-band';
import { citedFindingIds } from '@/lib/analytics/evidence-stats';
import { SOURCES } from '@/lib/content/app';
import { getBrief, getDiscarded, getEvidence, getReport, getRunSummary } from '@/lib/db/queries';
import { parseFacetParams } from '@/lib/explorer-facets';
import Link from 'next/link';

/**
 * The Evidence Explorer's route frame.
 *
 * **`getReport` is a new read on this page.** It did not load the report
 * before, and the `IN THE REPORT` facet — the one control in the product that
 * surfaces the 23 verified findings the report never quotes — cannot exist
 * without it.
 *
 * **`getDiscarded` is wired here** (C9). A1 created it, A4's layout is the
 * other call site, and this is where the 18 records reach the screen.
 *
 * Facet state is parsed **on the server** from `searchParams`, so a deep link
 * like `?dim=MONEY` is correct on first paint with no flash — which is what
 * lets A10 link a dimension section straight into a filtered explorer.
 */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [brief, summary] = await Promise.all([getBrief(slug), getRunSummary(slug)]);
  const description = `${summary.verified_count} excerpts passed the check. ${summary.discarded_count} didn't.`;
  const title = `Everything we checked — ${brief.one_liner.value}`;
  return {
    title,
    description,
    openGraph: { title, description, images: ['/og/sources.png'] },
  };
}

export default async function SourcesPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;

  const query = await searchParams;

  // Prototype-only QA affordance for exercising this route's segment-scoped
  // error boundary (sources/error.tsx), new in A14. There is no real pipeline
  // here that could throw, so this is the only honest way to demonstrate it.
  if (query.broken === '1') {
    throw new Error('Prototype-only QA trigger for the sources error boundary (?broken=1).');
  }

  const [evidence, discarded, report, summary] = await Promise.all([
    getEvidence(slug),
    getDiscarded(slug),
    getReport(slug),
    getRunSummary(slug),
  ]);

  const initialFacets = parseFacetParams(query);
  const citedIds = [...citedFindingIds(report)];

  return (
    <>
      <AppBackdrop variant="sources" />

      <div className="ob-container-app ob-sources">
        <header className="ob-sources-head">
          <BackLink href={`/r/${slug}/validate`}>{SOURCES.back}</BackLink>
          <h1 className="ob-h1">{SOURCES.h1}</h1>
          <p className="ob-lead">{SOURCES.lead}</p>
        </header>

        {/* Each band is an `.ob-eyebrow` numeral in chalk — never blue — over a
            real sentence. **The sentence is the `<h2>`, and the eyebrow is a
            `<p>`**: this route has a headline per band, so C17's
            eyebrow-is-the-heading rule (which covers routes that don't) does
            not apply. The count C17 asserts, two h2s, is unchanged either way. */}
        <section className="ob-sources-band" id="the-run" aria-labelledby="the-run-h">
          <SectionLabel index={SOURCES.bands.run.index}>{SOURCES.bands.run.eyebrow}</SectionLabel>
          <h2 className="ob-h2 ob-sources-h2" id="the-run-h">
            {SOURCES.bands.run.h2}
          </h2>
          <RunBand evidence={evidence} discarded={discarded} summary={summary} />
        </section>

        <section
          className="ob-sources-band"
          id="everything-we-checked"
          aria-labelledby="everything-we-checked-h"
        >
          <SectionLabel index={SOURCES.bands.all.index}>{SOURCES.bands.all.eyebrow}</SectionLabel>
          <h2 className="ob-h2 ob-sources-h2" id="everything-we-checked-h">
            {SOURCES.bands.all.h2}
          </h2>
          <p className="ob-sources-sub">{SOURCES.bands.all.sub}</p>

          {evidence.length === 0 ? (
            /* Unreachable with this fixture, and kept honest rather than
               deleted: the run genuinely can verify nothing. */
            <p className="ob-src-empty">
              {SOURCES.empty.runHeadline}{' '}
              <Link href={`/r/${slug}/roadmap`} className="ob-btn-bare">
                {SOURCES.empty.runAction}
              </Link>
            </p>
          ) : (
            <EvidenceExplorer
              slug={slug}
              evidence={evidence}
              discarded={discarded}
              citedIds={citedIds}
              initialFacets={initialFacets}
            />
          )}
        </section>
      </div>
    </>
  );
}
