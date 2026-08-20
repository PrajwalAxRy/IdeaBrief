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
 * yet. Per deep-canopy-design: a section may implement its media in code, point
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
      className={['media-slot', className].filter(Boolean).join(' ')}
      style={{ aspectRatio: ratio }}
      role="img"
      aria-label={`Placeholder for ${kind}: ${label}. ${brief}`}
    >
      <span className="media-slot-kind">{kind}</span>
      <span className="media-slot-label">{label}</span>
      <p className="media-slot-brief">{brief}</p>
      {source ? <span className="media-slot-source">{source}</span> : null}
    </div>
  );
}
