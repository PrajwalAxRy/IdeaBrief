import '@/styles/trial2.css';
import type { Metadata } from 'next';

/**
 * `/trial2` is a light Audacious surface inside a dark Obsidian app.
 *
 * The stylesheet is imported here rather than added to `styles/globals.css`
 * for two reasons: it must not load on any Obsidian route, and /trial1 and
 * /trial3 are being built in parallel — three processes editing one shared
 * import list is a merge conflict waiting to happen.
 *
 * Every `--ad-*` token is declared on the `.ad-root` wrapper, never on `:root`.
 * Obsidian holds `:root` globally; a second `:root` block here would win by
 * source order and restyle the entire dark app with no error anywhere.
 */
export const metadata: Metadata = {
  title: 'Define — Trial 2',
  description: 'A working session: define the idea, then validate it, then plan it.',
};

export default function Trial2Layout({ children }: { children: React.ReactNode }) {
  return children;
}
