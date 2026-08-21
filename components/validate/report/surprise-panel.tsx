import { renderCitedText } from '@/components/validate/evidence/cited-text';
import type { Surprise } from '@/lib/schemas/report';

/**
 * §05 — the screenshot moment.
 *
 * **The ordinal drops to `.ob-meta` and the surprise itself takes the type.**
 * The largest thing on this page used to be three list ordinals at up to 68px,
 * which is a page whose loudest element is a counter. Now the headline runs at
 * `--ob-h1` down a hairline-ruled page.
 *
 * **No card, no featured ring.** Obsidian has no shadows and no featured card;
 * the weight comes from scale and negative tracking. Heading *size* is a class,
 * heading *level* is structure — these are `<h3>` at `--ob-h1`.
 */
export function SurprisePanel({ surprises }: { surprises: Surprise[] }) {
  return (
    <>
      {surprises.map((surprise, index) => (
        <div key={surprise.headline} className="ob-surprise-row">
          <span className="ob-surprise-ord ob-meta">{String(index + 1).padStart(2, '0')}</span>
          <div>
            <h3 className="ob-h1">{surprise.headline}</h3>
            <p className="ob-body">{renderCitedText(surprise.detail.text)}</p>
          </div>
        </div>
      ))}
    </>
  );
}
