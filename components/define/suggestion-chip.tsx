/** A one-click answer offered by the AI — sends its own text as a user turn. */
export function SuggestionChip({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <button type="button" className="suggestion-chip" onClick={onClick}>
      {text}
    </button>
  );
}
