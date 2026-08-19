import { Plus, X } from 'lucide-react';
import { TextAction } from './text-action';

interface InlineEditableListProps {
  label: string;
  items: string[];
  onChangeItem: (index: number, value: string) => void;
  onRemoveItem: (index: number) => void;
  onAddItem: () => void;
  addLabel?: string;
  className?: string;
}

/** `InlineEditableField` for arrays — assumptions, alternatives. Controlled, no internal state. */
export function InlineEditableList({
  label,
  items,
  onChangeItem,
  onRemoveItem,
  onAddItem,
  addLabel = 'Add',
  className = '',
}: InlineEditableListProps) {
  return (
    <div className={['flex flex-col gap-2', className].filter(Boolean).join(' ')}>
      <span className="meta-line">{label}</span>
      {items.map((item, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: plain string[] has no stable id; index is the item's own identity here
        <div key={`${label}-${index}`} className="flex items-center gap-2">
          <input
            className="inline-editable flex-1"
            value={item}
            onChange={(event) => onChangeItem(index, event.target.value)}
          />
          <button
            type="button"
            aria-label={`Remove ${label} item ${index + 1}`}
            className="icon-btn"
            onClick={() => onRemoveItem(index)}
          >
            <X size={14} />
          </button>
        </div>
      ))}
      <TextAction onClick={onAddItem}>
        <Plus size={14} />
        {addLabel}
      </TextAction>
    </div>
  );
}
