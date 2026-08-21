import type { ReactNode } from 'react';

/**
 * The code-drawn product-surface container, promoted out of the landing page.
 *
 * It exists because standing rule 13 says a product surface is drawn in code,
 * never screenshotted, and `/`'s fragment cards are the drawn-UI grammar this
 * build inherits. Uses the `.ob-frag*` classes already defined in
 * styles/obsidian.css §11 — they are consumed here, never duplicated into
 * obsidian-app.css.
 *
 * **Honest about its consumers: today it has exactly one, the `/style-guide`
 * gallery.** No page phase's Build list names it. If nothing adopts it by A15,
 * it is dead code and A15's sweep deletes it along with its naming-contract
 * entry. That is an open item, not a promise.
 *
 * **The name collides with `React.Fragment`.** Import it as
 * `import { Fragment } from '@/components/ui/fragment'` and use `<>…</>` for
 * React fragments in the same file, always.
 */
export function Fragment({
  title,
  status,
  children,
  foot,
  className = '',
}: {
  title: string;
  status?: string;
  children: ReactNode;
  foot?: ReactNode;
  className?: string;
}) {
  return (
    <div className={['ob-frag', className].filter(Boolean).join(' ')}>
      <div className="ob-frag-bar">
        <span className="ob-meta ob-meta-bright">{title}</span>
        {status ? <span className="ob-meta">{status}</span> : null}
      </div>
      <div className="ob-frag-body">{children}</div>
      {foot ? <div className="ob-frag-foot ob-frag-body">{foot}</div> : null}
    </div>
  );
}

export function FragmentRow({
  label,
  children,
  className = '',
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={['ob-frag-row', className].filter(Boolean).join(' ')}>
      <span className="ob-frag-key ob-meta">{label}</span>
      {children}
    </div>
  );
}
