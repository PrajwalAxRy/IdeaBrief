import type { ReactNode } from 'react';

/**
 * The numbered overline: a chalk numeral, the label in `--ob-dim`, and the
 * `flex: 1` hairline `.ob-eyebrow::after` runs off to the right.
 *
 * **The brackets do not survive.** They were Deep Canopy's device for making a
 * mono label read as a machine token; Obsidian's device is the numeral plus the
 * trailing rule, and `[01] [WHAT WE FOUND]` reads as two tokens fighting each
 * other — the closing bracket also duplicates the terminator the hairline
 * already provides. After A2, nothing in running prose renders a `[` except
 * A5's `.ob-cite` (C12); `[03]` on an explorer row sits outside prose and stays
 * legal.
 *
 * The blue is gone too (rule 5): a section label is not an action, a
 * verification, or a live state.
 *
 * Renders a `<p>`, not a `<span>` — check call sites don't nest it in a
 * paragraph.
 */
export function SectionLabel({
  index,
  as: Tag = 'p',
  id,
  children,
  className = '',
}: {
  index?: string;
  /**
   * On a route with a separate headline the eyebrow is a `<p>` above an
   * `<h2>`. On the roadmap and the explorer there is no separate headline, so
   * **the eyebrow *is* the `<h2>`** (C17). Heading *size* is a class; heading
   * *level* is structure.
   */
  as?: 'p' | 'h2';
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Tag id={id} className={['ob-eyebrow', 'ob-meta', className].filter(Boolean).join(' ')}>
      {index ? <span className="ob-em">{index}</span> : null}
      <span>{children}</span>
    </Tag>
  );
}
