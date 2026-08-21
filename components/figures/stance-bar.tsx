import { STANCE_LABEL } from '@/lib/schemas/evidence';
import { CountUp } from './count-up';
import { FIG_H, Figure, type FigureSource } from './figure';

/**
 * supports / neutral / contests as a segmented, hairline-ruled bar.
 *
 * **No hue at all** — stance is expressed by fill treatment (solid / mid /
 * hatched-and-outlined), never by colour. There is no red in this system and
 * blue is spent on action, verification and live state.
 *
 * A zero count renders **nothing**, not a zero-width sliver. The word always
 * accompanies the mark; a swatch alone is a legend nobody read.
 *
 * Props take `stanceOverall(evidence)` / `stanceByDimension(evidence)[d]`
 * verbatim.
 */
const SEGMENTS = [
  { key: 'supports', stance: 'supports', fill: 'ob-stance-supports' },
  { key: 'neutral', stance: 'neutral', fill: 'ob-stance-neutral' },
  { key: 'contests', stance: 'challenges', fill: 'ob-stance-contests' },
] as const;

export function StanceBar({
  supports,
  neutral,
  contests,
  compact = false,
  caption = 'STANCE',
  source,
  citations,
}: {
  supports: number;
  neutral: number;
  contests: number;
  compact?: boolean;
  caption?: string;
  source?: FigureSource;
  citations?: number[];
}) {
  const counts = { supports, neutral, contests };
  const total = supports + neutral + contests;
  const described = SEGMENTS.map((s) => `${STANCE_LABEL[s.stance]} ${counts[s.key]}`).join(', ');

  const bar = (
    <div
      className={['ob-stance-bar', compact ? 'ob-stance-compact' : ''].filter(Boolean).join(' ')}
    >
      {SEGMENTS.filter((s) => counts[s.key] > 0).map((s) => (
        <span
          key={s.key}
          className={['ob-stance-seg', s.fill].join(' ')}
          style={{ flexGrow: counts[s.key] }}
        />
      ))}
    </div>
  );

  if (compact) {
    return (
      <div role="img" aria-label={`Stance across ${total} findings: ${described}.`}>
        {bar}
      </div>
    );
  }

  return (
    <Figure caption={caption} height={FIG_H.stance} source={source} citations={citations}>
      <div role="img" aria-label={`Stance across ${total} findings: ${described}.`}>
        {bar}
        <div className="ob-stance-key">
          {SEGMENTS.map((s) => (
            <span key={s.key} className="ob-stance-key-item ob-meta">
              <span className={['ob-stance-swatch', s.fill].join(' ')} aria-hidden="true" />
              {STANCE_LABEL[s.stance]}
              <span className="ob-fig-value">
                <CountUp value={counts[s.key]} />
              </span>
            </span>
          ))}
        </div>
      </div>
    </Figure>
  );
}
