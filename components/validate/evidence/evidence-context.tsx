'use client';

import { findingForCitation } from '@/lib/citations';
import type { Finding } from '@/lib/schemas/evidence';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode, RefObject } from 'react';
import { EvidenceDrawer } from './evidence-drawer';

const HINT_STORAGE_KEY = 'sv.hint.citation';

interface EvidenceContextValue {
  evidence: Finding[];
  openFinding: Finding | null;
  open: (citation: number) => void;
  close: () => void;
  next: () => void;
  prev: () => void;
  findFinding: (citation: number) => Finding | undefined;
  hintDismissed: boolean;
  dismissHint: () => void;
  /** Whatever was focused when `open()` was called — see the note on `Drawer`'s `onCloseAutoFocus`. */
  triggerRef: RefObject<HTMLElement | null>;
}

const EvidenceContext = createContext<EvidenceContextValue | null>(null);

/**
 * The app's one global UI context (per the P6 spec) — holds the full evidence
 * corpus, which finding (if any) is open in the `EvidenceDrawer`, and the
 * one-time citation hover-hint dismissal. Renders the single `EvidenceDrawer`
 * instance itself, so any page under `/r/[slug]/*` gets drawer behaviour for
 * free just by being inside this provider (wired in the run layout).
 *
 * Logged beyond the 13-name `'use client'` allowlist (standing rule 3) — this
 * file itself must be a Client Component (it holds `useState`/`useContext`),
 * following the same precedent as `define-conversation.tsx` in P5.
 */
export function EvidenceProvider({
  evidence,
  children,
}: {
  evidence: Finding[];
  children: ReactNode;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [hintDismissed, setHintDismissed] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(HINT_STORAGE_KEY)) setHintDismissed(true);
    } catch {
      // Storage disabled — the hint just shows every time, which is harmless.
    }
  }, []);

  function dismissHint() {
    setHintDismissed(true);
    try {
      window.localStorage.setItem(HINT_STORAGE_KEY, '1');
    } catch {
      // Storage full or disabled — no-op, matching the recent-runs precedent.
    }
  }

  function findFinding(citation: number) {
    return findingForCitation(evidence, citation);
  }

  function open(citation: number) {
    const finding = findFinding(citation);
    if (!finding) return;
    triggerRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setOpenId(finding.id);
  }

  function close() {
    setOpenId(null);
  }

  function step(delta: 1 | -1) {
    const index = evidence.findIndex((finding) => finding.id === openId);
    const nextIndex = index + delta;
    if (index === -1 || nextIndex < 0 || nextIndex >= evidence.length) return;
    setOpenId(evidence[nextIndex].id);
  }

  const openFinding = evidence.find((finding) => finding.id === openId) ?? null;

  return (
    <EvidenceContext.Provider
      value={{
        evidence,
        openFinding,
        open,
        close,
        next: () => step(1),
        prev: () => step(-1),
        findFinding,
        hintDismissed,
        dismissHint,
        triggerRef,
      }}
    >
      {children}
      <EvidenceDrawer />
    </EvidenceContext.Provider>
  );
}

export function useEvidence(): EvidenceContextValue {
  const context = useContext(EvidenceContext);
  if (!context) throw new Error('useEvidence must be used within an EvidenceProvider');
  return context;
}
