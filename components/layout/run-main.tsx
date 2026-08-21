'use client';

import type { RunSegment } from '@/lib/run-stage';
import { useSelectedLayoutSegment } from 'next/navigation';
import type { ReactNode } from 'react';

const SEGMENTS = new Set<RunSegment>(['define', 'validate', 'roadmap', 'sources']);

function toSegment(raw: string | null): RunSegment {
  return raw !== null && SEGMENTS.has(raw as RunSegment) ? (raw as RunSegment) : 'validate';
}

/**
 * Stamps `<main>` with the route's chrome mode so the shell's variant rules
 * have something to key on.
 *
 * `surface` is Define: a full-height working surface with no page scroll (D9),
 * and therefore no footer — a 64px bar under a `100vh` column would reintroduce
 * exactly the scrollbar D9 removes. Everything else is a document.
 *
 * Children are server-rendered and passed as props, so nothing under
 * `/r/[slug]/*` joins the client bundle because of this file.
 */
export function RunMain({ children }: { children: ReactNode }) {
  const segment = toSegment(useSelectedLayoutSegment());

  return (
    <main
      id="main"
      className="ob-app-main"
      data-chrome={segment === 'define' ? 'surface' : 'document'}
      data-segment={segment}
    >
      {children}
    </main>
  );
}
