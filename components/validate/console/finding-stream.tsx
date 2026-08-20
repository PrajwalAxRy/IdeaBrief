'use client';

import { useEvidence } from '@/components/validate/evidence/evidence-context';
import { FindingCard } from '@/components/validate/evidence/finding-card';
import { citationNumberForFindingId } from '@/lib/citations';
import type { Finding } from '@/lib/schemas/evidence';
import { useEffect, useRef, useState } from 'react';

const VISIBLE_CAP = 25;
const ENTER_ANIMATION_MS = 520;

/**
 * The Run Console's prepend-with-animation list. No `'use client'` directive
 * of its own — like `QueryTicker`, it's only ever rendered inside
 * `RunConsole`'s client subtree, and holds state (which card just arrived,
 * whether the "+N earlier" cap is expanded) purely as a convenience for that
 * subtree, not as an independent client boundary.
 */
export function FindingStream({
  findings,
  newestFindingId,
  running,
}: {
  findings: Finding[];
  newestFindingId: string | null;
  running: boolean;
}) {
  const { open } = useEvidence();
  const [expanded, setExpanded] = useState(false);
  const [justArrivedId, setJustArrivedId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const seenNewestRef = useRef<string | null>(null);

  useEffect(() => {
    if (!newestFindingId || newestFindingId === seenNewestRef.current) return;
    seenNewestRef.current = newestFindingId;
    setJustArrivedId(newestFindingId);
    const arrived = findings.find((finding) => finding.id === newestFindingId);
    if (arrived) setAnnouncement(`Finding verified: ${arrived.text}`);
    const timer = setTimeout(() => setJustArrivedId(null), ENTER_ANIMATION_MS);
    return () => clearTimeout(timer);
  }, [newestFindingId, findings]);

  if (findings.length === 0) {
    return running ? (
      <p className="empty-note">
        Nothing verified yet. Findings appear here as they pass the check.
      </p>
    ) : null;
  }

  const visible = expanded ? findings : findings.slice(0, VISIBLE_CAP);
  const hiddenCount = findings.length - visible.length;

  return (
    <div className="flex flex-col gap-4">
      {/* 13.3: a visually hidden, polite announcement per finding — decoupled from the
          visible cards themselves, which stay silent to a screen reader on every render. */}
      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>
      {visible.map((finding) => (
        <FindingCard
          key={finding.id}
          finding={finding}
          variant="stream"
          entering={finding.id === justArrivedId}
          onOpenEvidence={() => open(citationNumberForFindingId(finding.id))}
        />
      ))}
      {!expanded && hiddenCount > 0 && (
        <button type="button" className="text-action" onClick={() => setExpanded(true)}>
          +{hiddenCount} earlier findings
        </button>
      )}
    </div>
  );
}
