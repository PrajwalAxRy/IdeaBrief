import { AppBackdrop } from '@/components/layout/app-backdrop';
import { SectionLabel } from '@/components/ui/section-label';
import { SkeletonInline } from '@/components/ui/skeleton';
import { ROADMAP, ROADMAP_SECTIONS } from '@/lib/content/app';

/**
 * The roadmap's Suspense fallback, mirroring A17's shipped grids.
 *
 * **Every count here is the fixture's, not a round number.** A skeleton that
 * draws six identical rows reshuffles the instant the real tree lands. Five
 * chart rows, five step sections, six questions, five setup items, ten cost
 * rows — all of which the loaded page renders exactly.
 *
 * **The bar geometry is the fixture's too.** A skeleton bar that spans the full
 * lane and then snaps to 34% is a worse first paint than one that lands in
 * roughly the right place; these are the real `start`/`end` fractions.
 */

/** `[left%, width%]` per row — `phaseSpan` on this fixture, rounded. */
const BAR_SPANS: Array<[number, number]> = [
  [0, 34],
  [10, 20],
  [22, 52],
  [42, 58],
  [50, 50],
];

/** Milestone positions, so the axis does not jump when the markers land. */
const MARKS = [16, 30, 58, 74, 92];

export default function RoadmapLoading() {
  const [journeySection, stepsSection, questionsSection, setupSection, moneySection] =
    ROADMAP_SECTIONS;

  return (
    <>
      <AppBackdrop variant="roadmap" />

      <div className="ob-container ob-roadmap">
        <header className="ob-roadmap-head">
          <h1 className="ob-h1">{ROADMAP.h1}</h1>
          <p className="ob-lead">{ROADMAP.lead}</p>
          <p className="ob-roadmap-crit">
            <SkeletonInline width={760} />
          </p>
          <p className="ob-metaline ob-meta">
            <span>
              <SkeletonInline width={420} />
            </span>
          </p>
        </header>

        <div className="ob-roadmap-nav">
          <nav className="ob-segmented" aria-label="Roadmap sections">
            {ROADMAP.nav.map((item, index) => (
              <span
                key={item.id}
                className={`ob-segmented-item${index === 0 ? ' ob-segmented-item--on' : ''}`}
              >
                {item.label}
              </span>
            ))}
          </nav>
        </div>

        <section className="ob-roadmap-section">
          <SectionLabel as="h2" index={journeySection.index}>
            The journey
          </SectionLabel>

          <div className="ob-rm-chart">
            <div className="ob-rm-card">
              <div className="ob-rm-axis">
                {MARKS.map((at) => (
                  <div className="ob-rm-mark" key={at} style={{ left: `${at}%` }}>
                    <span className="ob-rm-mark-btn" aria-hidden="true">
                      &nbsp;&nbsp;&nbsp;
                    </span>
                  </div>
                ))}
              </div>

              <ul className="ob-rm-rows">
                {BAR_SPANS.map(([left, width]) => (
                  <li className="ob-rm-row" key={left}>
                    <p className="ob-rm-row-name">
                      <SkeletonInline width={170} />
                    </p>
                    <div className="ob-rm-lane">
                      <div
                        className="ob-skel"
                        style={{
                          position: 'absolute',
                          top: 14,
                          left: `${left}%`,
                          width: `${width}%`,
                          height: 34,
                          borderRadius: 5,
                        }}
                        aria-hidden="true"
                      />
                    </div>
                  </li>
                ))}
              </ul>

              <p className="ob-rm-hint" aria-hidden="true">
                {ROADMAP.journey.hint}
              </p>
            </div>
          </div>
        </section>

        <section className="ob-roadmap-section">
          <SectionLabel as="h2" index={stepsSection.index}>
            The five steps
          </SectionLabel>

          <div className="ob-step-stack">
            {BAR_SPANS.map(([left]) => (
              <article className="ob-step" key={left}>
                <div className="ob-step-head">
                  <p className="ob-step-index ob-meta" aria-hidden="true">
                    <span className="ob-step-dot" />
                  </p>
                  <div className="ob-step-title">
                    <div
                      className="ob-skel"
                      style={{ height: 23, width: 260 }}
                      aria-hidden="true"
                    />
                    <div
                      className="ob-skel"
                      style={{ height: 14, width: 380, marginTop: 10 }}
                      aria-hidden="true"
                    />
                  </div>
                </div>
                <div className="ob-step-body">
                  <div className="ob-step-main">
                    <div className="ob-skel" style={{ height: 16 }} aria-hidden="true" />
                    <div
                      className="ob-skel"
                      style={{ height: 16, width: '84%', marginTop: 10 }}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ob-step-aside">
                    <div
                      className="ob-skel"
                      style={{ height: 12, width: 120 }}
                      aria-hidden="true"
                    />
                    <div
                      className="ob-skel"
                      style={{ height: 16, marginTop: 14 }}
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="ob-roadmap-section">
          <SectionLabel as="h2" index={questionsSection.index}>
            {ROADMAP.questions.label}
          </SectionLabel>
          <p className="ob-roadmap-sublead">
            <SkeletonInline width={640} />
          </p>

          <ol className="ob-oq-list">
            {Array.from({ length: 6 }, (_, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: six fixed question rows
              <li className="ob-oq-row" key={index}>
                <p className="ob-oq-num ob-meta" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <div className="ob-oq-text">
                  <div className="ob-skel" style={{ height: 19, width: '72%' }} />
                  <div className="ob-skel" style={{ height: 14, marginTop: 12 }} />
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="ob-roadmap-section">
          <SectionLabel as="h2" index={setupSection.index}>
            {ROADMAP.setup.label}
          </SectionLabel>
          <p className="ob-roadmap-sublead">
            <SkeletonInline width={600} />
          </p>

          <ul className="ob-setup-list">
            {Array.from({ length: 5 }, (_, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: five fixed setup rows
              <li className="ob-setup-item" key={index}>
                <div className="ob-skel" style={{ height: 17, width: '64%' }} />
                <div className="ob-skel" style={{ height: 14, marginTop: 14 }} />
              </li>
            ))}
          </ul>
        </section>

        <section className="ob-roadmap-section">
          <SectionLabel as="h2" index={moneySection.index}>
            {ROADMAP.money.label}
          </SectionLabel>

          <div className="ob-money">
            <div className="ob-skel" style={{ height: 21, width: '64%' }} aria-hidden="true" />
            <div className="ob-money-cols">
              <div className="ob-money-col">
                <p className="ob-money-label ob-meta">{ROADMAP.money.itemsLabel}</p>
                {Array.from({ length: 10 }, (_, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: ten fixed cost rows
                  <div key={index} className="ob-skel" style={{ height: 16, marginTop: 14 }} />
                ))}
              </div>
              <div className="ob-money-col">
                <p className="ob-money-label ob-meta">{ROADMAP.money.legendLabel}</p>
                {Array.from({ length: 4 }, (_, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: four fixed legend rows
                  <div key={index} className="ob-skel" style={{ height: 16, marginTop: 14 }} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="ob-tripwire">
          <div className="ob-skel" style={{ height: 23, width: 320 }} aria-hidden="true" />
          <ul className="ob-tripwire-list">
            {Array.from({ length: 4 }, (_, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: four fixed tripwires
              <li className="ob-tripwire-item" key={index}>
                <div className="ob-skel" style={{ height: 14 }} />
                <div className="ob-skel" style={{ height: 14, marginTop: 10, width: '88%' }} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
