import type { Confidence } from '@/lib/schemas/report';

const FILLED_COUNT: Record<Confidence, number> = { solid: 3, mixed: 2, thin: 1 };
const WORD_COLOR: Record<Confidence, string> = {
  solid: 'var(--conf-solid)',
  mixed: 'var(--conf-mixed)',
  thin: 'var(--conf-thin)',
};

/**
 * Three bars + the word — never a number, never colour-coded (confidence is
 * expressed by text weight/opacity, not hue, per 02 §2.11).
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
    <span className={['confidence-note', className].filter(Boolean).join(' ')}>
      <span className="confidence-bars" aria-hidden="true">
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className={['confidence-bar', index < filled ? 'confidence-bar--filled' : '']
              .filter(Boolean)
              .join(' ')}
          />
        ))}
      </span>
      <span style={{ color: WORD_COLOR[confidence] }}>{confidence}</span>
    </span>
  );
}
