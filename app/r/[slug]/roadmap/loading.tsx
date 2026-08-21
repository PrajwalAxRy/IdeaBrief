import { FIG_H } from '@/components/figures/figure';
import { AppBackdrop } from '@/components/layout/app-backdrop';
import { SectionLabel } from '@/components/ui/section-label';
import { SkeletonInline } from '@/components/ui/skeleton';
import { ROADMAP, ROADMAP_SECTIONS } from '@/lib/content/app';
import { Fragment } from 'react';

/**
 * The roadmap's Suspense fallback, mirroring A11's and A12's shipped grids.
 *
 * **The ids and their order are the fixture's `priority` rank (C6), not
 * document order** — expanded `Q06`, then `Q01 · Q04 · Q02 · Q05 · Q03`. D10's
 * promotion pass only reorders after hydration, so this *is* the first-paint
 * order, and rendering them any other way would guarantee a visible reshuffle
 * the instant the real tree lands. They render bare and mono, as A11 renders
 * them — not bracketed.
 *
 * **Four `PlanBar` lanes, never five, and the tripwire is off the axis.** A
 * skeleton that draws the tripwire as a timed lane re-asserts the exact lie
 * D13 removes, in the first frame the visitor sees. The horizon, the spans and
 * the lane count are C5's.
 *
 * The collapsed questions **wrap** (R15) — no `nowrap`, no ellipsis, ever
 * again — so their reserved height is two lines, matching the loaded page.
 */

/** Priority rank order (C6). Expanded first, then five collapsed. */
const QUESTION_IDS = ['Q06', 'Q01', 'Q04', 'Q02', 'Q05', 'Q03'] as const;

/** The seven label cells an expanded `OpenQuestionCard` always carries. */
const CARD_LABELS = [
  ROADMAP.labels.question,
  ROADMAP.labels.why_it_matters,
  ROADMAP.labels.ask,
  ROADMAP.labels.find_them,
  ROADMAP.labels.how_many,
  ROADMAP.labels.script,
  ROADMAP.labels.what_you_learn,
];

const HORIZON = 12;
const LANES = 4;

export default function RoadmapLoading() {
  const [questionsSection, planSection] = ROADMAP_SECTIONS;
  const [expandedId, ...collapsedIds] = QUESTION_IDS;

  return (
    <>
      <AppBackdrop variant="roadmap" />

      <div className="ob-container ob-roadmap">
        <header className="ob-roadmap-head">
          <h1 className="ob-h1">{ROADMAP.h1}</h1>
          <p className="ob-lead">{ROADMAP.lead}</p>
          {/* `6 OPEN QUESTIONS · 4 BUILD STEPS · 1 TRIPWIRE · 12 WEEKS`. Inside
              the real `.ob-metaline`, so its 16.8px line box — not a typed
              12 — is what the head reserves. */}
          <p className="ob-metaline ob-meta">
            <span>
              <SkeletonInline width={520} />
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
          <SectionLabel as="h2" index={questionsSection.index}>
            Open questions
          </SectionLabel>

          <div className="ob-oq-stack">
            {/* The first card expanded, on A11's real grid, with all seven
                label cells rendered for real and only the values blanked. */}
            <div className="ob-oq" data-expanded="true">
              <div className="ob-oq-grid">
                {CARD_LABELS.map((label, index) => (
                  <Fragment key={label}>
                    <p className="ob-oq-label">{label}</p>
                    <div>
                      <div
                        className="ob-skel"
                        style={{
                          height: index === 0 ? 23 : 16,
                          width: index === 0 ? '78%' : '92%',
                        }}
                        aria-hidden="true"
                      />
                    </div>
                  </Fragment>
                ))}
              </div>
              <p className="ob-oq-label mt-6">{expandedId}</p>
            </div>

            {collapsedIds.map((id) => (
              <div key={id} className="ob-oq">
                <div className="ob-oq-grid">
                  <p className="ob-oq-label">{id}</p>
                  <div
                    className="ob-skel"
                    style={{ height: 23, width: '78%' }}
                    aria-hidden="true"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="ob-roadmap-section">
          <SectionLabel as="h2" index={planSection.index}>
            Build roadmap
          </SectionLabel>

          <div className="ob-plan">
            <div className="ob-week-axis-wrap" style={{ ['--ob-plan-cols' as string]: HORIZON }}>
              <div className="ob-skel" style={{ height: 12, width: 300 }} aria-hidden="true" />
              {/* The twelve tick hairlines, drawn; their `W1…W12` labels are
                  real on the loaded page but the axis height is the same
                  either way, and a tick is the structure the bars sit on. */}
              <div className="ob-week-axis" aria-hidden="true">
                {Array.from({ length: HORIZON }, (_, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: a fixed-length ruler, never reordered
                  <span key={index} className="ob-week-tick">
                    <span className="ob-week-label ob-meta">W{index + 1}</span>
                  </span>
                ))}
              </div>
              <div className="ob-week-lanes" aria-hidden="true">
                {Array.from({ length: LANES }, (_, index) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: four fixed lanes, never reordered
                    key={index}
                    className="ob-skel"
                    style={{ height: FIG_H.planBar - 38, gridColumn: '1 / -1' }}
                  />
                ))}
              </div>
            </div>

            <ol className="ob-plan-steps">
              {Array.from({ length: LANES }, (_, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: four fixed steps, never reordered
                <li key={index} className="ob-plan-step">
                  <div
                    className="ob-skel"
                    style={{ height: 12, width: '70%' }}
                    aria-hidden="true"
                  />
                  <div>
                    <div
                      className="ob-skel"
                      style={{ height: 23, width: '54%' }}
                      aria-hidden="true"
                    />
                    <div
                      className="ob-skel"
                      style={{ height: 16, width: '88%', marginTop: 16 }}
                      aria-hidden="true"
                    />
                  </div>
                </li>
              ))}
            </ol>

            {/* Below and off the axis. It is not a step and it is not a lane. */}
            <div className="ob-tripwire">
              <p className="ob-tripwire-label ob-meta">{ROADMAP.tripwire.label}</p>
              <div className="ob-skel" style={{ height: 23, width: '46%' }} aria-hidden="true" />
              <div className="ob-skel" style={{ height: 16, width: '90%' }} aria-hidden="true" />
            </div>

            <div className="ob-exit">
              <p className="ob-exit-label ob-meta">{ROADMAP.exit.label}</p>
              <div
                className="ob-skel"
                style={{ height: 21, width: '52%', marginTop: 20 }}
                aria-hidden="true"
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
