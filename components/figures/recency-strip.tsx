import type { RecencyTick } from '@/lib/analytics/evidence-stats';
import { FIG_H, Figure, type FigureSource } from './figure';

/**
 * A dated tick per finding across a shared time axis, oldest → newest.
 *
 * **Inline SVG, not divs**: 47 ticks at arbitrary fractional x on one axis is
 * exactly the case divs lose — 47 absolutely-positioned nodes with no shared
 * coordinate space. Every `line` carries `vector-effect="non-scaling-stroke"`;
 * without it a `preserveAspectRatio="none"` viewBox turns a 1px hairline into
 * a 0.7px smear at 1280.
 *
 * **A cited finding draws a full-height tick; an uncited one draws a short
 * one** — so the strip doubles as a picture of how much of the corpus the
 * prose actually uses. No stance encoding: a second variable across 47 ticks
 * is unreadable, and `recencyTicks` carries `cited`, not `stance`.
 */
const VIEW_W = 1000;

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

function monthLabel(iso: string): string {
  const [year, month] = iso.split('-');
  return `${MONTHS[Number(month) - 1]} ${year}`;
}

export function RecencyStrip({
  ticks,
  from,
  to,
  source,
  caption = 'WHEN THE EVIDENCE WAS PUBLISHED',
}: {
  ticks: RecencyTick[];
  from: string;
  to: string;
  source: FigureSource;
  caption?: string;
}) {
  const min = Date.parse(from);
  const max = Date.parse(to);
  const span = Math.max(1, max - min);
  const cited = ticks.filter((t) => t.cited).length;

  return (
    <Figure caption={caption} height={FIG_H.recency} source={source}>
      <div
        role="img"
        aria-label={`${ticks.length} findings published between ${monthLabel(from)} and ${monthLabel(to)}. ${cited} are quoted in the report; ${ticks.length - cited} are not.`}
      >
        <svg
          className="ob-recency"
          viewBox={`0 0 ${VIEW_W} 44`}
          preserveAspectRatio="none"
          width="100%"
          height="44"
          aria-hidden="true"
        >
          <title>Publication dates across the corpus</title>
          <line
            x1="0"
            y1="36"
            x2={VIEW_W}
            y2="36"
            className="ob-fig-baseline"
            vectorEffect="non-scaling-stroke"
          />
          {ticks.map((tick) => {
            const x = ((Date.parse(tick.date) - min) / span) * VIEW_W;
            return (
              <line
                key={tick.id}
                x1={x}
                x2={x}
                y1={tick.cited ? 10 : 26}
                y2={36}
                className={tick.cited ? 'ob-recency-tick-cited' : 'ob-recency-tick'}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>
        <div className="ob-recency-bounds ob-meta">
          <span>{monthLabel(from)}</span>
          <span>{monthLabel(to)}</span>
        </div>
      </div>
    </Figure>
  );
}
