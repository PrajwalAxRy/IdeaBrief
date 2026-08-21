import { ROADMAP } from '@/lib/content/app';

/**
 * The cut list — **inverted from what shipped before A12.**
 *
 * Items used to render `--text-muted` with `line-through`, which is exactly
 * backwards: the most valuable thing this section can do is tell you what not
 * to build yet, and a struck, dimmed line reads as a footnote. They now carry
 * full reading weight at `--ob-body` / `--ob-text`, with no `text-decoration`
 * and no opacity reduction.
 *
 * **Strike-through belongs to `--ob-discard` and to discarded evidence (C9),
 * nowhere else.** A cut is a decision; a discard is a failure. Drawing them the
 * same way says the wrong thing about both.
 *
 * Plain Server Component; nothing here is interactive.
 */
export function NotInItList({ items }: { items: string[] }) {
  return (
    <div className="ob-notinit">
      <p className="ob-meta">{ROADMAP.plan.notInIt}</p>
      <ul>
        {items.map((item) => (
          <li key={item} className="ob-notinit-item">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
