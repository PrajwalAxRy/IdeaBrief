'use client';

import type { RunSegment } from '@/lib/run-stage';
import type { RunStatus } from '@/lib/schemas/run';
import { useSelectedLayoutSegment } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { EvidenceButton } from './evidence-button';
import { RunIdentity } from './run-identity';
import { StageRail } from './stage-rail';

const SEGMENTS = new Set<RunSegment>(['define', 'validate', 'roadmap', 'sources']);

function toSegment(raw: string | null): RunSegment {
  return raw !== null && SEGMENTS.has(raw as RunSegment) ? (raw as RunSegment) : 'validate';
}

interface RunHeaderProps {
  slug: string;
  status: RunStatus;
  oneLiner: string;
  metaBySegment: Record<RunSegment, string[]>;
  /** `<CopyLinkButton slug={slug} />`, server-rendered in the layout. */
  copyLink: ReactNode;
  verifiedCount: number;
  discardedCount: number;
}

/**
 * The sticky condensing header (D19), ported from the landing nav's mechanism
 * verbatim: one effect, one `requestAnimationFrame` guard, one passive scroll
 * listener, one boolean. **React never re-renders on scroll beyond that single
 * flip** — no scroll position in state, no transform written from React.
 * Everything visual hangs off `data-scrolled` in CSS.
 *
 * `read()` runs once immediately so a mid-page reload starts condensed.
 *
 * The condense is a state change, not motion, so the listener attaches under
 * `prefers-reduced-motion` too; §16's zeroed durations simply land the header
 * on whichever state the attribute names.
 *
 * `CopyLinkButton` arrives as a prop rather than being rendered here: it is an
 * async Server Component that reads `headers()`, and a client component cannot
 * render one. `RunShell` stays a server component and the page bodies pass
 * straight through it as `children` — the client boundary is the chrome, not
 * the page (standing rule 22).
 */
export function RunHeader({
  slug,
  status,
  oneLiner,
  metaBySegment,
  copyLink,
  verifiedCount,
  discardedCount,
}: RunHeaderProps) {
  const segment = toSegment(useSelectedLayoutSegment());
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;

    const read = () => {
      frame = 0;
      setScrolled(window.scrollY > 24);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <header className="ob-run-header" data-scrolled={scrolled}>
        <div className="ob-run-header-inner">
          <RunIdentity slug={slug} oneLiner={oneLiner} metaParts={metaBySegment[segment]} />
          <StageRail slug={slug} status={status} segment={segment} />
          {/* `gap-3` is Tailwind, deliberately: `.ob-run-actions` sets no gap
              of its own, so this is the load-bearing proof that the recipe
              layer has not eaten the utility layer (pitfalls §1). */}
          <div className="ob-run-actions gap-3">
            {/* **Not on `/sources`.** The overlay and the route render the same
                `EvidenceExplorer` (C16), so here the button would open a dialog
                containing the page you are already looking at — and two mounted
                explorers would both publish a drawer scope, with the overlay's
                unfiltered one silently winning over the route's live filter. */}
            {segment === 'sources' ? null : (
              <EvidenceButton verifiedCount={verifiedCount} discardedCount={discardedCount} />
            )}
            {copyLink}
          </div>
        </div>
      </header>
      {/* Constant height, so the 72 → 56 condense reflows nothing below it
          (standing rule 12). It is also what makes Define's
          `100vh - var(--ob-header-h)` exact rather than approximate. */}
      <div className="ob-run-header-spacer" aria-hidden="true" />
    </>
  );
}
