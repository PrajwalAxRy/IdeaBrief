import type { Confidence } from '@/lib/schemas/report';

const FILLED_COUNT: Record<Confidence, number> = { solid: 3, mixed: 2, thin: 1 };
const WORD_CLASS: Record<Confidence, string> = {
  solid: 'ob-conf-word-solid',
  mixed: 'ob-conf-word-mixed',
  thin: 'ob-conf-word-thin',
};

/**
 * Three bars plus the literal word — never a number, never a hue.
 *
 * **Never accent.** Confidence is a property of the evidence: it is not an
 * action, not a verification, and not a live state, so under rule 5 it cannot
 * be blue. The Deep Canopy `--conf-solid: var(--accent)` mapping is deleted,
 * not re-pointed — this was the single most tempting place to reach for it.
 *
 * `DimensionStrip` (A3) composes this unchanged, so it has to read right at
 * the bottom of a 5-up column as well as inside a card.
 */
export function ConfidenceNote({
  confidence,
  className = '',
}: {
  confidence: Confidence;
  className?: string;
}) {
  const filled = FILLED_COUNT[confidence];

  return (
    <span className={['ob-conf', className].filter(Boolean).join(' ')}>
      <span className="ob-conf-bars" aria-hidden="true">
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className={['ob-conf-bar', index < filled ? 'ob-conf-bar-on' : '']
              .filter(Boolean)
              .join(' ')}
          />
        ))}
      </span>
      <span className={['ob-conf-word', WORD_CLASS[confidence]].join(' ')}>{confidence}</span>
    </span>
  );
}
