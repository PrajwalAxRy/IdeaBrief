'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

interface RoadmapContextValue {
  isExpanded: (questionId: string) => boolean;
  setQuestionOpen: (questionId: string, open: boolean) => void;
  isPulsing: (domId: string) => boolean;
  /** The first expanded question in document order — the one card allowed a
   *  primary button. Without it, three open cards put three
   *  `.ob-btn-primary`s on screen and break standing rule 11. */
  primaryQuestionId: string | null;
  /** Expands the question, scrolls to it, and pulses it once — the forward half. */
  scrollToQuestion: (questionId: string) => void;
  /** Scrolls to a build step and pulses it once — the reverse half. */
  scrollToStep: (phase: string) => void;
}

const RoadmapContext = createContext<RoadmapContextValue | null>(null);

const PULSE_MS = 600;

/**
 * One shared state for both halves of the page: which question cards are
 * expanded, and which single element is mid-pulse. The Open Questions and the
 * Build Roadmap sections are sibling subtrees with no parent/child
 * relationship, and the dependency wiring between them is the whole reason
 * they live on one page.
 */
export function RoadmapProvider({
  defaultExpandedId,
  /** Question ids in the order the page renders them — `primaryQuestionId`
   *  needs document order, and only the page knows it after the D10 sort. */
  order,
  children,
}: {
  defaultExpandedId: string;
  order: string[];
  children: ReactNode;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    [defaultExpandedId]: true,
  });
  const [pulseTarget, setPulseTarget] = useState<string | null>(null);
  const pulseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef(0);

  const setQuestionOpen = useCallback((questionId: string, open: boolean) => {
    setExpanded((prev) => ({ ...prev, [questionId]: open }));
  }, []);

  /**
   * **The pulse will not restart on a repeat click unless you make it.**
   * Setting the same `pulseTarget` again leaves the attribute unchanged, and a
   * CSS animation does not re-run on a write that leaves the selector
   * matching. Absent → present is what restarts it.
   */
  const pulse = useCallback((domId: string) => {
    if (pulseTimer.current) clearTimeout(pulseTimer.current);
    cancelAnimationFrame(rafRef.current);
    setPulseTarget(null);
    rafRef.current = requestAnimationFrame(() => {
      setPulseTarget(domId);
      pulseTimer.current = setTimeout(() => setPulseTarget(null), PULSE_MS);
    });
  }, []);

  const scrollTo = useCallback((domId: string) => {
    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(domId)?.scrollIntoView({
      behavior: reduced ? 'auto' : 'smooth',
      /* `center`, not `start`: the header and the section nav are both sticky
         now, and `start` parks the target underneath them. */
      block: 'center',
    });
  }, []);

  const scrollToQuestion = useCallback(
    (questionId: string) => {
      setQuestionOpen(questionId, true);
      scrollTo(`question-${questionId}`);
      pulse(`question-${questionId}`);
    },
    [pulse, scrollTo, setQuestionOpen],
  );

  const scrollToStep = useCallback(
    (phase: string) => {
      scrollTo(`step-${phase}`);
      pulse(`step-${phase}`);
    },
    [pulse, scrollTo],
  );

  const primaryQuestionId = useMemo(
    () => order.find((id) => expanded[id]) ?? null,
    [order, expanded],
  );

  const value = useMemo<RoadmapContextValue>(
    () => ({
      isExpanded: (questionId) => Boolean(expanded[questionId]),
      setQuestionOpen,
      isPulsing: (domId) => pulseTarget === domId,
      primaryQuestionId,
      scrollToQuestion,
      scrollToStep,
    }),
    [expanded, pulseTarget, primaryQuestionId, setQuestionOpen, scrollToQuestion, scrollToStep],
  );

  return <RoadmapContext.Provider value={value}>{children}</RoadmapContext.Provider>;
}

export function useRoadmapNav(): RoadmapContextValue {
  const context = useContext(RoadmapContext);
  if (!context) throw new Error('useRoadmapNav must be used within a RoadmapProvider');
  return context;
}
