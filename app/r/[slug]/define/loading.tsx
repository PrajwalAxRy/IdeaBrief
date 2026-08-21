import { AppBackdrop } from '@/components/layout/app-backdrop';
import { Button } from '@/components/ui/button';
import { FieldSkeleton } from '@/components/ui/skeleton';
import { TextArea } from '@/components/ui/text-area';
import { BRIEF, DEFINE } from '@/lib/content/app';

/**
 * Define's Suspense fallback, rebuilt to A6's shipped geometry (R20).
 *
 * **The Obsidian answer to a loading state is that the hairlines are already
 * correct.** The band, the split, the aside's floor-to-ceiling border, the h1,
 * `THE BRIEF`, all twelve field labels and the composer's whole frame render
 * *for real*; only data-derived values are blank blocks. A skeleton that
 * already has the page's structure is not a placeholder — it is the page with
 * its content pending, which is the only honest way to distinguish *pending*
 * from *empty*.
 *
 * Its predecessor stubbed **6** fields against a brief that has twelve, and a
 * 44px block against a ~213px headline. Both are fixed here, and the field
 * count is derived from `BRIEF.fieldGroups` rather than typed, so it cannot
 * drift from the panel again.
 *
 * The root element is `.ob-define` and `<main>`'s only element child besides
 * the backdrop — `main:has(> .ob-define)` is what makes the `100vh` arithmetic
 * exact, and a wrapper here would silently restore the page scroll D9 removes.
 *
 * **The textarea is `disabled`, deliberately.** A live field inside a Suspense
 * fallback discards whatever was typed the instant the real tree replaces it,
 * which breaks *never lose user input* — the exact promise `?sendfail=1`
 * exists to protect. The frame's height is identical either way, which is all
 * the zero-shift contract needs.
 *
 * There is no `ApproveButton`: it does not exist until a brief does.
 */
export default function DefineLoading() {
  return (
    <>
      <AppBackdrop variant="define" />

      <div className="ob-define">
        <div className="ob-define-band">
          <h1 className="ob-h2">{DEFINE.title}</h1>
          {/* Reserves `BriefProgress` — one mono line, never a count we don't have. */}
          <div className="ob-skel" style={{ height: 12, width: 180 }} aria-hidden="true" />
        </div>

        <div className="ob-define-split">
          <div className="ob-define-col">
            <div className="ob-define-scrollwrap">
              <div className="ob-define-scroll">
                <div className="ob-define-thread">
                  {/* One AI turn, inside the 64ch measure the real transcript uses. */}
                  <div className="flex flex-col gap-2" aria-hidden="true">
                    <div className="ob-skel-line" style={{ width: '96%' }} />
                    <div className="ob-skel-line" style={{ width: '88%' }} />
                    <div className="ob-skel-line" style={{ width: '54%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="ob-define-composer">
              <div className="ob-define-composer-inner">
                <div className="ob-composer">
                  <TextArea
                    variant="composer"
                    minRows={2}
                    placeholder={DEFINE.composer.placeholder}
                    aria-label={DEFINE.title}
                    disabled
                  />
                </div>
                <div className="flex items-center justify-between gap-4 pt-3">
                  <Button variant="ghost" size="sm" disabled>
                    {DEFINE.composer.dontKnow}
                  </Button>
                  <span className="ob-composer-hint ob-meta">{DEFINE.composer.hint}</span>
                  <Button variant="ghost" size="sm" disabled>
                    {DEFINE.composer.send}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="ob-define-aside">
            <div className="ob-define-aside-head">
              <h2 className="ob-meta">{DEFINE.briefHead}</h2>
            </div>

            <div className="ob-define-aside-scroll">
              {/* Twelve fields in A7's five groups — the panel's own shape, not a
                  flat list, so the group hairlines land where they will land. */}
              <div className="ob-brief">
                {BRIEF.fieldGroups.map((group) => (
                  <div key={group[0]} className="ob-brief-group">
                    {group.map((key) => (
                      <FieldSkeleton key={key} label={BRIEF.fieldLabels[key]} />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="ob-define-aside-foot">
              <div className="ob-skel" style={{ height: 12, width: 280 }} aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
