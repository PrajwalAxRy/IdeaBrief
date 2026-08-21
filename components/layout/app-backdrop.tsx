import type { BackdropVariant } from '@/lib/run-stage';

const BACKDROP_ASSETS: Partial<Record<BackdropVariant, string>> = {
  validate: '/media/validate/report-field.webp',
  roadmap: '/media/roadmap/backdrop.webp',
  sources: '/media/sources/field.webp',
  standalone: '/media/app/not-found.webp',
};

/**
 * The per-page ambient field. **Each page renders this, never the layout**
 * (C13) — the layout cannot see the active segment, and atmosphere that has to
 * be derived from a hook in the shell is atmosphere that drifts out of sync
 * with the page it belongs to.
 *
 * **The CSS blooms are the fallback and the plate is the field.** The recipe
 * keeps both layers live: an approved still paints over the blooms, and if it is
 * absent, slow or broken the blooms are what the surface falls back to.
 * `obsidian-app.css` carries the `data-variant` bloom offsets and scrim alphas.
 *
 * The prop names the *surface*, not the strength: a route changes its
 * atmosphere by changing one CSS rule, not its JSX.
 */
export function AppBackdrop({ variant }: { variant: BackdropVariant }) {
  const asset = BACKDROP_ASSETS[variant];

  return (
    <div
      className="ob-backdrop"
      data-variant={variant}
      data-image={asset ? 'true' : undefined}
      aria-hidden="true"
    >
      {asset ? (
        <div className="ob-backdrop-plate">
          <img className="ob-backdrop-media" src={asset} alt="" />
        </div>
      ) : null}
    </div>
  );
}
