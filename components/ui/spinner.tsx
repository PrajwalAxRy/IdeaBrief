import { Loader2 } from 'lucide-react';

/** Small inline rotating glyph. Buttons and phase glyphs only — never a full-page loader. */
export function Spinner({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <Loader2
      size={size}
      className={['spinner', className].filter(Boolean).join(' ')}
      aria-hidden="true"
    />
  );
}
