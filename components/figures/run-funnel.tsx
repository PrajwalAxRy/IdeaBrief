import { CountUp } from './count-up';
import { FIG_H, Figure, type FigureSource } from './figure';

/**
 * queries → pages → verified → discarded, as four proportional segments.
 *
 * **Bar width is `value / max(values)` — a share of the largest segment, 47,
 * never of a total. `47 / 65` looks like a pass rate and this product does not
 * publish pass rates.** Nothing here sums to anything.
 *
 * Row order is fixed so discarded sits directly under verified and `47 + 18 =
 * 65` reads as the extraction total.
 *
 * **This is the only figure in the kit that contains the accent**, and only on
 * the verified row — because the row means *verified*, one of blue's three
 * jobs. The discarded bar is `--ob-discard`; queries and pages are
 * `--ob-hairline-strong`. **There is no red on the discarded row and there
 * never will be.**
 *
 * One component, two densities: the report's §02 aside renders `compact`,
 * `/sources` §01 renders `expanded`. Neither deletes the other.
 */
const ROW_FILL: Record<string, string> = {
  VERIFIED: 'ob-funnel-bar-verified',
  DISCARDED: 'ob-funnel-bar-discarded',
};

export function RunFunnel({
  rows,
  variant = 'compact',
  source,
  caption = 'THE RUN',
  children,
}: {
  rows: { label: string; value: number; share: number }[];
  variant?: 'compact' | 'expanded';
  source: FigureSource;
  caption?: string;
  /** Expanded only — A13's per-row breakout sits beside the bars. */
  children?: React.ReactNode;
}) {
  const described = rows.map((r) => `${r.value} ${r.label.toLowerCase()}`).join(', ');

  return (
    <Figure
      caption={caption}
      height={variant === 'compact' ? FIG_H.funnelCompact : FIG_H.funnelExpanded}
      source={source}
    >
      <div
        className={['ob-funnel', variant === 'expanded' ? 'ob-funnel-expanded' : '']
          .filter(Boolean)
          .join(' ')}
        role="img"
        aria-label={`${described}. Bars are proportional to the largest segment, not to a total.`}
      >
        {rows.map((row) => (
          <div key={row.label} className="ob-funnel-row">
            <span className="ob-meta">{row.label}</span>
            <span className="ob-funnel-track">
              <span
                className={['ob-funnel-bar', 'ob-fig-bar', ROW_FILL[row.label] ?? '']
                  .filter(Boolean)
                  .join(' ')}
                style={{ width: `${row.share * 100}%` }}
              />
            </span>
            <span className="ob-fig-value">
              <CountUp value={row.value} />
            </span>
          </div>
        ))}
        {children}
      </div>
    </Figure>
  );
}
