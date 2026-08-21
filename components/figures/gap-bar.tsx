import { FIG_H, Figure } from './figure';

/**
 * Two magnitudes on a shared scale, for order-of-magnitude comparisons.
 *
 * **Bar b is nearly invisible and that is the finding** — no broken axis, no
 * log scale, no inset. Making the small bar legible would destroy the only
 * thing this mark says.
 *
 * Not blue.
 */
export type GapSide = {
  label: string;
  /** The pre-formatted range, e.g. `$2,000–4,000/mo`. The derivation produced
   *  it; this component formats nothing. */
  display: string;
  low: number;
  high: number;
  citations: number[];
};

export function barShare(value: number, max: number): number {
  return max > 0 ? value / max : 0;
}

export function GapBar({
  a,
  b,
  ratio,
  citations,
  caption = 'WHAT IT COSTS AGAINST WHAT IT LOSES',
}: {
  a: GapSide;
  b: GapSide;
  ratio: string;
  citations: number[];
  caption?: string;
}) {
  const max = Math.max(a.high, b.high);

  const row = (side: GapSide, fill: string) => (
    <div className="ob-gap-row">
      <p className="ob-gap-label">{side.label}</p>
      <div className="ob-gap-track">
        <span
          className={['ob-gap-fill', 'ob-fig-bar', fill].join(' ')}
          style={{
            marginLeft: `${barShare(side.low, max) * 100}%`,
            width: `${barShare(side.high - side.low, max) * 100}%`,
          }}
        />
        <span className="ob-gap-value ob-fig-value">{side.display}</span>
      </div>
    </div>
  );

  return (
    <Figure caption={caption} height={FIG_H.gap} citations={citations}>
      <div
        className="ob-gap"
        role="img"
        aria-label={`${a.label}: ${a.display}. ${b.label}: ${b.display}. A difference of ${ratio}.`}
      >
        {row(a, 'ob-gap-fill-a')}
        {row(b, 'ob-gap-fill-alt')}
        <span className="ob-fig-baseline" aria-hidden="true" />
        <p className="ob-gap-ratio ob-fig-value">{ratio}</p>
      </div>
    </Figure>
  );
}
