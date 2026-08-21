import { FIG_H, Figure, type FigureSource } from './figure';

/**
 * Ranked domain bars — how much of the evidence comes from how few places.
 *
 * **No arbitrary top-N cut and no tie-breaking here**: the caller decides where
 * the tail starts, because `/sources` and the report want different depths.
 *
 * `text-overflow: ellipsis` on the domain is **legal here and nowhere else in
 * this build** — a truncated hostname loses nothing, while a truncated
 * competitor price loses the decision (R21).
 *
 * When `onToggleDomain` is supplied each row renders as a `<button
 * aria-pressed>`. **The pressed treatment is a control state on the row's label
 * and hairline, never a fill on the bar** — C8 keeps the funnel's verified bar
 * the only accent mark in the whole figure layer.
 *
 * Not blue.
 */
export function DomainConcentration({
  rows,
  tailCount,
  tailLabel,
  activeDomains,
  onToggleDomain,
  source,
  caption = 'WHERE THE EVIDENCE COMES FROM',
  note,
}: {
  rows: { domain: string; count: number }[];
  tailCount?: number;
  tailLabel?: string;
  activeDomains?: string[];
  onToggleDomain?: (domain: string) => void;
  source: FigureSource;
  caption?: string;
  note?: string;
}) {
  const max = rows[0]?.count ?? 1;
  const described = rows
    .slice(0, 3)
    .map((r) => `${r.domain} ${r.count}`)
    .join(', ');

  return (
    <Figure
      caption={caption}
      height={FIG_H.domains(rows.length, tailCount)}
      source={source}
      note={note}
    >
      <div
        className="ob-domains"
        role={onToggleDomain ? undefined : 'img'}
        aria-label={
          onToggleDomain
            ? undefined
            : `${rows.length} domains contribute two or more findings. The largest are ${described}.`
        }
      >
        {rows.map((row) => {
          const bar = (
            <>
              <span className="ob-domain-name ob-meta">{row.domain}</span>
              <span className="ob-domain-track">
                <span
                  className="ob-domain-bar ob-fig-bar"
                  style={{ width: `${(row.count / max) * 100}%` }}
                />
              </span>
              <span className="ob-fig-value">{row.count}</span>
            </>
          );

          if (!onToggleDomain) {
            return (
              <div key={row.domain} className="ob-domain-row">
                {bar}
              </div>
            );
          }

          return (
            <button
              key={row.domain}
              type="button"
              className="ob-domain-row"
              aria-pressed={activeDomains?.includes(row.domain) ?? false}
              onClick={() => onToggleDomain(row.domain)}
            >
              {bar}
            </button>
          );
        })}

        {tailCount ? (
          <div className="ob-domain-tail">
            <span className="ob-domain-tail-ticks" aria-hidden="true">
              {Array.from({ length: tailCount }, (_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: a fixed-length, never-reordered tick row
                <span key={i} className="ob-domain-tail-tick" />
              ))}
            </span>
            {tailLabel ? <span className="ob-meta">{tailLabel}</span> : null}
          </div>
        ) : null}
      </div>
    </Figure>
  );
}
