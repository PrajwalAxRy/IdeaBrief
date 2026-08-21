'use client';

import { VerifiedBadge } from '@/components/status/verified-badge';
import { Button } from '@/components/ui/button';
import { Drawer } from '@/components/ui/drawer';
import { MetaLine } from '@/components/ui/meta-line';
import { citationNumberForFindingId } from '@/lib/citations';
import { APP_EVIDENCE, META_SEPARATOR } from '@/lib/content/app';
import { formatDate, formatDomain } from '@/lib/format';
import {
  DIMENSION_LABEL,
  DISCARD_REASON_LABEL,
  type DiscardedFinding,
  type Finding,
} from '@/lib/schemas/evidence';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useEvidence } from './evidence-context';
import { StanceMark } from './stance-mark';

/** True for anything that swallows arrow keys as text navigation. Without this
 *  the facet search box on `/sources` pages the drawer while you type. */
function isTextEntry(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable === true
  );
}

/**
 * The full evidence view — one instance in the app, driven entirely by
 * `EvidenceContext`. `Esc` and focus-trap/restore come from the `Drawer`
 * primitive's Radix Dialog; `←`/`→` walking the corpus is handled here since
 * Radix doesn't provide it.
 *
 * **Two body layouts, one drawer.** A verified finding leads with its claim; a
 * discarded excerpt leads with the reason it was thrown away — the trust claim
 * made visible. A `DiscardedFinding` has no `text` field and none is added
 * (C9): the excerpt never became a claim, and inventing one is exactly what
 * "nothing is invented to fill a field" forbids.
 *
 * The walk indexes into the **effective scope**, never into `evidence` (R13),
 * and prints where you are.
 */
export function EvidenceDrawer() {
  const { layer, openFinding, openDiscarded, position, close, next, prev, triggerRef } =
    useEvidence();
  const isOpen = layer.kind === 'finding' || layer.kind === 'discarded';

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (isTextEntry(event.target)) return;
      if (event.key === 'ArrowRight') next();
      if (event.key === 'ArrowLeft') prev();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, next, prev]);

  const citation = openFinding ? citationNumberForFindingId(openFinding.id) : null;
  const title =
    layer.kind === 'discarded'
      ? APP_EVIDENCE.drawerTitles.discarded
      : citation !== null
        ? APP_EVIDENCE.drawerTitles.verified(citation)
        : 'Evidence';

  const atStart = position !== null && position.index === 1;
  const atEnd = position !== null && position.index === position.total;

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
      title={title}
      footer={
        position && (
          <>
            <Button variant="bare" onClick={prev} disabled={atStart}>
              {APP_EVIDENCE.prev}
            </Button>
            <span className="ob-drawer-pos ob-meta">
              {position.index} of {position.total}
              {position.filtered && `${META_SEPARATOR}${APP_EVIDENCE.filteredSuffix}`}
            </span>
            <Button variant="bare" onClick={next} disabled={atEnd}>
              {APP_EVIDENCE.next}
            </Button>
          </>
        )
      }
    >
      {openFinding && <VerifiedBody finding={openFinding} />}
      {openDiscarded && <DiscardedBody record={openDiscarded} />}
    </Drawer>
  );
}

function SourceBlock({ url, date, children }: { url: string; date: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="ob-field-label">{APP_EVIDENCE.fieldLabels.source}</span>
      <a href={url} target="_blank" rel="noopener noreferrer" className="ob-finding-source-link">
        {formatDomain(url)}{' '}
        <span className="ob-arrow" aria-hidden="true">
          ↗
        </span>
      </a>
      <p className="ob-meta">
        {APP_EVIDENCE.published} {formatDate(date)}
      </p>
      {children}
    </div>
  );
}

/** The claim is the largest type in the drawer — it is the thing you opened it
 *  for. It used to be plain body text. */
function VerifiedBody({ finding }: { finding: Finding }) {
  return (
    <div className="flex flex-col gap-6">
      <MetaLine parts={[finding.id, 'VERIFIED', DIMENSION_LABEL[finding.dimension]]} />
      <p className="ob-h3">{finding.text}</p>
      {/* The drawer is a verification moment too. */}
      <div className="ob-verify-rule" data-drawn="true" aria-hidden="true" />

      <div className="flex flex-col gap-2">
        <span className="ob-field-label">{APP_EVIDENCE.fieldLabels.excerpt}</span>
        <blockquote className="ob-excerpt-panel">
          <p className="ob-excerpt">&ldquo;{finding.excerpt}&rdquo;</p>
        </blockquote>
        <p className="ob-meta">{APP_EVIDENCE.excerptCaption}</p>
      </div>

      <SourceBlock url={finding.source_url} date={finding.source_date}>
        <div className="flex items-center gap-3 pt-1">
          <span className="ob-field-label">{APP_EVIDENCE.fieldLabels.stance}</span>
          <StanceMark stance={finding.stance} />
        </div>
      </SourceBlock>

      <VerifiedBadge />
    </div>
  );
}

/**
 * No `VerifiedBadge`, no verify rule, **and no red anywhere** — it goes grey,
 * strikes through, drops six pixels, and stops mattering.
 *
 * The reason leads, rendered through `DISCARD_REASON_LABEL` and never the raw
 * enum key, which on screen would read `excerpt_not_found_on_page` and turn
 * D15's trust claim into a database dump. Sans, not mono — it is a sentence
 * with a verb — and never `--ob-discard`, which measures 2.25:1 and is
 * deliberately illegible.
 */
function DiscardedBody({ record }: { record: DiscardedFinding }) {
  return (
    <div className="flex flex-col gap-6">
      <MetaLine parts={[record.id, 'DISCARDED', DIMENSION_LABEL[record.dimension]]} />
      <p className="ob-discard-reason">{DISCARD_REASON_LABEL[record.discard_reason]}</p>

      <div className="flex flex-col gap-2">
        <span className="ob-field-label">{APP_EVIDENCE.fieldLabels.excerpt}</span>
        <blockquote className="ob-discard-panel">
          <p className="ob-discard-excerpt">&ldquo;{record.excerpt}&rdquo;</p>
        </blockquote>
      </div>

      <div className="flex flex-col gap-2">
        <span className="ob-field-label ob-meta">{APP_EVIDENCE.fieldLabels.attemptedQuery}</span>
        <p className="ob-discard-query">{record.attempted_query}</p>
      </div>

      <SourceBlock url={record.source_url} date={record.source_date} />

      <p className="ob-meta">{APP_EVIDENCE.notUsed}</p>
    </div>
  );
}
