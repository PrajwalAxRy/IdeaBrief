'use client';

import { VerifiedBadge } from '@/components/status/verified-badge';
import { Popover } from '@/components/ui/popover';
import { formatDate, formatDomain } from '@/lib/format';
import { useRef, useState } from 'react';
import { useEvidence } from './evidence-context';
import { StanceMark } from './stance-mark';

/**
 * Inline `[n]` — layers one and two of the three-layer disclosure. Hover (after
 * 300ms) opens a `Popover` with the excerpt; click opens the `EvidenceDrawer`.
 * Numbering resolves from the one global `EvidenceContext`, so the same `[12]`
 * means the same finding on the report, the sources page and the roadmap.
 *
 * **Blue is legitimate here** and this is the one place two of its jobs
 * coincide: the chip is a pointer at proof, and clicking it is the action that
 * produces the proof. That is why the chip keeps the accent when section
 * labels lose it.
 *
 * **`.ob-cite` is the only element permitted to render a bracketed number
 * inside running prose** (C12). `[03]` on an explorer row and `[Q02]` in a
 * skeleton are ordinals in a grid cell, not references in a sentence, and are
 * outside the rule.
 *
 * Keyboard parity is not optional: focus opens the popover too.
 */
export function CitationChip({ n }: { n: number }) {
  const { findFinding, open, seenIds, layer, dismissHint } = useEvidence();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finding = findFinding(n);

  function startHover() {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setPopoverOpen(true), 300);
  }

  function endHover() {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setPopoverOpen(false);
  }

  if (!finding) {
    // Should never happen given CitedTextSchema's refine — fail visibly rather than silently.
    return <span className="ob-cite">[{n}]</span>;
  }

  /* `:visited` does not apply to a `<button>`, so "seen" is a Set on the
     provider — in memory only. It answers "have I already checked this one?"
     for the reading session and is meaningless after it. */
  const isOpen = layer.kind === 'finding' && layer.id === finding.id;

  const trigger = (
    <button
      type="button"
      className="ob-cite"
      data-open={isOpen || undefined}
      data-seen={seenIds.has(finding.id) || undefined}
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
    <Popover
      open={popoverOpen}
      onOpenChange={setPopoverOpen}
      trigger={trigger}
      side="top"
      className="ob-cite-pop"
    >
      <p className="ob-cite-pop-excerpt">&ldquo;{finding.excerpt}&rdquo;</p>
      <hr className="ob-rule" />
      <div className="ob-cite-pop-foot">
        <span className="ob-meta">
          {formatDomain(finding.source_url)} · {formatDate(finding.source_date)}
        </span>
        <span className="flex items-center gap-3">
          {/* The popover gains stance, which it has never carried: a source
              that contests the idea should not be able to ambush the reader
              only at layer three. */}
          <StanceMark stance={finding.stance} />
          <VerifiedBadge />
        </span>
      </div>
    </Popover>
  );
}
