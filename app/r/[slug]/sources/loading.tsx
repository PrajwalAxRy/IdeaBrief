import { FIG_H } from '@/components/figures/figure';
import { AppBackdrop } from '@/components/layout/app-backdrop';
import { SectionLabel } from '@/components/ui/section-label';
import { SkeletonInline } from '@/components/ui/skeleton';
import { SOURCES, SOURCES_SECTIONS } from '@/lib/content/app';

/** Eight rows fills 1440×900 below the band; the list is virtual-free. */
const ROW_COUNT = 8;

/**
 * The explorer's Suspense fallback, built to the **shipped** shape.
 *
 * Every reserved height comes from `FIG_H`, never a literal: the three marks in
 * `01 THE RUN` are `funnelExpanded` / `reasonBreakout` / `domains(13, 16)` =
 * 190 / 140 / 444. A number typed in here is precisely how the zero-shift
 * contract breaks.
 *
 * **The six facet legends render as live text, not grey bars.** They are the
 * one part of the rail knowable before the data arrives, and a reader who can
 * already see `DIMENSION` / `STANCE` / `STATUS` knows what is coming. The
 * sort labels and the two section headings are real for the same reason.
 *
 * `.ob-src-skeleton` is §14's and is already pinned to `--ob-src-row-h`, which
 * `.ob-explorer` declares — so the rows must stay inside an `.ob-explorer` or
 * the custom property resolves to nothing and the height silently collapses.
 * A14 does **not** add a second `.ob-skel-row` here: two classes for one row is
 * how R14 started.
 */
export default function SourcesLoading() {
  const legends = Object.values(SOURCES.facets.legends);
  const [runSection, allSection] = SOURCES_SECTIONS;

  return (
    <>
      <AppBackdrop variant="sources" />

      <div className="ob-container-app ob-sources">
        <header className="ob-sources-head">
          {/* **The back link renders as real text, not a blank.** Both its
              words and its arrow are knowable before any data arrives, and only
              its `href` is not — a route-level `loading.tsx` receives no
              params. Same call as the report index strip: render what is
              known, withhold the navigation that isn't. A blank here was also
              8.4px short, because `.ob-text-action` is an `inline-flex` whose
              height its content sets. */}
          <p className="ob-text-action">← {SOURCES.back}</p>
          <h1 className="ob-h1">{SOURCES.h1}</h1>
          {/* The lead is blanked inside the real element, so its 1.5 line-height
              — not a typed 21 — is what the header reserves. */}
          <p className="ob-lead">
            <SkeletonInline width={420} />
          </p>
        </header>

        <section className="ob-sources-band">
          <SectionLabel index={runSection.index}>{runSection.label}</SectionLabel>
          <h2 className="ob-h2 ob-sources-h2">{SOURCES.bands.run.h2}</h2>

          {/* **Each mark is wrapped in the real `.ob-fig` frame, not sized by
              `FIG_H` alone.** `FIG_H.x` is the height of the *mark*; a figure is
              a caption plus that mark plus a footer, and reserving only the
              marks left `01 THE RUN` 114px short — enough to visibly drag the
              whole explorer up the moment the band landed. The three captions
              and the funnel's note are static strings, so they render for real. */}
          <div className="ob-run-band">
            <div className="ob-run-col">
              <figure className="ob-fig">
                <p className="ob-fig-cap ob-meta">{SOURCES.run.funnelCaption}</p>
                <div
                  className="ob-fig-mark"
                  style={{ ['--ob-fig-h' as string]: `${FIG_H.funnelExpanded}px` }}
                  aria-hidden="true"
                />
                <figcaption className="ob-fig-foot">
                  <p className="ob-fig-cite ob-meta">SOURCE {SOURCES.run.funnelSource}</p>
                </figcaption>
              </figure>

              <p className="ob-run-note">{SOURCES.run.funnelNote}</p>

              <figure className="ob-fig">
                <p className="ob-fig-cap ob-meta">{SOURCES.run.reasonsCaption}</p>
                <div
                  className="ob-fig-mark"
                  style={{ ['--ob-fig-h' as string]: `${FIG_H.reasonBreakout}px` }}
                  aria-hidden="true"
                />
                <figcaption className="ob-fig-foot">
                  <p className="ob-fig-cite ob-meta">SOURCE {SOURCES.run.reasonsSource}</p>
                </figcaption>
              </figure>
            </div>

            <figure className="ob-fig">
              <p className="ob-fig-cap ob-meta">{SOURCES.run.domainsCaption}</p>
              <div
                className="ob-fig-mark"
                style={{ ['--ob-fig-h' as string]: `${FIG_H.domains(13, 16)}px` }}
                aria-hidden="true"
              />
              <figcaption className="ob-fig-foot">
                {/* The sub-line carries four counts, so it is the one part of
                    this footer that genuinely isn't knowable yet. */}
                <p className="ob-fig-note">
                  <SkeletonInline width="72%" />
                </p>
                <p className="ob-fig-cite ob-meta">SOURCE {SOURCES.run.domainsSource}</p>
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="ob-sources-band">
          <SectionLabel index={allSection.index}>{allSection.label}</SectionLabel>
          <h2 className="ob-h2 ob-sources-h2">{SOURCES.bands.all.h2}</h2>
          <p className="ob-sources-sub">{SOURCES.bands.all.sub}</p>

          <div className="ob-explorer">
            <div className="ob-rail">
              <div className="ob-rail-head" />
              {legends.map((legend) => (
                <section key={legend} className="ob-facet-group">
                  <h3 className="ob-facet-legend">{legend}</h3>
                  <div className="ob-facet-list">
                    {Array.from({ length: 4 }, (_, index) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length decorative placeholder row
                      <div key={index} className="ob-skel" style={{ height: 24 }} />
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <div className="ob-explorer-main">
              <div className="ob-sort">
                {SOURCES.sort.buttons.map((button) => (
                  <span key={button.key} className="ob-sort-btn">
                    {button.label}
                  </span>
                ))}
              </div>
              <div className="ob-skel" style={{ height: 12, width: 240, marginTop: 20 }} />

              <div className="ob-src-list">
                {Array.from({ length: ROW_COUNT }, (_, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length decorative placeholder row
                  <div key={index} className="ob-src-skeleton">
                    <div className="ob-skel" style={{ height: 16, width: '70%' }} />
                    <div className="ob-skel" style={{ height: 14, width: '48%' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
