'use client';

import { useRoadmapNav } from './roadmap-context';

/**
 * The tiny client leaf that lets `RoadmapStep`/`RoadmapTimeline` stay Server
 * Components — only the node itself needs to know whether it's the current
 * pulse target, matching the `CitationChip`/`FindingCard` leaf pattern used
 * throughout the report.
 */
export function TimelineNode({ phase, accent }: { phase: string; accent: boolean }) {
  const { isPulsing } = useRoadmapNav();
  const pulsing = isPulsing(`step-${phase}`);

  return (
    <span
      className={[
        'timeline-node',
        accent ? 'timeline-node--accent' : '',
        pulsing ? 'timeline-node--pulse' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-hidden="true"
    />
  );
}
