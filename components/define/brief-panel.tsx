'use client';

import { BRIEF } from '@/lib/content/app';
import type { Brief, BriefFieldKey } from '@/lib/schemas/brief';
import { useEffect, useRef, useState } from 'react';
import { BriefField, type BriefFieldState } from './brief-field';

/** Asserted equal to `--ob-enter`: the settle rule and the verification rule
 *  draw over the same duration, because they are the same device. */
const SETTLE_MS = 900;

interface BriefPanelProps {
  brief: Brief;
  revealed: BriefFieldKey[];
  unknown: BriefFieldKey[];
  edited: BriefFieldKey[];
  approved: boolean;
  onEdit: (key: BriefFieldKey, value: string | string[]) => void;
}

/**
 * The right rail on Define — the brief as live client state layered over the
 * fixture (D10).
 *
 * **There is no `oneLinerOverride`.** `one_liner` is an ordinary field, read
 * through the same resolver as every other one; the special case *was* R6, and
 * deleting it is the fix rather than patching the symptom.
 *
 * The lock is `[data-approved='true']` on `.ob-brief`, which removes every
 * edit affordance and makes each row a plain `<div>` again.
 */
export function BriefPanel({
  brief,
  revealed,
  unknown,
  edited,
  approved,
  onEdit,
}: BriefPanelProps) {
  const [settling, setSettling] = useState<Set<BriefFieldKey>>(() => new Set());
  const seenRef = useRef<Set<BriefFieldKey>>(new Set());

  useEffect(() => {
    const fresh = revealed.filter((key) => !seenRef.current.has(key));
    for (const key of revealed) seenRef.current.add(key);
    if (fresh.length === 0) return;

    setSettling((current) => new Set([...current, ...fresh]));
    const timer = setTimeout(() => {
      setSettling((current) => {
        const next = new Set(current);
        for (const key of fresh) next.delete(key);
        return next;
      });
    }, SETTLE_MS);
    return () => clearTimeout(timer);
  }, [revealed]);

  function stateFor(key: BriefFieldKey): BriefFieldState {
    if (!revealed.includes(key)) return 'waiting';
    if (unknown.includes(key)) return 'unknown';
    return settling.has(key) ? 'settling' : 'filled';
  }

  return (
    <div className="ob-brief" data-approved={approved || undefined}>
      {BRIEF.fieldGroups.map((group) => (
        <div key={group[0]} className="ob-brief-group">
          {group.map((key) => (
            <BriefField
              key={key}
              fieldKey={key as BriefFieldKey}
              state={stateFor(key as BriefFieldKey)}
              value={brief[key as BriefFieldKey].value}
              edited={edited.includes(key as BriefFieldKey)}
              locked={approved}
              onEdit={(value) => onEdit(key as BriefFieldKey, value)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
