import { InlineEditableField } from '@/components/ui/inline-editable-field';
import { InlineEditableList } from '@/components/ui/inline-editable-list';
import { FieldSkeleton } from '@/components/ui/skeleton';
import type { FieldStatus } from '@/lib/schemas/brief';

interface BriefFieldProps {
  label: string;
  revealed: boolean;
  settling: boolean;
  status: FieldStatus;
  value: string | string[];
  edited: boolean;
  locked: boolean;
  isEditing: boolean;
  draftValue: string;
  onStartEdit: () => void;
  onChangeDraft: (value: string) => void;
  onCommit: () => void;
  onCancel: () => void;
  onChangeListItem: (index: number, value: string) => void;
  onRemoveListItem: (index: number) => void;
  onAddListItem: () => void;
}

/**
 * One Brief field: label, value, state. Delegates editing to
 * `InlineEditableField`/`InlineEditableList`. Renders the `→ open question`
 * tag for `unknown`.
 */
export function BriefField({
  label,
  revealed,
  settling,
  status,
  value,
  edited,
  locked,
  isEditing,
  draftValue,
  onStartEdit,
  onChangeDraft,
  onCommit,
  onCancel,
  onChangeListItem,
  onRemoveListItem,
  onAddListItem,
}: BriefFieldProps) {
  if (!revealed) {
    return <FieldSkeleton label={label} />;
  }

  const wrapperClass = ['flex flex-col gap-1', settling ? 'field-settle' : '']
    .filter(Boolean)
    .join(' ');

  if (status === 'unknown') {
    return (
      <div className={wrapperClass}>
        <span className="meta-line">{label}</span>
        <p>
          <span style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>unknown</span>{' '}
          <span className="unknown-tag">→ open question</span>
        </p>
      </div>
    );
  }

  if (Array.isArray(value)) {
    return (
      <div className={wrapperClass}>
        {locked ? (
          <>
            <span className="meta-line">{label}</span>
            <ul className="flex flex-col gap-1">
              {value.map((item) => (
                <li key={item} style={{ color: 'var(--text-primary)' }}>
                  {item}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <InlineEditableList
            label={label}
            items={value}
            onChangeItem={onChangeListItem}
            onRemoveItem={onRemoveListItem}
            onAddItem={onAddListItem}
          />
        )}
        {edited && <span className="edited-marker">edited</span>}
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      {locked ? (
        <>
          <span className="meta-line">{label}</span>
          <p style={{ color: 'var(--text-primary)' }}>{value}</p>
        </>
      ) : (
        <InlineEditableField
          label={label}
          value={isEditing ? draftValue : value}
          isEditing={isEditing}
          onStartEdit={onStartEdit}
          onChange={onChangeDraft}
          onCommit={onCommit}
          onCancel={onCancel}
        />
      )}
      {edited && <span className="edited-marker">edited</span>}
    </div>
  );
}
