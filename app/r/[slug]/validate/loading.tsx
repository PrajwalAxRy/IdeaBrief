import { FIG_H } from '@/components/figures/figure';
import { AppBackdrop } from '@/components/layout/app-backdrop';
import { SectionLabel } from '@/components/ui/section-label';
import { SkeletonInline, SkeletonText } from '@/components/ui/skeleton';
import { REPORT, REPORT_SECTIONS } from '@/lib/content/app';
import { DIMENSIONS } from '@/lib/schemas/evidence';

/**
 * Validate's Suspense fallback.
 *
 * **It renders Mode B's shape, not Mode A's.** The route cannot know which mode
 * it will land in — `isRunStreamActive` is a client-side `localStorage` read
 * the server fallback can't see — and a cold visitor on a shared link is the
 * overwhelmingly common arrival. Reserving the console's geometry for the
 * common case would guarantee the shift it exists to prevent.
 *
 * Every static string renders for real: the display headline, all six index
 * labels, both section eyebrows and both section headings. Only the one-liner,
 * the ledger and the data layer are blank.
 *
 * **The index strip is labels, not links.** Its six anchors point at sections
 * that do not exist yet, and a strip that scrolls nowhere is worse than no
 * strip — so the fallback renders the strip's geometry and text with no
 * `<a>`, no scroll-spy and no client boundary. What is knowable here is what
 * the report *contains*, not where you are in it.
 */
export default function ValidateLoading() {
  const [evidenceSection, summarySection] = REPORT_SECTIONS;

  return (
    <>
      <AppBackdrop variant="validate" />

      <header className="ob-report-head">
        <div className="ob-report-body">
          <h1 className="ob-display" style={{ maxWidth: '14ch' }}>
            {REPORT.h1}
          </h1>
          {/* Both blanks sit inside the **real** element, so `.ob-report-head`'s
              own `margin-top` rules and each element's line-height set the
              geometry. Sizing these by hand reserved 21px for a 31.5px lead and
              12px for a 16.8px ledger, and pushed the sticky index down by
              exactly 15.3px the moment the report landed. */}
          <p className="ob-lead" style={{ maxWidth: '52ch' }}>
            <SkeletonInline width={420} />
          </p>
          <p className="ob-metaline ob-meta">
            <span>
              <SkeletonInline width={460} />
            </span>
          </p>
        </div>
      </header>

      <nav className="ob-secindex" aria-label="Report sections">
        <div className="ob-report-body">
          {REPORT.index.map((entry) => (
            <span key={entry.id} className="ob-secindex-link ob-meta">
              <span className="ob-em">{entry.index}</span>
              <span>{entry.label}</span>
            </span>
          ))}
        </div>
      </nav>

      <div className="ob-report-body">
        <section className="ob-report-section">
          <div className="ob-report-full">
            <SectionLabel index={evidenceSection.index}>{evidenceSection.label}</SectionLabel>
            <h2 className="ob-h2 mt-8">{REPORT.sections.evidenceState.h2}</h2>
          </div>
          <div className="ob-report-full">
            {/* `DimensionStrip`'s five columns at `FIG_H.strip`. The short
                dimension labels are knowable; the counts are not. */}
            <figure className="ob-fig">
              <p className="ob-fig-cap ob-meta">
                <SkeletonInline width={190} />
              </p>
              <div className="ob-fig-mark" style={{ ['--ob-fig-h' as string]: `${FIG_H.strip}px` }}>
                <div className="ob-dimstrip">
                  {DIMENSIONS.map((dimension) => (
                    <div key={dimension} className="ob-dimstrip-col">
                      <div className="ob-skel" style={{ height: 14, width: '62%' }} />
                      <div className="ob-skel" style={{ height: 8 }} />
                    </div>
                  ))}
                </div>
              </div>
              {/* Every figure in this system carries a citation row. Reserving
                  the mark but not the footer is the same 114px-class error the
                  explorer's run band had. */}
              <figcaption className="ob-fig-foot">
                <p className="ob-fig-cite ob-meta">
                  <SkeletonInline width={140} />
                </p>
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="ob-report-section">
          <div className="ob-report-full">
            <SectionLabel index={summarySection.index}>{summarySection.label}</SectionLabel>
            <h2 className="ob-h2 mt-8">{REPORT.sections.summary.h2}</h2>
          </div>
          <div className="ob-report-row">
            <div className="ob-report-prose">
              <SkeletonText lines={6} />
            </div>
            <div className="ob-report-aside">
              {/* One `Figure` frame at the compact funnel's reservation (C8). */}
              <figure className="ob-fig">
                <p className="ob-fig-cap ob-meta">
                  <SkeletonInline width={150} />
                </p>
                <div
                  className="ob-fig-mark"
                  style={{ ['--ob-fig-h' as string]: `${FIG_H.funnelCompact}px` }}
                  aria-hidden="true"
                />
                <figcaption className="ob-fig-foot">
                  <p className="ob-fig-cite ob-meta">
                    <SkeletonInline width={90} />
                  </p>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
