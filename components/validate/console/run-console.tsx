'use client';

import { PhaseStrip } from '@/components/status/phase-strip';
import { APP_CONSOLE } from '@/lib/content/app';
import { formatElapsed } from '@/lib/format';
import { useRunStream } from '@/lib/hooks/use-run-stream';
import type { RunPhaseName } from '@/lib/schemas/run';
import { useEffect, useRef, useState } from 'react';
import { ConsoleRail } from './console-rail';
import { FindingStream } from './finding-stream';

/** One write per 3s. 84 per-item announcements in 45 seconds is a firehose. */
const ANNOUNCE_EVERY_MS = 3_000;

interface RunConsoleProps {
  slug: string;
  oneLiner: string;
  /** `?stall=1` — the QA affordance for the stalled state. */
  stall?: boolean;
  onComplete: () => void;
}

/**
 * Mode A — hold the user's attention by showing real machinery doing real
 * work. It owns the `useRunStream` subscription and the ticker's expand
 * toggle; everything else is composed.
 *
 * `Orb` is gone. It was `position: absolute; bottom: -240px; z-index: -1`
 * inside a column that grew to ~5,000px, so it parked below the fold on every
 * run — the positioning bug was a symptom of it never having had a job here.
 * Obsidian's ambient field is `.ob-backdrop`, which is `position: fixed` and
 * cannot fall below a growing column, and **the page mounts it, not this
 * component** (C13): the page cannot know the client-side mode, and two
 * ambient fields on one page is one too many under D17.
 */
export function RunConsole({ slug, oneLiner, stall = false, onComplete }: RunConsoleProps) {
  const stream = useRunStream(slug, { stall });
  const [queriesExpanded, setQueriesExpanded] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const everRunningRef = useRef(false);
  const announcedAtRef = useRef(0);

  useEffect(() => {
    if (stream.status !== 'complete') everRunningRef.current = true;
    if (stream.status === 'complete' && everRunningRef.current) onComplete();
  }, [stream.status, onComplete]);

  const searched = stream.queries.filter((row) => row.state === 'done').length;
  const verified = stream.findings.length;

  useEffect(() => {
    const now = Date.now();
    if (now - announcedAtRef.current < ANNOUNCE_EVERY_MS) return;
    announcedAtRef.current = now;
    setAnnouncement(APP_CONSOLE.liveSummary(searched, 19, verified));
  }, [searched, verified]);

  const connecting = stream.status === 'connecting';
  const complete = stream.status === 'complete';
  const displayPhase: RunPhaseName = stream.phase === 'starting' ? 'searching' : stream.phase;

  const note = complete
    ? `${formatElapsed(stream.elapsedMs)} · ${APP_CONSOLE.complete}`
    : stream.status === 'stalled'
      ? stream.stalledLong
        ? APP_CONSOLE.stalledLong
        : APP_CONSOLE.stalled
      : undefined;

  return (
    <div className="ob-console ob-container-app">
      <div className="ob-console-head">
        <h1 className="ob-h1">{APP_CONSOLE.h1}</h1>
        <p className="ob-lead">{oneLiner}</p>

        {connecting ? (
          <p className="ob-meta">{APP_CONSOLE.connecting}</p>
        ) : (
          <PhaseStrip
            phase={displayPhase}
            elapsedMs={stream.elapsedMs}
            state={stream.status}
            note={note}
          />
        )}

        {stream.stalledLong && (
          <button
            type="button"
            className="ob-btn ob-btn-ghost self-start"
            onClick={() => window.location.reload()}
          >
            {APP_CONSOLE.refresh}
          </button>
        )}
      </div>

      <div className="ob-console-grid">
        <ConsoleRail
          slug={slug}
          queries={stream.queries}
          expanded={queriesExpanded}
          onToggleExpand={() => setQueriesExpanded((value) => !value)}
          counts={stream.counts}
          running={!complete}
          elapsedMs={stream.elapsedMs}
          discardedCount={stream.discarded}
          lastDiscard={stream.lastDiscard}
        />

        <FindingStream
          findings={stream.findings}
          newestFindingId={stream.newestFindingId}
          running={!complete}
          connecting={connecting}
        />
      </div>

      <p className="ob-console-foot ob-body">{APP_CONSOLE.foot}</p>

      {/* One region, debounced. The newest finding and the newest query stay
          reachable in the DOM and in `title`; nothing is hidden, only
          un-shouted. */}
      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>
    </div>
  );
}
