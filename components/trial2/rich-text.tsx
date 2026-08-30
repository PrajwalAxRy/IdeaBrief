/**
 * The only markup the transcript understands is `**bold**`, and it is resolved
 * here into typed elements.
 *
 * This exists so that nothing on the page ever hands model text to a markdown
 * parser. `react-markdown` is deliberately not installed; a renderer that
 * accepts arbitrary markup is a renderer that will eventually accept a link, an
 * image or a raw HTML block from a source nobody controls.
 */
export function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);

  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          // biome-ignore lint/suspicious/noArrayIndexKey: split fragments have no stable id and never reorder
          <strong key={i}>{part.slice(2, -2)}</strong>
        ) : (
          // biome-ignore lint/suspicious/noArrayIndexKey: same
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}
