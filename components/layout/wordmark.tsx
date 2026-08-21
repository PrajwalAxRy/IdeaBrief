import { APP_BRAND } from '@/lib/content/app';
import Link from 'next/link';
import { LogoMark } from './logomark';

/**
 * The Groundwork brand mark: `LogoMark` + name, linking home. **One glyph
 * definition in the repo** — the run chrome, both not-found pages and the
 * landing nav all render this, none of them inline a second copy of the SVG.
 *
 * `size` is the *word's* type size, not the glyph's: `md` is `.ob-wordmark`'s
 * own 18px (the landing nav, unchanged) and `sm` is 16px for the run chrome,
 * where the mark sits beside a one-liner and a meta row and must not out-shout
 * them. The glyph stays `LogoMark`'s 15×15 at both sizes, so promoting the
 * landing nav onto this component moves nothing on `/`.
 *
 * The glyph rotates 90° on hover — `.ob-wordmark` in styles/obsidian.css §6.
 */
export function Wordmark({
  size = 'md',
  className = '',
}: { size?: 'md' | 'sm'; className?: string }) {
  return (
    <Link
      href="/"
      className={['ob-wordmark', className].filter(Boolean).join(' ')}
      data-size={size}
      aria-label={`${APP_BRAND.name} — home`}
    >
      {/* The class goes on the SVG, not a wrapper span: `.ob-wordmark-glyph`
          animates `transform`, which does not apply to a non-replaced inline
          element. */}
      <LogoMark className="ob-wordmark-glyph" />
      {APP_BRAND.name}
    </Link>
  );
}
