'use client';

import { runStreamEntry } from '@/lib/hooks/use-run-stream';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { RunConsole } from './console/run-console';

/** The console holds on `complete` before anything fades. */
const COMPLETE_HOLD_MS = 600;
/** `#what-we-found` reveals 200ms into the fade, so the eye lands on it first. */
const ARRIVED_AT_MS = 400;
/** 400ms fade + the 120ms offset on the incoming layer. */
const CROSS_FADE_MS = 520;

type Mode = 'console' | 'crossing' | 'report';

interface ValidateViewProps {
  slug: string;
  oneLiner: string;
  /** `?stall=1` — the QA affordance for the stalled state. */
  stall?: boolean;
  /** The Report, already rendered server-side — passed through, never
   *  re-rendered client-side, so it stays almost-no-JS. */
  reportSlot: ReactNode;
}

/**
 * Picks Mode A (Run Console) vs Mode B (Report) and owns the in-place,
 * no-navigation cross-fade between them.
 *
 * **R24, closed.** This used to be `useState(() => isRunStreamActive(slug))`,
 * which reads `localStorage` — `false` on the server, `true` on the client —
 * so the server rendered the Report and the client silently regenerated the
 * Console. It now renders Mode B on the server *and* on the first client
 * render, and promotes inside a `useLayoutEffect`: never a `useEffect` (that
 * runs after paint and the report would flash for a frame), never during
 * render (R8's disease).
 *
 * **Reduced motion never promotes at all.** A 45-second replay is
 * auto-advancing content, which is motion, and a console that resolves to its
 * end state and then dissolves 400ms later is a flash, not a surface. The
 * visitor gets the report directly, in its final state — and everything the
 * console carried (19 queries, per-dimension counts, 18 discards with reasons)
 * is present in the report and the explorer.
 *
 * Once the console has mounted it keeps the same position in the tree through
 * the fade, so nothing remounts and the replay is never restarted.
 */
export function ValidateView({ slug, oneLiner, stall = false, reportSlot }: ValidateViewProps) {
  const [mode, setMode] = useState<Mode>('report');
  const [crossed, setCrossed] = useState(false);
  const [fading, setFading] = useState(false);
  const [arrived, setArrived] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const frameRef = useRef(0);

  useLayoutEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const entry = runStreamEntry(slug);
    if (entry === 'cold') return;
    /* Landing inside the four-second slack past the end: everything has already
       happened, so this visitor gets the fade rather than a hard cut. That is
       the slack's whole purpose. */
    if (entry === 'crossing') startCrossFade();
    else setMode('console');
    // Runs once, at mount — the entry decision is not re-evaluated mid-run.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      for (const timer of timers) clearTimeout(timer);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  function startCrossFade() {
    /* The console page does not scroll — the stream owns its own scrollport and
       the footer's height is subtracted, not added — so this is normally a
       no-op. Assert it, and correct it *before* the fade rather than during. */
    if (window.scrollY !== 0) window.scrollTo({ top: 0, behavior: 'auto' });
    setCrossed(true);
    setMode('crossing');
    /* Both layers mount at their base opacities first; the fade is armed one
       frame later, or the incoming layer resolves straight to 1 and there is
       no transition to see. */
    frameRef.current = requestAnimationFrame(() => {
      setFading(true);
      timersRef.current.push(
        setTimeout(() => setArrived(true), ARRIVED_AT_MS),
        setTimeout(() => setMode('report'), CROSS_FADE_MS),
      );
    });
  }

  function onConsoleComplete() {
    timersRef.current.push(setTimeout(startCrossFade, COMPLETE_HOLD_MS));
  }

  /* A cold visitor renders the report with no wrapper and no `data-arrived` —
     the attribute selector never matches, so there is no flash of hidden
     content and no fade on the common path. */
  if (mode === 'report' && !crossed) return <>{reportSlot}</>;

  return (
    <div className="ob-xfade" data-mode={mode} data-fading={fading}>
      {mode !== 'report' && (
        <div className="ob-xfade-out">
          <RunConsole
            slug={slug}
            oneLiner={oneLiner}
            stall={stall}
            onComplete={onConsoleComplete}
          />
        </div>
      )}
      {mode !== 'console' && (
        <div className="ob-xfade-in">
          <div className="ob-xfade-report" data-arrived={arrived}>
            {reportSlot}
          </div>
        </div>
      )}
    </div>
  );
}
