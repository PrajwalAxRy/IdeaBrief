/**
 * One large mono value, its unit and its label — the device that pulls a
 * quantity out of a sentence.
 *
 * `value`, `unit` and `label` are the strings the derivation already produced
 * at the seam: **no figure formats a number and no figure writes a label.**
 *
 * `emphasis='lead'` is spent exactly once in the whole report, on `0 of 9`
 * [19]. Spending it twice spends it.
 *
 * Not blue. A number is not an action, a verification, or a live state.
 *
 * Carries no `role` — it is literally a number, a unit and a label, and
 * already reads correctly. One of the two sanctioned exceptions to the
 * `role="img"` rule.
 */
export function NumberCallout({
  value,
  unit,
  label,
  secondary,
  compare,
  size = 'default',
  emphasis,
  className = '',
}: {
  value: string;
  unit?: string;
  /** Optional: in the report the `Figure` caption carries the label, and two
   *  copies of the same sentence 14px apart is not a design. */
  label?: string;
  secondary?: string;
  /** The `transition` form's two-bar comparison, scaled to the larger value.
   *  A `16.8% → 9.1%` string states the drop; the bars show it. */
  compare?: { from: number; to: number };
  citations: number[];
  size?: 'default' | 'compact';
  emphasis?: 'lead';
  className?: string;
}) {
  const compareMax = compare ? Math.max(compare.from, compare.to) : 0;
  return (
    <div
      className={[
        'ob-callout',
        size === 'compact' ? 'ob-callout-compact' : '',
        emphasis === 'lead' ? 'ob-callout-lead' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <p className="ob-callout-line">
        <span className="ob-callout-value ob-fig-value">{value}</span>
        {unit ? <span className="ob-callout-unit">{unit}</span> : null}
      </p>
      {compare ? (
        <span className="ob-callout-compare" aria-hidden="true">
          <span
            className="ob-callout-compare-bar ob-fig-bar"
            style={{ width: `${(compare.from / compareMax) * 100}%` }}
          />
          <span
            className="ob-callout-compare-bar ob-fig-bar"
            style={{ width: `${(compare.to / compareMax) * 100}%` }}
          />
        </span>
      ) : null}
      {label ? <p className="ob-callout-label">{label}</p> : null}
      {secondary ? <p className="ob-callout-secondary ob-meta">{secondary}</p> : null}
    </div>
  );
}
