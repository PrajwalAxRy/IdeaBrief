import type { LadderRung } from '@/lib/analytics/report-figures';
import { FIG_H, Figure } from './figure';

/**
 * Several money values on one vertical axis — the price ladder.
 *
 * **CSS, not SVG**: every rung carries real text at real sizes and must not
 * scale with a viewBox.
 *
 * Three kinds, and the kind is in the data:
 *   `point`     — a full-width hairline; label left, value right.
 *   `band`      — a 1px-bordered box spanning low→high; label left.
 *   `threshold` — a 1px **dashed** rule; label and value in the **right**
 *                 gutter.
 *
 * **Points label left, thresholds label right, which is what keeps `$299` and
 * `~$300` legible one pixel apart.** `ladderGutters` assigns those gutters and
 * is the only geometry this component computes.
 *
 * Not blue.
 */

export type LadderGutter = 'left' | 'right';

/**
 * Which side each rung's label sits on. Thresholds go right so they never
 * collide with a point rung at a near-identical value; everything else goes
 * left. Exported for the unit test — it is geometry, not data.
 */
export function ladderGutters(rungs: LadderRung[]): LadderGutter[] {
  return rungs.map((rung) => (rung.form === 'threshold' ? 'right' : 'left'));
}

function rungValue(rung: LadderRung): number {
  return rung.form === 'band' ? rung.high : rung.value;
}

function formatMoney(value: number, unit: string): string {
  return `$${value.toLocaleString('en-US')}${unit === 'USD/mo' ? '/mo' : ''}`;
}

export function ValueLadder({
  rungs,
  axisMax,
  ticks,
  citations,
  caption = 'THE PRICE LADDER',
  note,
}: {
  rungs: LadderRung[];
  axisMax: number;
  ticks: number[];
  citations: number[];
  caption?: string;
  note?: string;
}) {
  const gutters = ladderGutters(rungs);
  const topPct = (value: number) => `${(1 - value / axisMax) * 100}%`;

  const described = rungs
    .map((r) =>
      r.form === 'band'
        ? `${formatMoney(r.low, r.unit)} to ${formatMoney(r.high, r.unit)}, ${r.label}`
        : `${r.form === 'threshold' ? 'threshold at ' : ''}${formatMoney(r.value, r.unit)}, ${r.label}`,
    )
    .join('; ');

  return (
    <Figure caption={caption} height={FIG_H.ladder} citations={citations} note={note}>
      <div className="ob-ladder" role="img" aria-label={`${described}.`}>
        <div className="ob-ladder-axis" aria-hidden="true">
          {ticks.map((tick) => (
            <span key={tick} className="ob-ladder-tick ob-meta" style={{ top: topPct(tick) }}>
              ${tick}
            </span>
          ))}
        </div>

        {rungs.map((rung, index) => {
          const gutter = gutters[index];
          const key = `${rung.form}-${rungValue(rung)}`;

          if (rung.form === 'band') {
            const top = topPct(rung.high);
            const height = `${((rung.high - rung.low) / axisMax) * 100}%`;
            return (
              <div key={key} className="ob-ladder-band" style={{ top, height }}>
                <span className="ob-ladder-label">{rung.label}</span>
                {/* A range carries no unit suffix: the axis and the point
                    rungs already establish it, and `$150/mo–250/mo` reads as
                    two prices rather than one band. C11 settles the spelling
                    as `$150–250`. */}
                <span className="ob-ladder-value ob-fig-value">
                  {`$${rung.low.toLocaleString('en-US')}–${rung.high.toLocaleString('en-US')}`}
                </span>
              </div>
            );
          }

          return (
            <div
              key={key}
              className={[
                'ob-ladder-rung',
                rung.form === 'threshold' ? 'ob-ladder-threshold' : '',
                gutter === 'right' ? 'ob-ladder-rung-right' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              style={{ top: topPct(rung.value) }}
            >
              <span className="ob-ladder-label">{rung.label}</span>
              <span className="ob-ladder-value ob-fig-value">
                {rung.form === 'threshold' ? '~' : ''}
                {formatMoney(rung.value, rung.unit)}
              </span>
            </div>
          );
        })}
      </div>
    </Figure>
  );
}
