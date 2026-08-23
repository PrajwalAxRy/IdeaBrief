import { DIMENSIONS } from '@/lib/content/landing';

/**
 * A thin drifting strip naming the five dimensions every research run covers.
 * Substance rather than decoration — it is the scope of Pillar 2, stated once.
 * Pauses on hover so it can actually be read.
 *
 * The track holds the set twice; the animation translates exactly -50%, so the
 * second half arrives where the first began and the loop has no seam.
 */
export function DimensionMarquee() {
  const half = [...DIMENSIONS, ...DIMENSIONS, ...DIMENSIONS];

  return (
    <div className="ob-marquee" aria-hidden="true">
      <div className="ob-marquee-track">
        {[...half, ...half].map((dimension, i) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: an intentionally repeated set; position is the identity
            key={`${dimension}-${i}`}
            className="ob-marquee-item ob-meta ob-meta-solid"
          >
            <span className="ob-marquee-sep">◇</span>
            {dimension}
          </span>
        ))}
      </div>
    </div>
  );
}
