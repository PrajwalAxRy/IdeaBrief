import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trial 3 — workspace',
  description:
    'A three-column concept for the Define stage: previous chats, the conversation, and a live summary of everything said so far.',
};

/**
 * The Audacity scope boundary.
 *
 * **`data-theme="audacity"` is what makes this route legal.** Obsidian holds
 * the global `:root` in `styles/tokens.css` with no theme attribute anywhere,
 * so a second `:root` block would win on source order and restyle the whole
 * dark app. Every `--au-*` token is declared on this attribute instead, and
 * the two systems must never meet in one subtree — an Obsidian recipe rendered
 * inside this wrapper would resolve its own tokens perfectly happily and paint
 * near-black text on near-black paper with no error at all.
 *
 * That is also why this route deliberately does **not** use `(site)`'s shell.
 * `SiteNav` and `SiteFooter` are `--ob-*` components; wrapping them around a
 * light workspace is exactly the mixture above. `/trial3` carries its own bar.
 *
 * The backdrop and the tooth are fixed, so they sit here rather than in the
 * page: one per page, never per-section. `au-layer` on the workspace is what
 * keeps the content above them — a fixed positioned element paints above every
 * static in-flow element, and the app's own run pages currently have that bug.
 */
export default function Trial3Layout({ children }: { children: React.ReactNode }) {
  return (
    <div data-theme="audacity">
      <div className="au-backdrop" aria-hidden="true" />
      <div className="au-tooth" aria-hidden="true" />
      {children}
    </div>
  );
}
