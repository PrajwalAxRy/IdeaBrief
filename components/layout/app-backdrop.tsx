import type { BackdropVariant } from '@/lib/run-stage';

/**
 * The per-page ambient field. **Each page renders this, never the layout**
 * (C13) — the layout cannot see the active segment, and atmosphere that has to
 * be derived from a hook in the shell is atmosphere that drifts out of sync
 * with the page it belongs to.
 *
 * The recipe itself lives in styles/obsidian.css §1 (two drifting radial
 * blooms at 34s and 52s — ambient, legal under D17) and is **not redefined**.
 * `obsidian-app.css` §5 carries only the `data-variant` offsets, which shift
 * the blooms so four pages don't share one composition.
 *
 * The prop names the *surface*, not the strength: a route changes its
 * atmosphere by changing one CSS rule, not its JSX.
 */
export function AppBackdrop({ variant }: { variant: BackdropVariant }) {
  return <div className="ob-backdrop" data-variant={variant} aria-hidden="true" />;
}
