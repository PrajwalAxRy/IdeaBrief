'use client';

import { VerifiedBadge } from '@/components/status/verified-badge';
import { Drawer } from '@/components/ui/drawer';
import { MetaLine } from '@/components/ui/meta-line';
import { TextAction } from '@/components/ui/text-action';
import { Well } from '@/components/ui/well';
import { citationNumberForFindingId } from '@/lib/citations';
import { formatDomain } from '@/lib/format';
import { useEffect } from 'react';
import { useEvidence } from './evidence-context';

/**
 * The full evidence view — one instance in the app, driven entirely by
 * `EvidenceContext` (10-component-system.md: "Drawer ... One instance in the
 * app, driven by state"). `Esc` and focus-trap/restore come from the `Drawer`
 * primitive's Radix Dialog; `←`/`→` walking the corpus is handled here since
 * Radix doesn't provide that behaviour.
 */
export function EvidenceDrawer() {
  const { evidence, openFinding, close, next, prev, triggerRef } = useEvidence();
  const isOpen = openFinding !== null;

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'ArrowRight') next();
      if (event.key === 'ArrowLeft') prev();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, next, prev]);

  const citation = openFinding ? citationNumberForFindingId(openFinding.id) : null;
  const index = openFinding ? evidence.findIndex((finding) => finding.id === openFinding.id) : -1;

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) close();
      }}
      onCloseAutoFocus={(event) => {
        event.preventDefault();
        triggerRef.current?.focus();
      }}
      title={citation !== null ? `Evidence ${citation}` : 'Evidence'}
      footer={
        openFinding && (
          <div className="flex items-center justify-between">
            <TextAction disabled={index <= 0} onClick={prev}>
              ← Prev evidence
            </TextAction>
            <TextAction disabled={index >= evidence.length - 1} onClick={next}>
              Next evidence →
            </TextAction>
          </div>
        )
      }
    >
      {openFinding && (
        <div className="flex flex-col gap-6">
          <MetaLine parts={[openFinding.id, 'VERIFIED', openFinding.dimension]} />

          <div className="flex flex-col gap-2">
            <span className="evidence-field-label">Finding</span>
            <p style={{ color: 'var(--text-primary)' }}>{openFinding.text}</p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="evidence-field-label">Verbatim excerpt</span>
            <Well>
              <p className="evidence-excerpt">&ldquo;{openFinding.excerpt}&rdquo;</p>
            </Well>
            <p className="empty-note">This text was found on the page below.</p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="evidence-field-label">Source</span>
            <a
              href={openFinding.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-action"
            >
              {formatDomain(openFinding.source_url)} ↗
            </a>
            <p className="empty-note">Published {openFinding.source_date}</p>
            <p className="empty-note">Stance: {openFinding.stance}</p>
          </div>

          <VerifiedBadge />
        </div>
      )}
    </Drawer>
  );
}
