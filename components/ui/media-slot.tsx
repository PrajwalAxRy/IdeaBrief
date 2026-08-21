export type MediaKind = 'image' | 'video' | 'screenshot' | 'diagram' | 'animation' | 'icon';

interface MediaSlotProps {
  /** CSS aspect-ratio, e.g. '16/9'. The slot reserves its final height from this. */
  ratio: string;
  kind: MediaKind;
  /** Short uppercase locator, e.g. 'HERO / PRODUCT LOOP'. */
  label: string;
  /** The art direction. Subject, palette in words, crop, motion, duration. */
  brief: string;
  /** How to produce it — resolution, format, capture notes. */
  source?: string;
  className?: string;
}

/**
 * A correctly-sized, visibly-labelled stand-in for an asset that does not exist
 * yet. Per standing rule 14: a section may implement its media in code, point
 * at a real file in `public/`, or render one of these — a blank div is a bug.
 *
 * Renders in production too, deliberately. An unfilled slot should be visible
 * to whoever can fill it, not hidden until someone remembers. Contrast with
 * `AmbientNote`, which is dev-only because the effect it describes is
 * background texture rather than missing content.
 */
export function MediaSlot({ ratio, kind, label, brief, source, className = '' }: MediaSlotProps) {
  return (
    <div
      className={['ob-slot', className].filter(Boolean).join(' ')}
      style={{ aspectRatio: ratio }}
      role="img"
      aria-label={`Placeholder for ${kind}: ${label}. ${brief}`}
    >
      <span className="ob-slot-kind ob-meta">{kind}</span>
      <span className="ob-slot-label">{label}</span>
      <p className="ob-slot-brief">{brief}</p>
      {source ? <span className="ob-slot-source ob-meta">{source}</span> : null}
    </div>
  );
}
