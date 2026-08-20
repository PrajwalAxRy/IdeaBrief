'use client';

import { VerifiedBadge } from '@/components/status/verified-badge';
import { Popover } from '@/components/ui/popover';
import { formatDomain } from '@/lib/format';
import { useRef, useState } from 'react';
import { useEvidence } from './evidence-context';

interface CitationChipProps {
  n: number;
  /** True only for the very first chip on the page — carries the one-time hover hint (03 §3.8). */
  hintCandidate?: boolean;
}

/**
 * Inline `[n]` — the three-layer disclosure's first two layers live here:
 * hover (300ms delay) opens a `Popover` with the excerpt (layer 2), click
 * opens the `EvidenceDrawer` (layer 3). Numbering is resolved from the one
 * global `EvidenceContext`, so the same `[12]` means the same finding on the
 * report, the sources page, and (later) the roadmap.
 */
export function CitationChip({ n, hintCandidate = false }: CitationChipProps) {
  const { findFinding, open, hintDismissed, dismissHint } = useEvidence();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finding = findFinding(n);

  function startHover() {
    dismissHint();
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setPopoverOpen(true), 300);
  }

  function endHover() {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setPopoverOpen(false);
  }

  if (!finding) {
    // Should never happen given CitedTextSchema's refine — fail visibly rather than silently.
    return <span className="citation-chip">[{n}]</span>;
  }

  const trigger = (
    <button
      type="button"
      className="citation-chip"
      onMouseEnter={startHover}
      onMouseLeave={endHover}
      onFocus={startHover}
      onBlur={endHover}
      onClick={() => {
        dismissHint();
        open(n);
      }}
    >
      [{n}]
    </button>
  );

  return (
    <span className="citation-chip-wrap">
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen} trigger={trigger} side="top">
        <p className="citation-popover-excerpt">&ldquo;{finding.excerpt}&rdquo;</p>
        <div className="citation-popover-meta">
          <span className="meta-line">
            {formatDomain(finding.source_url)} · {finding.source_date}
          </span>
          <VerifiedBadge />
        </div>
      </Popover>
      {hintCandidate && !hintDismissed && (
        <output className="citation-hint">Hover any [n] to see the source</output>
      )}
    </span>
  );
}
