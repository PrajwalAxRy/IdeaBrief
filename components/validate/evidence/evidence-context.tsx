'use client';

import { findingForCitation } from '@/lib/citations';
import { effectiveScope, positionOf, step as stepScope } from '@/lib/evidence-scope';
import type { DiscardedFinding, Finding } from '@/lib/schemas/evidence';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ReactNode, RefObject } from 'react';
import { EvidenceDrawer } from './evidence-drawer';

const HINT_STORAGE_KEY = 'sv.hint.citation';

/**
 * **Mutually exclusive by construction, not by two booleans.** A finding, a
 * discarded excerpt, and the explorer are three states of one slot, so two
 * stacked modals are unrepresentable rather than merely discouraged.
 */
export type EvidenceLayer =
  | { kind: 'none' }
  | { kind: 'finding'; id: string }
  | { kind: 'discarded'; id: string }
  | { kind: 'explorer' };

interface EvidenceContextValue {
  evidence: Finding[];
  discarded: DiscardedFinding[];
  layer: EvidenceLayer;
  /** The ordered id list `next`/`prev` walk. The 47 verified ids unless a surface narrows it. */
  scope: string[];
  /** A filtering surface publishes its visible, ordered ids here. `null` restores the corpus. */
  setScope: (ids: string[] | null) => void;
  openFinding: Finding | null;
  openDiscarded: DiscardedFinding | null;
  /** 1-based position within the effective scope. `null` when nothing is open. */
  position: { index: number; total: number; filtered: boolean } | null;
  open: (citation: number) => void;
  openById: (id: string) => void;
  close: () => void;
  next: () => void;
  prev: () => void;
  openExplorer: () => void;
  closeExplorer: () => void;
  findFinding: (citation: number) => Finding | undefined;
  /** Answers "have I already checked this one?" for this reading session.
   *  In memory only — no `localStorage`, no `sessionStorage`. */
  seenIds: ReadonlySet<string>;
  hintDismissed: boolean;
  dismissHint: () => void;
  /** Whatever was focused when the layer was opened — see `Drawer`'s `onCloseAutoFocus`. */
  triggerRef: RefObject<HTMLElement | null>;
}

const EvidenceContext = createContext<EvidenceContextValue | null>(null);

function openIdOf(layer: EvidenceLayer): string | null {
  return layer.kind === 'finding' || layer.kind === 'discarded' ? layer.id : null;
}

/**
 * The app's one global UI context — the full evidence corpus, the 18 discarded
 * records, which layer of the evidence system is open, the scope the walk is
 * confined to (R13), what has already been read this session, and the one-time
 * citation hover-hint dismissal. It renders the single `EvidenceDrawer`
 * instance itself, so any page under `/r/[slug]/*` gets drawer behaviour for
 * free just by being inside this provider.
 *
 * `'use client'` because it holds state — the boundary is here, at the leaf
 * that needs it, and the four page bodies above it stay server-rendered
 * (standing rule 22).
 */
export function EvidenceProvider({
  evidence,
  discarded,
  children,
}: {
  evidence: Finding[];
  discarded: DiscardedFinding[];
  children: ReactNode;
}) {
  const [layer, setLayer] = useState<EvidenceLayer>({ kind: 'none' });
  const [scopeIds, setScopeIds] = useState<string[] | null>(null);
  const [seenIds, setSeenIds] = useState<ReadonlySet<string>>(() => new Set<string>());
  const [hintDismissed, setHintDismissed] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(HINT_STORAGE_KEY)) setHintDismissed(true);
    } catch {
      // Storage disabled — the hint just shows every time, which is harmless.
    }
  }, []);

  const dismissHint = useCallback(() => {
    setHintDismissed(true);
    try {
      window.localStorage.setItem(HINT_STORAGE_KEY, '1');
    } catch {
      // Storage full or disabled — no-op, matching the recent-runs precedent.
    }
  }, []);

  const allIds = useMemo(() => evidence.map((finding) => finding.id), [evidence]);

  const findFinding = useCallback(
    (citation: number) => findingForCitation(evidence, citation),
    [evidence],
  );

  const rememberTrigger = useCallback(() => {
    triggerRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
  }, []);

  const markSeen = useCallback((id: string) => {
    setSeenIds((current) => (current.has(id) ? current : new Set(current).add(id)));
  }, []);

  /** The whole discard entry point. `DiscardRow` calls this and needs no
   *  second API — an id resolves against the verified corpus first and the
   *  discarded one second. */
  const openById = useCallback(
    (id: string) => {
      rememberTrigger();
      if (evidence.some((finding) => finding.id === id)) {
        setLayer({ kind: 'finding', id });
        markSeen(id);
        return;
      }
      if (discarded.some((record) => record.id === id)) {
        setLayer({ kind: 'discarded', id });
        markSeen(id);
        return;
      }
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`openById: "${id}" is in neither corpus`);
      }
    },
    [discarded, evidence, markSeen, rememberTrigger],
  );

  const open = useCallback(
    (citation: number) => {
      const finding = findFinding(citation);
      if (!finding) return;
      openById(finding.id);
    },
    [findFinding, openById],
  );

  const close = useCallback(() => setLayer({ kind: 'none' }), []);
  const openExplorer = useCallback(() => {
    rememberTrigger();
    setLayer({ kind: 'explorer' });
  }, [rememberTrigger]);
  const closeExplorer = useCallback(() => setLayer({ kind: 'none' }), []);
  const setScope = useCallback((ids: string[] | null) => setScopeIds(ids), []);

  const openId = openIdOf(layer);
  const scope = effectiveScope(scopeIds, allIds, openId);

  const openFinding =
    layer.kind === 'finding' ? (evidence.find((finding) => finding.id === layer.id) ?? null) : null;
  const openDiscarded =
    layer.kind === 'discarded'
      ? (discarded.find((record) => record.id === layer.id) ?? null)
      : null;

  const placed = openId === null ? null : positionOf(scope.ids, openId);
  const position = placed === null ? null : { ...placed, filtered: scope.filtered };

  /* `next`/`prev` index into the effective scope, never into `evidence`. */
  const walk = useCallback(
    (delta: 1 | -1) => {
      const current = openIdOf(layer);
      if (current === null) return;
      const target = stepScope(scope.ids, current, delta);
      if (target === null) return;
      openById(target);
    },
    [layer, openById, scope.ids],
  );

  const next = useCallback(() => walk(1), [walk]);
  const prev = useCallback(() => walk(-1), [walk]);

  const value = useMemo<EvidenceContextValue>(
    () => ({
      evidence,
      discarded,
      layer,
      scope: scope.ids,
      setScope,
      openFinding,
      openDiscarded,
      position,
      open,
      openById,
      close,
      next,
      prev,
      openExplorer,
      closeExplorer,
      findFinding,
      seenIds,
      hintDismissed,
      dismissHint,
      triggerRef,
    }),
    [
      evidence,
      discarded,
      layer,
      scope.ids,
      setScope,
      openFinding,
      openDiscarded,
      position,
      open,
      openById,
      close,
      next,
      prev,
      openExplorer,
      closeExplorer,
      findFinding,
      seenIds,
      hintDismissed,
      dismissHint,
    ],
  );

  return (
    <EvidenceContext.Provider value={value}>
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
