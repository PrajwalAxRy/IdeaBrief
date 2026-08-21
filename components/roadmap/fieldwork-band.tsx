import { MediaSlot } from '@/components/ui/media-slot';
import { ROADMAP } from '@/lib/content/app';
import { type FieldworkAsset, FieldworkMedia } from './fieldwork-media';

/** Set per panel once an asset lands; `MediaSlot` renders until then. */
const ASSETS: Partial<Record<string, FieldworkAsset>> = {};

/**
 * The page's hinge, and **the one place photography is honest on the app side**
 * (D18).
 *
 * It earns its position between `01 OPEN QUESTIONS` and `02 BUILD ROADMAP`:
 * everything above it is a question the web declined to answer, everything
 * below assumes you went and asked. At the top of the page it would be
 * decoration over a headline; at the bottom it would be a send-off.
 *
 * **It carries no heading** — it is `01`'s closing content, which is what keeps
 * the route's outline at C17's `h2 ×2 · h3 ×11`.
 *
 * **Three `MediaSlot`s is a finished state, not a gap** (rule 14). Each is
 * correctly sized, hairline-framed, and carries its own art-direction brief on
 * screen. **Do not delete them as cleanup** — a slot is the spec for an asset
 * someone still owes, and deleting it deletes the requirement.
 *
 * Server component. `FieldworkMedia` is the only client leaf, and only once an
 * asset exists.
 */
export function FieldworkBand() {
  return (
    <div className="ob-fieldwork">
      <p className="ob-h2 ob-fieldwork-headline">{ROADMAP.fieldwork.headline}</p>
      <p className="ob-lead ob-fieldwork-lead">{ROADMAP.fieldwork.lead}</p>

      <div className="ob-fieldwork-grid">
        {ROADMAP.fieldwork.panels.map((panel, index) => {
          const asset = ASSETS[panel.id];
          return (
            <figure
              key={panel.id}
              className="ob-fieldwork-panel"
              style={{ ['--ob-reveal-delay' as string]: `${index * 110}ms` }}
            >
              {asset ? (
                <FieldworkMedia asset={asset} alt={panel.brief} />
              ) : (
                <MediaSlot ratio="16/9" kind="video" label={panel.caption} brief={panel.brief} />
              )}
              <figcaption className="ob-meta">{panel.caption}</figcaption>
            </figure>
          );
        })}
      </div>
    </div>
  );
}
