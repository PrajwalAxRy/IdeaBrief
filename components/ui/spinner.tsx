import { Loader2 } from 'lucide-react';

/**
 * Small inline rotating glyph. Buttons and phase glyphs only — never a
 * full-page loader.
 *
 * Keeps rotating under `prefers-reduced-motion`, deliberately: it is a
 * progress affordance, and a frozen spinner is a static glyph claiming work is
 * happening. See obsidian-app.css §16.
 */
export function Spinner({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <Loader2
      size={size}
      className={['ob-spinner', className].filter(Boolean).join(' ')}
      aria-hidden="true"
    />
  );
}
