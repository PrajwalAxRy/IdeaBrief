'use client';

import {
  type BriefPatch,
  answeredCount,
  briefReducer,
  coreFilled,
  emptyBriefPatch,
  readBriefPatch,
  resolveBrief,
  unknownKeys,
  writeBriefPatch,
} from '@/lib/brief-state';
import { BRIEF_FIELD_KEYS, type Brief, type BriefFieldKey } from '@/lib/schemas/brief';
import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';

export interface BriefState {
  /** Resolved — still passes `BriefSchema`. */
  brief: Brief;
  revealed: BriefFieldKey[];
  unknown: BriefFieldKey[];
  /** Which keys the user retyped — the `EDITED` marker's only source. */
  edited: BriefFieldKey[];
  answered: number;
  unanswered: number;
  coreFilled: boolean;
  approvedAt: string | null;
  reveal: (key: BriefFieldKey) => void;
  markUnknown: (key: BriefFieldKey) => void;
  edit: (key: BriefFieldKey, value: string | string[]) => void;
  approve: (at: string) => void;
}

/**
 * The client layer over the server's brief (D10).
 *
 * A thin `useReducer` over `briefReducer` plus two effects: hydrate on mount,
 * persist on change. **`lib/brief-state.ts` is not this hook's to change** —
 * it ships complete to C4's signature, and everything here is composition.
 *
 * **R8 — nothing reads storage during render.** The reducer's initial state is
 * `emptyBriefPatch()`, derived from nothing but the server brief, and
 * `readBriefPatch` runs in a mount effect that dispatches `hydrate`. So the
 * server HTML and the first client render are identical.
 *
 * **R6 — `one_liner` is an ordinary field.** It is seeded during hydration
 * through the same `edit` path as any other field. The special case was the
 * bug; there is no special case left to get wrong.
 */
export function useBriefState(
  slug: string,
  brief: Brief,
  seedOneLiner?: () => string | null,
): BriefState {
  const [patch, dispatch] = useReducer(briefReducer, undefined, emptyBriefPatch);
  const hydratedRef = useRef(false);
  const seedRef = useRef(seedOneLiner);
  seedRef.current = seedOneLiner;

  useEffect(() => {
    const stored = readBriefPatch(slug);
    if (stored) {
      dispatch({ type: 'hydrate', patch: stored });
      hydratedRef.current = true;
      return;
    }

    /* **One dispatch, not three.** The seed is folded into the hydrate payload
       rather than applied as separate actions, because the persist effect runs
       in the *same commit* as this one: with three dispatches the first thing
       written to storage was the pristine patch, and the next mount then
       hydrated `revealed: []` back over the seed and `one_liner` was never
       seeded again. */
    const seeded = seedRef.current?.() ?? brief.one_liner.value;
    let next = briefReducer(emptyBriefPatch(), { type: 'reveal', key: 'one_liner' });
    if (seeded !== brief.one_liner.value) {
      next = briefReducer(next, { type: 'edit', key: 'one_liner', value: seeded });
    }
    dispatch({ type: 'hydrate', patch: next });
    hydratedRef.current = true;
  }, [slug, brief.one_liner.value]);

  /** A pristine patch carries no information, so writing one is not a no-op —
   *  it is a claim that this browser has been here, which `useRunProgress`
   *  reads as `briefTouched`. */
  const pristine =
    patch.revealed.length === 0 &&
    patch.unknown.length === 0 &&
    patch.edited.length === 0 &&
    Object.keys(patch.values).length === 0 &&
    patch.approvedAt === null;

  useEffect(() => {
    if (!hydratedRef.current || pristine) return;
    writeBriefPatch(slug, patch as BriefPatch);
  }, [slug, patch, pristine]);

  const resolved = useMemo(() => resolveBrief(brief, patch), [brief, patch]);
  const unknown = useMemo(() => unknownKeys(brief, patch), [brief, patch]);

  /**
   * **"Unanswered" is the union of what is marked unknown and what the
   * conversation has not yet reached.** `unansweredCount` in `lib/brief-state.ts`
   * counts only the first half, which on this fixture is a constant 3 from the
   * first paint — a `ConsequenceLine` that never moves while you talk, which
   * is the opposite of what D12 asks the line to do. The union is computed
   * here, in the hook A7 owns, rather than by changing a module A7 is
   * explicitly told not to re-sign.
   */
  const unanswered = useMemo(() => {
    const set = new Set<BriefFieldKey>(unknown);
    for (const key of BRIEF_FIELD_KEYS) {
      if (!patch.revealed.includes(key)) set.add(key);
    }
    return set.size;
  }, [patch.revealed, unknown]);

  const reveal = useCallback((key: BriefFieldKey) => dispatch({ type: 'reveal', key }), []);
  const markUnknown = useCallback(
    (key: BriefFieldKey) => dispatch({ type: 'markUnknown', key }),
    [],
  );
  const edit = useCallback(
    (key: BriefFieldKey, value: string | string[]) => dispatch({ type: 'edit', key, value }),
    [],
  );
  const approve = useCallback((at: string) => dispatch({ type: 'approve', at }), []);

  return {
    brief: resolved,
    revealed: patch.revealed,
    unknown,
    edited: patch.edited,
    answered: answeredCount(brief, patch),
    unanswered,
    coreFilled: coreFilled(brief, patch),
    approvedAt: patch.approvedAt,
    reveal,
    markUnknown,
    edit,
    approve,
  };
}
