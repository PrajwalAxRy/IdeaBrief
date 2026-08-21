import { Pencil } from 'lucide-react';
import type { KeyboardEvent } from 'react';

interface InlineEditableFieldProps {
  label: string;
  value: string;
  isEditing: boolean;
  placeholder?: string;
  onStartEdit: () => void;
  onChange: (value: string) => void;
  onCommit: () => void;
  onCancel: () => void;
  className?: string;
}

/**
 * Fully controlled — no internal state — so it stays out of the 13-component
 * 'use client' budget. The parent (e.g. BriefField) owns `isEditing` and the
 * draft value. Powers every Brief Panel field.
 */
export function InlineEditableField({
  label,
  value,
  isEditing,
  placeholder,
  onStartEdit,
  onChange,
  onCommit,
  onCancel,
  className = '',
}: InlineEditableFieldProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      onCommit();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      onCancel();
    }
  }

  return (
    <div className={['flex flex-col gap-1', className].filter(Boolean).join(' ')}>
      <span className="ob-meta">{label}</span>
      {isEditing ? (
        <input
          // biome-ignore lint/a11y/noAutofocus: opening the field is the user's own click action
          autoFocus
          className="ob-inline-input"
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onCommit}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <button type="button" className="ob-inline" onClick={onStartEdit}>
          <span>{value || placeholder}</span>
          <Pencil size={14} className="ob-inline-glyph" />
        </button>
      )}
    </div>
  );
}
