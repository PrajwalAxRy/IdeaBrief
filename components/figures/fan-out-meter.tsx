import { FIG_H, Figure } from './figure';

/**
 * How many roadmap steps an open question governs (D14).
 *
 * **Fan-out reads as filled mass**, which is the whole point: a question
 * governing three steps is visibly heavier than one governing one, with no
 * second diagram anywhere in the build.
 *
 * `max` is the highest fan-out in the run — **3 here, not the step count.**
 * Drawing five slots when nothing reaches five makes every question look
 * under-weight; drawing the run's own maximum makes the heaviest question fill
 * its meter, which is what "weight" has to mean for the comparison to read.
 *
 * Three tick treatments, borrowing the stance marks' fill vocabulary:
 *   - a governed **build step** — solid `--ob-text`
 *   - an ungoverned slot — 1px `--ob-hairline-strong` outline
 *   - the governed **tripwire** — outline with a 1px `--ob-text` border,
 *     because it is a dependency but not a build step
 *
 * **Exempt from the figure-needs-a-citation rule**, and deliberately: it counts
 * the step list rendered further down this same page, and that list is its own
 * provenance. Not blue.
 */
export function FanOutMeter({
  governs,
  tripwire,
  max,
  caption,
  href = '#build-roadmap',
}: {
  /** Build steps this question governs — the tripwire is counted separately. */
  governs: number;
  /** Whether the tripwire also names this question. */
  tripwire: boolean;
  /** The highest total fan-out in the run. */
  max: number;
  /** A noun phrase — `3 STEPS`, `1 STEP + TRIPWIRE`. */
  caption: string;
  href?: string;
}) {
  const total = governs + (tripwire ? 1 : 0);

  return (
    /* The source is the step list this counts, 900px below — the figure's
       provenance is the plan itself, which is why it is exempt from the
       needs-a-citation rule. Repeating the caption here would print the same
       three words three times in one card. */
    <Figure caption="FAN-OUT" height={FIG_H.fanOut} source={{ label: 'THE PLAN →', href }}>
      <div
        className="ob-fanout"
        role="img"
        aria-label={`Governs ${governs} build step${governs === 1 ? '' : 's'}${
          tripwire ? ' and the tripwire' : ''
        }, out of a maximum of ${max}.`}
      >
        <span className="ob-fanout-ticks" aria-hidden="true">
          {Array.from({ length: max }, (_, i) => {
            const isTripwire = tripwire && i === governs;
            return (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: a fixed-length, never-reordered tick row
                key={i}
                className={[
                  'ob-fanout-tick',
                  i < governs ? 'ob-fanout-tick-on' : '',
                  isTripwire ? 'ob-fanout-tick-tripwire' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              />
            );
          })}
        </span>
        <span className="ob-meta">{caption}</span>
      </div>
    </Figure>
  );
}
