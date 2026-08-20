'use client';

import { Orb } from '@/components/entry/orb';
import { PageContainer } from '@/components/layout/page-container';
import { CoverageBar } from '@/components/status/coverage-bar';
import { PhaseStrip } from '@/components/status/phase-strip';
import { DisplayHeadline } from '@/components/ui/display-headline';
import { Divider } from '@/components/ui/divider';
import { SectionLabel } from '@/components/ui/section-label';
import { useRunStream } from '@/lib/hooks/use-run-stream';
import { DIMENSIONS, type Dimension } from '@/lib/schemas/evidence';
import type { RunPhaseName } from '@/lib/schemas/run';
import { useEffect, useRef, useState } from 'react';
import { FindingStream } from './finding-stream';
import { QueryTicker } from './query-ticker';

interface RunConsoleProps {
  slug: string;
  oneLiner: string;
  dimensionLabels: Record<Dimension, string>;
  onComplete: () => void;
}

/**
 * Mode A — hold the user's attention for three to five minutes by showing
 * real machinery doing real work. One of the thirteen allowed `'use client'`
 * components: it owns the whole `useRunStream` subscription plus the query
 * ticker's expand toggle.
 */
export function RunConsole({ slug, oneLiner, dimensionLabels, onComplete }: RunConsoleProps) {
  const stream = useRunStream(slug);
  const [queriesExpanded, setQueriesExpanded] = useState(false);
  const everRunningRef = useRef(false);

  useEffect(() => {
    if (stream.status !== 'complete') everRunningRef.current = true;
    if (stream.status === 'complete' && everRunningRef.current) onComplete();
  }, [stream.status, onComplete]);

  const max = Math.max(1, ...DIMENSIONS.map((dimension) => stream.counts[dimension]));
  const displayPhase: RunPhaseName = stream.phase === 'starting' ? 'searching' : stream.phase;

  return (
    <PageContainer variant="app" className="flex flex-col gap-8 py-12">
      <div className="flex flex-col gap-4">
        <DisplayHeadline as="h1" muted="Reading the web" bright="about your idea." />
        <p className="meta-line">{oneLiner}</p>

        {stream.status === 'connecting' ? (
          <p className="meta-line">starting…</p>
        ) : (
          <PhaseStrip phase={displayPhase} elapsedMs={stream.elapsedMs} />
        )}
      </div>

      <div className="grid gap-12" style={{ gridTemplateColumns: '320px 1fr' }}>
        <div className="flex flex-col gap-8" style={{ position: 'sticky', top: 96 }}>
          <QueryTicker
            queries={stream.queries}
            expanded={queriesExpanded}
            onToggleExpand={() => setQueriesExpanded(true)}
          />

          <Divider />

          <div className="flex flex-col gap-3">
            <SectionLabel>Coverage</SectionLabel>
            {DIMENSIONS.map((dimension) => (
              <CoverageBar
                key={dimension}
                label={dimensionLabels[dimension]}
                count={stream.counts[dimension]}
                max={max}
              />
            ))}
          </div>

          <Divider />

          <p className="meta-line">
            {stream.discarded} excerpts discarded
            <br />
            (didn&rsquo;t match the page)
          </p>
        </div>

        <div className="relative flex flex-col gap-4">
          <FindingStream
            findings={stream.findings}
            newestFindingId={stream.newestFindingId}
            running={stream.status !== 'complete'}
          />
          <Orb dimmed />
        </div>
      </div>

      <p className="meta-line">
        You can close this tab — the run keeps going. Come back to this link.
      </p>
    </PageContainer>
  );
}
