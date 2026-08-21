/**
 * A one-click answer offered by the AI — sends its own text as a user turn.
 *
 * Four of the eleven turns carry chips, not one: the questions with a
 * genuinely enumerable answer space. **Four of eleven is a pattern; one of
 * eleven reads as a glitch** — and making every turn multiple-choice would
 * turn the conversation back into the form the product exists to delete.
 *
 * Reuses `.ob-seed` from the landing composer. A button, so the pill radius is
 * legal on it (rule 8).
 */
export function SuggestionChip({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <button type="button" className="ob-seed" onClick={onClick}>
      {text}
    </button>
  );
}
