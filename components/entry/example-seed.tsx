/**
 * A clickable idea seed that fills The Box without submitting. No own
 * `'use client'` — it's always rendered inside `TheBox`'s client subtree,
 * so a plain `onClick` prop works without a directive of its own.
 */
export function ExampleSeed({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <button type="button" className="text-action" onClick={onClick}>
      {text}
    </button>
  );
}
