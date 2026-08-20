import type { ReactNode } from 'react';

/**
 * A dev-only badge describing a background effect that belongs to a section
 * rather than to a frame — the on-screen half of the `AmbientNote` pattern in
 * deep-canopy-design. Pair it with a JSX comment stating the same brief, so the
 * intent survives in the source after this stops rendering.
 *
 * Invisible in production: unlike a `MediaSlot`, what this describes is texture,
 * and a shipped page missing it is still a complete page.
 */
export function AmbientNote({ children }: { children: ReactNode }) {
  if (process.env.NODE_ENV === 'production') return null;
  return (
    <span className="ambient-note" aria-hidden="true">
      ◆ {children}
    </span>
  );
}
