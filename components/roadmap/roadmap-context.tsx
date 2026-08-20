'use client';

import { createContext, useContext, useRef, useState } from 'react';
import type { ReactNode } from 'react';

interface RoadmapContextValue {
  isExpanded: (questionId: string) => boolean;
  setQuestionOpen: (questionId: string, open: boolean) => void;
  isPulsing: (domId: string) => boolean;
  /** Expands the question, scrolls to its card, and pulses its ring once (600ms) — the forward half of the wiring. */
  scrollToQuestion: (questionId: string) => void;
  /** Scrolls to the roadmap step and pulses its timeline node once (600ms) — the reverse half. */
  scrollToStep: (phase: string) => void;
}

const RoadmapContext = createContext<RoadmapContextValue | null>(null);

/**
 * Logged 'use client' addition beyond the 13-name allowlist (standing rule
 * 3), following the `EvidenceContext`/`define-conversation.tsx` precedent —
 * the Open Questions and the Build Roadmap sections are sibling subtrees
 * with no parent/child relationship of their own, but the Dependency Chip
 * wiring (08's whole reason both halves are in one page) needs one shared
 * state: which question cards are expanded, and which single element is
 * mid-pulse right now.
 */
export function RoadmapProvider({
  defaultExpandedId,
  children,
}: {
  defaultExpandedId: string;
  children: ReactNode;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    [defaultExpandedId]: true,
  });
  const [pulseTarget, setPulseTarget] = useState<string | null>(null);
  const pulseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function setQuestionOpen(questionId: string, open: boolean) {
    setExpanded((prev) => ({ ...prev, [questionId]: open }));
  }

  function pulse(domId: string) {
    if (pulseTimer.current) clearTimeout(pulseTimer.current);
    setPulseTarget(domId);
    pulseTimer.current = setTimeout(() => setPulseTarget(null), 600);
  }

  function scrollToQuestion(questionId: string) {
    setQuestionOpen(questionId, true);
    document.getElementById(`question-${questionId}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    pulse(`question-${questionId}`);
  }

  function scrollToStep(phase: string) {
    document
      .getElementById(`step-${phase}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    pulse(`step-${phase}`);
  }

  return (
    <RoadmapContext.Provider
      value={{
        isExpanded: (questionId) => Boolean(expanded[questionId]),
        setQuestionOpen,
        isPulsing: (domId) => pulseTarget === domId,
        scrollToQuestion,
        scrollToStep,
      }}
    >
      {children}
    </RoadmapContext.Provider>
  );
}

export function useRoadmapNav(): RoadmapContextValue {
  const context = useContext(RoadmapContext);
  if (!context) throw new Error('useRoadmapNav must be used within a RoadmapProvider');
  return context;
}
