'use client';

import { Divider } from '@/components/ui/divider';
import { SectionLabel } from '@/components/ui/section-label';
import { formatClockTime } from '@/lib/format';
import { BRIEF_FIELD_KEYS, type Brief, type BriefFieldKey } from '@/lib/schemas/brief';
import { useEffect, useRef, useState } from 'react';
import { ApproveButton } from './approve-button';
import { BriefField } from './brief-field';

const FIELD_GROUPS: { key: BriefFieldKey; label: string }[][] = [
  [{ key: 'one_liner', label: 'One-liner' }],
  [
    { key: 'product', label: 'Product' },
    { key: 'customer', label: 'Customer' },
    { key: 'who_decides', label: 'Who decides' },
  ],
  [
    { key: 'problem', label: 'Problem' },
    { key: 'how_they_solve_it_today', label: 'How they solve it today' },
    { key: 'what_makes_this_different', label: 'What makes this different' },
  ],
  [
    { key: 'first_version_scope', label: 'First version scope' },
    { key: 'how_it_makes_money', label: 'How it makes money' },
    { key: 'how_customers_find_it', label: 'How customers find it' },
  ],
  [
    { key: 'assumptions', label: 'Assumptions' },
    { key: 'open_questions', label: 'Open questions' },
  ],
];

const SETTLE_MS = 600;

interface BriefPanelProps {
  brief: Brief;
  oneLinerOverride: string;
  revealedFields: Set<BriefFieldKey>;
  approved: boolean;
  approving: boolean;
  approvedAt: string | null;
  onApprove: () => void;
}

/**
 * The right rail on Define. Renders `brief_json` with per-field
 * pending/filled/unknown states, the unknown-count summary, and the Approve
 * action — the page's most important state transition (brief proposed).
 * Field-editing state (overrides, edited markers, which field is open) is
 * owned here, local to the panel, not lifted to `DefineConversation`.
 */
export function BriefPanel({
  brief,
  oneLinerOverride,
  revealedFields,
  approved,
  approving,
  approvedAt,
  onApprove,
}: BriefPanelProps) {
  const [overrides, setOverrides] = useState<Partial<Record<BriefFieldKey, string | string[]>>>({});
  const [editedKeys, setEditedKeys] = useState<Set<BriefFieldKey>>(new Set());
  const [editingKey, setEditingKey] = useState<BriefFieldKey | null>(null);
  const [draftValue, setDraftValue] = useState('');
  const [settlingKeys, setSettlingKeys] = useState<Set<BriefFieldKey>>(new Set());
  const prevRevealedRef = useRef<Set<BriefFieldKey>>(new Set());

  useEffect(() => {
    const prev = prevRevealedRef.current;
    const fresh = [...revealedFields].filter((key) => !prev.has(key));
    prevRevealedRef.current = new Set(revealedFields);
    if (fresh.length === 0) return;

    setSettlingKeys((current) => new Set([...current, ...fresh]));
    const timer = setTimeout(() => {
      setSettlingKeys((current) => {
        const next = new Set(current);
        for (const key of fresh) next.delete(key);
        return next;
      });
    }, SETTLE_MS);
    return () => clearTimeout(timer);
  }, [revealedFields]);

  function valueFor(key: BriefFieldKey): string | string[] {
    if (key === 'one_liner') return oneLinerOverride;
    return overrides[key] ?? brief[key].value;
  }

  function commitStringEdit(key: BriefFieldKey) {
    setOverrides((prev) => ({ ...prev, [key]: draftValue }));
    setEditedKeys((prev) => new Set(prev).add(key));
    setEditingKey(null);
  }

  function mutateList(key: BriefFieldKey, mutate: (items: string[]) => string[]) {
    setOverrides((prev) => {
      const current = (prev[key] as string[] | undefined) ?? (brief[key].value as string[]);
      return { ...prev, [key]: mutate(current) };
    });
    setEditedKeys((prev) => new Set(prev).add(key));
  }

  const revealedUnknownCount = BRIEF_FIELD_KEYS.filter(
    (key) => key !== 'one_liner' && revealedFields.has(key) && brief[key].status === 'unknown',
  ).length;
  const conversationStarted = revealedFields.size > 1;
  const briefProposed = BRIEF_FIELD_KEYS.every(
    (key) => key === 'one_liner' || revealedFields.has(key),
  );

  return (
    <div className="flex flex-col gap-6">
      <SectionLabel>Brief</SectionLabel>

      {approved && approvedAt && (
        <span className="meta-line">
          Approved {formatClockTime(approvedAt)} · locked while research runs
        </span>
      )}

      {FIELD_GROUPS.map((group, groupIndex) => (
        <div key={group[0].key} className="flex flex-col gap-6">
          {groupIndex > 0 && <Divider />}
          {group.map((field) => (
            <BriefField
              key={field.key}
              label={field.label}
              revealed={field.key === 'one_liner' || revealedFields.has(field.key)}
              settling={settlingKeys.has(field.key)}
              status={field.key === 'one_liner' ? 'filled' : brief[field.key].status}
              value={valueFor(field.key)}
              edited={editedKeys.has(field.key)}
              locked={approved}
              isEditing={editingKey === field.key}
              draftValue={draftValue}
              onStartEdit={() => {
                setEditingKey(field.key);
                setDraftValue(valueFor(field.key) as string);
              }}
              onChangeDraft={setDraftValue}
              onCommit={() => commitStringEdit(field.key)}
              onCancel={() => setEditingKey(null)}
              onChangeListItem={(index, value) =>
                mutateList(field.key, (items) =>
                  items.map((item, i) => (i === index ? value : item)),
                )
              }
              onRemoveListItem={(index) =>
                mutateList(field.key, (items) => items.filter((_, i) => i !== index))
              }
              onAddListItem={() => mutateList(field.key, (items) => [...items, ''])}
            />
          ))}
        </div>
      ))}

      {conversationStarted && (
        <>
          <Divider />
          <span className="meta-line">{revealedUnknownCount} unknown → open questions</span>
        </>
      )}

      {briefProposed && !approved && <ApproveButton pending={approving} onClick={onApprove} />}
    </div>
  );
}
