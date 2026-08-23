'use client';

import { Fragment as PillarFragment } from '@/components/landing/fragments';
import { RoadmapFork } from '@/components/landing/roadmap-fork';
import { RoadmapSort } from '@/components/landing/roadmap-sort';
import { SiteNav } from '@/components/landing/site-nav';
import { SkipLink } from '@/components/ui/skip-link';
import { PILLARS } from '@/lib/content/landing';
import type { ReactNode } from 'react';

/**
 * `/experiment` — two candidate replacements for pillar 03's animated element,
 * shown against the static fragment currently shipping on `/`.
 *
 * **Throwaway.** Nothing here is linked from the site and nothing else imports
 * it. When a concept is chosen, it moves into `components/landing/` proper, its
 * copy joins `lib/content/landing.ts`, its recipes join `styles/obsidian.css`
 * under an `ob-` prefix, and this route, `roadmap-experiment.css`,
 * `lib/content/roadmap-experiment.ts` and the losing component are deleted.
 *
 * **The `'use client'` sits here, once.** Both concepts use timers and
 * `IntersectionObserver`; putting the directive on the page rather than on each
 * component is exactly the arrangement `Pillars` has with `IdeaSession` and
 * `ValidateSession`, and it keeps the 13-name allowlist in CLAUDE.md
 * untouched — a throwaway route should not spend from it.
 *
 * **The grid is copied from `Pillars`, to the pixel.** `400px + 96px gap + 1fr`
 * inside a 1200px container, so the right column here is the same 704px the
 * figure would actually get on `/`. A concept judged at the wrong width is not
 * judged.
 */

const PILLAR = PILLARS[2];

export default function ExperimentPage() {
  return (
    <div>
      <SkipLink />

      <div className="ob-backdrop" data-image="true" aria-hidden="true">
        <div className="ob-backdrop-plate">
          <img className="ob-backdrop-media" src="/media/backdrop-field.webp" alt="" />
        </div>
      </div>

      <div className="ob-layer">
        <SiteNav />

        <main id="main" className="ob-container">
          <header className="rx-page-head">
            <span className="ob-meta">Experiment · pillar 03</span>
            <h1 className="ob-h2">Two ways to make the roadmap move.</h1>
            <p className="rx-note">
              The same copy and the same column width as `/`, three times over. The current fragment
              first, for reference, then the two candidates. Each plays once when it scrolls into
              view and rests; use Replay to see a run again.
            </p>
          </header>

          <Variant
            tag="Current"
            note="A static card. It reuses the same chrome `IdeaSession` uses in pillar 01 — so after watching that one breathe, this reads as its unfinished ancestor. It shows one of the two lists the copy promises, and nothing at all about the ordering claim in the proof line."
          >
            <PillarFragment kind="roadmap" />
          </Variant>

          <Variant
            tag="Concept A · The fork"
            note="A hairline diagram on bare canvas — the third register, after 01's living card and 02's lit volume. One question, two futures, drawn to the same twelve-week ruler so the difference is measurable rather than asserted. It ends unresolved on purpose. Hover a branch: that is the only blue in the figure, and it is blue doing its live/active job."
          >
            <RoadmapFork />
          </Variant>

          <Variant
            tag="Concept B · The sort"
            note="The proof line, performed. Five questions arrive in the order the run produced them, measure themselves, reorder, and the winner opens into its interview script. No numbers on the bars — a figure two panels below “no score, no verdict, no fake percentage” cannot grow a 0.94."
          >
            <RoadmapSort />
          </Variant>
        </main>
      </div>
    </div>
  );
}

/**
 * One candidate, in the real pillar's clothes: the same index, kicker, title,
 * body and proof line it would sit under on `/`.
 */
function Variant({ tag, note, children }: { tag: string; note: string; children: ReactNode }) {
  return (
    <section className="rx-variant">
      <div className="grid grid-cols-[minmax(0,400px)_minmax(0,1fr)] gap-24">
        <div>
          <div className="sticky top-[18vh] flex flex-col gap-6">
            <span className="rx-variant-tag">{tag}</span>
            <p className="rx-note">{note}</p>
          </div>
        </div>

        <div>
          <div className="flex items-baseline gap-4">
            <span className="ob-pillar-index">{PILLAR?.index}</span>
            <span className="ob-meta">{PILLAR?.kicker}</span>
          </div>

          <h2 className="ob-h2 mt-6 max-w-[17ch]">{PILLAR?.title}</h2>
          <p className="ob-body mt-6 max-w-[58ch]">{PILLAR?.body}</p>
          <p className="ob-body ob-proof mt-6 max-w-[52ch]">{PILLAR?.proof}</p>

          <div className="mt-10">{children}</div>
        </div>
      </div>
    </section>
  );
}
