'use client';

import { BRIEF } from '@/lib/content/app';
import { type BriefFieldKey, isBriefListField } from '@/lib/schemas/brief';
import { Pencil } from 'lucide-react';
import type { Ref } from 'react';
import { useEffect, useRef, useState } from 'react';

export type BriefFieldState = 'waiting' | 'settling' | 'filled' | 'unknown';

interface BriefFieldProps {
  fieldKey: BriefFieldKey;
  state: BriefFieldState;
  value: string | string[];
  edited: boolean;
  locked: boolean;
  onEdit: (value: string | string[]) => void;
}

/**
 * One brief field. **Six props, not sixteen** — the panel no longer threads a
 * draft value, an editing flag and five list mutators through every row; the
 * editor is local and commits once.
 *
 * **One editing model.** String fields used to need a click with Enter/Esc/blur
 * commit while list items were always-live inputs with no commit key at all. A
 * list is now edited *as a whole*, one item per line: `Enter` makes a new item
 * and `⌘/Ctrl+Enter` commits, `Esc` cancels, blur commits. Locked list
 * rendering keys on index, which kills the duplicate-`key` collision two
 * identical strings used to cause.
 *
 * **`waiting` has no shimmer.** Eleven simultaneous shimmer bars read as a
 * stalled fetch; eleven quiet ruled lines read as an outline of what is coming.
 * Shimmer on Define now means one thing only — pending-because-loading — and it
 * lives in `loading.tsx`.
 *
 * `onBlur` commits, which is correct for a click-away and is now safe because
 * nothing yanks focus mid-edit (R7).
 */
export function BriefField({ fieldKey, state, value, edited, locked, onEdit }: BriefFieldProps) {
  const label = BRIEF.fieldLabels[fieldKey];
  const isList = isBriefListField(fieldKey);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const items = Array.isArray(value) ? value : [value];
  const editable = !locked && state !== 'waiting';

  function startEdit() {
    if (!editable) return;
    setDraft(state === 'unknown' ? '' : items.join('\n'));
    setEditing(true);
  }

  function commit() {
    setEditing(false);
    if (isList) {
      const next = draft
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
      if (next.length > 0) onEdit(next);
      return;
    }
    const trimmed = draft.trim();
    if (trimmed) onEdit(trimmed);
  }

  const readout =
    state === 'unknown'
      ? `${label}: unknown, will become an open question.`
      : `${label}: ${items.join('. ')}. ${BRIEF.editHint}.`;

  return (
    <div className="ob-brief-field" data-state={state} data-edited={edited || undefined}>
      <p className="ob-brief-label">
        {label}
        {edited && <span className="ob-tag-edited">{BRIEF.editedTag}</span>}
      </p>

      {/* Not yet determined: a quiet ruled line where the value will be. */}
      {state === 'waiting' && <div className="ob-brief-rule" aria-hidden="true" />}

      {state !== 'waiting' &&
        (editing ? (
          isList ? (
            <textarea
              ref={inputRef as Ref<HTMLTextAreaElement>}
              className="ob-brief-editor"
              rows={Math.max(3, items.length + 1)}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onBlur={commit}
              onKeyDown={(event) => {
                if (event.key === 'Escape') setEditing(false);
                if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
                  event.preventDefault();
                  commit();
                }
              }}
              aria-label={`${label}. ${BRIEF.listHint}`}
            />
          ) : (
            <input
              ref={inputRef as Ref<HTMLInputElement>}
              className="ob-brief-editor"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onBlur={commit}
              onKeyDown={(event) => {
                if (event.key === 'Escape') setEditing(false);
                if (event.key === 'Enter') {
                  event.preventDefault();
                  commit();
                }
              }}
              aria-label={label}
            />
          )
        ) : editable ? (
          /* Locked, the row is a plain <div> again: a disabled control the user
             can still tab to on a locked panel is noise. */
          <button
            type="button"
            className="ob-brief-value ob-brief-edit"
            onClick={startEdit}
            aria-label={readout}
          >
            <span className="ob-brief-lines">{renderValue(state, items)}</span>
            <Pencil size={13} className="ob-brief-pencil" aria-hidden="true" />
          </button>
        ) : (
          <div className="ob-brief-value">{renderValue(state, items)}</div>
        ))}

      {/* Draws itself from the left as the field settles. `--ob-hairline-strong`,
          not accent: a field being filled in is not a primary action, not a
          verification and not a live state — it fails all three of blue's jobs. */}
      {state === 'settling' && (
        <div className="ob-brief-rule" data-drawn="true" aria-hidden="true" />
      )}
    </div>
  );
}

function renderValue(state: BriefFieldState, items: string[]) {
  if (state === 'unknown') {
    return (
      <>
        <span className="ob-brief-unknown">{BRIEF.unknownWord}</span>{' '}
        <span className="ob-tag-open">{BRIEF.openQuestionTag}</span>
      </>
    );
  }
  return items.map((item, index) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: two identical list items are legal content; index is the stable identity here
    <span className="ob-brief-line" key={index}>
      {item}
    </span>
  ));
}
